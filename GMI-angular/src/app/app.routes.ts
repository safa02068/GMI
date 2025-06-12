import { Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { EcommerceComponent } from './dashboard/ecommerce/ecommerce.component';
import { CrmComponent } from './dashboard/crm/crm.component';
import { ProjectManagementComponent } from './dashboard/project-management/project-management.component';
import { LmsComponent } from './dashboard/lms/lms.component';
import { HelpdeskComponent } from './dashboard/helpdesk/helpdesk.component';
import { AnalyticsComponent } from './dashboard/analytics/analytics.component';
import { CryptoComponent } from './dashboard/crypto/crypto.component';
import { SalesComponent } from './dashboard/sales/sales.component';
import { HospitalComponent } from './dashboard/hospital/hospital.component';
import { AuthenticationComponent } from './authentication/authentication.component';
import { SignInComponent } from './authentication/sign-in/sign-in.component';
import { SignUpComponent } from './authentication/sign-up/sign-up.component';
import { ForgotPasswordComponent } from './authentication/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './authentication/reset-password/reset-password.component';
import { ConfirmEmailComponent } from './authentication/confirm-email/confirm-email.component';
import { LockScreenComponent } from './authentication/lock-screen/lock-screen.component';
import { LogoutComponent } from './authentication/logout/logout.component';
import { InternalErrorComponent } from './common/internal-error/internal-error.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { ComingSoonComponent } from './coming-soon/coming-soon.component';
import { MyProfileComponent } from './my-profile/my-profile.component';
import { SettingsComponent } from './settings/settings.component';
import { AccountSettingsComponent } from './settings/account-settings/account-settings.component';
import { ChangePasswordComponent } from './settings/change-password/change-password.component';
import { ConnectionsComponent } from './settings/connections/connections.component';
import { PrivacyPolicyComponent } from './settings/privacy-policy/privacy-policy.component';
import { TermsConditionsComponent } from './settings/terms-conditions/terms-conditions.component';
import { AuthGuard } from './common/guards/auth.guard';
import { RoleGuard } from './common/guards/role.guard';
import { GestionUserComponent } from './dashboard/gestion-user/gestion-user.component';
import { GestionMaterielComponent } from './dashboard/gestion-materiel/gestion-materiel.component';
import { GestionInterventionComponent } from './dashboard/gestion-intervention/gestion-intervention.component';
import { MatrielsManquantComponent } from './matriels-manquant/matriels-manquant.component';
import { ProjetComponent } from './projet/projet.component';
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
        canActivate :[AuthGuard],
        //canActivate :[AuthGuard,RoleGuard],
        //data:{roles :['ADMIN']},
        children: [
            {path: '', component: GmiDashboardComponent},
            {path: 'gestion-user', component: GestionUserComponent},
            {path: 'gestion-materiel', component: GestionMaterielComponent},
            {path: 'gestion-intervention', component: GestionInterventionComponent},
            {path: 'materiel-manquant', component: MatrielsManquantComponent},
            {path: 'gestion-projet', component: ProjetComponent},
            
            {path: 'my-profile', component: MyProfileComponent},
            {
                path: 'settings',
                component: SettingsComponent,
               // canActivate :[AuthGuard,RoleGuard],
               // data:{roles :['ADMIN']},
                children: [
                    {path: '', component: AccountSettingsComponent},
                    {path: 'change-password', component: ChangePasswordComponent},
                    {path: 'connections', component: ConnectionsComponent},
                    {path: 'privacy-policy', component: PrivacyPolicyComponent},
                    {path: 'terms-conditions', component: TermsConditionsComponent}
                ]
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
            {path: 'sign-in', component: SignInComponent},
            {path: 'sign-up', component: SignUpComponent},
            {path: 'forgot-password', component: ForgotPasswordComponent},
            {path: 'reset-password', component: ResetPasswordComponent},
            {path: 'confirm-email', component: ConfirmEmailComponent},
            {path: 'lock-screen', component: LockScreenComponent},
            {path: 'logout', component: LogoutComponent}
        ]
    },
   

    {path: 'coming-soon', component: ComingSoonComponent},
    // Here add new pages component

    {path: '**', component: NotFoundComponent} // This line will remain down from the whole pages component list
];