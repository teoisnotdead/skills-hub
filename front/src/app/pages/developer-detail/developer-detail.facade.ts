import { computed, inject, Injectable, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { catchError, of } from 'rxjs';
import { ApiService } from '@/core/services/api.service';
import { Developer, DeveloperSkill, KnowledgeLevel } from '@/core/models/api.models';

export interface SkillGroup {
  level: KnowledgeLevel;
  skills: DeveloperSkill[];
  priorityCount: number;
}

@Injectable()
export class DeveloperDetailFacade {
  private readonly api = inject(ApiService);

  readonly developer = signal<Developer | null>(null);
  readonly loading = signal(true);
  readonly notFound = signal(false);

  readonly stats = computed(() => {
    const dev = this.developer();
    if (!dev) return { total: 0, priority: 0 };
    return {
      total: dev.developerSkills.length,
      priority: dev.developerSkills.filter((ds) => ds.skill.priority).length,
    };
  });

  readonly skillsByLevel = computed((): SkillGroup[] => {
    const dev = this.developer();
    if (!dev?.developerSkills.length) return [];

    const map = new Map<string, SkillGroup>();

    for (const ds of dev.developerSkills) {
      const key = ds.level.name;
      if (!map.has(key)) {
        map.set(key, { level: ds.level, skills: [], priorityCount: 0 });
      }
      const group = map.get(key)!;
      group.skills.push(ds);
      if (ds.skill.priority) group.priorityCount++;
    }

    for (const group of map.values()) {
      group.skills.sort(
        (a, b) =>
          Number(b.skill.priority) - Number(a.skill.priority) ||
          a.skill.name.localeCompare(b.skill.name),
      );
    }

    return [...map.values()].sort((a, b) => a.level.order - b.level.order);
  });

  constructor() {
    const route = inject(ActivatedRoute);
    const id = Number(route.snapshot.paramMap.get('id'));

    this.api
      .getDeveloperById(id)
      .pipe(
        catchError(() => of(null)),
        takeUntilDestroyed(),
      )
      .subscribe((dev) => {
        this.developer.set(dev);
        this.loading.set(false);
        this.notFound.set(dev === null);
      });
  }
}
