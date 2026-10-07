<h1 align="center">🎵 Concerts Tracker - SIG Web de Eventos Musicales</h1>

<div align="center">
    <a href="https://github.com/agussantinelli/concerts-tracker" target="_blank" style="text-decoration: none;">
        <img src="https://img.shields.io/badge/💻%20Repo%20Principal-Concerts_Tracker-0b7285?style=for-the-badge&logo=github&logoColor=white" alt="Repo Concerts Tracker"/>
    </a>
    <a href="https://drive.google.com/drive/folders/1aye4ekfo-Qra4-uXi6-KdhUuStWTFLUX?usp=sharing" target="_blank" style="text-decoration: none;">
        <img src="https://img.shields.io/badge/📄%20Documentación%20Completa-Google%20Drive-34a853?style=for-the-badge&logo=googledrive&logoColor=white" alt="Docs Drive"/>
    </a>
</div>

<p align="center">
    <a href="https://github.com/agussantinelli" target="_blank" style="text-decoration: none;">
        <img src="https://img.shields.io/badge/👤%20Agustín%20Santinelli-agussantinelli-000000?style=for-the-badge&logo=github&logoColor=white" alt="Agus"/>
    </a>
    <!-- Agregá más badges si tu grupo tiene otros integrantes -->
</p>

<p align="center">
    <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React Badge"/>
    <img src="https://img.shields.io/badge/Vite-B73BFE?style=for-the-badge&logo=vite&logoColor=FFD62E" alt="Vite Badge"/>
    <img src="https://img.shields.io/badge/Leaflet-199900?style=for-the-badge&logo=leaflet&logoColor=white" alt="Leaflet Badge"/>
    <img src="https://img.shields.io/badge/pnpm-F69220?style=for-the-badge&logo=pnpm&logoColor=white" alt="pnpm Badge"/>
    <img src="https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white" alt="Node.js Badge"/>
</p>
<p align="center">
    <img src="https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white" alt="HTML5 Badge"/>
    <img src="https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white" alt="CSS3 Badge"/>
    <img src="https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black" alt="JavaScript Badge"/>
</p>
<div align="center">
  <img src="https://img.shields.io/badge/License-GPLv3-blue.svg?style=for-the-badge&logo=gnu&logoColor=white" alt="GPLv3 License"/>
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

<p>
    Toda la documentación extendida (Enunciado, Propuesta del TPI y futuras entregas) se encuentra en:
    <a href="https://drive.google.com/drive/folders/1aye4ekfo-Qra4-uXi6-KdhUuStWTFLUX?usp=sharing" target="_blank">
        Google Drive – Concerts Tracker
    </a>.
</p>

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
    <td>React + Vite</td>
    <td>React v19, Vite v5 (SPA Rápida)</td>
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
    <td><strong>Consumo de Datos</strong></td>
    <td>APIs REST <em>(A definir)</em></td>
    <td>Integración asíncrona de datos de eventos (Ej. Ticketmaster, Setlist.fm).</td>
   </tr>
   <tr>
    <td><strong>Procesamiento de Datos</strong></td>
    <td>Fetch / API Nativas</td>
    <td>Transformación de JSONs en objetos espaciales renderizables.</td>
   </tr>
  </tbody>
 </table>

<hr>

<h2>🏗️ Arquitectura de la Solución</h2>

 <p>Concerts Tracker sigue una arquitectura de <strong>Single Page Application (SPA)</strong> con un fuerte enfoque en el procesamiento de datos geográficos desde el cliente:</p>

 <ul>
     <li><strong>Capa de Presentación (UI):</strong>
         <ul>
             <li>Desarrollada íntegramente con componentes funcionales de React.</li>
             <li>Renderizado ultrarrápido apoyado por la herramienta de construcción Vite.</li>
         </ul>
     </li>
     <li><strong>Capa de Mapeo (GIS Web):</strong>
         <ul>
             <li>Uso de <code>react-leaflet</code> para proyectar datos tabulares (latitud, longitud) sobre cartografía de <strong>OpenStreetMap</strong>.</li>
             <li>Adopta por defecto el sistema de proyección Web Mercator (EPSG: 3857).</li>
         </ul>
     </li>
     <li><strong>Capa de Integración de Datos:</strong>
         <ul>
             <li>Consumo en tiempo real de APIs de terceros mediante peticiones asincrónicas.</li>
             <li>Conversión on-the-fly de objetos crudos en marcadores de mapa o formatos espaciales.</li>
         </ul>
     </li>
 </ul>

<hr>

<h2>📂 Estructura del Proyecto</h2>

<pre><code>concerts-tracker/
├── public/                  # Recursos públicos estáticos
├── src/                     # Código Fuente de la Aplicación
│   ├── assets/              # Imágenes e íconos locales
│   ├── App.jsx              # Componente principal de React
│   └── main.jsx             # Punto de entrada de la aplicación
├── index.html               # Plantilla HTML principal
├── package.json             # Dependencias del proyecto y scripts
├── pnpm-lock.yaml           # Archivo de bloqueo de versiones de pnpm
├── vite.config.js           # Configuración del entorno Vite
├── ENUNCIADO.md             # Enunciado original del TP
├── PROPOSAL.md              # Propuesta formal y objetivos del proyecto
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
    <li><strong>Geofiltros y Filtrado de Atributos</strong>
        <ul>
            <li>Barra de búsqueda para localizar giras de artistas o bandas específicas.</li>
            <li>Herramientas para delimitar la búsqueda en base al <em>bounding box</em> actual de la pantalla.</li>
        </ul>
    </li>
</ul>

<hr>

<h2>🚀 Puesta en Marcha (Setup Local)</h2>

<h3>1. Requisitos Previos</h3>
<ul>
    <li><strong>Node.js</strong> instalado en tu sistema.</li>
    <li><strong>pnpm</strong> instalado globalmente (si no lo tenés, ejecutá <code>npm install -g pnpm</code>).</li>
    <li><em>(En el futuro)</em> Claves de API de los proveedores de eventos seleccionados.</li>
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
    <strong>Docentes a cargo:</strong> Ricagno Andrés, Ascolani Federico.
</p>
<p>
    La justificación, propuestas formales y apuntes del grupo están concentrados en <a href="https://drive.google.com/drive/folders/1aye4ekfo-Qra4-uXi6-KdhUuStWTFLUX?usp=sharing" target="_blank">nuestra carpeta de Google Drive compartida</a>.
</p>

<hr />

<h2 align="left">⚖️ Licencia</h2>

<p align="left">
  Este proyecto se distribuye bajo los términos de la <b>Licencia GNU General Public License v3.0 (GPLv3)</b>. 
  Garantizando la libertad de uso, estudio, y modificación, siempre y cuando cualquier proyecto derivado mantenga este mismo tipo de licencia de código abierto.
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
