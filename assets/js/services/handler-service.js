import {HTTPService} from "./http-service";
import { SpinnerComponent } from "../components/spinner";
import { ToastComponent } from "../components/toast";
import { AboutComponent } from "../components/about-city";
import { AboutData } from "../models/about-data";
import { functions } from "../services/functions";

export
class HandlerService {

  #window;
  #document = null;
  #http;
  #map;


  constructor(window, doc, L) {
    this.#window = window;
    this.#document = doc;
    this.#http = new HTTPService(doc);
    this._handlerEvent();
  }



  _handlerEvent() {

    let aboutComponent = new AboutComponent(this.#document);
    let cityName;
    let imageCity;

    window.onload = ()=> {
      //contents are displayed only when whole assets has been loaded
      this.#document.querySelector('#body').removeAttribute('hidden');


      //leaflet tile server script
      this._createMap();

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
            toast.createToast("The selected location is not inhabited,<br>or is not covered by the web service.<br>Choose another location.");   //...that will be displayed with 'message'.
          });

          spinner.stop();


          if(cityName) {
            this.#document.querySelector("#city").value = cityName;
          }
        });
      });


      //handles city-button clicks.
      let searchBtnElem = this.#document.querySelector('#search');
      searchBtnElem.addEventListener('click', async (e)=> {
        let checkDataError= false;
        let toast = new ToastComponent(this.#document);
        cityName = this.#document.querySelector("#city").value;

        if(cityName) {
          cityName = this._normalizeCity(cityName);
          let spinner = new SpinnerComponent(this.#document);   //creates a spinner...
          spinner.start();    //...that appears until data is available.

          await this.#http.getDataForCity(cityName).then((responseData)=>{
            if(responseData) {
              this.#map.remove();   //I have decided to remove and create a new map wherever needed for update issues
              let aboutData = new AboutData(responseData);
              this.#document.querySelector("#search_container").setAttribute("hidden", true);
              this.#document.querySelector("#new_search_container").removeAttribute("hidden");
              this.#document.querySelector(".about-city").removeAttribute("hidden");
              this.#document.querySelector("#map").setAttribute("hidden", true);
              aboutComponent.add(aboutData);
              this.#document.querySelector("#city").value = "";
            }
          })
          .catch(err => {
            checkDataError = true;

            toast.createToast(
              `There is no lifestyle data available for ${ functions._ucFirst(cityName)}<br/>`+
              `Usually this type of data is available for very large or important cities<br>`+
              `(cities like Rome, Milan or New York...).`);
              this.#document.querySelector("#city").value = "";
          });

          let type = this.#window.screenX > 700 ? "web" : "mobile";   //chooses the  image to display based on the screen size.
          await this.#http.getImageCity(cityName, type).then((responseImage)=>{    //get an image of the city
              aboutComponent.setImage(responseImage);
          })
          .catch(err => {
            if(checkDataError) {
              toast.append(`<br>There is no image available for ${functions._ucFirst(cityName)}`);
              checkDataError = false;
            }
            else {    //If for some unforeseeable reason the application was unable to recover the image :)
              let toastImage = new ToastComponent(this.#document);
              toastImage.createToast(`There is no image available for ${functions._ucFirst(cityName)} city.`);
            }
          });

          spinner.stop();
        }
      });

      //Handler for 'new_search' button
      let newSearchBtnElem = this.#document.querySelector('#new_search');
      newSearchBtnElem.addEventListener('click', (e)=> {
        if(e.target != newSearchBtnElem) return;

        this.#document.querySelector("#search_container").removeAttribute("hidden");
        this.#document.querySelector("#new_search_container").setAttribute("hidden", true);
        this.#document.querySelector(".about-city").setAttribute("hidden", true);
        this.#document.querySelector("#map").removeAttribute("hidden");

        this.#document.querySelector("#city").value = "";

        aboutComponent.remove();
        this._createMap();   //I create a new map to be used by the user(it was removed earlier when we got the city data).
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
