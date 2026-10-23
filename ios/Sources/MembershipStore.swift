import StoreKit
import SwiftUI

// Native entitlement only. This never writes a browser flag or a server entitlement.
@MainActor
final class MembershipStore: ObservableObject {
    @Published private(set) var products: [Product] = []
    @Published private(set) var active = false
    @Published private(set) var busy = false
    @Published var message: String?
    // Configure real identifiers only after creating subscriptions in App Store Connect.
    private let ids: Set<String>
    private var listener: Task<Void, Never>?
    init(ids: Set<String> = []) {
        self.ids = ids
        listener = Task { [weak self] in
            for await result in Transaction.updates {
                guard let self else { return }
                if case .verified(let transaction) = result, self.ids.contains(transaction.productID) {
                    await self.refresh(); await transaction.finish()
                }
            }
        }
    }
    deinit { listener?.cancel() }
    func load() async {
        await refresh()
        guard !ids.isEmpty else { message = "Purchases are not enabled in this beta."; return }
        do { products = try await Product.products(for: ids).filter { $0.type == .autoRenewable }.sorted { $0.price < $1.price } }
        catch { message = "Membership options could not be loaded. Try again later." }
    }
    func refresh() async {
        var entitled = false
        // Apple's currentEntitlements includes active subscriptions and billing grace.
        // Recount from scratch so refunds and revocations remove local access.
        for await result in Transaction.currentEntitlements {
            if case .verified(let transaction) = result, ids.contains(transaction.productID), transaction.revocationDate == nil, !transaction.isUpgraded { entitled = true }
        }
        active = entitled
    }
    func purchase(_ product: Product) async {
        guard ids.contains(product.id), !busy else { return }
        busy = true; defer { busy = false }
        do {
            switch try await product.purchase() {
            case .success(.verified(let transaction)):
                await refresh(); await transaction.finish()
                message = active ? "Candle+ is active." : "Purchase received. Membership access is being checked."
            case .success(.unverified): message = "The purchase could not be verified. Access has not been granted."
            case .pending: message = "Purchase is awaiting approval. Access will update when approved."
            case .userCancelled: break
            @unknown default: message = "Purchase status is unavailable. Try Restore Purchases."
            }
        } catch { message = "Purchase did not complete. You can try again or restore a previous purchase." }
    }
    func restore() async {
        guard !busy else { return }; busy = true; defer { busy = false }
        do { try await AppStore.sync(); await refresh(); message = active ? "Membership restored." : "No active Candle+ subscription was found." }
        catch { message = "Restore did not complete. Try again later." }
    }
}
