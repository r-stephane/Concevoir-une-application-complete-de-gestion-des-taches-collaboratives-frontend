import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

// ⚠️ Définissez l'URL de base de votre API Backend
const API_BASE_URL = 'http://localhost:3000'; 

// --- Interfaces d'Authentification ---
interface AuthData {
    email: string;
    password: string;
    name?: string; 
}

interface AuthResponse {
    token: string;
    user: {
        id: number;
        email: string;
        name: string;
        isAdmin: boolean;
    };
}

interface ForgotPasswordRequest {
    email: string;
}

interface ResetPasswordRequest {
    token: string; 
    newPassword: string;
}

interface SimpleResponse {
    message: string;
}

// --- Interfaces de Projet et Tâche ---

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
  status: 'todo' | 'in-progress' | 'overdue' | 'completed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  projectId: number;
  dueDate: string;
}


@Injectable({
  providedIn: 'root' 
})
export class TaskProjectService {

  constructor(private http: HttpClient) { }

// ====================================================
// 🔑 AUTHENTIFICATION
// ====================================================

  register(data: AuthData): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${API_BASE_URL}/auth/register`, data);
  }

  login(data: Omit<AuthData, 'name'>): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${API_BASE_URL}/auth/login`, data);
  }

  forgotPassword(data: ForgotPasswordRequest): Observable<SimpleResponse> {
    return this.http.post<SimpleResponse>(`${API_BASE_URL}/auth/forgot-password`, data);
  }

  resetPassword(data: ResetPasswordRequest): Observable<SimpleResponse> {
    return this.http.post<SimpleResponse>(`${API_BASE_URL}/auth/reset-password`, data);
  }

// ====================================================
// 📁 PROJETS (CRUD COMPLET)
// ====================================================

  /**
   * (R) Récupère tous les projets.
   */
  getProjects(): Observable<Project[]> {
    return this.http.get<Project[]>(`${API_BASE_URL}/projects`);
  }
  
  /**
   * (C) Ajoute un nouveau projet.
   * @param projectData Les données du nouveau projet (sans l'ID et la progression qui sont gérés par le backend).
   */
  addProject(projectData: Omit<Project, 'id' | 'progress'>): Observable<Project> {
    // Le backend devrait créer l'ID, la progression (0) et retourner l'objet complet.
    return this.http.post<Project>(`${API_BASE_URL}/projects`, projectData);
  }
  
  /**
   * (D) Supprime un projet.
   * @param projectId L'ID du projet à supprimer.
   */
  deleteProject(projectId: number): Observable<any> {
    return this.http.delete(`${API_BASE_URL}/projects/${projectId}`);
  }

// ====================================================
// 📝 TÂCHES (CRUD COMPLET)
// ====================================================

  /**
   * (R) Récupère toutes les tâches.
   */
  getTasks(): Observable<Task[]> {
    return this.http.get<Task[]>(`${API_BASE_URL}/tasks`);
  }

  /**
   * (C) Ajoute une nouvelle tâche.
   * @param taskData Les données de la nouvelle tâche (sans l'ID qui est géré par le backend).
   */
  addTask(taskData: Omit<Task, 'id'>): Observable<Task> {
    // Le backend devrait créer l'ID et retourner l'objet complet.
    return this.http.post<Task>(`${API_BASE_URL}/tasks`, taskData);
  }

  /**
   * (U) Met à jour une tâche (utilisé notamment pour le Drag & Drop).
   * @param taskId L'ID de la tâche à mettre à jour.
   * @param changes Les modifications partielles (ex: { status: 'in-progress' }).
   */
  updateTask(taskId: number, changes: Partial<Task>): Observable<Task> {
    return this.http.put<Task>(`${API_BASE_URL}/tasks/${taskId}`, changes);
  }
  
  /**
   * (D) Supprime une tâche.
   * @param taskId L'ID de la tâche à supprimer.
   */
  deleteTask(taskId: number): Observable<any> {
    return this.http.delete(`${API_BASE_URL}/tasks/${taskId}`);
  }
} 