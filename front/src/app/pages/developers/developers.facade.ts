import { computed, inject, Injectable, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { catchError, of, Subject, switchMap, tap } from 'rxjs';
import { ApiService } from '@/core/services/api.service';
import { KnowledgeLevel, PaginatedDevelopers } from '@/core/models/api.models';

const PAGE_SIZE = 12;

@Injectable()
export class DevelopersFacade {
  private readonly api = inject(ApiService);

  readonly nameFilter = signal('');
  readonly skillFilter = signal('');
  readonly levelFilter = signal('');
  readonly mlLevelFilter = signal('');
  readonly priorityFilter = signal(false);
  readonly currentPage = signal(1);
  readonly levels = signal<KnowledgeLevel[]>([]);
  readonly result = signal<PaginatedDevelopers | null>(null);
  readonly loading = signal(false);

  readonly developers = computed(() => this.result()?.data ?? []);
  readonly total = computed(() => this.result()?.total ?? 0);
  readonly totalPages = computed(() => this.result()?.totalPages ?? 0);
  readonly hasActiveFilters = computed(
    () =>
      !!(
        this.nameFilter() ||
        this.skillFilter() ||
        this.levelFilter() ||
        this.mlLevelFilter() ||
        this.priorityFilter()
      ),
  );

  private readonly searchTrigger$ = new Subject<void>();

  constructor() {
    this.api
      .getKnowledgeLevels()
      .pipe(takeUntilDestroyed())
      .subscribe((l: KnowledgeLevel[]) => this.levels.set(l));

    this.searchTrigger$
      .pipe(
        tap(() => this.loading.set(true)),
        switchMap(() =>
          this.api
            .getDevelopers({
              name: this.nameFilter() || undefined,
              skillName: this.skillFilter() || undefined,
              levelName: this.levelFilter() || undefined,
              mlLevel: this.mlLevelFilter() || undefined,
              onlyPriority: this.priorityFilter() || undefined,
              page: this.currentPage(),
              limit: PAGE_SIZE,
            })
            .pipe(catchError(() => of(null))),
        ),
        takeUntilDestroyed(),
      )
      .subscribe((result) => {
        this.result.set(result);
        this.loading.set(false);
      });

    this.search();
  }

  search(): void {
    this.searchTrigger$.next();
  }

  applyFilters(): void {
    this.currentPage.set(1);
    this.search();
  }

  setLevelFilter(value: string): void {
    this.levelFilter.set(value);
    this.applyFilters();
  }

  togglePriority(): void {
    this.priorityFilter.update((v) => !v);
    this.applyFilters();
  }

  clearFilters(): void {
    this.nameFilter.set('');
    this.skillFilter.set('');
    this.levelFilter.set('');
    this.mlLevelFilter.set('');
    this.priorityFilter.set(false);
    this.currentPage.set(1);
    this.search();
  }

  onPageChange(page: number): void {
    this.currentPage.set(page);
    this.search();
  }
}
