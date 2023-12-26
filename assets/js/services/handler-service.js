import {HTTPService} from "./http-service";
import { SpinnerComponent } from "../components/spinner";
import { ToastComponent } from "../components/toast";
import { Tab } from "bootstrap";

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

    let cityName;
    let imageCity;

    window.onload =()=> {
      //   //contents are displayed only when whole assets has been loaded
      this.#document.querySelector('#body').removeAttribute('hidden');


      //leaflet tile server script
      if(this.#map == null || this.#map == undefined) this._createMap();

      //prevent unwanted default behavior over elements except for field input and map container elements.
      this.#document.addEventListener("pointerdown", (e) => {
        if(e.target !== this.#document.querySelector("#city") && e.target !== this.#document.querySelector("#map")) {
          e.preventDefault();
        }


        //handles map clicks
        this.#map.on('click', async (event) => {
          var clickedLatLng = event.latlng;
          cityName = "";


          let spinner = new SpinnerComponent(this.#document);   //creates a spinner...
          spinner.start();    //...that appears until data is available.

          await  this.#http.getNearCityByCoords(clickedLatLng.lat, clickedLatLng.lng)
          .then((response)=> {
            if(response)
              cityName = response;
          })
          .catch(err => {
            let toast = new ToastComponent(this.#document);   //creates a toast... 
            toast.createToast("The selected location is not inhabited.<br>Choose another location.");   //...that will be displayed with 'message'.
          });

          spinner.stop();


          if(cityName) {
            this.#document.querySelector("#city").setAttribute('value', cityName);
          }
          else {
            this.#document.querySelector("#city").setAttribute('value', "");
          }
        });
      });


      //handles city-button clicks.
      let searchBtnElem = this.#document.querySelector('#search');
      searchBtnElem.addEventListener('click', async (e)=> {
        let checkDataError= false;
        let toast = new ToastComponent(this.#document);
        cityName = this._normalizeCity(cityName);

        if(cityName) {
          let spinner = new SpinnerComponent(this.#document);   //creates a spinner...
          spinner.start();    //...that appears until data is available.

          await this.#http.getDataForCity(cityName).then((responseData)=>{
            if(responseData)
              console.log(responseData);//TODO TODO TODO TODO
              this.#document.querySelector("#search_container").setAttribute("hidden", true);
              this.#document.querySelector("#new_search_container").removeAttribute("hidden");
              this.#document.querySelector("#map").setAttribute("hidden", true);
              this.#map.remove();   //I have decided to remove and create a new map wherever needed for update issues
          })
          .catch(err => {
            checkDataError = true;
            toast.createToast(
              `There is no lifestyle data available for ${cityName}<br/>`+
              `Usually this type of data is available for very large or important cities<br>`+
              `(cities like Rome, Milan or New York...).`);
          });

          await this.#http.getImageCity(cityName).then((responseImage)=>{    //get an image of the city
            if(responseImage)
              console.log(responseImage);//TODO TODO TODO TODO
          })
          .catch(err => {
            if(checkDataError) {
              toast.append(`<br>There is no image available for ${cityName}`);
              checkDataError = false;
            }
            else {    //If for some unforeseeable reason the application was unable to recover the image :)
              let toastImage = new ToastComponent(this.#document);
              toastImage.createToast(`There is no image available for ${cityName.charAt(0).toUpperCase() + cityName.slice(1)} city.`);
            }
          });

          spinner.stop();
        }
      });

      //Handler for 'new_search' button
      let newSearchBtnElem = this.#document.addEventListener('click', (e)=> {
        this.#document.querySelector("#search_container").removeAttribute("hidden");
        this.#document.querySelector("#new_search_container").setAttribute("hidden", true);
        this.#document.querySelector("#map").removeAttribute("hidden");

         if(this.#map) this._createMap();   //I create a new map to be used by the user(it was removed earlier when we got the city data).
      });

    };

  }

  //this method should be considered private.
  _normalizeCity(value) {
    value = value.toLowerCase();

    if (value.includes("comune di") || value.includes("città di")) {
      let arr = value.split(" ");
      arr.shift();
      arr.shift();

      return arr.join(" ");
    }

    return value;
  }

  //create the map component, this method should be considered private.
  _createMap() {
          //leaflet tile server script
      this.#map = L.map('map').setView([41.902782, 12.496366], 6);
      L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
      }).addTo(this.#map);
  }

}
