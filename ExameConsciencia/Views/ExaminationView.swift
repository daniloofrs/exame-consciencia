import SwiftUI

public struct ExaminationView: View {
    @Bindable var store: ExaminationStore
    @State private var selectedCategoryIndex = 0
    @State private var newCustomEntryText = ""
    @FocusState private var isCustomFieldFocused: Bool

    public init(store: ExaminationStore) {
        self.store = store
    }

    private var categories: [ExaminationCategory] {
        store.catalog.categories
    }

    private var currentCategory: ExaminationCategory? {
        guard categories.indices.contains(selectedCategoryIndex) else { return categories.first }
        return categories[selectedCategoryIndex]
    }

    public var body: some View {
        ZStack(alignment: .bottom) {
            CandlelightBackground()

            VStack(spacing: 0) {
                categorySelectorStrip

                ScrollView(showsIndicators: false) {
                    VStack(alignment: .leading, spacing: 16) {
                        if let category = currentCategory {
                            categoryHeader(category)

                            ForEach(category.questions) { question in
                                QuestionCardView(
                                    question: question,
                                    isSelected: store.isQuestionSelected(question.id),
                                    note: store.note(for: question.id),
                                    onToggle: {
                                        Haptics.selection()
                                        store.toggleQuestion(question.id)
                                    },
                                    onUpdateNote: { updatedNote in
                                        store.updateNote(for: question.id, note: updatedNote)
                                    }
                                )
                            }

                            categoryStepNavigation
                        }

                        customEntriesSection
                    }
                    .padding(.horizontal, 18)
                    .padding(.top, 12)
                    .padding(.bottom, 120)
                }
            }

            bottomFloatingSummaryBar
        }
        .navigationTitle("Exame de Consciência")
        .navigationBarTitleDisplayMode(.inline)
    }

    private var categorySelectorStrip: some View {
        ScrollViewReader { proxy in
            ScrollView(.horizontal, showsIndicators: false) {
                HStack(spacing: 8) {
                    ForEach(Array(categories.enumerated()), id: \.element.id) { index, category in
                        Button {
                            Haptics.selection()
                            withAnimation(.easeInOut(duration: 0.22)) {
                                selectedCategoryIndex = index
                            }
                        } label: {
                            AmberPill(
                                text: category.title,
                                systemImage: category.symbolName,
                                isSelected: index == selectedCategoryIndex
                            )
                        }
                        .buttonStyle(.plain)
                        .id(index)
                    }
                }
                .padding(.horizontal, 18)
                .padding(.vertical, 10)
            }
            .background(.ultraThinMaterial)
            .onChange(of: selectedCategoryIndex) { _, newIndex in
                withAnimation {
                    proxy.scrollTo(newIndex, anchor: .center)
                }
            }
        }
    }

    private func categoryHeader(_ category: ExaminationCategory) -> some View {
        VStack(alignment: .leading, spacing: 4) {
            HStack {
                Text("ETAPA \(selectedCategoryIndex + 1) DE \(categories.count)")
                    .font(.caption2.weight(.bold))
                    .tracking(0.8)
                    .foregroundStyle(CandlelightPalette.warmAmber)
                Spacer()
            }
            Text(category.title)
                .font(.system(.title2, design: .serif, weight: .bold))
                .foregroundStyle(CandlelightPalette.ivory)
            Text(category.subtitle)
                .font(.subheadline)
                .foregroundStyle(CandlelightPalette.mutedText)
        }
        .padding(.top, 4)
    }

    private var categoryStepNavigation: some View {
        HStack(spacing: 12) {
            if selectedCategoryIndex > 0 {
                Button {
                    Haptics.selection()
                    withAnimation {
                        selectedCategoryIndex -= 1
                    }
                } label: {
                    HStack {
                        Image(systemName: "chevron.left")
                        Text("Anterior")
                    }
                    .font(.subheadline.weight(.semibold))
                    .foregroundStyle(CandlelightPalette.parchment)
                    .frame(maxWidth: .infinity)
                    .padding(.vertical, 12)
                    .background(RoundedRectangle(cornerRadius: 14).fill(.ultraThinMaterial))
                }
            }

            if selectedCategoryIndex < categories.count - 1 {
                Button {
                    Haptics.selection()
                    withAnimation {
                        selectedCategoryIndex += 1
                    }
                } label: {
                    HStack {
                        Text("Próximo: \(categories[selectedCategoryIndex + 1].title)")
                            .lineLimit(1)
                        Image(systemName: "chevron.right")
                    }
                    .font(.subheadline.weight(.semibold))
                    .foregroundStyle(CandlelightPalette.warmAmber)
                    .frame(maxWidth: .infinity)
                    .padding(.vertical, 12)
                    .background(
                        RoundedRectangle(cornerRadius: 14)
                            .fill(CandlelightPalette.warmAmber.opacity(0.14))
                            .overlay(
                                RoundedRectangle(cornerRadius: 14)
                                    .strokeBorder(CandlelightPalette.warmAmber.opacity(0.35), lineWidth: 1)
                            )
                    )
                }
            }
        }
        .padding(.top, 6)
    }

    private var customEntriesSection: some View {
        LiquidGlassCard(isHighlighted: !store.customEntries.isEmpty) {
            VStack(alignment: .leading, spacing: 12) {
                HStack {
                    Image(systemName: "square.and.pencil")
                        .foregroundStyle(CandlelightPalette.warmAmber)
                    Text("Faltas ou Anotações Avulsas")
                        .font(.headline)
                        .foregroundStyle(CandlelightPalette.ivory)
                    Spacer()
                }

                Text("Adicione qualquer falta específica ou circunstância que não esteja nas perguntas acima:")
                    .font(.caption)
                    .foregroundStyle(CandlelightPalette.mutedText)

                HStack(spacing: 10) {
                    TextField("Ex: Impaciência com colega na terça-feira...", text: $newCustomEntryText)
                        .textFieldStyle(.plain)
                        .font(.subheadline)
                        .foregroundStyle(CandlelightPalette.ivory)
                        .padding(11)
                        .background(RoundedRectangle(cornerRadius: 12).fill(Color.white.opacity(0.06)))
                        .focused($isCustomFieldFocused)
                        .onSubmit {
                            submitCustomEntry()
                        }

                    Button {
                        submitCustomEntry()
                    } label: {
                        Image(systemName: "plus.circle.fill")
                            .font(.title2)
                            .foregroundStyle(
                                newCustomEntryText.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty
                                    ? CandlelightPalette.mutedText
                                    : CandlelightPalette.warmAmber
                            )
                    }
                    .disabled(newCustomEntryText.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty)
                }

                if !store.customEntries.isEmpty {
                    Divider()
                        .overlay(Color.white.opacity(0.10))

                    ForEach(store.customEntries) { entry in
                        HStack(alignment: .top, spacing: 10) {
                            Image(systemName: "circle.fill")
                                .font(.system(size: 6))
                                .foregroundStyle(CandlelightPalette.warmAmber)
                                .padding(.top, 6)

                            Text(entry.text)
                                .font(.subheadline)
                                .foregroundStyle(CandlelightPalette.parchment)
                                .frame(maxWidth: .infinity, alignment: .leading)

                            Button {
                                Haptics.selection()
                                store.removeCustomEntry(id: entry.id)
                            } label: {
                                Image(systemName: "xmark.circle.fill")
                                    .foregroundStyle(CandlelightPalette.mutedText)
                            }
                        }
                        .padding(.vertical, 4)
                    }
                }
            }
        }
    }

    private var bottomFloatingSummaryBar: some View {
        LiquidGlassCard(isHighlighted: store.totalSelectedCount > 0, cornerRadius: 24, padding: 14) {
            HStack(spacing: 14) {
                VStack(alignment: .leading, spacing: 2) {
                    Text("Lista para Confissão")
                        .font(.caption.weight(.semibold))
                        .foregroundStyle(CandlelightPalette.mutedText)
                    Text("\(store.totalSelectedCount) \(store.totalSelectedCount == 1 ? "item marcado" : "itens marcados")")
                        .font(.subheadline.weight(.bold))
                        .foregroundStyle(CandlelightPalette.ivory)
                }

                Spacer()

                NavigationLink {
                    ConfessionalView(store: store)
                } label: {
                    HStack(spacing: 8) {
                        Image(systemName: "cross.fill")
                            .font(.caption.weight(.bold))
                        Text("Ir ao Confessionário")
                            .font(.subheadline.weight(.bold))
                    }
                    .foregroundStyle(CandlelightPalette.obsidian)
                    .padding(.horizontal, 16)
                    .padding(.vertical, 11)
                    .background(
                        Capsule(style: .continuous)
                            .fill(
                                LinearGradient(
                                    colors: [CandlelightPalette.warmAmber, CandlelightPalette.sacredBronze],
                                    startPoint: .topLeading,
                                    endPoint: .bottomTrailing
                                )
                            )
                    )
                }
                .simultaneousGesture(TapGesture().onEnded { Haptics.impactLight() })
            }
        }
        .padding(.horizontal, 16)
        .padding(.bottom, 10)
    }

    private func submitCustomEntry() {
        let trimmed = newCustomEntryText.trimmingCharacters(in: .whitespacesAndNewlines)
        guard !trimmed.isEmpty else { return }
        Haptics.impactLight()
        store.addCustomEntry(trimmed)
        newCustomEntryText = ""
        isCustomFieldFocused = false
    }
}

private struct QuestionCardView: View {
    let question: ExaminationQuestion
    let isSelected: Bool
    let note: String
    let onToggle: () -> Void
    let onUpdateNote: (String) -> Void

    @State private var isEditingNote = false
    @State private var draftNote = ""

    var body: some View {
        LiquidGlassCard(isHighlighted: isSelected, cornerRadius: 18, padding: 15) {
            VStack(alignment: .leading, spacing: 10) {
                Button(action: onToggle) {
                    HStack(alignment: .top, spacing: 12) {
                        ZStack {
                            RoundedRectangle(cornerRadius: 7, style: .continuous)
                                .fill(isSelected ? CandlelightPalette.warmAmber : Color.clear)
                                .frame(width: 24, height: 24)
                                .overlay(
                                    RoundedRectangle(cornerRadius: 7, style: .continuous)
                                        .strokeBorder(
                                            isSelected ? CandlelightPalette.warmAmber : Color.white.opacity(0.28),
                                            lineWidth: 1.5
                                        )
                                )

                            if isSelected {
                                Image(systemName: "checkmark")
                                    .font(.caption.weight(.black))
                                    .foregroundStyle(CandlelightPalette.obsidian)
                            }
                        }
                        .padding(.top, 2)

                        Text(question.text)
                            .font(.subheadline)
                            .foregroundStyle(isSelected ? CandlelightPalette.ivory : CandlelightPalette.ivory.opacity(0.85))
                            .multilineTextAlignment(.leading)
                            .lineSpacing(3)
                            .frame(maxWidth: .infinity, alignment: .leading)
                    }
                }
                .buttonStyle(.plain)

                if isSelected {
                    VStack(alignment: .leading, spacing: 8) {
                        if isEditingNote || !note.isEmpty {
                            TextField(
                                "Nota opcional (ex: frequência ou circunstância)",
                                text: Binding(
                                    get: { isEditingNote ? draftNote : note },
                                    set: { newValue in
                                        draftNote = newValue
                                        onUpdateNote(newValue)
                                    }
                                )
                            )
                            .font(.caption)
                            .foregroundStyle(CandlelightPalette.parchment)
                            .padding(9)
                            .background(RoundedRectangle(cornerRadius: 10).fill(Color.white.opacity(0.06)))
                            .onAppear {
                                draftNote = note
                            }
                        } else {
                            Button {
                                draftNote = note
                                isEditingNote = true
                            } label: {
                                Label("Adicionar nota (frequência/circunstância)", systemImage: "plus.bubble")
                                    .font(.caption2.weight(.semibold))
                                    .foregroundStyle(CandlelightPalette.warmAmber)
                            }
                            .buttonStyle(.plain)
                        }
                    }
                    .padding(.leading, 36)
                }
            }
        }
    }
}
