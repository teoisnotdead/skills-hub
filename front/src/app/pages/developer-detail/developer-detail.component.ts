import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Location } from '@angular/common';
import { DeveloperDetailFacade } from './developer-detail.facade';

@Component({
  selector: 'app-developer-detail',
  standalone: true,
  imports: [],
  templateUrl: './developer-detail.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [DeveloperDetailFacade],
})
export class DeveloperDetailComponent {
  protected readonly facade = inject(DeveloperDetailFacade);
  private readonly location = inject(Location);

  protected goBack(): void {
    this.location.back();
  }

  protected avatarGradient(name: string): string {
    const hash = name.split('').reduce((acc, c) => (acc * 31 + c.charCodeAt(0)) & 0xffff, 0);
    const h1 = hash % 360;
    const h2 = (h1 + 45) % 360;
    return `linear-gradient(135deg, hsl(${h1} 55% 38%) 0%, hsl(${h2} 55% 28%) 100%)`;
  }

  protected readonly currentYear = new Date().getFullYear();
}
