# Chapter Skills - Directorio de Competencias

## Que es este proyecto
App interna para el **Chapter JavaScript** de la empresa. Permite visualizar y filtrar las skills de todos los developers del chapter, basándose en una Matriz de Competencias que se lleva en Excel (SharePoint).

## Estructura del repositorio
```
projects/
├── chapter-skills-api/     # Backend NestJS
└── chapter-skills-app/     # Frontend Angular (pendiente de crear)
```

## Stack
- **Backend**: NestJS + TypeORM + PostgreSQL
- **Frontend**: Angular + TailwdindCSS + Zard UI
- **BD local**: PostgreSQL portable (sin contraseña)
- **Excel fuente**: SharePoint — por ahora se descarga manual y se pone en `samples/`

## Estado actual
- [x] Backend NestJS creado y funcionando en puerto 3000
- [x] Modelo de datos con entidades: Developer, Skill, KnowledgeLevel, DeveloperSkill
- [x] Parser del Excel (lee hoja "Matriz de Competencias")
- [x] Endpoints de filtrado por nombre, skill, nivel, ML level
- [x] Import del Excel funcionando con datos reales
- [ ] Frontend Angular (próximo paso)
- [ ] CRUD endpoints para editar datos sin re-importar Excel
- [ ] Integración con Microsoft Graph API (futuro, requiere Azure AD)

## Flujo de import
1. Descargar Excel de SharePoint manualmente
2. Copiar a `chapter-skills-api/samples/Chapter_Front_Matriz_Competencias.xlsx`
3. Limpiar BD: `TRUNCATE developer_skills, developers, skills, knowledge_levels RESTART IDENTITY CASCADE;`
4. Llamar `GET http://localhost:3000/api/import/sample`

## Modelo de datos
- **developers**: id, name, mlLevel (ej: "11")
- **skills**: id, number, name, priority (bool), expectedExperto, expectedGeneral
- **knowledge_levels**: id, name, color, order — extensible, seed inicial: Experto / General
- **developer_skills**: developer_id, skill_id, level_id

## Endpoints disponibles
- `GET /api/developers?name=&skillName=&levelName=&mlLevel=`
- `GET /api/skills?priority=true`
- `GET /api/knowledge-levels`
- `POST /api/import/excel` — sube .xlsx via form-data (key: "file")
- `GET /api/import/sample` — importa desde samples/ directamente
- `GET /api/import/debug` — muestra las primeras 20 filas crudas del Excel

## DB connection
```
Host: localhost:5432
User: postgres
Password: (sin contraseña)
DB: postgres
```
