import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
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
import { UserService } from '../services/user.service';
import { ProjetService } from '../services/projet.service';


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
  imports: [RouterLink, MpWelcomeComponent, MpTotalProjectsComponent, MpTotalOrdersComponent, ReactiveFormsModule, FormsModule,
    MpTotalRevenueComponent, MpProfileIntroComponent, MpProfileInformationComponent, MpAdditionalInformationComponent, MpRecentActivityComponent, MpToDoListComponent, MpOverviewComponent, FormsModule, CommonModule],
  templateUrl: './projet.component.html',
  styleUrl: './projet.component.scss'
})
export class ProjetComponent {
  showModaladd: boolean = false;
  showModalaffectuser: boolean = false;

  isModalOpen: boolean = false;
  isDeleteConfirmOpen: boolean = false;
  materielToDelete?: Projet;


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

    })
    this.serviceuser.getData().subscribe((res) => {
      this.alluser = res;
    })

    this.projetform = new FormGroup({
      nom: new FormControl("", [Validators.required]),
    })
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
