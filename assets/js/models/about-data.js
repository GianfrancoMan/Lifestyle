import { Score } from "./score";


export 
class AboutData {
  scores = [];
  description;
  totalScore;

  constructor(data) {
    this._setScores(data[0]);
    this.description = data[1];
    this.totalScore = data[2];
  }

  _setScores(values) {
    for(let sc of values) {
      let score = new Score(sc.color, sc.score_out_of_10, sc.name);
      this.scores.push(score);
    }
  }
}