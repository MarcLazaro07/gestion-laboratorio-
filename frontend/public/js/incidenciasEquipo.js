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
  c.innerHTML = `
  <h2 class="section-title">Incidencias de Equipo</h2>
  <div class="filters">
    <select id="impactoFilter" onchange="incidentesEq()" class="input-field">
      <option value="">Impacto</option>
      <option value="baja">Baja</option>
      <option value="media">Media</option>
      <option value="alta">Alta</option>
    </select>
    <select id="estadoFilter" onchange="incidentesEq()" class="input-field">
      <option value="">Estado</option>
      <option value="sin empezar">Sin empezar</option>
      <option value="en proceso">En proceso</option>
      <option value="bloqueado">Bloqueado</option>
      <option value="finalizado">Finalizado</option>
    </select>
    <button onclick="showIncEqModal()" class="btn btn-primary">Nueva Incidencia</button>
  </div>
  <table class="table">
    <thead>
      <tr>
        <th>Equipo</th>
        <th>Laboratorio</th>
        <th>Descripción</th>
        <th>Impacto</th>
        <th>Fecha Apertura</th>
        <th>Creado por</th>
        <th>Asignado a</th>
        <th>Estado</th>
        <th>Fecha Resolución</th>
        <th>Acciones</th>
      </tr>
    </thead>
    <tbody>
      ${data.map(i => `
        <tr>
          <td>${i.equipo.numeroSerie}</td>
          <td>${i.laboratorio.nombre}</td>
          <td>${i.descripcion}</td>
          <td>${i.impacto}</td>
          <td>${new Date(i.fechaApertura).toLocaleString()}</td>
          <td>${i.creador.username}</td>
          <td>${i.asignadoA?.username || '-'}</td>
          <td>${i.estado}</td>
          <td>${i.fechaResolucion ? new Date(i.fechaResolucion).toLocaleDateString() : '-'}</td>
          <td>
            <button onclick="editIncEq('${i._id}')" class="btn btn-icon">✎</button>
            ${localStorage.getItem('role')==='superAdmin'
              ? `<button onclick="deleteIncEq('${i._id}')" class="btn btn-icon">🗑</button>`
              : ''}
          </td>
        </tr>
      `).join('')}
    </tbody>
  </table>
`;
}

// Modal de creación/edición para Incidencias de Equipo
async function showIncEqModal(inc = null) {
  const isEdit = !!inc;

  // 1) Cargar laboratorios
  const labs = await fetch('/api/laboratorios', { headers: authHeader() }).then(r => r.json());

  // 2) Cargar usuarios (para creador)
  const users = await fetch('/api/users', { headers: authHeader() })
    .then(r => r.json())
    .then(arr => arr.filter(u => ['superAdmin','tecnico','docente'].includes(u.role)));

  const modal = document.createElement('div');
  modal.className = 'modal';
  modal.innerHTML = `
  <div class="modal-content">
    <h3 class="modal-title">${isEdit ? 'Editar' : 'Nueva'} Incidencia de Equipo</h3>
    <form id="incEqForm" class="form-modal">
      <label>Laboratorio</label>
      <select name="laboratorio" required class="input-field">
        <option value="">Selecciona un laboratorio</option>
        ${labs.map(l => `
          <option value="${l._id}" ${inc?.laboratorio?._id===l._id?'selected':''}>${l.nombre}</option>
        `).join('')}
      </select>

      <label>Equipo</label>
      <select name="equipo" required class="input-field">
        <option value="">Selecciona un equipo</option>
      </select>

      <label>Descripción</label>
      <textarea name="descripcion" required class="input-field" placeholder="Describe la incidencia">${inc?.descripcion||''}</textarea>

      <label>Impacto</label>
      <select name="impacto" required class="input-field">
        <option value="">Selecciona impacto</option>
        <option value="baja"   ${inc?.impacto==='baja'?'selected':''}>Baja</option>
        <option value="media"  ${inc?.impacto==='media'?'selected':''}>Media</option>
        <option value="alta"   ${inc?.impacto==='alta'?'selected':''}>Alta</option>
      </select>

      <label>Creado por</label>
      <select name="creador" required class="input-field">
        <option value="">Selecciona creador</option>
        ${users.map(u => `
          <option value="${u._id}" ${inc?.creador?._id===u._id?'selected':''}>${u.username}</option>
        `).join('')}
      </select>

      <label>Asignado a</label>
      <select name="asignadoA" class="input-field">
        <option value="">Selecciona asignado (opcional)</option>
        ${users.map(u => `
          <option value="${u._id}" ${inc?.asignadoA?._id===u._id?'selected':''}>${u.username}</option>
        `).join('')}
      </select>

      <label>Estado</label>
      <select name="estado" required class="input-field">
        <option value="sin empezar" ${inc?.estado==='sin empezar'?'selected':''}>Sin empezar</option>
        <option value="en proceso"  ${inc?.estado==='en proceso'?'selected':''}>En proceso</option>
        <option value="bloqueado"   ${inc?.estado==='bloqueado'?'selected':''}>Bloqueado</option>
        <option value="finalizado"  ${inc?.estado==='finalizado'?'selected':''}>Finalizado</option>
      </select>

      <label>Fecha Apertura</label>
      <input type="datetime-local" name="fechaApertura" class="input-field"
        value="${inc?.fechaApertura ? new Date(inc.fechaApertura).toISOString().substring(0,16) : ''}">

      <label>Fecha Resolución</label>
      <input type="date" name="fechaResolucion" class="input-field"
        value="${inc?.fechaResolucion?.substring(0,10) || ''}">

      <div class="modal-actions">
        <button type="submit" class="btn btn-primary">${isEdit ? 'Actualizar' : 'Crear'}</button>
        <button type="button" class="btn btn-cancel" onclick="closeModal()">Cancelar</button>
      </div>
    </form>
  </div>
`;
  document.body.appendChild(modal);

  // 3) Al cambiar laboratorio, recargar equipos
  const form = modal.querySelector('#incEqForm');
  const labSel = form.laboratorio;
  const eqSel  = form.equipo;
  labSel.onchange = async () => {
    const eqs = await fetch(`/api/equipos?laboratorio=${labSel.value}`, { headers: authHeader() }).then(r => r.json());
    eqSel.innerHTML = '<option value="">Selecciona un equipo</option>' +
      eqs.map(e => `<option value="${e._id}" ${inc?.equipo?._id===e._id?'selected':''}>${e.numeroSerie}</option>`).join('');
  };
  if (isEdit) labSel.onchange();

  // 4) Envío del formulario
  form.onsubmit = async e => {
    e.preventDefault();
    const body = {
  laboratorio:     form.laboratorio.value,
  equipo:          form.equipo.value,
  descripcion:     form.descripcion.value,
  impacto:         form.impacto.value,
  creador:         form.creador.value,
  asignadoA:       form.asignadoA.value || null,
  estado:          form.estado.value,
  fechaApertura:   form.fechaApertura.value || null,
  fechaResolucion: form.fechaResolucion.value || null
};
    const method = isEdit ? 'PUT' : 'POST';
    const url    = isEdit
      ? `/api/incidenciasEquipos/${inc._id}`
      : '/api/incidenciasEquipos';
    const res    = await fetch(url, {
      method,
      headers: { ...authHeader(), 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });
    if (res.ok) {
      closeModal();
      incidentesEq();
      showMessage(isEdit?'Incidencia actualizada':'Incidencia creada');
    }
  };
}

function editIncEq(id) {
  fetch(`/api/incidenciasEquipos/${id}`, { headers: authHeader() })
    .then(r => r.json())
    .then(inc => showIncEqModal(inc));
}

async function deleteIncEq(id) {
  await fetch(`/api/incidenciasEquipos/${id}`, {
    method: 'DELETE',
    headers: authHeader()
  });
  incidentesEq();
  showMessage('Incidencia de equipo eliminada');
}