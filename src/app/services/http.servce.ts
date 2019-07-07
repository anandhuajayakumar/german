import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Rx';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/toPromise';
@Injectable({
    providedIn: 'root'
})
export class BackEndService {

    accessToken: any;

    constructor(
        private http: HttpClient,
    ) { }

    public post(data: any, path) {
        const body = JSON.stringify(data);
        const httpHeaders = new HttpHeaders(this.addTokenToHeader());
        return this.http.post(path, body, { headers: httpHeaders })
            .map(this.extractData)
            .catch(this.handleErrorObservable);
    }

    public get(path, data = {}) {
        // const httpHeaders = new HttpHeaders({
        //     'Content-Type': 'application/json'
        //     , 'Authorization': 'Token ' + this.cookiesService.getCookie('token')
        // });
        const httpHeaders = new HttpHeaders(this.addTokenToHeader());
        return this.http.get(path, { params: data, headers: httpHeaders }).map(this.extractData)
            .catch(this.handleErrorObservable);

        // const httpHeaders = new HttpHeaders(this.addTokenToHeader(authorize));
        // console.log(httpHeaders.get('Content-Type'));
        // console.log(httpHeaders.get('Authorization'));
        // return this.http.get(path, { params: data, headers: httpHeaders }).map(this.extractData)
        //     .catch(this.handleErrorObservable);
    }

    private extractData(res: Response) {
        const body = res;
        if (body == null) {
            return {};
        }
        return body;
    }

    private handleErrorObservable(error: Response | any) {
        if (error.status === 401) {
            alert('Session expired!');
            window.location.assign('/');
        } else {
            return Observable.throwError(error.message || error);
        }

    }

    private addTokenToHeader() {
        const header = { 'Content-Type': 'application/json' };
        return header;
    }

}
