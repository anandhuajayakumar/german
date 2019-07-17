import { Component, OnInit } from '@angular/core';

import { FormModel } from './models/form.model';
import { MyHttpService } from './services/http.servce';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  eligibilityStatus = null;
  accuracy = null;
  rocAuc = null;
  showResult = false;

  constructor(
    private http: MyHttpService
  ) { }

  user = new FormModel();

  genders = [
    'male',
    'female'
  ];

  risks = [
    'good',
    'bad'
  ];

  housings = [
    'own',
    'free',
    'rent'
  ];

  accountTypes = [
    'little',
    'moderate',
    'rich',
    'quite rich',
  ];

  purposes = [
    'business',
    'car',
    'domestic appliances',
    'education',
    'furniture/equipment',
    'radio/TV',
    'repairs',
    'vacation/others'
  ];

  jobs = [
    0,
    1,
    2,
    3
  ];

  graph = {
    layout: {
      width: 500,
      height: 500,
      xaxis: {
        linecolor: 'black',
        linewidth: 1,
        mirror: true,
        title: 'False Positive Rate',
        range: [0, 1],
      },
      yaxis: {
        linecolor: 'black',
        linewidth: 1,
        mirror: true,
        title: 'True Positive Rate',
        range: [0, 1],
      },
      title: 'Receiver Operating Characteristic'
    }
  };

  data = [{
    x: [],
    y: [],
    type: 'scatter',
    mode: 'points',
    marker: { color: 'red' },
    name: ''
  },
  {
    x: [0, 1],
    y: [0, 1],
    mode: 'lines',
    line: {
      dash: 'dot',
      width: 2
    },
    marker: { color: 'red' },
  }];

  ngOnInit() {
    this.getInitalChart();
  }

  getInitalChart() {

    this.showResult = false;
    this.data[0] = {
      x: [],
      y: [],
      type: 'scatter',
      mode: 'points',
      marker: { color: 'blue' },
      name: ''
    };
    Object.keys(this.user).forEach(
      key => {
        if (isNaN(this.user[key])) {
          this.user[key] = Math.floor(Math.random() * Math.floor(3));
        }
      }
    );
    this.http.post('http://localhost:5000/getInitialChartValues', this.user)
      .subscribe(
        response => {
          this.data[0].x = response['fpr'];
          this.data[0].y = response['tpr'];
          this.data[0].name = 'AUC = ' + Number(response['roc_auc']).toFixed(2);
          this.accuracy = Number(response['accuracy']).toFixed(2);
          this.rocAuc = Number(response['roc_auc']).toFixed(2);
          this.showResult = true;
        }, error => {
          console.error(error);
        }
      );

  }

  submit() {

    this.showResult = false;
    this.data[0] = {
      x: [],
      y: [],
      type: 'scatter',
      mode: 'points',
      marker: { color: 'blue' },
      name: ''
    };
    Object.keys(this.user).forEach(
      key => {
        if (isNaN(this.user[key])) {
          this.user[key] = Math.floor(Math.random() * Math.floor(3));
        }
      }
    );
    this.http.post('http://localhost:5000/predictValue', this.user)
      .subscribe(
        response => {
          this.data[0].x = response['fpr'];
          this.data[0].y = response['tpr'];
          this.data[0].name = 'AUC = ' + Number(response['roc_auc']).toFixed(2);
          this.accuracy = Number(response['accuracy']).toFixed(2);
          this.rocAuc = Number(response['roc_auc']).toFixed(2);
          this.showResult = true;
          this.eligibilityStatus = response['prediction'][0] === 1;
        }, error => {
          console.error(error);
        }
      );
  }

  isFormValid() {
    const valid = Object.values(this.user).map(this.isValueLessThanZero);
    return valid.filter(x => x).length === valid.length;
  }

  isValueLessThanZero(value) {
    if (!isNaN(value) && value != null) {
      if (Number(value) === value) {
        return Number(value) > 0;
      } else {
        return Number(value) >= 0;
      }
    } else {
      return false;
    }
  }
}
