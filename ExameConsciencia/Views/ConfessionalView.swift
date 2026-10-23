import SwiftUI
import UIKit

public struct ConfessionalView: View {
    @Bindable var store: ExaminationStore
    private let onAbsolutionCompleted: (() -> Void)?
    @Environment(\.dismiss) private var dismiss
    @State private var isShowingActOfContrition = false
    @State private var isConfirmingAbsolution = false

    public init(store: ExaminationStore, onAbsolutionCompleted: (() -> Void)? = nil) {
        self.store = store
        self.onAbsolutionCompleted = onAbsolutionCompleted
    }

    public var body: some View {
        ZStack {
            CandlelightBackground()

            ScrollView(showsIndicators: false) {
                VStack(alignment: .leading, spacing: 18) {
                    greetingCard
                    sinsSummarySection
                    bottomActionsSection
                }
                .padding(.horizontal, 18)
                .padding(.top, 12)
                .padding(.bottom, 40)
            }
        }
        .navigationTitle("No Confessionário")
        .navigationBarTitleDisplayMode(.inline)
        .onAppear {
            UIApplication.shared.isIdleTimerDisabled = true
        }
        .onDisappear {
            UIApplication.shared.isIdleTimerDisabled = false
        }
        .sheet(isPresented: $isShowingActOfContrition) {
            actOfContritionSheet
        }
        .confirmationDialog(
            "Concluir Confissão e Apagar Pecados?",
            isPresented: $isConfirmingAbsolution,
            titleVisibility: .visible
        ) {
            Button("Sim, Recebi a Absolvição", role: .destructive) {
                Haptics.absolutionSuccess()
                store.completeAbsolution()
                if let onAbsolutionCompleted {
                    onAbsolutionCompleted()
                } else {
                    dismiss()
                }
            }
            Button("Cancelar", role: .cancel) {}
        } message: {
            Text("Todos os pecados e anotações serão permanentemente apagados do aparelho, mantendo apenas a data de hoje como sua última confissão.")
        }
    }

    private var greetingCard: some View {
        LiquidGlassCard(isHighlighted: false, padding: 16) {
            VStack(alignment: .leading, spacing: 8) {
                HStack {
                    Image(systemName: "hands.and.sparkles.fill")
                        .foregroundStyle(CandlelightPalette.warmAmber)
                    Text("COMO INICIAR")
                        .font(.caption2.weight(.bold))
                        .tracking(0.8)
                        .foregroundStyle(CandlelightPalette.warmAmber)
                    Spacer()
                    AmberPill(text: "Tela sempre acesa", systemImage: "sun.max.fill")
                }

                Text(confessionalGreetingText)
                    .font(.system(.subheadline, design: .serif))
                    .foregroundStyle(CandlelightPalette.parchment)
                    .lineSpacing(4)
            }
        }
    }

    private var confessionalGreetingText: String {
        if let days = store.daysSinceLastConfession() {
            let tempo = days == 0 ? "hoje mesmo" : (days == 1 ? "há 1 dia" : "há cerca de \(days) dias")
            return "“Abençoai-me, Padre, porque pequei. Minha última confissão foi \(tempo). Estes são os meus pecados:”"
        } else {
            return "“Abençoai-me, Padre, porque pequei. Esta é a minha confissão e estes são os meus pecados:”"
        }
    }

    private var sinsSummarySection: some View {
        VStack(alignment: .leading, spacing: 12) {
            HStack {
                Text("Pecados a Declarar")
                    .font(.system(.title3, design: .serif, weight: .bold))
                    .foregroundStyle(CandlelightPalette.ivory)
                Spacer()
                Text("Toque no item após confessá-lo")
                    .font(.caption2)
                    .foregroundStyle(CandlelightPalette.mutedText)
            }

            if store.markedQuestions.isEmpty && store.customEntries.isEmpty {
                LiquidGlassCard {
                    VStack(spacing: 10) {
                        Image(systemName: "checkmark.seal.fill")
                            .font(.largeTitle)
                            .foregroundStyle(CandlelightPalette.warmAmber)
                        Text("Nenhum item selecionado ainda.")
                            .font(.headline)
                            .foregroundStyle(CandlelightPalette.ivory)
                        Text("Volte ao Exame de Consciência para marcar perguntas ou adicionar anotações.")
                            .font(.caption)
                            .foregroundStyle(CandlelightPalette.mutedText)
                            .multilineTextAlignment(.center)
                    }
                    .frame(maxWidth: .infinity)
                    .padding(.vertical, 12)
                }
            } else {
                ForEach(store.markedQuestions) { question in
                    let isConfessed = store.isItemConfessed(question.id)
                    let note = store.note(for: question.id)

                    Button {
                        Haptics.selection()
                        store.toggleConfessedItem(question.id)
                    } label: {
                        LiquidGlassCard(isHighlighted: !isConfessed, cornerRadius: 16, padding: 14) {
                            HStack(alignment: .top, spacing: 12) {
                                Image(systemName: isConfessed ? "checkmark.circle.fill" : "circle")
                                    .font(.title3)
                                    .foregroundStyle(isConfessed ? CandlelightPalette.mutedText : CandlelightPalette.warmAmber)
                                    .padding(.top, 2)

                                VStack(alignment: .leading, spacing: 6) {
                                    Text(question.commandmentLabel.uppercased())
                                        .font(.caption2.weight(.bold))
                                        .foregroundStyle(CandlelightPalette.warmAmber.opacity(isConfessed ? 0.45 : 0.95))

                                    Text(question.text)
                                        .font(.subheadline.weight(.medium))
                                        .foregroundStyle(CandlelightPalette.ivory.opacity(isConfessed ? 0.40 : 1.0))
                                        .strikethrough(isConfessed, color: CandlelightPalette.mutedText)
                                        .multilineTextAlignment(.leading)

                                    if !note.isEmpty {
                                        HStack(spacing: 6) {
                                            Image(systemName: "note.text")
                                                .font(.caption2)
                                            Text(note)
                                                .font(.caption)
                                        }
                                        .foregroundStyle(CandlelightPalette.parchment.opacity(isConfessed ? 0.40 : 0.90))
                                        .padding(.horizontal, 10)
                                        .padding(.vertical, 5)
                                        .background(RoundedRectangle(cornerRadius: 8).fill(Color.white.opacity(0.06)))
                                    }
                                }
                                Spacer(minLength: 0)
                            }
                        }
                    }
                    .buttonStyle(.plain)
                }

                ForEach(store.customEntries) { entry in
                    let itemKey = entry.id.uuidString
                    let isConfessed = store.isItemConfessed(itemKey)

                    Button {
                        Haptics.selection()
                        store.toggleConfessedItem(itemKey)
                    } label: {
                        LiquidGlassCard(isHighlighted: !isConfessed, cornerRadius: 16, padding: 14) {
                            HStack(alignment: .top, spacing: 12) {
                                Image(systemName: isConfessed ? "checkmark.circle.fill" : "circle")
                                    .font(.title3)
                                    .foregroundStyle(isConfessed ? CandlelightPalette.mutedText : CandlelightPalette.warmAmber)
                                    .padding(.top, 2)

                                VStack(alignment: .leading, spacing: 4) {
                                    Text("ANOTAÇÃO PESSOAL")
                                        .font(.caption2.weight(.bold))
                                        .foregroundStyle(CandlelightPalette.warmAmber.opacity(isConfessed ? 0.45 : 0.95))

                                    Text(entry.text)
                                        .font(.subheadline.weight(.medium))
                                        .foregroundStyle(CandlelightPalette.ivory.opacity(isConfessed ? 0.40 : 1.0))
                                        .strikethrough(isConfessed, color: CandlelightPalette.mutedText)
                                        .multilineTextAlignment(.leading)
                                }
                                Spacer(minLength: 0)
                            }
                        }
                    }
                    .buttonStyle(.plain)
                }
            }
        }
    }

    private var bottomActionsSection: some View {
        VStack(spacing: 12) {
            Button {
                Haptics.selection()
                isShowingActOfContrition = true
            } label: {
                LiquidGlassCard(isHighlighted: true, cornerRadius: 18, padding: 15) {
                    HStack {
                        Image(systemName: "book.pages.fill")
                            .foregroundStyle(CandlelightPalette.warmAmber)
                        Text("Ler Ato de Contrição")
                            .font(.headline)
                            .foregroundStyle(CandlelightPalette.parchment)
                        Spacer()
                        Image(systemName: "chevron.up")
                            .foregroundStyle(CandlelightPalette.warmAmber)
                    }
                }
            }
            .buttonStyle(.plain)

            Button {
                Haptics.impactLight()
                isConfirmingAbsolution = true
            } label: {
                HStack(spacing: 10) {
                    Image(systemName: "sparkles")
                    Text("Recebi a Absolvição (Apagar Tudo)")
                        .font(.headline)
                }
                .foregroundStyle(CandlelightPalette.obsidian)
                .frame(maxWidth: .infinity)
                .padding(.vertical, 16)
                .background(
                    RoundedRectangle(cornerRadius: 18, style: .continuous)
                        .fill(
                            LinearGradient(
                                colors: [CandlelightPalette.warmAmber, CandlelightPalette.sacredBronze],
                                startPoint: .topLeading,
                                endPoint: .bottomTrailing
                            )
                        )
                )
                .shadow(color: CandlelightPalette.warmAmber.opacity(0.28), radius: 14, x: 0, y: 6)
            }
        }
        .padding(.top, 8)
    }

    private var actOfContritionSheet: some View {
        NavigationStack {
            ZStack {
                CandlelightBackground()

                ScrollView {
                    VStack(alignment: .leading, spacing: 18) {
                        AmberPill(text: "Oração do Penitente", systemImage: "flame.fill")

                        Text("Ato de Contrição")
                            .font(.system(.largeTitle, design: .serif, weight: .bold))
                            .foregroundStyle(CandlelightPalette.ivory)

                        if let contrition = store.prayer(withID: "ato-contricao") {
                            LiquidGlassCard(isHighlighted: true, padding: 22) {
                                Text(contrition.body)
                                    .font(.system(.title3, design: .serif))
                                    .foregroundStyle(CandlelightPalette.parchment)
                                    .lineSpacing(8)
                            }
                        }
                    }
                    .padding(22)
                }
            }
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .confirmationAction) {
                    Button("Fechar") {
                        isShowingActOfContrition = false
                    }
                    .fontWeight(.semibold)
                }
            }
        }
        .preferredColorScheme(.dark)
    }
}
