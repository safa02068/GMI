import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgApexchartsModule, ChartComponent } from 'ng-apexcharts';
import { DashboardService } from '../../../services/dashboard.service';
import { ChartData } from '../../../models/dashboard.models';

@Component({
  selector: 'app-distribution-materiels',
  standalone: true,
  imports: [CommonModule, NgApexchartsModule],
  template: `
    <div class="rounded-sm border border-stroke bg-white px-5 pt-7.5 pb-5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5">
      <div>
        <h3 class="text-xl font-semibold text-black dark:text-white">
          Distribution des Matériels
        </h3>
      </div>

      <div class="mb-2">
        <div id="distributionMateriels">
          <apx-chart
            #chart
            [series]="chartOptions.series"
            [chart]="chartOptions.chart"
            [labels]="chartOptions.labels"
            [colors]="chartOptions.colors"
            [plotOptions]="chartOptions.plotOptions"
            [legend]="chartOptions.legend"
            [dataLabels]="chartOptions.dataLabels"
            [responsive]="chartOptions.responsive"
            [noData]="chartOptions.noData"
          >
          </apx-chart>
        </div>
      </div>
    </div>
  `
})
export class DistributionMaterielsComponent implements OnInit {
  @ViewChild('chart') chart!: ChartComponent;

  public chartOptions: any = {
    series: [0],
    chart: {
      type: 'pie',
      height: 350,
      animations: {
        enabled: false
      }
    },
    labels: ['Chargement...'],
    colors: ['#3C50E0', '#80CAEE', '#10B981', '#F59E0B', '#EF4444'],
    plotOptions: {
      pie: {
        donut: {
          size: '70%',
          labels: {
            show: true,
            name: {
              show: true,
              fontSize: '22px',
              fontFamily: 'Helvetica, Arial, sans-serif',
              fontWeight: 600,
              offsetY: -10,
            },
            value: {
              show: true,
              fontSize: '16px',
              fontFamily: 'Helvetica, Arial, sans-serif',
              fontWeight: 400,
              offsetY: 16,
            },
            total: {
              show: true,
              label: 'Total',
              fontSize: '16px',
              fontWeight: 600,
              color: '#373d3f',
            }
          }
        }
      }
    },
    legend: {
      position: 'bottom',
      horizontalAlign: 'center',
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
    dataLabels: {
      enabled: false
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
    this.dashboardService.getDistributionModelesMateriels().subscribe({
      next: (data: ChartData) => {
        if (data && data.labels && data.data && data.labels.length > 0) {
          this.chart.updateOptions({
            series: data.data,
            labels: data.labels
          });
        } else {
          this.chart.updateOptions({
            series: [0],
            labels: ['Aucune donnée']
          });
        }
      },
      error: (error: Error) => {
        console.error('Erreur lors de la récupération des données:', error);
        this.chart.updateOptions({
          series: [0],
          labels: ['Erreur de chargement']
        });
      }
    });
  }
} 