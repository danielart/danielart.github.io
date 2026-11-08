---
title: "Landing pages con IA de calidad: dos skills y un buen brief"
description: "Crea landing pages con Landing Page Guide e Impeccable: instala las skills, copia el prompt y compara versiones para iterar rápido con criterio."
author: Daniel Artola
pubDatetime: 2026-11-06T18:20:00Z
draft: false
lang: es
translationKey: landing-pages-with-ai-design-skills
pillar: agent-ready-repositories
articleType: guide
audience:
  - developer
  - general
tags:
  - ai
  - skills
  - web-design
  - productivity
---

Pides una web y aparece algo que ya has visto veinte veces: un titular enorme, un degradado, tres tarjetas con iconos y un botón que dice «Empieza ahora». Mismas animaciones, colores y efectos. Una web nueva pero prima de otras cientos de miles. Y eso pasa por delegar a la IA el look and feel dejando esa parte del prompt a su libre albedrío. Una liada, por que tampoco sabes bien qué es lo que la hace tan parecida a las otras o como explicarlo en el prompt para cambiarlo.

Para salir de ahí, ayuda combinar **un resumen del objetivo de la web concreto, materiales propios como imagenes o slogan y dos skills que ahora te recomendaré**. La propuesta de este artículo es usar Landing Page Guide para organizar la página y su contenido, e Impeccable para revisar el diseño y darle una dirección más reconocible.

Quieres una primera versión que puedas abrir, comparar y corregir. Tener algo delante permite tomar decisiones mucho mejores que seguir pidiendo «algo moderno y profesional», y ademas te vas haciendo a la idea de lo que realmente quieres.

## Table of contents

## Qué aporta cada skill

Una skill reúne instrucciones y archivos de apoyo para que un agente siga un flujo de trabajo. En este caso, vamos a repartir el trabajo así:

| Recurso               | Cómo lo usaremos                                                                          |
| --------------------- | ----------------------------------------------------------------------------------------- |
| Landing Page Guide V2 | Organizar el mensaje, las secciones y el recorrido hacia la acción principal.             |
| Impeccable            | Revisar la propuesta visual y afinar las partes que resulten genéricas o poco coherentes. |

[Landing Page Guide V2, de bear2u](https://github.com/bear2u/my-skills/tree/master/skills/landing-page-guide-v2) propone once elementos que incluyen identidad, titular, llamada a la acción, contenido visual, beneficios, testimonios, preguntas frecuentes y cierre. También incorpora pautas estéticas; aquí la usaremos principalmente como guía de estructura y contenido. Su implementación de referencia está orientada a Next.js y ShadCN UI.

[Impeccable, de pbakaus](https://github.com/pbakaus/impeccable) aporta herramientas para criticar, auditar y pulir interfaces. Su documentación recomienda trabajar sobre objetivos concretos: por ejemplo, revisar la cabecera o simplificar una sección. Encaja bien después de tener una primera página navegable.

Esta combinación es una propuesta de trabajo, no una prueba de que vaya a mejorar las conversiones. Eso habrá que medirlo con visitantes reales.

## Cómo tener listas ambas skills

Cada entorno (**Claude Code, Codex, Gemini CLI, Cursor, etc.**) gestiona las skills de forma distinta. La vía más directa suele ser pedirle al propio agente que las descargue e instale pasándole las URLs de sus repositorios, o seguir la guía rápida de cada proyecto:

- **[Landing Page Guide V2](https://github.com/bear2u/my-skills/tree/master/skills/landing-page-guide-v2)**: requiere su **carpeta completa** (no solo `SKILL.md`, ya que contiene la subcarpeta `references/` con los 11 elementos y los componentes). Puedes instalarla con `npx skills add bear2u/my-skills --skill landing-page-guide-v2`, copiar la carpeta entera a tu directorio de skills (`.claude/skills/` o `.agents/skills/`), o pedirle al agente que la descargue.
- **[Impeccable](https://github.com/pbakaus/impeccable)**: ofrece su propio instalador (`npx impeccable install`) y comando de inicialización (`/impeccable init`). Revisa su documentación en GitHub según tu herramienta.

Antes de generar la web, así te evitas sorpresas y malgasto de tokens:

```text
Comprueba que tienes acceso a las pautas de Landing Page Guide V2 e Impeccable.
Confírmame si puedes usarlas antes de generar la página.
```

## Prepara un proyecto con tus imágenes y tus textos

Crea o abre una carpeta de proyecto con el agente que prefieras. Añade el logo, fotografías, capturas de producto y textos que quieres utilizar. Una estructura sencilla puede ser:

```text
mi-landing/
  materiales/
    logo.svg
    producto.webp
    equipo.jpg
  contenido/
    brief.md
    textos-aprobados.md
```

Estas carpetas sirven como entrada para el agente; después podrá colocar los recursos donde corresponda para la web.

En `brief.md`, explica **qué vendes, a quién, qué problema resuelves y qué acción quieres conseguir**. «Reservar una llamada» permite diseñar un recorrido más concreto que «dar a conocer la empresa».

En `textos-aprobados.md`, separa las frases que deben aparecer literalmente de las ideas que se pueden reescribir. Si tu eslogan es «Tu próxima escapada es ahora», indícalo como texto obligatorio. Haz lo mismo con ganchos comerciales, precios y condiciones.

Relaciona también cada imagen con su función: «producto.webp debe aparecer en la primera pantalla y mostrar el producto completo». Eso reduce decisiones arbitrarias y rondas de corrección.

## Plantilla de prompt para crear la primera versión

Copia este prompt después de instalar las skills y sustituye los campos entre corchetes. Es una plantilla propuesta para este flujo, no un comando oficial de ninguno de los proyectos.

```text
Crea una primera versión navegable de una landing page en este proyecto.
Usa Landing Page Guide V2 para organizar las secciones y el contenido.
Después usa Impeccable para revisar y mejorar el diseño.
Carga ambas skills antes de empezar; si falta alguna, indícamelo.

CONTEXTO
- Marca o producto: [nombre y explicación breve].
- Público: [a quién nos dirigimos y qué necesita].
- Propósito de la web: [qué debe entender el visitante].
- Acción principal: [reservar, comprar, registrarse, contactar...].
- Idioma y tono: [español de España, cercano, directo...].

MATERIALES
- Lee contenido/brief.md y contenido/textos-aprobados.md.
- Usa las imágenes de materiales/ según su función en el brief.
- No inventes clientes, testimonios, cifras, descuentos ni certificaciones.
- Si falta un dato, márcalo como pendiente para revisión.

TEXTOS LITERALES: NO LOS REESCRIBAS
- Eslogan: "[texto exacto]".
- Gancho comercial: "[texto exacto]".
- Botón principal: "[texto exacto]".
- Otros textos y condiciones: [lista o archivo].
- Puedes proponer alternativas por separado, sin sustituir los originales.

SECCIONES PRINCIPALES (adapta esta lista según tu caso)
1. Cabecera con logo y navegación breve.
2. Primera pantalla con propuesta de valor, imagen y botón principal.
3. Problema que resolvemos y beneficios concretos.
4. [Explicación o funcionamiento: pasos, características, desglose del servicio o demostración].
5. [Resolución de dudas: preguntas frecuentes, precios/planes o comparativa].
6. [Otras secciones según tu producto o servicio: equipo, agenda, garantías, etc.].
7. Cierre con llamada a la acción final, contacto y enlaces necesarios.
Contrasta esta estructura con Landing Page Guide V2 y explica los ajustes.
Si falta material para un elemento de la guía, señálalo sin inventarlo.

DIRECCIÓN VISUAL
- Personalidad: [editorial, sobria, cálida, atrevida...].
- Colores y tipografías de marca: [valores o libertad disponible].
- Referencias que me gustan y por qué: [enlaces o archivos].
- Cosas que quiero evitar: [patrones concretos].
- Define una dirección coherente antes de implementarla.
- Aplica Impeccable para revisar jerarquía, composición y consistencia.
- Evita decisiones decorativas por defecto; justifica las importantes
  según el producto, el público y los materiales disponibles.

IMPLEMENTACIÓN Y ENTREGA
- Respeta el stack existente. Si no hay uno, propón una opción sencilla
  y explica cómo adaptarás las pautas técnicas de Landing Page Guide V2.
- Prioriza una primera versión completa que podamos revisar pronto.
- Mobile first.
- Comprueba móvil, escritorio, contraste y navegación con teclado.
- Respeta la preferencia de movimiento reducido.
- Verifica los destinos de botones y enlaces. Si un formulario necesita
  integración, indícalo: no simules que envía datos.
- Ejecuta las comprobaciones del proyecto y explica cómo abrir la web.
- Resume las decisiones tomadas y lo que falta por completar.
```

La revisión visual necesita criterio, mírala personalmente, es tu web aunque la haga la IA. Por ejemplo, puedes pedir que la foto del producto ocupe más espacio porque permite entenderlo mejor, o reducir elementos decorativos porque compiten con el botón de reserva. Son instrucciones más útiles que el típico y vago «hazlo premium».

## Pide un comparador con versiones diferentes

Cuando tengas la primera versión, pide alternativas que exploren distintas composiciones. Mantener el contenido permite valorar el diseño sin mezclarlo con cambios de mensaje.

```text
Crea tres versiones de esta landing usando el mismo brief, imágenes,
textos literales y acción principal. Conserva la versión actual.

- A: dirección editorial, con protagonismo de fotografía y tipografía.
- B: dirección sobria, con lectura rápida y demostración del producto.
- C: dirección expresiva, con una composición más atrevida dentro de la marca.

Usa Landing Page Guide V2 para comprobar la estructura de cada propuesta
e Impeccable para revisar su coherencia visual.
Las diferencias deben afectar a composición, jerarquía y ritmo;
no basta con cambiar los colores.

Crea un comparador local con selector A/B/C, enlaces para abrir cada
versión y vista de móvil y escritorio. Si encaja con el proyecto,
usa /comparador y /variantes/a, /variantes/b, /variantes/c.
Mantén estas rutas como herramientas de revisión fuera de la entrega pública.
Permite verlas lado a lado en pantallas grandes y a ancho completo.
Usa el mismo ancho de pantalla al comparar versiones.

Explica qué decisión explora cada una y qué compromisos introduce.
```

El comparador es una herramienta que pides construir al agente. **No es una función incorporada de estas skills ni un test A/B con tráfico real.** Sirve para decidir con rapidez qué dirección quieres desarrollar.

Mira cada versión a ancho completo: una miniatura puede ocultar problemas de legibilidad. Comprueba también si se entiende la oferta en la primera pantalla y si la acción principal sigue siendo evidente en móvil.

Pide lo que te guste de cada una si pueden cohesionar bien todas las decisiones.

## Itera las partes que no te gustan

Después de comparar, conserva lo que funciona y delimita el siguiente cambio. Por ejemplo:

```text
Toma la versión B como base. Me gusta su orden y quiero conservar
los textos aprobados, la navegación y el bloque de preguntas frecuentes.

Cambia únicamente:
1. Primera pantalla: incorpora la composición fotográfica de A,
   sin recortar el producto y manteniendo visible el botón en móvil.
2. Beneficios: sustituye las tarjetas repetidas por una lista visual
   que permita escanear los tres beneficios con rapidez.
3. Cierre: reduce la decoración y da más protagonismo a la reserva.

Usa Impeccable para criticar estas tres zonas y aplica las mejoras.
Comprueba con Landing Page Guide V2 que el recorrido sigue completo.
Revisa móvil y escritorio y resume los cambios.
```

Una captura anotada también ayuda: «este título ocupa demasiado», «aquí quiero la imagen completa», «este espacio separa demasiado el precio del botón». El agente recibe un objetivo observable y tú puedes comprobar si lo ha resuelto.

Trabaja por rondas pequeñas: primero composición, luego jerarquía y lectura, después detalles. Guarda la versión elegida antes de cada cambio importante. Así puedes volver atrás si una mejora local empeora el conjunto.

## Antes de compartir la landing

Revisa los textos literales, abre todos los enlaces y prueba la acción principal de principio a fin. Comprueba que las imágenes cargan, que el contenido cabe en móvil y que los datos comerciales son reales. Si hay un formulario, confirma que llega al destino esperado.

Este flujo conecta con lo que cuento en [cómo integrar agentes de IA en el desarrollo](/posts/es/agentes-ia-desarrollo-meses-a-dias/): dar contexto útil y revisar entregas concretas facilita avanzar. Y también con [si lo publicas, es tuyo](/posts/es/si-lo-publicas-es-tuyo/): la última revisión sigue siendo responsabilidad de quien publica.

La velocidad viene de acortar el ciclo entre pedir, ver y corregir. Con tus materiales, un mensaje claro y estas dos skills, cada iteración puede acercarse más a la página que tu proyecto necesita.
