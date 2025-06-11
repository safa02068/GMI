import { Component } from '@angular/core';

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
import { MatrielManquantsService } from '../services/materiels-manquant.service';
export interface MaterielManquant {
    id?: number;
    nom?: any;  
   modele?: any; 
     stock?: any;  }
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
      isModalOpen: boolean = false;
    selectedMateriel: MaterielManquant = {} as MaterielManquant;
    isDeleteConfirmOpen: boolean = false;
    materielToDelete?: MaterielManquant;

    newMaterielmanq: MaterielManquant = {
        nom: '',
        modele: '',
        stock: '',

      };
          selectedUserToDelete: any = null;

  constructor(private service : MatrielManquantsService ){}
ngOnInit(){
this.getall()
}
  
      confirmDeleteUser() {
          this.confirmDeleteMateriel();
          this.getall();
          this.cancelDelete();

      }
    editMateriel(materiel: MaterielManquant): void {
      this.selectedMateriel = { ...materiel };
      this.isModalOpen = true;
    }
      updateMateriel(): void {
        if (this.selectedMateriel.id !== undefined) {
       
          this.service.updatemat(this.selectedMateriel.id, this.selectedMateriel).subscribe(() => {
            this.getall(); // Récupérer la liste des matériels mise à jour
            this.closeModal(); // Fermer la modale
          });
        } else {
          console.error('Selected Materiel ID is undefined');
        }
      }

  getall(){
    this.service.allmatrielmanquant().subscribe((res)=>{
    this.allmatmanquant = res ;
    console.log(this.allmatmanquant)
  })

  }
      cancelDelete() {
        this.selectedUserToDelete = null;
        this.isDeleteConfirmOpen = false;
      }
confirmDelete(materiel: MaterielManquant): void {
      this.isDeleteConfirmOpen = true;
      this.materielToDelete = materiel;
    }
  
    confirmDeleteMateriel(): void {
      if (!this.materielToDelete) return;
      if (this.materielToDelete?.id !== undefined) {
        this.service.deletemat(this.materielToDelete.id).subscribe(() => {
       window.location.reload()
        });
      }
    }   
  
   closeModal(): void {
      this.isModalOpen = false;
    }
  openModaladd(): void {
      this.showModaladd = true;
      this.newMaterielmanq = {
        nom: '',
        modele: '',
        stock: '',
       
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
