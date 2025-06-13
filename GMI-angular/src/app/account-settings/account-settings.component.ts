import { Component, OnInit } from '@angular/core';
import { FileUploadModule } from '@iplab/ngx-file-upload';
import { CommonModule } from '@angular/common';
import { FormsModule, FormBuilder, FormGroup, Validators, ReactiveFormsModule, AbstractControl, ValidationErrors } from '@angular/forms';
import { UserService } from '../services/user.service';

interface User {
    id?: number;
    nom: string;
    prenom: string;
    email: string;
    tel: string;
    p: string;
    adresse: string;
    cin: string;
    password?: string;
    [key: string]: any;
}

function cinValidator(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    if (!value) {
        return null;
    }
    
    // Check if it's exactly 8 digits
    const validFormat = /^\d{8}$/.test(value);
    if (!validFormat) {
        return { invalidCin: true };
    }
    
    return null;
}

@Component({
    selector: 'app-account-settings',
    standalone: true,
    imports: [FileUploadModule, CommonModule, FormsModule, ReactiveFormsModule],
    templateUrl: './account-settings.component.html',
    styleUrl: './account-settings.component.scss'
})
export class AccountSettingsComponent implements OnInit {
    profileForm: FormGroup;
    isEditing: boolean = false;
    isLoading: boolean = false;
    alertShow: boolean = false;
    alertType: 'success' | 'error' = 'success';
    alertMessage: string = '';
    displayAvatar: string = 'assets/images/avatar.png';
    fullName: string = '';
    currentUser: User | null = null;

    constructor(
        private userService: UserService,
        private fb: FormBuilder
    ) {
        this.profileForm = this.fb.group({
            nom: ['', Validators.required],
            prenom: ['', Validators.required],
            email: [{value: '', disabled: true}, [Validators.required, Validators.email]],
            tel: ['', Validators.required],
            p: [''],
            cin: ['', [Validators.required, cinValidator]],
            adresse: ['', Validators.required]
        });
    }

    ngOnInit() {
        this.loadUserProfile();
    }

    loadUserProfile() {
        this.userService.getMyProfile().subscribe({
            next: (user: any) => {
                console.log('Received user data:', user);
                this.currentUser = user;
                const formData = {
                    nom: user.nom,
                    prenom: user.prenom,
                    email: user.email,
                    tel: user.tel,
                    p: user.p,
                    cin: user.cin,
                    adresse: user.adresse
                };
                console.log('Form data to patch:', formData);
                this.profileForm.patchValue(formData);
                this.fullName = `${user.prenom} ${user.nom}`;
            },
            error: (error) => {
                console.error('Error loading user profile:', error);
                this.showAlert('Erreur lors du chargement du profil', 'error');
            }
        });
    }

    toggleEdit() {
        this.isEditing = !this.isEditing;
        if (!this.isEditing) {
            this.loadUserProfile();
        }
    }

    onSubmit() {
        if (this.profileForm.valid && this.currentUser) {
            this.isLoading = true;
            const formData = this.profileForm.getRawValue();
            console.log('Current user:', this.currentUser);
            console.log('Form data:', formData);
            const userData = {
                ...this.currentUser,
                ...formData
            };
            console.log('Final user data to send:', userData);
            
            this.userService.updateProfile(userData).subscribe({
                next: (response) => {
                    console.log('Update response:', response);
                    this.isLoading = false;
                    this.isEditing = false;
                    this.showAlert('Profil mis à jour avec succès', 'success');
                    this.loadUserProfile();
                },
                error: (error) => {
                    this.isLoading = false;
                    console.error('Error updating profile:', error);
                    this.showAlert('Erreur lors de la mise à jour du profil', 'error');
                }
            });
        }
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