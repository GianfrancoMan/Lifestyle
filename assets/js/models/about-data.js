import { Score } from "./score";


export 
class AboutData {
  city;
  scores = [];
  description;
  totalScore;

  constructor(data) {
    this.city = data[0];
    this._setScores(data[1]);
    this.description = data[2];
    this.totalScore = data[3];
  }

  _setScores(values) {
    for(let sc of values) {
      let score = new Score(sc.color, sc.score_out_of_10, sc.name);
      this.scores.push(score);
    }
  }
}