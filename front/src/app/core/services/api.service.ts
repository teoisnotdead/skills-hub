import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Developer, DeveloperFilters, KnowledgeLevel, PaginatedDevelopers } from '@/core/models/api.models';
import { appConfig } from '@/core/config/app.config';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = appConfig.apiBaseUrl;

  getDevelopers(filters: DeveloperFilters = {}): Observable<PaginatedDevelopers> {
    let params = new HttpParams();
    if (filters.name) params = params.set('name', filters.name);
    if (filters.skillName) params = params.set('skillName', filters.skillName);
    if (filters.levelName) params = params.set('levelName', filters.levelName);
    if (filters.mlLevel) params = params.set('mlLevel', filters.mlLevel);
    if (filters.page) params = params.set('page', filters.page.toString());
    if (filters.limit) params = params.set('limit', filters.limit.toString());
    if (filters.onlyPriority) params = params.set('onlyPriority', 'true');
    return this.http.get<PaginatedDevelopers>(`${this.baseUrl}/developers`, { params });
  }

  getDeveloperById(id: number): Observable<Developer> {
    return this.http.get<Developer>(`${this.baseUrl}/developers/${id}`);
  }

  getKnowledgeLevels(): Observable<KnowledgeLevel[]> {
    return this.http.get<KnowledgeLevel[]>(`${this.baseUrl}/knowledge-levels`);
  }
}
