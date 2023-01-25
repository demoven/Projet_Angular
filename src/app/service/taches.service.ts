import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { liste, listeMongo } from '../model/liste';
import { Tache } from '../model/tache';
import { User } from '../model/user';

@Injectable({
  providedIn: 'root'
})
export class TachesService {
  private url:string = 'http://localhost:3000/taches/';
  private urlListe:string = 'http://localhost:3000/listes/';

  constructor(private http: HttpClient) { }

  getTaches():Observable<Array<Tache>> {
    return this.http.get<Array<Tache>>(this.url, {withCredentials:true});
  }

  ajoutTaches(tache:Tache):Observable<Tache> {
    return this.http.post<Tache>(this.url,tache, {withCredentials:true});
  }

  updateTaches(tache:Tache):Observable<Tache> {
    return this.http.put<Tache>(this.url+tache._id, tache, {withCredentials:true});
  }

  removeTaches(tache:Tache):Observable<Tache> {
    return this.http.delete<Tache>(this.url+tache._id, {withCredentials:true});
  }

  getListes(user:User):Observable<Array<liste>> {
    return this.http.get<Array<liste>>(this.urlListe+user._id, {withCredentials:true});
  }

  ajoutListes(liste:listeMongo):Observable<liste> {
    return this.http.post<liste>(this.urlListe,liste, {withCredentials:true});
  }

  updateListes(liste:listeMongo):Observable<liste> {
    return this.http.put<liste>(this.urlListe+liste._id, liste, {withCredentials:true});
  }

  removeListes(liste:listeMongo):Observable<liste> {
    return this.http.delete<liste>(this.urlListe+liste._id, {withCredentials:true});
  }
  
}
