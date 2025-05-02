import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { ToggleService } from '../../common/header/toggle.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../common/services/auth.service';
import { NgClass, NgIf } from '@angular/common';

@Component({
    selector: 'app-forgot-password',
    standalone: true,
    imports: [RouterLink, ReactiveFormsModule],
    templateUrl: './forgot-password.component.html',
    styleUrl: './forgot-password.component.scss'
})
export class ForgotPasswordComponent {
    loginForm!: FormGroup;
    errorMessage: string = '';
    isLoading: boolean = false;
    constructor(
        public toggleService: ToggleService,private fb: FormBuilder,          private router: Router
        ,      private authService: AuthService,
        
    ) {}

    ngOnInit(): void {
         this.loginForm = this.fb.group({
                    email: ['', [Validators.required, Validators.email]],
                });
        // Initialize theme and direction on component load
        this.toggleService.initializeTheme();
    }

    // Toggle theme between light and dark
    toggleTheme() {
        this.toggleService.toggleTheme();
    }

    // Toggle direction between LTR and RTL
    toggleDirection() {
        this.toggleService.toggleDirection();
    }
    onSubmit(): void {
        if (this.loginForm.valid) {
            this.isLoading = true;
            this.errorMessage = '';
            
            this.authService.mpoublier(this.loginForm.value.email).subscribe({
                next: () => {
                    this.router.navigate(['/dashboard']);
                },
                error: (error) => {
                    this.errorMessage = error.error?.message || 'An error occurred during login';
                    this.isLoading = false;
                }
            });
        }
    }
}