import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgApexchartsModule, ChartComponent } from 'ng-apexcharts';
import { DashboardService } from '../../../services/dashboard.service';
import { ChartData } from '../../../models/dashboard.models';

@Component({
  selector: 'app-tendance-interventions',
  standalone: true,
  imports: [CommonModule, NgApexchartsModule],
  templateUrl: './tendance-interventions.component.html',
  styleUrls: ['./tendance-interventions.component.scss']
})
export class TendanceInterventionsComponent implements OnInit {
  @ViewChild('chart') chart!: ChartComponent;

  public chartOptions: any = {
    series: [{
      name: 'Interventions',
      data: [0]
    }],
    chart: {
      type: 'line',
      height: 350,
      animations: {
        enabled: false
      },
      toolbar: {
        show: false
      }
    },
    xaxis: {
      categories: ['Chargement...'],
      labels: {
        style: {
          colors: '#64748B',
          fontSize: '12px'
        }
      }
    },
    yaxis: {
      labels: {
        style: {
          colors: '#64748B',
          fontSize: '12px'
        }
      }
    },
    dataLabels: {
      enabled: false
    },
    grid: {
      borderColor: '#E2E8F0',
      strokeDashArray: 4,
      xaxis: {
        lines: {
          show: true
        }
      }
    },
    stroke: {
      curve: 'smooth',
      width: 2
    },
    legend: {
      position: 'top',
      horizontalAlign: 'right',
      fontSize: '14px',
      markers: {
        width: 12,
        height: 12,
        radius: 12
      },
      itemMargin: {
        horizontal: 8,
        vertical: 8
      }
    }
  };

  constructor(private dashboardService: DashboardService) {}

  ngOnInit() {
    this.dashboardService.getInterventionsParDate().subscribe({
      next: (data: ChartData) => {
        if (data && data.labels && data.data && data.labels.length > 0) {
          this.chart.updateOptions({
            series: [{
              name: 'Interventions',
              data: data.data
            }],
            xaxis: {
              categories: data.labels
            }
          });
        } else {
          this.chart.updateOptions({
            series: [{
              name: 'Interventions',
              data: [0]
            }],
            xaxis: {
              categories: ['Aucune donnée']
            }
          });
        }
      },
      error: (error: Error) => {
        console.error('Erreur lors de la récupération des données:', error);
        this.chart.updateOptions({
          series: [{
            name: 'Interventions',
            data: [0]
          }],
          xaxis: {
            categories: ['Erreur de chargement']
          }
        });
      }
    });
  }
} 