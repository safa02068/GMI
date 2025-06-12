import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgApexchartsModule, ChartComponent } from 'ng-apexcharts';
import { DashboardService } from '../../../services/dashboard.service';
import { ChartData } from '../../../models/dashboard.models';

@Component({
  selector: 'app-materiels-par-date',
  standalone: true,
  imports: [CommonModule, NgApexchartsModule],
  template: `
    <div class="rounded-sm border border-stroke bg-white px-5 pt-7.5 pb-5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5">
      <div>
        <h3 class="text-xl font-semibold text-black dark:text-white">
          Matériels par Date
        </h3>
      </div>

      <div class="mb-2">
        <div id="materielsParDate">
          <apx-chart
            #chart
            [series]="chartOptions.series"
            [chart]="chartOptions.chart"
            [xaxis]="chartOptions.xaxis"
            [yaxis]="chartOptions.yaxis"
            [dataLabels]="chartOptions.dataLabels"
            [grid]="chartOptions.grid"
            [stroke]="chartOptions.stroke"
            [legend]="chartOptions.legend"
            [responsive]="chartOptions.responsive"
            [noData]="chartOptions.noData"
          >
          </apx-chart>
        </div>
      </div>
    </div>
  `
})
export class MaterielsParDateComponent implements OnInit {
  @ViewChild('chart') chart!: ChartComponent;

  public chartOptions: any = {
    series: [{
      name: 'Matériels',
      data: [0]
    }],
    chart: {
      type: 'bar',
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
    },
    responsive: [{
      breakpoint: 480,
      options: {
        chart: {
          width: 200
        },
        legend: {
          position: 'bottom'
        }
      }
    }],
    noData: {
      text: 'Aucune donnée disponible',
      align: 'center',
      verticalAlign: 'middle',
      offsetX: 0,
      offsetY: 0,
      style: {
        color: '#64748B',
        fontSize: '14px'
      }
    }
  };

  constructor(private dashboardService: DashboardService) {}

  ngOnInit() {
    this.dashboardService.getMaterielsAjoutesParDate().subscribe({
      next: (data: ChartData) => {
        if (data && data.labels && data.data && data.labels.length > 0) {
          this.chart.updateOptions({
            series: [{
              name: 'Matériels',
              data: data.data
            }],
            xaxis: {
              categories: data.labels
            }
          });
        } else {
          this.chart.updateOptions({
            series: [{
              name: 'Matériels',
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
            name: 'Matériels',
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