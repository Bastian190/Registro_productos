document.addEventListener('DOMContentLoaded', () => {
  const codigo = document.getElementById('codigo');
  const nombre = document.getElementById('nombre');
  const bodega = document.getElementById('bodega');
  const sucursal = document.getElementById('sucursal');
  const moneda = document.getElementById('moneda');
  const precio = document.getElementById('precio');
  const descripcion = document.getElementById('descripcion');
  const listaMateriales = document.getElementById('lista-materiales');
  const botonGuardar = document.getElementById('guardar');
  const formulario = document.getElementById('formulario');

  fetch('backend/obtener_bodegas.php').then(r => r.json()).then(d => {
    d.forEach(item => {
      const op = document.createElement('option');
      op.value = item.id;
      op.textContent = item.nombre;
      bodega.appendChild(op);
    });
  });

  fetch('backend/obtener_monedas.php').then(r => r.json()).then(d => {
    d.forEach(item => {
      const op = document.createElement('option');
      op.value = item.id;
      op.textContent = item.nombre + ' (' + item.codigo + ')';
      moneda.appendChild(op);
    });
  });

  fetch('backend/bd_materiales.php').then(r => r.json()).then(d => {
    d.forEach(item => {
      const label = document.createElement('label');
      const chk = document.createElement('input');
      chk.type = 'checkbox';
      chk.name = 'material';
      chk.value = item.id;
      label.appendChild(chk);
      label.appendChild(document.createTextNode(' ' + item.nombre));
      listaMateriales.appendChild(label);
    });
  });

  bodega.addEventListener('change', () => {
    sucursal.innerHTML = '<option value=""></option>';
    const id = bodega.value;
    if (!id) return;
    fetch('backend/obtener_sucursales.php?bodega_id=' + id).then(r => r.json()).then(d => {
      d.forEach(item => {
        const op = document.createElement('option');
        op.value = item.id;
        op.textContent = item.nombre;
        sucursal.appendChild(op);
      });
    });
  });

  function alerta(mensaje) {
    alert(mensaje);
  }

  function validarFormulario() {
    const valCodigo = codigo.value.trim();
    if (valCodigo === '') { alerta('El código del producto no puede estar en blanco.'); return false; }
    if (!/^(?=.*[A-Za-z])(?=.*[0-9])[A-Za-z0-9]{5,15}$/.test(valCodigo)) { alerta('El código debe contener letras y números'); return false; }
    if (valCodigo.length < 5 || valCodigo.length > 15) { alerta('El código debe tener entre 5 y 15 caracteres.'); return false; }

    const valNombre = nombre.value.trim();
    if (valNombre === '') { alerta('El nombre del producto no puede estar en blanco.'); return false; }
    if (valNombre.length < 2 || valNombre.length > 50) { alerta('El nombre debe tener entre 2 y 50 caracteres.'); return false; }

    if (bodega.value === '') { alerta('Debe seleccionar una bodega.'); return false; }
    if (sucursal.value === '') { alerta('Debe seleccionar una sucursal.'); return false; }
    if (moneda.value === '') { alerta('Debe seleccionar una moneda.'); return false; }

    const valPrecio = precio.value.trim();
    if (valPrecio === '') { alerta('El precio no puede estar en blanco.'); return false; }
    if (!/^\d+(\.\d{1,2})?$/.test(valPrecio)) { alerta('El precio debe ser un número positivo con hasta dos decimales'); return false; }

    const materialesSeleccionados = Array.from(document.querySelectorAll('input[name="material"]:checked')).map(i => i.value);
    if (materialesSeleccionados.length < 2) { alerta('Debe seleccionar al menos dos materiales'); return false; }

    const valDescripcion = descripcion.value.trim();
    if (valDescripcion === '') { alerta('La descripción no puede estar en blanco.'); return false; }
    if (valDescripcion.length < 10 || valDescripcion.length > 1000) { alerta('La descripción debe tener entre 10 y 1000 caracteres'); return false; }

    return true;
  }

  async function verificarCodigoUnico(cod) {
    try {
      const res = await fetch('backend/verificar_codigo.php?codigo=' + encodeURIComponent(cod));
      if (!res.ok) throw new Error('Error en la respuesta del servidor');
      const data = await res.json();
      return !data.existe;
    } catch {
      alerta("Error de conexión al verificar el código en la base de datos.");
      throw new Error('Conexión fallida');
    }
  }

  botonGuardar.addEventListener('click', async (e) => {
    e.preventDefault();
    if (!validarFormulario()) return;

    const cod = codigo.value.trim();
    let unico;
    try {
      unico = await verificarCodigoUnico(cod);
    } catch {
      return;
    }

    if (!unico) { alerta("El código del producto ya está registrado."); return; }

    const materialesSeleccionados = Array.from(document.querySelectorAll('input[name="material"]:checked')).map(i => i.value);

    const cuerpo = {
      codigo: cod,
      nombre: nombre.value.trim(),
      bodega: parseInt(bodega.value),
      sucursal: parseInt(sucursal.value),
      moneda: parseInt(moneda.value),
      precio: parseFloat(precio.value.trim()).toFixed(2),
      materiales: materialesSeleccionados,
      descripcion: descripcion.value.trim()
    };

    try {
      const r = await fetch('backend/guardar_producto.php', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(cuerpo)
      });
      const res = await r.json();
      if (r.ok && res.ok) {
        alerta("Producto guardado correctamente.");
        formulario.reset();
        sucursal.innerHTML = '<option value=""></option>';
        listaMateriales.querySelectorAll('input').forEach(i => i.checked = false);
      } else if (res.error === 'codigo_existe') {
        alerta("El código del producto ya está registrado.");
      } else {
        alerta("Error al guardar el producto.");
      }
    } catch {
      alerta("Error de conexión al servidor.");
    }
  });

  precio.addEventListener('input', () => {
    precio.value = precio.value.replace(/[^0-9.]/g, '');
    if ((precio.value.match(/\./g) || []).length > 1) {
      precio.value = precio.value.slice(0, -1);
    }
  });
});
