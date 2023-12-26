import axios from "axios";


export
class HTTPService {

  #latest = null;

  constructor(){
  }


  async getDataForCity(city) {
    return await this._getScores(await this._dataForCity(city).then(urbanArea => urbanArea), "scores/").then(scores => {
      return [
        scores.data["categories"],
        scores.data["summary"],
        scores.data["teleport_city_score"]
        ];s
    });
  }

  async getImageCity(city) {
    return await this._getScores(await this._dataForCity(city).then(urbanArea => urbanArea), "images/").then(image =>
      image.data.photos[0]["image"]["mobile"]
    );
  }

  //this method should be considered private
  async _dataForCity(city) {
    let url = import.meta.env.MAN_TELEPORT_ROOT + city;
    const response = await axios.get(url);
    let data = await this._findCityGeonameUrl(response, city);//response.data["_embedded"]["city:search-results"][0]["_links"]["city:item"]["href"];
    return await this._getUrbanArea(data).then((urbanArea) => urbanArea);
  }

  //for others: this should be private.
  async _getUrbanArea(path) {
    return axios.get(path).then(response => {
      return response.data["_links"]["city:urban_area"]["href"];
    });
  }

  //for others: this should be private.
  async _getScores(path, suffix) {
    const url = path + suffix;
    return axios.get(url)
    .then(response => response );
  }

  //
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

  _normalize(value) {
    arr = value.split(",");
    return arr[0].toLowerCase();
  }

  //If exists, find the Geoname url for the chosen by the user.
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




