import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { 
  TauxCompletionResponse, 
  RatioMaterielsResponse, 
  ChartData, 
  MetricCard, 
  ProgressData 
} from '../models/dashboard.models';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private readonly baseUrl = `${environment.apiUrl}/dashboard`;

  constructor(private http: HttpClient) { }

  // 1. Matériels ajoutés par date
  getMaterielsAjoutesParDate(): Observable<ChartData> {
    return this.http.get<Map<string, number>>(`${this.baseUrl}/materiels-ajoutes-par-date`)
      .pipe(map(data => this.mapToChartData(data)));
  }

  // 2. Interventions par type
  getInterventionsParType(): Observable<ChartData> {
    return this.http.get<Map<string, number>>(`${this.baseUrl}/interventions-par-type`)
      .pipe(map(data => this.mapToChartData(data)));
  }

  // 3. Nombre de projets effectués
  getProjetsEffectues(): Observable<MetricCard> {
    return this.http.get<number>(`${this.baseUrl}/projets-effectues`)
      .pipe(map(value => ({
        value,
        label: 'Projets Effectués',
        icon: 'assignment_turned_in'
      })));
  }

  // 4. Nombre de matériels manquants
  getMaterielsManquants(): Observable<MetricCard> {
    return this.http.get<number>(`${this.baseUrl}/materiels-manquants`)
      .pipe(map(value => ({
        value,
        label: 'Matériels Manquants',
        icon: 'warning'
      })));
  }

  // 5. Taux de complétion des projets
  getTauxCompletionProjets(): Observable<ProgressData> {
    return this.http.get<TauxCompletionResponse>(`${this.baseUrl}/taux-completion-projets`)
      .pipe(map(data => ({
        value: data.projetsTermines,
        total: data.totalProjets,
        label: `Taux de complétion: ${data.tauxCompletion.toFixed(1)}%`
      })));
  }

  // 6. Distribution des modèles de matériels
  getDistributionModelesMateriels(): Observable<ChartData> {
    return this.http.get<Map<string, number>>(`${this.baseUrl}/distribution-modeles-materiels`)
      .pipe(map(data => this.mapToChartData(data)));
  }

  // 7. Interventions par date
  getInterventionsParDate(): Observable<ChartData> {
    return this.http.get<Map<string, number>>(`${this.baseUrl}/interventions-par-date`)
      .pipe(map(data => this.mapToChartData(data)));
  }

  // 8. Ratio matériels manquants vs disponibles
  getRatioMateriels(): Observable<ProgressData> {
    return this.http.get<RatioMaterielsResponse>(`${this.baseUrl}/ratio-materiels`)
      .pipe(map(data => ({
        value: data.materielsManquants,
        total: data.totalMateriels,
        label: `Ratio: ${data.ratio.toFixed(1)}%`
      })));
  }

  // 9. Projets status
  getProjetsStatus(): Observable<ChartData> {
    return this.http.get<Map<string, number>>(`${this.baseUrl}/projets-status`)
      .pipe(map(data => this.mapToChartData(data)));
  }

  // Helper method to transform Map to ChartData
  private mapToChartData(mapData: Map<string, number>): ChartData {
    const labels: string[] = [];
    const data: number[] = [];
    
    Object.entries(mapData).forEach(([key, value]) => {
      labels.push(key);
      data.push(value);
    });

    return { labels, data };
  }
} 