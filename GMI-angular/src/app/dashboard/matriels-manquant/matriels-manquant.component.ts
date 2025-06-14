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
  filteredMateriels: any;
  searchText: string = '';
  showModaladd: boolean = false;
      isModalOpen: boolean = false;
    selectedMateriel: MaterielManquant = {} as MaterielManquant;
    isDeleteConfirmOpen: boolean = false;
    materielToDelete?: MaterielManquant;
    isTechnicien: boolean = false;

    // Pagination properties
    currentPage: number = 1;
    itemsPerPage: number = 10;
    totalItems: number = 0;
    totalPages: number = 0;
    Math = Math;

    newMaterielmanq: MaterielManquant = {
        nom: '',
        modele: '',
        stock: '',

      };
          selectedUserToDelete: any = null;

  constructor(private service : MatrielManquantsService ) {
    this.checkUserRole();
  }
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
    this.allmatmanquant = res;
    this.filteredMateriels = res;
    this.totalItems = (res as any[]).length;
    this.totalPages = Math.ceil(this.totalItems / this.itemsPerPage);
    this.updatePagedData();
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

    updatePagedData() {
        if (!this.allmatmanquant) return;
        const startIndex = (this.currentPage - 1) * this.itemsPerPage;
        const endIndex = startIndex + this.itemsPerPage;
        const query = this.searchText.toLowerCase();
        const filtered = this.allmatmanquant.filter((m: MaterielManquant) =>
            (m.nom?.toLowerCase().includes(query) || '') ||
            (m.modele?.toLowerCase().includes(query) || '') ||
            (m.stock?.toString().includes(query) || '')
        );
        this.filteredMateriels = filtered.slice(startIndex, endIndex);
    }

    onPageChange(page: number) {
        this.currentPage = page;
        this.updatePagedData();
    }

    filterMateriels(): void {
      if (!this.allmatmanquant) return;
      
      const query = this.searchText.toLowerCase();
        const filtered = this.allmatmanquant.filter((m: MaterielManquant) =>
        (m.nom?.toLowerCase().includes(query) || '') ||
        (m.modele?.toLowerCase().includes(query) || '') ||
        (m.stock?.toString().includes(query) || '')
      );
        this.totalItems = filtered.length;
        this.totalPages = Math.ceil(this.totalItems / this.itemsPerPage);
        this.currentPage = 1;
        this.filteredMateriels = filtered.slice(0, this.itemsPerPage);
    }

    onSearchChange(): void {
      this.filterMateriels();
    }

    checkUserRole() {
        const role = localStorage.getItem('role');
        this.isTechnicien = role === 'TECHNICIEN';
    }
}
