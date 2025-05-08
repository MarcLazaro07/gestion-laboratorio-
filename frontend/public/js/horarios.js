// Gestión de horarios
async function loadHorarios() {
  const labsRes = await fetch('/api/laboratorios', { headers: authHeader() });
  const labs = await labsRes.json();
  const sel = `<select id="horarioLabSelect" onchange="showHorario()">${labs.map(l=>`<option value="${l._id}">${l.nombre}</option>`).join('')}</select>`;
  const c = document.getElementById('horarios');
  c.innerHTML = '<h2>Horarios</h2>' + sel + '<div id="horarioTable"></div>';
  showHorario();
}

async function showHorario() {
  const labId = document.getElementById('horarioLabSelect').value;
  const res = await fetch(`/api/horarios/${labId}`, { headers: authHeader() });
  const h = await res.json();
  const table = renderHorarioTable(h);
  document.getElementById('horarioTable').innerHTML = table;
}

function renderHorarioTable(h) {
  let html = '<table class="table"><thead><tr><th>Hora</th>' +
    h.docentes.map(d=>`<th>${d.username}</th>`).join('') +
    '<th>Total</th></tr></thead><tbody>';
  const rows = h.tabla; // 5 días x 8 franjas
  const horas = ['08:00','10:00','12:00','14:00','16:00','18:00','20:00','22:00'];
  rows.forEach((dia, di)=>{
    dia.forEach((celda, hi)=>{
      html += `<tr><td>${horas[hi]}</td>`;
      h.docentes.forEach(doc=>{
        const sel = `<select onchange="onHorarioChange('${h._id}', ${di}, ${hi}, this.value)">` +
          `<option value="">-</option>` +
          h.docentes.map(d=>`<option ${celda.docente==d._id?'selected':''} value="${d._id}">${d.username}</option>`).join('') +
          `</select>`;
        html += `<td>${sel}</td>`;
      });
      // total por fila ignorado
      html += `<td>--</td></tr>`;
    });
  });
  html += '</tbody></table>';
  return html;
}

async function onHorarioChange(horarioId, dia, hora, docenteId) {
  const res = await fetch(`/api/horarios/${horarioId}`, {
    method:'PUT', headers: {...authHeader(),'Content-Type':'application/json'},
    body: JSON.stringify({ tablaUpdate:{dia,hora,docente:docenteId} })
  });
  if(res.ok) showMessage('Horario actualizado');
}