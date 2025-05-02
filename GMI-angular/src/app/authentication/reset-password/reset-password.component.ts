import { Component } from '@angular/core';
import { NgClass } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ToggleService } from '../../common/header/toggle.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../common/services/auth.service';

@Component({
    selector: 'app-reset-password',
    standalone: true,
    imports: [RouterLink, NgClass,ReactiveFormsModule],
    templateUrl: './reset-password.component.html',
    styleUrl: './reset-password.component.scss'
})
export class ResetPasswordComponent {
   loginForm!: FormGroup;
    errorMessage: string = '';
    isLoading: boolean = false;
    id:any ;
    constructor(
        public toggleService: ToggleService,private fb: FormBuilder,  private route:ActivatedRoute,        private router: Router
                ,      private authService: AuthService,
    ) {}

    ngOnInit(): void {
        this.id= this.route.snapshot.paramMap.get('id');

          this.loginForm = this.fb.group({
                            password: ['', [Validators.required]],
                            confirmpassword: ['', [Validators.required]],

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

    // Password Show/Hide
    password1: string = '';
    password2: string = '';
    password3: string = '';
    isPassword1Visible: boolean = false;
    isPassword2Visible: boolean = false;
    isPassword3Visible: boolean = false;
    togglePassword1Visibility(): void {
        this.isPassword1Visible = !this.isPassword1Visible;
    }
    togglePassword2Visibility(): void {
        this.isPassword2Visible = !this.isPassword2Visible;
    }
    togglePassword3Visibility(): void {
        this.isPassword3Visible = !this.isPassword3Visible;
    }
    onPassword1Input(event: Event): void {
        const inputElement = event.target as HTMLInputElement;
        this.password1 = inputElement.value;
    }
    onPassword2Input(event: Event): void {
        const inputElement = event.target as HTMLInputElement;
        this.password2 = inputElement.value;
    }
    onPassword3Input(event: Event): void {
        const inputElement = event.target as HTMLInputElement;
        this.password3 = inputElement.value;
    }
    onSubmit(): void {
        if (this.loginForm.valid) {
            this.isLoading = true;
            this.errorMessage = '';
            if(this.loginForm.value.password != this.loginForm.value.confirmpassword){
                window.alert("Les Deux Mot de Passe ne sont pas Identiques")
            }
            this.authService.newmp(this.id,this.loginForm.value.password).subscribe({
                next: () => {
                    this.router.navigate(['']);
                },
                error: (error) => {
                    this.errorMessage = error.error?.message || 'An error occurred during login';
                    this.isLoading = false;
                }
            });
        }
    }
}