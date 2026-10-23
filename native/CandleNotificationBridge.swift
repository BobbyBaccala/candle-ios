import Foundation
import WebKit

// Register as "candleReminders" using addScriptMessageHandler(_:contentWorld:name:).
// The host must supply its own exact HTTPS origin allowlist. Do not register
// this privileged bridge on untrusted browsing windows or unrestricted pages.
@MainActor
final class CandleNotificationBridge: NSObject, WKScriptMessageHandlerWithReply {
    private let scheduler = StreakReminderScheduler()
    private let allowedOrigins: Set<String>
    private let defaults: UserDefaults
    init(allowedOrigins: Set<String>, defaults: UserDefaults = .standard) {
        self.allowedOrigins = allowedOrigins
        self.defaults = defaults
    }

    func userContentController(_ userContentController: WKUserContentController,
                               didReceive message: WKScriptMessage,
                               replyHandler: @escaping (Any?, String?) -> Void) {
        guard message.frameInfo.isMainFrame,
              let url = message.frameInfo.request.url,
              let scheme = url.scheme, let host = url.host,
              allowedOrigins.contains("\(scheme)://\(host)\(url.port.map { ":\($0)" } ?? "")"),
              scheme == "https",
              let payload = message.body as? [String: Any],
              let action = payload["action"] as? String else {
            replyHandler(nil, "Untrusted notification request")
            return
        }
        Task { @MainActor in
            do {
                if action == "disable" {
                    defaults.set(false, forKey: "candle.streakReminders")
                    scheduler.disable()
                    replyHandler(false, nil)
                    return
                }
                let formatter = DateFormatter()
                formatter.locale = Locale(identifier: "en_US_POSIX")
                formatter.calendar = Calendar.current
                formatter.timeZone = .current
                formatter.dateFormat = "yyyy-MM-dd"
                formatter.isLenient = false
                let day = payload["lastCompletionDay"] as? String
                let last = day.flatMap { formatter.date(from: $0) }
                let streak = max(0, payload["streak"] as? Int ?? 0)
                if action == "enable" {
                    let allowed = try await scheduler.enable(lastCompletion: last, streak: streak)
                    defaults.set(allowed, forKey: "candle.streakReminders")
                    replyHandler(allowed, nil)
                } else if action == "reconcile" {
                    let enabled = defaults.bool(forKey: "candle.streakReminders")
                    try await scheduler.reconcile(enabled: enabled, lastCompletion: last, streak: streak)
                    replyHandler(enabled, nil)
                } else {
                    replyHandler(nil, "Unknown notification action")
                }
            } catch { replyHandler(nil, "Notification scheduling failed") }
        }
    }
}
