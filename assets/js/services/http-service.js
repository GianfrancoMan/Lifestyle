import axios from "axios";


export
class HTTPService {

  #latest = null;

  constructor(){
  }


  //returns scores data of the city
  //this method should be considered private
  async getDataForCity(city, countryCode) {
    return await this._getAvailableDataByPath(await this._dataForCity(city, countryCode).then(urbanArea => urbanArea), "scores/").then(scores => {
       let arr = scores.data["_links"]["self"]["href"].split('/');
       arr = arr[scores.data["_links"]["self"]["href"].split('/').length -3].split(':');
      return [
        arr[1],
        scores.data["categories"],
        scores.data["summary"],
        scores.data["teleport_city_score"]
        ];s
    });
  }




  //returns the image of the city if exists
  //this method should be considered private
  async getImageCity(city, countryCode, type = "web") {
    return await this._getAvailableDataByPath(await this._dataForCity(city, countryCode).then(urbanArea => urbanArea), "images/").then(image => {
      return image.data.photos[0]["image"][`${type}`];
    });
  }




  //this method should be considered private
  //this method is the base to get "urban data area" if them exist.
  async _dataForCity(city, countryCode) {
    let url = import.meta.env.MAN_TELEPORT_ROOT + city;
    const response = await axios.get(url);
    if(response.data.count === 0) throw new Error();
    let data = await this._findCityGeonameUrl(response, city, countryCode);
    return await this._getUrbanArea(data).then((urbanArea) => urbanArea);
  }




  //this should be considered private.
  //Returns "data urban area" path of the city.
  async _getUrbanArea(path) {
    return axios.get(path).then(response => {
      if(response.data["_links"]["city:urban_area"]["href"]) {
        return response.data["_links"]["city:urban_area"]["href"];
      }
      else throw new Error();
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
    .then(response => {
      if (response)
        return response

        else
          throw new Error();
     });
  }




  //Asks LocationIq web service for the city closest to the provided coordinates, if it exists.
  async getNearCityByCoords(lat, lng) {
    let result;
    let path = import.meta.env.MAN_LOCIQ_PREFIX + lat + import.meta.env.MAN_LOCIQ_MIDLE + lng + import.meta.env.MAN_LOCIQ_SUFIX;
    if(this.#latest !== path) {
      this.#latest = path;
      let cityAndCode = [];
      return axios.get(path).then((response) => {
        console.log(response);
        cityAndCode.push(response.data.address.country_code);
        if( response.data.address.city) {
          cityAndCode.push(response.data.address.city);
          return cityAndCode;
        } else if(response.data.address.county) {
          cityAndCode.push(response.data.address.county);
            return cityAndCode;
          } else if(response.data.address.municipality) {
            cityAndCode.push(response.data.address.municipality);
            return cityAndCode;
          } else if(response.data.address.village) {
            cityAndCode.push(response.data.address.village);
              return cityAndCode;
            }

        else throw new Error();
      });
    }

    return;
  }




  //If exists, find the Geoname url for the chosen by the user.
  //This method should be considered private
  async _findCityGeonameUrl(resultData , city, countryCode) {
    let countryName;
    /*the country code exists only if the user has selected the location from the map,
    selecting the location from the map is the safest way to obtain correct data
    because having the latitude and longitude available allows you to carry out checks to avoid
    recovering incorrect data desired by places of the same name.*/
    if(countryCode !== "no_code") {
      let countriesPath = import.meta.env.MAN_TELEPORT_COUNTRIES;
      let countries = await axios.get(countriesPath);
      for(let country of countries.data["_links"]["country:items"]) {
        if(countryCode.toLowerCase() === this._getCode(country.href)) {
          countryName = country.name.toLowerCase();
        }
      }
    }
    return new Promise((resolve, reject )=> {
      let results = resultData.data["_embedded"]["city:search-results"];
      if(results) {
        /*Data will be returned only if the the place passed by the user match the "alternate name" of the response.
        This is due to the fact that sometimes there are places that have the same name but one can be a city or a village,
        and another a city neighborhood that we have not chosen, but if the latter has an urban area address ',
        could be returned instead of the desired one.*/
        for(let result of results) {
          let currentCountryName = result.matching_full_name.split(',');
          currentCountryName = currentCountryName[currentCountryName.length-1].toLowerCase().trim().split(" ")[0];
          if(currentCountryName === countryName || countryCode === "no_code") {
            for(let matching_alternate_names of result["matching_alternate_names"]) {
              if(matching_alternate_names["name"].toLowerCase() === city.toLowerCase()) {
                return resolve(result["_links"]["city:item"]["href"]);
              }
            }
          }
        }
        throw new Error();
      }
    });
  }

  
  _getCode(countryHref) {
    let code = countryHref.split('/');
    code = code[code.length-2].split(':')[1].toLowerCase();
    return code;
  }

}




