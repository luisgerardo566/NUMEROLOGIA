document.addEventListener('DOMContentLoaded', async () => {
    // --- INICIALIZACIÓN DE SUPABASE ---
    // Asegúrate de que estas credenciales sean las mismas que usas en otras páginas
    // Idealmente, las tendrías en un solo lugar si usaras módulos, pero para HTMLs separados, esto funciona.
    const SUPABASE_URL = 'https://sbfukuzscasnoezycqmi.supabase.co'; // ¡REEMPLAZA CON TU URL REAL!
    const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNiZnVrdXpzY2Fzbm9lenljcW1pIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg2NTI0MzUsImV4cCI6MjA2NDIyODQzNX0.jcyo8gk2bP61EezSyDJDMBnFclaFW53GAXcqHDwHUMA'; // ¡REEMPLAZA CON TU KEY REAL!
    let supabaseClient = null;

    try {
        if (SUPABASE_URL && SUPABASE_URL !== 'TU_URL_DE_PROYECTO_SUPABASE' && SUPABASE_ANON_KEY && SUPABASE_ANON_KEY !== 'TU_CLAVE_ANONIMA_PUBLICA_SUPABASE') {
            supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
            console.log('Supabase Client inicializado en tabla-script.js.');
        } else {
            console.warn('Advertencia en tabla-script.js: Credenciales de Supabase no configuradas.');
            displayMessageTabla('Error de configuración del cliente Supabase. Funcionalidad limitada.', 'error');
            return; // Detener si no hay cliente
        }
    } catch (error) {
        console.error('Error al inicializar Supabase Client en tabla-script.js:', error);
        displayMessageTabla('Error crítico al inicializar el cliente de autenticación.', 'error');
        return; // Detener si hay error
    }

    // --- ELEMENTOS DEL DOM ---
    const logoutBtnTabla = document.getElementById('logout-btn-tabla');
    const btnNuevoPaciente = document.getElementById('btnNuevoPaciente');
    const modal = document.getElementById('pacienteModal');
    const closeModalBtn = document.getElementById('closeModalBtn');
    const pacienteForm = document.getElementById('pacienteForm');
    const modalTitle = document.getElementById('modalTitle');
    const pacienteIdInput = document.getElementById('pacienteId');
    const nombreCompletoInput = document.getElementById('nombreCompleto');
    const fechaNacimientoInput = document.getElementById('fechaNacimiento');
    const cuerpoTablaPacientes = document.getElementById('cuerpoTablaPacientes');
    const mensajeTablaDiv = document.getElementById('mensaje-tabla');

    let currentUser = null;

    // --- FUNCIONES DE UTILIDAD ---
    function displayMessageTabla(message, type) {
        if (mensajeTablaDiv) {
            mensajeTablaDiv.textContent = message;
            mensajeTablaDiv.className = 'auth-message ' + type; // Reutiliza clases de auth.html
            mensajeTablaDiv.style.display = 'block';
            setTimeout(() => { mensajeTablaDiv.style.display = 'none'; }, 4000);
        }
    }

    function openModal(isEdit = false, paciente = null) {
        pacienteForm.reset(); // Limpiar formulario
        pacienteIdInput.value = ''; // Limpiar ID oculto
        if (isEdit && paciente) {
            modalTitle.textContent = 'Editar Paciente';
            pacienteIdInput.value = paciente.id;
            nombreCompletoInput.value = paciente.nombre_completo;
            fechaNacimientoInput.value = paciente.fecha_nacimiento; // Asegúrate que el formato sea YYYY-MM-DD
        } else {
            modalTitle.textContent = 'Añadir Nuevo Paciente';
        }
        modal.style.display = 'block';
    }

    function closeModal() {
        modal.style.display = 'none';
    }

    // --- LÓGICA DE AUTENTICACIÓN Y CARGA INICIAL ---
    async function checkAuthAndLoadData() {
        if (!supabaseClient) return;

        const { data: { session }, error: sessionError } = await supabaseClient.auth.getSession();

        if (sessionError) {
            console.error("Error al obtener sesión:", sessionError.message);
            displayMessageTabla("Error al verificar sesión. Intenta recargar.", "error");
            return;
        }

        if (!session) {
            // Si no hay sesión, redirigir al login (o a index.html que maneja el login)
            window.location.href = 'auth.html#login';
            return;
        }
        currentUser = session.user;
        console.log('Usuario autenticado en tabla.html:', currentUser.id);
        cargarPacientes(); // Cargar pacientes del usuario actual
    }

    // --- FUNCIONES CRUD (Create, Read, Update, Delete) ---
    async function cargarPacientes() {
        if (!currentUser || !supabaseClient) return;

        displayMessageTabla('Cargando pacientes...', 'info');
        const { data: pacientes, error } = await supabaseClient
            .from('pacientes') // Nombre de tu tabla en Supabase
            .select('*')
            .eq('user_id', currentUser.id) // Solo pacientes del usuario actual
            .order('fecha_registro', { ascending: false });

        if (error) {
            console.error('Error al cargar pacientes:', error.message);
            displayMessageTabla(`Error al cargar pacientes: ${error.message}`, 'error');
            cuerpoTablaPacientes.innerHTML = '<tr><td colspan="4">Error al cargar datos.</td></tr>';
            return;
        }

        cuerpoTablaPacientes.innerHTML = ''; // Limpiar tabla
        if (pacientes.length === 0) {
            cuerpoTablaPacientes.innerHTML = '<tr><td colspan="4">Aún no has registrado pacientes.</td></tr>';
            displayMessageTabla('No hay pacientes registrados.', 'info');
        } else {
            pacientes.forEach(paciente => {
                const fila = cuerpoTablaPacientes.insertRow();
                fila.insertCell().textContent = paciente.nombre_completo;
                fila.insertCell().textContent = new Date(paciente.fecha_nacimiento).toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' });
                fila.insertCell().textContent = new Date(paciente.fecha_registro).toLocaleString('es-ES');
                
                const celdaAcciones = fila.insertCell();
                celdaAcciones.classList.add('action-cell');

                const btnEditar = document.createElement('button');
                btnEditar.textContent = 'Editar';
                btnEditar.classList.add('action-button'); // Reutiliza estilos
                btnEditar.onclick = () => openModal(true, paciente);
                celdaAcciones.appendChild(btnEditar);

                const btnEliminar = document.createElement('button');
                btnEliminar.textContent = 'Eliminar';
                btnEliminar.classList.add('action-button');
                btnEliminar.style.backgroundColor = '#f44336'; // Color rojo para eliminar
                btnEliminar.onclick = () => eliminarPaciente(paciente.id);
                celdaAcciones.appendChild(btnEliminar);
            });
            displayMessageTabla(`Se encontraron ${pacientes.length} pacientes.`, 'success');
        }
    }

    async function guardarPaciente(event) {
        event.preventDefault();
        if (!currentUser || !supabaseClient) return;

        const id = pacienteIdInput.value; // Si hay ID, es una edición
        const nombre = nombreCompletoInput.value.trim();
        const fechaNac = fechaNacimientoInput.value;

        if (!nombre || !fechaNac) {
            displayMessageTabla('Nombre y fecha de nacimiento son requeridos.', 'error');
            return;
        }

        const datosPaciente = {
            user_id: currentUser.id,
            nombre_completo: nombre,
            fecha_nacimiento: fechaNac,
            // Aquí, más adelante, calcularías y añadirías los datos de numerología
            // numero_vida: calcularNumeroVida(fechaNac),
            // ...etc.
        };

        let resultado;
        if (id) { // Editar paciente existente
            displayMessageTabla('Actualizando paciente...', 'info');
            const { data, error } = await supabaseClient
                .from('pacientes')
                .update(datosPaciente)
                .eq('id', id)
                .eq('user_id', currentUser.id) // Seguridad: solo puede editar sus propios pacientes
                .select();
            resultado = { data, error };
        } else { // Añadir nuevo paciente
            displayMessageTabla('Guardando nuevo paciente...', 'info');
            const { data, error } = await supabaseClient
                .from('pacientes')
                .insert(datosPaciente)
                .select();
            resultado = { data, error };
        }

        if (resultado.error) {
            console.error('Error al guardar paciente:', resultado.error.message);
            displayMessageTabla(`Error: ${resultado.error.message}`, 'error');
        } else {
            displayMessageTabla(id ? 'Paciente actualizado con éxito.' : 'Paciente añadido con éxito.', 'success');
            closeModal();
            cargarPacientes(); // Recargar la lista
        }
    }

    async function eliminarPaciente(pacienteId) {
        if (!currentUser || !supabaseClient) return;
        if (!confirm('¿Estás seguro de que quieres eliminar este paciente? Esta acción no se puede deshacer.')) {
            return;
        }
        displayMessageTabla('Eliminando paciente...', 'info');
        const { error } = await supabaseClient
            .from('pacientes')
            .delete()
            .eq('id', pacienteId)
            .eq('user_id', currentUser.id); // Seguridad

        if (error) {
            console.error('Error al eliminar paciente:', error.message);
            displayMessageTabla(`Error al eliminar: ${error.message}`, 'error');
        } else {
            displayMessageTabla('Paciente eliminado con éxito.', 'success');
            cargarPacientes(); // Recargar la lista
        }
    }

    // --- MANEJADORES DE EVENTOS ---
    if (logoutBtnTabla) {
        logoutBtnTabla.addEventListener('click', async () => {
            if (!supabaseClient) return;
            displayMessageTabla('Cerrando sesión...', 'info');
            const { error } = await supabaseClient.auth.signOut();
            if (error) {
                console.error('Error al cerrar sesión:', error.message);
                displayMessageTabla(`Error al cerrar sesión: ${error.message}`, 'error');
            } else {
                console.log('Sesión cerrada');
                window.location.href = 'index.html'; // Redirigir al inicio
            }
        });
    }

    if (btnNuevoPaciente) {
        btnNuevoPaciente.addEventListener('click', () => openModal());
    }

    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', closeModal);
    }

    // Cerrar modal si se hace clic fuera del contenido
    window.addEventListener('click', (event) => {
        if (event.target === modal) {
            closeModal();
        }
    });

    if (pacienteForm) {
        pacienteForm.addEventListener('submit', guardarPaciente);
    }

    // --- INICIO DE LA APLICACIÓN ---
    checkAuthAndLoadData(); // Verificar autenticación y cargar datos al iniciar la páginaAdd commentMore actions

});
