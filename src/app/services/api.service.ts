import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {Post} from "../shared/models";

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  constructor(private http: HttpClient) {}

  get():Observable<Post[]> {
    return this.http.get('https://jsonplaceholder.typicode.com/posts') as Observable<Post[]>;
  }
}
