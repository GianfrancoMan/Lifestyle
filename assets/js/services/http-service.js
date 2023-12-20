import axios from "axios";


export
class HTTPService {

  #latest = null;

  constructor(){}


  async getDataForCity(city) {
    let url = MAN_TELEPORT_ROOT + city;
    try {
      try {
        const response = await axios.get(url);
        // handle success
        let data = response.data._embedded["city:search-results"][0]["_links"]["city:item"].href;
        let urbanAreaPath = await this._getUrbanArea(data).then((urbanArea) => urbanArea);
        return await this._getScores(urbanAreaPath).then(scores => scores);
      } catch (error) {
        // handle error
        console.log(error + " " + url);
      }
    } finally {
      // always executed
      console.log("Always executed.");
    }
  }

  //for others: this should be private.
  async _getUrbanArea(path) {
    return axios.get(path)
    .then(response => response.data["_links"]["city:urban_area"]["href"]);
  }

  //for others: this should be private.
  async _getScores(path) {
    const url = path.slice(0, -1) + "/scores/";
    return axios.get(url)
    .then(response => [
      response.data["categories"], 
      response.data["summary"], 
      response.data["teleport_city_score"]
    ]);
  }

  //for others: this should be private.
  async _getNearCityByCoords(lat, lng) {
    let path = import.meta.env.MAN_NEARBY_PREFIX + lat + import.meta.env.MAN_NEARBY_MID + lng + import.meta.env.MAN_NEARBY_SUFFIX;
    if(this.#latest !== path) {
      this.#latest = path;
      return axios.get(path)
      .then((response) => response.data['geonames'][0]['name']);
    }
    return;
  }
}




