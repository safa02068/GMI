import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChartData } from '../../models/dashboard.models';
import { NgApexchartsModule } from 'ng-apexcharts';
import { BaseChartComponent } from './base-chart.component';

@Component({
  selector: 'app-donut-chart',
  standalone: true,
  imports: [CommonModule, NgApexchartsModule],
  template: `
    <div class="chart-container">
      <apx-chart
        [series]="chartOptions.series"
        [chart]="chartOptions.chart"
        [labels]="chartOptions.labels"
        [colors]="chartOptions.colors"
        [legend]="chartOptions.legend"
        [tooltip]="chartOptions.tooltip"
        [plotOptions]="chartOptions.plotOptions">
      </apx-chart>
    </div>
  `,
  styles: [`
    .chart-container {
      width: 100%;
      height: 100%;
    }
  `]
})
export class DonutChartComponent extends BaseChartComponent implements OnInit {
  @Input() override data: ChartData | null = null;
  @Input() override height: number = 350;
  @Input() override showLegend: boolean = true;

  override ngOnInit() {
    this.chartOptions = {
      ...this.chartOptions,
      chart: {
        ...this.chartOptions.chart,
        type: 'donut'
      },
      labels: [],
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
                offsetY: -10
              },
              value: {
                show: true,
                fontSize: '16px',
                fontFamily: 'Helvetica, Arial, sans-serif',
                fontWeight: 400,
                offsetY: 16
              },
              total: {
                show: true,
                label: 'Total',
                fontSize: '16px',
                fontFamily: 'Helvetica, Arial, sans-serif',
                fontWeight: 600
              }
            }
          }
        }
      }
    };
    super.ngOnInit();
  }

  protected override updateChartData() {
    if (!this.data) return;

    this.chartOptions = {
      ...this.chartOptions,
      labels: this.data.labels,
      series: this.data.data
    };
  }
} 