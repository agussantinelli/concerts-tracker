# Proyecto: Plataforma de Visualización de Conciertos (Concerts Tracker)
## Trabajo Práctico Integrador – Sistemas de Información Geográfica (SIG)

**Universidad Tecnológica Nacional – Facultad Regional Rosario**  
**Carrera:** Ingeniería en Sistemas de Información  
**Cátedra:** Sistemas de Información Geográfica (Materia Electiva)  
**Comisión:** Nº 2EK02  
**Fecha de Entrega:** 29/10/2026  
**Docentes:** Ricagno Andrés, Ascolani Federico  

**Integrantes del Proyecto:**
* **Berrino, Nadia Belén** – Legajo: 55372
* **Boveri, Rafaela** – Legajo: 52077
* **Di Pentima, Maria Felicitas** – Legajo: 53722
* **Santinelli, Agustín** – Legajo: 52211

**Enlaces Principales:**
* **Aplicación Desplegada en Vivo:** [https://agussantinelli.github.io/concerts-tracker/](https://agussantinelli.github.io/concerts-tracker/)
* **Código Fuente (Repositorio GitHub):** [https://github.com/agussantinelli/concerts-tracker](https://github.com/agussantinelli/concerts-tracker)

---

## 1. Introducción

### 1.1 Fundamentos Teóricos de los SIG
Un Sistema de Información Geográfica (SIG) es un conjunto integrado de medios y métodos informáticos diseñado para recoger, gestionar, manipular, analizar y mostrar datos espacialmente referidos a la Tierra. Más allá de concebirse como un simple mapa digital, la esencia de un SIG radica en funcionar como una **base de datos espacial computarizada** que vincula de manera directa la información cartográfica digital con la información atributiva organizada en tablas (Goodchild, 1992; Bracken y Webster, 1989). Esta estructura permite formular consultas geográficas complejas, cruzar variables territoriales y representar los resultados analíticos mediante capas visuales interactivas.

En el siglo XXI, la evolución de las arquitecturas web impulsó la era del *webmapping*, permitiendo la publicación y manipulación de mapas dinámicos directamente en navegadores web. En este paradigma cobra vital importancia la **Información Geográfica Voluntaria (VGI)**, destacándose OpenStreetMap (OSM) como la base de datos cartográfica colaborativa y abierta por excelencia. Asimismo, el ecosistema web adoptó estándares ágiles como GeoJSON (notación de objetos JavaScript para codificar geometrías y atributos) para la interoperabilidad espacial en tiempo real.

### 1.2 Descripción del Problema y Necesidad
La industria musical en vivo y la logística de giras generan un inmenso volumen de datos espaciales. No obstante, esta información suele presentarse al público y a los analistas de manera fragmentada a través de tablas alfanuméricas tradicionales o publicaciones de texto plano. Al carecer de una perspectiva espacial, se desaprovechan las herramientas específicas que ofrece un SIG para el análisis espacial, impidiendo identificar patrones territoriales, concentraciones de eventos y relaciones lógicas entre las variables geográficas. Existe, por lo tanto, una necesidad manifiesta de articular bases de datos temáticas (artistas, fechas, géneros y venta de entradas) con bases de datos espaciales que codifiquen la infraestructura de recintos, salas y estadios urbanos.

### 1.3 Relevancia para Organizaciones y la Sociedad
El desarrollo de este SIG web justifica su impacto beneficiando directamente a dos sectores:
1. **Público General y Fanáticos:** Otorga una herramienta de exploración espacial intuitiva que democratiza el acceso a la información cartográfica de recitales, permitiendo descubrir eventos, ubicar escenarios en la trama urbana y acceder a los canales oficiales de boletaría.
2. **Organizaciones, Productoras y Tour Managers:** Provee un instrumento analítico vital para evaluar la densidad de eventos, la cobertura territorial de las giras musicales y la toma de decisiones logísticas en ciudades estratégicas como Rosario.

---

## 2. Objetivos

### 2.1 Objetivo General
Desarrollar una aplicación web interactiva basada en los principios del *webmapping*, que permita la visualización y el filtrado dinámico de conciertos musicales, integrando bases de datos temáticas de eventos con cartografía digital en un único mapa visual.

### 2.2 Objetivos Específicos
* **Representar la distribución espacial:** Mapear los conciertos y eventos musicales mediante el modelo vectorial, empleando entidades geométricas de puntos definidos por coordenadas precisas (latitud y longitud en formato nativo WGS84 - EPSG: 4326) para describir la localización exacta del evento en la cartografía.
* **Filtrado reactivo cruzado:** Implementar herramientas de consulta que vinculen la cartografía digital con la información atributiva organizada en tablas, permitiendo al usuario realizar de forma simultánea búsquedas sobre la base de datos alfanumérica (artista o fechas) y espacial (recinto).
* **Análisis espacial de giras:** Facilitar la evaluación visual del alcance territorial de los eventos musicales, permitiendo al usuario identificar patrones geográficos y clústeres de ciudades o países visitados, proyectando límites visuales de hasta **9999** kilómetros de cobertura total para evaluar la concentración de recitales en el territorio.

---

## 3. Tipos y Fuentes de Información

El sistema articula capas cartográficas digitales base con fuentes de datos de infraestructura y eventos consumidas en su totalidad mediante servicios web (APIs REST en vivo) y normalizadas en memoria del cliente:

```
┌─────────────────────────────────┐       ┌──────────────────────────────────┐
│  Bandsintown Live REST API      │       │  OpenStreetMap / MusicBrainz API │
│  (Base de Datos Temática:       │       │  (Base de Datos Espacial:        │
│   Giras, Artistas, Fechas)      │       │   40+ Recintos, Estadios, Salas) │
└────────────────┬────────────────┘       └─────────────────┬────────────────┘
                 │                                          │
                 │ JSON en vivo                             │ JSON en vivo
                 ▼                                          ▼
     ┌──────────────────────────────────────────────────────────────┐
     │          Concerts Tracker - Motor de Análisis SIG            │
     │  * Deduplicación de Promesas en Vuelo (In-Flight Promise)    │
     │  * Pipeline de Sanitización y Deduplicación Espacial         │
     │  * Unificación Geodésica por Haversine (Distancia ≤ 650 m)   │
     │  * Normalización Tipológica al Español                       │
     └──────────────────────────────┬───────────────────────────────┘
                                    │
                                    ▼
     ┌──────────────────────────────────────────────────────────────┐
     │              Motor Cartográfico Leaflet                      │
     │  * Mapas Base Raster OpenStreetMap (Web Mercator EPSG: 3857) │
     │  * Marcadores Vectoriales Interactivos con Popups Ricos      │
     │  * Barra Lateral de Filtrado Reactivo Cruzado                │
     └──────────────────────────────────────────────────────────────┘
```

### 3.1 Datos de Mapas Base (Cartografía Raster)
* **Proveedor:** OpenStreetMap (OSM).
* **Naturaleza:** Información Geográfica Voluntaria (VGI), conformada por las aportaciones libres de los usuarios a nivel global.
* **Formato y Proyección:** Cartografía Raster servida mediante teselas XYZ Tiles bajo proyección Web Mercator (EPSG: 3857).
* **Consumo:** Consumo directo mediante peticiones HTTP a servidores de tiles en segundo plano, optimizando el rendimiento de la plataforma sin requerir almacenamiento local pesado.

### 3.2 Datos de Infraestructura Espacial (Estadios, Teatros y Escenarios)
* **Evaluación de Repositorios Gubernamentales Locales:** Se investigó exhaustivamente el catálogo de datos abiertos de la Municipalidad de Rosario (`datosabiertos.rosario.gob.ar` / plataforma DKAN). Dicho repositorio centraliza datasets estáticos en CSV/PDF orientados a polideportivos municipales y clubes de barrio, pero carece de endpoints REST dinámicos con cabeceras CORS para estadios comerciales, anfiteatros y salas de conciertos.
* **Fuente Geográfica Seleccionada (100% APIs en Vivo, 0% Hardcoding):** Servicios web abiertos de OpenStreetMap y MusicBrainz Places API (`https://musicbrainz.org/ws/2/place?query=area:Rosario&fmt=json&limit=100`).
* **Cobertura Espacial:** Consulta en tiempo real filtrada al *bounding box* estricto del Gran Rosario:
  $$\text{Latitud: } [-33.15, -32.80] \quad | \quad \text{Longitud: } [-60.85, -60.55]$$
  Detecta con precisión los recintos clave: Estadio Marcelo Bielsa, Estadio Gigante de Arroyito, Anfiteatro Municipal Humberto de Nito, Hipódromo Independencia, Teatro El Círculo, Teatro Broadway, Teatro La Comedia, Salón Metropolitano, Bioceres Arena, Sala de las Artes, Galpón de las Juventudes, entre más de 40 espacios culturales georreferenciados.
* **Pipeline de Sanitización SIG:** Limpieza algorítmica para depurar entidades espaciales no aptas para recitales masivos (estaciones de bicicletas públicas, paradas de colectivos, canchas auxiliares o predios industriales).
* **Deduplicación Espacial Geodésica:** Fusión espacial de geometrías duplicadas o redundantes a menos de 100 metros de distancia para garantizar la unicidad cartográfica.
* **Normalización Tipológica:** Clasificación determinística de cada recinto en tipologías estandarizadas en español (*Anfiteatro*, *Estadio*, *Teatro*, *Hipódromo / Predio*, *Arena / Salón*, *Galpón Cultural*, *Centro Cultural*).

### 3.3 Datos Temáticos de Eventos Musicales (Conciertos en Vivo y Giras)
* **Evaluación de Alternativas:** Se evaluaron Ticketmaster Discovery API y SeatGeek (descartadas por requerir API keys comerciales y límites estrictos incompatibles con un cliente web abierto) y Wikidata SPARQL (descartada por tiempos de respuesta superiores a 30 segundos).
* **Fuente Seleccionada: Bandsintown Live REST API:** Endpoint REST público con soporte irrestricto de CORS (`Access-Control-Allow-Origin: *`). Permite consultar en tiempo real las fechas confirmadas de las giras de los artistas más convocantes de Argentina (Fito Páez, Ciro y los Persas, Babasónicos, Divididos, WOS, Duki, Tan Biónica, Conociendo Rusia, David Lebón, Pedro Aznar, Dillom, etc.).
* **Validación Temporal Estricta:** La aplicación evalúa la fecha de cada concierto y filtra automáticamente cualquier evento anterior al día de la fecha (`event.date >= today`).
* **Ordenamiento Cronológico Automático:** Ordenamiento ascendente en memoria por fecha para destacar las presentaciones más inmediatas.
* **Atributos Alfanuméricos Extendidos:** Integración de enlaces directos a boleterías oficiales y géneros musicales asociados.

### 3.4 Unificación Espacial Mediante Análisis de Distancia Geodésica (Haversine)
Como proceso fundamental de integración de datos, el sistema implementa un algoritmo de emparejamiento espacial para unificar las múltiples fuentes REST en tiempo real. Cada concierto obtenido de Bandsintown se somete a un análisis de proximidad espacial frente al conjunto de recintos de OpenStreetMap utilizando la fórmula de Haversine:

$$a = \sin^2\left(\frac{\Delta\phi}{2}\right) + \cos(\phi_1)\cos(\phi_2)\sin^2\left(\frac{\Delta\lambda}{2}\right)$$
$$c = 2 \cdot \arctan2\left(\sqrt{a}, \sqrt{1-a}\right)$$
$$d = R \cdot c \quad (R = 6371 \text{ km})$$

Si la distancia geodésica $d \le 650\text{ metros}$ (o si existe correlación semántica directa), el evento temático se vincula unívocamente a la posición exacta y nombre oficial de OpenStreetMap. Esto garantiza que únicamente se rendericen los marcadores autoritativos, erradicando pines duplicados o coordenadas imprecisas.

---

## 4. Metodología (Herramientas y Procesos Implicados)

El proyecto se encuadra en el desarrollo front-end y *webmapping*:

* **Entorno y Dependencias:** Node.js, `pnpm`, **React 19**, **Vite** y **TypeScript** con tipado estático estricto.
* **Motor Cartográfico:** **Leaflet** y `@types/leaflet`, consumido mediante la capa reactiva `react-leaflet`.
* **Proyección Cartográfica y Sistema de Referencia:** Transformación de las coordenadas esféricas nativas WGS84 (EPSG: 4326) hacia la proyección plana **Web Mercator (EPSG: 3857)** utilizada por defecto en Leaflet, estandarizando la visualización sobre mapas raster globales.
* **Diseño Visual y UX:**
  * **Identidad de Marca:** Integración del imagotipo oficial de la aplicación (`logo.png`) en el encabezado principal y *favicon*.
  * **Aesthetica Glassmorphism:** Paleta de colores dark mode (tonos violetas y púrpuras `#8a2be2`, `#a855f7`, fondos con `backdrop-filter: blur(24px)` y bordes translúcidos).
  * **Componente Selector Desplegable:** Dropdown personalizado con recuento en tiempo real (`Todos los Recintos (43)`), etiquetas tipológicas e ícono de selección.
  * **Ventana Emergente (Pop-up) Rediseñada:** Tarjeta modal rica con detalles del concierto, fecha formateada en español (`toLocaleDateString('es-AR')`), enlace a compra de entradas oficiales y scrollbar estilizada alineada contra el borde derecho del contenedor para evitar superposiciones con los botones de acción.
  * **Iconografía Profesional:** Cumplimiento de la directiva de diseño que prohíbe el uso de emojis planos en favor de la biblioteca `react-icons` (FontAwesome).

---

## 5. Integración con Otras Tecnologías

* **Consumo Asíncrono de Geoservicios REST:** Arquitectura cliente-servidor que consulta concurrentemente las fuentes en tiempo real vía `Promise.all`.
* **Deduplicación de Promesas en Vuelo (In-Flight Promise Deduplication):** Mecanismo de sincronización en cliente que previene peticiones duplicadas simultáneas disparadas durante el montaje doble del componente en desarrollo (`React.StrictMode`), mitigando el error HTTP 503 / 429 por límite de peticiones de los servidores externos.
* **Caché de Resiliencia en Memoria:** Ante eventuales micro-cortes de red de las APIs públicas, el sistema retiene en memoria la última respuesta válida en vivo para evitar que el número de recintos colapse temporalmente.
* **Interoperabilidad OGC y Estándares Abiertos:** Manipulación interna basada en esquemas GeoJSON puntuales.
* **Escalabilidad Futura a Bases de Datos Espaciales:** Capacidad de escalar hacia bases de datos relacionales espaciales (**PostgreSQL + PostGIS**) y algoritmos de **Marker Clustering** para admitir más de 9999 entidades a nivel continental.
* **Integración Continua y Despliegue Automatizado (CI/CD):** Pipeline con **GitHub Actions** que compila TypeScript y publica la Single Page Application en **GitHub Pages** con soporte de navegación por `HashRouter`.

---

## 6. Resultados (Entregables Alcanzados)

1. **Plataforma Web Activa (SPA):** Aplicación de acceso público y responsive montada en GitHub Pages ([https://agussantinelli.github.io/concerts-tracker/](https://agussantinelli.github.io/concerts-tracker/)).
2. **Mapa Interactivo con Unificación Geodésica:** Renderizado de la cartografía base de OpenStreetMap con pines unificados por Haversine y pop-ups interactivos.
3. **Panel Lateral de Filtrado Reactivo:**
   * Buscador textual reactivo por nombre de banda o solista.
   * Selector espacial con tipologías y recuento en vivo de los recintos de la ciudad.
   * Tarjetas informativas con fechas cronológicas estrictas.
   * Funcionalidad **"Ver en mapa"** que ejecuta un `flyTo` hacia la coordenada vectorial exacta y despliega el pop-up de forma automática.
4. **Logotipo Oficial Integrado:** Reemplazo de iconos genéricos por el isotipo oficial del proyecto en la cabecera.

---

## 7. Vinculación con las Competencias del Ingeniero en Sistemas de Información

El desarrollo de "Concerts Tracker" pone en práctica competencias centrales del perfil del Ingeniero en Sistemas de Información:
* **Arquitectura de Software Web y Geoservicios:** Concepción e implementación de arquitecturas front-end reactivas capaces de orquestar múltiples geoservicios y APIs heterogéneas en tiempo real.
* **Ciencia de Datos Espaciales:** Habilidad para recolectar, sanear, transformar, validar y representar datos territoriales no estructurados, aplicando formulaciones matemáticas de geodesia (Haversine) y transformaciones de proyecciones cartográficas (WGS84 a Web Mercator).
* **Evaluación Crítica y Selección Tecnológica:** Capacidad de auditar alternativas disponibles (descartando opciones cerradas o estáticas como catálogos DKAN en favor de infraestructuras abiertas y colaborativas como OSM y Bandsintown).
* **Calidad de Software y CI/CD:** Implementación de pipelines automatizados de construcción y despliegue continuo con tipado estático riguroso.

---

## 8. Discusión y Conclusión

El proyecto "Concerts Tracker" demuestra de manera contundente la viabilidad y las ventajas de integrar herramientas de Sistemas de Información Geográfica (SIG) dentro de ecosistemas web modernos. Al trascender los límites de los programas SIG de escritorio tradicionales y adoptar el paradigma del *webmapping*, la plataforma democratiza el acceso a la información territorial en un dominio de consumo masivo como la música en vivo.

La implementación exitosa del algoritmo geodésico de Haversine y el consumo 100% dinámico de APIs en tiempo real evidencian que el sistema funciona como una auténtica base de datos espacial computarizada. Al resolver la fragmentación de los listados alfanuméricos tradicionales y presentar la información en un mapa visual unificado, se facilita tanto la experiencia del espectador como la planificación logística de las productoras culturales.

---

## 9. Enlaces y Referencias

* **Aplicación en Producción:** [https://agussantinelli.github.io/concerts-tracker/](https://agussantinelli.github.io/concerts-tracker/)
* **Repositorio de Código:** [https://github.com/agussantinelli/concerts-tracker](https://github.com/agussantinelli/concerts-tracker)

### Referencias Bibliográficas
1. **Goodchild, M. F.** (1992). *Geographical information science*. International Journal of Geographical Information Systems, 6(1), 31-45.
2. **Bracken, I., & Webster, C.** (1989). *Information Technology in Geography and Planning*. Routledge.
3. **Open Geospatial Consortium (OGC).** *OpenGIS Implementation Standard for Geographic information - Simple feature access*.
4. **OpenStreetMap Foundation.** *OpenStreetMap Cartographic Data and API Specifications*.
5. **Leaflet JS.** *An open-source JavaScript library for mobile-friendly interactive maps*.
