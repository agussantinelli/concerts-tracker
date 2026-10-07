# Proposal: Plataforma de Visualización de Conciertos (Concerts Tracker)

A continuación, se detalla la propuesta del Trabajo Práctico Integrador, adaptada a la nueva temática sobre visualización geográfica de conciertos. Se destacan explícitamente las **incógnitas que aún deben definirse** en esta etapa de planificación.

---

## 1. Introducción
**Descripción del problema/necesidad:** 
Los fanáticos de la música y los analistas de la industria suelen tener dificultades para visualizar de forma clara y unificada el alcance geográfico de las giras musicales o encontrar conciertos cercanos de sus bandas favoritas. La información suele estar fragmentada en formato de texto plano o listas, sin una representación espacial que facilite la toma de decisiones (por ejemplo, planificar viajes para asistir a un evento) o el análisis del alcance de un artista.

**Relevancia para organizaciones o la sociedad:** 
Este Sistema de Información Geográfica (SIG) web beneficiará tanto a usuarios finales (fans) que desean explorar eventos en un mapa interactivo con filtros, como potencialmente a agencias de promoción y *tour managers* para analizar la cobertura geográfica y la densidad de eventos en diferentes regiones o ciudades.

---

## 2. Objetivos
**Objetivo General:** 
Desarrollar una aplicación web interactiva que permita la visualización espacial y el filtrado de conciertos musicales en tiempo real o histórico, integrando datos de proveedores de eventos con mapas dinámicos.

**Objetivos Específicos:**
* Mapear la distribución espacial de los conciertos y eventos musicales.
* Permitir el filtrado dinámico de eventos por artista/banda, rango de fechas y ubicación geográfica.
* Analizar de forma visual el alcance a nivel geográfico de una banda (ej. ciudades o países visitados en una gira).

---

## 3. Tipos y Fuentes de Información
En este apartado se utilizarán datos dinámicos consumidos mediante servicios web (APIs), los cuales se traducirán a formatos espaciales legibles por el mapa (ej. GeoJSON o marcadores de latitud/longitud).

* **Datos de Mapas Base:** OpenStreetMap (OSM) será utilizado como la cartografía base de la plataforma.
* **Datos de Eventos Musicales:** 
  Para esta primera etapa, la información de los conciertos (artista, recinto, coordenadas, fecha) se implementará de manera estática (hardcodeada) mediante arreglos dentro del código fuente. Se pospone la integración de APIs externas para iteraciones posteriores.

---

## 4. Metodología (Herramientas y Procesos Implicados)
El flujo de trabajo estará orientado al desarrollo de software y consumo de servicios (frontend y web mapping).

* **Desarrollo del Entorno:** Se utilizará un stack basado en Node.js, gestor de paquetes `pnpm`, **React** (creado con Vite) para la interfaz de usuario, y **Leaflet** (`react-leaflet`) para el motor de renderizado del mapa.
* **Proyección Cartográfica:** Se empleará el sistema de proyección por defecto de Leaflet, **Web Mercator (EPSG: 3857)**. Se adoptó esta opción por practicidad, comodidad y por ser el estándar predominante en los ecosistemas de mapas interactivos web.
* **Geoprocesamiento y Filtrado:** El análisis no se hará en QGIS, sino en el cliente web. Se implementarán filtros por atributos (nombre de la banda) y espaciales (eventos dentro de un *bounding box* de la vista actual del mapa o dentro de un radio de influencia).

---

## 5. Integración con otras tecnologías
A diferencia de un SIG de escritorio tradicional, este proyecto ya nace como una plataforma web integrada:
* **APIs Web:** Integración directa con proveedores de datos de terceros vía REST (fetch/Axios).
* **Almacenamiento y Persistencia (Sin BDD):** Para la versión actual, se ha decidido no emplear una base de datos externa ni un backend. Todo el conjunto de marcadores y eventos operará directamente en memoria a partir de arreglos en el frontend. En el futuro, la arquitectura podría evolucionar hacia el uso de motores como **PostgreSQL + PostGIS** si los requerimientos de persistencia lo exigen.

---

## 6. Resultados (Entregables Esperados)
* Una aplicación web (SPA - Single Page Application) funcional.
* Mapas interactivos que exhiban marcadores de eventos en base a las búsquedas.
* Elementos visuales que agrupen la densidad de conciertos (ej. *Marker Clustering*) si hay muchos eventos en una misma ciudad.
* Interfaz intuitiva para ingresar parámetros de búsqueda.

---

## 7. Discusión y/o Conclusión
El proyecto demostrará la viabilidad y las ventajas de integrar herramientas SIG de código abierto (OpenStreetMap, Leaflet) dentro de ecosistemas de desarrollo web modernos (React). Se concluirá cómo la representación geoespacial aporta un valor agregado sustancial a los datos tabulares tradicionales de eventos, mejorando la experiencia del usuario y facilitando la percepción del alcance territorial de la industria musical.

---

## 8. Vinculación con las competencias del Ingeniero en Sistemas de Información
Este proyecto potencia habilidades centrales de la carrera y el rol del ingeniero moderno:
* **Desarrollo de Software y Arquitectura Web:** Diseño e implementación de sistemas interactivos que consumen servicios de terceros.
* **Integración de Tecnologías:** Capacidad para combinar herramientas de mapeo (SIG web) con programación front-end.
* **Resolución de problemas de la información:** Transformar grandes volúmenes de datos crudos (JSONs de APIs) en información visual, interactiva y estructurada que asista en la toma de decisiones o mejore la experiencia final de un usuario.
* **Investigación y Toma de Decisiones Técnicas:** Evaluación activa de proveedores de datos (APIs) y estándares tecnológicos (proyecciones cartográficas EPSG).
