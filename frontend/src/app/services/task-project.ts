import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

// URL de base de ton backend (à adapter selon ton environnement)
const BASE_URL = 'http://localhost:3000';

// --- AUTH INTERFACES ---
interface AuthData {
  nameUser?: string;
  email: string;
  password: string;
  confirmPassword?: string;
}

interface AuthResponse {
  token: string;
  user: {
    id: number;
    email: string;
    nameUser: string;
  };
}

// --- PASSWORD RESET INTERFACES ---
export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  token: string;
  newPassword: string;
}

export interface SimpleResponse {
  message: string;
}

// --- PROJECT & TASK INTERFACES ---
export interface Project {
  id: number;
  name: string;
  description: string;
  progress: number;
  color: string;
}

export interface Task {
  id: number;
  title: string;
  description: string;
  status: 'todo' | 'in-progress' | 'overdue' | 'completed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  projectId: number;
  dueDate: string;
}

@Injectable({
  providedIn: 'root',
})
export class TaskProjectService {
  constructor(private http: HttpClient) {}

  // ------------------- AUTH -------------------
  register(data: AuthData): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${BASE_URL}/register`, data);
  }

  login(data: { email: string; password: string }): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${BASE_URL}/login`, data);
  }

  forgotPassword(data: ForgotPasswordRequest): Observable<SimpleResponse> {
    return this.http.post<SimpleResponse>(
      `${BASE_URL}/forgot-password`,
      data
    );
  }

  resetPassword(data: ResetPasswordRequest): Observable<SimpleResponse> {
    return this.http.post<SimpleResponse>(
      `${BASE_URL}/reset-password`,
      data
    );
  }

  logout(): void {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('authToken');
  }

  // ------------------- PROJECTS -------------------
  getProjects(): Observable<Project[]> {
    return this.http.get<Project[]>(`${BASE_URL}/projects`);
  }

  addProject(projectData: Omit<Project, 'id' | 'progress'>): Observable<Project> {
    return this.http.post<Project>(`${BASE_URL}/projects`, projectData);
  }

  updateProject(projectId: number, changes: Partial<Project>): Observable<Project> {
    return this.http.put<Project>(`${BASE_URL}/projects/${projectId}`, changes);
  }

  deleteProject(projectId: number): Observable<any> {
    return this.http.delete(`${BASE_URL}/projects/${projectId}`);
  }

  // ------------------- TASKS -------------------
  getTasks(): Observable<Task[]> {
    return this.http.get<Task[]>(`${BASE_URL}/tasks`);
  }

  addTask(taskData: Omit<Task, 'id'>): Observable<Task> {
    return this.http.post<Task>(`${BASE_URL}/tasks`, taskData);
  }

  updateTask(taskId: number, changes: Partial<Task>): Observable<Task> {
    return this.http.put<Task>(`${BASE_URL}/tasks/${taskId}`, changes);
  }

  deleteTask(taskId: number): Observable<any> {
    return this.http.delete(`${BASE_URL}/tasks/${taskId}`);
  }
}
