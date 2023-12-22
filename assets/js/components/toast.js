export
class ToastComponent {
  #toast;
  #doc;

  constructor(doc) {
    this.#doc = doc;
  }


  //create a new this.#toast and append it in the body.
  createToast(message="") {
    this.#toast = this.#doc.createElement(`div`);
    this.#doc.querySelector('#home').append(this.#toast);

    this.#toast.innerHTML = `<div>`+
                              `<p>&#x1F612;<br>${message}</p>`+
                            `</div>`;
    this.#toast.style.position= "absolute";
    this.#toast.style.width= "fit-content";
    this.#toast.style.height= "200px";
    this.#toast.style.backgroundColor= "rgb(90, 146, 158)" ;
    this.#toast.style.color= "rgb(128, 36, 13);";
    this.#toast.style.zIndex= 2000;
    this.#toast.style.top = this.#doc.querySelector('#home').offsetHeight/2-15 - this.#toast.clientHeight/2 + "px";
    this.#toast.style.left = this.#doc.querySelector('#home').offsetWidth/2-15 - this.#toast.clientWidth/2 + "px";
    this.#toast.style.display = "flex";
    this.#toast.style.justifyContent = "center";
    this.#toast.style.alignItems= "center";
    this.#toast.style.borderRadius= "15px";
    this.#toast.style.padding= "5px";
    setTimeout(()=> this.remove(), 5000);
  }

  remove() {
    this.#toast.remove();
  }

}
