# chapter-skills-app

Frontend de **Chapter Skills**, una app interna para el Chapter Frontend JavaScript de Accenture Chile. Permite visualizar y filtrar las competencias de los developers del chapter con una interfaz pensada para developers.

> Requiere que `chapter-skills-api` esté corriendo en `http://localhost:3000`.

---

## Stack

| Tecnología | Versión | Rol |
|---|---|---|
| Angular | 21 | Framework SPA |
| TailwindCSS | 4 | Estilos utilitarios |
| Zard UI | custom | Sistema de componentes propio |
| class-variance-authority | — | Variantes de componentes (CVA) |
| ng-icons + Lucide | — | Iconografía |
| RxJS | 7.8 | Gestión de streams reactivos |
| Vitest | — | Tests unitarios |

---

## Arquitectura

### Patrón Facade

Cada página tiene un **Facade** (`*.facade.ts`) que actúa como capa de estado y lógica de negocio. El componente solo gestiona presentación.

```
Template (HTML)
    │  bindings / eventos
    ▼
Component (.ts)        ← solo presentación y helpers de vista
    │  inject()
    ▼
Facade (.ts)           ← estado (signals), lógica, llamadas a API
    │
    ▼
ApiService             ← HTTP puro, retorna Observables
    │
    ▼
chapter-skills-api
```

El Facade se provee en `providers: [DevelopersFacade]` del componente, lo que lo **scopea al ciclo de vida de la página** y permite usar `takeUntilDestroyed()` sin configuración adicional.

### Reactividad con Signals + RxJS

- Estado de la UI: **signals** (`signal`, `computed`) de Angular
- Requests HTTP: **`Subject` + `switchMap`** — cancela automáticamente requests anteriores si llega un nuevo filtro antes de que el anterior responda
- Debounce de inputs: **`ZardDebounceEventManagerPlugin`** — sintaxis `(input.debounce.300)="facade.applyFilters()"` directamente en el template, sin lógica en el componente

### Componentes Zard (sistema de diseño propio)

Los componentes en `shared/components/` siguen estos principios:

- **Standalone** — sin NgModules
- **`ChangeDetectionStrategy.OnPush`** — solo re-renderizan cuando cambia una referencia
- **`ViewEncapsulation.None`** — Tailwind aplica sin conflictos
- **CVA (class-variance-authority)** — variantes tipadas en `*.variants.ts`
- **`input()` signals** — props modernas de Angular 17+

#### Zard Event Manager Plugins

Plugins de eventos registrados globalmente via `provideZard()`:

| Sintaxis en template | Efecto |
|---|---|
| `(click.prevent)` | `event.preventDefault()` |
| `(click.stop)` | `event.stopPropagation()` |
| `(input.debounce.300)` | debounce de 300ms (o el valor indicado) |
| `(keydown.enter.prevent)` | `preventDefault` solo en Enter |

---

## Estructura del proyecto

```
src/app/
├── core/
│   ├── config/
│   │   └── app.config.ts          # apiBaseUrl y config centralizada
│   ├── models/
│   │   └── api.models.ts          # interfaces: Developer, Skill, KnowledgeLevel, etc.
│   └── services/
│       └── api.service.ts         # HTTP client (getDevelopers, getKnowledgeLevels)
│
├── pages/
│   └── developers/
│       ├── developers.facade.ts   # estado, filtros, paginación, carga reactiva
│       ├── developers.component.ts
│       └── developers.component.html
│
├── shared/
│   ├── components/
│   │   ├── button/                # ZardButtonComponent — z-button / button[z-button]
│   │   └── pagination/            # ZardPaginationComponent — z-pagination
│   ├── core/
│   │   ├── directives/            # IdDirective, StringTemplateOutletDirective
│   │   └── provider/
│   │       ├── providezard.ts                          # registra los plugins
│   │       └── event-manager-plugins/
│   │           ├── zard-event-manager-plugin.ts        # .prevent, .stop
│   │           └── zard-debounce-event-manager-plugin.ts  # .debounce.N
│   └── utils/
│       ├── merge-classes.ts       # clsx + tailwind-merge
│       └── number.ts              # clamp, roundToStep, convertValueToPercentage
│
├── app.config.ts      # provideRouter, provideHttpClient, provideZard
├── app.routes.ts      # '/' → DevelopersComponent (lazy), '**' → redirect
└── app.ts             # shell con <router-outlet>
```

---

## Principios SOLID aplicados

| Principio | Cómo se aplica |
|---|---|
| **S** Single Responsibility | `Component` = presentación. `Facade` = estado/lógica. `ApiService` = HTTP. `app.config.ts` = configuración. |
| **O** Open/Closed | Variantes de Zard se extienden agregando entradas a `*.variants.ts` sin modificar el componente |
| **D** Dependency Inversion | El `Component` depende del `Facade` via `inject()`. El `Facade` depende de `ApiService` via `inject()`. Nunca instanciación directa. |

---

## Configuración local

### Requisitos
- Node.js 18+
- `chapter-skills-api` corriendo en `:3000`

### Instalación y arranque

```bash
npm install
npm start
# App disponible en http://localhost:4200
```

### Cambiar la URL de la API

Editar `src/app/core/config/app.config.ts`:

```ts
export const appConfig = {
  apiBaseUrl: 'http://localhost:3000/api',
} as const;
```

---

## Path aliases

`@/*` mapea a `src/app/*`:

```ts
import { ApiService } from '@/core/services/api.service';
import { DevelopersFacade } from '@/pages/developers/developers.facade';
```

---

## Decisiones de diseño

- **Dark mode permanente** — `class="dark"` fijo en `<html>`. La paleta usa variables OKLCH definidas en `styles.css`.
- **Cards compactas** — cada card muestra máximo 3 skills visibles + badge `+N`, y una barra de distribución por nivel al pie, evitando cards de altura variable.
- **Avatares generados** — el gradiente de cada avatar se genera deterministamente del nombre del developer (`hash * 31 + charCode`), garantizando consistencia entre cargas.
- **Colores de nivel dinámicos** — los colores de los badges y la barra de distribución provienen del backend (`KnowledgeLevel.color`), no están hardcodeados en el frontend.
- **Skeleton loading** — dimensiones del skeleton coinciden con las cards reales para evitar layout shift.
