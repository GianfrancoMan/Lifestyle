import axios from "axios";


export
class HTTPService {

  #latest = null;

  constructor(){
  }


  //returns scores data of the city
  //this method should be considered private
  async getDataForCity(city) {
    return await this._getAvailableDataByPath(await this._dataForCity(city).then(urbanArea => urbanArea), "scores/").then(scores => {
      return [
        scores.data["categories"],
        scores.data["summary"],
        scores.data["teleport_city_score"]
        ];s
    });
  }




  //returns the image of the city if exists
  //this method should be considered private
  async getImageCity(city) {
    return await this._getAvailableDataByPath(await this._dataForCity(city).then(urbanArea => urbanArea), "images/").then(image =>
      image.data.photos[0]["image"]["web"]
    );
  }




  //this method should be considered private
  //this method is the base to get "urban data area" if them exist.
  async _dataForCity(city) {
    let url = import.meta.env.MAN_TELEPORT_ROOT + city;
    const response = await axios.get(url);
    let data = await this._findCityGeonameUrl(response, city);
    return await this._getUrbanArea(data).then((urbanArea) => urbanArea);
  }




  //this should be considered private.
  //Returns "data urban area" path of the city.
  async _getUrbanArea(path) {
    return axios.get(path).then(response => {
      return response.data["_links"]["city:urban_area"]["href"];
    });
  }




  //for others: this should be private.
  //Returns path to retrieve data of the city that can be:
  //1) Lifestyle scores and a brief description of the city.
  //2) An image of the citS.
  //The type is determined by suffix passed as parameter
  async _getAvailableDataByPath(path, suffix) {
    const url = path + suffix;
    return axios.get(url)
    .then(response => response );
  }




  //Asks LocationIq web service for the city closest to the provided coordinates, if it exists.
  async getNearCityByCoords(lat, lng) {
    let path = import.meta.env.MAN_LOCIQ_PREFIX + lat + import.meta.env.MAN_LOCIQ_MIDLE + lng + import.meta.env.MAN_LOCIQ_SUFIX;
    if(this.#latest !== path) {
      this.#latest = path;
      return axios.get(path).then((response) => {
        console.log(response.data);
        if( response.data.address.village)
          return response.data.address.village;

        return response.data.address.city;
      });
    }

    return;
  }




  //If exists, find the Geoname url for the chosen by the user.
  //This method should be considered private
  async _findCityGeonameUrl(resultData , city) {
    return new Promise((resolve, reject )=> {
      let results = resultData.data["_embedded"]["city:search-results"];
      if(results) {
        //Data will be returned only if the the passed by the user match the "alternate name" of the response.
        for(let result of results) {
          for(let matching_alternate_names of result["matching_alternate_names"]) {
            if(matching_alternate_names["name"].toLowerCase() === city.toLowerCase()) {
              console.log(result["_links"]["city:item"]["href"]);
              return resolve(result["_links"]["city:item"]["href"]);
            }
          }
        }
      }
    });
  }

}




