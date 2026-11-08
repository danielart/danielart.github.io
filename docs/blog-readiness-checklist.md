# Comprobación del blog

Los enlaces públicos permiten comprobar las mejoras después del despliegue. El estado de publicación puede consultarse en [GitHub Actions](https://github.com/danielart/danielart.github.io/actions/workflows/deploy.yml).

## 1. Google Analytics

Confirmado por el propietario el 8 de noviembre de 2026:

- [x] ID de medición GA4: `G-N44NNKXJSN`.
- [x] Tiene acceso al contenedor `GTM-T2HZPQD3`.
- [x] Recibe visitas en Google Analytics.

La plantilla local se ha actualizado con ese ID. Estas confirmaciones corresponden a la instalación actual; queda comprobar el consentimiento y las vistas sin duplicados después de desplegar las mejoras. No se han modificado la cuenta de Google ni el contenedor publicado.

Pasos de referencia y comprobaciones pendientes:

- [ ] Abre [Google Analytics](https://analytics.google.com/) y selecciona la propiedad de `danielart.github.io`. En **Administrar → Flujos de datos → Web**, copia el **ID de medición**, que empieza por `G-`. Si no existe un flujo web, anótalo en el formulario de abajo.
- [ ] Abre [Google Tag Manager](https://tagmanager.google.com/) y busca el contenedor **GTM-T2HZPQD3**. Comprueba que la etiqueta Google/GA4 publicada utiliza ese mismo ID real. El archivo `public/gtm-container-recipe.json` es una plantilla con el ID `G-N44NNKXJSN`: no demuestra qué hay publicado. No lo importes sobre tu contenedor sin revisar sus cambios.
- [ ] En **Vista previa**, conecta `https://danielart.github.io/`. Acepta las cookies en el blog. Comprueba que se activa GA4 y que cada navegación registra una sola vista. El sitio emite `virtual_page_view` al navegar sin recargar; evita duplicarlo con otro disparador de historial.
- [ ] Comprueba que el contenedor contiene las etiquetas que quieres: el banner autoriza analítica; no incluye consentimiento publicitario.
- [ ] En GA4, abre **Informes → Tiempo real** y visita dos artículos tras aceptar cookies. Comprueba que se reciben las visitas. Si usas bloqueadores, repite la prueba en un perfil de prueba sin extensiones.

Ayuda oficial: [encontrar el ID](https://support.google.com/analytics/answer/9539598?hl=es), [verificar y publicar GTM](https://support.google.com/tagmanager/answer/14842769?hl=es), [informe en tiempo real](https://support.google.com/analytics/answer/9271392?hl=es).

## 2. Comprobaciones después de publicar

- [ ] [404 real](https://danielart.github.io/esta-pagina-no-existe-revision/): aparece el nuevo diseño, cuatro artículos recientes y enlaces que funcionan.
- [ ] [Formulario de suscripción](https://danielart.github.io/#contact): enviar vacío o con un email incorrecto muestra un error; un email válido abre Substack. Completa tú la suscripción solo si quieres probar la entrega del correo de confirmación.
- [ ] [Privacidad y cookies](https://danielart.github.io/privacy/): revisa que los servicios descritos coincidan con los que tienes realmente configurados.
- [ ] En una ventana privada, antes de aceptar y tras rechazar, no hay peticiones a `googletagmanager.com` ni `google-analytics.com` en **Herramientas de desarrollador → Red**. Después de aceptar deben aparecer si el contenedor está publicado. Desde **Cookie settings → Decline**, la página se recarga y dejan de cargarse. Cierra las ventanas privadas antes de repetir para partir sin preferencias guardadas.
- [ ] [robots.txt](https://danielart.github.io/robots.txt), [llms.txt](https://danielart.github.io/llms.txt) y [sitemap](https://danielart.github.io/sitemap-index.xml) abren correctamente.
- [ ] Comparte la URL de un artículo en la plataforma que uses y comprueba título, descripción e imagen. Las plataformas pueden conservar una vista previa antigua en caché.
- [ ] Navega con Tab y Shift+Tab por la 404, el formulario y las preferencias. Comprueba que puedes ver el foco y activar controles con el teclado.

## 3. Resultado comunicado por el propietario

```text
ID de medición GA4: G-N44NNKXJSN
Veo el contenedor GTM-T2HZPQD3 en mi cuenta: sí
Recibo visitas en Google Analytics: sí
Comprobación de consentimiento tras el nuevo despliegue: pendiente
```

No hacen falta contraseñas, claves API ni acceso a tu cuenta. El ID de medición no es una contraseña.

## Alcance de esta revisión

Se han mejorado la 404, el formulario, los enlaces legales y el consentimiento básico de analítica. La retirada del consentimiento elimina las cookies Google Analytics habituales de este dominio con ruta `/` y recarga la página para quitar los scripts ya cargados. No elimina datos históricos de Google ni cookies de otros dominios. La configuración real de etiquetas, rutas y cookies del contenedor debe contrastarse en la cuenta.

Los alt existentes y estas correcciones no constituyen una auditoría completa de accesibilidad ni una certificación legal. Quedan la evaluación de contraste, lector de pantalla y contenido alternativo según el contexto de cada imagen, así como la revisión jurídica de las políticas cuando corresponda.

## Dependencias antes del despliegue

Se actualizaron Astro, Sharp y dependencias compatibles para corregir las alertas altas y críticas. Se fija Zod 4 en 4.6.6 mediante `pnpm.overrides` porque RSS y sitemap resolvían una versión vulnerable. La auditoría de producción pasa con `pnpm audit --prod --audit-level high`; quedan dos avisos moderados en Satori y su dependencia fflate, usados para generar imágenes durante la compilación. Su actualización requiere una revisión aparte.
