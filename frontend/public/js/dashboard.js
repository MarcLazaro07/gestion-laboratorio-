document.addEventListener('DOMContentLoaded',()=>{
  if(!localStorage.getItem('token')) return window.location.href='index.html';
  const tabs=document.querySelectorAll('.nav-item, .mobile-item');
  const contents=document.querySelectorAll('.tab-content');
  const title=document.getElementById('section-title');
  const role=localStorage.getItem('role');
  document.querySelectorAll('.superadmin-only').forEach(el=>{ if(role!=='superAdmin') el.style.display='none'; });

  tabs.forEach(tab=>tab.addEventListener('click',()=>{
    contents.forEach(c=>c.classList.remove('active'));
    document.getElementById(tab.dataset.tab).classList.add('active');
    title.innerText = tab.innerText;
    if(window.innerWidth<=768) document.getElementById('mobile-menu').classList.toggle('show');
  }));
  // activate default
  document.querySelector('[data-tab="incidenciasGenerales"]').click();

  document.getElementById('mobile-menu-btn').onclick=()=>{
    document.getElementById('mobile-menu').classList.toggle('show');
  };
  document.getElementById('logoutBtn').onclick=()=>{
    localStorage.clear(); window.location.href='index.html';
  };

  // Invocar carga de cada sección
  incidentesGen(); incidentesEq(); loadLabs(); loadEquipos(); loadHorarios(); loadPrestamos(); loadUsers();
});