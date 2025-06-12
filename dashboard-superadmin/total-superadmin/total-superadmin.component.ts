import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardService } from '../../../common/services/dashboard.service';

@Component({
  selector: 'app-total-superadmin',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './total-superadmin.component.html',
  styleUrls: ['./total-superadmin.component.scss']
})
export class TotalSuperadminComponent implements OnInit {
  kpis: any;

  constructor(private dashboardService: DashboardService) {}

  ngOnInit() {
    this.dashboardService.getSuperAdminKPIs().subscribe((data: any) => {
      this.kpis = data;
    });
  }
} 