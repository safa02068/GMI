import { Component } from '@angular/core';
import { RevenueGrowthService } from './revenue-growth.service';

@Component({
    selector: 'app-revenue-growth',
    standalone: true,
    imports: [],
    templateUrl: './revenue-growth.component.html',
    styleUrl: './revenue-growth.component.scss'
})
export class RevenueGrowthComponent {

    constructor(
        private revenueGrowthService: RevenueGrowthService
    ) {}

    ngOnInit(): void {
        this.revenueGrowthService.loadChart();
    }

}