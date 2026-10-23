import SwiftUI
import StoreKit

@main
struct CandleApp: App {
    @StateObject private var learning = LearningStore()
    @StateObject private var membership = MembershipStore()
    @Environment(\.scenePhase) private var phase
    var body: some Scene {
        WindowGroup {
            NativeLibrary().environmentObject(learning).environmentObject(membership)
                .task { await learning.reconcile(); await membership.load() }
                .onChange(of: phase) { _, value in if value == .active { Task { await learning.reconcile(); await membership.refresh() } } }
                .onReceive(NotificationCenter.default.publisher(for: .NSSystemTimeZoneDidChange)) { _ in Task { await learning.reconcile() } }
        }
    }
}
struct NativeLibrary: View {
    @EnvironmentObject var learning: LearningStore
    @EnvironmentObject var membership: MembershipStore
    @State private var query = ""
    @State private var activeLesson: LearningLesson?
    @State private var settings = false
    @AppStorage("native.goal") private var goal = "everyday"
    private var orderedSubjects: [String] {
        let preferred = ["everyday":"Personal Finance", "investing":"Long-Term Investing", "work":"Corporate Finance"][goal]
        return Array(Set(learning.lessons.map(\.subject))).sorted { a, b in
            if a == preferred { return true }; if b == preferred { return false }; return a < b
        }
    }
    var body: some View {
        NavigationStack {
            List {
                Section { Text("\(learning.progress.xp) XP · \(learning.progress.streak) day streak · \(membership.active ? "Unlimited" : String(learning.progress.energy)) energy") }
                Section("Daily sparks") {
                    let habits = learning.progress.habits ?? NativeHabits()
                    Text("\(habits.days[NativeHabits.day()]?.count ?? 0) / 3 different lessons today · \(habits.sparks) sparks")
                    Text("One lesson earns a spark. Three earn two more. Sparks collect device-only badges and have no cash value.").font(.caption)
                    Text(habits.sparks >= 30 ? "🏅 Consistent curiosity" : habits.sparks >= 7 ? "✨ A week of sparks" : habits.sparks > 0 ? "🕯 First spark" : "Your first spark is waiting")
                    Text("\(habits.remembered) skills remembered after a day · \(habits.needsReview) ready to revisit").font(.caption)
                    Picker("Your starting point", selection: $goal) {
                        Text("Everyday money").tag("everyday"); Text("Investing").tag("investing"); Text("Work & business").tag("work"); Text("Stay sharp").tag("sharp")
                    }
                    if goal == "sharp" { Button("Start a refresher") {
                        let id = habits.suggestedLesson
                        if let lesson = learning.lessons.first(where: { $0.id == id }) ?? learning.lessons.first(where: { !learning.progress.completed.contains($0.id) }) ?? learning.lessons.first, learning.begin(plus: membership.active) { activeLesson = lesson }
                    } }
                }
                ForEach(orderedSubjects, id: \.self) { subject in
                    Section(subject) {
                        ForEach(learning.lessons.filter { $0.subject == subject && (query.isEmpty || $0.title.localizedCaseInsensitiveContains(query)) }) { lesson in
                            Button { if learning.begin(plus: membership.active) { activeLesson = lesson } } label: {
                                VStack(alignment: .leading, spacing: 5) {
                                    Text(lesson.title).foregroundStyle(.primary)
                                    Text("\(lesson.questions.count) questions" + (learning.progress.completed.contains(lesson.id) ? " · Completed" : "")).font(.caption).foregroundStyle(.secondary)
                                }.padding(.vertical, 4)
                            }
                        }
                    }
                }
            }
            .navigationTitle("Candle")
            .searchable(text: $query, prompt: "Find any finance lesson")
            .toolbar { Button("Settings", systemImage: "gearshape") { settings = true } }
            .sheet(item: $activeLesson) { LessonSession(lesson: $0).environmentObject(learning) }
            .sheet(isPresented: $settings) { NativeSettings().environmentObject(learning).environmentObject(membership) }
            .alert("Candle", isPresented: Binding(get: { learning.errorMessage != nil }, set: { if !$0 { learning.errorMessage = nil } })) { Button("OK") { learning.errorMessage = nil } } message: { Text(learning.errorMessage ?? "") }
        }.tint(Color(red: 0.08, green: 0.36, blue: 0.27))
    }
}
struct LessonSession: View {
    let lesson: LearningLesson
    @EnvironmentObject var learning: LearningStore
    @Environment(\.dismiss) private var dismiss
    @State private var index = 0
    @State private var selected: Int?
    @State private var revealed = false
    @State private var mistakes = 0
    @State private var finished = false
    @State private var confidence = "none"
    @State private var reported = false
    var body: some View {
        NavigationStack {
            ScrollView {
                VStack(alignment: .leading, spacing: 20) {
                    if finished {
                        Text("Lesson complete").font(.largeTitle.bold())
                        Text("\(lesson.questions.count - mistakes) / \(lesson.questions.count) correct")
                        Text("Your progress is saved. Choose any topic when you return.")
                        Button("Back to library") { dismiss() }.buttonStyle(.borderedProminent)
                    } else {
                        let question = lesson.questions[index]
                        ProgressView(value: Double(index), total: Double(lesson.questions.count)).accessibilityLabel("Question \(index + 1) of \(lesson.questions.count)")
                        Text(lesson.title).font(.title2.bold())
                        DisclosureGroup("Learning goal") { Text(lesson.objective) }
                        Text(question.prompt).font(.title3)
                        if !revealed {
                            Picker("How sure are you? Optional and private", selection: $confidence) {
                                Text("Skip").tag("none"); Text("Guessing").tag("guess"); Text("Fairly sure").tag("fair"); Text("Very sure").tag("sure")
                            }
                        }
                        ForEach(question.options.indices, id: \.self) { option in
                            Button { selected = option } label: {
                                HStack { Image(systemName: selected == option ? "checkmark.circle.fill" : "circle"); Text(question.options[option]); Spacer() }.frame(minHeight: 44)
                            }.buttonStyle(.bordered).disabled(revealed)
                                .accessibilityAddTraits(selected == option ? .isSelected : [])
                        }
                        if revealed {
                            Text(selected == question.correct ? "Correct" : "Review the reasoning").font(.headline)
                            Text(question.options[question.correct]).bold()
                            Text(question.explanation)
                            DisclosureGroup("Sources and answer standards") {
                                Text("Use the facts and assumptions in the question. Independent educator review is pending.")
                                ForEach(question.sources) { source in if let url = URL(string: source.url), url.scheme == "https" { Link(source.title, destination: url) } }
                            }
                            Button("This seems ambiguous") { learning.reportQuestion(question); reported = true }
                            if reported { Text("Saved on this device. Share your reports from Settings; nothing has been sent.").font(.caption) }

                            Button(index == lesson.questions.count - 1 ? "Finish lesson" : "Next question") {
                                if index == lesson.questions.count - 1 { learning.finish(lesson, perfect: mistakes == 0); finished = true }
                                else { index += 1; selected = nil; revealed = false; confidence = "none"; reported = false }
                            }.buttonStyle(.borderedProminent)
                        } else {
                            Button("Check answer") { guard selected != nil else { return }; if selected != question.correct { mistakes += 1 }; learning.recordAnswer(question, correct: selected == question.correct, confidence: confidence == "none" ? nil : confidence, lessonID: lesson.id); revealed = true }.buttonStyle(.borderedProminent).disabled(selected == nil)
                        }
                    }
                }.padding()
            }.navigationTitle("Learn").navigationBarTitleDisplayMode(.inline)
                .toolbar { Button("Close") { dismiss() } }
        }
    }
}
struct NativeSettings: View {
    @EnvironmentObject var learning: LearningStore
    @EnvironmentObject var membership: MembershipStore
    @Environment(\.dismiss) private var dismiss
    var body: some View {
        NavigationStack {
            Form {
                Section("Evening reminder") {
                    Toggle("Remind me near 8 pm", isOn: Binding(get: { learning.progress.reminders }, set: { value in Task { await learning.setReminders(value) } }))
                    Text("On the day your streak would expire. iPhone permission and Focus settings affect delivery.").font(.caption)
                }
                Section("Candle+") {
                    Text("Unlimited lesson energy while your subscription is active.")
                    ForEach(membership.products, id: \.id) { product in
                        VStack(alignment: .leading) {
                            Text(product.displayName).font(.headline)
                            Text(product.description)
                            if let period = product.subscription?.subscriptionPeriod { Text("\(product.displayPrice) / \(subscriptionPeriodText(period))") }
                            Button("Subscribe · \(product.displayPrice)") { Task { await membership.purchase(product) } }.disabled(membership.busy)
                        }
                    }
                    Button("Restore Purchases") { Task { await membership.restore() } }.disabled(membership.busy)
                    Button("Manage Subscriptions") { if let url = URL(string: "https://apps.apple.com/account/subscriptions") { UIApplication.shared.open(url) } }
                    if let message = membership.message { Text(message).font(.caption) }
                    if !membership.products.isEmpty { Text("Auto-renews unless canceled in your App Store subscription settings. Payment is charged to your Apple account. Manage or cancel your plan in Manage Subscriptions.").font(.caption) }
                    ForEach(legalLinks, id: \.0) { title, url in Link(title, destination: url) }
                }
                Section("Sources") {
                    Text("Source-informed practice, including contextual variants. No institutional endorsement. Financial education, not personalized advice.")
                    ForEach(uniqueSources) { source in
                        if let url = URL(string: source.url), url.scheme == "https" { Link(source.title, destination: url) }
                    }
                }
                Section("Learning insights") {
                    let habits = learning.progress.habits ?? NativeHabits()
                    Text("\(habits.evidence.count) skills practiced · \(habits.remembered) remembered after a day")
                    Text("Confidence stays private and does not change energy or XP. These are learning signals, not professional qualifications.").font(.caption)
                    ShareLink("Share saved question reports", item: reportsJSON)
                }
                Section("Native beta") { Text("Offline learning preview. Browser progress, friends, avatars, leagues and arcade are not synchronized with this separate native beta. Purchases are disabled until App Store products and required legal pages are configured.") }
            }.navigationTitle("Settings").toolbar { Button("Done") { dismiss() } }
        }
    }
    private var reportsJSON: String {
        String(data: (try? JSONEncoder().encode(learning.progress.habits?.reports ?? [:])) ?? Data(), encoding: .utf8) ?? "{}"
    }
    private var legalLinks: [(String, URL)] {
        let c = CandleConfiguration.bundled
        return [("Privacy policy", c.privacyURL), ("Terms of use", c.termsURL), ("Support", c.supportURL)].compactMap { title, raw in c.link(raw).map { (title, $0) } }
    }
    private var uniqueSources: [SourceReference] {
        var seen = Set<String>()
        return learning.lessons.flatMap(\.questions).flatMap(\.sources).filter { seen.insert($0.id).inserted }.sorted { $0.title < $1.title }
    }
}

private func subscriptionPeriodText(_ period: Product.SubscriptionPeriod) -> String {
    let unit: String
    switch period.unit {
    case .day: unit = "day"
    case .week: unit = "week"
    case .month: unit = "month"
    case .year: unit = "year"
    @unknown default: return "billing period"
    }
    return "\(period.value) \(unit)" + (period.value == 1 ? "" : "s")
}
