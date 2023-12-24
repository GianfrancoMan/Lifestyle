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
                              `<p id="text_content">&#x1F612;<br>${message}</p>`+
                            `</div>`;
    this.#toast.style.position= "absolute";
    this.#toast.style.width= "fit-content";
    this.#toast.style.height= "200px";
    this.#toast.style.backgroundColor= "rgb(90, 146, 158)" ;
    this.#toast.style.color= "rgb(128, 36, 13);";
    this.#toast.style.zIndex= 2000;
    this.#toast.style.top = this.#doc.querySelector('#home').offsetHeight/2 - this.#toast.clientHeight/2 + "px";
    this.#toast.style.left = this.#doc.querySelector('#home').offsetWidth/2 - this.#toast.clientWidth/2 + "px";
    this.#toast.style.display = "flex";
    this.#toast.style.justifyContent = "center";
    this.#toast.style.alignItems= "center";
    this.#toast.style.borderRadius= "15px";
    this.#toast.style.padding= "5px";
    this.#toast.style.boxShadow= "rgb(128, 36, 13) 5px -5px 5px, rgb(255, 51, 0) -5px 5px 5px";


    //creates the close button of the toast
    let closeToast = this.#doc.createElement('span');
    this.#toast.append(closeToast);
    closeToast.innerHTML = '<strong id="close">[X]</strong>';
    closeToast.style.position = "relative";
    closeToast.style.fontSize = "18px";
    let close = this.#doc.querySelector("#close");
    close.style.position = "absolute";
    close.style.top = -this.#toast.clientHeight/2 + "px";
    close.style.left = -close.clientWidth + "px";


    //listener
    this.#toast.addEventListener('click', (e)=> {
      if(e.target === this.#doc.querySelector("#close")) this.remove();
    });
  }

  //append a text on the current message
  append(message) {
    let textElem = this.#doc.querySelector("#text_content");
    textElem.innerHTML += message;
  }

  remove() {
    this.#toast.remove();
  }


}
