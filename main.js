// =================================================================
// 1. CONFIGURACIÓN Y ESTADO GLOBAL
// =================================================================

// Configuración predeterminada (para la funcionalidad del SDK)
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

// Variables de estado de la aplicación
let currentAccessibilityMode = 'normal';
let usuarioActual = null;
let archivosSubidos = []; // Almacena los archivos subidos
let estadisticas = {
    materialesSubidos: 0,
    audiosGenerados: 0,
    brailleGenerados: 0,
    estudiantesAlcanzados: 0
};

// Gestión de estudiantes (simulación)
let estudiantes = [
    { id: 1, nombre: 'Ana García', email: 'ana@estudiante.com', necesidades: 'baja-vision', activo: true, ultimoAcceso: '2024-01-15' },
    { id: 2, nombre: 'Carlos López', email: 'carlos@estudiante.com', necesidades: 'ceguera', activo: true, ultimoAcceso: '2024-01-14' },
    { id: 3, nombre: 'María Rodríguez', email: 'maria@estudiante.com', necesidades: 'dislexia', activo: false, ultimoAcceso: '2024-01-10' },
    { id: 4, nombre: 'Juan Pérez', email: 'juan@estudiante.com', necesidades: 'otras', activo: true, ultimoAcceso: '2024-01-16' }
];

// Sistema de guía de voz y Audio (Web Speech API)
let guiaVozActiva = false;
let guiaVozUtterance = null;
let speechSynthesis = window.speechSynthesis;
let currentAudioUtterance = null; // Para controlar la reproducción

// =================================================================
// 2. FUNCIONES DE ACCESIBILIDAD Y UI
// =================================================================

function toggleAccessibilityMode() {
    const modes = ['normal', 'dark', 'colorblind'];
    const currentIndex = modes.indexOf(currentAccessibilityMode);
    const nextIndex = (currentIndex + 1) % modes.length;
    currentAccessibilityMode = modes[nextIndex];
    
    applyAccessibilityMode(currentAccessibilityMode);
    localStorage.setItem('accessibilityMode', currentAccessibilityMode);
}

function applyAccessibilityMode(mode) {
    const toggle = document.querySelector('.accessibility-toggle');
    if (!toggle) return; 

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

function loadAccessibilityPreference() {
    const savedMode = localStorage.getItem('accessibilityMode') || 'normal';
    currentAccessibilityMode = savedMode;
    applyAccessibilityMode(savedMode);
}

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

function activarGuiaVoz() {
    guiaVozActiva = true;
    localStorage.setItem('guiaVoz', 'true');
    if (speechSynthesis) {
        guiaVozUtterance = new SpeechSynthesisUtterance("Modo de guía de voz activado. Puede comenzar a navegar.");
        guiaVozUtterance.lang = 'es-ES';
        speechSynthesis.speak(guiaVozUtterance);
    }
    document.getElementById('modal-guia-voz')?.classList.remove('active'); 
    document.querySelector('.accessibility-toggle').title = "Guía de voz activa";
}

function mostrarNotificacion(mensaje, tipo = 'info') {
    const notification = document.getElementById('notification');
    if (!notification) return;

    notification.className = `notification ${tipo}`; 
    notification.textContent = mensaje;
    
    notification.classList.add('show');
    
    setTimeout(() => {
        notification.classList.remove('show');
    }, 3000);
}


// =================================================================
// 3. FUNCIONES MODALES Y AUTENTICACIÓN
// =================================================================

function cerrarModal() {
    document.getElementById('modal-overlay').classList.remove('active');
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
            <div class="form-group">
                <label for="institucion">Institución educativa</label>
                <input type="text" id="institucion" name="institucion" required placeholder="Ej: Escuela Primaria San Martín">
            </div>
            <div class="form-group">
                <label for="rol">Rol</label>
                <select id="rol" name="rol" required>
                    <option value="">Selecciona tu rol</option>
                    <option value="docente">Docente</option>
                    <option value="estudiante">Estudiante</option>
                    <option value="directivo">Directivo</option>
                    <option value="coordinador">Coordinador pedagógico</option>
                    <option value="otro">Otro</option>
                </select>
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
            <p class="text-muted">¿Eres estudiante? 
                <button class="link-button" onclick="mostrarModalRegistroEstudiante()">Regístrate como estudiante</button>
            </p>
        </div>
    `;
    document.getElementById('modal-overlay').classList.add('active');
}

function mostrarModalRegistroEstudiante() {
    document.getElementById('modal-title').textContent = 'Registro para Estudiantes';
    document.getElementById('modal-body').innerHTML = `
        <p>Formulario de registro simple para alumnos.</p>
        <form onsubmit="procesarRegistro(event)">
            <div class="form-group">
                <label for="nombre-est">Nombre completo</label>
                <input type="text" id="nombre-est" name="nombre" required placeholder="Ej: Juan Pérez">
            </div>
            <div class="form-group">
                <label for="codigo-inst">Código de Institución (Opcional)</label>
                <input type="text" id="codigo-inst" name="institucion" placeholder="EJ: ABC1234">
            </div>
            <input type="hidden" name="rol" value="estudiante">
            <button type="submit" class="btn-primary btn-full">Registrarme como estudiante</button>
        </form>
        <div class="text-center" style="margin-top: 1rem;">
            <button class="link-button" onclick="mostrarModalRegistro()">Volver al registro principal</button>
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

function enviarContacto(event) {
    event.preventDefault();
    mostrarNotificacion('¡Mensaje enviado! Te responderemos pronto.', 'success');
    event.target.reset(); 
}


function procesarRegistro(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const datos = Object.fromEntries(formData);
    
    usuarioActual = {
        nombre: datos.nombre,
        email: datos.email || 'demo@arcoedu.org',
        institucion: datos.institucion || 'N/A',
        rol: datos.rol || 'estudiante'
    };
    
    localStorage.setItem('usuarioArcoEdu', JSON.stringify(usuarioActual));
    
    cerrarModal();
    mostrarNotificacion('¡Cuenta creada exitosamente! Bienvenido a ArcoEdu', 'success');
    
    setTimeout(mostrarDashboard, 1500);
}

function procesarLogin(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const datos = Object.fromEntries(formData);
    
    usuarioActual = {
        nombre: 'Usuario Demo',
        email: datos.email,
        institucion: 'Institución Demo',
        rol: 'docente'
    };
    
    localStorage.setItem('usuarioArcoEdu', JSON.stringify(usuarioActual));
    
    cerrarModal();
    mostrarNotificacion('¡Sesión iniciada correctamente!', 'success');
    
    setTimeout(mostrarDashboard, 1500);
}

function procesarRecuperacion(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const email = formData.get('email');
    
    cerrarModal();
    mostrarNotificacion(`Enlace de recuperación enviado a ${email}`, 'info');
}


// =================================================================
// 4. FUNCIONES DEL DASHBOARD Y ARCHIVOS
// =================================================================

function mostrarDashboard() {
    if (!usuarioActual) return;
    
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

function cerrarSesion() {
    usuarioActual = null;
    localStorage.removeItem('usuarioArcoEdu');
    mostrarNotificacion('Sesión cerrada.', 'info');
    setTimeout(() => window.location.reload(), 1000); 
}

function actualizarDashboard() {
    if (document.querySelector('.dashboard')) {
        mostrarDashboard();
    }
}

// Funciones de Acciones Rápidas (Stubs)
function mostrarModalConversion() {
    mostrarNotificacion("Abriendo modal para convertir a audio...", "info");
}
function mostrarModalBraille() {
    mostrarNotificacion("Abriendo opciones de Braille digital...", "info");
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

function mostrarEstudiantes() {
    mostrarNotificacion("Accediendo a la gestión de estudiantes...", "info");
    document.getElementById('modal-title').textContent = '👥 Gestión de Estudiantes';
    document.getElementById('modal-body').innerHTML = `
        <div style="margin-bottom: 2rem;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; gap: 1rem;">
                <h4>Lista de Estudiantes (${estudiantes.length})</h4>
                <button onclick="mostrarFormularioEstudiante()" class="btn-primary">➕ Agregar estudiante</button>
            </div>
            
            <div style="background: #f8f9fa; padding: 1rem; border-radius: 8px; margin-bottom: 1rem;">
                <strong>Código de acceso para estudiantes:</strong> 
                <span style="background: #4a90e2; color: white; padding: 0.25rem 0.75rem; border-radius: 15px; font-family: monospace;">EDU-${usuarioActual.email.substring(0,3).toUpperCase()}2024</span>
                <button onclick="copiarCodigo()" style="margin-left: 0.5rem; background: #6c757d; color: white; border: none; padding: 0.25rem 0.5rem; border-radius: 3px; cursor: pointer;">📋 Copiar</button>
            </div>
            
            <div style="max-height: 400px; overflow-y: auto;">
                ${estudiantes.map(estudiante => `
                    <div style="background: white; padding: 1rem; border-radius: 8px; margin-bottom: 0.5rem; border: 1px solid #e9ecef;">
                        <div style="display: flex; justify-content: space-between; align-items: center;">
                            <div>
                                <strong>${estudiante.nombre}</strong>
                                <div style="font-size: 0.9rem; color: #6c757d;">
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

function generarDatosReporte() {
    const estudiantesActivos = estudiantes.filter(e => e.activo).length;
    const necesidadesCounts = estudiantes.reduce((acc, est) => {
        acc[est.necesidades] = (acc[est.necesidades] || 0) + 1;
        return acc;
    }, {});

    const maxCount = Math.max(...Object.values(necesidadesCounts), 1);
    
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

function mostrarReportes() {
    mostrarNotificacion("Generando reportes de uso...", "info");
    const reporteData = generarDatosReporte();
    
    document.getElementById('modal-title').textContent = '📊 Reportes y Estadísticas';
    document.getElementById('modal-body').innerHTML = `
        <div style="margin-bottom: 2rem;">
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; margin-bottom: 2rem;">
                <div style="background: #e3f2fd; padding: 1rem; border-radius: 8px; text-align: center;">
                    <div style="font-size: 2rem; font-weight: bold; color: #1976d2;">${reporteData.totalMateriales}</div>
                    <div style="font-size: 0.9rem; color: #666;">Materiales totales</div>
                </div>
                <div style="background: #f3e5f5; padding: 1rem; border-radius: 8px; text-align: center;">
                    <div style="font-size: 2rem; font-weight: bold; color: #7b1fa2;">${reporteData.totalAudios}</div>
                    <div style="font-size: 0.9rem; color: #666;">Audios generados</div>
                </div>
                <div style="background: #e8f5e8; padding: 1rem; border-radius: 8px; text-align: center;">
                    <div style="font-size: 2rem; font-weight: bold; color: #388e3c;">${reporteData.totalBraille}</div>
                    <div style="font-size: 0.9rem; color: #666;">Textos Braille</div>
                </div>
                <div style="background: #fff3e0; padding: 1rem; border-radius: 8px; text-align: center;">
                    <div style="font-size: 2rem; font-weight: bold; color: #f57c00;">${reporteData.estudiantesActivos}</div>
                    <div style="font-size: 0.9rem; color: #666;">Estudiantes activos</div>
                </div>
            </div>

            <div style="background: #f8f9fa; padding: 1.5rem; border-radius: 10px; margin-bottom: 2rem;">
                <h4 style="margin-bottom: 1rem;">📈 Uso por tipo de necesidad</h4>
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
                        <div style="font-size: 0.9rem; color: #6c757d;">${actividad.fecha} • ${actividad.usuario}</div>
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

function compartirArchivo(id) {
    mostrarNotificacion("Generando enlace para compartir el archivo...", "info");
}


// --- MANEJO DE ARCHIVOS ---

function generarIdUnico() {
    return crypto.randomUUID ? crypto.randomUUID() : Date.now() + '-' + Math.floor(Math.random() * 1000000);
}

function formatearTamaño(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

function manejarArchivos(event) {
    const archivos = Array.from(event.target.files);
    procesarArchivos(archivos);
    event.target.value = ""; 
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

async function procesarArchivos(archivos) {
    if (!archivos || archivos.length === 0) return;

    const resultados = await Promise.all(
        archivos.map(async (archivo) => {
            try {
                const contenido = await leerArchivo(archivo);
                const nuevoArchivo = {
                    id: generarIdUnico(),
                    nombre: archivo.name,
                    tamaño: formatearTamaño(archivo.size),
                    fecha: new Date().toLocaleDateString(),
                    tipo: archivo.type,
                    contenido // Contenido extraído del archivo (texto)
                };
                archivosSubidos.unshift(nuevoArchivo);
                estadisticas.materialesSubidos++;
                return { exito: true, nombre: archivo.name };
            } catch (err) {
                console.error("Error leyendo archivo:", err);
                return { exito: false, nombre: archivo.name };
            }
        })
    );

    const exitosos = resultados.filter(r => r.exito).length;
    mostrarNotificacion(`${exitosos} archivo(s) subido(s) correctamente`, 'success');
    actualizarDashboard();
}

async function leerArchivo(archivo) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        // Archivos de texto simples
        if (archivo.name.endsWith('.txt')) {
            reader.onload = () => {
                resolve(reader.result);
            };
            reader.readAsText(archivo);
        }

        // Archivos PDF reales
        else if (archivo.name.endsWith('.pdf')) {
            mostrarNotificacion(`Extrayendo texto real de ${archivo.name}...`, 'info');
            reader.onload = async function() {
                try {
                    const typedarray = new Uint8Array(this.result);
                    const pdf = await pdfjsLib.getDocument({ data: typedarray }).promise;
                    let texto = '';
                    for (let i = 1; i <= pdf.numPages; i++) {
                        const page = await pdf.getPage(i);
                        const content = await page.getTextContent();
                        const pageText = content.items.map(item => item.str).join(' ');
                        texto += pageText + '\n';
                    }
                    resolve(texto.trim());
                } catch (error) {
                    reject('Error al leer el PDF: ' + error.message);
                }
            };
            reader.readAsArrayBuffer(archivo);
        }

        // Archivos DOCX reales
        else if (archivo.name.endsWith('.docx')) {
            mostrarNotificacion(`Extrayendo texto real de ${archivo.name}...`, 'info');
            reader.onload = async function() {
                try {
                    const arrayBuffer = this.result;
                    const result = await mammoth.extractRawText({ arrayBuffer });
                    resolve(result.value.trim());
                } catch (error) {
                    reject('Error al leer el DOCX: ' + error.message);
                }
            };
            reader.readAsArrayBuffer(archivo);
        }

        // Formato no soportado
        else {
            reject('Formato de archivo no soportado. Solo se admiten .txt, .pdf o .docx');
        }
    });
}


// --- CONVERSIÓN DE AUDIO Y BRAILLE (SOLUCIONES GRATUITAS FRONTEND) ---

async function convertirTextoAAudio(archivo) {
    // 🎧 Solución gratuita: Utiliza Web Speech API para REPRODUCIR el audio en tiempo real.
    // Detiene cualquier reproducción anterior
    if (speechSynthesis.speaking) {
        speechSynthesis.cancel();
    }
    
    // Web Speech API es limitado, usamos el contenido extraído
    const textoAConvertir = archivo.contenido; 
    
    currentAudioUtterance = new SpeechSynthesisUtterance(textoAConvertir);
    currentAudioUtterance.lang = "es-ES";
    currentAudioUtterance.rate = 1.0; // Velocidad normal
    
    currentAudioUtterance.onend = () => {
        mostrarNotificacion(`Reproducción de audio de ${archivo.nombre} finalizada.`, 'info');
    };
    currentAudioUtterance.onerror = (event) => {
        mostrarNotificacion(`Error de voz: ${event.error}`, 'error');
    };
    
    speechSynthesis.speak(currentAudioUtterance);
    mostrarNotificacion(`Reproduciendo ${archivo.nombre} con voz. (Presiona de nuevo para pausar/reanudar)`, 'success');

    return Promise.resolve();
}


async function convertirTextoABraille(archivo) {
    // ⠃ Solución gratuita: Simulación de Braille Grado 1 (sin contracciones)
    const mapaBraille = {
        'a': '⠁', 'b': '⠃', 'c': '⠉', 'd': '⠙', 'e': '⠑', 'f': '⠋',
        'g': '⠛', 'h': '⠓', 'i': '⠊', 'j': '⠚', 'k': '⠅', 'l': '⠇',
        'm': '⠍', 'n': '⠝', 'o': '⠕', 'p': '⠏', 'q': '⠟', 'r': '⠗',
        's': '⠎', 't': '⠞', 'u': '⠥', 'v': '⠧', 'w': '⠺', 'x': '⠭',
        'y': '⠽', 'z': '⠵', ' ': '⠀', '\n': '\n', 
        '.': '⠲', ',': '⠂', '!': '⠖', '?': '⠢', '-': '⠤', '(': '⠐⠣', ')': '⠐⠜'
    };

    let textoBraille = '';
    // Límite para evitar sobrecarga en la demostración
    let textoLimitado = archivo.contenido.substring(0, 3000); 

    for (let char of textoLimitado.toLowerCase()) {
        textoBraille += mapaBraille[char] || char; 
    }

    // Crea y descarga el archivo .txt con el Braille simulado
    const blob = new Blob([textoBraille], { type: "text/plain;charset=utf-8" });
    const enlace = document.createElement("a");
    enlace.href = URL.createObjectURL(blob);
    enlace.download = archivo.nombre.replace(/\.[^/.]+$/, "") + "_braille_simulado.txt";
    enlace.click();

    mostrarNotificacion("Braille (Grado 1 - Simulado) generado y descargado.", 'success');
    return Promise.resolve();
}

// ** FUNCIÓN PRINCIPAL DE CONVERSIÓN (MODIFICADA para usar solo el Frontend) **
async function convertirArchivo(id, tipo) {
    const archivo = archivosSubidos.find(a => a.id === id);
    if (!archivo || !archivo.contenido) {
        mostrarNotificacion("Archivo o contenido no encontrado/legible. ¡Intenta subir un TXT!", "error");
        return;
    }

    try {
        if (tipo === 'audio') {
             if (speechSynthesis.speaking && currentAudioUtterance && currentAudioUtterance.text === archivo.contenido) {
                // Pausar/Reanudar si es el mismo audio
                if (speechSynthesis.paused) {
                    speechSynthesis.resume();
                    mostrarNotificacion("Reproducción reanudada.", 'info');
                } else {
                    speechSynthesis.pause();
                    mostrarNotificacion("Reproducción pausada.", 'info');
                }
             } else {
                // Iniciar nuevo audio
                await convertirTextoAAudio(archivo);
                estadisticas.audiosGenerados++;
             }

        } else if (tipo === 'braille') {
            await convertirTextoABraille(archivo);
            estadisticas.brailleGenerados++;
        }
        
        actualizarDashboard();

    } catch (error) {
        console.error(error);
        mostrarNotificacion("Error en el proceso de conversión: " + error.message, "error");
    }
}


// =================================================================
// 5. INICIALIZACIÓN DE LA APLICACIÓN
// =================================================================

// Stubs para evitar ReferenceError si el código llama a estas funciones
function onConfigChange(config) { /* Simulación */ }
function mapToCapabilities(config) { return {}; }
function mapToEditPanelValues(config) { return new Map(); }

document.addEventListener('DOMContentLoaded', () => {
    // 1. Aplicar estilos y accesibilidad
    loadAccessibilityPreference();

    // 2. Inicializar desplazamiento suave
    initSmoothScrolling();

    // 3. Cargar usuario y renderizar Dashboard si hay sesión
    const savedUser = localStorage.getItem('usuarioArcoEdu');
    if (savedUser) {
        usuarioActual = JSON.parse(savedUser);
        mostrarDashboard();
    }
    
    // 4. Inicializar voces (es importante para que la Web Speech API funcione bien)
    if (speechSynthesis.onvoiceschanged !== undefined) {
        speechSynthesis.onvoiceschanged = () => {
             // Voces cargadas.
        };
    }
});