let ingresoMensual = 0;
let listadoDeGastos = [];

// Constructor de gastos
class AgregarGastos {
    constructor(nombre, precio, cuotas) {
        this.nombre = nombre;
        this.precio = precio;
        this.cuotas = cuotas;
    }

    dividirCuotas() {
        return this.precio / this.cuotas;
    }
}

// Función para iniciar el planeador
function iniciarPlaneador() {
    ingresoMensual = parseInt(document.getElementById('ingresoMensual').value);
    if (ingresoMensual > 0) {
        localStorage.setItem('ingresoMensual', ingresoMensual); // Guardar en localStorage
        cargarGastos(); // Cargar los gastos guardados
        document.getElementById('menu').style.display = 'block';
        document.getElementById('ingresoMensual').disabled = true;
        mostrarMensaje('Ingreso mensual establecido correctamente.');
    } else {
        mostrarMensaje('Por favor, ingrese un valor de ingreso mensual correcto.', 'error');
    }
}

document.getElementById('iniciarBtn').addEventListener('click', iniciarPlaneador);

// Función para mostrar mensaje en un h4
function mostrarMensaje(mensaje, tipo = 'success') {
    const mensajeElemento = document.createElement('h4');
    mensajeElemento.textContent = mensaje;

    // Estilo para los mensajes
    if (tipo === 'error') {
        mensajeElemento.style.color = 'red';
    } else {
        mensajeElemento.style.color = 'green';
    }

    // Añadir el mensaje en el contenedor de mensajes
    const mensajeContenedor = document.getElementById('muetraIngresoModificado');
    mensajeContenedor.style.display = 'block'; // Hacer visible el mensaje
    mensajeContenedor.innerHTML = ''; // Limpiar mensajes previos
    mensajeContenedor.appendChild(mensajeElemento);

    // Eliminar el mensaje después de 3 segundos
    setTimeout(() => {
        mensajeContenedor.style.display = 'none';
    }, 3000);
}

// Función para ocultar solo las secciones de resolución
function ocultarResoluciones() {
    const seccionesResoluciones = document.querySelectorAll('#modificarIngreso, #agregarGasto, #detalles, #total, #eliminarGasto');
    seccionesResoluciones.forEach(seccion => {
        seccion.style.display = 'none';
    });
}

// Función para mostrar la sección de modificar ingreso
function mostrarModificarIngreso() {
    ocultarResoluciones();
    document.getElementById('modificarIngreso').style.display = 'block';
}

document.getElementById('modificarIngresoBtn').addEventListener('click', mostrarModificarIngreso);

// Función para actualizar el ingreso mensual
function modificarIngreso() {
    ingresoMensual = parseInt(document.getElementById('nuevoIngreso').value);
    if (ingresoMensual > 0) {
        localStorage.setItem('ingresoMensual', ingresoMensual); // Actualizar en localStorage
        mostrarMensaje('¡Su ingreso mensual ha sido actualizado con éxito!');
        document.getElementById('modificarIngreso').style.display = 'none';
    } else {
        mostrarMensaje('Por favor, ingrese un valor correcto.', 'error');
    }
}

document.getElementById('actualizarIngresoBtn').addEventListener('click', modificarIngreso);

// Función para agregar un gasto

function agregarGasto() {
    const nombre = document.getElementById('nombreGasto').value;
    const precio = parseInt(document.getElementById('precioGasto').value);
    const cuotas = parseInt(document.getElementById('cuotasGasto').value);

   
    if (nombre && precio > 0 && cuotas > 0) {
        const nuevoGasto = new AgregarGastos(nombre, precio, cuotas);
        listadoDeGastos.push(nuevoGasto);
        localStorage.setItem('listadoDeGastos', JSON.stringify(listadoDeGastos)); 
        mostrarMensaje('¡Gasto agregado con éxito!');

        document.getElementById('nombreGasto').value = '';  
        document.getElementById('precioGasto').value = '';  
        document.getElementById('cuotasGasto').value = ''; 

        // Ocultar la sección de añadir gasto
        document.getElementById('agregarGasto').style.display = 'none';
    } else {
        mostrarMensaje('Por favor ingrese todos los datos correctamente.', 'error');
    }
}

document.getElementById('agregarGastoBtn').addEventListener('click', () => {
    ocultarResoluciones();
    document.getElementById('agregarGasto').style.display = 'block';
});

document.getElementById('agregarBtn').addEventListener('click', agregarGasto);

// Función para mostrar detalles de los gastos
function mostrarDetallesGastos() {
    const listadoElement = document.getElementById('listadoGastos');
    listadoElement.innerHTML = '';
    listadoDeGastos.forEach(gasto => {
        const li = document.createElement('li');
        li.textContent = `Nombre: ${gasto.nombre}, Precio: ${gasto.precio}, Cuotas: ${gasto.cuotas}`;
        listadoElement.appendChild(li);
    });
    ocultarResoluciones();
    document.getElementById('detalles').style.display = 'block';
}

document.getElementById('detallesGastosBtn').addEventListener('click', mostrarDetallesGastos);

// Función para ver el total de los gastos
function verTotalGastos() {
    const total = listadoDeGastos.reduce((sumaTotal, gasto) => sumaTotal + gasto.dividirCuotas(), 0);
    document.getElementById('totalGastos').textContent = `Total a pagar este mes: $${total}`;
    ocultarResoluciones();
    document.getElementById('total').style.display = 'block';
}

document.getElementById('totalGastosBtn').addEventListener('click', verTotalGastos);

// Función para eliminar un gasto
function eliminarGasto() {
    const nombreEliminar = document.getElementById('nombreEliminar').value;
    const index = listadoDeGastos.findIndex(gasto => gasto.nombre === nombreEliminar);
    if (index !== -1) {
        listadoDeGastos.splice(index, 1);
        localStorage.setItem('listadoDeGastos', JSON.stringify(listadoDeGastos)); // Actualizar listado en localStorage
        mostrarMensaje('Gasto eliminado con éxito.');
        document.getElementById('eliminarGasto').style.display = 'none';
    } else {
        mostrarMensaje('No se encontró el gasto con ese nombre.', 'error');
    }
}

document.getElementById('eliminarGastoBtn').addEventListener('click', () => {
    ocultarResoluciones();
    document.getElementById('eliminarGasto').style.display = 'block';
});

document.getElementById('eliminarBtn').addEventListener('click', eliminarGasto);

// Función para salir y reiniciar la interfaz
function detener() {
    ocultarResoluciones();
    document.getElementById('ingresoMensual').disabled = false;
    document.getElementById('ingresoMensual').value = '';
    localStorage.removeItem('ingresoMensual');
    listadoDeGastos = [];
    localStorage.removeItem('listadoDeGastos');
}

document.getElementById('salirBtn').addEventListener('click', detener);

// Función para cargar los datos del almacenamiento local
function cargarGastos() {
    const ingresoGuardado = localStorage.getItem('ingresoMensual');
    if (ingresoGuardado) {
        ingresoMensual = parseInt(ingresoGuardado);
        document.getElementById('ingresoMensual').value = ingresoMensual;
    }

    const gastosGuardados = localStorage.getItem('listadoDeGastos');
    if (gastosGuardados) {
        listadoDeGastos = JSON.parse(gastosGuardados);
    }
}

window.onload = cargarGastos;