import { Component } from '@angular/core';
import { CarouselModule, OwlOptions } from 'ngx-owl-carousel-o';
import { NgClass, NgFor, NgIf } from '@angular/common';
import { CalendarOptions } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import { FullCalendarModule } from '@fullcalendar/angular';
import { ProjetService } from '../../../services/projet.service';
import { UserService } from '../../../services/user.service';

@Component({
  selector: 'app-working-schedule',
  standalone: true,
  imports: [CarouselModule, NgFor, NgIf, NgClass, FullCalendarModule],
  templateUrl: './working-schedule.component.html',
  styleUrl: './working-schedule.component.scss'
})
export class WorkingScheduleComponent {
  allprojet: any;
  calendarOptions: CalendarOptions = {
    initialView: 'dayGridMonth',
    dayMaxEvents: true,
    weekends: true,
    plugins: [dayGridPlugin]
  };

  constructor(private service: ProjetService, private serviceuser: UserService) { }

  ngOnInit() {
    this.service.allprojet().subscribe((res) => {
      this.allprojet = res;

      // Transforme les projets en événements
      this.calendarOptions.events = this.allprojet.map((p: any) => ({
        title: p.nom,

        start: p.date_debut,
        end: p.date_fin
      }));
    });
  }





}