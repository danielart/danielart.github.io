# Guidelines: Reporting de Análisis Asistido por IA

> **Regla de oro:** Si lo publicas, es tuyo. Si no lo sabes explicar con tus palabras, todavía no lo publiques. _(Addy Osmani: "Explícalo o no lo entregues")_

---

## 1. Reglas de Publicación

- **Tu nombre implica autoría:** "Lo dice la IA" no es una justificación válida en code reviews, postmortems ni reuniones.
- **Formato Slack (TL;DR):** Mantén el mensaje principal por debajo de 15 líneas.
- **Detalle en adjunto (`.md`):** Adjunta el archivo `.md` para conservar formato, tablas y bloques de código sin ensuciar el canal.

---

## 2. Estructura Requerida para Análisis

Todo mensaje de análisis asistido por IA debe incluir:

```text
TL;DR — 1-3 líneas, lenguaje llano. Qué está roto y qué impacto tiene.

Hipótesis / Conclusión — En tus palabras, indicando nivel de confianza:
  [confirmada | probable | especulativa]

Evidencia comprobada — Enlaces a queries (Datadog/Grafana), logs, commits, PRs o dashboards.

Sin verificar todavía — Qué NO has confirmado (declaración explícita de vacíos).

Siguiente paso / Petición — Qué necesitas y de quién.

(Opcional) Output completo de la IA → En el hilo o como snippet etiquetado:
  "Output crudo, sin verificar".
```

---

## 3. Formato Recomendado por Tipo de Contenido

| Soporte                          | Caso de Uso                                      |
| -------------------------------- | ------------------------------------------------ |
| **Mensaje de Slack**             | TL;DR y llamada a la acción                      |
| **Fichero `.md` adjunto**        | Análisis detallado (opción por defecto)          |
| **Claude Artifact**              | Contenido interactivo (verificar permisos antes) |
| **Confluence / Notion / Canvas** | Documentación permanente (runbooks, postmortems) |

---

## 4. Checklist Rápida de Verificación (Antes de Publicar)

- [ ] Cada afirmación factual traza a una fuente comprobada directamente, no solo a la descripción del modelo. _(añadir enlace si el lector puede necesitarlo)_
- [ ] Nombres de servicios, métricas, config keys, rutas de fichero y versiones: todos reales y verificados.
- [ ] La query ha sido reejecutada o el comportamiento reproducido. No solo se ha leído sobre ello, y se ha pedido ayuda si ha sido necesario.
- [ ] Se han evaluado explicaciones alternativas, más allá de la primera hipótesis plausible.
- [ ] El análisis se puede defender en una review técnica ante preguntas consecutivas de profundización.

---

## 5. Buenas Prácticas de Prompts & Input

1. **Aporta datos reales:** Logs, stack traces, diffs y esquemas reales (evita paráfrasis).
2. **Declara restricciones:** Stack, versiones, entorno y lo ya descartado.
3. **Solicita incertidumbre:** Pide al modelo que indique su nivel de certeza y qué necesitaría para confirmar cada punto.
4. **Pide la contra-hipótesis:** _"¿Qué otra cosa podría producir esta misma señal?"_.

---

## 6. Trazabilidad y Antipatrones

### Trazabilidad:

- Etiqueta la contribución: `"Análisis asistido por IA, revisado por <Nombre>"`.
- En incidentes activos: Etiqueta como `"Hipótesis sin verificar, comprobando ahora"`.

### Antipatrones a evitar:

- ✕ Pegar muros de markdown en crudo sin comentario propio.
- ✕ Usar "La IA cree que..." sin verificación previa.
- ✕ Nombres de métricas o servicios alucinados.
- ✕ Compartir artifacts públicos con datos internos o de clientes.
