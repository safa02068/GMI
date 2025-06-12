import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';

export interface Intervention {
  id?: number;                  // optionnel lors de la création
  datederesolution: Date;                   // date de l’intervention
  description: string;          // description ou commentaire
  type: string;                 // type (ex: "maintenance", "réparation", etc.)
  materielId?: number;          // référence vers un matériel (optionnelle selon ton modèle)
  technicien?: string;          // nom ou id du technicien (si applicable)
}

@Injectable({
  providedIn: 'root'
})
export class InterventionService {

  private readonly apiUrl = `${environment.apiUrl}/interventions`;

  constructor(private http: HttpClient) {}
  getInterventions(): Observable<Intervention[]> {
    const token = (localStorage.getItem('token') || '').replace(/^"|"$/g, '');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<Intervention[]>(`${this.apiUrl}/allintervention`, { headers });
  }
  
  // POST : ajouter une nouvelle intervention
 ajoutintervention(inter:any, idmat:any , iddemandeur:any){
    
    //// nesta3mlouha ki yebda service lazmpou connexion
    const user = JSON.parse(localStorage.getItem('currentUser')|| '{}');
    let headers = new HttpHeaders();
    headers.set("Access-Control-Allow-Origin", "*")
    headers = headers.set('Content-Type', 'application/json; charset=utf-8');
    headers = headers.set("Authorization", 'Bearer ' + localStorage.getItem('token'));
    //////////
    return this.http.post(this.apiUrl+"/addintervention?idmat="+idmat+"&email="+iddemandeur,inter,{headers:headers})
}

updateIntervention(id: number, intervention: Intervention){
    
    //// nesta3mlouha ki yebda service lazmpou connexion
    const user = JSON.parse(localStorage.getItem('currentUser')|| '{}');
    let headers = new HttpHeaders();
    headers.set("Access-Control-Allow-Origin", "*")
    headers = headers.set('Content-Type', 'application/json; charset=utf-8');
    headers = headers.set("Authorization", 'Bearer ' + localStorage.getItem('token'));
    //////////
    return this.http.put(this.apiUrl+"/updateintervention",intervention,{headers:headers})
}
 
  
    // DELETE : supprimer une intervention par ID
    deleteIntervention(id: number): Observable<void> {
      const token = (localStorage.getItem('token') || '').replace(/^"|"$/g, '');
      const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
      return this.http.delete<void>(`${this.apiUrl}/archiverintervention/${id}`, { headers });
    }
}
