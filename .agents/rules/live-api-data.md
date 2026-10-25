# Regla de Consumo de Datos en Tiempo Real (APIs en Vivo)

## 1. Mandato Estricto: 100% APIs en Tiempo Real para Lugares y Conciertos
Todos los datos de lugares (recintos, teatros, estadios, anfiteatros, escenarios) y eventos musicales **DEBEN** solicitarse obligatoriamente a servicios web (APIs REST) en tiempo real en cada ejecución.

## 2. Prohibición Terminante de Datos Hardcodeados
- **ESTÁ ESTRICTAMENTE PROHIBIDO** hardcodear arrays, listas fijas o diccionarios estáticos de recintos (`OFFICIAL_VENUES`, `ROSARIO_VENUES`, etc.) dentro del código fuente de la aplicación.
- No se deben utilizar listas estáticas como sustituto de peticiones HTTP en vivo.
- Toda entidad cartográfica debe originarse a partir de las respuestas JSON provistas por las APIs públicas en vivo (OpenStreetMap / MusicBrainz Places API para recintos de Rosario, y Bandsintown REST API para recitales y giras).

## 3. Manejo de Concurrencia y Resiliencia en Cliente
- Para prevenir bloqueos o errores de rate-limiting (HTTP 429/503) generados por el doble montaje de componentes en desarrollo (`React.StrictMode`), se debe implementar **deduplicación de promesas en vuelo** (`in-flight promise deduplication`).
- Si una petición concurrente se encuentra en progreso, las subsiguientes llamadas deben acoplarse a la misma promesa en lugar de disparar ráfagas redundantes de peticiones de red.
- En caso de fallas transitorias de red o rate limit temporal de la API externa, la aplicación debe retener en memoria de sesión los datos previamente obtenidos en vivo de la API para garantizar estabilidad visual sin recurrir a datos estáticos en código.

## 4. Unificación Espacial por Distancia Geodésica (Haversine)
- La articulación entre la base de datos temática de eventos (Bandsintown) y la base de datos espacial de recintos (MusicBrainz / OpenStreetMap) se debe realizar dinámicamente mediante el cálculo geodésico de Haversine (proximidad $\le$ 650 metros).
- Los nombres oficiales y coordenadas autoritativas de los marcadores del mapa deben provenir siempre del recinto emparejado obtenido de la API de lugares.
