// Carga y gestión de incidencias generales
async function incidentesGen() {
  try {
  const res = await fetch('/api/incidenciasGenerales', {
    headers: authHeader()
  });
  if (!res.ok) throw new Error('Error cargando incidencias');
  const data = await res.json();
  const c = document.getElementById('incidenciasGenerales');
  c.innerHTML = '<h2>Incidencias Generales</h2><button onclick="showIncGenModal()" class="btn">Nueva</button>' +
    '<table class="table"><tr><th>Descripción</th><th>Fecha</th><th>Creador</th><th>Docente</th><th>Acciones</th></tr>' +
    data.map(i => `
      <tr>
        <td>${i.descripcion}</td>
        <td>${new Date(i.fechaCreacion).toLocaleDateString()}</td>
        <td>${i.creador.username}</td>
        <td>${i.docente.username}</td>
        <td>
          <button onclick="editIncGen('${i._id}')" class="btn btn-icon">✎</button>
          ${localStorage.getItem('role')==='superAdmin'
            ? `<button onclick="deleteIncGen('${i._id}')" class="btn btn-icon">🗑</button>`
            : ''}
        </td>
      </tr>`).join('') +
    '</table>';
  } catch (error) {
    showMessage('No se pudieron cargar los laboratorios. Inténtalo más tarde.', 'error');
  }
}

// Modal de creación/edición para Incidencias Generales
function showIncGenModal(inc = null) {
  const isEdit = !!inc;
  const modal = document.createElement('div');
  modal.className = 'modal';
  modal.innerHTML = `
    <div class="modal-content">
      <h3>${isEdit ? 'Editar' : 'Nueva'} Incidencia General</h3>
      <form id="incGenForm">
        <textarea name="descripcion" placeholder="Descripción" required class="input-field">${inc?.descripcion || ''}</textarea>
        <select name="docente" required class="input-field">
          <option value="">Selecciona un docente</option>
        </select>
        <div class="modal-actions">
          <button type="submit" class="btn">${isEdit ? 'Actualizar' : 'Crear'}</button>
          <button type="button" class="btn btn-cancel" onclick="closeModal()">Cancelar</button>
        </div>
      </form>
    </div>
  `;
  document.body.appendChild(modal);

  // Cargar docentes
  fetch('/api/users', { headers: authHeader() })
    .then(res => res.json())
    .then(users => {
      const sel = modal.querySelector('select[name="docente"]');
      users
        .filter(u => u.role === 'docente')
        .forEach(u => {
          const opt = document.createElement('option');
          opt.value = u._id;
          opt.text = u.username;
          if (inc?.docente?._id === u._id) opt.selected = true;
          sel.appendChild(opt);
        });
    });

  document.getElementById('incGenForm').onsubmit = async e => {
    e.preventDefault();
    const form = e.target;
    const body = {
      descripcion: form.descripcion.value,
      docente: form.docente.value
    };
    const method = isEdit ? 'PUT' : 'POST';
    const url = isEdit
      ? `/api/incidenciasGenerales/${inc._id}`
      : '/api/incidenciasGenerales';
    const res = await fetch(url, {
      method,
      headers: { ...authHeader(), 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });
    if (res.ok) {
      closeModal();
      incidentesGen();
      showMessage(isEdit ? 'Incidencia actualizada' : 'Incidencia creada');
    }
  };
}

function editIncGen(id) {
  fetch('/api/incidenciasGenerales', { headers: authHeader() })
    .then(r => r.json())
    .then(list => {
      const inc = list.find(x => x._id === id);
      showIncGenModal(inc);
    });
}

async function deleteIncGen(id) {
  await fetch(`/api/incidenciasGenerales/${id}`, {
    method: 'DELETE',
    headers: authHeader()
  });
  incidentesGen();
  showMessage('Incidencia eliminada');
}