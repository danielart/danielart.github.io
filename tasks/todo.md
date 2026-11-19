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

- [x] Publicar los cambios revisados y verificar GitHub Actions: ejecución 44523933046 correcta, commit f0f51b0.
- [x] Comprobar en producción search/noindex, sitemap/lastmod, canonical, alias y clave IndexNow: 91 URLs y 45 artículos con lastmod.
- [x] Verificar IndexNow: Actions inicializa y guarda la referencia; envío acotado de los artículos en/es aceptado con HTTP 200 el 19 de noviembre.
- [x] Bing Webmaster Tools: Live URL permite indexar, sin problemas SEO/GEO observados; sitemap reenviado el 19 de noviembre y solicitud de indexación confirmada.
- [ ] Seguimiento de Site Explorer y cobertura después del nuevo rastreo.
- [x] Search Console: prueba en vivo permite indexar; no hay acciones manuales ni problemas de seguridad. Artículo aún desconocido para el índice; canonical elegido no disponible.
- [ ] Verificar nueva lectura correcta del sitemap de Google: reenvío aceptado, pero el panel todavía conserva «No se ha podido obtener».
- [x] Enviar sitemap a ambos paneles y solicitar indexación del artículo canónico: ambos confirman la solicitud, sin retiradas de URLs históricas.
- [ ] Seguimiento semanal durante cuatro semanas y soporte de Bing si persiste sin explicación.
