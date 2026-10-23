import Foundation

struct NativeEvidence: Codable {
    var lastCorrect: Date?
    var retained = false
    var lastWasCorrect = false
    var confidence: String?
    var lessonID: Int
}
struct NativeHabits: Codable {
    var evidence: [String: NativeEvidence] = [:]
    var days: [String: Set<Int>] = [:]
    var reports: [String: String] = [:]
    static func day(_ now: Date = Date()) -> String {
        let formatter = DateFormatter(); formatter.locale = Locale(identifier: "en_US_POSIX"); formatter.timeZone = .current; formatter.dateFormat = "yyyy-MM-dd"
        return formatter.string(from: now)
    }
    mutating func answer(_ skill: String, correct: Bool, confidence: String?, lessonID: Int, now: Date = Date()) {
        var row = evidence[skill] ?? NativeEvidence(lessonID: lessonID)
        let delayed = row.lastCorrect.map { now.timeIntervalSince($0) >= 86400 } ?? false
        row.retained = correct && (delayed || row.retained)
        if correct { row.lastCorrect = now }
        row.lastWasCorrect = correct; row.confidence = confidence; row.lessonID = lessonID
        evidence[skill] = row
    }
    mutating func finish(_ lessonID: Int, now: Date = Date()) { days[Self.day(now), default: []].insert(lessonID) }
    var sparks: Int { days.values.reduce(0) { $0 + ($1.count >= 3 ? 3 : $1.isEmpty ? 0 : 1) } }
    var remembered: Int { evidence.values.filter(\.retained).count }
    var needsReview: Int { evidence.values.filter { !$0.lastWasCorrect }.count }
    var suggestedLesson: Int? { evidence.values.first { !$0.lastWasCorrect }?.lessonID }
}
