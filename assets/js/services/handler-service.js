import {HTTPService} from "./http-service";
import { SpinnerComponent } from "../components/spinner";
import { ToastComponent } from "../components/toast";

export
class HandlerService {

  #document = null;
  #http;
  #map;

  constructor(doc, L) {
    this.#document = doc;
    this.#http = new HTTPService(doc);
    this._handlerEvent();

  }

  _handlerEvent() {
    window.onload =()=> {
      //   //contents are displayed only when whole assets has been loaded
      this.#document.querySelector('#body').removeAttribute('hidden');


      //leaflet tile server script
      this.#map = L.map('map').setView([41.902782, 12.496366], 6);
      L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
      }).addTo(this.#map);

      //prevent unwanted default behavior over elements except for field input and map container elements.
      this.#document.addEventListener("pointerdown", (e) => {
        if(e.target !== this.#document.querySelector("#city") && e.target !== this.#document.querySelector("#map")) {
          e.preventDefault();
        }

        let cityButton = this.#document.querySelector('#id_btn');

        //handles map clicks
        this.#map.on('click', async (event) => {
          var clickedLatLng = event.latlng;
          let cityName = "";


          let spinner = new SpinnerComponent(this.#document);

          spinner.start();
          await  this.#http.getNearCityByCoords(clickedLatLng.lat, clickedLatLng.lng)
          .then((response)=> {
            if(response)
              cityName = response;
          })
          .catch(err => {
            console.log(err.message);
            let toast = new ToastComponent(this.#document);
            toast.createToast("The selected place isn't inhabited.")
          });

          spinner.stop();

          if(cityName) this.#document.querySelector("#city").setAttribute('value', cityName);
          else {
            this.#document.querySelector("#city").setAttribute('value', "");
          }
        });
      });


      //handles city-button clicks.
      let btnElem = this.#document.querySelector('#id_btn');
      btnElem.addEventListener('click', async (e)=> {
        let cityName = this.#document.querySelector('#city').value;
        if(cityName) {
          console.log(cityName);
          await this.#http.getDataForCity(cityName).then((response)=>{
            if(response)
              console.log(response);//TODO TODO TODO TODO
          });
        }
      });

    };

  }

}