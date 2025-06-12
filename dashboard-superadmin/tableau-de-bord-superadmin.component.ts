import { Component } from '@angular/core';
import { TotalSuperadminComponent } from './total-superadmin/total-superadmin.component';
import { UtilisateursParDateComponent } from './utilisateurs-par-date/utilisateurs-par-date.component';
import { MachinesParCategorieComponent } from './machines-par-categorie/machines-par-categorie.component';
import { ReservationsParStatutSuperadminComponent } from './reservations-par-statut-superadmin/reservations-par-statut-superadmin.component';
import { ReservationsParDateSuperadminComponent } from './reservations-par-date-superadmin/reservations-par-date-superadmin.component';

@Component({
  selector: 'app-tableau-de-bord-superadmin',
  standalone: true,
  templateUrl: './tableau-de-bord-superadmin.component.html',
  styleUrls: ['./tableau-de-bord-superadmin.component.scss'],
  imports: [
    TotalSuperadminComponent,
    UtilisateursParDateComponent,
    MachinesParCategorieComponent,
    ReservationsParStatutSuperadminComponent,
    ReservationsParDateSuperadminComponent
  ]
})
export class TableauDeBordSuperadminComponent {} 