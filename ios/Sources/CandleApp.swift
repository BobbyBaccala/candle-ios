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
    var body: some View {
        NavigationStack {
            List {
                Section { Text("\(learning.progress.xp) XP · \(learning.progress.streak) day streak · \(membership.active ? "Unlimited" : String(learning.progress.energy)) energy") }
                ForEach(Array(Set(learning.lessons.map(\.subject))).sorted(), id: \.self) { subject in
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
                            Button(index == lesson.questions.count - 1 ? "Finish lesson" : "Next question") {
                                if index == lesson.questions.count - 1 { learning.finish(lesson, perfect: mistakes == 0); finished = true }
                                else { index += 1; selected = nil; revealed = false }
                            }.buttonStyle(.borderedProminent)
                        } else {
                            Button("Check answer") { guard selected != nil else { return }; if selected != question.correct { mistakes += 1 }; revealed = true }.buttonStyle(.borderedProminent).disabled(selected == nil)
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
                        Button("\(product.displayName) · \(product.displayPrice)") { Task { await membership.purchase(product) } }.disabled(membership.busy)
                    }
                    Button("Restore Purchases") { Task { await membership.restore() } }.disabled(membership.busy)
                    Button("Manage Subscriptions") { if let url = URL(string: "https://apps.apple.com/account/subscriptions") { UIApplication.shared.open(url) } }
                    if let message = membership.message { Text(message).font(.caption) }
                }
                Section("Sources") {
                    Text("Source-informed practice, including contextual variants. No institutional endorsement. Financial education, not personalized advice.")
                    ForEach(uniqueSources) { source in
                        if let url = URL(string: source.url), url.scheme == "https" { Link(source.title, destination: url) }
                    }
                }
                Section("Native beta") { Text("Offline learning preview. Browser progress, friends, avatars, leagues and arcade are not synchronized with this separate native beta. Purchases are disabled until App Store products and required legal pages are configured.") }
            }.navigationTitle("Settings").toolbar { Button("Done") { dismiss() } }
        }
    }
    private var uniqueSources: [SourceReference] {
        var seen = Set<String>()
        return learning.lessons.flatMap(\.questions).flatMap(\.sources).filter { seen.insert($0.id).inserted }.sorted { $0.title < $1.title }
    }
}
