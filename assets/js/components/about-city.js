export
class AboutComponent {

  #document;
  #elem;
  #imageElem;



  constructor(doc) {
    this.#document = doc;
    this.#elem = this.#document.createElement('div');
    this.#document.querySelector('#home').append(this.#elem);
    this.#elem.setAttribute("hidden", true);
    this.#elem.className = "about-city";
  }

  add(data) {
    //append whole score values
    let i = 0;
    for(let score of data.scores) {
      let scoreParagraph  = this.#document.createElement('div');
      this.#elem.append(scoreParagraph);
      scoreParagraph.setAttribute('class', "score-paragraph");
      scoreParagraph.setAttribute('id', `score-${i}`);
      scoreParagraph.innerHTML = `<div class="score-elem">`+
                                  `<div style="color:blue; width:33%;">${score.name}</div>`+
                                  `<div  style="width:33%">`+
                                    `<div id="div_color_container">`+
                                      `<div class="score-color" style="width:${score.score_out_of_10 * 20}px; background-color:${score.color}"></div>`+
                                      `<div class="complement-div" style="width:${200-score.score_out_of_10*20 }px;"></div>`+
                                    `</div>`+
                                  `</div>`+
                                  `<div style="color:blue;text-align:right;width:33%;">${score.score_out_of_10.toFixed(3)}</div>`+
                                 `</div>`;
      i++;
    }
    //append total score
    let total = this.#document.createElement('div');
    this.#elem.append(total);
    total.innerHTML = `<div class="score-paragraph">`+
                        `<div class="score-elem">`+
                          `<div style="margin-top: 10px;"><strong>Total Rating: ${data.totalScore.toFixed(3)}</strong></div>`+
                        `</div>`+
                      `</div>`+
                      `<div class="score-paragraph">`+
                        `<div class="score-elem">`+
                          `<div style="margin-top: 10px;text-align:justify">${data.description}</div>`+
                        `</div>`+
                      `</div>`;
  }

  setImage(imageUrl) {
    this.#imageElem = this.#document.createElement('div');
    this.#elem.append(this.#imageElem);
    this.#imageElem.className = "image";
    this.#imageElem.innerHTML =` <img src=${imageUrl} alt="vista di una citta" style="width:100%;"></img>`
  }

  remove() {
    let scoreElements = this.#elem.querySelectorAll('.score-paragraph');
    for(let scoreElem of scoreElements) {
        scoreElem.remove();
    }
    if(this.#imageElem)
      this.#imageElem.remove();
  }
}