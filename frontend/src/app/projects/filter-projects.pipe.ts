import { Pipe, PipeTransform } from '@angular/core';

// Définir l'interface Project (à réutiliser de dashboard.page.ts)
interface Project {
  id: number;
  name: string;
  description: string;
  progress: number;
  color: string;
}

@Pipe({
  name: 'filterProjects',
  standalone: true // Rendre le pipe standalone pour une importation facile dans le DashboardPage
})
export class FilterProjectsPipe implements PipeTransform {
  /**
   * Filtre la liste des projets en fonction du terme de recherche.
   * @param projects Le tableau de projets à filtrer.
   * @param searchTerm Le terme de recherche saisi par l'utilisateur.
   */
  transform(projects: Project[] | null, searchTerm: string): Project[] {
    if (!projects || !searchTerm) {
      return projects || [];
    }

    const lowerCaseSearchTerm = searchTerm.toLowerCase();

    // Filtre par nom ou description du projet
    return projects.filter(project => 
      project.name.toLowerCase().includes(lowerCaseSearchTerm) ||
      project.description.toLowerCase().includes(lowerCaseSearchTerm)
    );
  }
}