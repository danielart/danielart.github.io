---
title: "[ES] Guía Técnica Comparativa: Conceptos de Claude Code"
author: Daniel Artola
pubDatetime: 2026-04-09T10:20:14Z
slug: claude-code-conceptos-guia
featured: true
draft: false
tags:
  - ai
  - claude
  - guia
  - es
lang: es
description: Una guía técnica basada en la documentación oficial de Anthropic sobre los cinco conceptos distintos en Claude Code.
---

## Table of contents

## Introducción

**Claude Code — Prompt, Skill, Subagent, Agent y Agent Teams**
_Guía técnica basada en documentación oficial de Anthropic_

Fuentes: [Agent Skills](https://platform.claude.com/docs/en/agents-and-tools/agent-skills/overview) · [Subagents](https://code.claude.com/docs/en/sub-agents) · [Agent Teams](https://code.claude.com/docs/en/agent-teams) · [Skills in Claude Code](https://code.claude.com/docs/en/skills)

### Cinco conceptos distintos en Claude Code

No es una jerarquía lineal de complejidad: son herramientas con propósitos distintos que pueden combinarse entre sí.

`Prompt` -> `Skill` -> `Subagent` -> `Agent (sesión)` -> `Agent Teams`

- **Prompt**: Mensaje al agente con instrucciones, contexto y/o herramientas. Es la unidad base de toda interacción.
- **Skill**: Directorio con un archivo `SKILL.md` que encapsula conocimiento reutilizable. Claude la carga automáticamente o vía `/slash-command`.
- **Subagent**: Instancia de Claude con su propio contexto, system prompt, herramientas y permisos, invocada por el agente principal via la herramienta `Agent`.
- **Agent (sesión)**: Claude Code en modo interactivo o headless: tiene acceso a herramientas, lee `CLAUDE.md`, puede delegar a subagents. Es la sesión principal.
- **Agent Teams**: Múltiples sesiones de Claude Code coordinadas: un team lead y varios teammates, cada uno con su propio contexto. Requiere activación explícita.

## Prompt — Instrucción al agente

> *"Un prompt no es solo una pregunta sencilla: es cualquier instrucción que le das a Claude, con o sin herramientas, simple o compleja."*

El prompt es la entrada que recibe Claude Code en cualquier interacción. Puede lanzar una conversación interactiva, ejecutar una tarea headless (`claude -p "..."`), o servir como base de un sistema agentic complejo con system prompt, contexto del proyecto y herramientas activas.

> **Según la documentación oficial:** El Agent SDK usa por defecto un system prompt mínimo. Para incluir el system prompt completo de Claude Code con todas sus herramientas y comportamientos, se especifica `systemPrompt: { type: "preset", preset: "claude_code" }`. Los archivos `CLAUDE.md` se cargan como contexto adicional del proyecto.

**Cuándo centrarse en el prompt:**
- Tarea acotada o conversación directa
- Scripting headless con `-p`
- Configuración del system prompt para el SDK
- Punto de entrada a cualquier flujo agentic

> **Ejemplos:**
> - `claude -p "Refactoriza la función authenticate en src/auth.ts"` — tarea puntual headless
> - Conversación interactiva con Claude Code con acceso a todas las herramientas
> - Entrada a un agente SDK con system prompt personalizado y herramientas configuradas
> - `CLAUDE.md` actúa como contexto persistente que se inyecta en cada prompt del proyecto

| Pros | Contras |
| ---- | ------- |
| Flexible · Configurable · Base de todo lo demás · Modo headless para scripts | Sin estado entre sesiones distintas · Requiere buen diseño para tareas complejas |

## Skill — Capacidad especializada y reutilizable

> *"Una Skill es como un playbook experto que Claude consulta automáticamente cuando la tarea es relevante, o que tú invocas con un slash-command."*

> **Corrección respecto a la guía anterior:** Las Skills NO viven en `CLAUDE.md`. Son directorios con un archivo `SKILL.md` en `.claude/skills/nombre-skill/` (proyecto) o `~/.claude/skills/nombre-skill/` (usuario).

Según la documentación oficial, una Skill es un directorio con tres tipos de contenido que se cargan de forma progresiva para no consumir contexto innecesariamente:

1. **Nivel 1 — Metadata (siempre cargada)**: YAML frontmatter: `name` y `description`. Solo ~100 tokens. Claude sabe que existe y cuándo usarla.
2. **Nivel 2 — Instrucciones (al activarse)**: Cuerpo del `SKILL.md`: flujos de trabajo, mejores prácticas. Se carga vía bash cuando la Skill se activa. Menos de 5k tokens.
3. **Nivel 3 — Recursos y código (bajo demanda)**: Scripts ejecutables, plantillas, documentación. Claude los lee solo si los necesita. Sin límite práctico de tamaño.

> **Diferencia con Slash Commands:** Los slash commands built-in (`/clear`, `/compact`) son lógica fija. Las Skills son archivos que antes se llamaban "commands" (`.claude/commands/`) y ahora han evolucionado a `.claude/skills/` con capacidades extra: frontmatter de control, scripts adjuntos, inyección dinámica de contexto con ``!`comando` ``.

**Cuándo usarla:**
- Conocimiento de dominio reutilizable entre conversaciones
- Convenciones del equipo (estilo de código, patrones de PR)
- Workflows que Claude debe iniciar automáticamente
- Bundling de scripts junto a instrucciones
- Disponible también en Claude.ai y la API

| Pros | Contras |
| ---- | ------- |
| Auto-cargada por relevancia · Reutilizable entre proyectos · Puede incluir código · Funciona en Claude.ai, API y Claude Code | Requiere entorno con ejecución de código · Skills de distintas superficies no se sincronizan · No hereda skills del agente padre |

## Subagent — Asistente especializado con contexto propio

> *"Un subagent es un especialista que el agente principal convoca para una tarea concreta: trabaja de forma independiente en su propio contexto y devuelve solo el resultado."*

Los subagents son instancias de Claude con su propio system prompt, herramientas configuradas, permisos y ventana de contexto. El agente principal los invoca mediante la herramienta `Agent` (antes llamada `Task`). Se definen como archivos Markdown con YAML frontmatter en `.claude/agents/` o `~/.claude/agents/`.

> **Clave según la documentación oficial:** Los subagents NO heredan el contexto de la conversación principal — solo reciben lo que el agente padre incluye explícitamente en el prompt de invocación. **Los subagents no pueden invocar a otros subagents.** Si necesitas delegación anidada, usa Skills o encadena subagents desde la conversación principal.

**Cuándo usarlo frente a la conversación principal:**
- La tarea genera output verboso que no quieres en el contexto principal
- Quieres restringir herramientas específicas (subagent read-only)
- El trabajo es autocontenido y puede devolver un resumen
- Operaciones en paralelo independientes

> **Latencia:** los subagents empiezan con contexto vacío y pueden tardar en reunir el contexto necesario. Para preguntas rápidas sobre algo ya en la conversación, usa `/btw` en su lugar.

| Pros | Contras |
| ---- | ------- |
| Aísla contexto · Herramientas restringibles · Memoria persistente opcional · Modelo configurable por subagent · Reutilizable con plugins | Sin contexto heredado · No pueden invocar otros subagents · Solo reportan al agente padre · Añade latencia al empezar |

## Agent (sesión) — La sesión principal de Claude Code

> *"Una sesión de Claude Code es un agente completo: razona, actúa, observa el resultado y repite hasta completar el objetivo."*

Cuando lanzas Claude Code de forma interactiva o con `claude --agent nombre`, estás iniciando un agente con acceso completo a herramientas, bucle de razonamiento autónomo y capacidad de delegar a subagents. El Agent SDK permite construir agentes programáticamente con las mismas capacidades.

> **Según la documentación oficial:** Con `claude --agent nombre-subagent`, la sesión principal adopta el system prompt, herramientas y modelo de ese subagent. Con `CLAUDE.md` se inyecta contexto del proyecto. El bucle agentico incluye herramientas como Bash, Read, Write, Edit, WebSearch, y la herramienta `Agent` para delegar a subagents.

**Cuándo es el enfoque adecuado:**
- Objetivo complejo de múltiples pasos con decisiones encadenadas
- Iteración: error -> análisis -> corrección -> verificación
- Acceso completo al sistema de archivos y terminal
- Tarea que requiere back-and-forth o refinamiento iterativo
- Múltiples fases que comparten contexto (planificación -> implementación -> tests)

| Pros | Contras |
| ---- | ------- |
| Autónomo · Bucle completo de razonamiento · Acceso total a herramientas · Puede delegar a subagents · Configurable vía SDK | Contexto único (sin paralelismo real) · Coste medio-alto · Requiere revisión en tareas críticas |

## Agent Teams — Sesiones coordinadas con comunicación directa

> *"Un equipo de Claude Code: un team lead coordina; los teammates trabajan en paralelo, pueden hablar entre sí directamente y tienen cada uno su propio contexto."*

> **Según la documentación oficial:** Agent Teams son **experimentales** y están desactivados por defecto. Requieren `CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS=1` en settings o entorno. Necesitan Claude Code v2.1.32 o superior.

La diferencia clave con los subagents: los teammates son sesiones completamente independientes que se comunican directamente entre sí (no solo a través del lead). Comparten una lista de tareas común y un sistema de mensajería (mailbox). El usuario puede también hablar directamente con cualquier teammate.

**Mejores casos de uso (según la doc oficial):**
- Investigación y revisión: múltiples perspectivas en paralelo
- Módulos o features nuevas donde cada teammate "posee" su área
- Debugging con hipótesis competidoras en paralelo
- Cambios que abarcan frontend + backend + tests simultáneamente

> **Importante — cuándo NO usar Agent Teams:** tareas secuenciales, ediciones al mismo archivo, trabajo con muchas dependencias. En esos casos, subagents o una sesión única son más eficientes. El coste escala con cada teammate.

| Pros | Contras |
| ---- | ------- |
| Comunicación directa entre teammates · Paralelismo real · Cada uno con contexto independiente · Lista de tareas compartida con dependencias | Experimental · Alto coste (escala linealmente) · Sin resumption de in-process teammates · Un equipo por sesión |

## Tabla comparativa

| Dimensión | Prompt | Skill | Subagent | Agent (sesión) | Agent Teams |
| --------- | ------ | ----- | -------- | -------------- | ----------- |
| **¿Qué es?** | Entrada al agente | Directorio `SKILL.md` con conocimiento | Instancia Claude delegada por el agente | Sesión Claude Code completa | Múltiples sesiones coordinadas |
| **Dónde vive** | Llamada o sesión | `.claude/skills/` | `.claude/agents/` | Sesión activa | Sesiones en `~/.claude/teams/` |
| **Activación** | Manual / headless | Automática o slash-command | El agente la invoca | Lanzamiento de Claude Code | Lead crea el equipo |
| **Contexto propio** | No | Parcial (carga progresiva) | Sí, aislado | Sí, completo | Sí, uno por teammate |
| **Comunicación cruzada** | No | No | Solo reporta al padre | Solo delega hacia abajo | Directa entre teammates |
| **Subagents anidados**| No | Con `context: fork` | No | Sí | Solo el lead |

## Árbol de decisión

*¿Cuándo usar Skills vs Subagents?* según la doc oficial: usa Skills cuando quieras prompts o workflows reutilizables que corran en el contexto principal; usa Subagents cuando quieras aislamiento de contexto y herramientas restringidas.

1. **¿Es conocimiento reutilizable que Claude debería cargar automáticamente en muchos proyectos?**
   - Sí -> **Skill** en `~/.claude/skills/`
2. **¿Es un workflow o convención específica de este proyecto que el equipo debe compartir?**
   - Sí -> **Skill** en `.claude/skills/`
3. **¿La tarea genera output verboso que no quieres en el contexto principal, o necesitas herramientas restringidas?**
   - Sí -> **Subagent**
4. **¿Necesitas iteración, múltiples pasos y acceso completo al sistema?**
   - Sí -> **Agent (sesión)**
5. **¿Los trabajadores necesitan comunicarse entre sí, no solo reportar al jefe?**
   - Sí -> **Agent Teams** (si el paralelismo y la colaboración aportan valor real)

### Reglas de oro
- **Skills vs Subagents:** Usa Skills para workflows en el contexto principal, Subagents para aislamiento de contexto.
- **Subagents vs Agent Teams:** Usa subagents para trabajadores enfocados que solo reportan. Usa Agent Teams para colaboración compleja.
- **Empieza simple:** Para preguntas rápidas, usa `/btw` en lugar de un subagent.
- **Agent Teams:** 3-5 teammates es el punto óptimo.
