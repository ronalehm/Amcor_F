# ODISEO / Amcor F2 — Guía de instalación

Este paquete contiene el código fuente del frontend. **No incluye `node_modules`**
(las dependencias se descargan con `npm install`).

La aplicación funciona de forma autónoma: los datos se manejan localmente en el navegador
(localStorage), por lo que **no requiere base de datos ni servidor backend**.

## Requisitos previos

| Herramienta | Versión recomendada |
|---|---|
| Node.js | 20 LTS o superior |
| npm | 10 o superior |

Verificar con:

```bash
node -v
```

```bash
npm -v
```

## Instalación

Desde la raíz del proyecto, instalar las dependencias:

```bash
npm install
```

Levantar el entorno de desarrollo:

```bash
npm run dev
```

La aplicación queda disponible en **http://localhost:5173**

## Otros comandos

Generar el build de producción:

```bash
npm run build
```

Previsualizar el build generado:

```bash
npm run preview
```

## Pruebas end-to-end (Playwright) — opcional

Instalar los navegadores necesarios la primera vez:

```bash
npx playwright install
```

Ejecutar las pruebas:

```bash
npm run test:e2e
```

## Estructura del proyecto

| Carpeta | Contenido |
|---|---|
| `src/` | Código fuente del frontend (React + TypeScript) |
| `public/` | Recursos estáticos |
| `tests/` | Pruebas automatizadas (Playwright) |
| `scripts/` | Scripts de apoyo |
| `*.md` (raíz) | Documentación funcional, historias de usuario y análisis |

## Problemas frecuentes

**El puerto 5173 está ocupado** — el script `dev` usa `--strictPort`, por lo que falla en
lugar de cambiar de puerto automáticamente. Liberar el puerto o ajustar `package.json`.

**Error al instalar dependencias** — el `package-lock.json` incluido garantiza las mismas
versiones. Si `npm install` falla, usar:

```bash
npm ci
```
