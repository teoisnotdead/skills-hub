# chapter-skills-app — Frontend Angular

## Levantar el proyecto
```bash
npm start
# Corre en http://localhost:4200
# Requiere que chapter-skills-api esté corriendo en :3000
```

## Stack
- Angular 21 (standalone components, signals, `ChangeDetectionStrategy.OnPush`)
- TailwindCSS 4
- Zard UI — componentes propios en `shared/components/` (Button, Pagination)
- ng-icons con set Lucide
- Vitest para tests

## Alias de paths
`@/*` → `src/app/*`
```ts
import { ApiService } from '@/core/services/api.service';
```

## Estructura
```
src/app/
├── core/
│   ├── models/api.models.ts      # interfaces: Developer, Skill, KnowledgeLevel, DeveloperFilters, PaginatedDevelopers
│   └── services/api.service.ts   # getDevelopers(filters), getKnowledgeLevels()
├── pages/
│   └── developers/
│       ├── developers.component.ts   # página principal con filtros y paginación
│       └── developers.component.html
├── shared/
│   ├── components/
│   │   ├── button/       # ZardButtonComponent — selector: z-button / button[z-button] / a[z-button]
│   │   └── pagination/   # ZardPaginationComponent
│   ├── core/
│   │   ├── directives/   # IdDirective, StringTemplateOutletDirective
│   │   └── provider/     # provideZard() — registra event manager plugins de Zard
│   └── utils/
│       ├── merge-classes.ts   # clsx + tailwind-merge
│       └── number.ts
├── app.config.ts    # provideRouter, provideHttpClient, provideZard
├── app.routes.ts    # '/' → DevelopersComponent (lazy), '**' → redirect
└── app.ts           # shell
```

## Convenciones del proyecto
- Todos los componentes son **standalone** — sin NgModules
- Estado con **signals** (`signal`, `computed`). No usar `BehaviorSubject` ni `async pipe`
- `ChangeDetectionStrategy.OnPush` en todos los componentes
- Componentes Zard usan `ViewEncapsulation.None` y variants con `class-variance-authority`
- Los componentes Zard se exportan vía `index.ts` en su carpeta

## API base
`http://localhost:3000/api`

## Pendiente
- Página de detalle de developer
- Filtros reactivos (sin botón "Buscar")
- Vista de skills / matriz completa
- Componentes Zard adicionales según necesidad (Input, Select, Badge, Card…)
