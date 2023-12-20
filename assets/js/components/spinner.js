export
class SpinnerComponent {
  #spinner;

  constructor(doc) {
    this.#spinner = doc.querySelector('.spinner');
    this.#spinner.style.position = "absolute";
    this.#spinner.style.top = doc.querySelector('#home').offsetHeight/2-15 + "px";
    this.#spinner.style.left = doc.querySelector('#home').offsetWidth/2-15 + "px";
    this.#spinner.style.zIndex = 1000;
  }

  show(isVisible) {
    if(isVisible) {
      this.#spinner.style.display = "block";
    } else {
      this.#spinner.style.display = "none";
    }
  }
}