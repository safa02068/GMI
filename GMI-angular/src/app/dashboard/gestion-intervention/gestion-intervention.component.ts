import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { MaterielService } from '../../services/materiel.service';
import { UserService } from '../../services/user.service';
import { InterventionService } from '../../services/interventions.service';

interface Intervention {
    id?: number;
    type: string;
    titre: string;
    email: string;
    client: string;
    description: string;
    datederesolution: Date;
    commentaire: string;
    demandeur: any;
    materiel: any;
}
 
@Component({
  selector: 'app-gestion-intervention',
  standalone: true,
  imports: [RouterLink, CommonModule, FormsModule],
  templateUrl: './gestion-intervention.component.html',
  styleUrl: './gestion-intervention.component.scss'
})
export class GestionInterventionComponent {
    interventions: any;
    showModalEdit: boolean = false;
    filteredInterventions: any;
    userList: any;
    MatList: any;
    searchText: string = '';
    isEmployee: boolean = false;
    isTechnicien: boolean = false;
  
    // Pagination properties
    currentPage: number = 1;
    itemsPerPage: number = 10;
    totalItems: number = 0;
    totalPages: number = 0;
    Math = Math; // Add Math property for template access
  
    isDeleteConfirmOpen: boolean = false;
    interventionToDelete?: Intervention;
    selectedUserToDelete: any = null;
  
    // Modale ajout
    showModalAdd: boolean = false;
    newIntervention: Intervention = {
      type: '',
      datederesolution: new Date(),
      titre: '',
      client: '',
      description: '',
      email: '',
      commentaire: '',
      demandeur: {},
      materiel: {}
    };

    // Modale modification
  isModalOpen: boolean = false;
  selectedIntervention: Intervention = {} as Intervention;

    alertShow: boolean = false;
    alertType: 'success' | 'error' = 'success';
    alertMessage: string = '';

    constructor(
        private interventionService: InterventionService,
        private matService: MaterielService,
    private userService: UserService
    ) {
        this.checkUserRoles();
    }
  
    checkUserRoles() {
        const role = localStorage.getItem('role');
        this.isEmployee = role === 'EMPLOYE';
        this.isTechnicien = role === 'TECHNICIEN';
    }

  ngOnInit(): void {
    this.fetchInterventions();
  }
  getUserList() {
    this.userService.getData().subscribe((data) => {
      this.userList = data;
    });
  }
  getMaterielList() {
    this.matService.getMateriels().subscribe((data) => {
      this.MatList = data;
      console.log(this.MatList);
    });
  }

  fetchInterventions(): void {
    this.interventionService.getInterventions().subscribe((data) => {
      this.interventions = data;
      this.filteredInterventions = data;
            this.totalItems = data.length;
            this.totalPages = Math.ceil(this.totalItems / this.itemsPerPage);
            this.updatePagedData();
        });
    }

    updatePagedData() {
        if (!this.interventions) return;
        const startIndex = (this.currentPage - 1) * this.itemsPerPage;
        const endIndex = startIndex + this.itemsPerPage;
        const query = this.searchText.toLowerCase();
        const filtered = this.interventions.filter((i: Intervention) =>
            (i.type?.toLowerCase().includes(query) || '') ||
            (i.titre?.toLowerCase().includes(query) || '') ||
            (i.client?.toLowerCase().includes(query) || '') ||
            (i.email?.toLowerCase().includes(query) || '')
        );
        this.filteredInterventions = filtered.slice(startIndex, endIndex);
    }

    onPageChange(page: number) {
        this.currentPage = page;
        this.updatePagedData();
  }

  // Ajout
  openModalAdd(): void {
    this.getUserList();
    this.getMaterielList();
    this.showModalAdd = true;
    this.newIntervention = {
      type: 'Maintenance',
      datederesolution :new Date(),
      titre: '',
      email: '',
      client: '',
      description: '',
      commentaire:'',
      demandeur: null,
      materiel: null
    };
    setTimeout(() => {
      if (this.MatList && this.MatList.length > 0) {
        this.newIntervention.materiel = this.MatList[0];
      }
    }, 300);
  }

  closeModalAdd(): void {
    this.showModalAdd = false;
  }

  addIntervention(): void {
    // Validation
    if (!this.newIntervention.titre || !this.newIntervention.type || !this.newIntervention.datederesolution || !this.newIntervention.commentaire || !this.newIntervention.materiel ||
        this.newIntervention.titre.trim() === '' || this.newIntervention.type.trim() === '' || String(this.newIntervention.datederesolution).trim() === '' || this.newIntervention.commentaire.trim() === '' || !this.newIntervention.materiel.id) {
      this.showAlert('Veuillez remplir tous les champs obligatoires.', 'error');
      return;
    }
    let intervention = {
      "titre":this.newIntervention.titre,
      "description":this.newIntervention.description,
      "datederesolution":this.newIntervention.datederesolution ,
      "type": this.newIntervention.type,
      "commentaire":this.newIntervention.commentaire
    }
    this.interventionService.ajoutintervention(intervention,this.newIntervention.materiel.id,localStorage.getItem("email")).subscribe({
      next: () => {
        this.fetchInterventions();
        this.closeModalAdd();
        this.showAlert('Intervention ajoutée avec succès', 'success');
      },
      error: (error) => {
        if (error.status === 400 && error.error && typeof error.error === 'string' && error.error.includes('existe')) {
          this.showAlert('Une intervention avec ce titre existe déjà', 'error');
        } else {
          this.showAlert('Erreur lors de l\'ajout de l\'intervention', 'error');
        }
      }
    });
  }

  // Modification
  editIntervention(intervention: Intervention): void {
    this.getUserList();
    this.getMaterielList();
    this.selectedIntervention = { ...intervention };
    setTimeout(() => {
      if (this.MatList && this.MatList.length > 0) {
        this.selectedIntervention.materiel = this.MatList[0];
      }
    }, 300);
    console.log(this.selectedIntervention);
    this.showModalEdit = true;
  }

  closeModal(): void {
    this.showModalEdit = false;
  }

  updateIntervention(): void {
    // Validation
    if (!this.selectedIntervention.titre || !this.selectedIntervention.type || !this.selectedIntervention.datederesolution || !this.selectedIntervention.commentaire || !this.selectedIntervention.materiel ||
        this.selectedIntervention.titre.trim() === '' || this.selectedIntervention.type.trim() === '' || String(this.selectedIntervention.datederesolution).trim() === '' || this.selectedIntervention.commentaire.trim() === '' || !this.selectedIntervention.materiel.id) {
      this.showAlert('Veuillez remplir tous les champs obligatoires.', 'error');
      return;
    }
    if (this.selectedIntervention.id !== undefined) {
      this.interventionService.updateIntervention(this.selectedIntervention.id, this.selectedIntervention)
        .subscribe({
          next: () => {
            this.fetchInterventions();
            this.closeModal();
            this.showAlert('Intervention modifiée avec succès', 'success');
          },
          error: (error) => {
            if (error.status === 400 && error.error && typeof error.error === 'string' && error.error.includes('existe')) {
              this.showAlert('Une intervention avec ce titre existe déjà', 'error');
            } else {
              this.showAlert('Erreur lors de la modification de l\'intervention', 'error');
            }
          }
        });
    }
  }

  // Suppression
  confirmDelete(intervention: Intervention): void {
    this.isDeleteConfirmOpen = true;
    this.interventionToDelete = intervention;
  }

  cancelDelete(): void {
    this.selectedUserToDelete = null;
    this.isDeleteConfirmOpen = false;
  }

  confirmDeleteUser(): void {
    this.confirmDeleteIntervention();
    this.fetchInterventions();
    this.cancelDelete();
  }

  confirmDeleteIntervention(): void {
    if (!this.interventionToDelete) return;
    if (this.interventionToDelete.id !== undefined) {
      this.interventionService.deleteIntervention(this.interventionToDelete.id).subscribe(() => {
        this.fetchInterventions();
        this.cancelDelete();
      });
    }
  }

  // Filtrage
  ngOnChanges(): void {
    this.filterInterventions();
  }

  filterInterventions(): void {
    if (!this.interventions) return;
    
    const query = this.searchText.toLowerCase();
        const filtered = this.interventions.filter((i: Intervention) =>
      (i.type?.toLowerCase().includes(query) || '') ||
      (i.titre?.toLowerCase().includes(query) || '') ||
      (i.client?.toLowerCase().includes(query) || '') ||
            (i.email?.toLowerCase().includes(query) || '')
    );
        this.totalItems = filtered.length;
        this.totalPages = Math.ceil(this.totalItems / this.itemsPerPage);
        this.currentPage = 1;
        this.filteredInterventions = filtered.slice(0, this.itemsPerPage);
  }

  onSearchChange(): void {
    this.filterInterventions();
  }

  // Fermer le modal de modification
  closeModalEdit() {
    this.showModalEdit = false;
    this.selectedIntervention = {
      type: '',
      datederesolution: new Date(),
      titre: '',
      email: '',
      client: '',
      description: '',
      
      commentaire:'',
      demandeur: {},
      materiel: {}
    }; // Réinitialiser l'intervention sélectionnée
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