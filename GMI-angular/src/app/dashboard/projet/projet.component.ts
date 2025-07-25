import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, OnInit, PLATFORM_ID, Inject } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators, FormBuilder } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { UserService } from '../../services/user.service';
import { ProjetService } from '../../services/projet.service';
import { MaterielService } from '../../services/materiel.service';
import { WorkingScheduleComponent } from "./working-schedule/working-schedule.component";
import { FullCalendarModule } from '@fullcalendar/angular';
import { CalendarOptions } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';


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
  imports: [RouterLink, ReactiveFormsModule, FormsModule, CommonModule, WorkingScheduleComponent, FullCalendarModule],
  templateUrl: './projet.component.html',
  styleUrl: './projet.component.scss'
})
export class ProjetComponent implements OnInit {
  showModaladd: boolean = false;
  showModalaffectuser: boolean = false;
  showModalaffectlmatriel: boolean = false;

  isModalOpen: boolean = false;
  isDeleteConfirmOpen: boolean = false;
  materielToDelete?: Projet;
  searchText: string = '';
  filteredProjets: any;

  allprojets:any;
  calendarOptions: CalendarOptions = {
    initialView: 'dayGridMonth',
    dayMaxEvents: true,
    weekends: true,
    plugins: [dayGridPlugin]
  };


  newprojet: Projet = {
    nom: '',
    description: '',
    date_debut: '',
    date_fin: '',
  };
  selectedUserToDelete: any = null;
  projetform!: FormGroup;
  matform!: FormGroup;
  idP:any;
  alluserbyp:any;
  allmatbyp:any;
  sizeuserbyp:any;
  alluser: any[] = [];
  filteredUsers: any[] = [];
  profil: any;
  pbyemail:any;
  allmat :any;
  currentPage = 1;
  itemsPerPage = 10;
  totalItems = 0;
  totalPages = 1;
  Math = Math; // Make Math available in template
  alertShow: boolean = false;
  alertType: 'success' | 'error' = 'success';
  alertMessage: string = '';

  constructor(
    private service: ProjetService,
    private serviceuser: UserService,
    private servicemat: MaterielService,
    private formBuilder: FormBuilder,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.profil = localStorage.getItem('role');
    }
    
    this.service.allprojet().subscribe((res) => {
      this.allprojets = res;
      this.filteredProjets = res;
      this.calendarOptions.events = this.allprojets.map((p:any) => ({
        title: p.nom,
        start: p.date_debut,
        end: p.date_fin
      }));
    });

    this.serviceuser.getData().subscribe((res) => {
      this.alluser = res as any[];
      this.filteredUsers = this.alluser.filter(user => user.p === 'EMPLOYE');
    });

    this.servicemat.getMateriels().subscribe((res)=>{
      this.allmat = res ;
    });

    this.projetform = new FormGroup({
      nom: new FormControl("", [Validators.required]),
    });

    this.matform = new FormGroup({
      nom: new FormControl("", [Validators.required]),
    });

    this.afficherbyemail();
  }

  afficherbyemail(){
    this.serviceuser.afficherbyemail().subscribe((res)=> {
      this.pbyemail = res;
    });
  }

  filterProjets(): void {
    if (!this.allprojets) return;
    
    const query = this.searchText.toLowerCase();
    const filtered = this.allprojets.filter((p: Projet) =>
      (p.nom?.toLowerCase().includes(query) || '') ||
      (p.description?.toLowerCase().includes(query) || '')
    );
    
    this.totalItems = filtered.length;
    this.totalPages = Math.ceil(this.totalItems / this.itemsPerPage);
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.filteredProjets = filtered.slice(startIndex, endIndex);
  }

  onSearchChange(): void {
    this.currentPage = 1; // Reset to first page on search
    this.filterProjets();
  }

  confirmDeleteUser() {
    this.confirmDeleteMateriel();
    this.cancelDelete();
  }

  confirmDeleteMateriel(): void {
    if (!this.materielToDelete) return;
    if (this.materielToDelete?.id !== undefined) {
      this.service.archiver(this.materielToDelete.id).subscribe(() => {
        window.location.reload();
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

  openModalafecteruser(id:any): void {
    this.idP = id;
    this.showModalaffectuser = true;
    this.serviceuser.allbyprojet(id).subscribe((res)=> {
      this.alluserbyp = res;
      this.sizeuserbyp = this.alluserbyp.length;
    });
  }

  openModalafectermatriel(id:any): void {
    this.idP = id;
    this.showModalaffectlmatriel = true;
    this.servicemat.afficherbyprojet(id).subscribe((res)=> {
      this.allmatbyp = res;
      this.sizeuserbyp = this.allmatbyp.length;
    });
  }

  desaffecter(id:any){
    this.serviceuser.desaffecter(id).subscribe((res)=> {
          this.showModalaffectuser = false;
    });
  }

  desaffectermath(id:any){
    this.servicemat.desafecter(id).subscribe((res)=> {
          this.showModalaffectlmatriel = false;
    });
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

  affecter(){
    this.service.affceteruser(this.idP , this.projetform.value.nom).subscribe((res)=> {
    window.location.reload();
    });
  }

  affectermatriel(){
    this.service.affectermateriel(this.matform.value.nom,this.idP).subscribe((res)=> {
    window.location.reload();
    });
  }

  closeModaladd(): void {
    this.showModaladd = false;
  }

  closeModalaffect(): void {
    this.showModalaffectuser = false;
  }

  closeModalaffectuser(): void {
    this.showModalaffectlmatriel = false;
  }

  addProject() {
    // Validation
    if (!this.newprojet.nom || !this.newprojet.description || !this.newprojet.date_debut || !this.newprojet.date_fin ||
        this.newprojet.nom.trim() === '' || this.newprojet.description.trim() === '' || String(this.newprojet.date_debut).trim() === '' || String(this.newprojet.date_fin).trim() === '') {
      this.showAlert('Veuillez remplir tous les champs obligatoires.', 'error');
      return;
    }
    this.service.addprojet(this.newprojet).subscribe({
      next: () => {
        this.closeModaladd();
        this.showAlert('Projet ajouté avec succès', 'success');
      },
      error: (error) => {
        if (error.status === 400 && error.error && typeof error.error === 'string' && error.error.includes('existe')) {
          this.showAlert('Un projet avec ce nom existe déjà', 'error');
        } else {
          this.showAlert('Erreur lors de l\'ajout du projet', 'error');
        }
      }
    });
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
    this.filterProjets();
  }

  updateFilteredProjets(): void {
    this.totalItems = this.allprojets.length;
    this.totalPages = Math.ceil(this.totalItems / this.itemsPerPage);
    this.filterProjets();
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
