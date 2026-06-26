// Simula una petición al servidor. Recibe datos y los devuelve después de 1 segundo.
// Usa una Promise con setTimeout para crear el delay.
function fakeRequest(data) {
    return new Promise((resolve) => {
        setTimeout(() => resolve(data), 1000);
    });
}

// Muestra el mensaje "Cargando..." en pantalla
function mostrarCargando() {
    document.getElementById("cargando").style.display = "block";
}

// Oculta el mensaje "Cargando..."
function ocultarCargando() {
    document.getElementById("cargando").style.display = "none";
}

// Limpia todos los mensajes de error de los formularios
function limpiarErrores() {
    var errores = document.querySelectorAll(".error");
    for (var i = 0; i < errores.length; i++) {
        errores[i].textContent = "";
    }
    // También limpio el mensaje del login
    var mensajeLogin = document.getElementById("mensaje-login");
    if (mensajeLogin) {
        mensajeLogin.textContent = "";
        mensajeLogin.className = "";
    }
}

// Muestra un mensaje de error debajo de un campo específico.
// Recibe el id del span de error y el texto del mensaje.
function mostrarError(campoId, mensaje) {
    document.getElementById(campoId).textContent = mensaje;
}

// Valida todos los campos del formulario de registro.
// Retorna true si todo está correcto, false si hay algún error.
function validarRegistro() {
    var esValido = true;

    var nombre = document.getElementById("reg-nombre").value;
    var email = document.getElementById("reg-email").value;
    var password = document.getElementById("reg-password").value;
    var confirmar = document.getElementById("reg-confirmar").value;
    //var fecha = document.getElementById("reg-fecha").value;
    var terminos = document.getElementById("reg-terminos").checked;

    // Valido que el nombre no esté vacío
    if (nombre === "") {
        mostrarError("error-nombre", "El nombre es obligatorio");
        esValido = false;
    }

    // Valido que el email no esté vacío
    if (email === "") {
        mostrarError("error-email", "El email es obligatorio");
        esValido = false;
    } else {
        // Valido que el email tenga un formato correcto usando una expresión regular
        var regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!regexEmail.test(email)) {
            mostrarError("error-email", "El formato del email no es válido");
            esValido = false;
        }
    }

    // Valido que la contraseña no esté vacía
    if (password === "") {
        mostrarError("error-password", "La contraseña es obligatoria");
        esValido = false;
    } else {
        // Valido que tenga al menos 8 caracteres
        if (password.length < 8) {
            mostrarError("error-password", "Debe tener al menos 8 caracteres");
            esValido = false;
        }
        // Valido que tenga al menos un número
        var regexNumero = /[0-9]/;
        if (!regexNumero.test(password)) {
            mostrarError("error-password", "Debe incluir al menos un número");
            esValido = false;
        }
    }

    // Valido que la confirmación no esté vacía
    if (confirmar === "") {
        mostrarError("error-confirmar", "Confirmá tu contraseña");
        esValido = false;
    } else if (confirmar !== password) {
        // Valido que las contraseñas coincidan
        mostrarError("error-confirmar", "Las contraseñas no coinciden");
        esValido = false;
    }

    // Valido que el checkbox de términos esté seleccionado
    if (!terminos) {
        mostrarError("error-terminos", "Debés aceptar los términos y condiciones");
        esValido = false;
    }

    return esValido;
}

// Obtiene la lista de usuarios guardados en localStorage.
// Si no hay usuarios, devuelve un array vacío.
function obtenerUsuarios() {
    var datos = localStorage.getItem("usuarios");
    if (datos) {
        return JSON.parse(datos);
    }
    return [];
}

// Guarda la lista de usuarios en localStorage como texto JSON
function guardarUsuarios(usuarios) {
    localStorage.setItem("usuarios", JSON.stringify(usuarios));
}

// Maneja el envío del formulario de registro.
// Es async porque usa await con fakeRequest para simular la petición al servidor.
async function registrarUsuario(e) {
    // preventDefault evita que el formulario recargue la página al hacer submit
    e.preventDefault();
    limpiarErrores();

    // Primero valido todos los campos
    if (!validarRegistro()) {
        return;
    }

    var email = document.getElementById("reg-email").value;
    var nombre = document.getElementById("reg-nombre").value;
    var password = document.getElementById("reg-password").value;
//    var fecha = document.getElementById("reg-fecha").value;

    // Verifico que el email no esté ya registrado
    var usuarios = obtenerUsuarios();
    for (var i = 0; i < usuarios.length; i++) {
        if (usuarios[i].email === email) {
            mostrarError("error-email", "Este email ya está registrado");
            return;
        }
    }

    // Muestro "Cargando..." mientras simulo la petición
    mostrarCargando();

    // Simulo la petición al servidor con async/await
    var nuevoUsuario = {
        nombre: nombre,
        email: email,
        password: password,
        //fecha: fecha
    };
    await fakeRequest(nuevoUsuario);

    // Guardo el usuario en localStorage
    usuarios.push(nuevoUsuario);
    guardarUsuarios(usuarios);

    ocultarCargando();

    // Muestro mensaje de éxito y cambio al formulario de login
    mostrarFormulario("login");
    var mensajeLogin = document.getElementById("mensaje-login");
    mensajeLogin.textContent = "¡Registro exitoso! Ahora podés iniciar sesión.";
    mensajeLogin.className = "mensaje-exito";
}

// Maneja el envío del formulario de login.
// Es async porque usa await con fakeRequest para simular la petición al servidor.
async function iniciarSesion(e) {
    // preventDefault evita que el formulario recargue la página
    e.preventDefault();
    limpiarErrores();

    var email = document.getElementById("login-email").value;
    var password = document.getElementById("login-password").value;
    var mensajeLogin = document.getElementById("mensaje-login");
    var hayError = false;

    // Valido que los campos no estén vacíos
    if (email === "") {
        mostrarError("error-login-email", "El email es obligatorio");
        hayError = true;
    }
    if (password === "") {
        mostrarError("error-login-password", "La contraseña es obligatoria");
        hayError = true;
    }
    if (hayError) {
        return;
    }

    // Muestro "Cargando..." mientras simulo la petición
    mostrarCargando();
    await fakeRequest({ email: email, password: password });
    ocultarCargando();

    // Busco el usuario en localStorage
    var usuarios = obtenerUsuarios();
    var usuarioEncontrado = null;
    for (var i = 0; i < usuarios.length; i++) {
        if (usuarios[i].email === email) {
            usuarioEncontrado = usuarios[i];
            break;
        }
    }

    // Verifico si el usuario existe
    if (!usuarioEncontrado) {
        mensajeLogin.textContent = "No existe una cuenta con ese email";
        mensajeLogin.className = "mensaje-error";
        return;
    }

    // Verifico que la contraseña sea correcta
    if (usuarioEncontrado.password !== password) {
        mensajeLogin.textContent = "La contraseña es incorrecta";
        mensajeLogin.className = "mensaje-error";
        return;
    }

    // Si todo está bien, muestro mensaje de acceso correcto
    mensajeLogin.textContent = "¡Bienvenido/a, " + usuarioEncontrado.nombre + "!";
    mensajeLogin.className = "mensaje-exito";
}

// Cambia la vista entre el formulario de registro y el de login.
// Recibe "registro" o "login" como parámetro.
function mostrarFormulario(tipo) {
    var seccionRegistro = document.getElementById("seccion-registro");
    var seccionLogin = document.getElementById("seccion-login");

    if (tipo === "registro") {
        seccionRegistro.style.display = "block";
        seccionLogin.style.display = "none";
    } else {
        seccionRegistro.style.display = "none";
        seccionLogin.style.display = "block";
    }
    limpiarErrores();
}

// Espero a que se cargue todo el HTML antes de agregar los eventos.
// Esto es para evitar errores al buscar elementos que todavía no existen.
document.addEventListener("DOMContentLoaded", function () {

    // Agrego el evento submit al formulario de registro
    var formRegistro = document.getElementById("formRegistro");
    formRegistro.addEventListener("submit", registrarUsuario);

    // Agrego el evento submit al formulario de login
    var formLogin = document.getElementById("formLogin");
    formLogin.addEventListener("submit", iniciarSesion);

    // Agrego eventos a los links para cambiar entre formularios
    document.getElementById("btn-ir-login").addEventListener("click", function (e) {
        e.preventDefault();
        mostrarFormulario("login");
    });

    document.getElementById("btn-ir-registro").addEventListener("click", function (e) {
        e.preventDefault();
        mostrarFormulario("registro");
    });
});
