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
    const { value: ingreso } = document.getElementById('ingresoMensual'); // Desestructuración de value
    ingresoMensual = parseInt(ingreso);

    if (ingresoMensual > 0) {
        localStorage.setItem('ingresoMensual', ingresoMensual); // Guardar en localStorage
        cargarGastos(); // Cargar los gastos guardados
        document.getElementById('menu').style.display = 'block';
        document.getElementById('ingresoMensual').disabled = true;
        mostrarSweetAlert('Ingreso mensual establecido correctamente.', 'success');
    } else {
        mostrarSweetAlert('Por favor, ingrese un valor de ingreso mensual correcto.', 'error');
    }
}
document.getElementById('iniciarBtn').addEventListener('click', iniciarPlaneador);

// Función para mostrar SweetAlert
function mostrarSweetAlert(mensaje, tipo = 'success') {
    Swal.fire({
        icon: tipo,
        title: mensaje,
        showConfirmButton: false,
        timer: 2000
    });
}

// Función para ocultar solo las secciones de resolución
function ocultarResoluciones() {
    const seccionesResoluciones = document.querySelectorAll('#modificarIngreso, #agregarGasto, #detalles, #total, #eliminarGasto');
    seccionesResoluciones.forEach(seccion => {
        seccion.style.display = 'none';
    });
}

// Modificar ingreso mensual
document.getElementById('modificarIngresoBtn').addEventListener('click', function () {
    ocultarResoluciones();
    document.getElementById('modificarIngreso').style.display = 'block';
});

// Actualizar ingreso mensual
document.getElementById('actualizarIngresoBtn').addEventListener('click', function () {
    const nuevoIngreso = parseInt(document.getElementById('nuevoIngreso').value);
    if (nuevoIngreso > 0) {
        ingresoMensual = nuevoIngreso;
        localStorage.setItem('ingresoMensual', ingresoMensual);
        document.getElementById('muetraIngresoModificado').style.display = 'block';
        setTimeout(() => {
            document.getElementById('muetraIngresoModificado').style.display = 'none';
        }, 2000);
    } else {
        mostrarSweetAlert('Por favor, ingrese un valor de ingreso válido.', 'error');
    }
});

// Agregar nuevo gasto
document.getElementById('agregarGastoBtn').addEventListener('click', function () {
    ocultarResoluciones();
    document.getElementById('agregarGasto').style.display = 'block';
});

// Guardar gasto
document.getElementById('agregarBtn').addEventListener('click', function () {
    const nombre = document.getElementById('nombreGasto').value;
    const precio = parseFloat(document.getElementById('precioGasto').value);
    const cuotas = parseInt(document.getElementById('cuotasGasto').value);

    if (nombre && precio > 0 && cuotas > 0) {
        const nuevoGasto = new AgregarGastos(nombre, precio, cuotas);
        listadoDeGastos.push(nuevoGasto);
        localStorage.setItem('listadoDeGastos', JSON.stringify(listadoDeGastos));
        mostrarSweetAlert('Gasto agregado correctamente.', 'success');
        document.getElementById('nombreGasto').value = '';
        document.getElementById('precioGasto').value = '';
        document.getElementById('cuotasGasto').value = '';
    } else {
        mostrarSweetAlert('Por favor, complete todos los campos correctamente.', 'error');
    }
});

// Eliminar un gasto
document.getElementById('eliminarGastoBtn').addEventListener('click', function () {
    ocultarResoluciones();
    document.getElementById('eliminarGasto').style.display = 'block';
});

// Eliminar gasto específico
document.getElementById('eliminarBtn').addEventListener('click', function () {
    const nombreEliminar = document.getElementById('nombreEliminar').value;
    listadoDeGastos = listadoDeGastos.filter(gasto => gasto.nombre !== nombreEliminar);
    localStorage.setItem('listadoDeGastos', JSON.stringify(listadoDeGastos));
    mostrarSweetAlert('Gasto eliminado correctamente.', 'success');
});

// Mostrar detalles de los gastos
document.getElementById('detallesGastosBtn').addEventListener('click', function () {
    const listadoElement = document.getElementById('listadoGastos');
    listadoElement.innerHTML = '';  // Limpiar el listado

    if (listadoDeGastos.length === 0) {
        listadoElement.innerHTML = '<li>No hay gastos registrados.</li>';
    } else {
        listadoDeGastos.forEach(gasto => {
            const cuotaMensual = gasto.dividirCuotas().toFixed(2);
            
            const li = document.createElement('li');
            li.innerHTML = `
                <div class="gasto-item">
                    <p class="gasto-nombre">Gasto: ${gasto.nombre}</p>
                    <p class="gasto-precio"><strong>Precio total:</strong> $${gasto.precio}</p>
                    <p class="gasto-cuotas"><strong>Cuotas:</strong> ${gasto.cuotas}</p>
                    <p class="gasto-pago-cuota"><strong>Pago por cuota:</strong> $${cuotaMensual}</p>
                </div>
            `;
            listadoElement.appendChild(li);
        });
        
    }
    ocultarResoluciones();
    document.getElementById('detalles').style.display = 'block';
});

// Ver el total de gastos
document.getElementById('totalGastosBtn').addEventListener('click', function () {
    const total = listadoDeGastos.reduce((sumaTotal, gasto) => sumaTotal + gasto.dividirCuotas(), 0);
    const saldoRestante = ingresoMensual - total;

    document.getElementById('totalGastos').textContent = `Total a pagar este mes por cuotas: $${total.toFixed(2)}`;
    document.getElementById('saldoRestante').textContent = saldoRestante >= 0
        ? `Te sobra $${saldoRestante.toFixed(2)} después de cubrir los gastos.`
        : `¡Te has excedido! Necesitas $${Math.abs(saldoRestante).toFixed(2)} más.`;

    ocultarResoluciones();
    document.getElementById('total').style.display = 'block';
});

// Función para cargar los datos del almacenamiento local
function cargarGastos() {
    const ingresoGuardado = localStorage.getItem('ingresoMensual');
    if (ingresoGuardado) {
        ingresoMensual = parseInt(ingresoGuardado);
        document.getElementById('ingresoMensual').value = ingresoMensual;
    }

    const gastosGuardados = localStorage.getItem('listadoDeGastos');
    if (gastosGuardados) {
        listadoDeGastos = JSON.parse(gastosGuardados).map(gasto => new AgregarGastos(gasto.nombre, gasto.precio, gasto.cuotas));
    }
}
// Función para cargar los datos del archivo JSON
function cargarGastos() {
    // Intentamos cargar el ingreso desde localStorage
    const ingresoGuardado = localStorage.getItem('ingresoMensual');
    if (ingresoGuardado) {
        ingresoMensual = parseInt(ingresoGuardado);
        document.getElementById('ingresoMensual').value = ingresoMensual;
    }

 // Usamos fetch para cargar los datos de gastos desde gastos.json
    fetch("./JS/gastos.json")
        .then(response => {
            if (!response.ok) {
                throw new Error('Error al cargar el archivo JSON');
            }
            return response.json();  // Parseamos el archivo JSON
        })
        .then(gastos => {
            // Si se cargan datos, mapeamos los datos y los asignamos a la lista de gastos
            listadoDeGastos = gastos.map(gasto => new AgregarGastos(gasto.nombre, gasto.precio, gasto.cuotas));
            // Si el archivo JSON no tiene datos, aseguramos que la lista de gastos esté vacía
            if (listadoDeGastos.length === 0) {
                listadoDeGastos = [];
            }
        })
        .catch(error => {
            // Si ocurre un error (por ejemplo, el archivo no se encuentra), mostramos un mensaje
            console.error('Error al cargar los gastos:', error);
            mostrarSweetAlert('Error al cargar los gastos desde el archivo JSON.', 'error');
        });
}

window.onload = cargarGastos;

