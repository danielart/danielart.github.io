# Estado del plan de indexación

## Implementación local

- [x] Conservar rutas actuales y alias históricos; verificar canonical y meta refresh del alias público afectado.
- [x] Excluir /search/ del sitemap y añadir noindex,follow sin bloquear el rastreo.
- [x] Añadir lastmod derivado de las fechas editoriales del artículo generado.
- [x] Validar sitemap contra canonical, robots y fechas de los artículos; mantener comprobaciones de reciprocidad hreflang y destinos.
- [x] Corregir afirmaciones sin respaldo y requisitos obsoletos de artifacts en inglés y español, con fuentes primarias.
- [x] Preparar IndexNow incremental después de un despliegue correcto, con clave pública y estado persistido en Actions.
- [x] Añadir tests de fechas, cambios/retiradas y exclusiones del manifiesto.
- [x] Formato, lint, 42 tests unitarios, build, validación SEO (95 páginas, 45 artículos) y enlaces internos correctos.
- [x] Completar 10 pruebas de navegador de SEO, contenido sin JavaScript y redirecciones históricas.

## Publicación y servicios externos

- [ ] Publicar los cambios revisados y verificar la ejecución de GitHub Actions.
- [ ] Comprobar en producción search/noindex, sitemap/lastmod, canonical, alias y clave IndexNow.
- [ ] Verificar recepción real en IndexNow cuando haya cambios frente a la referencia; primera ejecución solo inicializa estado.
- [ ] Bing Webmaster Tools: Live URL, sitemap, Site Explorer y avisos. Sesión existente accesible; pendiente completar comprobaciones tras publicar.
- [ ] Search Console: inspección, canonical elegido, cobertura, seguridad y acciones manuales. Sesión existente accesible; pendiente completar comprobaciones tras publicar.
- [ ] Enviar sitemap a ambos paneles y solicitar indexación del artículo canónico, sin retiradas de las URLs históricas.
- [ ] Seguimiento semanal durante cuatro semanas y soporte de Bing si persiste sin explicación.
