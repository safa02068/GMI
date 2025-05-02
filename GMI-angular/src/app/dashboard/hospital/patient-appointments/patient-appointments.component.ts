import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'app-patient-appointments',
    standalone: true,
    imports: [RouterLink],
    templateUrl: './patient-appointments.component.html',
    styleUrl: './patient-appointments.component.scss'
})
export class PatientAppointmentsComponent {}