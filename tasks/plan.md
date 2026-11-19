# Bing y Google: implementación

Actualizado el 17 de noviembre de 2026. Continúa el plan aprobado en el chat del 8 de noviembre; los antiguos archivos tasks/plan.md y tasks/todo.md no estaban en este checkout.

## Decisiones y alcance

La migración ya fue integrada en el commit 9f41680. Se conservan las URLs actuales y todos los alias de src/post-redirects.json. No se vuelve a renombrar contenido. GitHub Pages sirve meta refresh inmediato con canonical al destino, no HTTP 301. Esta limitación del alojamiento queda documentada; no se cambia de hosting para resolver el aviso de Bing.

La URL canónica inglesa y su alias responden HTTP 200 en la comprobación pública del 17 de noviembre; el alias incluye refresh inmediato y canonical al artículo nuevo. robots.txt permite rastreo y declara sitemap-index.xml. Esto no acredita la respuesta que recibió Bingbot ni el estado de sus índices.

## Cambios

- Búsqueda interna con noindex,follow, excluida del sitemap y permitida en robots para que los rastreadores puedan leer la directiva.
- El sitemap oficial de Astro sigue siendo la fuente de descubrimiento de rutas. serialize reutiliza el JSON-LD del HTML recién generado: dateModified o datePublished para artículos; sin fechas inventadas en colecciones. No se mantiene otra lista manual de artículos.
- Validación del sitemap contra HTML generado: canonical, indexabilidad y lastmod, además de las comprobaciones existentes de redirecciones, hreflang recíproco y enlaces.
- Revisión editorial de ambos artículos: eliminar porcentaje sin medición y atribución sin fuente verificada; corregir disponibilidad y condiciones de acceso a artifacts con enlaces oficiales. modDatetime refleja esta revisión real.
- IndexNow compara hashes de páginas publicadas entre despliegues correctos. Incluye alias históricos para notificar cambios de ruta; omite páginas noindex y colecciones duplicadas. La primera ejecución establece referencia sin envío masivo. El estado se guarda en la caché de Actions; si se pierde, se vuelve a establecer referencia.
- Solo después de publicar: comprobar clave pública y enviar diferencias. HTTP 200/202 confirma recepción, no indexación. Si falla, el despliegue ya publicado no se revierte; el job falla y conserva la referencia anterior para un reintento posterior. Los despliegues se serializan para evitar carreras de estado.

## Verificación y límites

Ver tareas en [todo.md](./todo.md). Mantener los checks existentes y añadir pruebas de fechas, publicación/noindex y selección de URLs modificadas. La verificación local no acredita una ejecución de GitHub Actions ni la recepción en Bing.

Se accedió a las sesiones existentes de Chrome. Bing muestra la URL canónica como descubierta el 10 de noviembre, sin rastreo; Live URL confirma que se puede indexar y no encuentra problemas SEO/GEO. Google no reconoce todavía la URL en su índice; su prueba en vivo confirma disponibilidad e indexabilidad. Google registra el sitemap enviado el 8 de noviembre como «No se ha podido obtener», sin páginas descubiertas. Bing registra ese sitemap con éxito y 85 URLs descubiertas. Estas son referencias previas al despliegue; los informes de acciones manuales/seguridad y la evolución posterior se comprueban por separado. No atribuir el mensaje «Discovered but not crawled» a una penalización confirmada ni interpretar «01 Jan 2006» como fecha del artículo.

## Operación

Tras publicar, consultar la URL canónica inglesa, el alias, versión española, /search/, robots y sitemap. Enviar sitemap-index.xml a ambos paneles e inspeccionar el artículo canónico. Comparar semanalmente cuatro semanas rastreo, cobertura e impresiones, sin prometer un plazo de indexación. Si Live URL es correcto y Bing no aporta causa concreta, abrir soporte con las pruebas y fechas.

Fuentes oficiales: [sitemaps de Google](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap), [redirecciones](https://developers.google.com/search/docs/crawling-indexing/301-redirects), [idiomas](https://developers.google.com/search/docs/specialty/international/localized-versions), [Astro sitemap](https://docs.astro.build/en/guides/integrations-guide/sitemap/), [IndexNow](https://www.indexnow.org/documentation), [artifacts](https://support.claude.com/en/articles/17153992-what-are-artifacts-and-how-do-i-use-them), [compartir artifacts](https://support.claude.com/en/articles/9547008-share-artifacts).
