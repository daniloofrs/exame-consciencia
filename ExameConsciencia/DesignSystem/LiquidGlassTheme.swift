import SwiftUI
import UIKit

public enum CandlelightPalette {
    /// Deep Obsidian `#07080D`
    public static let obsidian = Color(red: 0.027, green: 0.031, blue: 0.051)
    /// Elevated Obsidian surface `#0E1017`
    public static let deepSurface = Color(red: 0.055, green: 0.063, blue: 0.090)
    /// Warm Amber `#F59E0B`
    public static let warmAmber = Color(red: 0.961, green: 0.620, blue: 0.043)
    /// Sacred Bronze `#D97706`
    public static let sacredBronze = Color(red: 0.851, green: 0.467, blue: 0.024)
    /// Warm Parchment `#FEF3C7`
    public static let parchment = Color(red: 0.996, green: 0.953, blue: 0.780)
    /// Soft Ivory `#F8FAFC`
    public static let ivory = Color(red: 0.973, green: 0.980, blue: 0.988)
    /// Muted Slate `#94A3B8`
    public static let mutedText = Color(red: 0.580, green: 0.639, blue: 0.722)
}

public struct CandlelightBackground: View {
    public init() {}

    public var body: some View {
        ZStack {
            CandlelightPalette.obsidian
                .ignoresSafeArea()

            RadialGradient(
                colors: [
                    CandlelightPalette.warmAmber.opacity(0.14),
                    CandlelightPalette.sacredBronze.opacity(0.05),
                    Color.clear
                ],
                center: .topLeading,
                startRadius: 20,
                endRadius: 380
            )
            .ignoresSafeArea()

            RadialGradient(
                colors: [
                    CandlelightPalette.sacredBronze.opacity(0.12),
                    Color.clear
                ],
                center: .bottomTrailing,
                startRadius: 30,
                endRadius: 420
            )
            .ignoresSafeArea()
        }
    }
}

public struct LiquidGlassCard<Content: View>: View {
    private let isHighlighted: Bool
    private let cornerRadius: CGFloat
    private let padding: CGFloat
    private let content: Content

    public init(
        isHighlighted: Bool = false,
        cornerRadius: CGFloat = 22,
        padding: CGFloat = 18,
        @ViewBuilder content: () -> Content
    ) {
        self.isHighlighted = isHighlighted
        self.cornerRadius = cornerRadius
        self.padding = padding
        self.content = content()
    }

    public var body: some View {
        content
            .padding(padding)
            .background {
                ZStack {
                    RoundedRectangle(cornerRadius: cornerRadius, style: .continuous)
                        .fill(.ultraThinMaterial)

                    RoundedRectangle(cornerRadius: cornerRadius, style: .continuous)
                        .fill(
                            isHighlighted
                                ? CandlelightPalette.warmAmber.opacity(0.10)
                                : Color.white.opacity(0.02)
                        )

                    // Top edge specular highlight simulating Liquid Glass refraction
                    VStack(spacing: 0) {
                        LinearGradient(
                            colors: [
                                Color.white.opacity(isHighlighted ? 0.45 : 0.25),
                                CandlelightPalette.warmAmber.opacity(isHighlighted ? 0.50 : 0.15),
                                Color.clear
                            ],
                            startPoint: .leading,
                            endPoint: .trailing
                        )
                        .frame(height: 1.2)
                        Spacer()
                    }
                    .clipShape(RoundedRectangle(cornerRadius: cornerRadius, style: .continuous))
                }
            }
            .overlay {
                RoundedRectangle(cornerRadius: cornerRadius, style: .continuous)
                    .strokeBorder(
                        LinearGradient(
                            colors: isHighlighted
                                ? [
                                    CandlelightPalette.warmAmber.opacity(0.65),
                                    CandlelightPalette.sacredBronze.opacity(0.30)
                                ]
                                : [
                                    Color.white.opacity(0.20),
                                    Color.white.opacity(0.06)
                                ],
                            startPoint: .topLeading,
                            endPoint: .bottomTrailing
                        ),
                        lineWidth: 1
                    )
            }
            .shadow(color: Color.black.opacity(0.45), radius: 18, x: 0, y: 10)
    }
}

public struct AmberPill: View {
    private let text: String
    private let systemImage: String?
    private let isSelected: Bool

    public init(text: String, systemImage: String? = nil, isSelected: Bool = false) {
        self.text = text
        self.systemImage = systemImage
        self.isSelected = isSelected
    }

    public var body: some View {
        HStack(spacing: 6) {
            if let systemImage {
                Image(systemName: systemImage)
                    .font(.caption.weight(.semibold))
            }
            Text(text)
                .font(.caption.weight(.semibold))
        }
        .foregroundStyle(isSelected ? CandlelightPalette.obsidian : CandlelightPalette.parchment)
        .padding(.horizontal, 13)
        .padding(.vertical, 7)
        .background {
            Capsule(style: .continuous)
                .fill(
                    isSelected
                        ? AnyShapeStyle(
                            LinearGradient(
                                colors: [CandlelightPalette.warmAmber, CandlelightPalette.sacredBronze],
                                startPoint: .topLeading,
                                endPoint: .bottomTrailing
                            )
                        )
                        : AnyShapeStyle(.ultraThinMaterial)
                )
        }
        .overlay {
            Capsule(style: .continuous)
                .strokeBorder(
                    isSelected
                        ? CandlelightPalette.parchment.opacity(0.5)
                        : CandlelightPalette.warmAmber.opacity(0.28),
                    lineWidth: 1
                )
        }
    }
}

@MainActor
public enum Haptics {
    public static func selection() {
        let generator = UISelectionFeedbackGenerator()
        generator.selectionChanged()
    }

    public static func impactLight() {
        let generator = UIImpactFeedbackGenerator(style: .light)
        generator.impactOccurred()
    }

    public static func absolutionSuccess() {
        let generator = UINotificationFeedbackGenerator()
        generator.notificationOccurred(.success)
    }
}
