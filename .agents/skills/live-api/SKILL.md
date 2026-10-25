---
name: live-api
description: Guidelines for fetching venue and concert data strictly in real time from live REST APIs, with zero hardcoded venue arrays.
---

# Live API & Dynamic Places Policy

## Directiva Obligatoria
En el proyecto Concerts Tracker, los datos de los lugares (recintos, teatros, escenarios, estadios) e infraestructura espacial **DEBEN pedirse siempre a la API en tiempo real**.

## Reglas Críticas
1. **Cero Hardcoding**: Queda terminantemente prohibido definir arrays locales o constantes fijas con recintos o lugares (como estadios, anfiteatros, etc.). Todos los recintos deben obtenerse dinámicamente de endpoints REST en vivo (`https://musicbrainz.org/ws/2/place?query=area:Rosario&fmt=json&limit=100`, OpenStreetMap, etc.).
2. **Consumo en Tiempo Real**: Toda carga de datos debe realizarse a través de llamadas HTTP asíncronas (`fetch`) en tiempo real al inicializar la aplicación o al refrescar datos.
3. **Deduplicación en Vuelo**: En React (especialmente con `<StrictMode>` en desarrollo), se debe coordinar la petición mediante promesas en vuelo compartidas (`in-flight promise`) para evitar disparar solicitudes duplicadas que puedan provocar HTTP 503 / 429 por límite de tasa de la API.
4. **Unificación Geodésica**: El cruce entre eventos de Bandsintown y lugares de OpenStreetMap / MusicBrainz se realiza mediante el algoritmo de Haversine en memoria, asignando el concierto a las coordenadas exactas del recinto en un radio $\le$ 650 metros.
