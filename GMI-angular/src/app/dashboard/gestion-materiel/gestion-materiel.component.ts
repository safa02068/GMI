import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MaterielService } from '../../services/materiel.service';

export interface Materiel {
    id?: number; // optionnel si auto-généré côté backend
    model: string;
    stock: number;
    prix: number;
    archiver: boolean;
    date_ajout: Date | string;
    nom: string; // Added missing property
    marque: string; // Added missing property
    etat: string; // Added missing property
    date_suppression?: Date | null; // Added missing property
    damaged?: boolean; // Added missing property
    enMaintenance?: boolean; // Added missing property
    interventions?: any[]; // Added missing property for interventions
  }

@Component({
  selector: 'app-gestion-materiel',
  standalone: true,
  imports: [RouterLink, FormsModule, CommonModule],
  templateUrl: './gestion-materiel.component.html',
  styleUrl: './gestion-materiel.component.scss'
})
export class GestionMaterielComponent {

    materiels:any;
    isDeleteConfirmOpen: boolean = false;

    filteredMateriels:any;
    searchText: string = '';
  
    // Pagination properties
    currentPage: number = 1;
    itemsPerPage: number = 10;
    totalItems: number = 0;
    totalPages: number = 0;
    Math = Math; // Add Math property for template access

    // Pour la modale de modification
    isModalOpen: boolean = false;
    selectedMateriel: Materiel = {} as Materiel;
  
    // Pour la modale d'ajout
    showModaladd: boolean = false;
    newMateriel: Materiel = {
        model: '',
        stock: 0,
        prix: 0,
        date_ajout: new Date(), // Date d'ajout par défaut à la date actuelle
        date_suppression: null,  // Date de suppression, initialisé à null
        damaged: false,       // Si endommagé
        enMaintenance: false,    // Si en maintenance
        archiver: false,        // Statut d'archivage
        interventions: [],       // Liste vide d'interventions par défaut
        nom: '',                 // Nom par défaut
        marque: '',              // Marque par défaut
        etat: ''                 // État par défaut
      };
      
    selectedUserToDelete: any = null;
    // Pour la suppression
    materielToDelete?: Materiel;
  
    isChefProjet: boolean = false;
  
    alertShow: boolean = false;
    alertType: 'success' | 'error' = 'success';
    alertMessage: string = '';
  
    constructor(private materielService: MaterielService) {
        this.checkUserRole();
    }
  
    ngOnInit(): void {
      this.fetchMateriels();
    }

    checkUserRole() {
        const role = localStorage.getItem('role');
        this.isChefProjet = role === 'CHEF_PROJET';
    }

    cancelDelete() {
        this.selectedUserToDelete = null;
        this.isDeleteConfirmOpen = false;
      }
      
      confirmDeleteUser() {
          this.confirmDeleteMateriel();
          this.fetchMateriels();
          this.cancelDelete();

      }
      updateMateriel(): void {
        // Validation
        if (!this.selectedMateriel.nom || !this.selectedMateriel.model || !this.selectedMateriel.stock || !this.selectedMateriel.prix || !this.selectedMateriel.date_ajout ||
            this.selectedMateriel.nom.trim() === '' || this.selectedMateriel.model.trim() === '' || String(this.selectedMateriel.stock).trim() === '' || String(this.selectedMateriel.prix).trim() === '' || String(this.selectedMateriel.date_ajout).trim() === '') {
          this.showAlert('Veuillez remplir tous les champs obligatoires.', 'error');
          return;
        }
        if (this.selectedMateriel.id !== undefined) {
          this.materielService.updateMateriel(this.selectedMateriel.id, this.selectedMateriel).subscribe({
            next: () => {
              this.fetchMateriels();
              this.closeModal();
              this.showAlert('Matériel mis à jour avec succès', 'success');
            },
            error: (error) => {
              if (error.status === 400 && error.error && typeof error.error === 'string' && error.error.includes('existe')) {
                this.showAlert('Un matériel avec ce nom existe déjà', 'error');
              } else {
                this.showAlert('Erreur lors de la mise à jour du matériel', 'error');
              }
            }
          });
        } else {
          console.error('Selected Materiel ID is undefined');
        }
      }



  archiverMateriel(id:any) {
        // Appeler le service pour mettre à jour le matériel
        if (id !== undefined) {
          this.materielService.archivermatriel(id).subscribe(() => {
            this.fetchMateriels(); // Récupérer la liste des matériels mise à jour
            this.closeModal(); // Fermer la modale
          });
        } else {
          console.error('Selected Materiel ID is undefined');
        }
      }

    fetchMateriels(): void {
        this.materielService.getMateriels().subscribe((data) => {
          this.materiels = data;
          this.filteredMateriels = data;
            this.totalItems = (data as any[]).length;
            this.totalPages = Math.ceil(this.totalItems / this.itemsPerPage);
            this.updatePagedData();
        });
    }

    updatePagedData() {
        if (!this.materiels) return;
        const startIndex = (this.currentPage - 1) * this.itemsPerPage;
        const endIndex = startIndex + this.itemsPerPage;
        const query = this.searchText.toLowerCase();
        const filtered = this.materiels.filter((m: Materiel) =>
            (m.nom?.toLowerCase().includes(query) || '') ||
            (m.model?.toLowerCase().includes(query) || '') ||
            (m.marque?.toLowerCase().includes(query) || '') ||
            (m.stock?.toString().includes(query) || '')
        );
        this.filteredMateriels = filtered.slice(startIndex, endIndex);
    }

    onPageChange(page: number) {
        this.currentPage = page;
        this.updatePagedData();
    }

    filterMateriels(): void {
        if (!this.materiels) return;
        
        const query = this.searchText.toLowerCase();
        const filtered = this.materiels.filter((m: Materiel) =>
            (m.nom?.toLowerCase().includes(query) || '') ||
            (m.model?.toLowerCase().includes(query) || '') ||
            (m.marque?.toLowerCase().includes(query) || '') ||
            (m.stock?.toString().includes(query) || '')
        );
        this.totalItems = filtered.length;
        this.totalPages = Math.ceil(this.totalItems / this.itemsPerPage);
        this.currentPage = 1;
        this.filteredMateriels = filtered.slice(0, this.itemsPerPage);
    }
  
    openModaladd(): void {
      this.showModaladd = true;
      this.newMateriel = {
        model: '',
        stock: 0,
        prix: 0,
        archiver: false,
        date_ajout: new Date(),
        nom: '',
        marque: '',
        etat: ''
      };
    }
  
    closeModaladd(): void {
      this.showModaladd = false;
    }
  
    addMateriel(): void {
      // Validation
      if (!this.newMateriel.nom || !this.newMateriel.model || !this.newMateriel.stock || !this.newMateriel.prix || !this.newMateriel.date_ajout ||
          this.newMateriel.nom.trim() === '' || this.newMateriel.model.trim() === '' || String(this.newMateriel.stock).trim() === '' || String(this.newMateriel.prix).trim() === '' || String(this.newMateriel.date_ajout).trim() === '') {
        this.showAlert('Veuillez remplir tous les champs obligatoires.', 'error');
        return;
      }
      this.materielService.addMateriel(this.newMateriel).subscribe({
        next: () => {
          this.fetchMateriels();
          this.closeModaladd();
          this.showAlert('Matériel ajouté avec succès', 'success');
        },
        error: (error) => {
          if (error.status === 400 && error.error && typeof error.error === 'string' && error.error.includes('existe')) {
            this.showAlert('Un matériel avec ce nom existe déjà', 'error');
          } else {
            this.showAlert('Erreur lors de l\'ajout du matériel', 'error');
          }
        }
      });
    }
  
    editMateriel(materiel: Materiel): void {
      this.selectedMateriel = { ...materiel };
      this.isModalOpen = true;
    }
 
    
    closeModal(): void {
      this.isModalOpen = false;
    }
  
    confirmDelete(materiel: Materiel): void {
      this.isDeleteConfirmOpen = true;
      this.materielToDelete = materiel;
    }
  
    confirmDeleteMateriel(): void {
      if (!this.materielToDelete) return;
      if (this.materielToDelete?.id !== undefined) {
        this.materielService.deleteMateriel(this.materielToDelete.id).subscribe(() => {
       window.location.reload()
        });
      }
    }   
  
    ngOnChanges(): void {
      this.filterMateriels();
    }
  
    onSearchChange(): void {
      this.filterMateriels();
    }

    showAlert(message: string, type: 'success' | 'error') {
      this.alertMessage = message;
      this.alertType = type;
      this.alertShow = true;
      setTimeout(() => {
        this.alertShow = false;
      }, 3000);
    }
}