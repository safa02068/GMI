import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';


export interface Materiel {
  id?: number;             // optionnel si auto-généré par le backend
  nom: string;
  marque: string;
  type: string;
  etat: string;
}

@Injectable({
  providedIn: 'root'
})
export class MaterielService {

  private readonly baseUrl = `${environment.apiUrl}/materiel`;

  constructor(private http: HttpClient) {}

  getMateriels() {
    const token = (localStorage.getItem('token') || '').replace(/^"|"$/g, '');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<Materiel[]>(`${this.baseUrl}/affichierlistmateriel`, { headers });
  }
  getMaterielById(id: number): Observable<Materiel> {
    return this.http.get<Materiel>(`${this.baseUrl}/${id}`);
  }

  addMateriel(materiel: Materiel): Observable<Materiel> {
    console.log(materiel)
    const token = (localStorage.getItem('token') || '').replace(/^"|"$/g, '');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.post<Materiel>(`${this.baseUrl}/addmateriel`, materiel, {headers});
  }

  updateMateriel(id: number, materiel: Materiel): Observable<Materiel> {
    const token = (localStorage.getItem('token') || '').replace(/^"|"$/g, '');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.put<Materiel>(`${this.baseUrl}/updatemateriel/${id}`, materiel, {headers});
  }

archivermatriel(id:any){
    
    //// nesta3mlouha ki yebda service lazmpou connexion
    const user = JSON.parse(localStorage.getItem('currentUser')|| '{}');
    let headers = new HttpHeaders();
    headers.set("Access-Control-Allow-Origin", "*")
    headers = headers.set('Content-Type', 'application/json; charset=utf-8');
    headers = headers.set("Authorization", 'Bearer ' + localStorage.getItem('token'));
    //////////
    return this.http.post(this.baseUrl+"/archiver?id="+id,null,{headers:headers})
}
  deleteMateriel(id: number): Observable<void> {
    const token = (localStorage.getItem('token') || '').replace(/^"|"$/g, '');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.delete<void>(`${this.baseUrl}/supprimerManquant/${id}`, {headers});
  }
}
