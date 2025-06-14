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
      this.filteredUsers = this.alluser.filter(user => user.poste === 'EMPLOYE');
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
    this.filteredProjets = this.allprojets.filter((p: Projet) =>
      (p.nom?.toLowerCase().includes(query) || '') ||
      (p.description?.toLowerCase().includes(query) || '')
    );
  }

  onSearchChange(): void {
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
    this.service.addprojet(this.newprojet).subscribe(() => {
      this.closeModaladd();
    });
  }
}
