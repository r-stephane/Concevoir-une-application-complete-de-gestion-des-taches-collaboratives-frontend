import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, ModalController } from '@ionic/angular';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-create-project-modal',
  templateUrl: './create-project-modal.component.html',
  styleUrls: ['./create-project-modal.component.scss'],
  standalone: true,
  imports: [
    CommonModule, 
    IonicModule, 
    ReactiveFormsModule // Nécessaire
  ]
})
export class CreateProjectModalComponent implements OnInit {

  projectForm!: FormGroup;

  constructor(
    private modalCtrl: ModalController,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.projectForm = this.fb.group({
      // Nom est requis (Validators.required)
      name: ['', Validators.required], 
      // Description est optionnelle
      description: [''], 
      // Couleur par défaut, peut être modifiée par l'utilisateur
      color: ['#3b82f6'], 
      // ownerId: [null] // Optionnel: Si vous gérez l'assignation de responsable ici
    });
  }

  // Ferme la modale sans renvoyer de données
  cancel() {
    return this.modalCtrl.dismiss(null, 'cancel');
  }

  // Valide et ferme la modale en renvoyant les données du nouveau projet
  async confirm() {
    if (this.projectForm.valid) {
      // Renvoie les données du formulaire avec le rôle 'confirm'
      await this.modalCtrl.dismiss(this.projectForm.value, 'confirm');
    }
  }
  
}
