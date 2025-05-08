// CRUD de laboratorios
async function loadLabs() {
  const res = await fetch('/api/laboratorios', { headers: authHeader() });
  const labs = await res.json();
  const c = document.getElementById('laboratorios');
  c.innerHTML = '<h2>Laboratorios</h2><button onclick="showLabModal()" class="btn">Nuevo</button>' +
    '<table class="table"><tr><th>Nombre</th><th>Ubicación</th><th>Cantidad</th><th>Acciones</th></tr>' +
    labs.map(l => `
      <tr>
        <td>${l.nombre}</td>
        <td>${l.ubicacion}</td>
        <td>${l.cantidadEquipos}</td>
        <td>
          <button onclick="editLab('${l._id}')" class="btn btn-icon">✎</button>
          ${localStorage.getItem('role')==='superAdmin'
            ? `<button onclick="deleteLab('${l._id}')" class="btn btn-icon">🗑</button>`
            : ''}
        </td>
      </tr>`).join('') +
    '</table>';
}

function showLabModal(lab = null) {
  const isEdit = !!lab;
  const modal = document.createElement('div');
  modal.className = 'modal';
  modal.innerHTML = `
    <div class="modal-content">
      <h3>${isEdit ? 'Editar' : 'Nuevo'} Laboratorio</h3>
      <form id="labForm">
        <input type="text" name="nombre" placeholder="Nombre" value="${lab?.nombre || ''}" required class="input-field">
        <input type="text" name="ubicacion" placeholder="Ubicación" value="${lab?.ubicacion || ''}" class="input-field">
        <input type="number" name="cantidadEquipos" placeholder="Cantidad de Equipos" value="${lab?.cantidadEquipos || ''}" class="input-field">
        <button type="submit" class="btn">${isEdit ? 'Actualizar' : 'Crear'}</button>
        <button type="button" class="btn btn-cancel" onclick="closeModal()">Cancelar</button>
      </form>
    </div>
  `;
  document.body.appendChild(modal);

  document.getElementById('labForm').onsubmit = async (e) => {
    e.preventDefault();
    const form = e.target;
    const body = {
      nombre: form.nombre.value,
      ubicacion: form.ubicacion.value,
      cantidadEquipos: parseInt(form.cantidadEquipos.value)
    };

    const method = isEdit ? 'PUT' : 'POST';
    const url = isEdit ? `/api/laboratorios/${lab._id}` : '/api/laboratorios';

    const res = await fetch(url, {
      method,
      headers: { ...authHeader(), 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });

    if (res.ok) {
      closeModal();
      loadLabs();
      showMessage(isEdit ? 'Laboratorio actualizado' : 'Laboratorio creado');
    }
  };
}

function editLab(id) {
  fetch(`/api/laboratorios`, { headers: authHeader() })
    .then(res => res.json())
    .then(labs => {
      const lab = labs.find(l => l._id === id);
      showLabModal(lab);
    });
}

function closeModal() {
  document.querySelector('.modal')?.remove();
}

async function deleteLab(id) {
  await fetch(`/api/laboratorios/${id}`, {
    method: 'DELETE',
    headers: authHeader()
  });
  loadLabs();
  showMessage('Laboratorio eliminado');
}