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

* **Datos de Infraestructura (Estadios, Teatros y Escenarios):**
  * **Evaluación de Datos Abiertos Locales:** Se investigó el catálogo del portal oficial de la Municipalidad de Rosario (`datosabiertos.rosario.gob.ar` / `datos.rosario.gob.ar`). Dicho portal centraliza datasets estáticos (CSV/PDF) orientados a infraestructura deportiva pública y clubes barriales en plataforma DKAN, pero carece actualmente de un endpoint REST dinámico con soporte de CORS para estadios comerciales y salas de recitales.
  * **Fuente Primaria Seleccionada:** **MusicBrainz Places API** (MetaBrainz Foundation).
    * *Acceso:* Servicio web REST abierto (`https://musicbrainz.org/ws/2/place?query=area:Rosario&fmt=json`).
    * *Formato y Tipo:* Vectorial puntual en JSON. Provee nombre del recinto, dirección catastral, tipología (Estadio, Arena, Anfiteatro, Concert Hall, Club) y coordenadas geodésicas oficiales (`latitude`, `longitude` en EPSG:4326).
  * **Fuente Secundaria / Validación SIG:** **OpenStreetMap Nominatim / Overpass API**, empleada para validación de geometrías de equipamiento cultural y recreativo (`amenity=theatre`, `leisure=stadium`).

* **Datos Temáticos de Eventos Musicales (Conciertos en Vivo y Giras):**
  * **Evaluación de Múltiples APIs de Eventos:**
    * *Ticketmaster Discovery API & SeatGeek:* Evaluadas técnicamente; ofrecen catálogo comercial pero requieren credenciales de desarrollador cerradas (`apikey` / `client_id`) con límites de cuota restringidos para entornos académicos abiertos.
    * *Wikidata SPARQL:* Se testeó la consulta semántica de instancias de festivales (`Q18608583`, `Q1656682`) en Argentina; no obstante, el tiempo de respuesta del motor SPARQL excede los 30 segundos, resultando inadecuado para búsquedas interactivas en el cliente.
    * *Portal Municipal Rosario:* Carece de feed abierto de recitales en vivo.
  * **Solución Multi-API en Tiempo Real Integrada:**
    1. **Bandsintown REST API:** Servicio web abierto con soporte directo de CORS (`Access-Control-Allow-Origin: *`). Permite interrogar en tiempo real las fechas confirmadas de giras activas de artistas clave del rock, pop, trap y música nacional en Argentina y Rosario. Cada evento provee atributos alfanuméricos (título del tour, fecha en ISO 8601, enlaces de boletaría oficial) y atributos espaciales nativos (`latitude`, `longitude` del recinto).
    2. **MusicBrainz Events API:** Servicio abierto de la MetaBrainz Foundation (`/ws/2/event?query=Rosario`). Aporta registros históricos y contemporáneos de conciertos comunitarios documentados en los principales recintos de la ciudad.
  * **Vinculación Espacial Dinámica:** Los registros provenientes de ambas APIs se combinan, deduplican y normalizan en tiempo real en el cliente. Si un evento de Bandsintown introduce un nuevo recinto con geocoordenadas verificadas en Rosario (ej. predios de festivales o clubes independientes), el sistema lo georreferencia dinámicamente como un nuevo nodo puntual en el mapa.

---

## 4. Metodología (Herramientas y Procesos Implicados)
El flujo de trabajo se orienta al desarrollo front-end moderno y *webmapping*:

* **Entorno y Stack:** Node.js con gestor de paquetes `pnpm`, **React 19** con **Vite** y **TypeScript** para un tipado estático robusto, y **Leaflet** (`react-leaflet`) como motor cartográfico.
* **Proyección Cartográfica y Sistema de Referencia:** Para resolver la imposibilidad geométrica de proyectar el elipsoide terrestre sobre un plano sin deformaciones, la aplicación adopta **Web Mercator (EPSG: 3857)** como proyección planar estándar de visualización web, realizando la transformación sobre las coordenadas esferoidales nativas WGS84 (EPSG: 4326).
* **Filtrado y Procesamiento Reactivo en Cliente:** A diferencia de software de escritorio tradicional (ej. QGIS), el procesamiento se ejecuta en el navegador. Se diseñó un panel lateral *glassmorphism* que interroga las entidades en memoria, permitiendo búsquedas textuales por atributos y filtrado por recintos, actualizando de forma reactiva la visibilidad de los marcadores en el mapa.

---

## 5. Integración con otras tecnologías
* **Geoservicios y Consumo Multi-API REST:** La arquitectura opera mediante un esquema cliente-servidor HTTP asíncrono y resiliente. El cliente web realiza peticiones simultáneas (`Promise.all`) a OpenStreetMap Nominatim, MusicBrainz Places, Bandsintown Live API y MusicBrainz Events API, normalizando las respuestas en memoria hacia estructuras análogas a colecciones GeoJSON (`FeatureCollection` de puntos con propiedades temáticas).
* **Interoperabilidad OGC:** La plataforma se alinea con las pautas del Open Geospatial Consortium (OGC) para el intercambio ágil de información geográfica basada en estándares abiertos.
* **Persistencia Espacial Futura:** La solución actual está optimizada para renderizar con fluidez hasta 9999 entidades en memoria. En etapas posteriores con concurrencia masiva, la arquitectura contempla persistencia en bases de datos espaciales relacionales objeto-relacionales (**PostgreSQL + PostGIS**).
* **Despliegue Continuo (CI/CD):** Flujo automatizado con GitHub Actions que compila el código TypeScript y despliega la SPA en GitHub Pages bajo `HashRouter`.

---

## 6. Resultados (Entregables Alcanzados y Esperados)
* **SPA Funcional:** Aplicación responsiva en producción pública en GitHub Pages.
* **Mapa Interactivo:** Integración de Leaflet sobre OpenStreetMap con marcadores vectoriales personalizados y ventanas emergentes (*popups*) con el detalle de eventos y venta de entradas.
* **Filtros Simultáneos:** Panel de control para consultas espaciales y temáticas en tiempo real.
* **Entregable Pendiente (Marker Clustering):** Implementación de algoritmos de agrupamiento de marcadores para optimizar la visualización en escalas cartográficas menores (visión global o regional con menor nivel de detalle).

---

## 7. Discusión y Conclusión
"Concerts Tracker" demuestra la eficacia del *webmapping* para democratizar el acceso a información territorial. Al estructurar los eventos bajo el modelo vectorial de puntos, el sistema trasciende el concepto de un mapa estático y se consolida como una base de datos espacial interactiva. La integración de fuentes abiertas colaborativas (OpenStreetMap, MusicBrainz, Setlist.fm) valida la viabilidad de construir soluciones SIG interoperables, modernas y sostenibles sin depender de software propietario.

---

## 8. Vinculación con las competencias del Ingeniero en Sistemas de Información
* **Arquitectura de Software Web:** Diseño de aplicaciones reactivas que consumen geoservicios y APIs de terceros.
* **Ciencia de Datos Espaciales:** Capacidad para estructurar, georreferenciar y transformar datos alfanuméricos crudos en información cartográfica interactiva.
* **Investigación y Selección Tecnológica:** Evaluación crítica de repositorios abiertos (portal municipal DKAN vs. APIs de datos abiertos colaborativos como MusicBrainz).
