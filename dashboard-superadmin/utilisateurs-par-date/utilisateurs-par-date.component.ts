import { Component, OnInit, AfterViewInit } from '@angular/core';
import { NgApexchartsModule } from 'ng-apexcharts';
import { DashboardService } from '../../../common/services/dashboard.service';

@Component({
  selector: 'app-utilisateurs-par-date',
  standalone: true,
  imports: [NgApexchartsModule],
  templateUrl: './utilisateurs-par-date.component.html',
  styleUrls: ['./utilisateurs-par-date.component.scss']
})
export class UtilisateursParDateComponent implements OnInit, AfterViewInit {
  chartOptions: any = {
    series: [{ name: 'Nouveaux utilisateurs', data: [] }],
    chart: { 
      type: 'line', 
      height: 300,
      foreColor: '#64748b',
      toolbar: {
        show: false
      }
    },
    xaxis: { 
      categories: [],
      labels: {
        style: {
          colors: '#64748b'
        }
      }
    },
    yaxis: {
      labels: {
        style: {
          colors: '#64748b'
        }
      }
    },
    stroke: { curve: 'smooth' },
    title: { 
      text: 'Évolution des utilisateurs', 
      align: 'left',
      style: {
        color: '#64748b'
      }
    },
    theme: {
      mode: 'light'
    }
  };

  constructor(private dashboardService: DashboardService) {}

  ngOnInit() {
    // Check if dark mode is enabled
    const isDarkMode = document.documentElement.classList.contains('dark');
    
    this.dashboardService.getUserGrowthTrend().subscribe((data: any) => {
      this.chartOptions = {
        ...this.chartOptions,
        xaxis: { 
          categories: data.map((d: any) => d._id),
          labels: {
            style: {
              colors: isDarkMode ? '#94a3b8' : '#64748b'
            }
          }
        },
        yaxis: {
          labels: {
            style: {
              colors: isDarkMode ? '#94a3b8' : '#64748b'
            }
          }
        },
        title: {
          text: 'Évolution des utilisateurs',
          align: 'left',
          style: {
            color: isDarkMode ? '#94a3b8' : '#64748b'
          }
        },
        theme: {
          mode: isDarkMode ? 'dark' : 'light'
        },
        series: [{ name: 'Nouveaux utilisateurs', data: data.map((d: any) => d.count) }]
      };
      setTimeout(() => window.dispatchEvent(new Event('resize')), 100);
    });
  }

  ngAfterViewInit() {
    setTimeout(() => window.dispatchEvent(new Event('resize')), 100);
  }
} 