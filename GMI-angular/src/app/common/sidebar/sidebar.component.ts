import { Component } from '@angular/core';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { NgClass } from '@angular/common';
import { CommonModule } from '@angular/common'; // Importation de CommonModule

interface MenuItem {
    title: string;
    subItems?: MenuItem[];
}

@Component({
    selector: 'app-sidebar',
    standalone: true,
    imports: [NgScrollbarModule, RouterLinkActive, RouterLink, NgClass, CommonModule],
    templateUrl: './sidebar.component.html',
    styleUrl: './sidebar.component.scss'
})
export class SidebarComponent {


    isAdmin: boolean = false;
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
    getConnectedUserRole() 
    {
        if (localStorage.getItem('role') === "ADMIN") {
            this.isAdmin = true;
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