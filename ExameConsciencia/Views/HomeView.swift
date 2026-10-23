import SwiftUI

public enum AppRoute: Hashable {
    case examination
    case confessional
}

public struct HomeView: View {
    @Bindable var store: ExaminationStore
    @State private var navigationPath = NavigationPath()
    @State private var isPrayerExpanded = false
    @State private var isShowingDatePicker = false
    @State private var draftDate = Date()

    public init(store: ExaminationStore) {
        self.store = store
    }

    public var body: some View {
        NavigationStack(path: $navigationPath) {
            ZStack {
                CandlelightBackground()

                ScrollView(showsIndicators: false) {
                    VStack(alignment: .leading, spacing: 20) {
                        headerSection
                        lastConfessionCard
                        if let prayer = store.prayer(withID: "espirito-santo") {
                            preparatoryPrayerCard(prayer)
                        }
                        actionButtonsSection
                        privacyFooter
                    }
                    .padding(.horizontal, 20)
                    .padding(.top, 14)
                    .padding(.bottom, 40)
                }
            }
            .navigationBarHidden(true)
            .navigationDestination(for: AppRoute.self) { route in
                switch route {
                case .examination:
                    ExaminationView(
                        store: store,
                        onOpenConfessional: {
                            navigationPath.append(AppRoute.confessional)
                        }
                    )
                case .confessional:
                    ConfessionalView(
                        store: store,
                        onAbsolutionCompleted: {
                            navigationPath = NavigationPath()
                        }
                    )
                }
            }
            .sheet(isPresented: $isShowingDatePicker) {
                datePickerSheet
            }
        }
    }

    private var headerSection: some View {
        VStack(alignment: .leading, spacing: 6) {
            AmberPill(text: "Sacramento da Penitência", systemImage: "flame.fill", isSelected: false)

            Text("Exame de Consciência")
                .font(.system(.largeTitle, design: .serif, weight: .bold))
                .foregroundStyle(CandlelightPalette.ivory)
                .padding(.top, 4)

            Text("Recolha-se na presença de Deus e examine o coração com sinceridade.")
                .font(.subheadline)
                .foregroundStyle(CandlelightPalette.mutedText)
        }
    }

    private var lastConfessionCard: some View {
        LiquidGlassCard(isHighlighted: true) {
            HStack(alignment: .center, spacing: 14) {
                ZStack {
                    Circle()
                        .fill(CandlelightPalette.warmAmber.opacity(0.18))
                        .frame(width: 46, height: 46)
                    Image(systemName: "calendar.badge.clock")
                        .font(.title3.weight(.semibold))
                        .foregroundStyle(CandlelightPalette.warmAmber)
                }

                VStack(alignment: .leading, spacing: 4) {
                    Text("ÚLTIMA CONFISSÃO")
                        .font(.caption2.weight(.bold))
                        .tracking(0.8)
                        .foregroundStyle(CandlelightPalette.warmAmber)

                    if let lastDate = store.lastConfessionDate {
                        Text(lastDate.formatted(.dateTime.day().month(.wide).year().locale(Locale(identifier: "pt_BR"))))
                            .font(.headline)
                            .foregroundStyle(CandlelightPalette.ivory)

                        if let days = store.daysSinceLastConfession() {
                            Text(days == 0 ? "Realizada hoje" : (days == 1 ? "Há 1 dia" : "Há \(days) dias"))
                                .font(.caption)
                                .foregroundStyle(CandlelightPalette.parchment.opacity(0.85))
                        }
                    } else {
                        Text("Primeira vez usando o app")
                            .font(.headline)
                            .foregroundStyle(CandlelightPalette.ivory)
                        Text("Toque em ajustar para informar sua última confissão")
                            .font(.caption)
                            .foregroundStyle(CandlelightPalette.mutedText)
                    }
                }

                Spacer()

                Button {
                    Haptics.selection()
                    draftDate = store.lastConfessionDate ?? Date()
                    isShowingDatePicker = true
                } label: {
                    Text("Ajustar")
                        .font(.caption.weight(.semibold))
                        .foregroundStyle(CandlelightPalette.parchment)
                        .padding(.horizontal, 12)
                        .padding(.vertical, 7)
                        .background(Capsule().fill(Color.white.opacity(0.08)))
                }
            }
        }
    }

    private func preparatoryPrayerCard(_ prayer: PrayerItem) -> some View {
        LiquidGlassCard(isHighlighted: false) {
            VStack(alignment: .leading, spacing: 12) {
                Button {
                    Haptics.selection()
                    withAnimation(.spring(response: 0.32, dampingFraction: 0.82)) {
                        isPrayerExpanded.toggle()
                    }
                } label: {
                    HStack {
                        Image(systemName: "hands.sparkles.fill")
                            .foregroundStyle(CandlelightPalette.warmAmber)
                        VStack(alignment: .leading, spacing: 2) {
                            Text(prayer.title)
                                .font(.headline)
                                .foregroundStyle(CandlelightPalette.ivory)
                            Text(prayer.subtitle)
                                .font(.caption)
                                .foregroundStyle(CandlelightPalette.mutedText)
                        }
                        Spacer()
                        Image(systemName: isPrayerExpanded ? "chevron.up.circle.fill" : "chevron.down.circle")
                            .font(.title3)
                            .foregroundStyle(CandlelightPalette.warmAmber)
                    }
                }
                .buttonStyle(.plain)

                if isPrayerExpanded {
                    Divider()
                        .overlay(Color.white.opacity(0.12))

                    Text(prayer.body)
                        .font(.system(.body, design: .serif))
                        .foregroundStyle(CandlelightPalette.parchment)
                        .lineSpacing(5)
                        .transition(.opacity.combined(with: .move(edge: .top)))
                }
            }
        }
    }

    private var actionButtonsSection: some View {
        VStack(spacing: 14) {
            NavigationLink(value: AppRoute.examination) {
                HStack(spacing: 12) {
                    Image(systemName: "checklist")
                        .font(.title3.weight(.semibold))
                    VStack(alignment: .leading, spacing: 2) {
                        Text(store.totalSelectedCount > 0 ? "Continuar Exame de Consciência" : "Iniciar Exame de Consciência")
                            .font(.headline)
                        Text("Os Dez Mandamentos, Preceitos e Pecados Capitais")
                            .font(.caption)
                            .opacity(0.85)
                    }
                    Spacer()
                    Image(systemName: "arrow.right.circle.fill")
                        .font(.title3)
                }
                .foregroundStyle(CandlelightPalette.obsidian)
                .padding(18)
                .background {
                    RoundedRectangle(cornerRadius: 20, style: .continuous)
                        .fill(
                            LinearGradient(
                                colors: [CandlelightPalette.warmAmber, CandlelightPalette.sacredBronze],
                                startPoint: .topLeading,
                                endPoint: .bottomTrailing
                            )
                        )
                }
                .shadow(color: CandlelightPalette.warmAmber.opacity(0.3), radius: 16, x: 0, y: 8)
            }
            .simultaneousGesture(TapGesture().onEnded { Haptics.impactLight() })

            if store.totalSelectedCount > 0 {
                NavigationLink(value: AppRoute.confessional) {
                    LiquidGlassCard(isHighlighted: true, padding: 16) {
                        HStack(spacing: 12) {
                            Image(systemName: "cross.case.fill")
                                .font(.title3)
                                .foregroundStyle(CandlelightPalette.warmAmber)
                            VStack(alignment: .leading, spacing: 2) {
                                Text("Abrir Modo Confessionário")
                                    .font(.headline)
                                    .foregroundStyle(CandlelightPalette.ivory)
                                Text("\(store.totalSelectedCount) \(store.totalSelectedCount == 1 ? "item anotado" : "itens anotados") para confessar")
                                    .font(.caption)
                                    .foregroundStyle(CandlelightPalette.parchment)
                            }
                            Spacer()
                            Image(systemName: "chevron.right")
                                .foregroundStyle(CandlelightPalette.warmAmber)
                        }
                    }
                }
                .simultaneousGesture(TapGesture().onEnded { Haptics.selection() })
            }
        }
    }

    private var privacyFooter: some View {
        HStack(spacing: 10) {
            Image(systemName: "lock.shield.fill")
                .foregroundStyle(CandlelightPalette.warmAmber.opacity(0.85))
            Text("100% offline e privado. Seus apontamentos são destruídos assim que você recebe a absolvição.")
                .font(.caption2)
                .foregroundStyle(CandlelightPalette.mutedText)
        }
        .padding(.top, 8)
    }

    private var datePickerSheet: some View {
        NavigationStack {
            ZStack {
                CandlelightBackground()
                VStack(spacing: 20) {
                    Text("Selecione a data aproximada da sua última confissão:")
                        .font(.subheadline)
                        .foregroundStyle(CandlelightPalette.parchment)
                        .multilineTextAlignment(.center)
                        .padding(.horizontal)

                    DatePicker(
                        "Última Confissão",
                        selection: $draftDate,
                        in: ...Date(),
                        displayedComponents: .date
                    )
                    .datePickerStyle(.graphical)
                    .tint(CandlelightPalette.warmAmber)
                    .padding()
                    .background(RoundedRectangle(cornerRadius: 20).fill(.ultraThinMaterial))
                    .padding(.horizontal)

                    if store.lastConfessionDate != nil {
                        Button(role: .destructive) {
                            store.lastConfessionDate = nil
                            isShowingDatePicker = false
                        } label: {
                            Text("Limpar registro de data")
                                .font(.footnote.weight(.semibold))
                                .foregroundStyle(.red.opacity(0.9))
                        }
                    }
                    Spacer()
                }
                .padding(.top, 20)
            }
            .navigationTitle("Última Confissão")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .cancellationAction) {
                    Button("Cancelar") {
                        isShowingDatePicker = false
                    }
                }
                ToolbarItem(placement: .confirmationAction) {
                    Button("Salvar") {
                        Haptics.selection()
                        store.lastConfessionDate = draftDate
                        isShowingDatePicker = false
                    }
                    .fontWeight(.bold)
                }
            }
        }
        .preferredColorScheme(.dark)
    }
}
