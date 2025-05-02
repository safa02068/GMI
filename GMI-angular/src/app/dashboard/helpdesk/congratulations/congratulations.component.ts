import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'app-congratulations',
    standalone: true,
    imports: [RouterLink],
    templateUrl: './congratulations.component.html',
    styleUrl: './congratulations.component.scss'
})
export class CongratulationsComponent {}