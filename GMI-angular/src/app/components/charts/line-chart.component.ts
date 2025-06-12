import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChartData } from '../../models/dashboard.models';
import { NgApexchartsModule } from 'ng-apexcharts';
import { BaseChartComponent } from './base-chart.component';

@Component({
  selector: 'app-line-chart',
  standalone: true,
  imports: [CommonModule, NgApexchartsModule],
  template: `
    <div class="chart-container">
      <apx-chart
        [series]="chartOptions.series"
        [chart]="chartOptions.chart"
        [xaxis]="chartOptions.xaxis"
        [yaxis]="chartOptions.yaxis"
        [dataLabels]="chartOptions.dataLabels"
        [grid]="chartOptions.grid"
        [stroke]="chartOptions.stroke"
        [colors]="chartOptions.colors"
        [legend]="chartOptions.legend"
        [tooltip]="chartOptions.tooltip">
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
export class LineChartComponent extends BaseChartComponent implements OnInit {
  @Input() override data: ChartData | null = null;
  @Input() override height: number = 350;
  @Input() override showLegend: boolean = true;

  override ngOnInit() {
    this.chartOptions = {
      ...this.chartOptions,
      chart: {
        ...this.chartOptions.chart,
        type: 'line'
      }
    };
    super.ngOnInit();
  }
} 