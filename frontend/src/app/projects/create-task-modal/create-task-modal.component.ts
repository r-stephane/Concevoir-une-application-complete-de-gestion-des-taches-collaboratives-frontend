import { Component, OnInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, ModalController } from '@ionic/angular';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';

// Définitions minimales pour éviter les erreurs de compilation (doivent être les mêmes que dans dashboard.page.ts)
interface Project {
  id: number;
  name: string;
}

interface User {
  id: number;
  name: string;
  role: string;
}

@Component({
  selector: 'app-create-task-modal',
  templateUrl: './create-task-modal.component.html',
  styleUrls: ['./create-task-modal.component.scss'],
  standalone: true,
  imports: [
    CommonModule, 
    IonicModule, 
    ReactiveFormsModule // NÉCESSAIRE pour les formulaires réactifs
  ]
})
export class CreateTaskModalComponent implements OnInit {

  // Données reçues du composant parent (DashboardPage) via componentProps
  @Input() availableProjects: Project[] = [];
  @Input() isAdmin: boolean = false;
  
  // Simulation des utilisateurs disponibles (à remplacer par un service réel)
  availableUsers: User[] = [
    { id: 1, name: 'Alice Dupont', role: 'Admin' },
    { id: 2, name: 'Bob Martin', role: 'Membre' },
    { id: 3, name: 'Charlie Lefevre', role: 'Membre' },
  ];

  taskForm!: FormGroup;

  constructor(
    private modalCtrl: ModalController,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.taskForm = this.fb.group({
      title: ['', Validators.required],
      description: [''],
      projectId: [null, Validators.required], // ID du projet
      priority: ['medium', Validators.required],
      dueDate: ['', Validators.required],
      assignedUserId: [null], // ID de l'utilisateur assigné (optionnel, surtout pour les non-admins)
    });
  }

  // Ferme la modale sans sauvegarder
  cancel() {
    // Le rôle 'cancel' est une convention pour indiquer une fermeture sans action de confirmation
    return this.modalCtrl.dismiss(null, 'cancel');
  }

  // Valide le formulaire et ferme la modale en renvoyant les données
 confirm() {
  if (this.taskForm.valid) {
    // Si valide, retourne la promesse de fermeture avec les données
    return this.modalCtrl.dismiss(this.taskForm.value, 'confirm');
  }
  return Promise.resolve();
}
}