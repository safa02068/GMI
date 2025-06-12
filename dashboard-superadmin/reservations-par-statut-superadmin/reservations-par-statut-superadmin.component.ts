import { Component, OnInit, AfterViewInit } from '@angular/core';
import { NgApexchartsModule } from 'ng-apexcharts';
import { DashboardService } from '../../../common/services/dashboard.service';

@Component({
  selector: 'app-reservations-par-statut-superadmin',
  standalone: true,
  imports: [NgApexchartsModule],
  templateUrl: './reservations-par-statut-superadmin.component.html',
  styleUrls: ['./reservations-par-statut-superadmin.component.scss']
})
export class ReservationsParStatutSuperadminComponent implements OnInit, AfterViewInit {
  chartOptions: any = {
    series: [],
    chart: { 
      type: 'donut', 
      height: 300,
      foreColor: '#64748b',
      toolbar: {
        show: false
      }
    },
    labels: [],
    title: { 
      text: 'Réservations par statut', 
      align: 'left',
      style: {
        color: '#64748b'
      }
    },
    legend: {
      labels: {
        colors: '#64748b'
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
    
    this.dashboardService.getSuperAdminReservationsParStatut().subscribe((data: any) => {
      this.chartOptions = {
        ...this.chartOptions,
        labels: data.labels,
        series: data.series,
        title: {
          text: 'Réservations par statut',
          align: 'left',
          style: {
            color: isDarkMode ? '#94a3b8' : '#64748b'
          }
        },
        legend: {
          labels: {
            colors: isDarkMode ? '#94a3b8' : '#64748b'
          }
        },
        theme: {
          mode: isDarkMode ? 'dark' : 'light'
        }
      };
      setTimeout(() => window.dispatchEvent(new Event('resize')), 100);
    });
  }

  ngAfterViewInit() {
    setTimeout(() => window.dispatchEvent(new Event('resize')), 100);
  }
} 