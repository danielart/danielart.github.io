---
title: "Cuándo integrar los subagentes en tu agente principal"
description: "Cómo simplificar un sistema de agentes con skills y herramientas, con un ejemplo de soporte de pedidos y una evaluación del proceso completo."
author: Daniel Artola
pubDatetime: 2026-11-06T09:00:00Z
draft: true
lang: es
translationKey: when-to-fold-subagents-into-main-agent
pillar: agent-ready-repositories
articleType: guide
audience:
  - developer
  - tech-lead
tags:
  - ai
  - agents
  - skills
  - architecture
---

Un sistema con un agente coordinador y varios especialistas parece una forma natural de organizar el trabajo. Sin embargo, cada delegación añade una decisión, una espera y un intercambio de información.

Anthropic propone revisar qué especialistas pueden convertirse en skills y herramientas del agente principal. Recomienda conservar subagentes cuando aportan aislamiento de contexto, trabajo paralelo o verificación independiente, y evaluar cada integración antes de adoptarla. [Artículo original](https://claude.com/es/resources/articles/building-agents-when-to-fold-subagents-into-your-main-agent-loop).

Este post desarrolla una propuesta práctica de soporte de pedidos. Si necesitas repasar la terminología, puedes consultar la [guía de conceptos de Claude Code](/posts/es/claude-code-conceptos-guia).

## Table of contents

## Ejemplo práctico: un asistente para consultar pedidos

Un cliente pregunta:

> «Mi pedido debería haber llegado ayer. ¿Cuándo llega y qué opciones tengo?»

Una posible arquitectura reparte el trabajo así:

```text
Cliente
  → Coordinador
    → Agente de pedidos
    → Agente de envíos
    → Agente de incidencias
  → Respuesta
```

Cada especialista recibe información, realiza consultas y devuelve un resultado. El coordinador debe reunirlos y decidir si necesita otra delegación.

Podemos plantear una versión más sencilla:

```text
Cliente
  → Agente principal
    → Herramienta para consultar el pedido
    → Herramienta para consultar el envío
    → Instrucciones para gestionar retrasos
  → Respuesta
```

En esta propuesta, el agente principal mantiene la conversación y consulta los sistemas necesarios. Las instrucciones se cargan cuando aparece una incidencia de entrega.

## Qué hace cada pieza

Esta sería una propuesta de implementación para ese caso:

| Pieza                | Responsabilidad                          | Ejemplo                                            |
| -------------------- | ---------------------------------------- | -------------------------------------------------- |
| Agente principal     | Decidir los siguientes pasos y responder | Relacionar el retraso con las opciones disponibles |
| Skill                | Explicar cómo ejecutar un procedimiento  | Qué comprobar ante un envío retrasado              |
| Herramienta          | Consultar datos o ejecutar acciones      | Obtener el seguimiento del transportista           |
| Base de conocimiento | Aportar información de referencia        | Condiciones de compensación                        |
| Controles en código  | Hacer cumplir permisos y límites         | Impedir una devolución sin autorización            |

Una skill podría contener este procedimiento:

```text
Cuando el cliente informe de un retraso:

1. Comprueba el estado del pedido.
2. Consulta la previsión actual del transportista.
3. Revisa qué opciones corresponden al caso.
4. Explica qué está confirmado y qué sigue pendiente.
5. Solicita autorización antes de ejecutar una acción
   que la requiera.
```

La distinción ayuda a decidir qué necesita un agente propio: tener instrucciones especializadas no implica necesariamente necesitar otro agente.

## El fallo real que ilustra el riesgo

Anthropic describe una prueba con un agente de soporte en la que integrar un subagente redujo la latencia, pero rompió parte del procedimiento: el agente principal consultaba el pedido y respondía sin obtener la fecha de entrega del especialista en envíos. [Caso descrito por Anthropic](https://claude.com/es/resources/articles/building-agents-when-to-fold-subagents-into-your-main-agent-loop).

El artículo no identifica a la empresa ni publica una implementación completa. El ejemplo anterior desarrolla cómo podría aplicarse esa lección; no reproduce un sistema de producción documentado.

Para detectar ese fallo, nuestra evaluación debe comprobar algo más que si la respuesta suena correcta:

| Caso de prueba propuesto                    | Qué comprobar                                              |
| ------------------------------------------- | ---------------------------------------------------------- |
| Pedido retrasado con nueva fecha disponible | La respuesta utiliza la previsión actual del transportista |
| Pedido registrado sin previsión de entrega  | El agente reconoce que falta ese dato                      |
| Herramienta de seguimiento no disponible    | El agente explica la limitación y ofrece un siguiente paso |
| Cliente que solicita una compensación       | Se consultan las condiciones aplicables antes de ofrecerla |
| Acción que requiere autorización            | La acción queda pendiente hasta obtenerla                  |

## Cómo aplicarlo a tu sistema

Para probar esta propuesta en un asistente de pedidos:

1. Elegir dos especialistas que compartan datos y se llamen habitualmente en secuencia.
2. Registrar cómo resuelven hoy un conjunto de casos reales.
3. Convertir las instrucciones de uno en una skill y sus consultas en herramientas.
4. Ejecutar los mismos casos con ambas arquitecturas.
5. Comparar tareas completadas, errores, tiempo de respuesta y coste.
6. Revisar los casos concretos que empeoran, aunque la puntuación media mejore.

El criterio para esta prueba es conservar un subagente cuando su separación aporte una ventaja medible. Si un especialista solo añade una delegación para consultar datos que el agente principal puede interpretar directamente, es un buen candidato para simplificar.
