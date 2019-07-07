import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { throwError } from 'rxjs';

import { catchError, timeout } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class MyHttpService {

    accessToken: any;

    constructor(
        private http: HttpClient,
    ) { }

    public post(path, data: any) {
        const body = JSON.stringify(data);
        const httpHeaders = this.addTokenToHeader();
        return this.http.post(path, body, httpHeaders)
            .pipe(
                timeout(600000),
                catchError(error =>
                    this.handleErrorObservable(error)
                ));
    }

    public get(path, data = {}) {
        const httpHeaders = this.addTokenToHeader();
        return this.http.get(path, httpHeaders)
            .pipe(
                timeout(600000),
                catchError(error =>
                    // throwError(error)
                    this.handleErrorObservable(error)
                ));
    }

    private handleErrorObservable(error: Response | any) {
        if (error.status === 401) {
            alert('Session expired!');
            window.location.assign('/');
        } else {
            return throwError(error || 'Server error');
        }
    }

    private addTokenToHeader() {
        const header = { 'Content-Type': 'application/json' };
        return { headers: new HttpHeaders(header) };
    }

}
