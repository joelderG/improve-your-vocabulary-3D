import WordGenerator from "./WordGenerator.js"; // .js hinzugefügt
import Scene from "./Scene.js";
import InteractionHandler from "./InteractionHandler.js";
import Animation from "./Animation.js";
import ModelLoader from "./ModelLoader.js";
import LoadingManager from "./LoadingManager.js";
import TranslationManager from "./TranslationManager.js";

export default class Game {
  constructor(config) {
    if (!config) {
      throw new Error("Game configuration is required");
    }

    try {
      this.config = config;
      this.loadingManager = new LoadingManager();
      this.scene = new Scene(this.config.selectedScene, this.config);
      this.translationManager = new TranslationManager(this.config);
      this.wordGenerator = new WordGenerator(
        this.config,
        this.translationManager
      );

      if (!this.scene.canvas) {
        throw new Error("Canvas element not found");
      }

      this.interactionHandler = new InteractionHandler(
        this.scene.canvas,
        this.scene.camera,
        this.scene.scene,
        this.translationManager
      );

      this.animation = new Animation(
        this.scene.renderer,
        this.scene,
        this.scene.camera
      );

      this.scoreCount = 0;
      this.scene.modelLoader = new ModelLoader(
        this.scene.scene,
        this.loadingManager
      );
      this.scoreChangeCallback = null;

      this.setupEventHandlers();
    } catch (error) {
      console.error("Error initializing game:", error);
      this.handleGameError(error);
    }
  }

  async init() {
    try {
      this.loadingManager.show("Initializing game...");

      // Initialisiere WordGenerator
      this.wordGenerator.init();

      // Lade das 3D-Model
      await new Promise((resolve, reject) => {
        console.log("Loading model from path:", this.config.path);
        this.scene.modelLoader.loadModel(
          this.config.path,
          null, // Kein spezifisches Startobjekt nötig
          (model) => {
            console.log("Model loaded successfully");
            resolve();
          }
        );
      });

      // Generiere erstes Wort
      if (this.wordGenerator.getRemainingWords() > 0) {
        this.wordGenerator.generateRandomWord();
      }

      // Setup der Interaktion
      this.setupInteractionHandlers();

      // Starte Animation
      this.animation.start();

      this.loadingManager.hide();
    } catch (error) {
      console.error("Error initializing game:", error);
      this.loadingManager.hide();
      throw error;
    }
  }

  setupEventHandlers() {
    this.wordGenerator.setOnWordChangeCallback((translatedWord) => {
      try {
        const currentBaseId = this.wordGenerator.getCurrentBaseId();
        this.interactionHandler.setTargetBaseId(currentBaseId);
      } catch (error) {
        console.error("Error in word change handler:", error);
      }
    });

    window.addEventListener("error", (event) => {
      console.error("Global error:", event.error);
      this.handleGameError(event.error);
    });
  }

  setupInteractionHandlers() {
    this.interactionHandler.setOnCorrectObjectClick(() => {
      try {
        this.incrementScore();
        this.wordGenerator.onGenerateNewWord();
      } catch (error) {
        console.error("Error in interaction handler:", error);
      }
    });

    this.interactionHandler.setOnWrongObjectClick(() => {
      console.log("Wrong object clicked");
      // Optional: Hier könnten wir Fehlversuche zählen
    });

    this.interactionHandler.setOnSkipClick(() => {
      this.wordGenerator.onGenerateNewWord();
    });
  }

  handleGameError(error) {
    console.error("Game error occurred:", error);
    if (!this.isInitialized) {
      console.log("Attempting to recover from initialization error...");
    }
  }

  setOnScoreChangeCallback(callback) {
    this.scoreChangeCallback = callback;
  }

  incrementScore() {
    this.scoreCount++;
    console.log("Score updated in Game:", this.scoreCount);
    if (this.scoreChangeCallback) {
      this.scoreChangeCallback(this.scoreCount);
    }
  }
}
