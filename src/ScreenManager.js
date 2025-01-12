import StartScreen from "./StartScreen";
import SceneSelectionScreen from "./SceneSelectionScreen"
import GameScreen from "./GameScreen";
import FinishScreen from "./FinishScreen";

export default class ScreenManager {

    constructor(configuration) {
        this.currentScreen = null;
        this.config = configuration;
    }

    // Wechselt den aktuellen Screen
    changeScreen(newScreen) {
        if (this.currentScreen) {
            this.currentScreen.hide(); // Vorherigen Screen ausblenden
        }

        this.currentScreen = newScreen;
        this.currentScreen.show(() => this.nextScreen());
    }

    // Wechselt zum nächsten Zustand basierend auf der Konfiguration
    nextScreen() {
        if(!this.config.language){
            this.changeScreen(new StartScreen(this.config));
        } else if (!this.config.selectedScene) {
            this.changeScreen(new SceneSelectionScreen(this.config));
        } else if(!this.config.gameFinished) {
            this.changeScreen(new GameScreen(this.config))
        } else {
            this.changeScreen(new FinishScreen(this.config))
        }
    }
}
