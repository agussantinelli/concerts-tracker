# Proposal: Plataforma de Visualización de Conciertos (Concerts Tracker)

A continuación, se detalla la propuesta del Trabajo Práctico Integrador, adaptada a la nueva temática sobre visualización geográfica de conciertos. *(Nota: Todas las decisiones arquitectónicas e incógnitas iniciales ya han sido definidas y aplicadas al proyecto).*

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
* **Filtrado y Visualización Reactiva:** El procesamiento no se hará en QGIS, sino de manera íntegra en el cliente web mediante un panel lateral de control. Se construyó un sistema de filtrado reactivo en tiempo real que permite cruzar simultáneamente criterios por atributos (búsqueda libre por nombre de banda/artista) y espaciales (desplegable para filtrar por recinto o venue). El mapa responde dinámicamente ocultando o mostrando los marcadores según las coincidencias.

---

## 5. Integración con otras tecnologías
A diferencia de un SIG de escritorio tradicional, este proyecto ya nace como una plataforma web integrada:
* **APIs Web (Diferido):** La integración directa con proveedores de datos vía REST (fetch/Axios) se ha planteado como un objetivo a futuro, utilizando datos estáticos en la fase inicial.
* **Despliegue Continuo (CI/CD):** La aplicación cuenta con un flujo de trabajo (Workflow) de GitHub Actions para compilación y despliegue automatizado en GitHub Pages mediante `HashRouter`.
* **Almacenamiento y Persistencia (Sin BDD):** Para la versión actual, se ha decidido no emplear una base de datos externa ni un backend. Todo el conjunto de marcadores y eventos operará directamente en memoria a partir de arreglos en el frontend. En el futuro, la arquitectura podría evolucionar hacia el uso de motores como **PostgreSQL + PostGIS** si los requerimientos de persistencia lo exigen.

---

## 6. Resultados (Entregables Alcanzados y Esperados)
* **Frontend SPA Funcional:** Aplicación web responsiva desarrollada con React, Vite y TypeScript, enrutada vía `HashRouter`.
* **Mapa Interactivo:** Integración de Leaflet sobre OpenStreetMap, acompañado de un panel lateral (sidebar) glassmorphism con filtros simultáneos por Artista y Recinto.
* **Despliegue en la Nube:** Proyecto montado y público en GitHub Pages de forma automatizada.
* **Pendiente:** Implementación de *Marker Clustering* para agrupar visualmente la densidad de conciertos cuando el volumen de datos escale.

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
