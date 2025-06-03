import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { UserServiceService } from '../../../services/user-service.service';
import { CommonModule } from '@angular/common'; // Importation de CommonModule
import { FormsModule } from '@angular/forms';  // Ajoute cette ligne


interface User {
    nom: string;
    prenom: string;
    email: string;
    poste: string;
    tel: string;
    adresse: string;
    cin: string;
    [key: string]: any; // pour généraliser
  }
@Component({
    selector: 'app-patient-appointments',
    standalone: true,
    imports: [RouterLink,CommonModule,FormsModule],
    templateUrl: './patient-appointments.component.html',
    styleUrl: './patient-appointments.component.scss'
})
export class PatientAppointmentsComponent {
    userData: any;
    selectedUser: any = {}; 
    isModalOpen = false;
    selectedUserToDelete: any = null;
    isDeleteConfirmOpen: boolean = false;
    showModaladd:boolean = false;
    searchText: string = '';
    
    newUser = {
        nom: '',
        prenom: '',
        email: '',
        password: '',
        p: 'UTILISATEUR',
        isActive: true,
      };
    constructor(private ws: UserServiceService) { }

    ngOnInit(): void {
        this.getUserData();
    }
    get filteredUsers() {
        if (!this.userData) {
            return [];
        }
        return this.userData.filter((user: User) =>
          user.nom.toLowerCase().includes(this.searchText.toLowerCase()) ||
          user.prenom.toLowerCase().includes(this.searchText.toLowerCase()) ||
          user.email.toLowerCase().includes(this.searchText.toLowerCase())
        );
    }

confirmDelete(user: any) {
  this.selectedUserToDelete = user;
  this.isDeleteConfirmOpen = true;
}

cancelDelete() {
  this.selectedUserToDelete = null;
  this.isDeleteConfirmOpen = false;
}

confirmDeleteUser() {
  if (this.selectedUserToDelete) {
    this.deleteUser(this.selectedUserToDelete);
    this.getUserData();
    this.cancelDelete();
  }
}

    getUserData() {
        this.ws.getData().subscribe(
            (response) => {
                this.userData = response;
                console.log('User data:', this.userData);
            },
            (error) => {
                console.error('Error fetching users:', error);
            }
        );
    }
    saveUser() {
        // Logic to add user
        console.log('Ajouter un utilisateur');
        this.ws.addUser(this.newUser).subscribe(
          (response) => {
            console.log('User added successfully:', response);
            this.getUserData();  // Rafraîchir la liste des utilisateurs
            this.closeModaladd();  // Fermer le modal
          }
        );
      }
    
      editUser(user:any) {
        this.selectedUser = { ...user };  // Créer une copie de l'utilisateur pour la modification
        this.isModalOpen = true;  // Ouvrir le modal
      }

      update() {
        this.isModalOpen = true;  // Ouvrir le modal
        this.ws.modifierUser(this.selectedUser).subscribe(
          (response) => {
            console.log('User modified successfully:', response);
            this.getUserData();
            this.closeModal();  // Rafraîchir la liste des utilisateurs
          }
        );
      }
    
      closeModal() {
        this.isModalOpen = false;  // Fermer le modal
      }
      deleteUser(user: any) {
        this.ws.deleteUser(user.id).subscribe(
          (response) => {
            console.log('User deleted successfully:', response);
            this.getUserData();  // Rafraîchir la liste des utilisateurs
          }
        );
      }
      addUser() {
      }
  
      openModaladd() {
        this.showModaladd = true;
      }
      
      closeModaladd() {
        this.showModaladd = false;
      }
}