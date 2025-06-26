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
    currentPage = 1;
    itemsPerPage = 10;
    totalItems = 0;
    totalPages = 1;
    Math = Math; // Make Math available in template
    alertShow: boolean = false;
    alertType: 'success' | 'error' = 'success';
    alertMessage: string = '';

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

        if (!this.searchText) {
            this.totalItems = this.userData.length;
            this.totalPages = Math.ceil(this.totalItems / this.itemsPerPage);
            const startIndex = (this.currentPage - 1) * this.itemsPerPage;
            const endIndex = startIndex + this.itemsPerPage;
            return this.userData.slice(startIndex, endIndex);
        }

        const filtered = this.userData.filter((user: User) =>
            user.nom?.toLowerCase().includes(this.searchText.toLowerCase()) ||
            user.prenom?.toLowerCase().includes(this.searchText.toLowerCase()) ||
            user.email?.toLowerCase().includes(this.searchText.toLowerCase())
        );
        this.totalItems = filtered.length;
        this.totalPages = Math.ceil(this.totalItems / this.itemsPerPage);
        const startIndex = (this.currentPage - 1) * this.itemsPerPage;
        const endIndex = startIndex + this.itemsPerPage;
        return filtered.slice(startIndex, endIndex);
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
        // Validation
        if (!this.newUser.nom || !this.newUser.prenom || !this.newUser.email || !this.newUser.password || !this.newUser.adresse || !this.newUser.tel || !this.newUser.cin ||
            this.newUser.nom.trim() === '' || this.newUser.prenom.trim() === '' || this.newUser.email.trim() === '' || this.newUser.password.trim() === '' || this.newUser.adresse.trim() === '' || this.newUser.tel.trim() === '' || this.newUser.cin.trim() === '') {
            this.showAlert('Veuillez remplir tous les champs obligatoires.', 'error');
            return;
        }
        this.ws.addUser(this.newUser).subscribe(
            (response) => {
                this.getUserData();
                this.closeModaladd();
                this.showAlert('Utilisateur ajouté avec succès', 'success');
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
                if (error.status === 400 && error.error && typeof error.error === 'string' && error.error.includes('existe')) {
                    this.showAlert('Un utilisateur avec cet email ou ce nom existe déjà', 'error');
                } else {
                    this.showAlert('Erreur lors de l\'ajout de l\'utilisateur', 'error');
                }
            }
        );
    }

    editUser(user: User) {
        this.selectedUser = { ...user };
        this.isModalOpen = true;
    }

    update() {
        // Validation
        if (!this.selectedUser.nom || !this.selectedUser.prenom || !this.selectedUser.email || !this.selectedUser.adresse || !this.selectedUser.tel || !this.selectedUser.cin ||
            this.selectedUser.nom.trim() === '' || this.selectedUser.prenom.trim() === '' || this.selectedUser.email.trim() === '' || this.selectedUser.adresse.trim() === '' || this.selectedUser.tel.trim() === '' || this.selectedUser.cin.trim() === '') {
            this.showAlert('Veuillez remplir tous les champs obligatoires.', 'error');
            return;
        }
        this.ws.modifierUser(this.selectedUser).subscribe(
            (response) => {
                this.getUserData();
                this.closeModal();
                this.showAlert('Utilisateur modifié avec succès', 'success');
            },
            (error) => {
                if (error.status === 400 && error.error && typeof error.error === 'string' && error.error.includes('existe')) {
                    this.showAlert('Un utilisateur avec cet email ou ce nom existe déjà', 'error');
                } else {
                    this.showAlert('Erreur lors de la modification de l\'utilisateur', 'error');
                }
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

    getPageNumbers(): number[] {
        const pages: number[] = [];
        const maxPages = 5; // Show max 5 page numbers
        let startPage = Math.max(1, this.currentPage - Math.floor(maxPages / 2));
        let endPage = Math.min(this.totalPages, startPage + maxPages - 1);

        if (endPage - startPage + 1 < maxPages) {
            startPage = Math.max(1, endPage - maxPages + 1);
        }

        for (let i = startPage; i <= endPage; i++) {
            pages.push(i);
        }
        return pages;
    }

    onPageChange(page: number): void {
        this.currentPage = page;
        this.updateFilteredUsers();
    }

    updateFilteredUsers(): void {
        this.totalItems = this.userData.length;
        this.totalPages = Math.ceil(this.totalItems / this.itemsPerPage);
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


