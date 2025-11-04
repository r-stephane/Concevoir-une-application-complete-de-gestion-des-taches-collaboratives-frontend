import { Component, OnInit, Injectable } from '@angular/core'; // 👈 CORRECTION: Injectable importé
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, ModalController, AlertController } from '@ionic/angular';
import { DragDropModule, CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs'; 

// Assurez-vous que ce chemin est correct :
import { FilterProjectsPipe } from '../filter-projects.pipe'; 
import { CreateProjectModalComponent } from '../create-project-modal/create-project-modal.component'; 
import { CreateTaskModalComponent } from '../create-task-modal/create-task-modal.component';

// --- Interfaces de Données ---
type TaskStatus = 'todo' | 'in-progress' | 'overdue' | 'completed';
type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';

interface Project {
  id: number;
  name: string;
  description: string;
  progress: number;
  color: string;
}

interface Task {
  id: number;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  projectId: number;
  dueDate: string;
}

interface KanbanColumn {
  name: string;
  status: TaskStatus; 
  icon: string;
  color: string;
  badgeColor: string;
}

interface StatCard {
    title: string;
    value: number;
    icon: string;
    color: string;
}

// =========================================================================
// CLASSE SERVICE SIMULÉE DANS LE MÊME FICHIER
// =========================================================================
@Injectable({ // 👈 CORRECTION APPLIQUÉE ICI
    providedIn: 'root'
})
export class TaskProjectService {
    
    private localProjects: Project[] = [
        { id: 1, name: 'Site Web V2', description: 'Refonte complète du site web de l\'entreprise.', progress: 75, color: '#3b82f6' },
        { id: 2, name: 'Application Mobile', description: 'Développement d\'une application de gestion de projet.', progress: 30, color: '#10b981' },
        { id: 3, name: 'Rapport Annuel', description: 'Préparation du rapport financier pour les actionnaires.', progress: 95, color: '#f59e0b' },
    ];

    private localTasks: Task[] = [
        { id: 1, title: 'Créer maquettes UI/UX', description: 'Définir la structure visuelle des pages principales.', status: 'todo', priority: 'high', projectId: 1, dueDate: '2025-11-01' },
        { id: 2, title: 'Développer API REST', description: 'Mettre en place le backend pour la gestion des données.', status: 'in-progress', priority: 'urgent', projectId: 2, dueDate: '2025-10-28' },
        { id: 3, title: 'Réviser bilan financier', description: 'Vérifier l\'exactitude des chiffres du dernier trimestre.', status: 'completed', priority: 'medium', projectId: 3, dueDate: '2025-10-20' },
        { id: 4, title: 'Implémenter le Drag&Drop', description: 'Ajouter la fonctionnalité de glisser-déposer sur le tableau Kanban.', status: 'overdue', priority: 'high', projectId: 1, dueDate: '2025-10-15' },
        { id: 5, title: 'Écrire la documentation', description: 'Rédiger la documentation technique complète du projet.', status: 'todo', priority: 'low', projectId: 2, dueDate: '2025-11-15' }
    ];

    // Dans une application réelle, vous utiliseriez 'private http: HttpClient' pour les vrais appels API
    constructor(private http: HttpClient) { } 

    // --- PROJETS ---
    getProjects(): Observable<Project[]> {
        return of(this.localProjects); 
    }

    createProject(projectData: Omit<Project, 'id' | 'progress'>): Observable<Project> {
        const newProject: Project = { ...projectData, id: this.localProjects.length + 1, progress: 0 };
        this.localProjects.push(newProject);
        return of(newProject); 
    }
    
    deleteProject(projectId: number): Observable<any> {
        this.localTasks = this.localTasks.filter(t => t.projectId !== projectId);
        this.localProjects = this.localProjects.filter(p => p.id !== projectId);
        return of({ success: true });
    }

    // --- TÂCHES ---
    getTasks(): Observable<Task[]> {
        return of(this.localTasks); 
    }

    createTask(taskData: Omit<Task, 'id'>): Observable<Task> {
        const newTask: Task = { ...taskData, id: this.localTasks.length + 1 };
        this.localTasks.push(newTask);
        return of(newTask); 
    }

    updateTask(taskId: number, changes: Partial<Task>): Observable<Task> {
        const taskIndex = this.localTasks.findIndex(t => t.id === taskId);
        if (taskIndex !== -1) {
            this.localTasks[taskIndex] = { ...this.localTasks[taskIndex], ...changes };
            return of(this.localTasks[taskIndex]);
        }
        return throwError(() => new Error('Tâche non trouvée'));
    }
    
    deleteTask(taskId: number): Observable<any> {
        this.localTasks = this.localTasks.filter(t => t.id !== taskId);
        return of({ success: true }); 
    }
}
// =========================================================================

@Component({
  selector: 'app-dashboard',
  templateUrl: 'dashboard.page.html',
  styleUrls: ['dashboard.page.scss'],
  standalone: true, 
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DragDropModule,
    FilterProjectsPipe,
    // CreateProjectModalComponent, 
    // CreateTaskModalComponent,
    HttpClientModule 
  ]
})
export class DashboardPage implements OnInit {

  public isAdmin: boolean = true; 
  
  projectSearchTerm: string = '';
  statusIds: string[] = []; 

  stats: StatCard[] = [];

  kanbanColumns: KanbanColumn[] = [
    { name: 'À faire', status: 'todo', icon: 'list-outline', color: 'secondary', badgeColor: 'warning' },
    { name: 'En cours', status: 'in-progress', icon: 'hourglass-outline', color: 'warning', badgeColor: 'primary' },
    { name: 'En retard', status: 'overdue', icon: 'alert-circle-outline', color: 'danger', badgeColor: 'light' },
    { name: 'Terminé', status: 'completed', icon: 'checkmark-done-outline', color: 'success', badgeColor: 'success' }
  ];

  projects: Project[] = []; 
  tasks: Task[] = [];

  constructor(
    private modalCtrl: ModalController, 
    private alertCtrl: AlertController,
    private http: HttpClient, 
    private taskProjectService: TaskProjectService 
  ) {}

  ngOnInit() {
    this.statusIds = this.kanbanColumns.map(col => col.status);
    this.loadData();
  }
  
  loadData() {
    this.taskProjectService.getProjects().subscribe({
        next: (projects) => {
            // Mise à jour de la liste locale à partir du service simulé
            this.projects = projects; 
            this.updateStats();
        },
        error: (err) => console.error("Erreur de chargement des projets:", err)
    });

    this.taskProjectService.getTasks().subscribe({
        next: (tasks) => {
            // Mise à jour de la liste locale à partir du service simulé
            this.tasks = tasks; 
            this.updateStats();
        },
        error: (err) => console.error("Erreur de chargement des tâches:", err)
    });
  }


  updateStats() {
    const totalTasks = this.tasks.length; 
    const inProgressTasks = this.tasks.filter(t => t.status === 'in-progress').length;
    const completedTasks = this.tasks.filter(t => t.status === 'completed').length;
    const activeProjects = this.projects.length;

    this.stats = [
        { title: 'Total Tâches', value: totalTasks, icon: 'list-circle-outline', color: 'primary' },
        { title: 'Tâches En Cours', value: inProgressTasks, icon: 'hourglass-outline', color: 'warning' },
        { title: 'Tâches Terminées', value: completedTasks, icon: 'checkmark-done-outline', color: 'success' },
        { title: 'Projets Actifs', value: activeProjects, icon: 'folder-outline', color: 'medium' }
    ];
  }


  getTasksByStatus(status: TaskStatus): Task[] {
    return this.tasks.filter(task => task.status === status);
  }

  getProject(projectId: number): Project | undefined {
    return this.projects.find(p => p.id === projectId);
  }

  drop(event: CdkDragDrop<Task[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex,
      );
      
      const newStatus = event.container.id as TaskStatus;
      const movedTask = event.container.data[event.currentIndex];

      if (movedTask) {
        const indexInTasks = this.tasks.findIndex(t => t.id === movedTask.id);
        if (indexInTasks !== -1) {
            this.tasks[indexInTasks].status = newStatus;
            
            this.taskProjectService.updateTask(movedTask.id, { status: newStatus }).subscribe({
                next: (updatedTask) => console.log('Statut de la tâche mis à jour sur le backend:', updatedTask),
                error: (err) => console.error('Erreur lors de la mise à jour de la tâche:', err)
            });
        }
      }
    }
  }

  // =========================================================================
  // MÉTHODES DE SUPPRESSION AVEC LE SERVICE
  // =========================================================================

  async deleteTask(id: number) {
    if (!this.isAdmin) {
      this.presentAccessDeniedAlert("tâche");
      return;
    }
    
    const task = this.tasks.find(t => t.id === id);

    const alert = await this.alertCtrl.create({
      header: 'Confirmer la suppression',
      message: `Êtes-vous sûr de vouloir supprimer la tâche : <strong>${task?.title || id}</strong> ?`,
      buttons: [
        { text: 'Annuler', role: 'cancel' },
        {
          text: 'Supprimer',
          handler: () => {
            this.taskProjectService.deleteTask(id).subscribe({
                next: () => {
                    this.tasks = this.tasks.filter(t => t.id !== id);
                    this.updateStats(); 
                    console.log(`Tâche ID ${id} supprimée.`);
                },
                error: (err) => console.error("Erreur suppression tâche:", err)
            });
          },
          cssClass: 'alert-button-danger'
        },
      ],
    });

    await alert.present();
  }

  async deleteProject(id: number) {
    if (!this.isAdmin) {
      this.presentAccessDeniedAlert("projet");
      return;
    }

    const project = this.projects.find(p => p.id === id);
    const linkedTasksCount = this.tasks.filter(t => t.projectId === id).length;

    const alert = await this.alertCtrl.create({
      header: 'Confirmer la suppression du Projet',
      message: `Êtes-vous sûr de vouloir supprimer le projet : <strong>${project?.name || id}</strong> ?<br><br>
                ⚠️ **Attention :** Cela supprimera également **${linkedTasksCount}** tâche(s) liée(s) à ce projet.`,
      buttons: [
        { text: 'Annuler', role: 'cancel' },
        {
          text: 'Supprimer',
          handler: () => {
            this.taskProjectService.deleteProject(id).subscribe({
                next: () => {
                    this.projects = this.projects.filter(p => p.id !== id);
                    this.tasks = this.tasks.filter(t => t.projectId !== id);
                    this.updateStats();
                    console.log(`Projet ID ${id} et ses tâches liées supprimés.`);
                },
                error: (err) => console.error("Erreur suppression projet:", err)
            });
          },
          cssClass: 'alert-button-danger'
        },
      ],
    });

    await alert.present();
  }

  private async presentAccessDeniedAlert(itemType: string) {
    const alert = await this.alertCtrl.create({
        header: 'Accès Refusé',
        message: `Vous n'avez pas les droits d'administrateur pour supprimer cet élément (${itemType}).`,
        buttons: ['OK']
    });
    await alert.present();
  }

  // =========================================================================
  // LOGIQUE DES MODALES AVEC LE SERVICE
  // =========================================================================

  async openCreateProjectModal() {
    if (!this.isAdmin) {
      this.presentAccessDeniedAlert("projet");
      return; 
    }
    
    const modal = await this.modalCtrl.create({
      component: CreateProjectModalComponent,
      componentProps: {} 
    });
    
    await modal.present();

    const { data, role } = await modal.onWillDismiss();
    
    if (role === 'confirm' && data) {
      this.taskProjectService.createProject(data).subscribe({
          next: (newProject) => {
              this.projects.push(newProject);
              this.updateStats();
              console.log('Nouveau projet créé et ajouté:', newProject);
          },
          error: (err) => console.error("Erreur création projet:", err)
      });
    }
  }

  async openCreateTaskModal() {
    const modal = await this.modalCtrl.create({
      component: CreateTaskModalComponent,
      componentProps: {
        availableProjects: this.projects,
        isAdmin: this.isAdmin
      }
    });
    
    await modal.present();

    const { data, role } = await modal.onWillDismiss();
    
    if (role === 'confirm' && data) {
      this.taskProjectService.createTask(data).subscribe({
          next: (newTask) => {
              this.tasks.push(newTask);
              this.updateStats();
              console.log('Nouvelle tâche créée et ajoutée:', newTask);
          },
          error: (err) => console.error("Erreur création tâche:", err)
      });
    }
  }
}