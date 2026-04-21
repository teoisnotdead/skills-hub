import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ZardButtonComponent } from '@/shared/components/button';
import { ZardPaginationComponent } from '@/shared/components/pagination';
import { DevelopersFacade } from './developers.facade';
import { Developer, DeveloperSkill } from '@/core/models/api.models';

const VISIBLE_SKILLS = 3;

@Component({
  selector: 'app-developers',
  standalone: true,
  imports: [FormsModule, RouterLink, ZardButtonComponent, ZardPaginationComponent],
  templateUrl: './developers.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [DevelopersFacade],
})
export class DevelopersComponent {
  protected readonly facade = inject(DevelopersFacade);
  protected readonly currentYear = new Date().getFullYear();

  visibleSkills(dev: Developer): DeveloperSkill[] {
    const sorted = [...dev.developerSkills].sort((a, b) =>
      Number(b.skill.priority) - Number(a.skill.priority),
    );
    return sorted.slice(0, VISIBLE_SKILLS);
  }

  overflowCount(dev: Developer): number {
    return Math.max(0, dev.developerSkills.length - VISIBLE_SKILLS);
  }

  skillDistribution(dev: Developer): { color: string; flex: number }[] {
    if (!dev.developerSkills.length) return [];
    const counts = new Map<string, { color: string; count: number }>();
    for (const ds of dev.developerSkills) {
      const color = ds.level?.color ?? '#888888';
      const existing = counts.get(color);
      if (existing) {
        existing.count++;
      } else {
        counts.set(color, { color, count: 1 });
      }
    }
    return Array.from(counts.values()).map(({ color, count }) => ({ color, flex: count }));
  }

  avatarGradient(name: string): string {
    const hash = name.split('').reduce((acc, c) => (acc * 31 + c.charCodeAt(0)) & 0xffff, 0);
    const h1 = hash % 360;
    const h2 = (h1 + 45) % 360;
    return `linear-gradient(135deg, hsl(${h1} 55% 38%) 0%, hsl(${h2} 55% 28%) 100%)`;
  }

  skillShortName(name: string): string {
    const base = name.split('(')[0].trim();
    return base.length > 18 ? base.slice(0, 18) + '…' : base;
  }
}
