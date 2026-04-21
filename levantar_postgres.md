# 🐘 Levantar PostgreSQL Portable en Windows

## 1. Abrir CMD o PowerShell

## 2. Ir a la carpeta de PostgreSQL
```cmd
cd C:\postgresql
```
> Cambia la ruta si lo extrajiste en otro lugar

## 3. Iniciar el servidor
```cmd
bin\pg_ctl -D data -l data\logfile.txt start
```
Deberías ver:
```
waiting for server to start.... done
server started
```

## 4. Conectarte por CMD (opcional)
```cmd
bin\psql -U postgres
```

## 5. Abrir DBeaver y conectarte
- **Host:** `localhost`
- **Puerto:** `5432`
- **Database:** `postgres` (o el nombre de tu bd)
- **Usuario:** `postgres`
- **Contraseña:** (vacía)

---

## 🛑 Antes de apagar la PC — detener el servidor
```cmd
bin\pg_ctl -D data stop
```

---

## 📌 URI de conexión
```
postgresql://postgres@localhost:5432/nombre_de_tu_bd
```

---

## 🗄️ Comandos útiles dentro de psql

| Comando | Descripción |
|---|---|
| `\l` | Listar bases de datos |
| `\c nombre_bd` | Conectarse a una bd |
| `\dt` | Listar tablas |
| `\q` | Salir |
| `CREATE DATABASE nombre;` | Crear una bd |
| `DROP SCHEMA public CASCADE;` | Limpiar toda la bd |
| `CREATE SCHEMA public;` | Recrear el esquema limpio |
