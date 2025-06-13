import { Component, OnInit } from '@angular/core';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { NgClass, NgIf } from '@angular/common';

interface MenuItem {
    title: string;
    subItems?: MenuItem[];
}

@Component({
    selector: 'app-sidebar',
    standalone: true,
    imports: [NgScrollbarModule, RouterLinkActive, RouterLink, NgClass, NgIf],
    templateUrl: './sidebar.component.html',
    styleUrl: './sidebar.component.scss'
})
export class SidebarComponent implements OnInit {
    userRole: string = '';

    ngOnInit() {
        this.userRole = localStorage.getItem('role') || '';
    }

    // Role checking methods
    isAdmin(): boolean {
        return this.userRole === 'ADMIN';
    }

    isTechnicien(): boolean {
        return this.userRole === 'TECHNICIEN';
    }

    isEmploye(): boolean {
        return this.userRole === 'EMPLOYE';
    }

    isChefProjet(): boolean {
        return this.userRole === 'CHEF_PROJET';
    }

    // Accordion
    openSectionIndex: number = -1;
    openSectionIndex2: number = -1;
    openSectionIndex3: number = -1;
    toggleSection(index: number): void {
        if (this.openSectionIndex === index) {
            this.openSectionIndex = -1;
        } else {
            this.openSectionIndex = index;
        }
    }
    toggleSection2(index: number): void {
        if (this.openSectionIndex2 === index) {
            this.openSectionIndex2 = -1;
        } else {
            this.openSectionIndex2 = index;
        }
    }
    toggleSection3(index: number): void {
        if (this.openSectionIndex3 === index) {
            this.openSectionIndex3 = -1;
        } else {
            this.openSectionIndex3 = index;
        }
    }
    isSectionOpen(index: number): boolean {
        return this.openSectionIndex === index;
    }
    isSectionOpen2(index: number): boolean {
        return this.openSectionIndex2 === index;
    }
    isSectionOpen3(index: number): boolean {
        return this.openSectionIndex3 === index;
    }
}