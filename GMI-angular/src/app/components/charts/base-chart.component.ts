import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChartData } from '../../models/dashboard.models';
import { NgApexchartsModule } from 'ng-apexcharts';

@Component({
  selector: 'app-base-chart',
  standalone: true,
  imports: [CommonModule, NgApexchartsModule],
  template: ''
})
export class BaseChartComponent implements OnInit {
  @Input() data: ChartData | null = null;
  @Input() height: number = 350;
  @Input() showLegend: boolean = true;

  chartOptions: any = {
    chart: {
      type: 'line',
      height: this.height,
      toolbar: {
        show: false
      },
      zoom: {
        enabled: false
      }
    },
    colors: ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'],
    dataLabels: {
      enabled: false
    },
    stroke: {
      curve: 'smooth',
      width: 2
    },
    grid: {
      borderColor: '#E5E7EB',
      strokeDashArray: 4,
      xaxis: {
        lines: {
          show: true
        }
      }
    },
    xaxis: {
      categories: [],
      labels: {
        style: {
          colors: '#6B7280'
        }
      }
    },
    yaxis: {
      labels: {
        style: {
          colors: '#6B7280'
        }
      }
    },
    legend: {
      show: this.showLegend,
      position: 'bottom',
      horizontalAlign: 'center',
      labels: {
        colors: '#6B7280'
      }
    },
    tooltip: {
      theme: 'dark'
    }
  };

  ngOnInit() {
    if (this.data) {
      this.updateChartData();
    }
  }

  protected updateChartData() {
    if (!this.data) return;

    this.chartOptions = {
      ...this.chartOptions,
      xaxis: {
        ...this.chartOptions.xaxis,
        categories: this.data.labels
      },
      series: [{
        name: 'Value',
        data: this.data.data
      }]
    };
  }
} 