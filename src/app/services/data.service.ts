import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { environment } from './../../environments/environment';
import { Observable } from 'rxjs/Observable';
import { IRecord } from './../../../server/common/interfaces';

@Injectable()
export class DataService {

    constructor(private http: HttpClient) {}

    getData(sortBy ? :number[], filterBy ?, offset ? :number ) :Observable<any> {  

        let params = new HttpParams();        
        if (sortBy) {
            if (sortBy[0] !== null) params = params.append('sortby', sortBy[0].toString());
            if (sortBy[1] !== null) params = params.append('sort_direction', sortBy[1].toString());
        }
        if (filterBy) {
            if (filterBy.clientName) params = params.append('clientName', filterBy.clientName.trim());
            if (filterBy.provider) params = params.append('provider', filterBy.provider.trim());
            if (filterBy.fileName) params = params.append('fileName', filterBy.fileName.trim());
        }
        if(offset) params = params.append('offset', offset.toString());
        
        return this.http.get(environment.rootUrl + '/data', {params: params});
    }


    getSingleData(id :number) {
        return this.http.post(environment.rootUrl + '/data/single', { id: id });
    }
    
}