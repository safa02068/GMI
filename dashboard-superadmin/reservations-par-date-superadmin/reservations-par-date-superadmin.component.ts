import { Component, OnInit, AfterViewInit } from '@angular/core';
import { NgApexchartsModule } from 'ng-apexcharts';
import { DashboardService } from '../../../common/services/dashboard.service';

@Component({
  selector: 'app-reservations-par-date-superadmin',
  standalone: true,
  imports: [NgApexchartsModule],
  templateUrl: './reservations-par-date-superadmin.component.html',
  styleUrls: ['./reservations-par-date-superadmin.component.scss']
})
export class ReservationsParDateSuperadminComponent implements OnInit, AfterViewInit {
  chartOptions: any = {
    series: [{ name: 'Réservations', data: [] }],
    chart: { 
      type: 'area', 
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
      text: 'Tendances des réservations', 
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
    
    this.dashboardService.getReservationTrends().subscribe((data: any) => {
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
          text: 'Tendances des réservations',
          align: 'left',
          style: {
            color: isDarkMode ? '#94a3b8' : '#64748b'
          }
        },
        theme: {
          mode: isDarkMode ? 'dark' : 'light'
        },
        series: [{ name: 'Réservations', data: data.map((d: any) => d.count) }]
      };
      setTimeout(() => window.dispatchEvent(new Event('resize')), 100);
    });
  }

  ngAfterViewInit() {
    setTimeout(() => window.dispatchEvent(new Event('resize')), 100);
  }
} 