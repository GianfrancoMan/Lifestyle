export
class ToastComponent {

  #toast;
  #toastBS;

  constructor(doc) {
    this.#toast = doc.querySelector('.toast');
    this.#toast.style.display = "block";
    this.#toast.style.position = "absolute";
    this.#toast.style.top = doc.querySelector('#home').offsetHeight/2 - (this.#toast.clientHeight/2) + "px";
    this.#toast.style.left = doc.querySelector('#home').offsetWidth/2 - (this.#toast.clientWidth/2) + "px";
    this.#toast.style.zIndex = 1000;
    this.#toast.style.visibility = "hidden";
  }

  //for others: This should be a private method
  _showToast(message) {
    this.#toast.lastChild.textContent = message;
    this.#toast.style.visibility = "visible";
    setTimeout(()=> this.#toast.style.visibility = "hidden", 2000);
  }
}