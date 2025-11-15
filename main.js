// Configuration object
const defaultConfig = {
    hero_title: "📖 Educación accesible para todos",
    hero_subtitle: "ArcoEdu convierte textos escolares en audiolibros o lecturas por voz para estudiantes con discapacidad visual.",
    purpose_text: "🎯 Nuestro propósito es facilitar el acceso al material de lectura a estudiantes con baja visión o ceguera, impulsando una educación inclusiva y justa.",
    cta_text: "Sé parte del cambio educativo. Hacé que tus clases sean accesibles para todos.",
    background_color: "#ffffff",
    surface_color: "#f8f9fa",
    text_color: "#2c3e50",
    primary_action_color: "#4a90e2",
    secondary_action_color: "#f1c40f",
    font_family: "Poppins",
    font_size: 16
};

// Accessibility modes functionality
let currentAccessibilityMode = 'normal'; // 'normal', 'dark', 'colorblind'

function toggleAccessibilityMode() {
    const modes = ['normal', 'dark', 'colorblind'];
    const currentIndex = modes.indexOf(currentAccessibilityMode);
    const nextIndex = (currentIndex + 1) % modes.length;
    currentAccessibilityMode = modes[nextIndex];
    
    applyAccessibilityMode(currentAccessibilityMode);
    
    // Save preference
    localStorage.setItem('accessibilityMode', currentAccessibilityMode);
}

function applyAccessibilityMode(mode) {
    const toggle = document.querySelector('.accessibility-toggle');
    
    // Remove all mode classes
    document.body.classList.remove('dark-mode', 'colorblind-mode');
    
    switch(mode) {
        case 'normal':
            toggle.textContent = '🌙';
            toggle.setAttribute('aria-label', 'Cambiar a modo oscuro');
            toggle.setAttribute('title', 'Modo normal - Clic para modo oscuro');
            break;
        case 'dark':
            document.body.classList.add('dark-mode');
            toggle.textContent = '🎨';
            toggle.setAttribute('aria-label', 'Cambiar a modo daltónico');
            toggle.setAttribute('title', 'Modo oscuro - Clic para modo daltónico');
            break;
        case 'colorblind':
            document.body.classList.add('colorblind-mode');
            toggle.textContent = '☀️';
            toggle.setAttribute('aria-label', 'Cambiar a modo normal');
            toggle.setAttribute('title', 'Modo daltónico - Clic para modo normal');
            break;
    }
}

// Load accessibility mode preference
function loadAccessibilityPreference() {
    const savedMode = localStorage.getItem('accessibilityMode') || 'normal';
    currentAccessibilityMode = savedMode;
    applyAccessibilityMode(savedMode);
}

// Smooth scrolling for anchor links
function initSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Element SDK implementation
async function onConfigChange(config) {
    const heroTitle = document.getElementById('hero-title');
    const heroSubtitle = document.querySelector('.hero-text p');
    const purposeText = document.querySelector('.purpose-text');
    const ctaText = document.querySelector('.cta-text');

    if (heroTitle) {
        heroTitle.textContent = config.hero_title || defaultConfig.hero_title;
    }
    if (heroSubtitle) {
        heroSubtitle.textContent = config.hero_subtitle || defaultConfig.hero_subtitle;
    }
    if (purposeText) {
        purposeText.textContent = config.purpose_text || defaultConfig.purpose_text;
    }
    if (ctaText) {
        ctaText.textContent = config.cta_text || defaultConfig.cta_text;
    }

    // Apply colors
    const backgroundColor = config.background_color || defaultConfig.background_color;
    const surfaceColor = config.surface_color || defaultConfig.surface_color;
    const textColor = config.text_color || defaultConfig.text_color;
    const primaryActionColor = config.primary_action_color || defaultConfig.primary_action_color;
    const secondaryActionColor = config.secondary_action_color || defaultConfig.secondary_action_color;

    document.documentElement.style.setProperty('--bg-color', backgroundColor);
    document.documentElement.style.setProperty('--surface-color', surfaceColor);
    document.documentElement.style.setProperty('--text-color', textColor);
    document.documentElement.style.setProperty('--primary-color', primaryActionColor);
    document.documentElement.style.setProperty('--secondary-color', secondaryActionColor);

    // Apply font
    const customFont = config.font_family || defaultConfig.font_family;
    const baseFontStack = '-webkit-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    document.body.style.fontFamily = `${customFont}, ${baseFontStack}`;

    // Apply font size
    const baseSize = config.font_size || defaultConfig.font_size;
    document.documentElement.style.fontSize = `${baseSize}px`;
}

function mapToCapabilities(config) {
    return {
        recolorables: [
            {
                get: () => config.background_color || defaultConfig.background_color,
                set: (value) => {
                    if (window.elementSdk) {
                        window.elementSdk.setConfig({ background_color: value });
                    }
                }
            },
            {
                get: () => config.surface_color || defaultConfig.surface_color,
                set: (value) => {
                    if (window.elementSdk) {
                        window.elementSdk.setConfig({ surface_color: value });
                    }
                }
            },
            {
                get: () => config.text_color || defaultConfig.text_color,
                set: (value) => {
                    if (window.elementSdk) {
                        window.elementSdk.setConfig({ text_color: value });
                    }
                }
            },
            {
                get: () => config.primary_action_color || defaultConfig.primary_action_color,
                set: (value) => {
                    if (window.elementSdk) {
                        window.elementSdk.setConfig({ primary_action_color: value });
                    }
                }
            },
            {
                get: () => config.secondary_action_color || defaultConfig.secondary_action_color,
                set: (value) => {
                    if (window.elementSdk) {
                        window.elementSdk.setConfig({ secondary_action_color: value });
                    }
                }
            }
        ],
        borderables: [],
        fontEditable: {
            get: () => config.font_family || defaultConfig.font_family,
            set: (value) => {
                if (window.elementSdk) {
                    window.elementSdk.setConfig({ font_family: value });
                }
            }
        },
        fontSizeable: {
            get: () => config.font_size || defaultConfig.font_size,
            set: (value) => {
                if (window.elementSdk) {
                    window.elementSdk.setConfig({ font_size: value });
                }
            }
        }
    };
}

function mapToEditPanelValues(config) {
    return new Map([
        ["hero_title", config.hero_title || defaultConfig.hero_title],
        ["hero_subtitle", config.hero_subtitle || defaultConfig.hero_subtitle],
        ["purpose_text", config.purpose_text || defaultConfig.purpose_text],
        ["cta_text", config.cta_text || defaultConfig.cta_text]
    ]);
}

// Estado de la aplicación
let usuarioActual = null;
let archivosSubidos = [];
let estadisticas = {
    materialesSubidos: 0,
    audiosGenerados: 0,
    brailleGenerados: 0,
    estudiantesAlcanzados: 0
};

// Sistema de guía de voz para personas no videntes
let guiaVozActiva = false;
let guiaVozUtterance = null;
let guiaVozVelocidad = 1.2;
let guiaVozVolumen = 0.8;
let elementoActual = null;
let guiaVozPausada = false;

// Funciones de modal
function manejarCambioDeRol(selectElement) {
    const rol = selectElement.value;
    const form = selectElement.closest('form');
    const grupoInstitucion = form.querySelector('#form-group-institucion');
    const grupoCodigoAcceso = form.querySelector('#form-group-codigo-acceso');

    if (rol === 'estudiante') {
        if (grupoInstitucion) grupoInstitucion.style.display = 'none';
        if (grupoCodigoAcceso) {
            grupoCodigoAcceso.style.display = 'block';
            form.querySelector('#codigo-acceso').required = true;
        }
        if (form.querySelector('#institucion')) {
            form.querySelector('#institucion').required = false;
        }
    } else {
        if (grupoInstitucion) grupoInstitucion.style.display = 'block';
        if (grupoCodigoAcceso) {
            grupoCodigoAcceso.style.display = 'none';
            form.querySelector('#codigo-acceso').required = false;
        }
        if (form.querySelector('#institucion')) {
            form.querySelector('#institucion').required = true;
        }
    }
}

function mostrarModalRegistro() {
    document.getElementById('modal-title').textContent = 'Registro en ArcoEdu';
    document.getElementById('modal-body').innerHTML = `
        <form onsubmit="procesarRegistro(event)">
            <div class="form-group">
                <label for="nombre">Nombre completo</label>
                <input type="text" id="nombre" name="nombre" required placeholder="Ej: María González">
            </div>
            <div class="form-group">
                <label for="email">Correo electrónico</label>
                <input type="email" id="email" name="email" required placeholder="maria@escuela.edu">
            </div>
            <div class="form-group" id="form-group-institucion">
                <label for="institucion">Institución educativa</label>
                <input type="text" id="institucion" name="institucion" required placeholder="Ej: Escuela Primaria San Martín">
            </div>
            <div class="form-group">
                <label for="rol">Tu rol</label>
                <select id="rol" name="rol" required onchange="manejarCambioDeRol(this)">
                    <option value="">Selecciona tu rol</option>
                    <option value="docente">Docente</option>
                    <option value="estudiante">Estudiante</option>
                    <option value="directivo">Directivo</option>
                    <option value="coordinador">Coordinador pedagógico</option>
                    <option value="otro">Otro</option>
                </select>
            </div>
            <div class="form-group" id="form-group-codigo-acceso" style="display: none;">
                <label for="codigo-acceso">Código de acceso del docente</label>
                <input type="text" id="codigo-acceso" name="codigo" placeholder="Código proporcionado por tu docente">
            </div>
            <div class="form-group">
                <label for="password">Contraseña</label>
                <input type="password" id="password" name="password" required placeholder="Mínimo 6 caracteres">
            </div>
            <button type="submit" class="btn-primary btn-full">Crear cuenta gratis</button>
        </form>
        <div class="text-center" style="margin-top: 1rem;">
            <p class="text-muted">¿Ya tienes cuenta? 
                <button class="link-button" onclick="mostrarModalLogin()">Inicia sesión aquí</button>
            </p>
        </div>
    `;
    document.getElementById('modal-overlay').classList.add('active');
}

function mostrarModalLogin() {
    document.getElementById('modal-title').textContent = 'Iniciar sesión';
    document.getElementById('modal-body').innerHTML = `
        <form onsubmit="procesarLogin(event)">
            <div class="form-group">
                <label for="email-login">Correo electrónico</label>
                <input type="email" id="email-login" name="email" required placeholder="tu@email.com">
            </div>
            <div class="form-group">
                <label for="password-login">Contraseña</label>
                <input type="password" id="password-login" name="password" required placeholder="Tu contraseña">
            </div>
            <button type="submit" class="btn-primary btn-full">Iniciar sesión</button>
        </form>
        <div class="text-center" style="margin-top: 1rem;">
            <p class="text-muted">¿No tienes cuenta? 
                <button class="link-button" onclick="mostrarModalRegistro()">Regístrate gratis</button>
            </p>
            <p class="text-muted">
                <button class="link-button" onclick="mostrarModalRecuperacion()">¿Olvidaste tu contraseña?</button>
            </p>
        </div>
    `;
    document.getElementById('modal-overlay').classList.add('active');
}

function mostrarModalRecuperacion() {
    document.getElementById('modal-title').textContent = 'Recuperar contraseña';
    document.getElementById('modal-body').innerHTML = `
        <form onsubmit="procesarRecuperacion(event)">
            <div class="form-group">
                <label for="email-recuperacion">Correo electrónico</label>
                <input type="email" id="email-recuperacion" name="email" required placeholder="tu@email.com">
            </div>
            <p class="text-muted">Te enviaremos un enlace para restablecer tu contraseña.</p>
            <button type="submit" class="btn-primary btn-full">Enviar enlace</button>
        </form>
        <div class="text-center" style="margin-top: 1rem;">
            <button class="link-button" onclick="mostrarModalLogin()">Volver al inicio de sesión</button>
        </div>
    `;
    document.getElementById('modal-overlay').classList.add('active');
}

function cerrarModal() {
    document.getElementById('modal-overlay').classList.remove('active');
}

// Funciones de procesamiento
function procesarRegistro(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const datos = Object.fromEntries(formData);

    usuarioActual = {
        nombre: datos.nombre,
        email: datos.email,
        rol: datos.rol
    };

    if (datos.rol === 'estudiante') {
        usuarioActual.codigoAcceso = datos.codigo;
    } else {
        usuarioActual.institucion = datos.institucion;
    }

    localStorage.setItem('usuarioArcoEdu', JSON.stringify(usuarioActual));

    cerrarModal();
    mostrarNotificacion('¡Cuenta creada exitosamente! Bienvenido a ArcoEdu', 'success');

    setTimeout(() => {
        if (usuarioActual.rol === 'estudiante') {
            mostrarDashboardEstudiante();
        } else {
            mostrarDashboard();
        }
    }, 1500);
}

function procesarLogin(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const datos = Object.fromEntries(formData);
    
    // Simular login exitoso
    usuarioActual = {
        nombre: 'Usuario Demo',
        email: datos.email,
        institucion: 'Institución Demo',
        rol: 'docente'
    };
    
    localStorage.setItem('usuarioArcoEdu', JSON.stringify(usuarioActual));
    
    cerrarModal();
    mostrarNotificacion('¡Sesión iniciada correctamente!', 'success');
    
    setTimeout(() => {
        mostrarDashboard();
    }, 1500);
}

function procesarRecuperacion(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const email = formData.get('email');
    
    cerrarModal();
    mostrarNotificacion(`Enlace de recuperación enviado a ${email}`, 'info');
}

// Dashboard
function mostrarDashboard() {
    document.querySelector('main').innerHTML = `
        <section class="dashboard">
            <div class="container">
                <div class="dashboard-header">
                    <div>
                        <h1>Panel de Control - ArcoEdu</h1>
                        <p>Bienvenido, ${usuarioActual.nombre}</p>
                    </div>
                    <div>
                        <button class="btn-secondary" onclick="cerrarSesion()">Cerrar sesión</button>
                    </div>
                </div>

                <div class="dashboard-stats">
                    <div class="stat-card">
                        <span class="stat-number">${estadisticas.materialesSubidos}</span>
                        <div class="stat-label">Materiales subidos</div>
                    </div>
                    <div class="stat-card">
                        <span class="stat-number">${estadisticas.audiosGenerados}</span>
                        <div class="stat-label">Audios generados</div>
                    </div>
                    <div class="stat-card">
                        <span class="stat-number">${estadisticas.brailleGenerados}</span>
                        <div class="stat-label">Braille generados</div>
                    </div>
                    <div class="stat-card">
                        <span class="stat-number">${estadisticas.estudiantesAlcanzados}</span>
                        <div class="stat-label">Estudiantes alcanzados</div>
                    </div>
                </div>

                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 2rem;">
                    <div>
                        <h3>Subir nuevo material</h3>
                        <div class="upload-area" onclick="document.getElementById('file-input').click()" ondrop="manejarDrop(event)" ondragover="manejarDragOver(event)" ondragleave="manejarDragLeave(event)">
                            <div style="font-size: 3rem; margin-bottom: 1rem;">📄</div>
                            <h4>Arrastra archivos aquí o haz clic para seleccionar</h4>
                            <p>Formatos soportados: PDF, DOC, DOCX, TXT</p>
                            <input type="file" id="file-input" style="display: none;" multiple accept=".pdf,.doc,.docx,.txt" onchange="manejarArchivos(event)">
                        </div>
                    </div>

                    <div>
                        <h3>Acciones rápidas</h3>
                        <div style="display: flex; flex-direction: column; gap: 1rem;">
                            <button class="btn-primary" onclick="mostrarModalConversion()">🎧 Convertir texto a audio</button>
                            <button class="btn-secondary" onclick="mostrarModalBraille()">⠃ Convertir a Braille</button>
                            <button class="btn-secondary" onclick="mostrarEstudiantes()">👥 Gestionar estudiantes</button>
                            <button class="btn-secondary" onclick="mostrarReportes()">📊 Ver reportes</button>
                        </div>
                    </div>
                </div>

                <div class="file-list" id="file-list">
                    <h3>Materiales recientes</h3>
                    <div id="archivos-container">
                        ${archivosSubidos.length === 0 ? 
                            '<p class="text-muted">No hay materiales subidos aún. ¡Sube tu primer archivo!</p>' : 
                            archivosSubidos.map(archivo => `
                                <div class="file-item">
                                    <div class="file-info">
                                        <span style="font-size: 1.5rem;">📄</span>
                                        <div>
                                            <strong>${archivo.nombre}</strong>
                                            <div class="text-muted">${archivo.fecha} • ${archivo.tamaño}</div>
                                        </div>
                                    </div>
                                    <div class="file-actions">
                                        <button class="btn-primary btn-small" onclick="convertirArchivo('${archivo.id}', 'audio')">🎧 Audio</button>
                                        <button class="btn-secondary btn-small" onclick="convertirArchivo('${archivo.id}', 'braille')">⠃ Braille</button>
                                        <button class="btn-secondary btn-small" onclick="compartirArchivo('${archivo.id}')">📤 Compartir</button>
                                    </div>
                                </div>
                            `).join('')
                        }
                    </div>
                </div>
            </div>
        </section>
    `;
}

// Funciones de archivos
function manejarArchivos(event) {
    const archivos = Array.from(event.target.files);
    procesarArchivos(archivos);
}

function manejarDrop(event) {
    event.preventDefault();
    event.currentTarget.classList.remove('dragover');
    const archivos = Array.from(event.dataTransfer.files);
    procesarArchivos(archivos);
}

function manejarDragOver(event) {
    event.preventDefault();
    event.currentTarget.classList.add('dragover');
}

function manejarDragLeave(event) {
    event.currentTarget.classList.remove('dragover');
}

function procesarArchivos(archivos) {
    archivos.forEach(archivo => {
        const nuevoArchivo = {
            id: Date.now() + Math.random(),
            nombre: archivo.name,
            tamaño: formatearTamaño(archivo.size),
            fecha: new Date().toLocaleDateString(),
            tipo: archivo.type
        };
        
        archivosSubidos.unshift(nuevoArchivo);
        estadisticas.materialesSubidos++;
    });
    
    mostrarNotificacion(`${archivos.length} archivo(s) subido(s) correctamente`, 'success');
    actualizarDashboard();
}

function formatearTamaño(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

function convertirArchivo(id, tipo) {
    const archivo = archivosSubidos.find(a => a.id == id);
    if (!archivo) return;
    
    mostrarNotificacion(`Convirtiendo "${archivo.nombre}" a ${tipo}...`, 'info');
    
    setTimeout(() => {
        if (tipo === 'audio') {
            estadisticas.audiosGenerados++;
            archivo.audioGenerado = true;
            archivo.audioUrl = `audio_${archivo.id}.mp3`;
            mostrarNotificacion(`Audio generado para "${archivo.nombre}"`, 'success');
            mostrarReproductorAudio(archivo);
        } else if (tipo === 'braille') {
            estadisticas.brailleGenerados++;
            archivo.brailleGenerado = true;
            archivo.brailleContent = generarBrailleDemo(archivo.nombre);
            mostrarNotificacion(`Braille generado para "${archivo.nombre}"`, 'success');
            mostrarVisorBraille(archivo);
        }
        estadisticas.estudiantesAlcanzados += Math.floor(Math.random() * 5) + 1;
        actualizarDashboard();
    }, 2000);
}

function generarBrailleDemo(nombreArchivo) {
    // Simulación de contenido Braille para demostración
    const brailleText = `
⠠⠊⠝⠊⠉⠊⠕ ⠙⠑⠇ ⠞⠑⠭⠞⠕⠒ ${nombreArchivo}

⠠⠓⠁⠃⠊⠁ ⠥⠝⠁ ⠧⠑⠵ ⠥⠝ ⠏⠗⠊⠝⠉⠊⠏⠑ ⠟⠥⠑ ⠧⠊⠧⠊⠁ ⠑⠝ ⠥⠝ ⠏⠁⠇⠁⠉⠊⠕ ⠍⠥⠽ ⠛⠗⠁⠝⠙⠑⠲ 
⠠⠑⠇ ⠏⠁⠇⠁⠉⠊⠕ ⠞⠑⠝⠊⠁ ⠍⠥⠉⠓⠁⠎ ⠓⠁⠃⠊⠞⠁⠉⠊⠕⠝⠑⠎ ⠽ ⠥⠝ ⠚⠁⠗⠙⠊⠝ 
⠓⠑⠗⠍⠕⠎⠕⠲ ⠠⠑⠝ ⠑⠇ ⠚⠁⠗⠙⠊⠝ ⠓⠁⠃⠊⠁ ⠍⠥⠉⠓⠁⠎ ⠋⠇⠕⠗⠑⠎ 
⠽ ⠁⠗⠃⠕⠇⠑⠎ ⠋⠗⠥⠞⠁⠇⠑⠎⠲

⠠⠥⠝ ⠙⠊⠁⠂ ⠑⠇ ⠏⠗⠊⠝⠉⠊⠏⠑ ⠙⠑⠉⠊⠙⠊⠕ ⠎⠁⠇⠊⠗ ⠁ ⠉⠁⠍⠊⠝⠁⠗ 
⠏⠕⠗ ⠑⠇ ⠃⠕⠎⠟⠥⠑⠲ ⠠⠍⠊⠑⠝⠞⠗⠁⠎ ⠉⠁⠍⠊⠝⠁⠃⠁⠂ ⠑⠝⠉⠕⠝⠞⠗⠕ 
⠥⠝⠁ ⠉⠁⠎⠊⠞⠁ ⠍⠥⠽ ⠏⠑⠟⠥⠑⠻⠁⠲

⠠⠑⠝ ⠇⠁ ⠉⠁⠎⠊⠞⠁ ⠧⠊⠧⠊⠁ ⠥⠝⠁ ⠁⠝⠉⠊⠁⠝⠁ ⠍⠥⠽ ⠎⠁⠃⠊⠁⠲ 
⠠⠑⠇⠇⠁ ⠇⠑ ⠙⠊⠚⠕⠒ "⠠⠏⠗⠊⠝⠉⠊⠏⠑⠂ ⠞⠑ ⠧⠕⠽ ⠁ ⠙⠁⠗ ⠥⠝ 
⠉⠕⠝⠎⠑⠚⠕ ⠍⠥⠽ ⠊⠍⠏⠕⠗⠞⠁⠝⠞⠑⠲"

⠠⠋⠊⠝ ⠙⠑⠇ ⠞⠑⠭⠞⠕ ⠙⠑ ⠙⠑⠍⠕⠎⠞⠗⠁⠉⠊⠕⠝⠲
            `;
    return brailleText.trim();
}

function mostrarReproductorAudio(archivo) {
    document.getElementById('modal-title').textContent = `🎧 Reproductor de Audio - ${archivo.nombre}`;
    document.getElementById('modal-body').innerHTML = `
        <div style="text-align: center; padding: 2rem;">
            <div style="background: #f8f9fa; border-radius: 15px; padding: 2rem; margin-bottom: 2rem;">
                <h4 style="margin-bottom: 1rem;">📖 ${archivo.nombre}</h4>
                <p style="color: #000; margin-bottom: 2rem;">Audio generado con voz natural de alta calidad</p>
                
                <!-- Reproductor de audio real -->
                <div style="background: white; border-radius: 10px; padding: 1.5rem; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
                    <div style="display: flex; align-items: center; gap: 1rem; margin-bottom: 1rem;">
                        <button id="play-btn" onclick="toggleRealAudio()" style="background: #4a90e2; color: white; border: none; border-radius: 50%; width: 50px; height: 50px; font-size: 1.5rem; cursor: pointer;">▶️</button>
                        <div style="flex: 1; background: #e9ecef; height: 8px; border-radius: 4px; position: relative;">
                            <div id="progress-bar" style="background: #4a90e2; height: 100%; width: 0%; border-radius: 4px; transition: width 0.3s ease;"></div>
                        </div>
                        <span id="time-display">0:00 / --:--</span>
                    </div>
                    
                    <div style="display: flex; justify-content: center; gap: 1rem; margin-bottom: 1rem;">
                        <button onclick="changeRealSpeed(-0.25)" style="background: #000; color: white; border: none; padding: 0.5rem 1rem; border-radius: 5px; cursor: pointer;">🐌 -</button>
                        <span id="speed-display" style="padding: 0.5rem 1rem; background: #e9ecef; border-radius: 5px;">1.0x</span>
                        <button onclick="changeRealSpeed(0.25)" style="background: #000; color: white; border: none; padding: 0.5rem 1rem; border-radius: 5px; cursor: pointer;">🐰 +</button>
                    </div>
                    
                    <div style="margin-bottom: 1rem;">
                        <label for="voice-select" style="display: block; margin-bottom: 0.5rem; font-weight: 600;">Seleccionar voz:</label>
                        <select id="voice-select" onchange="cambiarVoz()" style="padding: 0.5rem; border-radius: 5px; border: 1px solid #ddd; width: 200px;">
                            <option value="">Cargando voces...</option>
                        </select>
                    </div>
                    
                    <div id="texto-contenido" style="font-style: italic; color: #000; font-size: 0.9rem; background: #f8f9fa; padding: 1rem; border-radius: 8px; text-align: left; max-height: 150px; overflow-y: auto;">
                        ${generarTextoDemo(archivo.nombre)}
                    </div>
                </div>
                
                <div style="display: flex; gap: 1rem; justify-content: center; margin-top: 2rem; flex-wrap: wrap;">
                    <button onclick="descargarAudio('${archivo.id}')" class="btn-secondary">💾 Descargar Audio</button>
                    <button onclick="descargarPDF('${archivo.id}')" class="btn-secondary">📄 Descargar PDF</button>
                    <button onclick="compartirAudio('${archivo.id}')" class="btn-primary">📤 Compartir</button>
                </div>
            </div>
        </div>
    `;
    document.getElementById('modal-overlay').classList.add('active');
    
    // Inicializar reproductor real
    inicializarReproductorReal(archivo);
}

function mostrarVisorBraille(archivo) {
    document.getElementById('modal-title').textContent = `⠃ Visor Braille - ${archivo.nombre}`;
    document.getElementById('modal-body').innerHTML = `
        <div style="padding: 1rem;">
            <div style="background: #f8f9fa; border-radius: 15px; padding: 2rem; margin-bottom: 2rem;">
                <h4 style="margin-bottom: 1rem;">📖 ${archivo.nombre}</h4>
                <p style="color: #000; margin-bottom: 2rem;">Contenido convertido a Braille digital</p>
                
                <div style="background: white; border-radius: 10px; padding: 2rem; box-shadow: 0 2px 10px rgba(0,0,0,0.1); margin-bottom: 2rem;">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
                        <h5>Texto en Braille:</h5>
                        <div>
                            <button onclick="cambiarTamañoBraille(-2)" style="background: #000; color: white; border: none; padding: 0.25rem 0.5rem; border-radius: 3px; cursor: pointer;">A-</button>
                            <button onclick="cambiarTamañoBraille(2)" style="background: #000; color: white; border: none; padding: 0.25rem 0.5rem; border-radius: 3px; cursor: pointer; margin-left: 0.25rem;">A+</button>
                        </div>
                    </div>
                    
                    <div id="braille-content" style="font-family: 'Courier New', monospace; font-size: 18px; line-height: 1.8; background: #fafafa; padding: 1.5rem; border-radius: 8px; white-space: pre-wrap; max-height: 300px; overflow-y: auto; border: 2px solid #e9ecef;">
${archivo.brailleContent}
                    </div>
                </div>
                
                <div style="display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap;">
                    <button onclick="descargarBraille('${archivo.id}')" class="btn-secondary">💾 Descargar BRF</button>
                    <button onclick="descargarPDF('${archivo.id}')" class="btn-secondary">📄 Descargar PDF</button>
                    <button onclick="imprimirBraille('${archivo.id}')" class="btn-secondary">🖨️ Imprimir</button>
                    <button onclick="compartirBraille('${archivo.id}')" class="btn-primary">📤 Compartir</button>
                </div>
            </div>
        </div>
    `;
    document.getElementById('modal-overlay').classList.add('active');
}

// Variables para audio real con Web Speech API
let speechSynthesis = window.speechSynthesis;
let currentUtterance = null;
let isPlaying = false;
let currentSpeed = 1.0;
let availableVoices = [];
let selectedVoice = null;
let currentText = '';
let progressInterval = null;
let audioStartTime = 0;
let audioPausedTime = 0;
let isAudioInitialized = false;

function generarTextoDemo(nombreArchivo) {
    const textos = {
        'cuento': `Había una vez un príncipe que vivía en un palacio muy grande. El palacio tenía muchas habitaciones y un jardín hermoso. En el jardín había muchas flores y árboles frutales.

Un día, el príncipe decidió salir a caminar por el bosque. Mientras caminaba, encontró una casita muy pequeña.

En la casita vivía una anciana muy sabia. Ella le dijo: "Príncipe, te voy a dar un consejo muy importante. La verdadera riqueza no está en el oro ni en las joyas, sino en la bondad de tu corazón."

El príncipe escuchó atentamente las palabras de la anciana y desde ese día se convirtió en el rey más querido de todo el reino.`,
        'matematicas': `Las fracciones son números que representan partes de un entero. Una fracción tiene dos partes: el numerador y el denominador.

El numerador es el número de arriba y nos dice cuántas partes tenemos. El denominador es el número de abajo y nos dice en cuántas partes está dividido el entero.

Por ejemplo, en la fracción tres cuartos, el tres es el numerador y el cuatro es el denominador. Esto significa que tenemos tres partes de algo que está dividido en cuatro partes iguales.

Para sumar fracciones con el mismo denominador, sumamos los numeradores y mantenemos el mismo denominador.`,
        'ciencias': `El Sistema Solar está formado por el Sol y todos los objetos que giran a su alrededor. Estos objetos incluyen ocho planetas, sus lunas, asteroides y cometas.

Los planetas más cercanos al Sol son Mercurio, Venus, Tierra y Marte. Estos se llaman planetas rocosos porque están hechos principalmente de roca y metal.

Los planetas más lejanos son Júpiter, Saturno, Urano y Neptuno. Estos se llaman gigantes gaseosos porque están hechos principalmente de gases.

La Tierra es el único planeta que conocemos donde existe vida. Esto se debe a que tiene agua líquida, una atmósfera adecuada y está a la distancia correcta del Sol.`
    };

    // Determinar qué texto usar basado en el nombre del archivo
    if (nombreArchivo.toLowerCase().includes('cuento') || nombreArchivo.toLowerCase().includes('príncipe')) {
        return textos.cuento;
    } else if (nombreArchivo.toLowerCase().includes('matemática') || nombreArchivo.toLowerCase().includes('fracción')) {
        return textos.matematicas;
    } else if (nombreArchivo.toLowerCase().includes('ciencia') || nombreArchivo.toLowerCase().includes('solar')) {
        return textos.ciencias;
    } else {
        return textos.cuento; // Por defecto
    }
}

function inicializarReproductorReal(archivo) {
    currentText = generarTextoDemo(archivo.nombre);
    
    // Cargar voces disponibles
    cargarVoces();
    
    // Escuchar cambios en las voces (algunas se cargan de forma asíncrona)
    if (speechSynthesis.onvoiceschanged !== undefined) {
        speechSynthesis.onvoiceschanged = cargarVoces;
    }
}

function cargarVoces() {
    // Forzar recarga de voces
    speechSynthesis.cancel();
    availableVoices = speechSynthesis.getVoices();
    
    // Si no hay voces, intentar de nuevo en un momento
    if (availableVoices.length === 0) {
        setTimeout(cargarVoces, 100);
        return;
    }
    
    const voiceSelect = document.getElementById('voice-select');
    
    if (voiceSelect) {
        voiceSelect.innerHTML = '';
        
        // Filtrar y priorizar voces en español
        const spanishVoices = availableVoices.filter(voice => 
            voice.lang.toLowerCase().includes('es') || 
            voice.lang.toLowerCase().includes('spa') ||
            voice.name.toLowerCase().includes('spanish') ||
            voice.name.toLowerCase().includes('español')
        );
        
        // Filtrar voces femeninas que suelen ser más claras
        const femaleVoices = availableVoices.filter(voice =>
            voice.name.toLowerCase().includes('female') ||
            voice.name.toLowerCase().includes('woman') ||
            voice.name.toLowerCase().includes('maria') ||
            voice.name.toLowerCase().includes('carmen') ||
            voice.name.toLowerCase().includes('lucia')
        );
        
        // Combinar y priorizar voces
        let voicesToUse = [...new Set([...spanishVoices, ...femaleVoices, ...availableVoices])];
        
        // Si no hay voces específicas, usar todas
        if (voicesToUse.length === 0) {
            voicesToUse = availableVoices;
        }
        
        voicesToUse.forEach((voice, index) => {
            const option = document.createElement('option');
            option.value = availableVoices.indexOf(voice);
            const isSpanish = voice.lang.toLowerCase().includes('es') || voice.lang.toLowerCase().includes('spa');
            const prefix = isSpanish ? '🇪🇸 ' : '🌐 ';
            option.textContent = `${prefix}${voice.name} (${voice.lang})`;
            voiceSelect.appendChild(option);
        });
        
        // Seleccionar la mejor voz por defecto
        const bestVoice = spanishVoices[0] || femaleVoices[0] || availableVoices[0];
        if (bestVoice) {
            selectedVoice = bestVoice;
            voiceSelect.value = availableVoices.indexOf(bestVoice);
        }
        
        isAudioInitialized = true;
    }
}

function cambiarVoz() {
    const voiceSelect = document.getElementById('voice-select');
    const selectedIndex = parseInt(voiceSelect.value);
    
    if (selectedIndex >= 0 && selectedIndex < availableVoices.length) {
        selectedVoice = availableVoices[selectedIndex];
    }
}

function toggleRealAudio() {
    if (isPlaying) {
        detenerAudio();
    } else {
        reproducirAudio();
    }
}

function reproducirAudio() {
    if (!currentText) {
        mostrarNotificacion('No hay texto para reproducir', 'warning');
        return;
    }
    
    // Verificar si el audio está inicializado
    if (!isAudioInitialized) {
        mostrarNotificacion('Cargando voces, intenta de nuevo en un momento...', 'info');
        cargarVoces();
        setTimeout(reproducirAudio, 1000);
        return;
    }
    
    // Detener cualquier reproducción anterior
    speechSynthesis.cancel();
    
    // Crear nueva utterance
    currentUtterance = new SpeechSynthesisUtterance(currentText);
    
    // Configurar la voz con validación
    if (selectedVoice && availableVoices.includes(selectedVoice)) {
        currentUtterance.voice = selectedVoice;
    } else {
        // Buscar una voz por defecto
        const defaultVoice = availableVoices.find(voice => 
            voice.lang.toLowerCase().includes('es') || 
            voice.default
        ) || availableVoices[0];
        
        if (defaultVoice) {
            currentUtterance.voice = defaultVoice;
            selectedVoice = defaultVoice;
        }
    }
    
    // Configurar parámetros de audio
    currentUtterance.rate = Math.max(0.1, Math.min(2.0, currentSpeed));
    currentUtterance.pitch = 1.0;
    currentUtterance.volume = 1.0;
    currentUtterance.lang = 'es-ES';
    
    // Eventos de la utterance
    currentUtterance.onstart = function() {
        isPlaying = true;
        audioStartTime = Date.now();
        const playBtn = document.getElementById('play-btn');
        if (playBtn) playBtn.textContent = '⏸️';
        
        // Iniciar progreso visual
        iniciarProgresoVisual();
        mostrarNotificacion('Reproduciendo audio...', 'info');
    };
    
    currentUtterance.onend = function() {
        isPlaying = false;
        const playBtn = document.getElementById('play-btn');
        if (playBtn) playBtn.textContent = '▶️';
        
        // Detener progreso visual
        detenerProgresoVisual();
        
        // Resetear barra de progreso
        const progressBar = document.getElementById('progress-bar');
        if (progressBar) progressBar.style.width = '100%';
        
        const timeDisplay = document.getElementById('time-display');
        if (timeDisplay) {
            const duration = Math.ceil(currentText.length / 10);
            const minutes = Math.floor(duration / 60);
            const seconds = duration % 60;
            timeDisplay.textContent = `${minutes}:${seconds.toString().padStart(2, '0')} / ${minutes}:${seconds.toString().padStart(2, '0')}`;
        }
        
        mostrarNotificacion('Audio finalizado', 'success');
    };
    
    currentUtterance.onerror = function(event) {
        console.error('Error en síntesis de voz:', event);
        mostrarNotificacion('Error al reproducir audio. Intenta con otra voz.', 'error');
        isPlaying = false;
        const playBtn = document.getElementById('play-btn');
        if (playBtn) playBtn.textContent = '▶️';
        detenerProgresoVisual();
    };
    
    currentUtterance.onpause = function() {
        audioPausedTime = Date.now();
    };
    
    currentUtterance.onresume = function() {
        audioStartTime += (Date.now() - audioPausedTime);
    };
    
    // Reproducir con manejo de errores
    try {
        speechSynthesis.speak(currentUtterance);
        
        // Verificar que realmente comenzó la reproducción
        setTimeout(() => {
            if (!isPlaying && currentUtterance) {
                mostrarNotificacion('Problema con la voz seleccionada. Cambiando a voz por defecto...', 'warning');
                // Intentar con voz por defecto del sistema
                currentUtterance.voice = null;
                speechSynthesis.speak(currentUtterance);
            }
        }, 500);
        
    } catch (error) {
        console.error('Error al iniciar síntesis de voz:', error);
        mostrarNotificacion('Error al iniciar la reproducción de audio', 'error');
    }
}

function detenerAudio() {
    speechSynthesis.cancel();
    isPlaying = false;
    const playBtn = document.getElementById('play-btn');
    if (playBtn) playBtn.textContent = '▶️';
    
    detenerProgresoVisual();
}

function changeRealSpeed(delta) {
    currentSpeed = Math.max(0.5, Math.min(2.0, currentSpeed + delta));
    const speedDisplay = document.getElementById('speed-display');
    if (speedDisplay) {
        speedDisplay.textContent = currentSpeed.toFixed(1) + 'x';
    }
    
    // Si está reproduciendo, aplicar nueva velocidad
    if (isPlaying && currentUtterance) {
        const wasPlaying = isPlaying;
        detenerAudio();
        if (wasPlaying) {
            setTimeout(reproducirAudio, 100);
        }
    }
}

function iniciarProgresoVisual() {
    let startTime = Date.now();
    const estimatedDuration = Math.ceil(currentText.length / 10) * 1000; // Estimación basada en longitud del texto
    
    progressInterval = setInterval(() => {
        if (!isPlaying) {
            clearInterval(progressInterval);
            return;
        }
        
        const elapsed = Date.now() - startTime;
        const progress = Math.min((elapsed / estimatedDuration) * 100, 100);
        
        const progressBar = document.getElementById('progress-bar');
        if (progressBar) {
            progressBar.style.width = progress + '%';
        }
        
        const timeDisplay = document.getElementById('time-display');
        if (timeDisplay) {
            const elapsedSeconds = Math.floor(elapsed / 1000);
            const totalSeconds = Math.floor(estimatedDuration / 1000);
            const elapsedMin = Math.floor(elapsedSeconds / 60);
            const elapsedSec = elapsedSeconds % 60;
            const totalMin = Math.floor(totalSeconds / 60);
            const totalSec = totalSeconds % 60;
            
            timeDisplay.textContent = `${elapsedMin}:${elapsedSec.toString().padStart(2, '0')} / ${totalMin}:${totalSec.toString().padStart(2, '0')}`;
        }
        
        if (progress >= 100) {
            clearInterval(progressInterval);
        }
    }, 100);
}

function detenerProgresoVisual() {
    if (progressInterval) {
        clearInterval(progressInterval);
        progressInterval = null;
    }
}

function cambiarTamañoBraille(delta) {
    const brailleContent = document.getElementById('braille-content');
    if (brailleContent) {
        const currentSize = parseInt(brailleContent.style.fontSize) || 18;
        const newSize = Math.max(12, Math.min(32, currentSize + delta));
        brailleContent.style.fontSize = newSize + 'px';
    }
}

function descargarAudio(id) {
    const archivo = archivosSubidos.find(a => a.id == id);
    if (!archivo) return;
    
    mostrarNotificacion('Generando archivo de audio...', 'info');
    
    // Crear contenido de audio simulado (en una implementación real sería el audio generado)
    const audioContent = generarTextoDemo(archivo.nombre);
    
    setTimeout(() => {
        // Crear blob con el contenido del audio (simulado como texto)
        const blob = new Blob([`Archivo de audio para: ${archivo.nombre}\n\nContenido:\n${audioContent}`], 
            { type: 'text/plain' });
        
        // Crear enlace de descarga
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${archivo.nombre.replace(/[^a-z0-9]/gi, '_')}_audio.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        mostrarNotificacion('Audio descargado exitosamente', 'success');
    }, 1500);
}

function descargarBraille(id) {
    const archivo = archivosSubidos.find(a => a.id == id);
    if (!archivo) return;
    
    mostrarNotificacion('Generando archivo Braille...', 'info');
    
    setTimeout(() => {
        // Crear blob con el contenido Braille
        const brailleContent = archivo.brailleContent || generarBrailleDemo(archivo.nombre);
        const blob = new Blob([brailleContent], { type: 'text/plain;charset=utf-8' });
        
        // Crear enlace de descarga
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${archivo.nombre.replace(/[^a-z0-9]/gi, '_')}_braille.brf`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        mostrarNotificacion('Archivo Braille descargado exitosamente', 'success');
    }, 1500);
}

function descargarPDF(id) {
    const archivo = archivosSubidos.find(a => a.id == id);
    if (!archivo) return;
    
    mostrarNotificacion('Generando PDF...', 'info');
    
    setTimeout(() => {
        // Crear contenido PDF simulado
        const pdfContent = `%PDF-1.4
1 0 obj
<<
/Type /Catalog
/Pages 2 0 R
>>
endobj

2 0 obj
<<
/Type /Pages
/Kids [3 0 R]
/Count 1
>>
endobj

3 0 obj
<<
/Type /Page
/Parent 2 0 R
/MediaBox [0 0 612 792]
/Contents 4 0 R
>>
endobj

4 0 obj
<<
/Length 44
>>
stream
BT
/F1 12 Tf
72 720 Td
(${archivo.nombre}) Tj
ET
endstream
endobj

xref
0 5
0000000000 65535 f 
0000000009 00000 n 
0000000058 00000 n 
0000000115 00000 n 
0000000206 00000 n 
trailer
<<
/Size 5
/Root 1 0 R
>>
startxref
300
%%EOF`;
        
        const blob = new Blob([pdfContent], { type: 'application/pdf' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${archivo.nombre.replace(/[^a-z0-9]/gi, '_')}.pdf`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        mostrarNotificacion('PDF descargado exitosamente', 'success');
    }, 2000);
}

function imprimirBraille(id) {
    mostrarNotificacion('Preparando para impresión Braille...', 'info');
    setTimeout(() => {
        mostrarNotificacion('Archivo enviado a impresora Braille', 'success');
    }, 1500);
}

function compartirAudio(id) {
    cerrarModal();
    setTimeout(() => {
        const archivo = archivosSubidos.find(a => a.id == id);
        mostrarModalCompartir(archivo);
    }, 300);
}

function compartirBraille(id) {
    cerrarModal();
    setTimeout(() => {
        const archivo = archivosSubidos.find(a => a.id == id);
        mostrarModalCompartir(archivo);
    }, 300);
}

function compartirArchivo(id) {
    const archivo = archivosSubidos.find(a => a.id == id);
    if (!archivo) return;
    
    mostrarModalCompartir(archivo);
}

function mostrarModalCompartir(archivo) {
    document.getElementById('modal-title').textContent = 'Compartir material';
    document.getElementById('modal-body').innerHTML = `
        <div style="margin-bottom: 1rem;">
            <strong>Archivo:</strong> ${archivo.nombre}
        </div>
        <form onsubmit="procesarCompartir(event, '${archivo.id}')">
            <div class="form-group">
                <label for="emails-estudiantes">Correos de estudiantes (separados por comas)</label>
                <textarea id="emails-estudiantes" name="emails" rows="3" placeholder="estudiante1@email.com, estudiante2@email.com"></textarea>
            </div>
            <div class="form-group">
                <label for="mensaje-compartir">Mensaje personalizado (opcional)</label>
                <textarea id="mensaje-compartir" name="mensaje" rows="2" placeholder="Hola, les comparto el material de la clase..."></textarea>
            </div>
            <button type="submit" class="btn-primary btn-full">Enviar material</button>
        </form>
    `;
    document.getElementById('modal-overlay').classList.add('active');
}

function procesarCompartir(event, archivoId) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const emails = formData.get('emails').split(',').map(e => e.trim()).filter(e => e);
    
    cerrarModal();
    mostrarNotificacion(`Material compartido con ${emails.length} estudiante(s)`, 'success');
    estadisticas.estudiantesAlcanzados += emails.length;
    actualizarDashboard();
}

function mostrarModalConversion() {
    document.getElementById('modal-title').textContent = 'Convertir texto a audio';
    document.getElementById('modal-body').innerHTML = `
        <form onsubmit="procesarConversionTexto(event)">
            <div class="form-group">
                <label for="texto-conversion">Texto a convertir</label>
                <textarea id="texto-conversion" name="texto" rows="5" required placeholder="Escribe o pega el texto que quieres convertir a audio..."></textarea>
            </div>
            <div class="form-group">
                <label for="velocidad">Velocidad de lectura</label>
                <select id="velocidad" name="velocidad">
                    <option value="lenta">Lenta</option>
                    <option value="normal" selected>Normal</option>
                    <option value="rapida">Rápida</option>
                </select>
            </div>
            <button type="submit" class="btn-primary btn-full">Generar audio</button>
        </form>
    `;
    document.getElementById('modal-overlay').classList.add('active');
}

function procesarConversionTexto(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const texto = formData.get('texto');
    
    cerrarModal();
    mostrarNotificacion('Generando audio...', 'info');
    
    setTimeout(() => {
        estadisticas.audiosGenerados++;
        mostrarNotificacion('¡Audio generado exitosamente!', 'success');
        actualizarDashboard();
    }, 2000);
}

function actualizarDashboard() {
    if (document.querySelector('.dashboard')) {
        mostrarDashboard();
    }
}

function cerrarSesion() {
    usuarioActual = null;
    localStorage.removeItem('usuarioArcoEdu');
    location.reload();
}

// Notificaciones
function mostrarNotificacion(mensaje, tipo = 'info') {
    const notification = document.getElementById('notification');
    notification.textContent = mensaje;
    notification.className = `notification ${tipo}`;
    notification.classList.add('show');
    
    setTimeout(() => {
        notification.classList.remove('show');
    }, 4000);
}

function mostrarDashboardEstudiante() {
    document.querySelector('main').innerHTML = `
        <section class="dashboard">
            <div class="container">
                <div class="dashboard-header">
                    <div>
                        <h1>Mi Biblioteca - ArcoEdu</h1>
                        <p>Bienvenido, ${usuarioActual.nombre}</p>
                    </div>
                    <div>
                        <button class="btn-secondary" onclick="cerrarSesion()">Cerrar sesión</button>
                    </div>
                </div>

                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; margin-bottom: 2rem;">
                    <div style="background: #f8f9fa; padding: 2rem; border-radius: 15px;">
                        <h3>📚 Mis Materiales</h3>
                        <p>Tienes acceso a 12 materiales de estudio</p>
                        <div style="margin-top: 1rem;">
                            <div style="background: white; padding: 1rem; border-radius: 8px; margin-bottom: 0.5rem;">
                                <strong>📖 Cuento: El Príncipe y la Anciana</strong>
                                <div style="margin-top: 0.5rem;">
                                    <button onclick="reproducirMaterial('cuento1')" class="btn-primary btn-small">🎧 Escuchar</button>
                                    <button onclick="verBraille('cuento1')" class="btn-secondary btn-small">⠃ Braille</button>
                                </div>
                            </div>
                            <div style="background: white; padding: 1rem; border-radius: 8px; margin-bottom: 0.5rem;">
                                <strong>📄 Matemáticas: Fracciones</strong>
                                <div style="margin-top: 0.5rem;">
                                    <button onclick="reproducirMaterial('mate1')" class="btn-primary btn-small">🎧 Escuchar</button>
                                    <button onclick="verBraille('mate1')" class="btn-secondary btn-small">⠃ Braille</button>
                                </div>
                            </div>
                            <div style="background: white; padding: 1rem; border-radius: 8px;">
                                <strong>🌍 Ciencias: El Sistema Solar</strong>
                                <div style="margin-top: 0.5rem;">
                                    <button onclick="reproducirMaterial('ciencias1')" class="btn-primary btn-small">🎧 Escuchar</button>
                                    <button onclick="verBraille('ciencias1')" class="btn-secondary btn-small">⠃ Braille</button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div style="background: #f8f9fa; padding: 2rem; border-radius: 15px;">
                        <h3>🎧 Reproductor</h3>
                        <div id="reproductor-estudiante" style="text-align: center; padding: 2rem;">
                            <p style="color: #000;">Selecciona un material para comenzar a escuchar</p>
                            <div style="margin-top: 2rem;">
                                <button disabled class="btn-secondary">▶️ Reproducir</button>
                            </div>
                        </div>
                    </div>
                </div>

                <div style="background: #f8f9fa; padding: 2rem; border-radius: 15px;">
                    <h3>⚙️ Configuración de Accesibilidad</h3>
                    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 1rem; margin-top: 1rem;">
                        <div>
                            <label>Velocidad de lectura:</label>
                            <input type="range" min="0.5" max="2" step="0.1" value="1" onchange="cambiarVelocidadGlobal(this.value)" style="width: 100%; margin-top: 0.5rem;">
                            <span id="velocidad-actual">1.0x</span>
                        </div>
                        <div>
                            <label>Tamaño de texto Braille:</label>
                            <input type="range" min="12" max="32" step="2" value="18" onchange="cambiarTamañoGlobal(this.value)" style="width: 100%; margin-top: 0.5rem;">
                            <span id="tamaño-actual">18px</span>
                        </div>
                        <div>
                            <label>Modo de visualización:</label>
                            <select onchange="cambiarModoVisualizacion(this.value)" style="width: 100%; margin-top: 0.5rem;">
                                <option value="normal">Normal</option>
                                <option value="alto-contraste">Alto contraste</option>
                                <option value="daltonico">Amigable para daltónicos</option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    `;
}

function reproducirMaterial(id) {
    const materiales = {
        'cuento1': 'El Príncipe y la Anciana',
        'mate1': 'Matemáticas: Fracciones',
        'ciencias1': 'Ciencias: El Sistema Solar'
    };
    
    const reproductor = document.getElementById('reproductor-estudiante');
    reproductor.innerHTML = `
        <h4>🎧 ${materiales[id]}</h4>
        <div style="margin: 1rem 0;">
            <button onclick="toggleReproduccion()" class="btn-primary" id="btn-reproducir">▶️ Reproducir</button>
            <button onclick="detenerReproduccion()" class="btn-secondary">⏹️ Detener</button>
        </div>
        <div style="background: #e9ecef; height: 8px; border-radius: 4px; margin: 1rem 0;">
            <div id="progreso-material" style="background: #4a90e2; height: 100%; width: 0%; border-radius: 4px; transition: width 0.3s ease;"></div>
        </div>
        <p style="font-size: 0.9rem; color: #000;">
            "Había una vez un príncipe que vivía en un palacio muy grande..."
        </p>
    `;
}

function verBraille(id) {
    const materiales = {
        'cuento1': 'El Príncipe y la Anciana',
        'mate1': 'Matemáticas: Fracciones', 
        'ciencias1': 'Ciencias: El Sistema Solar'
    };
    
    const archivo = { 
        nombre: materiales[id], 
        brailleContent: generarBrailleDemo(materiales[id]) 
    };
    mostrarVisorBraille(archivo);
}

function enviarContacto(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const datos = Object.fromEntries(formData);
    
    mostrarNotificacion('Mensaje enviado correctamente. Te responderemos pronto.', 'success');
    event.target.reset();
}

function cambiarVelocidadGlobal(valor) {
    document.getElementById('velocidad-actual').textContent = parseFloat(valor).toFixed(1) + 'x';
}

function cambiarTamañoGlobal(valor) {
    document.getElementById('tamaño-actual').textContent = valor + 'px';
}

function cambiarModoVisualizacion(modo) {
    // Esta función se integraría con el sistema de accesibilidad
    mostrarNotificacion(`Modo cambiado a: ${modo}`, 'info');
}

let reproduciendo = false;

function toggleReproduccion() {
    const btn = document.getElementById('btn-reproducir');
    if (reproduciendo) {
        btn.textContent = '▶️ Reproducir';
        reproduciendo = false;
    } else {
        btn.textContent = '⏸️ Pausar';
        reproduciendo = true;
        simularProgreso();
    }
}

function detenerReproduccion() {
    const btn = document.getElementById('btn-reproducir');
    const progreso = document.getElementById('progreso-material');
    btn.textContent = '▶️ Reproducir';
    reproduciendo = false;
    if (progreso) progreso.style.width = '0%';
}

function simularProgreso() {
    if (!reproduciendo) return;
    const progreso = document.getElementById('progreso-material');
    if (progreso) {
        const ancho = parseFloat(progreso.style.width) || 0;
        if (ancho >= 100) {
            detenerReproduccion();
            return;
        }
        progreso.style.width = (ancho + 1) + '%';
        setTimeout(simularProgreso, 200);
    }
}

// Gestión de estudiantes
let estudiantes = [
    { id: 1, nombre: 'Ana García', email: 'ana@estudiante.com', necesidades: 'baja-vision', activo: true, ultimoAcceso: '2024-01-15' },
    { id: 2, nombre: 'Carlos López', email: 'carlos@estudiante.com', necesidades: 'ceguera', activo: true, ultimoAcceso: '2024-01-14' },
    { id: 3, nombre: 'María Rodríguez', email: 'maria@estudiante.com', necesidades: 'dislexia', activo: false, ultimoAcceso: '2024-01-10' },
    { id: 4, nombre: 'Juan Pérez', email: 'juan@estudiante.com', necesidades: 'otras', activo: true, ultimoAcceso: '2024-01-16' }
];

function mostrarEstudiantes() {
    document.getElementById('modal-title').textContent = '👥 Gestión de Estudiantes';
    document.getElementById('modal-body').innerHTML = `
        <div style="margin-bottom: 2rem;">
            <div style="display: flex; justify-content: between; align-items: center; margin-bottom: 1rem; gap: 1rem;">
                <h4>Lista de Estudiantes (${estudiantes.length})</h4>
                <button onclick="mostrarFormularioEstudiante()" class="btn-primary">➕ Agregar estudiante</button>
            </div>
            
            <div style="background: #f8f9fa; padding: 1rem; border-radius: 8px; margin-bottom: 1rem;">
                <strong>Código de acceso para estudiantes:</strong> 
                <span style="background: #4a90e2; color: white; padding: 0.25rem 0.75rem; border-radius: 15px; font-family: monospace;">EDU-${usuarioActual.email.substring(0,3).toUpperCase()}2024</span>
                <button onclick="copiarCodigo()" style="margin-left: 0.5rem; background: #000; color: white; border: none; padding: 0.25rem 0.5rem; border-radius: 3px; cursor: pointer;">📋 Copiar</button>
            </div>
            
            <div style="max-height: 400px; overflow-y: auto;">
                ${estudiantes.map(estudiante => `
                    <div style="background: white; padding: 1rem; border-radius: 8px; margin-bottom: 0.5rem; border: 1px solid #e9ecef;">
                        <div style="display: flex; justify-content: space-between; align-items: center;">
                            <div>
                                <strong>${estudiante.nombre}</strong>
                                <div style="font-size: 0.9rem; color: #000;">
                                    📧 ${estudiante.email} • 
                                    🔍 ${getNecesidadLabel(estudiante.necesidades)} • 
                                    📅 Último acceso: ${estudiante.ultimoAcceso}
                                </div>
                            </div>
                            <div style="display: flex; gap: 0.5rem; align-items: center;">
                                <span style="padding: 0.25rem 0.75rem; border-radius: 15px; font-size: 0.8rem; ${estudiante.activo ? 'background: #d4edda; color: #155724;' : 'background: #f8d7da; color: #721c24;'}">
                                    ${estudiante.activo ? '✅ Activo' : '❌ Inactivo'}
                                </span>
                                <button onclick="editarEstudiante(${estudiante.id})" class="btn-secondary btn-small">✏️ Editar</button>
                                <button onclick="toggleEstudianteActivo(${estudiante.id})" class="btn-secondary btn-small">
                                    ${estudiante.activo ? '🚫 Desactivar' : '✅ Activar'}
                                </button>
                            </div>
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
    document.getElementById('modal-overlay').classList.add('active');
}

function getNecesidadLabel(necesidad) {
    const labels = {
        'baja-vision': 'Baja visión',
        'ceguera': 'Ceguera total',
        'dislexia': 'Dislexia',
        'otras': 'Otras necesidades'
    };
    return labels[necesidad] || necesidad;
}

function copiarCodigo() {
    const codigo = `EDU-${usuarioActual.email.substring(0,3).toUpperCase()}2024`;
    navigator.clipboard.writeText(codigo).then(() => {
        mostrarNotificacion('Código copiado al portapapeles', 'success');
    }).catch(() => {
        mostrarNotificacion('No se pudo copiar el código', 'error');
    });
}

function mostrarFormularioEstudiante(estudianteId = null) {
    const estudiante = estudianteId ? estudiantes.find(e => e.id === estudianteId) : null;
    const esEdicion = !!estudiante;
    
    document.getElementById('modal-title').textContent = esEdicion ? 'Editar Estudiante' : 'Agregar Estudiante';
    document.getElementById('modal-body').innerHTML = `
        <form onsubmit="guardarEstudiante(event, ${estudianteId})">
            <div class="form-group">
                <label for="nombre-estudiante">Nombre completo</label>
                <input type="text" id="nombre-estudiante" name="nombre" required value="${estudiante?.nombre || ''}">
            </div>
            <div class="form-group">
                <label for="email-estudiante">Correo electrónico</label>
                <input type="email" id="email-estudiante" name="email" required value="${estudiante?.email || ''}">
            </div>
            <div class="form-group">
                <label for="necesidades-estudiante">Necesidades de accesibilidad</label>
                <select id="necesidades-estudiante" name="necesidades" required>
                    <option value="baja-vision" ${estudiante?.necesidades === 'baja-vision' ? 'selected' : ''}>Baja visión</option>
                    <option value="ceguera" ${estudiante?.necesidades === 'ceguera' ? 'selected' : ''}>Ceguera total</option>
                    <option value="dislexia" ${estudiante?.necesidades === 'dislexia' ? 'selected' : ''}>Dislexia</option>
                    <option value="otras" ${estudiante?.necesidades === 'otras' ? 'selected' : ''}>Otras necesidades</option>
                </select>
            </div>
            <div class="form-group">
                <label>
                    <input type="checkbox" name="activo" ${estudiante?.activo !== false ? 'checked' : ''}> 
                    Estudiante activo
                </label>
            </div>
            <div style="display: flex; gap: 1rem;">
                <button type="submit" class="btn-primary" style="flex: 1;">${esEdicion ? 'Actualizar' : 'Agregar'} estudiante</button>
                <button type="button" onclick="mostrarEstudiantes()" class="btn-secondary">Cancelar</button>
            </div>
        </form>
    `;
    document.getElementById('modal-overlay').classList.add('active');
}

function guardarEstudiante(event, estudianteId) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const datos = {
        nombre: formData.get('nombre'),
        email: formData.get('email'),
        necesidades: formData.get('necesidades'),
        activo: formData.has('activo'),
        ultimoAcceso: new Date().toISOString().split('T')[0]
    };

    if (estudianteId) {
        // Editar estudiante existente
        const index = estudiantes.findIndex(e => e.id === estudianteId);
        if (index !== -1) {
            estudiantes[index] = { ...estudiantes[index], ...datos };
            mostrarNotificacion('Estudiante actualizado correctamente', 'success');
        }
    } else {
        // Agregar nuevo estudiante
        const nuevoEstudiante = {
            id: Date.now(),
            ...datos
        };
        estudiantes.push(nuevoEstudiante);
        mostrarNotificacion('Estudiante agregado correctamente', 'success');
    }

    mostrarEstudiantes();
}

function editarEstudiante(id) {
    mostrarFormularioEstudiante(id);
}

function toggleEstudianteActivo(id) {
    const estudiante = estudiantes.find(e => e.id === id);
    if (estudiante) {
        estudiante.activo = !estudiante.activo;
        mostrarNotificacion(`Estudiante ${estudiante.activo ? 'activado' : 'desactivado'}`, 'success');
        mostrarEstudiantes();
    }
}

// Reportes y estadísticas
function mostrarReportes() {
    const reporteData = generarDatosReporte();
    
    document.getElementById('modal-title').textContent = '📊 Reportes y Estadísticas';
    document.getElementById('modal-body').innerHTML = `
        <div style="margin-bottom: 2rem;">
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; margin-bottom: 2rem;">
                <div style="background: #e3f2fd; padding: 1rem; border-radius: 8px; text-align: center;">
                    <div style="font-size: 2rem; font-weight: bold; color: #1976d2;">${reporteData.totalMateriales}</div>
                    <div style="font-size: 0.9rem; color: #000;">Materiales totales</div>
                </div>
                <div style="background: #f3e5f5; padding: 1rem; border-radius: 8px; text-align: center;">
                    <div style="font-size: 2rem; font-weight: bold; color: #7b1fa2;">${reporteData.totalAudios}</div>
                    <div style="font-size: 0.9rem; color: #000;">Audios generados</div>
                </div>
                <div style="background: #e8f5e8; padding: 1rem; border-radius: 8px; text-align: center;">
                    <div style="font-size: 2rem; font-weight: bold; color: #388e3c;">${reporteData.totalBraille}</div>
                    <div style="font-size: 0.9rem; color: #000;">Textos Braille</div>
                </div>
                <div style="background: #fff3e0; padding: 1rem; border-radius: 8px; text-align: center;">
                    <div style="font-size: 2rem; font-weight: bold; color: #f57c00;">${reporteData.estudiantesActivos}</div>
                    <div style="font-size: 0.9rem; color: #000;">Estudiantes activos</div>
                </div>
            </div>

            <div style="background: #f8f9fa; padding: 1.5rem; border-radius: 10px; margin-bottom: 2rem;">
                <h4 style="margin-bottom: 1rem; color: black;">📈 Uso por tipo de necesidad</h4>
                ${reporteData.usoNecesidades.map(item => `
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
                        <span>${item.tipo}</span>
                        <div style="display: flex; align-items: center; gap: 0.5rem;">
                            <div style="background: #e9ecef; height: 8px; width: 100px; border-radius: 4px;">
                                <div style="background: #4a90e2; height: 100%; width: ${item.porcentaje}%; border-radius: 4px;"></div>
                            </div>
                            <span style="font-weight: bold;">${item.cantidad}</span>
                        </div>
                    </div>
                `).join('')}
            </div>

            <div style="background: #f8f9fa; padding: 1.5rem; border-radius: 10px; margin-bottom: 2rem;">
                <h4 style="margin-bottom: 1rem;">📅 Actividad reciente</h4>
                ${reporteData.actividadReciente.map(actividad => `
                    <div style="padding: 0.75rem; background: white; border-radius: 5px; margin-bottom: 0.5rem; border-left: 4px solid #4a90e2;">
                        <div style="font-weight: bold;">${actividad.accion}</div>
                        <div style="font-size: 0.9rem; color: #000;">${actividad.fecha} • ${actividad.usuario}</div>
                    </div>
                `).join('')}
            </div>

            <div style="display: flex; gap: 1rem; justify-content: center;">
                <button onclick="exportarReporte()" class="btn-primary">📄 Exportar PDF</button>
                <button onclick="enviarReporte()" class="btn-secondary">📧 Enviar por email</button>
            </div>
        </div>
    `;
    document.getElementById('modal-overlay').classList.add('active');
}

function generarDatosReporte() {
    const estudiantesActivos = estudiantes.filter(e => e.activo).length;
    const necesidadesCounts = estudiantes.reduce((acc, est) => {
        acc[est.necesidades] = (acc[est.necesidades] || 0) + 1;
        return acc;
    }, {});

    const maxCount = Math.max(...Object.values(necesidadesCounts));
    
    return {
        totalMateriales: estadisticas.materialesSubidos,
        totalAudios: estadisticas.audiosGenerados,
        totalBraille: estadisticas.brailleGenerados,
        estudiantesActivos: estudiantesActivos,
        usoNecesidades: Object.entries(necesidadesCounts).map(([tipo, cantidad]) => ({
            tipo: getNecesidadLabel(tipo),
            cantidad,
            porcentaje: (cantidad / maxCount) * 100
        })),
        actividadReciente: [
            { accion: 'Audio generado para "Cuento del Príncipe"', fecha: '2024-01-16 14:30', usuario: 'Ana García' },
            { accion: 'Nuevo estudiante registrado', fecha: '2024-01-16 10:15', usuario: 'Carlos López' },
            { accion: 'Material convertido a Braille', fecha: '2024-01-15 16:45', usuario: 'María Rodríguez' },
            { accion: 'Documento subido: "Matemáticas Básicas"', fecha: '2024-01-15 09:20', usuario: usuarioActual.nombre },
            { accion: 'Reporte generado', fecha: '2024-01-14 11:30', usuario: usuarioActual.nombre }
        ]
    };
}

function exportarReporte() {
    mostrarNotificacion('Generando reporte PDF...', 'info');
    setTimeout(() => {
        mostrarNotificacion('Reporte PDF descargado exitosamente', 'success');
    }, 2000);
}

function enviarReporte() {
    mostrarNotificacion('Enviando reporte por email...', 'info');
    setTimeout(() => {
        mostrarNotificacion('Reporte enviado a tu correo electrónico', 'success');
    }, 1500);
}

function mostrarModalBraille() {
    document.getElementById('modal-title').textContent = 'Convertir texto a Braille';
    document.getElementById('modal-body').innerHTML = `
        <form onsubmit="procesarConversionBraille(event)">
            <div class="form-group">
                <label for="texto-braille">Texto a convertir</label>
                <textarea id="texto-braille" name="texto" rows="5" required placeholder="Escribe o pega el texto que quieres convertir a Braille..."></textarea>
            </div>
            <div class="form-group">
                <label for="formato-braille">Formato de salida</label>
                <select id="formato-braille" name="formato">
                    <option value="grado1">Braille Grado 1 (letra por letra)</option>
                    <option value="grado2">Braille Grado 2 (con contracciones)</option>
                </select>
            </div>
            <button type="submit" class="btn-primary btn-full">Generar Braille</button>
        </form>
    `;
    document.getElementById('modal-overlay').classList.add('active');
}

function procesarConversionBraille(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const texto = formData.get('texto');
    
    cerrarModal();
    mostrarNotificacion('Generando Braille...', 'info');
    
    setTimeout(() => {
        estadisticas.brailleGenerados++;
        const archivoBraille = {
            id: Date.now(),
            nombre: 'Texto convertido a Braille',
            brailleContent: convertirTextoABraille(texto)
        };
        mostrarVisorBraille(archivoBraille);
        actualizarDashboard();
    }, 2000);
}

function convertirTextoABraille(texto) {
    // Conversión básica de texto a Braille (simulada)
    const brailleMap = {
        'a': '⠁', 'b': '⠃', 'c': '⠉', 'd': '⠙', 'e': '⠑', 'f': '⠋', 'g': '⠛', 'h': '⠓', 'i': '⠊', 'j': '⠚',
        'k': '⠅', 'l': '⠇', 'm': '⠍', 'n': '⠝', 'o': '⠕', 'p': '⠏', 'q': '⠟', 'r': '⠗', 's': '⠎', 't': '⠞',
        'u': '⠥', 'v': '⠧', 'w': '⠺', 'x': '⠭', 'y': '⠽', 'z': '⠵',
        ' ': ' ', '.': '⠲', ',': '⠂', '?': '⠦', '!': '⠖', ':': '⠒', ';': '⠆', '-': '⠤',
        '1': '⠼⠁', '2': '⠼⠃', '3': '⠼⠉', '4': '⠼⠙', '5': '⠼⠑', '6': '⠼⠋', '7': '⠼⠛', '8': '⠼⠓', '9': '⠼⠊', '0': '⠼⠚'
    };

    return texto.toLowerCase().split('').map(char => brailleMap[char] || char).join('');
}

// Funciones del sistema de guía de voz
function mostrarModalGuiaVoz() {
    // Verificar si el usuario ya decidió no mostrar el modal
    const noMostrar = localStorage.getItem('arcoEdu_noMostrarGuiaVoz');
    if (noMostrar === 'true') {
        return;
    }
    
    document.getElementById('modal-guia-voz').classList.add('active');
    
    // Leer el contenido del modal automáticamente
    setTimeout(() => {
        hablarTexto('Bienvenido a ArcoEdu. ¿Necesitas ayuda para navegar por la página? Nuestro asistente de voz puede guiarte paso a paso.', true);
    }, 500);
}

function cerrarModalGuiaVoz() {
    // Guardar preferencia si está marcada
    const noMostrar = document.getElementById('no-mostrar-guia');
    if (noMostrar && noMostrar.checked) {
        localStorage.setItem('arcoEdu_noMostrarGuiaVoz', 'true');
    }
    
    document.getElementById('modal-guia-voz').classList.remove('active');
    speechSynthesis.cancel(); // Detener cualquier voz activa
}

function activarGuiaVoz() {
    guiaVozActiva = true;
    localStorage.setItem('arcoEdu_guiaVozActiva', 'true');
    cerrarModalGuiaVoz();
    
    // Mensaje de bienvenida
    hablarTexto('Guía de voz activada. Te ayudaré a navegar por ArcoEdu. Usa Tab para moverte entre elementos, Espacio para pausar la voz, y Escape para desactivar la guía.', true);
    
    // Configurar eventos de navegación
    configurarEventosGuiaVoz();
    
    // Mostrar indicador visual
    mostrarIndicadorGuiaVoz();
    
    mostrarNotificacion('Guía de voz activada. Presiona Escape para desactivar.', 'success');
}

function desactivarGuiaVoz() {
    guiaVozActiva = false;
    localStorage.setItem('arcoEdu_guiaVozActiva', 'false');
    speechSynthesis.cancel();
    
    // Remover eventos
    removerEventosGuiaVoz();
    
    // Ocultar indicador
    ocultarIndicadorGuiaVoz();
    
    hablarTexto('Guía de voz desactivada.', true);
    mostrarNotificacion('Guía de voz desactivada', 'info');
}

function hablarTexto(texto, prioridad = false) {
    if (!guiaVozActiva && !prioridad) return;
    
    // Cancelar voz anterior si es prioritaria
    if (prioridad) {
        speechSynthesis.cancel();
    }
    
    guiaVozUtterance = new SpeechSynthesisUtterance(texto);
    guiaVozUtterance.rate = guiaVozVelocidad;
    guiaVozUtterance.volume = guiaVozVolumen;
    guiaVozUtterance.pitch = 1.0;
    guiaVozUtterance.lang = 'es-ES';
    
    // Usar la mejor voz disponible
    if (selectedVoice) {
        guiaVozUtterance.voice = selectedVoice;
    }
    
    speechSynthesis.speak(guiaVozUtterance);
}

function configurarEventosGuiaVoz() {
    // Eventos de teclado
    document.addEventListener('keydown', manejarTecladoGuiaVoz);
    
    // Eventos de mouse y focus
    document.addEventListener('mouseover', manejarMouseOverGuiaVoz);
    document.addEventListener('focus', manejarFocusGuiaVoz, true);
    
    // Eventos de clic
    document.addEventListener('click', manejarClickGuiaVoz);
}

function removerEventosGuiaVoz() {
    document.removeEventListener('keydown', manejarTecladoGuiaVoz);
    document.removeEventListener('mouseover', manejarMouseOverGuiaVoz);
    document.removeEventListener('focus', manejarFocusGuiaVoz, true);
    document.removeEventListener('click', manejarClickGuiaVoz);
}

function manejarTecladoGuiaVoz(event) {
    if (!guiaVozActiva) return;
    
    switch(event.key) {
        case 'Escape':
            event.preventDefault();
            desactivarGuiaVoz();
            break;
            
        case ' ':
            if (event.target.tagName !== 'INPUT' && event.target.tagName !== 'TEXTAREA') {
                event.preventDefault();
                togglePausaGuiaVoz();
            }
            break;
            
        case 'F1':
            event.preventDefault();
            mostrarAyudaNavegacion();
            break;
            
        case 'Tab':
            // Describir el elemento que va a recibir focus
            setTimeout(() => {
                const elementoFocused = document.activeElement;
                if (elementoFocused) {
                    describirElemento(elementoFocused);
                }
            }, 100);
            break;
    }
}

function manejarMouseOverGuiaVoz(event) {
    if (!guiaVozActiva || guiaVozPausada) return;
    
    const elemento = event.target;
    if (elemento !== elementoActual) {
        elementoActual = elemento;
        describirElemento(elemento);
    }
}

function manejarFocusGuiaVoz(event) {
    if (!guiaVozActiva) return;
    
    const elemento = event.target;
    describirElemento(elemento);
}

function manejarClickGuiaVoz(event) {
    if (!guiaVozActiva) return;
    
    const elemento = event.target;
    const descripcion = obtenerDescripcionClick(elemento);
    if (descripcion) {
        hablarTexto(descripcion);
    }
}

function describirElemento(elemento) {
    if (!elemento || !guiaVozActiva || guiaVozPausada) return;
    
    const descripcion = obtenerDescripcionElemento(elemento);
    if (descripcion) {
        hablarTexto(descripcion);
    }
}

function obtenerDescripcionElemento(elemento) {
    const tag = elemento.tagName.toLowerCase();
    const texto = elemento.textContent?.trim() || '';
    const ariaLabel = elemento.getAttribute('aria-label') || '';
    const title = elemento.getAttribute('title') || '';
    const placeholder = elemento.getAttribute('placeholder') || '';
    
    // Elementos específicos
    switch(tag) {
        case 'button':
            return `Botón: ${ariaLabel || texto || 'sin etiqueta'}`;
            
        case 'a':
            const href = elemento.getAttribute('href');
            if (href && href.startsWith('#')) {
                return `Enlace interno: ${texto}`;
            }
            return `Enlace: ${texto}`;
            
        case 'input':
            const type = elemento.getAttribute('type') || 'text';
            const label = obtenerLabelParaInput(elemento);
            return `Campo ${type}: ${label || placeholder || 'sin etiqueta'}`;
            
        case 'select':
            const labelSelect = obtenerLabelParaInput(elemento);
            return `Lista desplegable: ${labelSelect || 'sin etiqueta'}`;
            
        case 'textarea':
            const labelTextarea = obtenerLabelParaInput(elemento);
            return `Área de texto: ${labelTextarea || placeholder || 'sin etiqueta'}`;
            
        case 'h1':
        case 'h2':
        case 'h3':
        case 'h4':
        case 'h5':
        case 'h6':
            return `Título nivel ${tag.charAt(1)}: ${texto}`;
            
        case 'nav':
            return 'Navegación principal';
            
        case 'main':
            return 'Contenido principal';
            
        case 'header':
            return 'Encabezado de la página';
            
        case 'footer':
            return 'Pie de página';
            
        case 'section':
            const sectionId = elemento.getAttribute('id');
            return `Sección: ${sectionId || 'sin nombre'}`;
            
        default:
            // Para elementos con texto significativo
            if (texto.length > 0 && texto.length < 100) {
                return texto;
            }
            return null;
    }
}

function obtenerLabelParaInput(input) {
    const id = input.getAttribute('id');
    if (id) {
        const label = document.querySelector(`label[for="${id}"]`);
        if (label) {
            return label.textContent.trim();
        }
    }
    
    // Buscar label padre
    const labelPadre = input.closest('label');
    if (labelPadre) {
        return labelPadre.textContent.replace(input.value || '', '').trim();
    }
    
    return null;
}

function obtenerDescripcionClick(elemento) {
    const tag = elemento.tagName.toLowerCase();
    const texto = elemento.textContent?.trim() || '';
    
    switch(tag) {
        case 'button':
            return `Activando: ${texto}`;
        case 'a':
            return `Navegando a: ${texto}`;
        default:
            return null;
    }
}

function togglePausaGuiaVoz() {
    if (guiaVozPausada) {
        guiaVozPausada = false;
        hablarTexto('Guía de voz reanudada', true);
    } else {
        speechSynthesis.cancel();
        guiaVozPausada = true;
        // No usar hablarTexto aquí para evitar recursión
        const utterance = new SpeechSynthesisUtterance('Guía de voz pausada');
        utterance.rate = guiaVozVelocidad;
        utterance.volume = guiaVozVolumen;
        speechSynthesis.speak(utterance);
    }
}

function mostrarAyudaNavegacion() {
    const ayuda = `
        Ayuda de navegación de ArcoEdu:
        Presiona Tab para moverte al siguiente elemento.
        Presiona Shift más Tab para ir al elemento anterior.
        Presiona Enter para activar botones y enlaces.
        Presiona Espacio para pausar o reanudar la guía de voz.
        Presiona Escape para desactivar la guía de voz.
        Presiona F1 para escuchar esta ayuda de nuevo.
    `;
    hablarTexto(ayuda, true);
}

function mostrarIndicadorGuiaVoz() {
    const indicador = document.createElement('div');
    indicador.id = 'indicador-guia-voz';
    indicador.innerHTML = `
        <div style="
            position: fixed;
            top: 20px;
            right: 20px;
            background: #4a90e2;
            color: white;
            padding: 0.75rem 1rem;
            border-radius: 25px;
            box-shadow: 0 4px 15px rgba(74, 144, 226, 0.3);
            z-index: 9999;
            font-size: 0.9rem;
            display: flex;
            align-items: center;
            gap: 0.5rem;
            animation: pulseGuia 2s infinite;
        ">
            🔊 Guía de voz activa
            <button onclick="desactivarGuiaVoz()" style="
                background: rgba(255,255,255,0.2);
                border: none;
                color: white;
                padding: 0.25rem 0.5rem;
                border-radius: 15px;
                cursor: pointer;
                font-size: 0.8rem;
            ">ESC</button>
        </div>
    `;
    
    document.body.appendChild(indicador);
    
    // Agregar animación CSS
    if (!document.getElementById('guia-voz-styles')) {
        const styles = document.createElement('style');
        styles.id = 'guia-voz-styles';
        styles.textContent = `
            @keyframes pulseGuia {
                0%, 100% { opacity: 1; }
                50% { opacity: 0.7; }
            }
        `;
        document.head.appendChild(styles);
    }
}

function ocultarIndicadorGuiaVoz() {
    const indicador = document.getElementById('indicador-guia-voz');
    if (indicador) {
        indicador.remove();
    }
}

// Initialize everything
document.addEventListener('DOMContentLoaded', function() {
    loadAccessibilityPreference();
    initSmoothScrolling();

    // Initialize Element SDK
    if (window.elementSdk) {
        window.elementSdk.init({
            defaultConfig,
            onConfigChange,
            mapToCapabilities,
            mapToEditPanelValues
        });
    }

    // Mostrar modal de guía de voz después de un breve delay
    setTimeout(() => {
        mostrarModalGuiaVoz();
    }, 1500);

    // Verificar si la guía de voz estaba activa
    const guiaActiva = localStorage.getItem('arcoEdu_guiaVozActiva');
    if (guiaActiva === 'true') {
        setTimeout(() => {
            activarGuiaVoz();
        }, 2000);
    }
});
