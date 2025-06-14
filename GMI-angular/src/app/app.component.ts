import { Component, OnInit, PLATFORM_ID, Inject } from '@angular/core';
import { CommonModule, ViewportScroller } from '@angular/common';
import { RouterOutlet, Router, Event, NavigationEnd } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [RouterOutlet, CommonModule],
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {

    title = 'GMI';

    constructor(
        private router: Router,
        private viewportScroller: ViewportScroller,
        @Inject(PLATFORM_ID) private platformId: Object
    ) {
        this.router.events.subscribe((event: Event) => {
            if (event instanceof NavigationEnd) {
                // Scroll to the top after each navigation end
                this.viewportScroller.scrollToPosition([0, 0]);
            }
        });
    }

    ngOnInit(): void {
        // if (isPlatformBrowser(this.platformId)) {
        //     const currentUrl = this.router.url;

        //     // Add exception for reset-password route
        //     if (currentUrl.startsWith('/authentication/reset-password')) {
        //         return; // Skip token check
        //     }

        //     const token = localStorage.getItem('token');
        //     if (!token) {
        //         this.router.navigate(['/authentication/sign-in']);
        //     }

        //     const currentUser = localStorage.getItem('currentUser');
        //     if (currentUser) {
        //         const user = JSON.parse(currentUser);
        //         localStorage.setItem('role', user.poste);
        //     }
        // }
    }


}