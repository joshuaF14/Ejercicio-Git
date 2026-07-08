let proveedores = JSON.parse(localStorage.getItem("proveedores")) || [];
let clientes = JSON.parse(localStorage.getItem("clientes")) || [];
let productos = JSON.parse(localStorage.getItem("productos")) || [];
let compras = JSON.parse(localStorage.getItem("compras")) || [];
let ventas = JSON.parse(localStorage.getItem("ventas")) || [];

function guardarDatos() {
  localStorage.setItem("proveedores", JSON.stringify(proveedores));
  localStorage.setItem("clientes", JSON.stringify(clientes));
  localStorage.setItem("productos", JSON.stringify(productos));
  localStorage.setItem("compras", JSON.stringify(compras));
  localStorage.setItem("ventas", JSON.stringify(ventas));
}

function agregarProveedor() {
  const nombre = document.getElementById("nombreProveedor").value.trim();

  if (nombre === "") {
    alert("Ingrese el nombre del proveedor.");
    return;
  }

  proveedores.push({
    id: Date.now(),
    nombre: nombre
  });

  document.getElementById("nombreProveedor").value = "";
  guardarDatos();
  renderizar();
}

function agregarCliente() {
  const nombre = document.getElementById("nombreCliente").value.trim();

  if (nombre === "") {
    alert("Ingrese el nombre del cliente.");
    return;
  }

  clientes.push({
    id: Date.now(),
    nombre: nombre
  });

  document.getElementById("nombreCliente").value = "";
  guardarDatos();
  renderizar();
}

function agregarProducto() {
  const nombre = document.getElementById("nombreProducto").value.trim();
  const precio = parseFloat(document.getElementById("precioProducto").value);
  const stock = parseInt(document.getElementById("stockProducto").value);
  const caducidad = document.getElementById("fechaCaducidad").value;
  const proveedorId = parseInt(document.getElementById("proveedorProducto").value);

  if (nombre === "" || isNaN(precio) || isNaN(stock) || caducidad === "" || isNaN(proveedorId)) {
    alert("Complete todos los datos del medicamento.");
    return;
  }

  productos.push({
    id: Date.now(),
    nombre: nombre,
    precio: precio,
    stock: stock,
    caducidad: caducidad,
    proveedorId: proveedorId
  });

  document.getElementById("nombreProducto").value = "";
  document.getElementById("precioProducto").value = "";
  document.getElementById("stockProducto").value = "";
  document.getElementById("fechaCaducidad").value = "";

  guardarDatos();
  renderizar();
}

function registrarCompra() {
  const productoId = parseInt(document.getElementById("productoCompra").value);
  const proveedorId = parseInt(document.getElementById("proveedorCompra").value);
  const cantidad = parseInt(document.getElementById("cantidadCompra").value);
  const costo = parseFloat(document.getElementById("costoCompra").value);

  if (isNaN(productoId) || isNaN(proveedorId) || isNaN(cantidad) || isNaN(costo)) {
    alert("Complete todos los datos de la compra.");
    return;
  }

  const producto = productos.find(p => p.id === productoId);
  producto.stock += cantidad;

  compras.push({
    id: Date.now(),
    productoId: productoId,
    proveedorId: proveedorId,
    cantidad: cantidad,
    costo: costo
  });

  document.getElementById("cantidadCompra").value = "";
  document.getElementById("costoCompra").value = "";

  guardarDatos();
  renderizar();
}

function registrarVenta() {
  const clienteId = parseInt(document.getElementById("clienteVenta").value);
  const productoId = parseInt(document.getElementById("productoVenta").value);
  const cantidad = parseInt(document.getElementById("cantidadVenta").value);

  if (isNaN(clienteId) || isNaN(productoId) || isNaN(cantidad)) {
    alert("Complete todos los datos de la venta.");
    return;
  }

  const producto = productos.find(p => p.id === productoId);

  if (cantidad > producto.stock) {
    alert("No hay suficiente stock disponible.");
    return;
  }

  const total = producto.precio * cantidad;
  producto.stock -= cantidad;

  ventas.push({
    id: Date.now(),
    clienteId: clienteId,
    productoId: productoId,
    cantidad: cantidad,
    total: total
  });

  document.getElementById("cantidadVenta").value = "";

  guardarDatos();
  renderizar();
}

function obtenerProveedor(id) {
  const proveedor = proveedores.find(p => p.id === id);
  return proveedor ? proveedor.nombre : "Sin proveedor";
}

function obtenerCliente(id) {
  const cliente = clientes.find(c => c.id === id);
  return cliente ? cliente.nombre : "Sin cliente";
}

function obtenerProducto(id) {
  const producto = productos.find(p => p.id === id);
  return producto ? producto.nombre : "Sin producto";
}

function estadoCaducidad(fecha) {
  const hoy = new Date();
  const caducidad = new Date(fecha);
  const diferencia = caducidad - hoy;
  const dias = Math.ceil(diferencia / (1000 * 60 * 60 * 24));

  if (dias < 0) {
    return `<span class="vencido">Vencido</span>`;
  } else if (dias <= 30) {
    return `<span class="proximo">Por vencer</span>`;
  } else {
    return `<span class="vigente">Vigente</span>`;
  }
}

function obtenerPremio(total) {
  if (total >= 500) {
    return "Cliente Oro - 15% de descuento";
  } else if (total >= 250) {
    return "Cliente Plata - 10% de descuento";
  } else if (total > 0) {
    return "Cliente Bronce - 5% de descuento";
  } else {
    return "Sin premio";
  }
}

function llenarSelects() {
  const selectsProveedores = [
    document.getElementById("proveedorProducto"),
    document.getElementById("proveedorCompra")
  ];

  selectsProveedores.forEach(select => {
    select.innerHTML = `<option value="">Seleccione proveedor</option>`;
    proveedores.forEach(proveedor => {
      select.innerHTML += `<option value="${proveedor.id}">${proveedor.nombre}</option>`;
    });
  });

  const selectsProductos = [
    document.getElementById("productoCompra"),
    document.getElementById("productoVenta")
  ];

  selectsProductos.forEach(select => {
    select.innerHTML = `<option value="">Seleccione medicamento</option>`;
    productos.forEach(producto => {
      select.innerHTML += `<option value="${producto.id}">${producto.nombre}</option>`;
    });
  });

  const clienteVenta = document.getElementById("clienteVenta");
  clienteVenta.innerHTML = `<option value="">Seleccione cliente</option>`;

  clientes.forEach(cliente => {
    clienteVenta.innerHTML += `<option value="${cliente.id}">${cliente.nombre}</option>`;
  });
}

function renderizarInventario() {
  const tabla = document.getElementById("tablaInventario");
  tabla.innerHTML = "";

  productos.forEach(producto => {
    tabla.innerHTML += `
      <tr>
        <td>${producto.nombre}</td>
        <td>${obtenerProveedor(producto.proveedorId)}</td>
        <td>Q${producto.precio.toFixed(2)}</td>
        <td>${producto.stock}</td>
        <td>${producto.caducidad}</td>
        <td>${estadoCaducidad(producto.caducidad)}</td>
      </tr>
    `;
  });
}

function renderizarVentas() {
  const tabla = document.getElementById("tablaVentas");
  tabla.innerHTML = "";

  ventas.forEach(venta => {
    tabla.innerHTML += `
      <tr>
        <td>${obtenerCliente(venta.clienteId)}</td>
        <td>${obtenerProducto(venta.productoId)}</td>
        <td>${venta.cantidad}</td>
        <td>Q${venta.total.toFixed(2)}</td>
      </tr>
    `;
  });
}

function renderizarRanking() {
  const tabla = document.getElementById("tablaRanking");
  tabla.innerHTML = "";

  const ranking = clientes.map(cliente => {
    const totalComprado = ventas
      .filter(venta => venta.clienteId === cliente.id)
      .reduce((suma, venta) => suma + venta.total, 0);

    return {
      nombre: cliente.nombre,
      total: totalComprado,
      premio: obtenerPremio(totalComprado)
    };
  });

  ranking.sort((a, b) => b.total - a.total);

  ranking.forEach(cliente => {
    tabla.innerHTML += `
      <tr>
        <td>${cliente.nombre}</td>
        <td>Q${cliente.total.toFixed(2)}</td>
        <td>${cliente.premio}</td>
      </tr>
    `;
  });
}

function renderizar() {
  llenarSelects();
  renderizarInventario();
  renderizarVentas();
  renderizarRanking();
}

renderizar();