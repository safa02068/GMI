import { Component, OnInit, AfterViewInit } from '@angular/core';
import { NgApexchartsModule } from 'ng-apexcharts';
import { DashboardService } from '../../../common/services/dashboard.service';

@Component({
  selector: 'app-machines-par-categorie',
  standalone: true,
  imports: [NgApexchartsModule],
  templateUrl: './machines-par-categorie.component.html',
  styleUrls: ['./machines-par-categorie.component.scss']
})
export class MachinesParCategorieComponent implements OnInit, AfterViewInit {
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
      text: 'Répartition des machines par catégorie', 
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
    
    this.dashboardService.getMachineDistribution().subscribe((data: any) => {
      this.chartOptions = {
        ...this.chartOptions,
        labels: data.map((d: any) => d._id),
        series: data.map((d: any) => d.count),
        title: {
          text: 'Répartition des machines par catégorie',
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