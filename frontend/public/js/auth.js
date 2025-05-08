const API = '/api';

async function checkSuperAdmin() {
  const res = await fetch(`${API}/users`, { method: 'GET', headers: authHeader() });
  return res.status === 200; // true si hay usuarios
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
  setTimeout(()=> div.remove(),3000);
}

// Render form
window.addEventListener('DOMContentLoaded', async ()=>{
  const container = document.getElementById('form-area');
  const hasAdmin = await checkSuperAdmin().catch(()=>false);
  if (!hasAdmin) {
    container.innerHTML = `
      <form id="regForm">
        <input type="text" id="username" placeholder="Usuario" class="input-field" required>
        <input type="password" id="password" placeholder="Contraseña" class="input-field" required>
        <button class="btn">Registrar SuperAdmin</button>
      </form>`;
    document.getElementById('regForm').addEventListener('submit', async e=>{
      e.preventDefault();
      const u=document.getElementById('username').value;
      const p=document.getElementById('password').value;
      const res=await fetch(`${API}/auth/register`,{
        method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({username:u,password:p,role:'superAdmin'})
      });
      if(res.ok) { showMessage('Registrado!'); window.location.reload(); }
    });
  } else {
    container.innerHTML = `
      <form id="loginForm">
        <input type="text" id="username" placeholder="Usuario" class="input-field" required>
        <input type="password" id="password" placeholder="Contraseña" class="input-field" required>
        <button class="btn">Iniciar Sesión</button>
      </form>`;
    document.getElementById('loginForm').addEventListener('submit', async e=>{
      e.preventDefault();
      const u=document.getElementById('username').value;
      const p=document.getElementById('password').value;
      const res=await fetch(`${API}/auth/login`,{
        method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({username:u,password:p})
      });
      const data=await res.json();
      if(data.token) { localStorage.setItem('token',data.token); localStorage.setItem('role',data.role); window.location.href='dashboard.html'; }
      else showMessage(data.message,'error');
    });
  }
});