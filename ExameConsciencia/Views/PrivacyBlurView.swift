import SwiftUI

public struct PrivacyBlurView: View {
    public init() {}

    public var body: some View {
        ZStack {
            CandlelightBackground()
            Rectangle()
                .fill(.ultraThinMaterial)
                .ignoresSafeArea()

            VStack(spacing: 14) {
                Image(systemName: "lock.shield.fill")
                    .font(.system(size: 46))
                    .foregroundStyle(CandlelightPalette.warmAmber)

                Text("Exame de Consciência")
                    .font(.system(.title3, design: .serif, weight: .bold))
                    .foregroundStyle(CandlelightPalette.ivory)

                Text("Conteúdo protegido em segundo plano")
                    .font(.caption)
                    .foregroundStyle(CandlelightPalette.mutedText)
            }
        }
    }
}
