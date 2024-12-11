export default class StartScreen {
    constructor(config) {
        this.container = document.getElementById("startScreen");
        this.config = config; 
    }

    show(onComplete) {
        this.container.style.display = "block";

        document.querySelectorAll('.selection-container > div').forEach((container) => {
            let previouslySelectedButton = null;
          
            container.addEventListener('click', (event) => {
              if (event.target.tagName === 'BUTTON') {
                const clickedButton = event.target;
          
                if (previouslySelectedButton) {
                  previouslySelectedButton.classList.remove('selected');
                }
          
                clickedButton.classList.add('selected');
          
                previouslySelectedButton = clickedButton;
          
                if (clickedButton.hasAttribute('data-language')) {
                  this.config.language = clickedButton.getAttribute('data-language');
                  console.log('Language selected:', this.config.language);
                } else if (clickedButton.hasAttribute('difficulty-level')) {
                  this.config.difficulty = clickedButton.getAttribute('difficulty-level');
                  console.log('Difficulty selected:', this.config.difficulty);

                } else if (clickedButton.id == "nextBtn") {
                    if(this.config.difficulty && this.config.language) {
                        onComplete();
                    } else {
                        alert("Select a language and a difficulty level!")
                    }
                }
              }
            });
          });
          
    
    }

    hide() {
        this.container.style.display = "none";
    }
}
