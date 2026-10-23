import Foundation
import Combine

struct SourceReference: Codable, Identifiable { let id: String; let title: String; let url: String }
struct LearningQuestion: Codable, Identifiable {
    let id: String; let skill: String; let prompt: String; let options: [String]; let correct: Int
    let explanation: String; let sources: [SourceReference]
}
struct LearningLesson: Codable, Identifiable {
    let id: Int; let subject: String; let title: String; let objective: String
    let questions: [LearningQuestion]
}
struct LearningProgress: Codable {
    var habits: NativeHabits?
    var completed: Set<Int> = []
    var xp = 0
    var streak = 0
    var lastCompletion: Date?
    var energy = 15
    var energyUpdated = Date()
    var reminders = false
    mutating func replenish(now: Date = Date()) {
        let gained = max(0, Int(now.timeIntervalSince(energyUpdated) / 1800))
        if gained > 0 { energy = min(15, max(0, energy) + gained); energyUpdated = now }
    }
    mutating func complete(id: Int, perfect: Bool, now: Date = Date(), calendar: Calendar = .current) {
        if completed.insert(id).inserted { xp += perfect ? 40 : 25 }
        if let last = lastCompletion, calendar.isDate(last, inSameDayAs: now) { return }
        let yesterday = calendar.date(byAdding: .day, value: -1, to: now)!
        streak = lastCompletion.map { calendar.isDate($0, inSameDayAs: yesterday) } == true ? streak + 1 : 1
        lastCompletion = now
    }
}

@MainActor
final class LearningStore: ObservableObject {
    @Published var lessons: [LearningLesson] = []
    @Published var progress = LearningProgress()
    @Published var errorMessage: String?
    private let defaults: UserDefaults
    private let scheduler = StreakReminderScheduler()
    init(defaults: UserDefaults = .standard) {
        self.defaults = defaults
        if let data = defaults.data(forKey: "native.progress.v1") {
            do { progress = try JSONDecoder().decode(LearningProgress.self, from: data) }
            catch { defaults.set(data, forKey: "native.progress.recovery.v1"); errorMessage = "Saved progress could not be read. A recovery copy was kept on this device; a new session is available." }
        }
        do {
            guard let url = Bundle.main.url(forResource: "curriculum", withExtension: "json") else { throw CocoaError(.fileNoSuchFile) }
            lessons = try JSONDecoder().decode([LearningLesson].self, from: Data(contentsOf: url))
            guard !lessons.isEmpty, lessons.allSatisfy({ $0.questions.count >= 5 && $0.questions.allSatisfy { $0.options.indices.contains($0.correct) } }) else { throw CocoaError(.fileReadCorruptFile) }
        } catch { errorMessage = "The learning library could not be opened. Please reinstall the beta or contact its organizer." }
    }
    func persist() {
        do { defaults.set(try JSONEncoder().encode(progress), forKey: "native.progress.v1") }
        catch { errorMessage = "Progress could not be saved. Keep the app open and try again." }
    }
    func begin(plus: Bool) -> Bool {
        progress.replenish()
        guard plus || progress.energy > 0 else { errorMessage = "Energy refills every 30 minutes. Try again later or explore Candle+."; return false }
        if !plus { progress.energy -= 1; progress.energyUpdated = Date() }
        persist(); return true
    }
    func finish(_ lesson: LearningLesson, perfect: Bool) {
        progress.complete(id: lesson.id, perfect: perfect)
        var habits = progress.habits ?? NativeHabits(); habits.finish(lesson.id); progress.habits = habits; persist()
        Task { await reconcile() }
    }
    func recordAnswer(_ question: LearningQuestion, correct: Bool, confidence: String?, lessonID: Int) {
        var habits = progress.habits ?? NativeHabits()
        habits.answer(question.skill, correct: correct, confidence: confidence, lessonID: lessonID)
        progress.habits = habits; persist()
    }
    func reportQuestion(_ question: LearningQuestion) {
        var habits = progress.habits ?? NativeHabits(); habits.reports[question.id] = "ambiguous"; progress.habits = habits; persist()
    }
    func reconcile() async {
        progress.replenish()
        if let last = progress.lastCompletion, let yesterday = Calendar.current.date(byAdding: .day, value: -1, to: Date()), last < Calendar.current.startOfDay(for: yesterday) { progress.streak = 0 }
        do { try await scheduler.reconcile(enabled: progress.reminders, lastCompletion: progress.lastCompletion, streak: progress.streak) }
        catch { errorMessage = "The streak reminder could not be scheduled. Check notification settings." }
        persist()
    }
    func setReminders(_ enabled: Bool) async {
        if !enabled { scheduler.disable(); progress.reminders = false; persist(); return }
        do { progress.reminders = try await scheduler.enable(lastCompletion: progress.lastCompletion, streak: progress.streak)
            if !progress.reminders { errorMessage = "Notifications are not permitted. You can change this in iPhone Settings." }
        } catch { progress.reminders = false; errorMessage = "The reminder could not be enabled." }
        persist()
    }
}
