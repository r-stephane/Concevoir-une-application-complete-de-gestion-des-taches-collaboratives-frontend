import { Component, OnInit, inject, AfterViewInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, AbstractControl, ValidationErrors } from '@angular/forms';
import { Router } from '@angular/router';
import { 
  IonContent, IonHeader, IonTitle, IonToolbar, IonGrid, IonRow, IonCol, 
  IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonList, IonItem, 
  IonInput, IonButton, IonText, AlertController, LoadingController, IonButtons, 
  IonBackButton, IonIcon 
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { person, lockClosed, mailOutline } from 'ionicons/icons';
import { TaskProjectService } from 'src/app/services/task-project';

// Validation pour vérifier que les mots de passe correspondent
export const passwordMatchValidator = (control: AbstractControl): ValidationErrors | null => {
  const password = control.get('password');
  const confirmPassword = control.get('confirmPassword');
  if (password && confirmPassword && password.value !== confirmPassword.value) {
    return { passwordsMismatch: true };
  }
  return null;
};

@Component({
  selector: 'app-signup',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
  standalone: true,
  imports: [
    CommonModule, 
    ReactiveFormsModule,
    IonContent, IonHeader, IonTitle, IonToolbar, IonGrid, IonRow, IonCol, 
    IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonList, IonItem, 
    IonInput, IonButton, IonText, IonButtons, IonBackButton, IonIcon
  ],
})
export class SignupPage implements OnInit, AfterViewInit {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private alertCtrl = inject(AlertController);
  private loadingCtrl = inject(LoadingController);
  private taskService = inject(TaskProjectService); // Service pour register

  signupForm!: FormGroup;
  @ViewChild('nameInput', { static: false }) nameInput!: IonInput;

  public readonly person = person;
  public readonly lockClosed = lockClosed;
  public readonly mailOutline = mailOutline;

  constructor() {
    addIcons({ person, lockClosed, mailOutline });
  }

  ngOnInit() {
    this.signupForm = this.fb.group({
      nameUser: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', Validators.required]
    }, { validators: passwordMatchValidator });
  }

  ngAfterViewInit() {
    setTimeout(() => this.nameInput?.setFocus(), 300);
  }

  async onSignup() {
    if (this.signupForm.invalid) {
      this.signupForm.markAllAsTouched();
      const alert = await this.alertCtrl.create({
        header: 'Erreur',
        message: 'Veuillez vérifier les champs du formulaire.',
        buttons: ['OK']
      });
      await alert.present();
      return;
    }

    const loading = await this.loadingCtrl.create({ message: 'Création du compte en cours...' });
    await loading.present();

    try {
      const formData = this.signupForm.value;
      const response = await this.taskService.register({
        nameUser: formData.nameUser,
        email: formData.email,
        password: formData.password,
        confirmPassword: formData.confirmPassword
      }).toPromise();

      await loading.dismiss();

      const successAlert = await this.alertCtrl.create({
        header: 'Succès',
        message: (response as any).message || 'Compte créé avec succès !',
        buttons: ['OK']
      });
      await successAlert.present();

      this.router.navigateByUrl('/login', { replaceUrl: true });

    } catch (error: any) {
      await loading.dismiss();
      const alert = await this.alertCtrl.create({
        header: 'Échec de l\'inscription',
        message: error.error?.message || 'Une erreur est survenue lors de l\'inscription.',
        buttons: ['OK']
      });
      await alert.present();
    }
  }
}
