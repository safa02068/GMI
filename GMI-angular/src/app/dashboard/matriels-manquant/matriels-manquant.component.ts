import { Component } from '@angular/core';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { MatrielManquantsService } from '../../services/materiels-manquant.service';
export interface MaterielManquant {
    id?: number;
    nom?: any;  
   modele?: any; 
     stock?: any;  }
@Component({
  selector: 'app-matriels-manquant',
      standalone: true,
    imports: [RouterLink, FormsModule, CommonModule],
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
