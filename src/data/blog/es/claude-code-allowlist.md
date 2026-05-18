---
title: "[ES] Deja que Claude Code escriba su propia allowlist"
author: Daniel Artola
pubDatetime: 2026-05-18T18:00:00Z
slug: claude-code-allowlist
featured: false
draft: false
tags:
  - ai
  - claude
  - es
lang: es
description: El problema de las 100 aprobaciones diarias y cómo la skill /fewer-permission-prompts de Claude Code lo soluciona de forma transparente.
---

## Table of contents

## El problema de las 100 aprobaciones diarias

Si usas Claude Code en modo manual, conoces la sensación: cada `npm run typecheck`, cada `git log`, cada `kubectl get pods` es un prompt de permiso. Apruebas el mismo comando inofensivo veinte veces al día. Cuando Anthropic mide esto en su propia base de usuarios, el dato es demoledor: **se aprueba el 93% de los prompts**.

Eso no es seguridad. Es fatiga de aprobación. Y la fatiga de aprobación es justo lo que hace que el día que aparezca un `rm -rf` mal contextualizado le des a "yes" por inercia.

Hay tres salidas históricas a este problema:

1. **Mantener `settings.json` a mano.** Funciona, pero requiere disciplina y conocer la sintaxis de patrones.
2. **`--dangerously-skip-permissions`.** Rápido y peligroso. El nombre no es decorativo.
3. **Auto mode** (con clasificadores). Buena opción, pero no todo el mundo cumple los requisitos o quiere delegar la decisión a un modelo.

En abril de 2026, Anthropic publicó una cuarta vía: una skill oficial que **lee tu propio historial y construye la allowlist por ti**. Se llama `/fewer-permission-prompts` y resuelve la fricción sin renunciar al control manual.

---

## Qué hace exactamente

La skill viene integrada en Claude Code (v2.1+). No se instala, no se configura. Se invoca:

```
/fewer-permission-prompts
```

Por dentro, sigue un pipeline bastante conservador:

1. **Lee transcripciones** en `~/.claude/projects/<dir>/*.jsonl`, limitándose a las 50 sesiones más recientes.
2. **Extrae todas las llamadas** Bash y MCP, agrupando por comando + primer subcomando (`git log`, `gh pr view`, `mcp__slack__read_thread`...).
3. **Filtra a solo lectura.** Descarta `rm`, `git push`, `npm install`, builds con efectos secundarios, POST requests, comandos que matan procesos.
4. **Omite lo que ya está auto-permitido** sin necesidad de entrada en allowlist: `cat`, `ls`, `git status`, `gh pr view`, `docker logs`, `lsof`...
5. **Bloquea wildcards peligrosos.** `Bash(python3:*)`, `Bash(bun run *)`, `sudo`, intérpretes, shells, `npx` — cualquier cosa que abra ejecución arbitraria de código, aunque solo lo uses para una herramienta específica.
6. **Ordena por frecuencia**, descarta lo que aparece menos de 3 veces y muestra el top 20.

El resultado es una tabla con candidatos, una explicación de qué añadió y qué omitió, y una escritura limpia en `.claude/settings.json` del proyecto (no en el global, no en `settings.local.json`).

---

## Un ejemplo real

Lo más claro es ver una ejecución. Aquí está el resultado en un proyecto real con un gateway MCP en Kubernetes, después de filtrar nombres internos:

| # | Patrón | Veces | Notas |
|---|---|---|---|
| 1 | `Bash(kubectl port-forward -n <ns> svc/<svc> 8000:8000 *)` | 4 | túnel local al gateway |
| 2 | `Bash(npx tsc --noEmit *)` | 4 | typecheck de TypeScript |
| 3 | `Bash(curl -s http://localhost:8000/*)` | 3 | health checks GET en local |
| 4 | `Bash(lsof -ti:*)` | 2 | ocupación de puertos |
| 5 | `Bash(dotnet --version *)` | 2 | versión del SDK |

De estos cinco candidatos, **solo dos terminan en la allowlist**. Vale la pena entender por qué los otros tres caen, porque cada motivo ilustra una regla de la skill:

- **`npx tsc --noEmit` (4 veces).** Aparece arriba en frecuencia, pero `npx` es un ejecutor de código arbitrario. Aunque hoy lo uses solo para `tsc`, mantén el flag `--noEmit` y nunca cambies de máquina, allowlistarlo significaría dar luz verde a cualquier paquete que `npx` decida descargar. La skill se niega explícitamente.
- **`lsof -ti:*` (2 veces).** Cae por dos motivos: `lsof` ya está en la lista de auto-permitidos, y además no llega al umbral de 3 ocurrencias.
- **`dotnet --version` (2 veces).** Read-only, sin riesgo, pero por debajo del umbral. La skill prefiere falsos negativos a inflar la allowlist con ruido.

> **💡 Consejo:** Puedes preguntarle directamente a Claude (ej. *"¿qué permisos has omitido en esta última ejecución y por qué?"*) para entender mejor su proceso de decisión si notas que un comando frecuente no se ha añadido a la allowlist.

Quedan dos líneas que entran en `.claude/settings.json`:

```json
{
  "permissions": {
    "allow": [
      "Bash(kubectl port-forward -n <ns> svc/<svc> 8000:8000 *)",
      "Bash(curl -s http://localhost:8000/*)"
    ]
  }
}
```

El resto del archivo se preserva intacto. Conservadora, transparente, sin sorpresas.

---

## Patrones de allowlist que vas a ver

La sintaxis es sencilla pero tiene una trampa que conviene memorizar:

| Patrón | Cuándo se usa |
|---|---|
| `Bash(foo)` | Coincidencia exacta de una invocación concreta |
| `Bash(foo *)` | Prefijo + espacio: matchea `foo`, `foo bar`, `foo --opt` |
| `Bash(foo*)` | Sin espacio: cuidado, `Bash(ls*)` también captura `lsof` |
| `mcp__server__tool` | Nombre completo de herramienta MCP, sin comodines |

La diferencia entre `foo *` y `foo*` se ha cobrado allowlists enteras. El espacio importa.

---

## Dónde escribe y por qué importa en equipo

La skill escribe en `.claude/settings.json`, que es el archivo **versionado y compartido** del proyecto. No en `.claude/settings.local.json` (que es tuyo y no se sube). No en `~/.claude/settings.json` (que es global a tu usuario).

Esto tiene consecuencias prácticas:

- **Revisa siempre el diff antes de commit.** Lo que para ti es "un puerto local" puede ser un endpoint interno que no quieres documentar públicamente en el repo.
- **Si una entrada es personal**, muévela manualmente a `.claude/settings.local.json` después de la ejecución.
- **Si estás en un repo público**, ten especial cuidado con nombres de servicios internos, namespaces de Kubernetes o rutas que filtren arquitectura.

No es un fallo de la skill, es una decisión de diseño: los beneficios de una allowlist son mayores cuando todo el equipo los comparte. Pero el commit pasa por ti.

---

## El hermano del mismo origen: `/insights`

Misma fuente de datos, propósito complementario. `/insights` lee los mismos `.jsonl`, pero en lugar de construir una allowlist genera un informe HTML con:

- Puntos de fricción recurrentes en tus sesiones
- Reglas sugeridas para tu `CLAUDE.md` basadas en las instrucciones que más repites
- Patrones de comportamiento del modelo que merecen documentación

Donde `/fewer-permission-prompts` ataca la fricción de aprobación, `/insights` ataca la fricción de comprensión: las veces que tuviste que explicarle a Claude algo que ya debería saber.

La combinación quincenal de ambas es un hábito barato y muy rentable.

---

## Conclusión

`/fewer-permission-prompts` no es una herramienta espectacular. No te ahorra una hora al día ni desbloquea nada nuevo. Lo que hace es eliminar diez segundos de fricción cien veces al día, sin que tengas que pensar en sintaxis de patrones ni mantener allowlists a mano.

Más importante: lo hace de forma transparente y conservadora. Te enseña qué añade, qué omite y por qué. Bloquea por defecto los wildcards peligrosos. Exige un umbral mínimo de frecuencia para evitar ruido. Y deja la decisión final en ti.

Es el tipo de utilidad que solo Anthropic podía hacer bien, porque tienen acceso a la semántica completa de los transcripts y conocen su propia lista de auto-permitidos. Cualquier intento de tercero sería peor.

Si usas Claude Code en modo manual y no la has corrido todavía, hazlo hoy. Cinco segundos de invocación a cambio de semanas de aprobaciones que dejas de hacer.

---

**Referencias**
- Post original (Wmedia): https://wmedia.es/en/tips/claude-code-fewer-permission-prompts
- Documentación oficial: https://code.claude.com/docs/en/permissions
- Auto mode (contexto sobre el 93% de aprobación): https://www.anthropic.com/engineering/claude-code-auto-mode
