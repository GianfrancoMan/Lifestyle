import axios from "axios";


export
class HTTPService {

  #latest = null;
  #dataForScores = {};

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
    let data = response.data["_embedded"]["city:search-results"][0]["_links"]["city:item"]["href"];
    return await this._getUrbanArea(data).then((urbanArea) => urbanArea);
  }

  //for others: this should be private.
  async _getUrbanArea(path) {
    return axios.get(path).then(response => {
      return response.data["_links"]["city:urban_area"]["href"]
    });
  }

  //for others: this should be private.
  async _getScores(path, suffix) {
    const url = path + suffix;
    return axios.get(url)
    .then(response => response );
  }

  async getNearCityByCoords(lat, lng) {
    let path = import.meta.env.MAN_LOCIQ_PREFIX + lat + import.meta.env.MAN_LOCIQ_MIDLE + lng + import.meta.env.MAN_LOCIQ_SUFIX;
    if(this.#latest !== path) {
      this.#latest = path;
      return axios.get(path).then((response) => {
        if( response.data.address.village)
          return response.data.address.village;

        return response.data.address.city;
      });
    }

    return;
  }

}




