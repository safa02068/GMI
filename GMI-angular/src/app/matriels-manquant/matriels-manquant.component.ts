import { Component } from '@angular/core';
import { MatrielManquantsService } from '../services/matriel-manquants.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { MpAdditionalInformationComponent } from '../my-profile/mp-additional-information/mp-additional-information.component';
import { MpOverviewComponent } from '../my-profile/mp-overview/mp-overview.component';
import { MpProfileInformationComponent } from '../my-profile/mp-profile-information/mp-profile-information.component';
import { MpProfileIntroComponent } from '../my-profile/mp-profile-intro/mp-profile-intro.component';
import { MpRecentActivityComponent } from '../my-profile/mp-recent-activity/mp-recent-activity.component';
import { MpToDoListComponent } from '../my-profile/mp-to-do-list/mp-to-do-list.component';
import { MpTotalOrdersComponent } from '../my-profile/mp-total-orders/mp-total-orders.component';
import { MpTotalProjectsComponent } from '../my-profile/mp-total-projects/mp-total-projects.component';
import { MpTotalRevenueComponent } from '../my-profile/mp-total-revenue/mp-total-revenue.component';
import { MpWelcomeComponent } from '../my-profile/mp-welcome/mp-welcome.component';
export interface MaterielManquant {
    nom?: any;  }
@Component({
  selector: 'app-matriels-manquant',
      standalone: true,
    imports: [RouterLink, MpWelcomeComponent, MpTotalProjectsComponent, MpTotalOrdersComponent, MpTotalRevenueComponent, MpProfileIntroComponent, MpProfileInformationComponent, MpAdditionalInformationComponent, MpRecentActivityComponent, MpToDoListComponent, MpOverviewComponent,  FormsModule, CommonModule],
  templateUrl: './matriels-manquant.component.html',
  styleUrl: './matriels-manquant.component.scss'
})
export class MatrielsManquantComponent {
allmatmanquant:any  ; 
  showModaladd: boolean = false;
    newMaterielmanq: MaterielManquant = {
        nom: '',
      };
  constructor(private service : MatrielManquantsService ){}
ngOnInit(){
this.getall()
}
  getall(){
    this.service.allmatrielmanquant().subscribe((res)=>{
    this.allmatmanquant = res ;
  })

  }
  openModaladd(): void {
      this.showModaladd = true;
      this.newMaterielmanq = {
        nom: '',
       
      };
    }
       closeModaladd(): void {
      this.showModaladd = false;
    }

    addMaterielman(){
      this.service.ajoutmat(this.newMaterielmanq).subscribe(() => {
        this.getall();
        this.closeModaladd();
      });
    }
}
