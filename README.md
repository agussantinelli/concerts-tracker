<h1 align="center">🎵 Concerts Tracker - Web de Eventos Musicales</h1>

<p align="center">
  <img src="public/logo.png" alt="Concerts Tracker Logo" width="200" height="200">
</p>

<div align="center">
    <a href="https://agussantinelli.github.io/concerts-tracker" target="_blank"> 
         <img src="https://img.shields.io/badge/Live-Page-blue?style=for-the-badge&logo=react&logoColor=white" />
    </a>
    <a href="https://github.com/agussantinelli/concerts-tracker" target="_blank" style="text-decoration: none;">
        <img src="https://img.shields.io/badge/💻%20Repo%20Principal-Concerts_Tracker-0b7285?style=for-the-badge&logo=github&logoColor=white" alt="Repo Concerts Tracker"/>
    </a>
    <br>
    <a href="https://drive.google.com/drive/folders/1aye4ekfo-Qra4-uXi6-KdhUuStWTFLUX?usp=sharing" target="_blank" style="text-decoration: none;">
        <img src="https://img.shields.io/badge/📄%20Documentación%20Completa-Google%20Drive-34a853?style=for-the-badge&logo=googledrive&logoColor=white" alt="Docs Drive"/>
    </a>

</div>

<br>

<p align="center">
    <img src="https://img.shields.io/badge/React-19.3.0-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React Badge"/>
    <img src="https://img.shields.io/badge/TypeScript-5.7-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript Badge"/>
    <img src="https://img.shields.io/badge/Vite-5.4.21-B73BFE?style=for-the-badge&logo=vite&logoColor=FFD62E" alt="Vite Badge"/>
    <img src="https://img.shields.io/badge/Leaflet-1.9.4-199900?style=for-the-badge&logo=leaflet&logoColor=white" alt="Leaflet Badge"/>
    <img src="https://img.shields.io/badge/pnpm-10.30.3-F69220?style=for-the-badge&logo=pnpm&logoColor=white" alt="pnpm Badge"/>
    <img src="https://img.shields.io/badge/Node.js-22.11.0-43853D?style=for-the-badge&logo=node.js&logoColor=white" alt="Node.js Badge"/>
    <img src="https://img.shields.io/badge/React_Router-7.18.4-CA4245?style=for-the-badge&logo=reactrouter&logoColor=white" alt="React Router Badge"/>
    <img src="https://img.shields.io/badge/React_Icons-5.7.0-E91E63?style=for-the-badge&logo=react&logoColor=white" alt="React Icons Badge"/>
</p>
<p align="center">
    <img src="https://img.shields.io/badge/OpenStreetMap-Cartografía_y_Tiles-7EBC6F?style=for-the-badge&logo=openstreetmap&logoColor=white" alt="OpenStreetMap Badge"/>
    <img src="https://img.shields.io/badge/Bandsintown-Live_Concerts_API-00B4D8?style=for-the-badge&logo=bandsintown&logoColor=white" alt="Bandsintown Badge"/>
</p>
<div align="center">
  <img src="https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge&logo=opensourceinitiative&logoColor=white" alt="MIT License"/>
</div>
<hr>

<h2>🎯 Objetivo y Alcance</h2>

<p>
    <strong>Concerts Tracker</strong> es un Sistema de Información Geográfica (SIG) web, 
    desarrollado en React y Leaflet, diseñado para permitir visualizar y analizar de forma unificada 
    la distribución espacial de conciertos y el alcance geográfico de las giras de bandas musicales.
</p>

<p>
    El sistema aborda la problemática de la información dispersa en formato de listas, brindando una herramienta que permite
    el filtrado dinámico (por artista, ubicación, fechas) con interacción fluida sobre mapas de <strong>OpenStreetMap</strong>.
</p>

<ul>
    <li><strong>Visualización de Eventos</strong>: Mapeo geográfico de conciertos consumidos desde APIs de terceros.</li>
    <li><strong>Filtrado Dinámico</strong>: Búsquedas por atributos de la banda o de manera espacial (radio de influencia y bounding box).</li>
    <li><strong>Análisis de Alcance</strong>: Representación visual de giras y recorridos de diferentes artistas a nivel global o regional.</li>
</ul>

<hr>

<h2>⚙️ Stack Tecnológico</h2>

 <table>
  <thead>
   <tr>
    <th>Componente</th>
    <th>Tecnología</th>
    <th>Versión / Detalles</th>
   </tr>
  </thead>
  <tbody>
   <tr>
    <td><strong>Frontend Web</strong></td>
    <td>React + Vite + TypeScript</td>
    <td>React v19, Vite v5 con tipado estático fuerte.</td>
   </tr>
   <tr>
    <td><strong>Enrutamiento y UI</strong></td>
    <td>React Router + React Icons</td>
    <td>Navegación SPA y librería estándar de SVG.</td>
   </tr>
   <tr>
    <td><strong>Gestor de Paquetes</strong></td>
    <td>pnpm</td>
    <td>v10.30+ (Instalación rápida y eficiente)</td>
   </tr>
   <tr>
    <td><strong>Mapas y Motor SIG</strong></td>
    <td>Leaflet (React-Leaflet)</td>
    <td>Renderizado de cartografía base y capas.</td>
   </tr>
   <tr>
    <td><strong>Consumo de Datos (APIs en Vivo)</strong></td>
    <td>OpenStreetMap / MusicBrainz Places API + Bandsintown Live REST API</td>
    <td>Arquitectura multi-API REST en tiempo real (0% hardcoding). Unificación espacial por distancia geodésica (Haversine &le; 650m), deduplicación de promesas en vuelo, filtro estricto de fechas a partir de hoy y enlaces a boletaría oficial.</td>
   </tr>
   <tr>
    <td><strong>Despliegue Continuo (CI/CD)</strong></td>
    <td>GitHub Actions + GitHub Pages</td>
    <td>Pipeline automatizado para el despliegue del proyecto al hacer push.</td>
   </tr>
  </tbody>
 </table>

<hr>

<h2>🏗️ Arquitectura de la Solución</h2>

 <p>Concerts Tracker sigue una arquitectura de <strong>Single Page Application (SPA)</strong> con un fuerte enfoque en el procesamiento de datos geográficos desde el cliente sin almacenamiento estático:</p>

 <ul>
     <li><strong>Capa de Presentación (UI):</strong>
         <ul>
             <li>Desarrollada íntegramente con componentes funcionales de React 19 y estilos Vanilla CSS modernos.</li>
             <li>Selector desplegable personalizado con estética <em>glassmorphism</em> (desenfoque de 16px, etiquetas tipológicas de recinto y scrollbar estilizada).</li>
             <li>Renderizado ultrarrápido apoyado por la herramienta de construcción Vite.</li>
         </ul>
     </li>
     <li><strong>Capa de Mapeo (GIS Web):</strong>
         <ul>
             <li>Uso de <code>react-leaflet</code> para proyectar datos tabulares (latitud, longitud) sobre cartografía base de <strong>OpenStreetMap</strong>.</li>
             <li>Adopta por defecto el sistema de proyección Web Mercator (EPSG: 3857) a partir de coordenadas esferoidales nativas WGS84 (EPSG: 4326).</li>
         </ul>
     </li>
     <li><strong>Capa de Procesamiento Local y Análisis Espacial:</strong>
         <ul>
             <li>Consumo en tiempo real de geometrías de OpenStreetMap y fechas de gira oficiales de Bandsintown.</li>
             <li><strong>Unificación Geodésica (Haversine):</strong> Emparejamiento espacial automático que vincula recitales con coordenadas próximas (&le; 600m) a los recintos oficiales de OpenStreetMap para evitar pines duplicados.</li>
             <li>Filtrado temporal estricto que muestra permanente y únicamente eventos desde el día de la fecha en adelante, ordenados cronológicamente.</li>
         </ul>
     </li>
 </ul>

<hr>

<h2>📂 Estructura del Proyecto</h2>

<pre><code>concerts-tracker/
├── .github/workflows/       # Scripts de automatización CI/CD (GitHub Actions)
├── docs/                    # Documentación del proyecto
│   ├── ENUNCIADO.md         # Enunciado original del TP
│   ├── PROPOSAL.md          # Propuesta formal y objetivos del proyecto SIG
├── public/                  # Recursos públicos estáticos
├── src/                     # Código Fuente de la Aplicación
│   ├── pages/               # Vistas principales (Home, MapPage) y sus estilos CSS
│   ├── services/            # Servicios de consumo en tiempo real (concertsService.ts)
│   ├── types/               # Definiciones e interfaces TypeScript (Venue, ConcertEvent)
│   ├── App.tsx              # Componente enrutador principal (HashRouter)
│   ├── index.css            # Estilos globales de la aplicación y tokens de diseño
│   └── main.tsx             # Punto de entrada y montaje de React
├── index.html               # Plantilla HTML principal
├── package.json             # Dependencias del proyecto y scripts
├── pnpm-lock.yaml           # Archivo de bloqueo de versiones de pnpm
├── tsconfig.json            # Configuración del compilador TypeScript
├── tsconfig.node.json       # Configuración TS específica para Vite
├── vite.config.ts           # Configuración del entorno Vite
└── README.md                # Documentación principal del repositorio
</code></pre>

<hr>

<h2>🧩 Funcionalidades a Desarrollar</h2>

<ul>
    <li><strong>Mapa Interactivo Base</strong>
        <ul>
            <li>Renderización de capas dinámicas (Tile Layers) provenientes de OSM.</li>
        </ul>
    </li>
    <li><strong>Sistema de Marcadores (Markers)</strong>
        <ul>
            <li>Posicionamiento de recintos (venues) y visualización de conciertos.</li>
            <li>Pop-ups con información rica: nombre del evento, fecha, lugar, y accesos directos.</li>
        </ul>
    </li>
    <li><strong>Geofiltros y Filtrado Simultáneo</strong>
        <ul>
            <li>Panel lateral (Sidebar) reactivo para filtrar por Artista y Recinto (Venue) en tiempo real.</li>
            <li>El mapa responde de manera inmediata mostrando u ocultando eventos según las coincidencias.</li>
        </ul>
    </li>
</ul>

<hr>

<h2>🚀 Puesta en Marcha (Setup Local)</h2>

<h3>1. Requisitos Previos</h3>
<ul>
    <li><strong>Node.js</strong> instalado en tu sistema.</li>
    <li><strong>pnpm</strong> instalado globalmente (si no lo tenés, ejecutá <code>npm install -g pnpm</code>).</li>
</ul>

<h3>2. Instalación y Ejecución</h3>

<ol>
    <li>Clonar el repositorio:
        <pre><code>git clone https://github.com/agussantinelli/concerts-tracker.git
</code></pre>
    </li>
    <li>Ingresar al directorio del proyecto:
        <pre><code>cd concerts-tracker</code></pre>
    </li>
    <li>Instalar todas las dependencias del ecosistema React/Vite/Leaflet:
        <pre><code>pnpm install</code></pre>
    </li>
    <li>Iniciar el servidor de desarrollo local:
        <pre><code>pnpm dev</code></pre>
    </li>
    <li>Acceder a la plataforma desde tu navegador web:
        <pre><code>http://localhost:5173</code></pre>
    </li>
</ol>

<hr>

<h2>📚 Contexto Académico</h2>

<p>
    Este proyecto fue gestado y diseñado como <strong>Trabajo Práctico Integrador</strong> para la materia electiva <strong>Sistemas de Información Geográfica</strong> dictada en la <strong>Universidad Tecnológica Nacional, Facultad Regional Rosario (UTN FRRO) - Ingeniería en Sistemas de Información</strong>.
</p>
<p>
    <strong>Comisión:</strong> 2EK02 | <strong>Fecha de Entrega:</strong> 29/10/2026<br/>
    <strong>Docentes a cargo:</strong> Ricagno Andrés, Ascolani Federico.
</p>
<p>
    <strong>Integrantes del Proyecto:</strong>
    <ul>
        <li>Berrino, Nadia Belén – Legajo: 55372</li>
        <li>Boveri, Rafaela – Legajo: 52077</li>
        <li>Di Pentima, Maria Felicitas – Legajo: 53722</li>
        <li>Santinelli, Agustín – Legajo: 52211</li>
    </ul>
</p>

<hr />

<h2 align="left">⚖️ Licencia</h2>

<p align="left">
  Este proyecto se distribuye bajo los términos de la <b>Licencia MIT</b>. 
  Permitiendo el uso comercial, la modificación, distribución y uso privado de forma libre y gratuita, requiriendo únicamente preservar el aviso de derechos de autor y licencia.
</p>

<hr />

<h2 align="left">🤝 Contribución</h2>

<p align="left">
  Si bien este es un proyecto académico de cátedra, agradecemos sugerencias. Para contribuir:
  <ul>
    <li>Haz un fork de este repositorio.</li>
    <li>Crea una nueva rama para tus mejoras (<code>git checkout -b feature/nueva-herramienta</code>).</li>
    <li>Realiza los commits con los cambios propuestos.</li>
    <li>Envía un Pull Request para revisión.</li>
  </ul>
</p>

<p align="left">
  ¡Gracias por explorar el repositorio! 🌎🎸
</p>

<hr />

<p><em>Concerts Tracker – Acercando la música al territorio a través del poder de los datos espaciales.</em></p>
