# 🖼️ Image Loading Test Guide

Este documento explica cómo ejecutar los tests automatizados para verificar la carga de imágenes en el ProductEditPage.

## 📋 ¿Qué hacen los tests?

El test suite `image-loading.spec.ts` verifica:

1. ✅ **Rewinding Direction Images** - Carga de las 8 imágenes de sentido de bobinado
2. ✅ **Wrapping Type Images** - Carga de imágenes de envoltura (POUCH, BOLSA, LAMINA)
3. ✅ **Network Errors** - Detecta errores 404 o 500 en la carga de imágenes
4. ✅ **Console Errors** - Busca errores relacionados con imágenes en la consola del navegador

## 🚀 Ejecutar los tests

### Opción 1: Scripts directos (Recomendado)

#### Windows
```bash
run-image-tests.bat
```

#### Linux/Mac
```bash
chmod +x run-image-tests.sh
./run-image-tests.sh
```

### Opción 2: Comandos npm

```bash
# Ejecutar solo tests de imágenes (headless)
npm run test:images

# Ejecutar tests con interfaz visual (UI Mode)
npm run test:images:ui

# Ejecutar todos los E2E tests
npm run test:e2e

# Ejecutar todos los E2E tests con UI
npm run test:e2e:ui
```

## 📊 Resultados de los tests

Después de ejecutar, encontrarás:

- **Reporte HTML**: `./playwright-report/index.html`
  - Abre este archivo en el navegador para ver resultados detallados
  - Incluye screenshots y videos si algo falla

- **Reporte JSON**: `./test-results.json`
  - Datos estructurados para análisis automatizado

## 🔍 Interpretar los resultados

### ✅ Exitoso
```
✓ Verify Rewinding Direction images load correctly (5s)
✓ Verify Wrapping Type images load correctly in sidebar (3s)
✓ Check for 404 errors in network tab for images (2s)
✓ Console errors for image loading (2s)
```

### ❌ Fallo
```
✗ Verify Rewinding Direction images load correctly
  - Error: "Successfully loaded: 3/8"
  - Images failed: Sentido 1, Sentido 2, Sentido 5
```

## 🐛 Debug de problemas

### Las imágenes no cargan

1. **Verifica la consola del navegador** (F12)
   - Busca errores de tipo 404 o CORS
   - El test también reportará estos en su salida

2. **Verifica las rutas de importación**
   ```tsx
   // ✅ Correcto (con ?url)
   import sentido1 from "../../../../public/assets/bobinado/sentido-1.png?url";
   
   // ❌ Incorrecto
   import sentido1 from "/assets/bobinado/sentido-1.png";
   ```

3. **Reinicia el servidor dev**
   ```bash
   npm run dev
   ```

4. **Limpia caché del navegador**
   - Presiona Ctrl+Shift+R (o Cmd+Shift+R en Mac)

### El test no encuentra productos

Si ves "⚠️ No products found", necesitas:

1. Crear un producto en la UI primero, o
2. Ejecutar un test que cree productos automáticamente

## 📈 Estadísticas de cobertura

Los tests verifican:

- **8 imágenes** de sentido de bobinado
- **1-2 imágenes** de envoltura por producto
- **100+ requests** de red en monitoreo
- **Errores de consola** relacionados con imágenes

## 🔗 Archivos relacionados

- Test: `./tests/e2e/image-loading.spec.ts`
- Config: `./playwright.config.ts`
- Componentes: 
  - `src/modules/products/components/RewindingDirectionSelector.tsx`
  - `src/modules/products/pages/ProductEditPage.tsx`

## 💡 Tips

### Para debugging rápido
```bash
# Ejecutar un solo test
npx playwright test image-loading.spec.ts -g "Rewinding Direction"

# Con logs detallados
npx playwright test --debug
```

### Para CI/CD
```bash
# En tu pipeline, solo necesitas:
npm run test:images
```

## 📞 Soporte

Si los tests fallan:

1. Asegúrate de que `npm run dev` está ejecutándose en otra terminal
2. Verifica que las imágenes existen en `public/assets/`
3. Revisa la sección de Debug arriba
4. Consulta los reports en `playwright-report/index.html`
