// Carga y gestión de incidencias de equipo
async function incidentesEq() {
  const imp = document.getElementById('impactoFilter')?.value || '';
  const est = document.getElementById('estadoFilter')?.value || '';
  const query = `?impacto=${imp}&estado=${est}`;
  const res = await fetch('/api/incidenciasEquipos' + query, {
    headers: authHeader()
  });
  const data = await res.json();
  const c = document.getElementById('incidenciasEquipos');
  c.innerHTML = '<h2>Incidencias de Equipo</h2>' +
    '<select id="impactoFilter" onchange="incidentesEq()" class="input-field"><option value="">Impacto</option><option>baja</option><option>media</option><option>alta</option></select>' +
    '<select id="estadoFilter" onchange="incidentesEq()" class="input-field"><option value="">Estado</option><option>sin empezar</option><option>en proceso</option><option>bloqueado</option><option>finalizado</option></select>' +
    '<table class="table"><tr><th>Serie</th><th>Lab</th><th>Impacto</th><th>Estado</th><th>Acciones</th></tr>' +
    data.map(i => `
      <tr>
        <td>${i.equipo.numeroSerie}</td>
        <td>${i.laboratorio.nombre}</td>
        <td>${i.impacto}</td>
        <td>${i.estado}</td>
        <td>
            <button onclick="editIncEq('${i._id}')" class="btn btn-icon">✎</button>
            ${localStorage.getItem('role')==='superAdmin'
            ? `<button onclick="deleteIncEq('${i._id}')" class="btn btn-icon">🗑</button>`
            : ''}
        </td>
      </tr>`).join('') +
    '</table>';
}

// Modal de creación/edición para Incidencias de Equipo
async function showIncEqModal(inc = null) {
  const isEdit = !!inc;
  // Cargar laboratorios y, tras elegir, cargar equipos
  const labs = await fetch('/api/laboratorios', { headers: authHeader() }).then(r => r.json());

  const modal = document.createElement('div');
  modal.className = 'modal';
  modal.innerHTML = `
    <div class="modal-content">
      <h3>${isEdit ? 'Editar' : 'Nueva'} Incidencia de Equipo</h3>
      <form id="incEqForm">
        <select name="laboratorio" required class="input-field">
          <option value="">Selecciona un laboratorio</option>
          ${labs.map(l => `<option value="${l._id}" ${inc?.laboratorio?._id === l._id ? 'selected' : ''}>${l.nombre}</option>`).join('')}
        </select>
        <select name="equipo" required class="input-field">
          <option value="">Selecciona un equipo</option>
        </select>
        <textarea name="descripcion" placeholder="Descripción" required class="input-field">${inc?.descripcion || ''}</textarea>
        <select name="impacto" required class="input-field">
          <option value="">Impacto</option>
          <option value="baja" ${inc?.impacto==='baja'?'selected':''}>Baja</option>
          <option value="media" ${inc?.impacto==='media'?'selected':''}>Media</option>
          <option value="alta" ${inc?.impacto==='alta'?'selected':''}>Alta</option>
        </select>
        <div class="modal-actions">
          <button type="submit" class="btn">${isEdit ? 'Actualizar' : 'Crear'}</button>
          <button type="button" class="btn btn-cancel" onclick="closeModal()">Cancelar</button>
        </div>
      </form>
    </div>
  `;
  document.body.appendChild(modal);

  const form = modal.querySelector('#incEqForm');
  const labSel = form.laboratorio;
  const eqSel  = form.equipo;

  // Cuando cambie el laboratorio, cargar equipos
  labSel.onchange = async () => {
    const eqs = await fetch(`/api/equipos?laboratorio=${labSel.value}`, { headers: authHeader() }).then(r => r.json());
    eqSel.innerHTML = '<option value=\"\">Selecciona un equipo</option>' +
      eqs.map(e => `<option value="${e._id}" ${inc?.equipo?._id===e._id?'selected':''}>${e.numeroSerie}</option>`).join('');
  };
  // Disparar load si es edición
  if (isEdit) labSel.onchange();

  form.onsubmit = async e => {
    e.preventDefault();
    const body = {
      laboratorio: form.laboratorio.value,
      equipo: form.equipo.value,
      descripcion: form.descripcion.value,
      impacto: form.impacto.value
    };
    const method = isEdit ? 'PUT' : 'POST';
    const url = isEdit
      ? `/api/incidenciasEquipos/${inc._id}`
      : '/api/incidenciasEquipos';
    const res = await fetch(url, {
      method,
      headers: { ...authHeader(), 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });
    if (res.ok) {
      closeModal();
      incidentesEq();
      showMessage(isEdit ? 'Incidencia actualizada' : 'Incidencia creada');
    }
  };
}

function editIncEq(id) {
  fetch('/api/incidenciasEquipos', { headers: authHeader() })
    .then(r => r.json())
    .then(list => {
      const inc = list.find(x => x._id === id);
      showIncEqModal(inc);
    });
}

async function deleteIncEq(id) {
  await fetch(`/api/incidenciasEquipos/${id}`, {
    method: 'DELETE',
    headers: authHeader()
  });
  incidentesEq();
  showMessage('Incidencia de equipo eliminada');
}