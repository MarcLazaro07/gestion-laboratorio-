// CRUD de usuarios
async function loadUsers() {
  const res = await fetch('/api/users', { headers: authHeader() });
  const data = await res.json();
  const c = document.getElementById('usuarios');
  c.innerHTML = '<h2>Usuarios</h2><button onclick="showUserModal()" class="btn">Nuevo</button>' +
    '<table class="table"><tr><th>Usuario</th><th>Rol</th><th>Activo</th><th>Acciones</th></tr>' +
    data.map(u => `
      <tr>
        <td>${u.username}</td>
        <td>${u.role}</td>
        <td>${u.active}</td>
        <td>
          <button onclick="editUser('${u._id}')" class="btn btn-icon">✎</button>
          <button onclick="deleteUser('${u._id}')" class="btn btn-icon">🗑</button>
        </td>
      </tr>`).join('') +
    '</table>';
}

async function showUserModal(user = null) {
  const isEdit = !!user;

  const modal = document.createElement('div');
  modal.className = 'modal';
  modal.innerHTML = `
    <div class="modal-content">
      <h3>${isEdit ? 'Editar' : 'Nuevo'} Usuario</h3>
      <form id="userForm">
        <input type="text" name="username" placeholder="Usuario" value="${user?.username || ''}" required class="input-field">
        <input type="password" name="password" placeholder="${isEdit ? 'Nueva contraseña (opcional)' : 'Contraseña'}" class="input-field">
        <select name="role" required class="input-field">
          <option value="">Selecciona un rol</option>
          <option value="superAdmin" ${user?.role === 'superAdmin' ? 'selected' : ''}>SuperAdmin</option>
          <option value="tecnico" ${user?.role === 'tecnico' ? 'selected' : ''}>Técnico</option>
          <option value="docente" ${user?.role === 'docente' ? 'selected' : ''}>Docente</option>
        </select>
        <label class="checkbox-container">
          <input type="checkbox" name="active" ${user?.active ? 'checked' : ''}>
          Activo
        </label>
        <div class="modal-actions">
          <button type="submit" class="btn">${isEdit ? 'Actualizar' : 'Crear'}</button>
          <button type="button" class="btn btn-cancel" onclick="closeModal()">Cancelar</button>
        </div>
      </form>
    </div>
  `;
  document.body.appendChild(modal);

  document.getElementById('userForm').onsubmit = async (e) => {
    e.preventDefault();
    const form = e.target;
    const body = {
      username: form.username.value,
      role: form.role.value,
      active: form.active.checked
    };
    if (form.password.value) {
      body.password = form.password.value;
    }

    const method = isEdit ? 'PUT' : 'POST';
    const url = isEdit ? `/api/users/${user._id}` : '/api/auth/register';

    const res = await fetch(url, {
      method,
      headers: { ...authHeader(), 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });

    if (res.ok) {
      closeModal();
      loadUsers();
      showMessage(isEdit ? 'Usuario actualizado' : 'Usuario creado');
    } else {
      const err = await res.json();
      showMessage(err.message || 'Error', 'error');
    }
  };
}

function editUser(id) {
  fetch('/api/users', { headers: authHeader() })
    .then(res => res.json())
    .then(users => {
      const u = users.find(u => u._id === id);
      showUserModal(u);
    });
}