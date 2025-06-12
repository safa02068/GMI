export interface TauxCompletionResponse {
  tauxCompletion: number;
  totalProjets: number;
  projetsTermines: number;
}

export interface RatioMaterielsResponse {
  ratio: number;
  totalMateriels: number;
  materielsManquants: number;
}

export interface ChartData {
  labels: string[];
  data: number[];
}

export interface MetricCard {
  value: number;
  label: string;
  icon?: string;
}

export interface ProgressData {
  value: number;
  total: number;
  label: string;
} 