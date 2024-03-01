//Inicio del DOM
document.addEventListener('DOMContentLoaded', () => {

    //variables de inicio y lectores
    let carrito = [];
    const divisa = '$';
    const DOMitems = document.querySelector('#items');
    const DOMcarrito = document.querySelector('#carrito');
    const DOMtotal = document.querySelector('#total');
    const DOMbotonVaciar = document.querySelector('#boton-vaciar');
    const DOMbotonComprar = document.querySelector('#boton-comprar');
    const DOMtextCarrito = document.querySelector("#textCarrito");
    const DOMtextTotal = document.querySelector("#textTotal");
    const modal = document.getElementById("ventanaModal");
    const modalCancelar = document.getElementById("boton-cancelar");
    const modalAceptar = document.getElementById("boton-aceptar");
    const span = document.getElementsByClassName("cerrar")[0];
    const totalIva=document.getElementById('totalIva');
    const subtotal=document.querySelector("#subtotal");

    //Dibuja la lista de productos en el HTML
    function renderizarProductos() {
        listaProductos.forEach((info) => {
            const miNodo = document.createElement('div');
            miNodo.classList.add('card', 'col-sm-4');
            const miNodoCardBody = document.createElement('div');
            miNodoCardBody.classList.add('card-body');
            const miNodoTitle = document.createElement('h5');
            miNodoTitle.classList.add('card-title');
            miNodoTitle.textContent = info.nombre;
            const miNodoImagen = document.createElement('img');
            miNodoImagen.classList.add('img-fluid');
            miNodoImagen.setAttribute('src', info.imagen);
            const miNodoPrecio = document.createElement('p');
            miNodoPrecio.classList.add('card-text');
            miNodoPrecio.textContent = `${divisa} ${info.precio}`;
            const miNodoBoton = document.createElement('button');

            miNodoBoton.classList.add('btn', 'btn-primary');
            miNodoBoton.textContent = 'Añadir al carrito';
            miNodoBoton.setAttribute('marcador', info.id);
            miNodoBoton.addEventListener('click', anyadirProductoAlCarrito);
            miNodoCardBody.appendChild(miNodoImagen);
            miNodoCardBody.appendChild(miNodoTitle);
            miNodoCardBody.appendChild(miNodoPrecio);
            miNodoCardBody.appendChild(miNodoBoton);
            miNodo.appendChild(miNodoCardBody);
            DOMitems.appendChild(miNodo);
        });
    }

    // añadir un producto al carrito de compra
    function anyadirProductoAlCarrito(evento) {
        carrito.push(evento.target.getAttribute('marcador'))
        renderizarCarrito();
        mostrarBotonCompras();
    }

    //Dibuja todos los productos guardados en el carrito
    function renderizarCarrito() {
        DOMcarrito.textContent = '';
        const carritoSinDuplicados = [...new Set(carrito)];
        carritoSinDuplicados.forEach((item) => {
            const miItem = listaProductos.filter((itemBaseDatos) => {
                return itemBaseDatos.id === parseInt(item);
            });
            const numeroUnidadesItem = carrito.reduce((total, itemId) => {
                return itemId === item ? total += 1 : total;
            }, 0);
            const miNodo = document.createElement('li');
            miNodo.classList.add('list-group-item', 'text-right', 'mx-2');
            let totalProductoUnidad = numeroUnidadesItem * miItem[0].precio;
            miNodo.textContent = `${numeroUnidadesItem} x ${miItem[0].nombre} -${divisa}${miItem[0].precio} ${divisa}${totalProductoUnidad.toFixed(2)}`;
            const miBoton = document.createElement('button');
            miBoton.classList.add('btn', 'btn-danger', 'mx-5', 'float-right');
            miBoton.textContent = 'X';
            miBoton.style.marginLeft = '1rem';
            miBoton.dataset.item = item;
            miBoton.addEventListener('click', borrarItemCarrito);
            miNodo.appendChild(miBoton);
            DOMcarrito.appendChild(miNodo);
        });
        DOMtotal.textContent = calcularTotal();
    }

    //Funcion para borrar un elemento del carrito
    function borrarItemCarrito(evento) {
        const id = evento.target.dataset.item;
        carrito = carrito.filter((carritoId) => {
            return carritoId !== id;
        });
        renderizarCarrito();
        mostrarBotonCompras();
    }

    /**
     * Calcula el precio total teniendo en cuenta los productos repetidos
     */
    function calcularTotal() {
        return carrito.reduce((total, item) => {
            const miItem = listaProductos.filter((itemBaseDatos) => {
                return itemBaseDatos.id === parseInt(item);
            });
            return total + miItem[0].precio;
        }, 0).toFixed(2);
    }

    //Vacia el carrito y vuelve a dibujarlo
    function vaciarCarrito() {
        carrito = [];
        renderizarCarrito();
        mostrarBotonCompras();
    }
    // Funcion para realizar la compra muestra la factura
    function comprar() {
        modal.style.display = "block";
        const carritoPagar = [...new Set(carrito)];
        const modalBody = document.querySelector('#modalBody');
        modalBody.innerHTML = ""; carritoPagar.forEach((item) => {
            const miIte = listaProductos.filter((itemBaseDatos) => {
                return itemBaseDatos.id === parseInt(item);
            });
            const numeroUnidades = carrito.reduce((total, itemId) => {
                return itemId === item ? total += 1 : total;
            }, 0);
            const trModal = document.createElement('tr');
            const tdModalUnidades = document.createElement('td');
            tdModalUnidades.innerHTML = numeroUnidades;
            const tdModalDescripcion = document.createElement('td');
            tdModalDescripcion.innerHTML = miIte[0].nombre;
            const tdModalPU = document.createElement('td');
            tdModalPU.innerHTML = '$' + miIte[0].precio;
            const tdModalTotal = document.createElement('td');
            tdModalTotal.innerHTML = '$' + miIte[0].precio * numeroUnidades;
            trModal.append(tdModalUnidades);
            trModal.append(tdModalDescripcion);
            trModal.append(tdModalPU);
            trModal.append(tdModalTotal);
            modalBody.appendChild(trModal);
        })
        totalIva.innerHTML='';
        subtotal.innerHTML='';
        subtotal.innerHTML="Subtotal: "+calcularTotal();
        totalIva.innerHTML="Iva(13%): "+(calcularTotal()*0.13).toFixed(2);
        const totalModal = document.querySelector('#totalModal');
        let totalMIva=parseFloat(calcularTotal())+parseFloat(calcularTotal()*0.13);
        totalModal.innerHTML = 'Total: $' + totalMIva.toFixed(2);
    };
    // Funcion para mostrar y ocultar los botones del carrito si esta vacio
    function mostrarBotonCompras() {
        if (carrito.length <= 0) {
            DOMtextTotal.style.display = 'none';
            DOMbotonComprar.style.display = 'none';
            DOMbotonVaciar.style.display = 'none';
            DOMtextCarrito.innerHTML = 'Añadir productos';
        }
        else {
            DOMbotonComprar.style.display = 'block';
            DOMbotonVaciar.style.display = 'block';
            DOMtextCarrito.innerHTML = 'Carrito';
            DOMtextTotal.style.display = 'block';
        }

    }

    // Eventos
    //Evento clic al boton vaciar del carrito
    DOMbotonVaciar.addEventListener('click', vaciarCarrito);

    //Evento clic al boton Pagar del carrito muestra la factura
    DOMbotonComprar.addEventListener('click', comprar);

    //Evento al hacer clic al boton cancelar del modal factura
    modalCancelar.addEventListener("click", function () {
        modal.style.display = "none";
        Swal.fire({
            title: 'Cancelado',
            text: 'Compra cancelada',
            icon: 'info'
        })
    });
    //Evento al hacer clic al boton Aceptar del modal factura
    modalAceptar.addEventListener("click", function () {
        modal.style.display = "none";
        vaciarCarrito();
        Swal.fire({
            title: 'Exito',
            text: 'Compra exitosa Gracias',
            icon: 'success'
        })
    });
    // Si el usuario hace click en la x del modal , la ventana se cierra
    span.addEventListener("click", function () {
        modal.style.display = "none";
    });

    // Inicio
    mostrarBotonCompras();
    renderizarProductos();
    renderizarCarrito();
});