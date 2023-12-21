export
class ToastComponent {

  #doc;

  constructor(doc) {
    this.#doc = doc;
  }


  //create a new toast and append it in the body.
  createToast(message="") {
    let toast = this.#doc.createElement(`div`);
    this.#doc.querySelector('#alert_toast').append(toast);

    toast.innerHTML = `<div class="toast" role="alert" aria-live="assertive" aria-atomic="true">`+
                        `<div class="toast-header">`+
                          `<!--<img src="..." class="rounded me-2" alt="...">-->`+
                          `<strong class="me-auto">City Life Style</strong>`+
                          `<small class="text-body-secondary">now</small>`+
                          `<button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>`+
                        `</div>`+
                        `<div class="toast-body">&#x1F612; ${message}</div>`+
                      `</div>`;
    toast.style.top = this.#doc.querySelector('#home').offsetHeight/2-15 + "px";
    toast.style.left = this.#doc.querySelector('#home').offsetWidth/2-15 + "px";
    toast.style.display ="block";
    toast.style.position = "absolute";
    toast.style.zIndex = "2000";
    toast.style.visibility = "visible"
    setTimeout(()=> this.remove(toast), 2000);

  }

  remove(toastElem) {
    toastElem.remove();
  }

}
