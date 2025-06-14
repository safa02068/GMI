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


