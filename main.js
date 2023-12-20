import './assets/scss/style.scss';
import { MapService } from './assets/js/services/map-service';
import  {ComponentService} from "./assets/js/services/component-service";


let map = L.map('map').setView([41.902782, 12.496366], 6);
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 19,
  attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

new MapService(map);

new ComponentService(document);

