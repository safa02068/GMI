import { Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AuthenticationComponent } from './authentication/authentication.component';
import { SignInComponent } from './authentication/sign-in/sign-in.component';
import { SignUpComponent } from './authentication/sign-up/sign-up.component';
import { ForgotPasswordComponent } from './authentication/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './authentication/reset-password/reset-password.component';
import { ConfirmEmailComponent } from './authentication/confirm-email/confirm-email.component';
import { LockScreenComponent } from './authentication/lock-screen/lock-screen.component';
import { LogoutComponent } from './authentication/logout/logout.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { ComingSoonComponent } from './coming-soon/coming-soon.component';
import { AccountSettingsComponent } from './account-settings/account-settings.component';
import { AuthGuard } from './common/guards/auth.guard';
import { GestionUserComponent } from './dashboard/gestion-user/gestion-user.component';
import { GestionMaterielComponent } from './dashboard/gestion-materiel/gestion-materiel.component';
import { GestionInterventionComponent } from './dashboard/gestion-intervention/gestion-intervention.component';
import { MatrielsManquantComponent } from './dashboard/matriels-manquant/matriels-manquant.component';
import { ProjetComponent } from './dashboard/projet/projet.component';
import { GmiDashboardComponent } from './dashboard/gmi/gmi.component';


export const routes: Routes = [
    {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
    },
    {
        path: 'dashboard',
        component: DashboardComponent,
        canActivate: [AuthGuard],
        //canActivate :[AuthGuard,RoleGuard],
        //data:{roles :['ADMIN']},
        children: [
            { path: '', component: GmiDashboardComponent },
            { path: 'gestion-user', component: GestionUserComponent },
            { path: 'gestion-materiel', component: GestionMaterielComponent },
            { path: 'gestion-intervention', component: GestionInterventionComponent },
            { path: 'materiel-manquant', component: MatrielsManquantComponent },
            { path: 'gestion-projet', component: ProjetComponent },

            {
                path: 'profil',
                component: AccountSettingsComponent,
                // canActivate :[AuthGuard,RoleGuard],
                // data:{roles :['ADMIN']},
            },
        ]

    },
    {
        path: 'authentication',
        component: AuthenticationComponent,
        children: [
            {
                path: '',
                redirectTo: 'sign-in',
                pathMatch: 'full'
            },
            { path: 'sign-in', component: SignInComponent },
            { path: 'sign-up', component: SignUpComponent },
            { path: 'forgot-password', component: ForgotPasswordComponent },
            { path: 'reset-password', component: ResetPasswordComponent },
            { path: 'confirm-email', component: ConfirmEmailComponent },
            { path: 'lock-screen', component: LockScreenComponent },
            { path: 'logout', component: LogoutComponent }
        ]
    },


    { path: 'coming-soon', component: ComingSoonComponent },
    // Here add new pages component

    { path: '**', component: NotFoundComponent } // This line will remain down from the whole pages component list
];