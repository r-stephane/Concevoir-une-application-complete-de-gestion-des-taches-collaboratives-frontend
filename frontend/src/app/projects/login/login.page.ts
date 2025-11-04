import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { 
  IonContent, IonHeader, IonTitle, IonToolbar, IonGrid, IonRow, IonCol, 
  IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonList, IonItem, 
  IonInput, IonButton, IonText, IonIcon, AlertController, LoadingController 
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { person, lockClosed, mailOutline } from 'ionicons/icons';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [
    CommonModule, 
    ReactiveFormsModule,
    IonContent, IonHeader, IonTitle, IonToolbar, IonGrid, IonRow, IonCol, 
    IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonList, IonItem, 
    IonInput, IonButton, IonText, IonIcon
  ],
})
export class LoginPage implements OnInit {
  // --- INJECTIONS ---
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private alertCtrl = inject(AlertController);
  private loadingCtrl = inject(LoadingController);

  loginForm!: FormGroup;

  // --- PROPRIÉTÉS POUR LES ICÔNES (Correction de l'erreur TS2339) ---
  public readonly mailOutline = mailOutline;
  public readonly lockClosed = lockClosed;

  constructor() {
    addIcons({ person, lockClosed, mailOutline });
  }

  ngOnInit() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  // ==============
  // 1. Connexion (Login)
  // ==============
  async onLogin() {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    const loading = await this.loadingCtrl.create({
      message: 'Connexion en cours...',
    });
    await loading.present();

    try {
      // --- SIMULATION DE L'AUTHENTIFICATION ---
      console.log('Tentative de connexion avec:', this.loginForm.value);

      await loading.dismiss();
      this.router.navigateByUrl('/dashboard', { replaceUrl: true });
      
    } catch (error) {
      await loading.dismiss();
      const alert = await this.alertCtrl.create({
        header: 'Échec de la connexion',
        message: 'Email ou mot de passe incorrect.',
        buttons: ['OK']
      });
      await alert.present();
    }
  }

  // ==============
  // 2. Déconnexion (Logout)
  // ==============
  onLogout() {
    // Rediriger vers la page de login ou montrer une alerte
    this.router.navigateByUrl('/login', { replaceUrl: true });
  }

  // ==============
  // 3. Mot de passe oublié (Forgot Password)
  // ==============
  async onForgotPassword() {
    const alert = await this.alertCtrl.create({
      header: 'Mot de passe oublié',
      inputs: [{ name: 'email', type: 'email', placeholder: 'Entrez votre email' }],
      buttons: [
        { text: 'Annuler', role: 'cancel' },
        {
          text: 'Réinitialiser',
          handler: async (data) => {
            // Logique de validation et de gestion d'erreur (Correction de l'erreur TS7030)
            if (!data.email || !Validators.email(this.fb.control(data.email))) {
              this.showEmailError();
              return false; // Empêche l'alerte de se fermer
            }
            
            // SIMULATION DE L'ENVOI D'EMAIL
            console.log('Email de réinitialisation envoyé à:', data.email);
            
            const confirmation = await this.alertCtrl.create({
              header: 'Vérifiez votre boîte mail',
              message: `Un lien a été envoyé à ${data.email}.`,
              buttons: ['OK']
            });
            await confirmation.present();
            
            return true; // Ferme l'alerte en cas de succès (Correction TS7030)
          },
        },
      ],
    });

    await alert.present();
  }
  
  // ==============
  // 4. Créer un compte (Signup)
  // ==============
  onSignup() {
    // Redirige vers la route /signup
    this.router.navigateByUrl('/register');
  }
  
  // Utilitaire d'erreur
  async showEmailError() {
      const errorAlert = await this.alertCtrl.create({
          header: 'Erreur',
          message: 'Veuillez entrer une adresse email valide.',
          buttons: ['OK']
      });
      await errorAlert.present();
  }
}