import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { UserService } from '../../services/user.service';

interface User {
    nom: string;
    prenom: string;
    email: string;
    p: string;
    tel: string;
    adresse: string;
    cin: string;
    id?: number;
    password?: string;
    [key: string]: any;
}

@Component({
    selector: 'app-gestion-user',
    standalone: true,
    imports: [RouterLink, FormsModule, CommonModule],
    templateUrl: './gestion-user.component.html',
    styleUrls: ['./gestion-user.component.scss']
})
export class GestionUserComponent implements OnInit {
    userData: User[] = [];
    selectedUser: User = {} as User;
    isModalOpen = false;
    selectedUserToDelete: User | null = null;
    isDeleteConfirmOpen = false;
    showModaladd = false;
    searchText = '';

    newUser: User = {
        nom: '',
        prenom: '',
        email: '',
        password: '',
        p: 'CHEF_PROJET',
        adresse: '',
        tel: '',
        cin: ''
    };

    constructor(private ws: UserService) { }

    ngOnInit(): void {
        this.getUserData();
    }

    get filteredUsers(): User[] {
        if (!this.userData) {
            return [];
        }

        const search = this.searchText?.toLowerCase().trim();

        if (!search) {
            return this.userData; // Si recherche vide → retourne toute la liste
        }

        return this.userData.filter((user: User) =>
            user.nom?.toLowerCase().includes(search) ||
            user.prenom?.toLowerCase().includes(search) ||
            user.email?.toLowerCase().includes(search)
        );
    }

    confirmDelete(user: User) {
        this.selectedUserToDelete = user;
        this.isDeleteConfirmOpen = true;
    }

    cancelDelete() {
        this.selectedUserToDelete = null;
        this.isDeleteConfirmOpen = false;
    }

    confirmDeleteUser() {
        if (this.selectedUserToDelete && this.selectedUserToDelete.id) {
            this.deleteUser(this.selectedUserToDelete);
            this.getUserData();
            this.cancelDelete();
        }
    }

    getUserData() {
        this.ws.getData().subscribe(
            (response: any) => {
                this.userData = response;
                console.log('User data:', this.userData);
            },
            (error) => {
                console.error('Error fetching users:', error);
            }
        );
    }

    saveUser() {
        if (!this.newUser.nom || !this.newUser.prenom || !this.newUser.email || !this.newUser.password) {
            return;
        }

        this.ws.addUser(this.newUser).subscribe(
            (response) => {
                console.log('User added successfully:', response);
                this.getUserData();
                this.closeModaladd();
                // Reset the form
                this.newUser = {
                    nom: '',
                    prenom: '',
                    email: '',
                    password: '',
                    p: 'CHEF_PROJET',
                    adresse: '',
                    tel: '',
                    cin: ''
                };
            },
            (error) => {
                console.error('Error adding user:', error);
            }
        );
    }

    editUser(user: User) {
        this.selectedUser = { ...user };
        this.isModalOpen = true;
    }

    update() {
        this.ws.modifierUser(this.selectedUser).subscribe(
            (response) => {
                console.log('User modified successfully:', response);
                this.getUserData();
                this.closeModal();
            }
        );
    }

    closeModal() {
        this.isModalOpen = false;
    }

    deleteUser(user: User) {
        if (user.id) {
            this.ws.deleteUser(user.id).subscribe(
                (response) => {
                    console.log('User deleted successfully:', response);
                    this.getUserData();
                }
            );
        }
    }

    openModaladd() {
        this.showModaladd = true;
    }

    closeModaladd() {
        this.showModaladd = false;
    }
}

export class ModalComponent {

    // Modal Trigger
    classApplied = false;
    toggleClass() {
        this.classApplied = !this.classApplied;
    }
    classApplied2 = false;
    toggleClass2() {
        this.classApplied2 = !this.classApplied2;
    }

}


