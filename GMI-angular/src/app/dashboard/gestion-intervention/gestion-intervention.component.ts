import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { MaterielService } from '../../services/materiel.service';
import { UserService } from '../../services/user.service';
import { InterventionService } from '../../services/interventions.service';



interface Intervention {
    id?: number; // Added id property
    type: string;
    datedecreation: Date;
    titre: string;
    priorite: string;
    statut: string;
    client: string;
    description: string;
    demandeur: any;
    materiel: any; // Added materiel property
}
 
@Component({
  selector: 'app-gestion-intervention',
  standalone: true,
  imports: [RouterLink ,CommonModule,FormsModule],
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
  
    isDeleteConfirmOpen: boolean = false;
    interventionToDelete?: Intervention;
    selectedUserToDelete: any = null;
    // Modale ajout
    showModalAdd: boolean = false;

    newIntervention: Intervention = {
      type: '',
      datedecreation: new Date(),
      titre: '',
      statut: '',
      client: '',
      description: '',
      priorite: '',
      demandeur: {},
      materiel: {}
    };
    // Modale modification
  isModalOpen: boolean = false;
  selectedIntervention: Intervention = {} as Intervention;

  constructor(private interventionService: InterventionService, private matService : MaterielService,
    private userService: UserService
  ) {}

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
    });
  }

  // Ajout
  openModalAdd(): void {
    this.getUserList();
    this.getMaterielList();
    this.showModalAdd = true;
    this.newIntervention = {
      type: '',
      datedecreation: new Date(),
      titre: '',
      priorite: '', // Added priorite property
      statut: '',
      client: '',
      description: '',
      demandeur: null,
      materiel: null
    };
  }

  closeModalAdd(): void {
    this.showModalAdd = false;
  }

  addIntervention(): void {
    this.interventionService.addIntervention(this.newIntervention).subscribe(() => {
      this.fetchInterventions();
      this.closeModalAdd();
    });
  }

  // Modification
  editIntervention(intervention: Intervention): void {
    this.getUserList();
    this.getMaterielList();
    this.selectedIntervention = { ...intervention };
    console.log(this.selectedIntervention);
    this.showModalEdit = true;
  }

  closeModal(): void {
    this.showModalEdit = false;
  }

  updateIntervention(): void {
    if (this.selectedIntervention.id !== undefined) {
      this.interventionService.updateIntervention(this.selectedIntervention.id, this.selectedIntervention)
        .subscribe(() => {
          this.fetchInterventions();
          this.closeModal();
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
    const query = this.searchText.toLowerCase();
    this.filteredInterventions = this.interventions.filter((i: Intervention) =>
      i.type.toLowerCase().includes(query) ||
      i.titre.toLowerCase().includes(query) ||
      i.client.toLowerCase().includes(query) ||
      i.statut.toLowerCase().includes(query)
    );
  }




    
      // Fermer le modal de modification
      closeModalEdit() {
        this.showModalEdit = false;
        this.selectedIntervention = {
          type: '',
          datedecreation: new Date(),
          titre: '',
          priorite: '',
          statut: '',
          client: '',
          description: '',
          demandeur: {},
          materiel: {}
        }; // Réinitialiser l'intervention sélectionnée
      }
    
}