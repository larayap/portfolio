# E2E con Playwright

Los tests en esta carpeta se ejecutan con `npm run test:e2e` y sirven para:

- **Humo:** carga de la página y sección Proyectos visible.
- **Recortes:** que la última card de proyectos no se corte (desktop y mobile).
- **Regresión visual:** screenshot de la sección Proyectos; si cambias estilos y el resultado no coincide con el baseline, el test falla.

## Regresión visual (screenshot)

El baseline está en `e2e/home.spec.ts-snapshots/`. Si cambias a propósito el diseño de la sección Proyectos, actualiza el baseline:

```bash
npx playwright test e2e/home.spec.ts --project=chromium --update-snapshots
```

Luego commitea los archivos nuevos o modificados en `*-snapshots/`.

## Ver el reporte

Tras ejecutar los tests:

```bash
npx playwright show-report
```
