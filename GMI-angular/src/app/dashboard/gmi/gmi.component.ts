import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MetricCardsComponent } from './metric-cards/metric-cards.component';
import { MaterielsParDateComponent } from './materiels-par-date/materiels-par-date.component';
import { InterventionsParTypeComponent } from './interventions-par-type/interventions-par-type.component';
import { DistributionMaterielsComponent } from './distribution-materiels/distribution-materiels.component';
import { TendanceInterventionsComponent } from './tendance-interventions/tendance-interventions.component';

@Component({
  selector: 'app-gmi-dashboard',
  standalone: true,
  templateUrl: './gmi.component.html',
  styleUrls: ['./gmi.component.scss'],
  imports: [
    CommonModule,
    RouterModule,
    MetricCardsComponent,
    MaterielsParDateComponent,
    InterventionsParTypeComponent,
    DistributionMaterielsComponent,
    TendanceInterventionsComponent
  ]
})
export class GmiDashboardComponent {} 