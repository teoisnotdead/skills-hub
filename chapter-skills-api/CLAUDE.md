# chapter-skills-api — Backend NestJS

## Levantar el proyecto
```bash
npm run start:dev
# Corre en http://localhost:3000/api
```

## Estructura
```
src/
├── developers/
│   ├── developer.entity.ts          # entidad Developer
│   ├── developer-skill.entity.ts    # tabla pivot con nivel
│   ├── developers.module.ts
│   ├── developers.service.ts        # findAll con filtros, save, saveDeveloperSkill
│   └── developers.controller.ts     # GET /developers?name=&skillName=&levelName=&mlLevel=
├── skills/
│   ├── skill.entity.ts
│   ├── skills.module.ts
│   ├── skills.service.ts            # findAll, findByName, upsert
│   └── skills.controller.ts         # GET /skills?priority=true
├── knowledge-levels/
│   ├── knowledge-level.entity.ts
│   ├── knowledge-levels.module.ts
│   ├── knowledge-levels.service.ts  # seed(), findByName, create, remove
│   └── knowledge-levels.controller.ts
└── import/
    ├── import.module.ts
    ├── import.service.ts            # parser del Excel
    └── import.controller.ts         # GET /import/sample, GET /import/debug, POST /import/excel
```

## Estructura del Excel (hoja: "Matriz de Competencias")
```
Fila 6 (índice 6): nombres de developers — columnas 11+
Fila 7 (índice 7): ML levels ("ML:11") — columnas 11+
Fila 8+ (índice 8+): datos de skills
  col 2: número de skill
  col 3: prioridad ("Sí" / null)
  col 4: nombre de skill
  col 11+: nivel del developer (Experto / General / null)
```

## Notas importantes
- `synchronize: true` en TypeORM — las tablas se crean/actualizan solas al levantar
- Sin contraseña en PostgreSQL local
- El Excel tiene una hoja de ejemplo (hoja 1) y la real (hoja "Matriz de Competencias")
- Los knowledge_levels son extensibles — se agregan filas a la tabla, no hay enum en código
- Puerto: 3000

## Pendiente
- CRUD endpoints para editar developers/skills sin re-importar Excel
- Integración Microsoft Graph API para leer Excel desde SharePoint automáticamente
