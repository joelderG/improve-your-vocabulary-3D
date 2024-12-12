import LanguageHandler from "./LanguageHandler";
import Game from "./Game.js"

export default class GameScreen {
    constructor(config) {
        this.container = document.getElementById("words");
        this.config = config;
        this.languageHandler = new LanguageHandler(this.config.language);
        this.game = new Game(this.config); 
        console.log(this.config)
        this.game.init();
    }

    show(onComplete) {
        this.container.style.display = "block";
        this.container.innerHTML = this.languageHandler.getTranslation(this.game.wordGenerator.word); 

        document
            .getElementById("sceneSelectionScreen")
            .addEventListener("click", (event) => {
                const buttonClicked = event.target; 
                if(buttonClicked.classist.contains(sceneBtn)) {
                    this.config.selectedScene = event.target.value; 
                }
                if(buttonClicked.id == "nextBtn") {
                    onComplete()
                }
            });
    }

    hide() {
        this.container.style.display = "none"; 
    }



}