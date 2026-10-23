import SwiftUI

@main
struct ExameConscienciaApp: App {
    @Environment(\.scenePhase) private var scenePhase
    @State private var store = ExaminationStore()

    var body: some Scene {
        WindowGroup {
            ZStack {
                HomeView(store: store)
                    .preferredColorScheme(.dark)

                if scenePhase != .active {
                    PrivacyBlurView()
                        .transition(.opacity)
                        .zIndex(999)
                }
            }
            .animation(.easeInOut(duration: 0.18), value: scenePhase)
        }
    }
}
