document.querySelectorAll('.toggle-radio').forEach(radio => {
    radio.addEventListener('change', function() {
        if (this.checked) {
            // Obtener el formulario relacionado
            const relatedFormId = this.id === 'tarjeta-credito' ? 'tarjeta-form' : 'paypal-form';
            
            // Ocultar todos los formularios
            document.querySelectorAll('.form-container').forEach(form => {
                if (form.id === relatedFormId) {
                    form.style.maxHeight = '500px'; // Muestra el formulario
                } else {
                    form.style.maxHeight = '0'; // Oculta el formulario
                }
            });
        }
    });
});

document.addEventListener('DOMContentLoaded', function() {
    const tarjetaForm = document.getElementById('tarjeta-form');
    const paypalForm = document.getElementById('paypal-form');
    const realizarCompraButton = document.getElementById('realizar-compra');

    function checkFormCompletion() {
        const tarjetaVisible = document.getElementById('tarjeta-credito').checked;
        const paypalVisible = document.getElementById('paypal').checked;

        let isFormValid = false;

        if (tarjetaVisible) {
            isFormValid = Array.from(tarjetaForm.querySelectorAll('input')).every(input => input.value.trim() !== '');
        } else if (paypalVisible) {
            isFormValid = Array.from(paypalForm.querySelectorAll('input')).every(input => input.value.trim() !== '');
        }

        realizarCompraButton.disabled = !isFormValid;
    }

    // Add event listeners to the inputs
    tarjetaForm.addEventListener('input', checkFormCompletion);
    paypalForm.addEventListener('input', checkFormCompletion);

    // Add event listeners to the radio buttons
    document.querySelectorAll('input[name="payment-method"]').forEach(radio => {
        radio.addEventListener('change', function() {
            // Hide all forms
            tarjetaForm.parentElement.style.display = 'none';
            paypalForm.parentElement.style.display = 'none';
            
            // Show the selected form
            if (document.getElementById('tarjeta-credito').checked) {
                tarjetaForm.parentElement.style.display = 'block';
            } else if (document.getElementById('paypal').checked) {
                paypalForm.parentElement.style.display = 'block';
            }
            
            // Check form completion
            checkFormCompletion();
        });
    });

    // Initial check
    checkFormCompletion();
});

document.addEventListener('DOMContentLoaded', () => {
    const carritoProductos = document.getElementById('carrito-productos');

    mostrarCarrito();
    document.querySelector('.carrito-acciones-vaciar').addEventListener('click', vaciarCarrito);
    carritoProductos.addEventListener('click', eliminarProducto);

    function mostrarCarrito() {
        const carrito = JSON.parse(localStorage.getItem('carrito')) || [];
        carritoProductos.innerHTML = ''; // Limpiar contenido existente
    
        carrito.forEach(item => {
            const div = document.createElement('div');
            div.classList.add('carrito-producto');
            div.innerHTML = `
                <img class="carrito-img" src="${item.imagen}" alt="">
                <div class="carrito-producto-titulo">
                    <h3>${item.titulo}</h3>
                    <small>${item.id}</small>
                </div>
                <div class="carrito-producto-precio">
                    <p>${item.precio}</p>
                </div>
                <div class="carrito-producto-cantidad">
                    <h4>Cantidad </h4>
                    <p>${item.cantidad}</p>
                </div>
                <button class="carrito-producto-eliminar" data-id="${item.id}"><i class="bi bi-x"></i></button>
            `;
            carritoProductos.appendChild(div);
        });
    
        // Actualizar el resumen después de mostrar el carrito
        actualizarResumen();
    }
    function actualizarResumen() {
        const carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    
        // Calcular el total
        const total = carrito.reduce((acc, item) => acc + (parseFloat(item.precio.replace('$', '')) * item.cantidad), 0);
    
        // Calcular la cantidad total de productos
        const cantidadTotal = carrito.reduce((acc, item) => acc + item.cantidad, 0);
    
        // Actualizar el total en la interfaz
        document.querySelectorAll('.total').forEach(element => element.textContent = `$${total.toFixed(2)}`);
    
        // Actualizar la cantidad total en la interfaz
        const cantidadElement = document.querySelector('.carrito-cantidad-total');
        if (cantidadElement) {
            cantidadElement.textContent = cantidadTotal;
        }
    }

    function eliminarProducto(e) {
        if (e.target.classList.contains('bi-x')) {
            const productoId = e.target.closest('button').getAttribute('data-id');
            eliminarDelCarrito(productoId);
            e.target.closest('.carrito-producto').remove();
            actualizarResumen();
        }
    }

    function eliminarDelCarrito(id) {
        let carrito = JSON.parse(localStorage.getItem('carrito')) || [];
        carrito = carrito.filter(item => item.id !== id);
        localStorage.setItem('carrito', JSON.stringify(carrito));
    }

    function vaciarCarrito() {
        localStorage.removeItem('carrito');
        mostrarCarrito();
        actualizarResumen();
    }
});