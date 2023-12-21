export
class SpinnerComponent {
  #spinner;
  #doc;

  constructor(doc) {
    this.#doc = doc;
  }

  start() {
    if(this.#spinner) this.#spinner.remove();
    this.#spinner = this.#doc.createElement('div');
    this.#spinner.innerHTML = `<div class="spinner-grow text-success spinner" role="status"><span class="visually-hidden">Loading...</span></div>`;
    this.#spinner.style.position = "absolute";
    this.#spinner.style.top = this.#doc.querySelector('#home').offsetHeight/2-15 + "px";
    this.#spinner.style.left = this.#doc.querySelector('#home').offsetWidth/2-15 + "px";
    this.#spinner.style.zIndex = 1000;
    this.#doc.querySelector("#home").append(this.#spinner);
  }

  stop() {
    if(this.#spinner) this.#spinner.remove();
    this.#spinner = undefined;
  }
}
