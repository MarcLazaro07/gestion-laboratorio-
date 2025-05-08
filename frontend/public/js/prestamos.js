// CRUD de préstamos
async function loadPrestamos() {
  const res = await fetch('/api/prestamos', { headers: authHeader() });
  const data = await res.json();
  const c = document.getElementById('prestamos');
  c.innerHTML = '<h2>Préstamos</h2><button onclick="showPrestamoModal()" class="btn">Nuevo</button>' +
    '<table class="table"><tr><th>Serie</th><th>Origen</th><th>Destino</th><th>Fecha</th><th>Estado</th><th>Acciones</th></tr>' +
    data.map(p => `
      <tr>
        <td>${p.equipo.numeroSerie}</td>
        <td>${p.laboratorioOrigen.nombre}</td>
        <td>${p.laboratorioDestino.nombre}</td>
        <td>${new Date(p.fechaPrestamo).toLocaleDateString()}</td>
        <td>${p.estado}</td>
        <td>
          <button onclick="editPrestamo('${p._id}')" class="btn btn-icon">✎</button>
          ${localStorage.getItem('role')==='superAdmin'
            ? `<button onclick="deletePrestamo('${p._id}')" class="btn btn-icon">🗑</button>`
            : ''}
        </td>
      </tr>`).join('') +
    '</table>';
}

// Modal de creación/edición para Préstamos
async function showPrestamoModal(prest = null) {
  const isEdit = !!prest;
  // Cargar laboratorios y equipos
  const labs = await fetch('/api/laboratorios', { headers: authHeader() }).then(r => r.json());
  const modal = document.createElement('div');
  modal.className = 'modal';
  modal.innerHTML = `
    <div class="modal-content">
      <h3>${isEdit ? 'Editar' : 'Nuevo'} Préstamo</h3>
      <form id="prestamoForm">
        <select name="laboratorioOrigen" required class="input-field">
          <option value="">Lab. Origen</option>
          ${labs.map(l => `<option value="${l._id}" ${prest?.laboratorioOrigen?._id===l._id?'selected':''}>${l.nombre}</option>`).join('')}
        </select>
        <select name="laboratorioDestino" required class="input-field">
          <option value="">Lab. Destino</option>
          ${labs.map(l => `<option value="${l._id}" ${prest?.laboratorioDestino?._id===l._id?'selected':''}>${l.nombre}</option>`).join('')}
        </select>
        <select name="equipo" required class="input-field">
          <option value="">Selecciona un equipo</option>
        </select>
        <input type="date" name="fechaDevolucionPrevista" required class="input-field" value="${prest?.fechaDevolucionPrevista?.substring(0,10) || ''}">
        <div class="modal-actions">
          <button type="submit" class="btn">${isEdit ? 'Actualizar' : 'Crear'}</button>
          <button type="button" class="btn btn-cancel" onclick="closeModal()">Cancelar</button>
        </div>
      </form>
    </div>
  `;
  document.body.appendChild(modal);

  const form = modal.querySelector('#prestamoForm');
  const origSel = form.laboratorioOrigen;
  const destSel = form.laboratorioDestino;
  const eqSel   = form.equipo;

  // Cuando elijas origen, carga equipos de ese lab
  origSel.onchange = async () => {
    const eqs = await fetch(`/api/equipos?laboratorio=${origSel.value}`, { headers: authHeader() }).then(r => r.json());
    eqSel.innerHTML = '<option value=\"\">Selecciona un equipo</option>' +
      eqs.map(e => `<option value="${e._id}" ${prest?.equipo?._id===e._id?'selected':''}>${e.numeroSerie}</option>`).join('');
  };
  if (isEdit) origSel.onchange();

  form.onsubmit = async e => {
    e.preventDefault();
    const body = {
      laboratorioOrigen: form.laboratorioOrigen.value,
      laboratorioDestino: form.laboratorioDestino.value,
      equipo: form.equipo.value,
      fechaDevolucionPrevista: form.fechaDevolucionPrevista.value
    };
    const method = isEdit ? 'PUT' : 'POST';
    const url = isEdit
      ? `/api/prestamos/${prest._id}`
      : '/api/prestamos';
    const res = await fetch(url, {
      method,
      headers: { ...authHeader(), 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });
    if (res.ok) {
      closeModal();
      loadPrestamos();
      showMessage(isEdit ? 'Préstamo actualizado' : 'Préstamo creado');
    }
  };
}

function editPrestamo(id) {
  fetch('/api/prestamos', { headers: authHeader() })
    .then(r => r.json())
    .then(list => {
      const p = list.find(x => x._id === id);
      showPrestamoModal(p);
    });
}