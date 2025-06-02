document.addEventListener('DOMContentLoaded', async () => {
    // --- INICIALIZACIÓN DE SUPABASE ---
    // ¡¡¡ASEGÚRATE DE QUE ESTAS SEAN TUS CREDENCIALES REALES DE SUPABASE!!!
    const SUPABASE_URL = 'https://sbfukuzscasnoezycqmi.supabase.co'; // Reemplaza con tu URL real
    const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNiZnVrdXpzY2Fzbm9lenljcW1pIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg2NTI0MzUsImV4cCI6MjA2NDIyODQzNX0.jcyo8gk2bP61EezSyDJDMBnFclaFW53GAXcqHDwHUMA'; // Reemplaza con tu Key anónima real
    let supabaseClient = null;

    try {
        // Condición corregida para inicializar el cliente
        if (SUPABASE_URL && SUPABASE_URL.startsWith('https://') &&
            SUPABASE_ANON_KEY && SUPABASE_ANON_KEY.startsWith('ey')) {
            supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
            console.log('Supabase Client inicializado en tabla-script.js.');
        } else {
            console.warn('Advertencia en tabla-script.js: Credenciales de Supabase no configuradas o inválidas. Por favor, verifica que no sean los placeholders y que tengan el formato correcto. Cliente NO inicializado.');
            if (typeof displayMessageTabla === 'function') {
                 displayMessageTabla('Error de configuración del cliente Supabase. Funcionalidad limitada.', 'error');
            }
            return; // Detener si las credenciales no parecen válidas o son placeholders
        }
    } catch (error) {
        console.error('Error EXCEPCIÓN al inicializar Supabase Client en tabla-script.js:', error);
        if (typeof displayMessageTabla === 'function') {
            displayMessageTabla('Error crítico al inicializar el cliente de autenticación.', 'error');
        }
       return; // Detener si hay una excepción
    }

    // --- ELEMENTOS DEL DOM ---
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
    // El botón de logout se maneja desde index.html, así que no se necesita aquí.

    let currentUser = null;

    // --- FUNCIONES DE UTILIDAD ---
    function displayMessageTabla(message, type) {
        if (mensajeTablaDiv) {
            mensajeTablaDiv.textContent = message;
            mensajeTablaDiv.className = 'auth-message ' + type;
            mensajeTablaDiv.style.display = 'block';
            setTimeout(() => { if(mensajeTablaDiv) mensajeTablaDiv.style.display = 'none'; }, 4000);
        } else {
            console.log(`Mensaje Tabla (${type}): ${message}`);
        }
    }

    function openModal(isEdit = false, paciente = null) {
        if (!pacienteForm || !pacienteIdInput || !modalTitle || !nombreCompletoInput || !fechaNacimientoInput || !modal) {
            console.error("Error: Faltan elementos del DOM para el modal.");
            displayMessageTabla("Error al abrir el formulario. Intente recargar.", "error");
            return;
        }
        pacienteForm.reset(); 
        pacienteIdInput.value = ''; 
        if (isEdit && paciente) {
            modalTitle.textContent = 'Editar Paciente';
            pacienteIdInput.value = paciente.id;
            nombreCompletoInput.value = paciente.nombre_completo;
            // Asegúrate que la fecha que viene de Supabase (paciente.fecha_nacimiento)
            // esté en formato "YYYY-MM-DD" para que el input type="date" la muestre bien.
            fechaNacimientoInput.value = paciente.fecha_nacimiento; 
        } else {
            modalTitle.textContent = 'Añadir Nuevo Paciente';
        }
        modal.style.display = 'block';
    }

    function closeModal() {
        if (modal) modal.style.display = 'none';
    }

    // --- LÓGICA DE AUTENTICACIÓN Y CARGA INICIAL ---
    async function checkAuthAndLoadData() {
        if (!supabaseClient) {
            console.warn("Supabase client no inicializado en checkAuthAndLoadData de tabla-script.js. No se puede verificar la sesión.");
            // Podrías redirigir al login aquí si el cliente no está
            // window.location.href = 'auth.html#login';
            return;
        }

        const { data: { session }, error: sessionError } = await supabaseClient.auth.getSession();

        if (sessionError) {
            console.error("Error al obtener sesión en tabla.html:", sessionError.message);
            displayMessageTabla("Error al verificar sesión. Intenta recargar.", "error");
            return;
        }

        if (!session) {
            console.log("No hay sesión activa en tabla.html, redirigiendo a login.");
            window.location.href = 'auth.html#login'; // Asegúrate que auth.html exista y funcione
            return;
        }
        currentUser = session.user;
        console.log('Usuario autenticado en tabla.html (checkAuthAndLoadData):', currentUser.id);
        cargarPacientes(); 
    }

    // --- FUNCIONES CRUD (Create, Read, Update, Delete) ---
    async function cargarPacientes() {
        if (!currentUser || !supabaseClient) {
            console.error("No se puede cargar pacientes: usuario no logueado o cliente Supabase no inicializado.");
            if (cuerpoTablaPacientes) cuerpoTablaPacientes.innerHTML = '<tr><td colspan="4">Error: No autenticado o problema de conexión.</td></tr>';
            return;
        }

        displayMessageTabla('Cargando pacientes...', 'info');
        const { data: pacientes, error } = await supabaseClient
            .from('pacientes') 
            .select('*')
            .eq('user_id', currentUser.id) 
            .order('fecha_registro', { ascending: false });

        if (error) {
            console.error('Error al cargar pacientes:', error.message);
            displayMessageTabla(`Error al cargar pacientes: ${error.message}`, 'error');
            if(cuerpoTablaPacientes) cuerpoTablaPacientes.innerHTML = '<tr><td colspan="4">Error al cargar datos.</td></tr>';
            return;
        }

        if(!cuerpoTablaPacientes) {
            console.error("Elemento cuerpoTablaPacientes no encontrado en el DOM.");
            return;
        }
        cuerpoTablaPacientes.innerHTML = ''; 
        if (pacientes.length === 0) {
            cuerpoTablaPacientes.innerHTML = '<tr><td colspan="4">Aún no has registrado pacientes.</td></tr>';
            displayMessageTabla('No hay pacientes registrados.', 'info');
        } else {
            pacientes.forEach(paciente => {
                const fila = cuerpoTablaPacientes.insertRow();
                fila.insertCell().textContent = paciente.nombre_completo;

                // --- MANEJO CORRECTO DE FECHA DE NACIMIENTO PARA VISUALIZACIÓN ---
                let fechaNacFormateada = '-';
                if (paciente.fecha_nacimiento) { // Asumimos paciente.fecha_nacimiento es "YYYY-MM-DD"
                    try {
                        const [year, month, day] = paciente.fecha_nacimiento.split('-').map(Number);
                        // Crear la fecha como si fuera medianoche UTC
                        const fechaCorrectaUTC = new Date(Date.UTC(year, month - 1, day)); // month - 1 (0-indexed)
                        // Formatear la fecha para mostrarla, especificando que se interprete como UTC
                        fechaNacFormateada = fechaCorrectaUTC.toLocaleDateString('es-ES', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            timeZone: 'UTC' // Trata la fecha como UTC al formatear
                        });
                    } catch (e) {
                        console.warn("Error formateando fecha de nacimiento:", paciente.fecha_nacimiento, e);
                        fechaNacFormateada = paciente.fecha_nacimiento; // Mostrar como viene si falla el formato
                    }
                }
                fila.insertCell().textContent = fechaNacFormateada;
                // --- FIN DEL MANEJO DE FECHA ---

                fila.insertCell().textContent = new Date(paciente.fecha_registro).toLocaleString('es-ES');
                
                const celdaAcciones = fila.insertCell();
                celdaAcciones.classList.add('action-cell');

                const btnEditar = document.createElement('button');
                btnEditar.textContent = 'Editar';
                btnEditar.classList.add('action-button'); 
                btnEditar.onclick = () => openModal(true, paciente);
                celdaAcciones.appendChild(btnEditar);

                const btnEliminar = document.createElement('button');
                btnEliminar.textContent = 'Eliminar';
                btnEliminar.classList.add('action-button');
                btnEliminar.style.backgroundColor = '#f44336'; 
                btnEliminar.onclick = () => eliminarPaciente(paciente.id);
                celdaAcciones.appendChild(btnEliminar);

                // Aquí añadirías el botón "Numerología"
                const btnConsultarNum = document.createElement('button');
                btnConsultarNum.textContent = 'Numerología';
                btnConsultarNum.classList.add('action-button');
                btnConsultarNum.style.backgroundColor = '#2196F3'; // Ejemplo color azul
                btnConsultarNum.onclick = () => {
                    // Aquí llamarías a la función para mostrar la numerología completa
                    // Necesitarás tener las funciones de cálculo de numerology.js y numerology2.js
                    // accesibles globalmente o copiadas/importadas aquí.
                    console.log("Botón Numerología clickeado para:", paciente);
                    alert(`Funcionalidad de numerología para ${paciente.nombre_completo} aún no implementada en detalle aquí.`);
                    // mostrarNumerologiaCompleta(paciente); // Esta función la definirías
                };
                celdaAcciones.appendChild(btnConsultarNum);
            });
            displayMessageTabla(`Se encontraron ${pacientes.length} pacientes.`, 'success');
        }
    }

    async function guardarPaciente(event) {
        event.preventDefault();
        if (!currentUser || !supabaseClient) {
            displayMessageTabla('Error: No autenticado o cliente no inicializado.', 'error');
            console.error("No se puede guardar: usuario no logueado o cliente Supabase no inicializado.");
            return;
        }

        const id = pacienteIdInput.value; 
        const nombre = nombreCompletoInput.value.trim();
        const fechaNac = fechaNacimientoInput.value; // Esto será "YYYY-MM-DD"

        if (!nombre || !fechaNac) {
            displayMessageTabla('Nombre y fecha de nacimiento son requeridos.', 'error');
            return;
        }

        const datosPaciente = {
            user_id: currentUser.id,
            nombre_completo: nombre,
            fecha_nacimiento: fechaNac, // Se guarda como "YYYY-MM-DD"
            // Aquí, más adelante, calcularías y añadirías los datos de numerología
        };

        let resultado;
        if (id) { 
            displayMessageTabla('Actualizando paciente...', 'info');
            const { data, error } = await supabaseClient
                .from('pacientes')
                .update(datosPaciente)
                .eq('id', id)
                .eq('user_id', currentUser.id) 
                .select();
            resultado = { data, error };
        } else { 
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
            cargarPacientes(); 
        }
    }

    async function eliminarPaciente(pacienteId) {
        if (!currentUser || !supabaseClient) {
            displayMessageTabla('Error: No autenticado o cliente no inicializado.', 'error');
            return;
        }
        if (!confirm('¿Estás seguro de que quieres eliminar este paciente? Esta acción no se puede deshacer.')) {
            return;
        }
        displayMessageTabla('Eliminando paciente...', 'info');
        const { error } = await supabaseClient
            .from('pacientes')
            .delete()
            .eq('id', pacienteId)
            .eq('user_id', currentUser.id); 

        if (error) {
            console.error('Error al eliminar paciente:', error.message);
            displayMessageTabla(`Error al eliminar: ${error.message}`, 'error');
        } else {
            displayMessageTabla('Paciente eliminado con éxito.', 'success');
            cargarPacientes(); 
        }
    }

    // --- MANEJADORES DE EVENTOS ---
    if (btnNuevoPaciente) {
        btnNuevoPaciente.addEventListener('click', () => openModal());
    }

    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', closeModal);
    }

    window.addEventListener('click', (event) => {
        if (modal && event.target === modal) { // Verificar que modal no sea null
            closeModal();
        }
    });

    if (pacienteForm) {
        pacienteForm.addEventListener('submit', guardarPaciente);
    }

    // --- INICIO DE LA APLICACIÓN ---
    checkAuthAndLoadData(); 

});
