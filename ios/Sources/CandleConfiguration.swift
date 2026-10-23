import Foundation

struct CandleConfiguration: Codable {
    let productIDs: [String]
    let privacyURL: String
    let termsURL: String
    let supportURL: String
    static var bundled: CandleConfiguration {
        guard let url = Bundle.main.url(forResource: "LaunchConfiguration", withExtension: "json"),
              let data = try? Data(contentsOf: url), let config = try? JSONDecoder().decode(Self.self, from: data) else {
            return Self(productIDs: [], privacyURL: "", termsURL: "", supportURL: "")
        }
        return config
    }
    func link(_ string: String) -> URL? {
        guard let url = URL(string: string), url.scheme == "https", let host = url.host,
              host != "localhost", !host.hasSuffix(".invalid"), !host.hasSuffix(".example"),
              url.user == nil, url.password == nil else { return nil }
        return url
    }
    var purchasesConfigured: Bool {
        !productIDs.isEmpty && productIDs.allSatisfy { !$0.trimmingCharacters(in: .whitespaces).isEmpty } && link(privacyURL) != nil && link(termsURL) != nil && link(supportURL) != nil
    }
}
