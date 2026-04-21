# chapter-skills-api

Backend de **Chapter Skills**, una app interna para el Chapter Frontend JavaScript de Accenture. Permite visualizar y filtrar las competencias de los developers del chapter a partir de una Matriz de Competencias en Excel (SharePoint).

---

## Stack

| Tecnología | Versión | Rol |
|---|---|---|
| NestJS | 11 | Framework HTTP |
| TypeORM | 0.3 | ORM |
| PostgreSQL | — | Base de datos |
| class-validator / class-transformer | — | Validación y transformación de DTOs |
| xlsx | — | Parser de archivos Excel |
| Node.js | — | Runtime |

---

## Arquitectura

El backend sigue una arquitectura de **3 capas** dentro de cada módulo NestJS, inspirada en los principios de arquitectura hexagonal pero sin sobreingeniería:

```
HTTP Request
    │
    ▼
Controller          ← valida entrada con DTOs (class-validator)
    │
    ▼
Service             ← orquesta la lógica de negocio
    │
    ▼
Repository          ← acceso a datos (TypeORM QueryBuilder encapsulado)
    │
    ▼
PostgreSQL
```

### Patrones aplicados

- **Repository Pattern** — las queries de TypeORM (incluyendo QueryBuilders) viven en `*.repository.ts`, no en los servicios. El servicio no conoce TypeORM.
- **DTO + Validación** — cada endpoint que recibe datos tiene un DTO validado con `class-validator`. `ValidationPipe` global con `whitelist: true` y `transform: true`.
- **Parser / Orquestador** — el import de Excel está separado en dos clases:
  - `ExcelParserService` — lee el buffer y devuelve datos puros (sin tocar la BD)
  - `ImportService` — orquesta el upsert de entidades usando los datos parseados
- **Transacciones** — el import completo se ejecuta dentro de `DataSource.transaction()`. Si falla en cualquier punto, hace rollback automático.

### Estructura de módulos

```
src/
├── developers/
│   ├── dto/
│   │   └── find-developers.dto.ts        # Query params con validación
│   ├── developer.entity.ts
│   ├── developer-skill.entity.ts
│   ├── developer.repository.ts           # QueryBuilder + ops de escritura
│   ├── developers.service.ts             # Orquestador (lógica de negocio)
│   ├── developers.controller.ts
│   └── developers.module.ts
├── skills/
│   ├── skill.entity.ts
│   ├── skills.service.ts
│   ├── skills.controller.ts
│   └── skills.module.ts
├── knowledge-levels/
│   ├── dto/
│   │   └── create-knowledge-level.dto.ts
│   ├── knowledge-level.entity.ts
│   ├── knowledge-levels.service.ts
│   ├── knowledge-levels.controller.ts
│   └── knowledge-levels.module.ts
└── import/
    ├── excel-parser.service.ts           # Parseo de Excel → datos puros
    ├── import.service.ts                 # Orquestador + transacción
    ├── import.controller.ts
    └── import.module.ts
```

---

## Modelo de datos

```
developers          skills              knowledge_levels
──────────          ──────              ────────────────
id                  id                  id
name                number              name
mlLevel             name                color
                    priority            order
                    expectedExperto
                    expectedGeneral

developer_skills  (tabla pivot)
────────────────
developer_id  →  developers.id
skill_id      →  skills.id
level_id      →  knowledge_levels.id
```

---

## Configuración local

### Requisitos
- Node.js 18+
- PostgreSQL (sin contraseña en desarrollo)

### Variables de entorno

Crear un `.env` en la raíz (o usar los valores por defecto):

```env
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=
DB_NAME=postgres
PORT=3000
```

### Instalación y arranque

```bash
npm install
npm run start:dev
# API disponible en http://localhost:3000/api
```

---

## Endpoints

### Developers

```
GET /api/developers
  ?name=        búsqueda parcial por nombre (case-insensitive)
  ?skillName=   búsqueda parcial por skill
  ?levelName=   filtro exacto por nivel (Experto / General)
  ?mlLevel=     búsqueda parcial por ML level
  ?page=        número de página (default: 1)
  ?limit=       resultados por página (default: 12, max: 100)

Respuesta: { data, total, page, limit, totalPages }
```

### Skills

```
GET /api/skills
  ?priority=true   solo skills marcadas como prioritarias
```

### Knowledge Levels

```
GET    /api/knowledge-levels
POST   /api/knowledge-levels   body: { name, color?, order? }
DELETE /api/knowledge-levels/:id
```

### Import

```
GET  /api/import/sample    importa desde samples/Chapter_Front_Matriz_Competencias.xlsx
POST /api/import/excel     sube un .xlsx via multipart/form-data (key: "file")
GET  /api/import/debug     muestra las primeras 20 filas crudas del Excel
```

---

## Flujo de import

1. Descargar el Excel de SharePoint manualmente
2. Copiar a `samples/Chapter_Front_Matriz_Competencias.xlsx`
3. Limpiar la BD:
   ```sql
   TRUNCATE developer_skills, developers, skills, knowledge_levels RESTART IDENTITY CASCADE;
   ```
4. `GET http://localhost:3000/api/import/sample`

El import corre dentro de una **transacción**: si algo falla, ningún dato queda guardado a medias.

---

## Estructura del Excel esperado

Hoja: `"Matriz de Competencias"`

| Fila | Contenido |
|---|---|
| 7 (índice 6) | Nombres de developers (col 12+) |
| 8 (índice 7) | ML levels en formato `ML:11` (col 12+) |
| 9+ (índice 8+) | Datos de skills |

Columnas de skills (índice base 0):
- Col 2: número de skill
- Col 3: prioridad (`"Sí"` / vacío)
- Col 4: nombre de skill
- Col 12+: nivel del developer (`Experto` / `General` / vacío)
