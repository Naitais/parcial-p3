# Módulo de Registro y Login

## Descripción

Módulo de registro y autenticación de usuarios desarrollado con HTML, CSS y JavaScript puro (sin frameworks ni backend). Los datos se almacenan en el navegador usando localStorage. Las peticiones al servidor se simulan con async/await.

## Instrucciones para ejecutar

1. Descargar o clonar el repositorio
2. Abrir el archivo `index.html` en cualquier navegador
3. No requiere instalación adicional ni servidor

## Usuario de prueba

Para probar el login, primero registrar un usuario o usar los siguientes datos después de registrarlos:

- **Email:** prueba@correo.com
- **Contraseña:** clave123

## Estructura del proyecto

```
/parcial-p3
├── index.html    → Página principal con formularios de registro y login
├── styles.css    → Estilos visuales (Flexbox, colores, animaciones)
├── app.js        → Lógica de validación, registro, login y manipulación del DOM
└── README.md     → Este archivo
```

## Esquema del código (app.js)

```
app.js
├── fakeRequest(data)           → Simula petición al servidor (async, 1 segundo)
├── mostrarCargando()           → Muestra mensaje "Cargando..." en pantalla
├── ocultarCargando()           → Oculta el mensaje "Cargando..."
├── limpiarErrores()            → Limpia todos los mensajes de error del DOM
├── mostrarError(campo, msg)    → Muestra un error debajo de un campo específico
├── validarRegistro()           → Valida los campos del formulario de registro
├── obtenerUsuarios()           → Lee los usuarios guardados en localStorage
├── guardarUsuarios(usuarios)   → Guarda los usuarios en localStorage
├── registrarUsuario(e)         → Procesa el registro (async/await)
├── iniciarSesion(e)            → Procesa el login (async/await)
├── mostrarFormulario(tipo)     → Alterna entre vista de registro y login
└── DOMContentLoaded            → Inicializa todos los eventos al cargar la página
```

## Diagrama de flujo

### Proceso de Registro

```mermaid
flowchart TD
    A[Inicio] --> B[Completar formulario de registro]
    B --> C[Click en Registrarse]
    C --> D[preventDefault - evitar recarga]
    D --> E[Limpiar errores anteriores]
    E --> F{¿Campos válidos?}
    F -- No --> G[Mostrar errores en cada campo]
    G --> B
    F -- Sí --> H{¿Email ya registrado?}
    H -- Sí --> I[Mostrar error: email duplicado]
    I --> B
    H -- No --> J[Mostrar Cargando...]
    J --> K[await fakeRequest - simular servidor]
    K --> L[Guardar usuario en localStorage]
    L --> M[Ocultar Cargando...]
    M --> N[Mostrar mensaje de éxito]
    N --> O[Cambiar a formulario de login]
    O --> P[Fin]
```

### Proceso de Login

```mermaid
flowchart TD
    A[Inicio] --> B[Completar formulario de login]
    B --> C[Click en Entrar]
    C --> D[preventDefault - evitar recarga]
    D --> E[Limpiar errores anteriores]
    E --> F{¿Campos vacíos?}
    F -- Sí --> G[Mostrar errores en campos vacíos]
    G --> B
    F -- No --> H[Mostrar Cargando...]
    H --> I[await fakeRequest - simular servidor]
    I --> J[Ocultar Cargando...]
    J --> K[Buscar usuario en localStorage]
    K --> L{¿Usuario existe?}
    L -- No --> M[Mostrar: no existe cuenta]
    M --> B
    L -- Sí --> N{¿Contraseña correcta?}
    N -- No --> O[Mostrar: contraseña incorrecta]
    O --> B
    N -- Sí --> P[Mostrar: Bienvenido/a]
    P --> Q[Fin]
```

## Tecnologías utilizadas

- HTML5
- CSS3 (Flexbox)
- JavaScript (ES6, async/await)
- localStorage para persistencia de datos
