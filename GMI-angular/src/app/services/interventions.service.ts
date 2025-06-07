import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';

export interface InterventionsService {
  id?: number;                  // optionnel lors de la création
  datedecreation: Date;                   // date de l’intervention
  description: string;          // description ou commentaire
  statut: string;               // statut (ex: "en cours", "terminée", etc.)
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
  getInterventions(): Observable<InterventionsService[]> {
    const token = (localStorage.getItem('token') || '').replace(/^"|"$/g, '');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<InterventionsService[]>(`${this.apiUrl}/allintervention`, { headers });
  }
  // POST : ajouter une nouvelle intervention
  addIntervention(intervention: InterventionsService): Observable<InterventionsService> {
    const token = (localStorage.getItem('token') || '').replace(/^"|"$/g, '');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.post<InterventionsService>(`${this.apiUrl}/addintervention`, intervention, { headers });
  }
    // PUT : modifier une intervention existante
    updateIntervention(id: number, intervention: InterventionsService): Observable<InterventionsService> {
      const token = (localStorage.getItem('token') || '').replace(/^"|"$/g, '');
      const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
      return this.http.put<InterventionsService>(`${this.apiUrl}/updateintervention`, intervention, { headers });
    }
  
    // DELETE : supprimer une intervention par ID
    deleteIntervention(id: number): Observable<void> {
      const token = (localStorage.getItem('token') || '').replace(/^"|"$/g, '');
      const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
      return this.http.delete<void>(`${this.apiUrl}/archiverintervention/${id}`, { headers });
    }
}
