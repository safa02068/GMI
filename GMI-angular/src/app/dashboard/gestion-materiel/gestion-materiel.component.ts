import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MaterielService } from '../../services/materiel.service';

export interface Materiel {
    id?: number; // optionnel si auto-généré côté backend
    model: string;
    stock: number;
    type: string;
    prix: number;
    disponibilite: string;
    archiver: boolean;
    date_ajout: Date | string;
    nom: string; // Added missing property
    marque: string; // Added missing property
    etat: string; // Added missing property
    date_suppression?: Date | null; // Added missing property
    isDamaged?: boolean; // Added missing property
    enMaintenance?: boolean; // Added missing property
    isManquant?: boolean; // Added missing property
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
  
    // Pour la modale de modification
    isModalOpen: boolean = false;
    selectedMateriel: Materiel = {} as Materiel;
  
    // Pour la modale d’ajout
    showModaladd: boolean = false;
    newMateriel: Materiel = {
        model: '',
        stock: 0,
        type: '',              // "individuelle" ou "personnel"
        prix: 0,
        disponibilite: '',
        date_ajout: new Date(), // Date d'ajout par défaut à la date actuelle
        date_suppression: null,  // Date de suppression, initialisé à null
        isDamaged: false,       // Si endommagé
        enMaintenance: false,    // Si en maintenance
        isManquant: false,      // Si manquant
        archiver: false,        // Statut d'archivage
        interventions: [],       // Liste vide d'interventions par défaut
        nom: '',                 // Nom par défaut
        marque: '',              // Marque par défaut
        etat: ''                 // État par défaut
      };
      
    selectedUserToDelete: any = null;
    // Pour la suppression
    materielToDelete?: Materiel;
  
    constructor(private materielService: MaterielService) {}
  
    ngOnInit(): void {
      this.fetchMateriels();
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
        // Appeler le service pour mettre à jour le matériel
        if (this.selectedMateriel.id !== undefined) {
          this.materielService.updateMateriel(this.selectedMateriel.id, this.selectedMateriel).subscribe(() => {
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
          this.filteredMateriels = data; // Initialiser filteredMateriels avec tous les materiels
        }
        );

    }
  
    openModaladd(): void {
      this.showModaladd = true;
      this.newMateriel = {
        model: '',
        stock: 0,
        type: '',
        prix: 0,
        disponibilite: '',
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
      this.materielService.addMateriel(this.newMateriel).subscribe(() => {
        this.fetchMateriels();
        this.closeModaladd();
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
          this.fetchMateriels();
          this.cancelDelete();
        });
      }
    }   
  
    ngOnChanges(): void {
      this.filterMateriels();
    }
  
    filterMateriels(): void {
    const query = this.searchText.toLowerCase();
    this.filteredMateriels = this.materiels.filter((m: Materiel) =>
      m.model.toLowerCase().includes(query) ||
      m.type.toLowerCase().includes(query)
    );
    }
  
}