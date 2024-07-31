const carrito = document.getElementById('carrito');
const elementos1 = document.getElementById('lista-1');
const lista = document.querySelector('#lista-carrito tbody');
const vaciarCarritoBtn = document.getElementById('vaciar-carrito');
const mensaje = document.getElementById('mensaje');
const contadorCarrito = document.getElementById('contador-carrito');

let productosencarrito = JSON.parse(localStorage.getItem('carrito')) || [];

cargarEventListeners();

function cargarEventListeners() {
    elementos1.addEventListener('click', comprarElemento);
    carrito.addEventListener('click', eliminarElemento);
    vaciarCarritoBtn.addEventListener('click', vaciarCarrito);

    // Cargar carrito desde localStorage
    cargarCarritoDesdeLocalStorage();
}

function cargarCarritoDesdeLocalStorage() {
    productosencarrito.forEach(producto => insertarCarrito(producto));
    actualizarContadorCarrito();
}

function comprarElemento(e) {
    e.preventDefault();
    if (e.target.classList.contains('agregar-carrito')) {
        const elemento = e.target.parentElement.parentElement;
        leerDatosElementos(elemento);
        mostrarMensaje('Se añadió al carrito correctamente');
    }
}

function leerDatosElementos(elemento) {
    const infoElemento = {
        imagen: elemento.querySelector('img').src,
        titulo: elemento.querySelector('.product-txt h3').textContent,
        precio: elemento.querySelector('.product-txt p.precio').textContent,
        id: elemento.querySelector('a').getAttribute('data-id')
    };

    // Verificar si el producto ya está en el carrito
    const productoExistente = productosencarrito.find(producto => producto.id === infoElemento.id);
    if (productoExistente) {
        // Si existe, aumentar la cantidad
        productoExistente.cantidad++;
        // Actualizar la fila del carrito
        actualizarFilaCarrito(productoExistente);
    } else {
        // Si no existe, agregar el producto al carrito
        infoElemento.cantidad = 1;
        productosencarrito.push(infoElemento);
        // Insertar el nuevo producto en el carrito
        insertarCarrito(infoElemento);
    }

    // Guardar los cambios en el localStorage
    guardarEnLocalStorage();
    // Actualizar el contador del carrito
    actualizarContadorCarrito();
}

function insertarCarrito(elemento) {
    const row = document.createElement('tr');
    row.innerHTML = `
        <td>
            <img src="${elemento.imagen}" width="100" />
        </td>
        <td>
            ${elemento.titulo}
        </td>
        <td>
            ${elemento.precio}
        </td>
       <td>
            <span>${elemento.cantidad}</span>
        </td>
        <td>
            <a href="#" class="borrar" data-id="${elemento.id}">X</a>
        </td>
    `;

    lista.appendChild(row);
    actualizarContadorCarrito();
}
function guardarEnLocalStorage() {
    localStorage.setItem('carrito', JSON.stringify(productosencarrito));
}

function actualizarFilaCarrito(producto) {
    const filas = lista.getElementsByTagName('tr');
    for (let fila of filas) {
        if (fila.querySelector('a').getAttribute('data-id') === producto.id) {
            fila.querySelector('span').textContent = producto.cantidad;
            break;
        }
    }
    // Guardar los cambios en el localStorage
    guardarEnLocalStorage();
}

function eliminarElemento(e) {
    e.preventDefault();
    if (e.target.classList.contains('borrar')) {
        const row = e.target.parentElement.parentElement;
        const productoId = e.target.getAttribute('data-id');

        productosencarrito = productosencarrito.filter(producto => producto.id !== productoId);

        row.remove();
        actualizarContadorCarrito();
        guardarEnLocalStorage();
    }
}

function vaciarCarrito() {
    while (lista.firstChild) {
        lista.removeChild(lista.firstChild);
    }
    productosencarrito.length = 0;
    actualizarContadorCarrito();
    guardarEnLocalStorage();
}

function actualizarContadorCarrito() {
    // Contar todos los productos en el carrito
    const numElementos = productosencarrito.reduce((total, producto) => total + producto.cantidad, 0);
    contadorCarrito.textContent = numElementos;
}

function mostrarMensaje(mensajeTexto) {
    mensaje.textContent = mensajeTexto;
    mensaje.classList.add('mostrar');
    setTimeout(() => {
        mensaje.classList.remove('mostrar');
        mensaje.textContent = '';
    }, 3000);
}

const productArray=[
    {
        id:'AMD Ryzen™ 9 Desktop Processors',
        titulo:'AMD Ryzen™ 9 5900X',
        imagen:'images/1.png',
        precio:340,
    },
    {
        id:'GIGABYTE',
        titulo:'GeForce RTX™ 4070 Ti GAMING OC 12G',
        imagen:'images/2.png',
        precio:860,
    },
    {
        id:'MSI GAMING',
        titulo:'MAG Z690 Tomahawk WiFi DDR4',
        imagen:'images/3.png',
        precio:280,
    },
    {
        id:"24' pulgadas, FHD (1920x1080), 170Hz",
        titulo:'MSI G42C Monitor Gamer Curvo',
        imagen:'images/4.png',
        precio:280,
    },
    {
        id:'Logitech',
        titulo:'G502 Mouse inalámbrico',
        imagen:'images/5.png',
        precio:90,
    },
    {
        id:'Redragon',
        titulo:'Audífonos Gamer Redragon Hylas H260 RGB',
        imagen:'images/6.png',
        precio:35,
    }
];

const contenedorProductos = document.querySelector("#product-content");
function cargarproductos() {
    productArray.forEach(producto => {
        const div = document.createElement("div");
        div.classList.add("product");
        div.innerHTML = `
            <img src="${producto.imagen}" alt="${producto.titulo}">
            <div class="product-txt">
                <h3>${producto.titulo}</h3>
                <p>${producto.id}</p>
                <p class="precio">$${producto.precio}</p>
                <a href="#" class="agregar-carrito btn-2" data-id="${producto.id}">Agregar al carrito</a>
            </div>
        `;
        contenedorProductos.appendChild(div);
    });
}

cargarproductos();