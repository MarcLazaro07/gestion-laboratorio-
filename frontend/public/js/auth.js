const API = '/api';
// Comprueba si hay usuarios en la BD (nuevo endpoint público)
async function hasAnyUser() {
  const res = await fetch(`${API}/auth/check-first`);
  if (!res.ok) return false;
  const { hasUser } = await res.json();
  return hasUser;
} catch (error) {
    showMessage('Error al conectar con el servidor. Inténtalo más tarde.', 'error');
    return false;
  }

function authHeader() {
  const token = localStorage.getItem('token');
  return token ? { 'Authorization': 'Bearer ' + token } : {};
}

function showMessage(msg, type='success') {
  const div = document.createElement('div');
  div.className = `toast ${type}`;
  div.innerText = msg;
  document.body.append(div);
  setTimeout(() => div.remove(), 3000);
}

window.addEventListener('DOMContentLoaded', async () => {
  // 1) Si ya tengo token, voy directo a la app
  if (localStorage.getItem('token')) {
    // Verificar si el token es válido antes de redirigir
    const res = await fetch(`${API}/auth/validate-token`, { headers: authHeader() });
    if (res.ok) {
      return window.location.href = 'index.html';
    } else {
      localStorage.clear(); // Limpiar token inválido
    }
  }

  const container = document.getElementById('form-area');
  const userExists = await hasAnyUser().catch(() => false);

  if (!userExists) {
    // 2) Formulario de registro
    container.innerHTML = `
      <form id="authForm">
        <input name="username"   placeholder="Usuario"    class="input-field" required>
        <input name="password"   type="password" placeholder="Contraseña" class="input-field" required>
        <button type="submit" class="btn">Registrar SuperAdmin</button>
      </form>`;
    document.getElementById('authForm').onsubmit = handleRegister;
  } else {
    // 3) Formulario de login
    container.innerHTML = `
      <form id="authForm">
        <input name="username"   placeholder="Usuario"    class="input-field" required>
        <input name="password"   type="password" placeholder="Contraseña" class="input-field" required>
        <button type="submit" class="btn">Iniciar Sesión</button>
      </form>`;
    document.getElementById('authForm').onsubmit = handleLogin;
  }
});

async function handleRegister(e) {
  e.preventDefault();
  const form = e.target;
  const body = {
    username: form.username.value,
    password: form.password.value,
    role: 'superAdmin'
  };
  const res = await fetch(`${API}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });

  if (res.ok) {
    // Extraemos token y rol
    const { token, role } = await res.json();
    localStorage.setItem('token', token);
    localStorage.setItem('role', role);
    showMessage('SuperAdmin registrado');
    window.location.href = 'index.html';
  } else {
    const err = await res.json();
    showMessage(err.message || 'Error al registrar', 'error');
  }
}

async function handleLogin(e) {
  e.preventDefault();
  const form = e.target;
  const body = {
    username: form.username.value,
    password: form.password.value
  };
  const res = await fetch(`${API}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });

  const data = await res.json();
  if (data.token) {
    localStorage.setItem('token', data.token);
    localStorage.setItem('role', data.role);
    showMessage('Inicio de sesión exitoso');
    window.location.href = 'index.html';
  } else {
    showMessage(data.message || 'Credenciales inválidas', 'error');
  }
}