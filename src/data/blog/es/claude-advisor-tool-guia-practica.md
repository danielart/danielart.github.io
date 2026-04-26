---
title: "[ES] Cómo pagar precio de Haiku por el cerebro de Opus: guía práctica del Advisor Tool"
author: Daniel Artola
pubDatetime: 2026-04-25T16:46:20Z
slug: claude-advisor-tool-guia-practica
featured: true
draft: false
tags:
  - ai
  - claude
  - api
  - es
lang: es
description: "La IA va a seguir subiendo precios. Ajusta tu forma de trabajar ahora que aún estás a tiempo. Guía completa sobre cómo configurar el Advisor Tool de Anthropic por API y Claude Code."
---

La semana pasada hablé por encima del **Advisor Tool** de Anthropic. Hoy voy con la guía completa: cómo configurarlo por API, cómo activarlo en **Claude Code** con un solo comando, qué pares de modelos son válidos, y los detalles de billing que te conviene mirar **antes** de dejarlo corriendo en producción.

El secreto no es usar el modelo más caro para todo, sino el más inteligente para lo que importa.

## Table of contents

## La idea en una frase

Pones a un modelo rápido y barato (Haiku o Sonnet) a hacer el 90% del trabajo. Cuando se atasca o necesita pensar de verdad, **él mismo** consulta a Opus. Tú no orquestas nada — la decisión la toma el ejecutor, y todo ocurre dentro de **una sola llamada `/v1/messages`**.

🏃 **Executor (Haiku o Sonnet)** — el jugador. Genera el código, lee archivos, ejecuta comandos. Rápido y barato.

🧠 **Advisor (Opus)** — el coach. Solo entra cuando hace falta plan, corrección o señal de parada. Nunca llama tools, nunca produce output para el usuario. Solo aconseja al ejecutor.

Es la inversión del patrón típico de sub-agents (orquestador grande que delega en workers pequeños). Aquí el pequeño conduce y escala hacia arriba solo cuando lo necesita.

## Los números que justifican la beta

🔹 **Haiku 4.5 + Opus advisor en BrowseComp:** salto del 19.7% al 41.2%. Más del doble.

🔹 **Sonnet 4.6 + Opus advisor en SWE-bench Multilingual:** ~11% menos coste por tarea que Sonnet solo, con mejor puntuación.

🔹 **Sonnet con advisor a effort medio** alcanza la inteligencia de Sonnet a effort por defecto, gastando menos.

El ahorro no viene del advisor — viene de que el ejecutor termina la tarea en menos turnos porque ya tiene un plan decente.

---

## Modelos válidos (esto importa)

El advisor tiene que ser **al menos tan capaz** como el ejecutor. Estas son las únicas combinaciones que la API acepta:

- Executor `claude-haiku-4-5-20251001` → Advisor `claude-opus-4-7`
- Executor `claude-sonnet-4-6` → Advisor `claude-opus-4-7`
- Executor `claude-opus-4-6` → Advisor `claude-opus-4-7`
- Executor `claude-opus-4-7` → Advisor `claude-opus-4-7`

Cualquier otra combinación devuelve `400 invalid_request_error`. No, no puedes poner Haiku como advisor de Sonnet "para abaratar" — la beta no lo permite, y tampoco serviría de nada.

---

## Opción A: Claude Code (lo más fácil)

Si ya usas Claude Code, esto es literalmente un comando.

**Requisito:** Claude Code v2.1.101 o superior. Comprueba con `claude --version` y actualiza si hace falta:

```bash
npm install -g @anthropic-ai/claude-code
```

**Activación:**

1. Abre Claude Code en tu proyecto: `claude`
2. Dentro de la sesión escribe: `/advisor`
3. Te muestra una lista corta de modelos. Elige Opus.

Verás algo tipo *"Advisor configured. Opus will be consulted for complex decisions and task completion checks."* Y ya. Ni sampling parameters, ni system prompts custom, ni nada.

**Lo que tienes que entender es que tú no llamas al advisor.** No hay comando "consulta al advisor". Sonnet decide solo cuándo necesita una segunda opinión, mete la llamada en silencio en mitad de su respuesta, y el consejo se incorpora al contexto como si siempre hubiera estado ahí. La primera vez que lo veas vas a buscar un diálogo de confirmación que no existe.

⚠️ **Limitación importante:** solo funciona contra la API directa de Anthropic. Si usas Claude Code a través de **Bedrock, Vertex, LiteLLM, OpenRouter** o cualquier otro proxy, el advisor no se dispara. Es una feature server-side que vive en el endpoint nativo.

---

## Opción B: API directa (control total)

Cuando construyes tu propio agente, lo declaras como una tool más en el array `tools`:

```python
import anthropic

client = anthropic.Anthropic()

response = client.beta.messages.create(
    model="claude-sonnet-4-6",                  # executor
    max_tokens=4096,
    betas=["advisor-tool-2026-03-01"],          # header beta
    tools=[
        {
            "type": "advisor_20260301",
            "name": "advisor",
            "model": "claude-opus-4-7",         # advisor
            "max_uses": 5,                       # opcional, tope por request
        }
    ],
    messages=[
        {"role": "user", "content": "Construye un worker pool concurrente en Go con graceful shutdown."}
    ],
)
```

Tres cosas mínimas:

1. El header beta `advisor-tool-2026-03-01`.
2. El executor en `model` (top-level).
3. La tool `advisor_20260301` con su `model` propio (el advisor).

### Multi-turno: cuidado con esto

En las llamadas siguientes tienes que **devolver el historial completo, incluyendo los bloques `advisor_tool_result`**. Si los omites mientras el advisor sigue en `tools`, la API devuelve 400. Y si quitas el advisor de `tools`, también tienes que limpiar esos bloques del historial. Es la combinación de las dos cosas a la vez o ninguna.

```python
messages.append({"role": "assistant", "content": response.content})
messages.append({"role": "user", "content": "Ahora añade un límite de 10 in-flight."})
```

---

## 💡 Configuración `keep: "all"` (el detalle de caching que se escapa)

Cito doc textualmente: *clear_thinking with a keep value other than "all" shifts the advisor's quoted transcript each turn, causing advisor-side cache misses*.

¿Por qué importa? El advisor genera bloques de razonamiento estratégicos. Por defecto, cuando tienes extended thinking activado, la API aplica `clear_thinking` con `keep: {type: "thinking_turns", value: 1}` — es decir, recorta los bloques antiguos en cada turno. Eso desplaza el transcript que ve el advisor y rompe el prompt caching del lado advisor.

Resultado: pagas escritura de caché en cada llamada y nunca hay lectura. Cache miss perpetuo.

**Solución:** fija `keep: "all"` en tu configuración de context editing. Mantienes el historial íntegro, las llamadas recurrentes al advisor leen del caché, y el ahorro puede llegar al **90%** en los tokens de entrada del advisor.

Y para activar el caching del propio advisor:

```python
tools=[
    {
        "type": "advisor_20260301",
        "name": "advisor",
        "model": "claude-opus-4-7",
        "caching": {"type": "ephemeral", "ttl": "5m"},
    }
]
```

⚠️ **Regla de oro del caching del advisor:** la escritura de caché **cuesta más de lo que ahorra si llamas al advisor 2 veces o menos por conversación**. Empieza a salir rentable a partir de la 3ª llamada. Para tareas cortas, déjalo desactivado.

---

## Billing: lo que el `usage` esconde

El advisor se factura **a su propia tarifa Opus**, aparte del ejecutor. Y los campos top-level del `usage` solo reflejan al ejecutor. Si haces tracking de costes mirando solo `input_tokens` y `output_tokens`, te vas a quedar corto.

Lo real está en `usage.iterations[]`:

```json
{
  "usage": {
    "input_tokens": 412,
    "output_tokens": 531,
    "iterations": [
      {"type": "message", "input_tokens": 412, "output_tokens": 89},
      {"type": "advisor_message", "model": "claude-opus-4-7", "input_tokens": 823, "output_tokens": 1612},
      {"type": "message", "input_tokens": 1348, "cache_read_input_tokens": 412, "output_tokens": 442}
    ]
  }
}
```

- Iteraciones `type: "message"` → tarifa executor.
- Iteraciones `type: "advisor_message"` → tarifa advisor (Opus).
- El advisor produce típicamente **400-700 tokens de texto, o 1.400-1.800 incluyendo thinking** por llamada.
- `max_tokens` del request **no limita** los tokens del advisor.

Si quieres trackear coste en serio, suma tú las iterations.

---

## Prompts del sistema que de verdad mueven la aguja

Si construyes tu propio agente por API y quieres replicar la calidad que Anthropic mide en sus benchmarks, mete estos bloques **al principio del system prompt del ejecutor**, antes de cualquier otra mención al advisor:

**Bloque de timing** (cuándo llamar):

> Llama al advisor ANTES del trabajo sustantivo — antes de escribir, antes de comprometerte con una interpretación, antes de construir sobre una asunción. Si la tarea requiere orientación primero (encontrar archivos, leer una fuente), hazlo, luego llama al advisor. La orientación no es trabajo sustantivo. Escribir, editar y declarar una respuesta sí lo son.
>
> Llama también al advisor cuando creas que la tarea está completa (haz el deliverable durable antes: escribe el archivo, guarda el resultado), cuando estés atascado, y cuando consideres cambiar de approach.

**Bloque de cómo tratar el consejo** (justo después):

> Dale al consejo peso serio. Si sigues un paso y falla empíricamente, o tienes evidencia de fuente primaria que contradice una afirmación específica, adapta. Un test propio que pasa NO es evidencia de que el consejo está mal — es evidencia de que tu test no comprueba lo que el consejo comprueba.

**Bloque de concisión** (recorta ~35-45% los tokens del advisor sin tocar la frecuencia):

> The advisor should respond in under 100 words and use enumerated steps, not explanations.

En Claude Code estos prompts ya vienen aplicados de fábrica. Por API, tienes que ponerlos tú.

---

## Cuándo NO usarlo

Esto no es magia y no compensa siempre:

- **Q&A de un solo turno.** No hay nada que planificar, el ejecutor no lo va a invocar y solo añades overhead.
- **Tareas mecánicas puras** (formateo, lookups, regex). Sin puntos de decisión, sin advisor.
- **Paths críticos en latencia.** El stream del ejecutor se **pausa** mientras corre el sub-inference del advisor. No streamea.
- **Workloads donde cada turno necesita Opus.** Si siempre lo necesitas, ya estás pagando dos veces por nada — usa Opus directamente.
- **A través de Bedrock o Vertex hoy.** El soporte está en camino pero aún no es nativo en todos lados.

---

## Las otras llaves maestras del presupuesto

El advisor no opera solo. Combínalo con:

✨ **Prompt Caching** — hasta 90% de ahorro en tokens de entrada repetidos. Crítico para conversaciones largas.

📦 **Batch API** — 50% de ahorro en cualquier tarea que no necesite respuesta inmediata.

⚙️ **Effort settings** — Sonnet a effort medio + Opus advisor ≈ Sonnet a effort default, más barato.

En un mercado donde el razonamiento se está volviendo un lujo caro, **la orquestación es tu mejor ventaja competitiva**.

---

## TL;DR

- En **Claude Code**: `/advisor` → elige Opus → listo. Solo API directa de Anthropic.
- Por **API**: header `advisor-tool-2026-03-01` + tool `advisor_20260301` con su `model`.
- **Pares válidos:** Haiku/Sonnet/Opus 4.6/Opus 4.7 como executor → siempre Opus 4.7 como advisor.
- **`keep: "all"`** si tienes extended thinking, o pierdes el caching del advisor.
- **`caching: ephemeral`** solo si esperas 3+ llamadas por conversación.
- **Billing:** mira `usage.iterations[]`, no los top-level. Tarifa Opus por cada `advisor_message`.
- **No lo uses** para tareas de un turno, mecánicas, o por proxies tipo Bedrock/Vertex hoy.

🚀 Si usas IA para programar y todavía estás lanzando prompts sin medir tokens, en el próximo post entro a detalle en prompt caching, batch API y la economía real de un agente en producción. Sígueme para no perdértelo.
