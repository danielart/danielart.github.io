---
title: "Landing con IA: 8 cosas críticas a revisar tras el diseño"
description: "Generar el diseño con IA es solo el inicio. Guía directa y práctica para añadir 404, SEO y llms.txt, accesibilidad según el EAA, privacidad y métricas."
author: Daniel Artola
pubDatetime: 2026-11-09T08:00:00Z
draft: false
lang: es
translationKey: beyond-ai-landing-pages-essentials
pillar: agent-ready-repositories
articleType: guide
audience:
  - developer
  - general
tags:
  - ai
  - web-design
  - seo
  - accessibility
---

Ya tienes tu landing montada, hecha por IA, con su diseño bonito. Se ve moderna, los textos encajan y la estructura convence. Pero si la subes tal cual a producción, liada. Tienes solo el inicio, no está lista para recibir tráfico, posicionar y evitar sanciones legales.

Te digo los 8 puntos que miro en las webs que hago, para que puedas pedirle a tu agente o implementar tú mismo antes de compartir tu web. Sin teoría innecesaria, directo al grano y en lenguaje claro.

## Table of contents

## 1. Página 404 que retiene visitas

Cuando alguien escribe mal una URL o llega desde un enlace roto o que ya no existe, aprovecha para mostrarle algo más que un simple "404 Not Found".

Una página 404 bien pensada:

- **Mantiene la misma estética y navegación** (cabecera y pie de página) para que el usuario no sienta que la web se rompió.
- **Explica con naturalidad lo ocurrido**: «No encontramos esta página, pero aquí tienes opciones para continuar».
- **Incluye 2 o 3 enlaces clave**: vuelta a la Home, sección de productos/servicios o un buscador/contacto.
- **Añade un toque humano o gráfico**: una ilustración sencilla acorde a la marca suele convertir una frustración en una experiencia agradable, pon una frase graciosa (¿has visto ya la de mi blog?)

## 2. Títulos y metadatos

Los buscadores (Google, Bing) evalúan el título y la descripción para decidir cómo mostrar tu web en los resultados de búsqueda. Un error muy común al generar código con IA es dejar títulos kilométricos o descripciones genéricas.

Buenas prácticas directas:

- **Título (`<title>`)**: Entre 50 y 60 caracteres. Si te pasas, los motores lo cortarán con puntos suspensivos (`...`) o lo reescribirán por completo. Estructura recomendada: `Propuesta de valor | Nombre de Marca`.
- **Meta descripción**: Entre 120 y 155 caracteres. Debe resumir el beneficio directo e incluir una llamada a la acción implícita.
- **Open Graph y Twitter Cards**: Asegúrate de incluir etiquetas `og:image`, `og:title` y `og:description` para que al compartir tu enlace en WhatsApp, LinkedIn, X o Slack aparezca una tarjeta atractiva y no un enlace vacío.

## 3. Favicon e iconos para todos los dispositivos

El icono en la pestaña del navegador es clave para el reconocimiento de marca entre decenas de pestañas abiertas.

No te limites a un único archivo `favicon.ico` pixelado, ni dejes el que viene por defecto:

- **`favicon.ico`** (32×32) para navegadores antiguos.
- **`favicon.svg`**: La opción moderna preferida. Escala a cualquier resolución y permite adaptarse al modo oscuro del sistema operativo de forma automática mediante CSS (`prefers-color-scheme`).
- **`apple-touch-icon.png`** (180×180) para cuando alguien guarda la web como acceso directo en iOS.
- **`manifest.webmanifest`** (o `manifest.json`) con iconos de 192×192 y 512×512 para dispositivos Android.

Hay herramientas online gratuitas como RealFaviconGenerator o plugins que te generan todo este pack en segundos a partir de tu logo.

## 4. `robots.txt` y `llms.txt`: guiando a buscadores y a la IA

Tu web debe comunicar cómo quiere ser indexada tanto por buscadores clásicos como por modelos de lenguaje.

- **`robots.txt`**: Indica qué rutas pueden rastrear los bots. En una landing sencilla suele bastar con permitir el acceso general y enlazar la ubicación de tu sitemap:

  ```txt
  User-agent: *
  Allow: /

  Sitemap: https://tudominio.com/sitemap.xml
  ```

- **`llms.txt`**: Un estándar emergente adoptado por empresas y desarrolladores para ofrecer a los agentes de IA (como ChatGPT, Perplexity, Claude o Gemini) un resumen en texto plano o Markdown con la información esencial de tu producto o documentación, sin ruido de scripts ni HTML complejo. Ubícalo en la raíz (`/llms.txt`) resumiendo qué hace tu producto, sus enlaces clave y preguntas frecuentes.

## 5. `sitemap.xml` automatizado

El mapa del sitio es el índice que entregas a Google Search Console y Bing Webmaster Tools para que sepan exactamente qué páginas existen y cuándo se actualizaron por última vez.

- Si usas frameworks modernos (Astro, Next.js, Nuxt), instala su integración oficial para que el `sitemap.xml` se genere automáticamente en cada compilación (`build`).
- No lo crees a mano , que la vas a liar.

## 6. Accesibilidad real y el Acta Europea de Accesibilidad (EAA)

A partir de 2025, el **Acta Europea de Accesibilidad (European Accessibility Act)** exige que los productos y servicios digitales cumplan estándares de accesibilidad (basados en WCAG 2.1 nivel AA). Más allá del cumplimiento legal, una web accesible convierte mejor y no excluye a usuarios con discapacidades visuales o motrices. Muchas webs ya van tarde, lo sé, pero hagamos las cosas bien.

Los puntos críticos que debes revisar:

- **Texto alternativo (`alt`) en imágenes**:
  - Imágenes informativas o capturas de producto: describe con precisión qué muestra la imagen en una frase.
  - Imágenes meramente decorativas (formas de fondo, brillos): utiliza `alt=""` explícito para que los lectores de pantalla las ignoren en lugar de leer el nombre del archivo.
- **Contraste de color**: Asegura un ratio mínimo de contraste de 4.5:1 para texto normal frente al fondo. Los textos en gris claro sobre fondo blanco son habituales en plantillas de IA pero fallan en usabilidad.
- **Navegación por teclado**: Debes poder navegar por todos los botones, enlaces y formularios usando la tecla `Tab`, con un indicador de foco (`focus-visible`) claramente visible.
- **Etiquetas semánticas**: Un único `<h1>` por página, encabezados ordenados jerárquicamente (`<h2>`, `<h3>`), y elementos `<button>` para acciones en lugar de `<div>` con evento clic.

## 7. Gestión clara de errores en formularios

El formulario suele ser el punto de conversión de la landing (contacto, suscripción, solicitud de demo). Un formulario con feedback deficiente frustra al usuario y destruye la conversión.

Reglas directas para tus inputs:

- **Mensajes de error inline y específicos**: Coloca el aviso justo debajo del campo afectado. En vez de un genérico «Dato inválido», explica: «Introduce un correo electrónico válido (ejemplo: nombre@dominio.com)».
- **Accesibilidad en errores**: Asocia el mensaje de error con el input mediante el atributo `aria-describedby` y marca `aria-invalid="true"` cuando haya fallo.
- **Preserva los datos introducidos**: Si el envío falla o un campo es erróneo, nunca vacíes el formulario obligando al usuario a escribir todo otra vez.
- **Estado de carga y confirmación**: Muestra de inmediato cuando el formulario se está enviando (desactivando el botón para evitar envíos dobles) y confirma con un mensaje claro que ya está.

## 8. Privacidad, cookies y métricas que respetan la normativa

No puedes recopilar datos al tuntún y guardarlos por si acaso(GDPR).

- **Página de Política de Privacidad**: Obligatoria si recoges cualquier dato personal (incluyendo el email de un formulario de contacto). Debe especificar quién es el responsable, para qué se usan los datos, durante cuánto tiempo se almacenan y cómo ejercer los derechos de acceso o supresión.
- **Banner de cookies**: Solo es necesario si instalas cookies que no sean estrictamente técnicas (por ejemplo, scripts de remarketing o analítica tradicional invasiva). El botón de «Rechazar» debe ser tan visible y fácil de accionar como el de «Aceptar».
- **Elegir la herramienta de métricas adecuada**:
  - **Google Analytics 4 (GA4)**: Es el estándar del mercado, pero requiere configurar consentimiento de cookies (Google Consent Mode v2) y mostrar banner en Europa.
  - **Cloudflare Web Analytics** o alternativas ligeras y privadas (como Plausible o Fathom): No utilizan cookies ni rastrean datos personales entre webs, miden visitas esenciales sin ralentizar la carga y en muchos casos no requieren banner de consentimiento intrusivo. Son una opción ideal para landings donde solo quieres medir visitas y fuentes de tráfico sin complicaciones legales.

## Y si empiezas a meterle mil historias, revisa bien si debes actualizar las cookies.

## Checklist rápido para tu agente

Antes de dar por cerrado el proyecto con tu asistente de IA, puedes pasarle este prompt de revisión:

```text
Revisa la landing page generada y verifica estos aspectos:
1. ¿Existe una página 404 personalizada con enlaces a la Home?
2. ¿El <title> tiene menos de 60 caracteres y la meta descripción entre 120 y 155 caracteres? ¿Están los tags Open Graph?
3. ¿Están configurados favicon.svg, favicon.ico y apple-touch-icon?
4. ¿Existen robots.txt y llms.txt con el resumen del proyecto?
5. ¿Se genera sitemap.xml en el build?
6. ¿Tienen todas las imágenes un alt adecuado (o alt="" si son decorativas) y hay buen contraste de color?
7. ¿Los formularios muestran mensajes de error específicos debajo de cada campo con aria-invalid?
8. ¿Hay enlaces a la política de privacidad y la analítica elegida respeta la normativa de cookies?
```

## Conclusión

Delegar el diseño a modelos de IA nos ahorra horas de trabajo en maquetación, pero una web no compite ni convierte solo por tener degradados bonitos. La diferencia entre un experimento visual y una web que realmente funciona radica en estos detalles invisibles: cuidar al usuario cuando algo falla (404 y formularios), facilitar el trabajo a buscadores e inteligencias artificiales (`robots.txt`, `llms.txt`, `sitemap.xml`), respetar la privacidad y garantizar que cualquiera pueda usarla sin barreras.

Atar estos ocho cabos, y navegar la web convirtiéndote en tu primer usuario antes de publicar te evitará sorpresas técnicas, problemas de reputación y penalizaciones en motores de búsqueda.

## ¿Qué viene en el próximo post?

Ahora que la web está técnicamente impecable y lista para salir al mundo, toca asegurarse de que los buscadores la descubran y la indexen cuanto antes. En la siguiente entrega veremos **cómo dar de alta y verificar tu dominio en Google Search Console y Bing Webmaster Tools**, cómo enviar tu sitemap y cómo interpretar sus primeras métricas de indexación sin perderte entre paneles.
