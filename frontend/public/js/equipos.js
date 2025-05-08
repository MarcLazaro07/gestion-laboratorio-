// CRUD de equipos
async function loadEquipos() {
  const labId = document.getElementById('labFilter')?.value || '';
  const url = labFilter ? `/api/equipos?laboratorio=${labFilter}` : '/api/equipos';
  const res = await fetch(url, { headers: authHeader() });
  const eqs = await res.json();
  const c = document.getElementById('equipos');
  c.innerHTML = '<h2>Equipos</h2>' +
    '<select id="labFilter" onchange="loadEquipos()" class="input-field"><option value="">Todos</option>' +
    eqs.map(e => `<option value="${e.laboratorio._id}">${e.laboratorio.nombre}</option>`).join('') +
    '</select>' +
    '<table class="table"><tr><th>Serie</th><th>Marca</th><th>Modelo</th><th>Lab</th><th>Acciones</th></tr>' +
    eqs.map(e => `
      <tr>
        <td>${e.numeroSerie}</td>
        <td>${e.marca}</td>
        <td>${e.modelo}</td>
        <td>${e.laboratorio.nombre}</td>
        <td>
          <button onclick="editEquipo('${e._id}')" class="btn btn-icon">✎</button>
          ${localStorage.getItem('role')==='superAdmin'
            ? `<button onclick="deleteEquipo('${e._id}')" class="btn btn-icon">🗑</button>`
            : ''}
        </td>
      </tr>`).join('') +
    '</table>';
}

async function showEquipoModal(equipo = null) {
  const isEdit = !!equipo;
  // Cargar lista de laboratorios para el selector
  const labsRes = await fetch('/api/laboratorios', { headers: authHeader() });
  const labs = await labsRes.json();

  const modal = document.createElement('div');
  modal.className = 'modal';
  modal.innerHTML = `
    <div class="modal-content">
      <h3>${isEdit ? 'Editar' : 'Nuevo'} Equipo</h3>
      <form id="equipoForm">
        <input type="text" name="numeroSerie" placeholder="Número de Serie" value="${equipo?.numeroSerie || ''}" required class="input-field">
        <input type="text" name="marca" placeholder="Marca" value="${equipo?.marca || ''}" class="input-field">
        <input type="text" name="modelo" placeholder="Modelo" value="${equipo?.modelo || ''}" class="input-field">
        <select name="laboratorio" required class="input-field">
          <option value=\"\">Selecciona un laboratorio</option>
          ${labs.map(l => `
            <option value="${l._id}" ${equipo?.laboratorio._id === l._id ? 'selected' : ''}>
              ${l.nombre}
            </option>
          `).join('')}
        </select>
        <input type="text" name="estado" placeholder="Estado" value="${equipo?.estado || ''}" class="input-field">
        <input type="date" name="fechaAdquisicion" placeholder="Fecha de Adquisición" value="${equipo?.fechaAdquisicion?.substring(0,10) || ''}" class="input-field">
        <div class="modal-actions">
          <button type="submit" class="btn">${isEdit ? 'Actualizar' : 'Crear'}</button>
          <button type="button" class="btn btn-cancel" onclick="closeModal()">Cancelar</button>
        </div>
      </form>
    </div>
  `;
  document.body.appendChild(modal);

  document.getElementById('equipoForm').onsubmit = async (e) => {
    e.preventDefault();
    const form = e.target;
    const body = {
      numeroSerie: form.numeroSerie.value,
      marca: form.marca.value,
      modelo: form.modelo.value,
      laboratorio: form.laboratorio.value,
      estado: form.estado.value,
      fechaAdquisicion: form.fechaAdquisicion.value
    };

    const method = isEdit ? 'PUT' : 'POST';
    const url = isEdit ? `/api/equipos/${equipo._id}` : '/api/equipos';

    const res = await fetch(url, {
      method,
      headers: { ...authHeader(), 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });

    if (res.ok) {
      closeModal();
      loadEquipos();
      showMessage(isEdit ? 'Equipo actualizado' : 'Equipo creado');
    } else {
      const err = await res.json();
      showMessage(err.message || 'Error', 'error');
    }
  };
}

function editEquipo(id) {
  // Obtener datos del equipo para edición
  fetch(`/api/equipos?laboratorio=`, { headers: authHeader() })
    .then(res => res.json())
    .then(eqs => {
      const eq = eqs.find(e => e._id === id);
      showEquipoModal(eq);
    });
}