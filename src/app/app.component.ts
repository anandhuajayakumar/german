import { Component } from '@angular/core';

import { FormModel } from './models/form.model';
import { MyHttpService } from './services/http.servce';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

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
      width: 640,
      height: 640,
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


  submit() {
    this.data[0] = {
      x: [],
      y: [],
      type: 'scatter',
      mode: 'points',
      marker: { color: 'blue' }
    };
    Object.keys(this.user).forEach(
      key => {
        if (isNaN(this.user[key])) {
          this.user[key] = Math.floor(Math.random() * Math.floor(3));
        }
      }
    );
    this.http.post('http://localhost:5000/getChartValues', this.user)
      .subscribe(
        response => {
          this.data[0].x = response['fpr'];
          this.data[0].y = response['tpr'];
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
