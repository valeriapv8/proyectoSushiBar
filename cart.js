let productosEnCarrito = localStorage.getItem("productos-en-carrito");
productosEnCarrito = JSON.parse(productosEnCarrito) || [];const contenedorCarritoVacio = document.querySelector("#carrito-vacio");

const contenedorCarritoProductos = document.querySelector("#carrito-productos");
const contenedorCarritoAcciones = document.querySelector("#carrito-acciones");
const contenedorCarritoComprado = document.querySelector("#carrito-comprado");
let botonesEliminar = document.querySelectorAll(".carrito-producto-eliminar");
const botonVaciar = document.querySelector("#carrito-acciones-vaciar");
const contenedorTotal = document.querySelector("#total");
const botonComprar = document.querySelector("#carrito-acciones-comprar");

function cargarProductosCarrito() {
    if (productosEnCarrito.length > 0) {
        const btnIncrementar = document.querySelectorAll('.btn-incrementar');
        const btnDecrementar = document.querySelectorAll('.btn-decrementar');

        btnIncrementar.forEach(btn => {
            btn.addEventListener('click', () => {
                const idProducto = btn.dataset.id;
                actualizarCantidad(idProducto, 1);
            });
        });

        btnDecrementar.forEach(btn => {
            btn.addEventListener('click', () => {
                const idProducto = btn.dataset.id;
                actualizarCantidad(idProducto, -1);
            });
        });

        contenedorCarritoVacio.classList.add("disabled");
        contenedorCarritoProductos.classList.remove("disabled");
        contenedorCarritoAcciones.classList.remove("disabled");
        contenedorCarritoComprado.classList.add("disabled");

        contenedorCarritoProductos.innerHTML = "";

        productosEnCarrito.forEach(product => {

            const div = document.createElement("div");
            div.classList.add("carrito-producto");
            div.innerHTML = `
                <img class="carrito-producto-imagen" src="${product.image}" alt="${product.name}">
                <div class="carrito-producto-titulo">
                    <small>Título</small>
                    <h3>${product.name}</h3>
                </div>
                <!-- Reemplaza esta parte en el carrito-producto-cantidad -->
               <div class="carrito-producto-cantidad">
                    <small>Cantidad</small>
                    <button class="btn-incrementar" data-id="${product.id}">+</button>
                    <span class="cantidad">${product.cantidad}</span>
                    <button class="btn-decrementar" data-id="${product.id}">-</button>
                </div>

                <div class="carrito-producto-precio">
                    <small>Precio</small>
                    <p>$${product.price}</p>
                </div>
                <div class="carrito-producto-subtotal">
                    <small>Subtotal</small>
                    <p>$${product.price * product.cantidad}</p>
                </div>
                <button class="carrito-producto-eliminar" id="${product.id}"><i class="bi bi-trash-fill"></i></button>
            `;

            contenedorCarritoProductos.append(div);

            const btnIncrementar = div.querySelector('.btn-incrementar');
            const btnDecrementar = div.querySelector('.btn-decrementar');

            btnIncrementar.addEventListener('click', () => actualizarCantidad(product.id, product.cantidad + 1));
            btnDecrementar.addEventListener('click', () => {
                if (product.cantidad > 1) {
                    actualizarCantidad(product.id, product.cantidad - 1);
                }
            });
        })
        const inputCantidades = document.querySelectorAll('.input-cantidad');
        inputCantidades.forEach(input => {
            input.addEventListener('input', actualizarCantidad);
        });

        actualizarBotonesEliminar();
        actualizarTotal();

    } else {
        contenedorCarritoVacio.classList.remove("disabled");
        contenedorCarritoProductos.classList.add("disabled");
        contenedorCarritoAcciones.classList.add("disabled");
        contenedorCarritoComprado.classList.add("disabled");
    }

}
function actualizarCantidad(idProducto, nuevaCantidad) {
    const producto = productosEnCarrito.find(p => p.id === idProducto);
    if (producto) {
        producto.cantidad = nuevaCantidad;
        localStorage.setItem("productos-en-carrito", JSON.stringify(productosEnCarrito));
        cargarProductosCarrito();
    }
}



cargarProductosCarrito();

function actualizarBotonesEliminar() {
    botonesEliminar = document.querySelectorAll(".carrito-producto-eliminar");

    botonesEliminar.forEach(boton => {
        boton.addEventListener("click", eliminarDelCarrito);
    });
}

function eliminarDelCarrito(e) {
    Toastify({
        text: "Producto eliminado",
        duration: 3000,
        close: true,
        gravity: "top",
        position: "right",
        stopOnFocus: true, // Prevents dismissing of toast on hover
        style: {
            background: "linear-gradient(to right, #4b33a8, #785ce9)",
            borderRadius: "2rem",
            textTransform: "uppercase",
            fontSize: ".75rem"
        },
        offset: {
            x: '1.5rem',
            y: '1.5rem'
        },
        onClick: function(){} // Callback after click
    }).showToast();

    const idBoton = e.currentTarget.id;
    const index = productosEnCarrito.findIndex(product => product.id === idBoton);

    productosEnCarrito.splice(index, 1);
    cargarProductosCarrito();

    localStorage.setItem("productos-en-carrito", JSON.stringify(productosEnCarrito));

}

botonVaciar.addEventListener("click", vaciarCarrito);
function vaciarCarrito() {

    Swal.fire({
        title: '¿Estás seguro?',
        icon: 'question',
        html: `Se van a borrar ${productosEnCarrito.reduce((acc, product) => acc + product.cantidad, 0)} productos.`,
        showCancelButton: true,
        focusConfirm: false,
        confirmButtonText: 'Sí',
        cancelButtonText: 'No'
    }).then((result) => {
        if (result.isConfirmed) {
            productosEnCarrito.length = 0;
            localStorage.setItem("productos-en-carrito", JSON.stringify(productosEnCarrito));
            cargarProductosCarrito();
        }
    })
}


function actualizarTotal() {
    const totalCalculado = productosEnCarrito.reduce((acc, product) => acc + (product.price * product.cantidad), 0);
    total.innerText = `$${totalCalculado}`;
}

botonComprar.addEventListener("click", comprarCarrito);
function comprarCarrito() {

    productosEnCarrito.length = 0;
    localStorage.setItem("productos-en-carrito", JSON.stringify(productosEnCarrito));

    contenedorCarritoVacio.classList.add("disabled");
    contenedorCarritoProductos.classList.add("disabled");
    contenedorCarritoAcciones.classList.add("disabled");
    contenedorCarritoComprado.classList.remove("disabled");

}
cargarProductosCarrito();
botonComprar.addEventListener("click", comprarCarrito);
function comprarCarrito() {

    enviarPedidoPorWhatsApp(productosEnCarrito);

    productosEnCarrito.length = 0;
    localStorage.setItem("productos-en-carrito", JSON.stringify(productosEnCarrito));

    contenedorCarritoVacio.classList.add("disabled");
    contenedorCarritoProductos.classList.add("disabled");
    contenedorCarritoAcciones.classList.add("disabled");
    contenedorCarritoComprado.classList.remove("disabled");

}

function enviarPedidoPorWhatsApp(pedido) {
    const mensaje = encodeURIComponent(
        `¡Hola! Me gustaría ordenar:\n` +
        pedido.map(producto => `${producto.cantidad} ${producto.name}`).join('\n')
    );
    window.open(`https://wa.me/59172170272/?text=${mensaje}`, '_blank');
}