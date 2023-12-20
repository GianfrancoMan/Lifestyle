import {HTTPService} from "./http-service";
import { MapService } from "./map-service";
import { SpinnerComponent } from "../components/spinner";
import { ToastComponent } from "../components/toast";

export
class ComponentService {

  #document = null;
  #http;
  #spinner;
  #toast;

  constructor(doc) {
    this.#document = doc;
    this.#http = new HTTPService();
    this.#spinner = new SpinnerComponent(doc);
    this.#toast = new ToastComponent(doc);
    this._handlerEvent();
  }

  _handlerEvent() {
    this.#spinner.show(false);
    this.#document.addEventListener("pointerdown", (e) => {
      if(e.target !== this.#document.querySelector("#city") && e.target !== this.#document.querySelector("#map")) {
        e.preventDefault();
        }

      MapService.map.on('click', async (event) => {

        var clickedLatLng = event.latlng;
        let cityName = "";

        this.#spinner.show(true);

        await  this.#http._getNearCityByCoords(clickedLatLng.lat, clickedLatLng.lng)
          .then((response)=> cityName = response)
          .catch(err =>{
            cityName = "";
            this.#toast._showToast(" There are no data for this place.");
          });

        this.#spinner.show(false);

        if(cityName !== "") this.#document.querySelector("#city").setAttribute('value', cityName);
        else {
          this.#document.querySelector("#city").setAttribute('value', "");
        }

      });

   });
 }
}