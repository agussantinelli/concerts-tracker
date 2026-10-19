# Proposal: Plataforma de Visualización de Conciertos (Concerts Tracker)

**Universidad Tecnológica Nacional – Facultad Regional Rosario**  
**Cátedra:** Sistemas de Información Geográfica (SIG) – Comisión 2EK02    
**Enlace al proyecto en vivo:** [https://agussantinelli.github.io/concerts-tracker/](https://agussantinelli.github.io/concerts-tracker/)

---

## 1. Introducción
**Descripción del problema/necesidad:**  
Un Sistema de Información Geográfica (SIG) es un conjunto integrado de medios y métodos informáticos diseñado para recoger, gestionar, manipular, analizar y mostrar datos espacialmente referidos a la Tierra (Goodchild; Bracken y Webster). Su valor diferencial radica en funcionar como una base de datos espacial computarizada que vincula la información cartográfica digital con la información atributiva u organizada en tablas.

En la actualidad, la industria de la música en vivo y la logística de giras generan un volumen masivo de datos territoriales. No obstante, los fanáticos y analistas suelen recibir esta información de manera fragmentada en formato de texto plano o listados alfanuméricos tradicionales. Al carecer de una perspectiva espacial, se desaprovechan las herramientas específicas del análisis espacial para identificar patrones y relaciones lógicas entre variables geográficas. Existe, por ende, una necesidad concreta de articular bases de datos temáticas (artistas, fechas, géneros) con bases de datos espaciales que codifiquen la localización de los recintos y escenarios.

**Relevancia para organizaciones o la sociedad:**  
Este SIG web beneficia a los usuarios finales (fans) al brindarles una herramienta de exploración interactiva con filtros cruzados, y a productores y *tour managers* para evaluar la densidad de eventos, la cobertura territorial de giras y la planificación logística en ciudades estratégicas como Rosario.

---

## 2. Objetivos
**Objetivo General:**  
Desarrollar una aplicación web interactiva basada en el paradigma del *webmapping*, que permita la visualización geográfica y el filtrado dinámico de conciertos musicales, integrando bases de datos temáticas de eventos con cartografía digital en un único mapa visual.

**Objetivos Específicos:**
* **Representar la distribución espacial:** Mapear los conciertos y escenarios mediante el modelo vectorial, empleando entidades geométricas de puntos definidos por coordenadas precisas (latitud y longitud en WGS84) para describir la localización exacta del evento.
* **Filtrado reactivo cruzado:** Implementar herramientas de consulta que vinculen en tiempo real la base de datos alfanumérica (artista, fechas, género) y la base de datos espacial (recinto, localización).
* **Análisis espacial de giras:** Facilitar el análisis visual del alcance territorial de artistas a nivel local, regional o global, permitiendo proyectar límites de cobertura geográfica de hasta 9999 kilómetros y evaluar la concentración de recitales en el territorio.

---

## 3. Tipos y Fuentes de Información
El sistema articula capas cartográficas digitales base con fuentes de datos de infraestructura y eventos consumidas mediante servicios web (APIs REST) y normalizadas a formatos espaciales legibles por el motor de renderizado:

* **Datos de Mapas Base (Cartografía):**
  * **Fuente:** OpenStreetMap (OSM).
  * **Tipo:** Raster (XYZ Tiles) bajo proyección Web Mercator (EPSG: 3857).
  * **Naturaleza:** Información Geográfica Voluntaria (VGI), aportada de forma libre y colaborativa por la comunidad global, consumida como servicio web continuo para optimizar el rendimiento sin requerir almacenamiento local.

* **Datos de Infraestructura (Estadios, Teatros y Escenarios de Rosario):**
  * **Evaluación de Datos Abiertos Locales:** Se investigó exhaustivamente el catálogo del portal oficial de la Municipalidad de Rosario (`datosabiertos.rosario.gob.ar` / `datos.rosario.gob.ar`). Dicho portal centraliza datasets estáticos (CSV/PDF) orientados a infraestructura deportiva pública y clubes barriales en plataforma DKAN, pero carece de un endpoint REST dinámico con soporte de CORS para estadios comerciales y salas de recitales.
  * **Fuente Geográfica Seleccionada:** **OpenStreetMap (OSM)** consumido en tiempo real mediante el motor de geocodificación abierto Photon/OSM.
    * *Acceso y Cobertura:* Peticiones simultáneas filtradas al bounding box del Gran Rosario (`[-33.15, -32.80, -60.85, -60.55]`). Identifica con precisión milimétrica los estadios (Estadio Marcelo Bielsa, Estadio Gigante de Arroyito, Estadio Dr. Claudio L. Newell), anfiteatros (Anfiteatro Municipal Humberto de Nito), teatros (El Círculo, Broadway, La Comedia, Vorterix, Mateo Booz), predios masivos (Hipódromo Independencia) y salas cerradas (Salón Metropolitano, Bioceres Arena).
    * *Tratamiento y Sanitización SIG:* Se implementó un pipeline de limpieza algorítmica para depurar entidades espaciales no aptas: descarte de estaciones de bicicletas públicas (ej. "30 - Estadio Municipal"), paradas de transporte público, canchas auxiliares de entrenamiento barrial y polígonos de parques industriales.
    * *Deduplicación Espacial:* Fusión geodésica de geometrías redundantes a menos de 100 metros de distancia para garantizar unicidad cartográfica.

* **Datos Temáticos de Eventos Musicales (Conciertos en Vivo y Giras):**
  * **Evaluación de Alternativas de APIs de Eventos:**
    * *Ticketmaster Discovery API & SeatGeek:* Evaluadas técnicamente; ofrecen catálogo comercial pero exigen credenciales privadas (`apikey` / `client_id`) con límites de cuota cerrados, incompatibles con una arquitectura abierta en cliente.
    * *Wikidata SPARQL:* Se testeó la consulta semántica de instancias de festivales (`Q18608583`); sin embargo, los tiempos de procesamiento exceden los 30 segundos, degradando la experiencia interactiva.
    * *MusicBrainz Events API:* Provee registros históricos valiosos pero con escasa cobertura de fechas futuras de giras vivas.
  * **Fuente Temática Seleccionada: Bandsintown Live REST API:**
    * *Servicio:* Endpoint REST público con soporte irrestricto de CORS (`Access-Control-Allow-Origin: *`). Permite consultar en tiempo real las fechas oficiales y confirmadas de giras de artistas consagrados del rock, pop, trap y música nacional en Argentina (Fito Páez, Ciro y los Persas, Tan Biónica, Babasónicos, Bandalos Chinos, David Lebón, Pedro Aznar, Dillom, etc.).
    * *Validación Temporal Estricta:* El sistema filtra automáticamente cualquier concierto anterior, mostrando única y permanentemente los recitales programados en el día de la fecha o posteriores (`event.date >= today`).
    * *Ordenamiento Cronológico Automático:* Ordenamiento ascendente inmediato por fecha en memoria.
    * *Enlace de Boletaría Oficial:* Atributo alfanumérico que provee enlace directo de compra de entradas oficiales.

* **Unificación Espacial Mediante Análisis de Distancia Geodésica (Haversine):**
  * Cada concierto obtenido en tiempo real desde Bandsintown se somete a un algoritmo de proximidad espacial frente al conjunto de recintos de OpenStreetMap:
    $$\Delta\sigma = 2 \arcsin \left(\sqrt{\sin^2\left(\frac{\Delta\phi}{2}\right) + \cos(\phi_1)\cos(\phi_2)\sin^2\left(\frac{\Delta\lambda}{2}\right)}\right)$$
  * Si la distancia geodésica entre el concierto y un recinto de OpenStreetMap es pequeña ($\le 600$ metros, como la coincidencia de 3.5m entre Tan Biónica y el Estadio Marcelo Bielsa, o 10m en el Anfiteatro Municipal), el evento se vincula unívocamente a la posición exacta y nombre oficial de OpenStreetMap. Esto asegura que en la cartografía únicamente se rendericen los marcadores autoritativos de OSM, erradicando pines duplicados.

---

## 4. Metodología (Herramientas y Procesos Implicados)
El flujo de trabajo se orienta al desarrollo front-end moderno y *webmapping*:

* **Entorno y Stack:** Node.js con gestor de paquetes `pnpm`, **React 19** con **Vite** y **TypeScript** para un tipado estático robusto, y **Leaflet** (`react-leaflet`) como motor cartográfico.
* **Proyección Cartográfica y Sistema de Referencia:** Para resolver la imposibilidad geométrica de proyectar el elipsoide terrestre sobre un plano sin deformaciones, la aplicación adopta **Web Mercator (EPSG: 3857)** como proyección planar estándar de visualización web, realizando la transformación sobre las coordenadas esferoidales nativas WGS84 (EPSG: 4326).
* **Diseño de Interfaz y Componentes React:** Se construyó un selector desplegable personalizado con estética *glassmorphism* oscura (desenfoque de fondo de 16px, scrollbar violeta estilizada, etiquetas tipológicas por recinto y cierre reactivo por eventos del DOM), reemplazando los componentes nativos estándar del navegador para ofrecer una experiencia visual de alta gama.
* **Filtrado y Procesamiento Reactivo en Cliente:** A diferencia de software de escritorio tradicional (ej. QGIS), el procesamiento se ejecuta en el navegador. Se diseñó un panel lateral que interroga las entidades en memoria, permitiendo búsquedas textuales por artista y filtrado por recintos, actualizando de forma reactiva la visibilidad de los marcadores en el mapa.

---

## 5. Integración con otras tecnologías
* **Geoservicios y Consumo Multi-API REST:** Arquitectura cliente-servidor HTTP asíncrona (`Promise.all`) que interroga en paralelo geoservicios de OpenStreetMap y la API de eventos de Bandsintown, normalizando las respuestas en memoria hacia colecciones GeoJSON puntuales.
* **Interoperabilidad OGC:** La plataforma se alinea con las pautas del Open Geospatial Consortium (OGC) para el intercambio ágil de información geográfica basada en estándares abiertos.
* **Persistencia Espacial Futura:** La solución actual está optimizada para renderizar con fluidez hasta 9999 entidades en memoria. En etapas posteriores con concurrencia masiva, la arquitectura contempla persistencia en bases de datos espaciales relacionales objeto-relacionales (**PostgreSQL + PostGIS**).
* **Despliegue Continuo (CI/CD):** Flujo automatizado con GitHub Actions que compila el código TypeScript y despliega la SPA en GitHub Pages bajo `HashRouter`.

---

## 6. Resultados (Entregables Alcanzados y Esperados)
* **SPA Funcional:** Aplicación responsiva en producción pública en GitHub Pages con 0% hardcoding.
* **Mapa Interactivo:** Integración de Leaflet sobre OpenStreetMap con marcadores vectoriales oficiales, ventanas emergentes (*popups*) enriquecidas y enlaces a entradas oficiales.
* **Filtros Reactivos:** Búsqueda en vivo por artista y selector desplegable de recintos con indicación tipológica y orden cronológico estricto de próximos recitales.
* **Entregable Pendiente (Marker Clustering):** Implementación de algoritmos de agrupamiento de marcadores para optimizar la visualización en escalas cartográficas menores.

---

## 7. Discusión y Conclusión
"Concerts Tracker" demuestra la eficacia del *webmapping* para democratizar el acceso a información territorial. Al estructurar los eventos bajo el modelo vectorial de puntos y articular fuentes abiertas colaborativas (OpenStreetMap y Bandsintown) mediante análisis de proximidad geodésica, el sistema trasciende el concepto de un mapa estático y se consolida como un SIG interactivo, moderno y libre de software propietario.

---

## 8. Vinculación con las competencias del Ingeniero en Sistemas de Información
* **Arquitectura de Software Web:** Diseño de aplicaciones reactivas que consumen geoservicios y APIs de terceros.
* **Ciencia de Datos Espaciales:** Capacidad para estructurar, georreferenciar y transformar datos alfanuméricos crudos en información cartográfica interactiva.
* **Investigación y Selección Tecnológica:** Evaluación crítica de repositorios abiertos (portal municipal DKAN vs. APIs de datos abiertos colaborativos como MusicBrainz).
