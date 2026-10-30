import XCTest
@testable import Candle

final class LearningProgressTests: XCTestCase {
    private var calendar: Calendar { var c = Calendar(identifier: .gregorian); c.timeZone = TimeZone(identifier: "America/Toronto")!; return c }
    private func date(_ value: String) -> Date { ISO8601DateFormatter().date(from: value)! }
    func testReplayDoesNotFarmXPButMaintainsDailyStreak() {
        var progress = LearningProgress()
        progress.complete(id: 10, perfect: true, now: date("2026-10-23T16:00:00Z"), calendar: calendar)
        progress.complete(id: 10, perfect: false, now: date("2026-10-23T17:00:00Z"), calendar: calendar)
        XCTAssertEqual(progress.xp, 40); XCTAssertEqual(progress.streak, 1)
        progress.complete(id: 10, perfect: true, now: date("2026-10-24T16:00:00Z"), calendar: calendar)
        XCTAssertEqual(progress.xp, 40); XCTAssertEqual(progress.streak, 2)
        progress.complete(id: 11, perfect: false, now: date("2026-10-26T16:00:00Z"), calendar: calendar)
        XCTAssertEqual(progress.xp, 65); XCTAssertEqual(progress.streak, 1)
    }
    func testStreakUsesLocalCalendarAcrossDaylightSavings() {
        var progress = LearningProgress()
        progress.complete(id: 0, perfect: true, now: date("2026-10-31T16:00:00Z"), calendar: calendar)
        progress.complete(id: 1, perfect: true, now: date("2026-11-01T17:00:00Z"), calendar: calendar)
        XCTAssertEqual(progress.streak, 2)
    }
    func testEnergyRefillsAndCapsAtFifteen() {
        var progress = LearningProgress(); progress.energy = 0; progress.energyUpdated = date("2026-10-23T16:00:00Z")
        progress.replenish(now: date("2026-10-23T17:00:00Z")); XCTAssertEqual(progress.energy, 2)
        progress.replenish(now: date("2026-10-25T17:00:00Z")); XCTAssertEqual(progress.energy, 15)
    }
    func testProgressRoundTripPreservesHistory() throws {
        var progress = LearningProgress(); progress.complete(id: 1292, perfect: true)
        let restored = try JSONDecoder().decode(LearningProgress.self, from: JSONEncoder().encode(progress))
        XCTAssertEqual(restored.completed, [1292]); XCTAssertEqual(restored.xp, 40)
    }
}

final class NativeConfigurationTests: XCTestCase {
    func testMissingLegalConfigurationCannotEnablePurchases() {
        let config = CandleConfiguration(productIDs: ["test.monthly"], privacyURL: "", termsURL: "https://legal.example/terms", supportURL: "https://support.invalid")
        XCTAssertFalse(config.purchasesConfigured)
        XCTAssertNil(config.link("http://example.com"))
        XCTAssertNil(config.link("https://user:password@example.com"))
    }
}

final class NativeHabitsTests: XCTestCase {
    func testNoReplayRewardFarmingAndDelayedEvidence() {
        var h = NativeHabits(); let now = Date(timeIntervalSince1970: 1800000000)
        h.finish(1, now: now); h.finish(1, now: now); XCTAssertEqual(h.sparks, 1)
        h.finish(2, now: now); h.finish(3, now: now); XCTAssertEqual(h.sparks, 3)
        h.answer("concept:facet", correct: true, confidence: "sure", lessonID: 1, now: now)
        h.answer("concept:facet", correct: true, confidence: nil, lessonID: 2, now: now.addingTimeInterval(1))
        XCTAssertEqual(h.remembered, 0); XCTAssertEqual(h.evidence.count, 1)
        h.answer("concept:facet", correct: true, confidence: "fair", lessonID: 2, now: now.addingTimeInterval(86402))
        XCTAssertEqual(h.remembered, 1)
    }
    @MainActor func testEntireBundledLibraryLoads() {
        let store = LearningStore(defaults: UserDefaults(suiteName: UUID().uuidString)!)
        XCTAssertEqual(store.lessons.count, 1293, store.libraryLoadError ?? "no load error recorded")
        XCTAssertNil(store.errorMessage, store.libraryLoadError ?? "")
    }
    func testRequiredResourcesAreInTheAppBundle() {
        for (name, ext) in [("curriculum", "json"), ("PrivacyInfo", "xcprivacy"), ("LaunchConfiguration", "json")] {
            XCTAssertNotNil(Bundle.main.url(forResource: name, withExtension: ext),
                            "\(name).\(ext) missing from \(Bundle.main.bundlePath)")
        }
    }
}
