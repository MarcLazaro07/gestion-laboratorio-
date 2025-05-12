document.addEventListener('DOMContentLoaded', async () => {
  try {
    // Verificar si el token existe y es válido
    const token = localStorage.getItem('token');
    if (!token) {
      // Si no hay token, redirigir a log.html
      window.location.href = 'log.html';
      return;
    }

    // Validar el token llamando al backend
    const res = await fetch('/api/auth/validate-token', {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!res.ok) {
      // Si el token es inválido, limpiar localStorage y redirigir
      localStorage.clear();
      window.location.href = 'log.html';
      return;
    }

    // Si el token es válido, continuar configurando el dashboard
    const tabs = document.querySelectorAll('.nav-item, .mobile-item');
    const contents = document.querySelectorAll('.tab-content');
    const title = document.getElementById('section-title');
    const role = localStorage.getItem('role');

    // Mostrar/ocultar elementos según el rol
    document.querySelectorAll('.superadmin-only').forEach((el) => {
      if (role !== 'superAdmin') el.style.display = 'none';
    });

    tabs.forEach((tab) =>
      tab.addEventListener('click', () => {
        contents.forEach((c) => c.classList.remove('active'));
        document.getElementById(tab.dataset.tab).classList.add('active');
        title.innerText = tab.innerText;
        if (window.innerWidth <= 768) document.getElementById('mobile-menu').classList.toggle('show');
      })
    );

    // Activar la pestaña predeterminada
    document.querySelector('[data-tab="incidenciasGenerales"]').click();

    // Configurar botones y eventos
    document.getElementById('mobile-menu-btn').onclick = () => {
      document.getElementById('mobile-menu').classList.toggle('show');
    };

    document.getElementById('logoutBtn').onclick = () => {
      localStorage.clear();
      window.location.href = 'log.html';
    };

    // Cargar datos dinámicos de cada sección
    incidentesGen();
    incidentesEq();
    loadLabs();
    loadEquipos();
    loadHorarios();
    loadPrestamos();
    loadUsers();
  } catch (error) {
    console.error('Error inicializando el dashboard:', error);
    showMessage('Error inicializando el dashboard. Intenta de nuevo.', 'error');
    window.location.href = 'log.html';
  }
});