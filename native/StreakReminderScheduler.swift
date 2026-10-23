import Foundation
import UserNotifications

// Integrate into the future iOS app target. This repository is still a web app.
// Call enable only from an explicit settings action; reconcile on foreground,
// local-day/timezone changes, and after every lesson completion.
@MainActor
final class StreakReminderScheduler {
    private let center: UNUserNotificationCenter
    private let identifier = "candle.streak.evening.v1"
    init(center: UNUserNotificationCenter = .current()) { self.center = center }

    func enable(lastCompletion: Date?, streak: Int) async throws -> Bool {
        let allowed = try await center.requestAuthorization(options: [.alert, .sound])
        guard allowed else { return false }
        try await reconcile(enabled: true, lastCompletion: lastCompletion, streak: streak)
        return true
    }

    func reconcile(enabled: Bool, lastCompletion: Date?, streak: Int,
                   now: Date = Date(), calendar: Calendar = .current) async throws {
        center.removePendingNotificationRequests(withIdentifiers: [identifier])
        center.removeDeliveredNotifications(withIdentifiers: [identifier])
        guard enabled, streak > 0, let last = lastCompletion,
              let tomorrow = calendar.date(byAdding: .day, value: 1, to: calendar.startOfDay(for: last)),
              let reminder = calendar.date(bySettingHour: 20, minute: 0, second: 0, of: tomorrow),
              reminder > now else { return }
        let settings = await center.notificationSettings()
        guard settings.authorizationStatus == .authorized ||
              settings.authorizationStatus == .provisional else { return }
        let content = UNMutableNotificationContent()
        content.title = "Keep your Candle streak glowing"
        content.body = "One lesson before midnight keeps your personal streak going. Pick any topic."
        content.sound = .default
        content.userInfo = ["destination": "learn"]
        var components = calendar.dateComponents([.year, .month, .day, .hour, .minute], from: reminder)
        components.timeZone = calendar.timeZone
        let trigger = UNCalendarNotificationTrigger(dateMatching: components, repeats: false)
        try await center.add(UNNotificationRequest(identifier: identifier, content: content, trigger: trigger))
    }

    func disable() {
        center.removePendingNotificationRequests(withIdentifiers: [identifier])
        center.removeDeliveredNotifications(withIdentifiers: [identifier])
    }
}
