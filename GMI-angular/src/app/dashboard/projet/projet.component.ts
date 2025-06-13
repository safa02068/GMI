import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { UserService } from '../../services/user.service';
import { ProjetService } from '../../services/projet.service';


export interface Projet {
  id?: number;
  nom?: any;
  description?: any;
  date_debut?: any;
  date_fin?: any;
}

@Component({
  selector: 'app-projet',
  standalone: true,
  imports: [RouterLink,ReactiveFormsModule, FormsModule, FormsModule, CommonModule],
  templateUrl: './projet.component.html',
  styleUrl: './projet.component.scss'
})
export class ProjetComponent {
  showModaladd: boolean = false;
  showModalaffectuser: boolean = false;

  isModalOpen: boolean = false;
  isDeleteConfirmOpen: boolean = false;
  materielToDelete?: Projet;
  searchText: string = '';
  filteredProjets: any;


  newprojet: Projet = {
    nom: '',
    description: '',
    date_debut: '',

    date_fin: '',

  };
  selectedUserToDelete: any = null;
  projetform!: FormGroup

  constructor(private service: ProjetService, private serviceuser: UserService) { }
  alluser: any;
  allprojet: any;
  profil: any;

  ngOnInit() {
    this.profil = localStorage.getItem("role")

    this.service.allprojet().subscribe((res) => {
      this.allprojet = res;
      this.filteredProjets = res;
    })
    
    this.serviceuser.getData().subscribe((res) => {
      this.alluser = res;
    })

    this.projetform = new FormGroup({
      nom: new FormControl("", [Validators.required]),
    })
  }

  filterProjets(): void {
    if (!this.allprojet) return;
    
    const query = this.searchText.toLowerCase();
    this.filteredProjets = this.allprojet.filter((p: Projet) =>
      (p.nom?.toLowerCase().includes(query) || '') ||
      (p.description?.toLowerCase().includes(query) || '')
    );
  }

  onSearchChange(): void {
    this.filterProjets();
  }

  confirmDeleteUser() {
    this.confirmDeleteMateriel();
    //  window.location.reload()
    this.cancelDelete();

  }
  confirmDeleteMateriel(): void {
    console.log(this.materielToDelete?.id)
    if (!this.materielToDelete) return;
    if (this.materielToDelete?.id !== undefined) {
      this.service.archiver(this.materielToDelete.id).subscribe(() => {
        window.location.reload()
      });
    }
  }
  cancelDelete() {
    this.selectedUserToDelete = null;
    this.isDeleteConfirmOpen = false;
  }

  confirmDelete(projet: Projet): void {
    this.isDeleteConfirmOpen = true;
    this.materielToDelete = projet;
  }


  openModalafecteruser(): void {
    this.showModalaffectuser = true;

  }

  openModaladd(): void {
    this.showModaladd = true;
    this.newprojet = {
      nom: '',
      description: '',
      date_debut: '',

      date_fin: '',
    };
  }
  closeModaladd(): void {
    this.showModaladd = false;
  }
  closeModalaffect(): void {
    this.showModalaffectuser = false;
  }
  addProject() {
    this.service.addprojet(this.newprojet).subscribe(() => {
      // this.getall();
      this.closeModaladd();
    });
  }
}
