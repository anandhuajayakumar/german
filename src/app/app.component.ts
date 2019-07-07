import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { FormModel } from './models/form.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  constructor(
    private http: HttpClient
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

  submit() {
    console.log(this.user);
    this.http.post('', this.user, )
      .subscribe();
  }

  isFormValid() {
    return this.isValueLessThanZero(this.user.age) &&
      this.isValueLessThanZero(this.user.job) &&
      this.isValueLessThanZero(this.user.creditAmount)&&
      this.isValueLessThanZero(this.user.duration);
  }

  isValueLessThanZero(value) {
    return value == null || value < 0;
  }
}
