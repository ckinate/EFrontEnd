import {Injectable} from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AppConsts } from '@shared/AppConsts';
//import {Observable} from 'rxjs/Observable';
 
const httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};
 
@Injectable()
export class CustomService {
   url: any;

    remoteServiceBaseUrl = AppConsts.remoteServiceBaseUrl;
    constructor(private http:HttpClient) {}
   
    // Uses http.get() to load data from a single API endpoint
    getFileUrl(id) {

       this.url =  this.remoteServiceBaseUrl + '/fileupload/GetDocumentUrl?id=' + id;
       var result = this.http.get(this.url);

       console.log(result);
       return result;
    }
}