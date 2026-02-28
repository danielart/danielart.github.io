---
author: Daniel Artola Dominguez
pubDatetime: 2026-02-24T00:00:00Z
title: "[ES] Más allá del Chat: Git para tu cerebro con el \"Forking\" de sesiones en Claude Code"
featured: false
draft: false
tags:
  - ai
  - productivity
  - claude
  - workflow
  - es
lang: es
description: Aprende a usar el forking de sesiones en Claude Code para gestionar contexto y experimentar como en ramas de Git.
ogImage: ../../../assets/images/blog/claude-code-forking.png
---

![Concepto de Forking de Sesiones en Claude Code](../../../assets/images/blog/claude-code-forking.png)

Como ingenieros, estamos acostumbrados a que nuestro flujo de trabajo sea ramificable. Usamos Git para experimentar sin romper la rama principal. Sin embargo, cuando interactuamos con IAs, solemos estar atrapados en hilos lineales: si una idea no funciona, borramos o empezamos de cero, perdiendo todo el contexto acumulado.

Recientemente, analizando el funcionamiento interno de Claude Code, he encontrado la solución a este problema en su gestión de sesiones.

## El Bucle Agéntico: ¿Cómo "piensa" Claude?

A diferencia de un chat tradicional, Claude Code funciona mediante un bucle agéntico. Cuando le das una tarea, el agente entra en un ciclo de tres fases:

- **Recopilar contexto:** Busca archivos, lee código y entiende las dependencias.
- **Tomar acción:** Realiza ediciones, crea archivos o ejecuta comandos de terminal.
- **Verificar resultados:** Corre tests y comprueba que los cambios funcionan.

Este bucle genera un estado muy valioso. La pregunta es: ¿cómo lo gestionamos cuando queremos probar dos caminos distintos?

## Resume vs. Fork: Domina el Estado

La mayoría de los usuarios conocen el comando `claude --continue` (or `--resume`), que te permite retomar una conversación previa usando el mismo ID de sesión, restaurando todo el historial de mensajes.

Pero el verdadero superpoder para un Lead es el flag `--fork-session`.

- **¿Qué hace?:** Crea una nueva sesión (un nuevo ID) pero preserva todo el historial de la conversación hasta ese punto.
- **¿Para qué sirve?:** Para ramificar tu razonamiento. Puedes probar una refactorización compleja en un "fork" y, si no sale bien, la sesión original permanece intacta. Además, te permite trabajar en paralelo desde diferentes terminales sin que los mensajes se entrelacen.

## Escenario Real: El Dilema de la Refactorización

Imagina que estás colaborando en un proyecto como Brisa (donde echo una mano a mi colega Aral Roca). Tienes un bug de performance.

1. Inicias una sesión de investigación: `claude "Analiza el cuello de botella en el renderizado"`.
2. Tras el análisis, Claude tiene todo el árbol de dependencias en memoria.
3. Haces un fork: Quieres probar a cambiar la gestión de estado.

Si esa vía se vuelve demasiado densa, cierras esa terminal y vuelves a la sesión base. No has perdido ni un segundo volviendo a explicarle el contexto a la IA.

## Seguridad y Persistencia: CLAUDE.md y Checkpoints

Para que este flujo sea profesional, Claude Code introduce dos mecanismos clave:

- **CLAUDE.md:** Un archivo donde guardamos las reglas persistentes del proyecto. Así, no importa cuántos forks hagas, la IA siempre sabrá cuáles son tus estándares de testing o arquitectura.
- **Checkpoints:** Antes de editar cualquier archivo, Claude hace un snapshot. Si algo falla, puedes usar `Esc + Esc` (or pedirle un "undo") para revertir los cambios de archivos instantáneamente.

## Conclusión

La IA ya no es solo una ventana donde hacemos preguntas. En 2026, herramientas como Claude Code se han convertido en una infraestructura de razonamiento ramificable. Aprender a gestionar sesiones no es solo un truco de productividad; es la diferencia entre picar código y orquestar ingeniería.
