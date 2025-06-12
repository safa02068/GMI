import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardService } from '../../../services/dashboard.service';
import { MetricCard } from '../../../models/dashboard.models';

@Component({
  selector: 'app-metric-cards',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './metric-cards.component.html'
})
export class MetricCardsComponent implements OnInit {
  projetsEffectues: MetricCard | null = null;
  materielsManquants: MetricCard | null = null;

  constructor(private dashboardService: DashboardService) {}

  ngOnInit(): void {
    this.dashboardService.getProjetsEffectues().subscribe(
      data => this.projetsEffectues = data
    );
    this.dashboardService.getMaterielsManquants().subscribe(
      data => this.materielsManquants = data
    );
  }
} 