(function () {
  'use strict';

  var LIST_URL = 'P2_EscenariosPresupuestales.html';
  var ACCOUNTS = [
    ['609011', 'Televisión'], ['609012', 'Radio'], ['609013', 'Espectaculares'],
    ['609023', 'Promociones y Sorteos'], ['609028', 'Publicidad Digital'],
    ['609031', 'Material POP'], ['609041', 'Medios Digitales'],
    ['609045', 'Digital y Redes Sociales'], ['609052', 'Patrocinios']
  ];
  var BUSINESSES = [
    { id:'credito', name:'Crédito', group:'Grupo Elektra', country:'México', division:'Oferteo' },
    { id:'marca', name:'Marca', group:'Grupo Elektra', country:'México', division:'Marca' },
    { id:'digital', name:'Estrategia Digital', group:'Grupo Elektra', country:'México', division:'Estrategia' },
    { id:'corporativo', name:'Servicios Corporativos', group:'Back Office', country:'México', division:'Corporativo' },
    { id:'totalplay', name:'Totalplay', group:'Totalplay', country:'México', division:'Estrategia' },
    { id:'honduras', name:'Operación Honduras', group:'Totalplay', country:'Honduras', division:'Estrategia' }
  ];
  var CECOS = [
    { id:'100901', name:'Dirección General Conectividad', business:'credito', campaign:'Expansión 2027', accounts:5, previous:9800000 },
    { id:'240090', name:'Crédito Hipotecario', business:'credito', campaign:'Colocación Crédito', accounts:4, previous:9100000 },
    { id:'291374', name:'Mercadotecnia Digital', business:'marca', campaign:'Marca Institucional', accounts:6, previous:12400000 },
    { id:'239729', name:'Estrategia y Medios', business:'digital', campaign:'Always On Digital', accounts:5, previous:11300000 },
    { id:'810034', name:'Servicios Compartidos', business:'corporativo', campaign:'Operación Corporativa', accounts:3, previous:8600000 },
    { id:'510120', name:'Mercadotecnia Totalplay', business:'totalplay', campaign:'Totalplay Hogar', accounts:5, previous:9900000 },
    { id:'510145', name:'Ventas Totalplay', business:'totalplay', campaign:'Crecimiento Regional', accounts:4, previous:5300000 },
    { id:'920182', name:'Mercadotecnia Honduras', business:'honduras', campaign:'Lanzamiento Honduras', accounts:3, previous:3600000 }
  ];

  function byId(id) { return document.getElementById(id); }
  function money(value) { return Number(value || 0).toLocaleString('es-MX') + ' MXN'; }
  function unique(values) { return values.filter(function (value, index) { return values.indexOf(value) === index; }); }
  function businessFor(ceco) { return BUSINESSES.find(function (item) { return item.id === ceco.business; }); }
  function selectedValues(select) { return Array.prototype.map.call(select && select.selectedOptions ? select.selectedOptions : [], function (option) { return option.value; }); }
  function toast(message, type) {
    if (window.IPSO_ESC && window.IPSO_ESC.toast) window.IPSO_ESC.toast(message, type || 'info');
    else window.alert(message);
  }

  function addStyles() {
    var style = document.createElement('style');
    style.id = 'esc-round2-style';
    style.textContent =
      '.esc-r2-table th{font-size:.68rem;text-transform:uppercase;letter-spacing:.3px;color:#53616d}.esc-r2-table td{vertical-align:middle}' +
      '.esc-r2-scroll{max-height:255px;overflow:auto}.esc-r2-metrics{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:.65rem}' +
      '.esc-r2-metric{border-left:3px solid #7a58ca;background:#f7f8fa;border-radius:5px;padding:.65rem .8rem}.esc-r2-metric span{display:block;font-size:.66rem;text-transform:uppercase;color:#697586}.esc-r2-metric b{font-size:.92rem;color:#173641}' +
      '.esc-r2-exempt{max-width:610px}.esc-r2-exempt select{min-height:92px}.esc-r2-application{border:1px dashed #9aa8b4;background:#f8fafb;border-radius:7px;padding:1rem}' +
      '.esc-wide-summary #escResumen{display:block!important}.esc-r2-summary{display:grid!important;grid-template-columns:1.2fr 1fr 1fr!important;width:100%;gap:0;border:1px solid #dce3e8;border-radius:7px;overflow:hidden}.esc-r2-summary section{padding:1rem;border-right:1px solid #dce3e8}.esc-r2-summary section:last-child{border-right:0}.esc-r2-summary h6{font-size:.72rem;text-transform:uppercase;color:#6b7785;margin-bottom:.65rem}.esc-r2-summary dl{display:grid;grid-template-columns:minmax(100px,.8fr) 1.2fr;gap:.38rem .65rem;margin:0}.esc-r2-summary dt{font-weight:400;color:#697586}.esc-r2-summary dd{font-weight:600;margin:0;color:#263238}' +
      '.esc-r2-tree{min-width:820px;font-size:.82rem}.esc-r2-tree th:first-child{width:285px}.esc-r2-tree td,.esc-r2-tree th{vertical-align:middle}.esc-r2-tree .level-0 td{background:#eef2f4;font-weight:700}.esc-r2-tree .level-1 td{background:#f8fafb;font-weight:600}.esc-r2-indent{display:inline-block;width:calc(var(--level) * 18px)}.esc-r2-toggle{width:21px;height:21px;padding:0;line-height:17px;border:1px solid #9eacb6;border-radius:4px;background:#fff;margin-right:.4rem}' +
      '#escPasoTransversal .esc-window-row{border:0!important;padding:0!important}.esc-r2-account-scope{max-width:720px}' +
      '@media(max-width:900px){.esc-r2-metrics{grid-template-columns:repeat(2,1fr)}.esc-r2-summary{grid-template-columns:1fr}.esc-r2-summary section{border-right:0;border-bottom:1px solid #dce3e8}}';
    document.head.appendChild(style);
  }

  function scopeType() { return byId('escAplicaA').value; }
  function chosenBusinessIds() { return Array.prototype.map.call(document.querySelectorAll('.esc-r2-business:checked'), function (item) { return item.value; }); }
  function chosenCecoIds() { return Array.prototype.map.call(document.querySelectorAll('.esc-r2-ceco:checked'), function (item) { return item.value; }); }
  function chosenAccounts() { return selectedValues(byId('escR2AccountScope')); }
  function exemptAccounts() { return selectedValues(byId('escR2ExemptAccounts')); }

  function scopeCecos() {
    if (scopeType() === 'ceco') return CECOS.filter(function (ceco) { return chosenCecoIds().indexOf(ceco.id) >= 0; });
    if (scopeType() === 'cuenta') return chosenAccounts().length ? CECOS.slice() : [];
    var ids = chosenBusinessIds();
    return CECOS.filter(function (ceco) { return ids.indexOf(ceco.business) >= 0; });
  }

  function scopeLabel() {
    var type = scopeType();
    if (type === 'ceco') return chosenCecoIds().length + ' Centro(s) de Costos';
    if (type === 'cuenta') return chosenAccounts().length + ' cuenta(s) presupuestal(es)';
    var level = byId('escAplicaA').options[byId('escAplicaA').selectedIndex].textContent;
    return level + ': ' + (byId('escAlcanceValor').value || 'Sin selección');
  }

  function optionsFor(type) {
    if (type === 'grupo') return unique(BUSINESSES.map(function (item) { return item.group; }));
    if (type === 'pais') return unique(BUSINESSES.map(function (item) { return item.country; }));
    if (type === 'division') return unique(BUSINESSES.map(function (item) { return item.division; }));
    return BUSINESSES.map(function (item) { return item.name; });
  }

  function filteredBusinesses() {
    var type = scopeType(); var value = byId('escAlcanceValor').value;
    if (type === 'grupo') return BUSINESSES.filter(function (item) { return item.group === value; });
    if (type === 'pais') return BUSINESSES.filter(function (item) { return item.country === value; });
    if (type === 'division') return BUSINESSES.filter(function (item) { return item.division === value; });
    return BUSINESSES.filter(function (item) { return item.name === value; });
  }

  function renderBusinessRows() {
    var rows = filteredBusinesses();
    byId('escR2BusinessRows').innerHTML = rows.map(function (item) {
      var cecos = CECOS.filter(function (ceco) { return ceco.business === item.id; });
      return '<tr><td><input class="form-check-input esc-r2-business" type="checkbox" value="' + item.id + '" checked></td><td><b>' + item.name + '</b><div class="small text-muted">' + item.group + '</div></td><td>' + item.country + '</td><td>' + item.division + '</td><td>' + cecos.length + '</td></tr>';
    }).join('');
  }

  function renderCecoRows() {
    byId('escR2CecoRows').innerHTML = CECOS.map(function (ceco) {
      var business = businessFor(ceco);
      return '<tr><td><input class="form-check-input esc-r2-ceco" type="checkbox" value="' + ceco.id + '" checked></td><td><b>' + ceco.id + '</b><div class="small text-muted">' + ceco.name + '</div></td><td>' + business.country + '</td><td>' + business.division + '</td><td>' + business.name + '</td><td class="text-end">' + money(ceco.previous) + '</td></tr>';
    }).join('');
  }

  function renderScopeMode() {
    var type = scopeType();
    var standard = type !== 'ceco' && type !== 'cuenta';
    byId('escR2Secondary').classList.toggle('d-none', !standard);
    byId('escR2BusinessPanel').classList.toggle('d-none', !standard);
    byId('escR2CecoPanel').classList.toggle('d-none', type !== 'ceco');
    byId('escR2AccountPanel').classList.toggle('d-none', type !== 'cuenta');
    byId('escR2ExemptPanel').classList.toggle('d-none', type === 'cuenta');
    if (standard) {
      var options = optionsFor(type);
      var labels = {grupo:'Grupo Empresarial',pais:'País',division:'División',negocio:'Negocio'};
      byId('escR2SecondaryLabel').textContent = labels[type];
      byId('escAlcanceValor').innerHTML = options.map(function (item) { return '<option value="' + item + '">' + item + '</option>'; }).join('');
      renderBusinessRows();
    }
    updateAll();
  }

  function buildScope() {
    var scope = byId('escAplicaA');
    var card = scope && scope.closest('.card');
    if (!card) return;
    card.querySelector('.card-body').innerHTML =
      '<div class="row g-3 align-items-end"><div class="col-md-4"><label class="form-label small fw-bold" for="escAplicaA">Aplicar el ajuste a</label><select class="form-select form-select-sm" id="escAplicaA"><option value="grupo">Grupo Empresarial</option><option value="pais">País</option><option value="division">División</option><option value="negocio">Negocio</option><option value="ceco">Centro de Costos</option><option value="cuenta">Cuenta presupuestal</option></select></div>' +
      '<div class="col-md-5" id="escR2Secondary"><label class="form-label small fw-bold" id="escR2SecondaryLabel" for="escAlcanceValor">Grupo Empresarial</label><select class="form-select form-select-sm" id="escAlcanceValor"></select></div><div class="col-md-3"><div class="small text-muted">Base de referencia</div><b>V4 sincronizada con SIPRES</b></div></div>' +
      '<div class="mt-3" id="escR2BusinessPanel"><div class="small fw-bold mb-2">Negocios incluidos en el nivel seleccionado</div><div class="table-responsive border rounded esc-r2-scroll"><table class="table table-sm table-hover mb-0 esc-r2-table"><thead class="table-light"><tr><th></th><th>Negocio</th><th>País</th><th>División</th><th>CeCos</th></tr></thead><tbody id="escR2BusinessRows"></tbody></table></div></div>' +
      '<div class="mt-3 d-none" id="escR2CecoPanel"><div class="d-flex justify-content-between align-items-end mb-2"><div><div class="fw-bold">Centros de Costos del ejercicio</div><div class="small text-muted">La selección es independiente del negocio, grupo o división.</div></div><span class="badge text-bg-light border">Catálogo completo</span></div><div class="table-responsive border rounded esc-r2-scroll"><table class="table table-sm table-hover mb-0 esc-r2-table"><thead class="table-light"><tr><th></th><th>No. + Centro de Costos</th><th>País</th><th>División</th><th>Negocio</th><th class="text-end">Anterior</th></tr></thead><tbody id="escR2CecoRows"></tbody></table></div></div>' +
      '<div class="mt-3 d-none esc-r2-account-scope" id="escR2AccountPanel"><label class="form-label fw-bold" for="escR2AccountScope">Cuentas presupuestales a las que aplica el escenario</label><select id="escR2AccountScope" class="form-select form-select-sm" multiple size="6">' + ACCOUNTS.map(function (account) { return '<option value="' + account[0] + '">' + account[0] + ' — ' + account[1] + '</option>'; }).join('') + '</select><div class="small text-muted mt-1">Selecciona una o varias cuentas. No es necesario elegir negocios ni Centros de Costos.</div></div>' +
      '<div class="esc-r2-metrics mt-3"><div class="esc-r2-metric"><span>Negocios</span><b id="escR2MetricBusiness">0</b></div><div class="esc-r2-metric"><span>Centros de Costos</span><b id="escR2MetricCeco">0</b></div><div class="esc-r2-metric"><span>Cuentas en alcance</span><b id="escR2MetricAccounts">0</b></div><div class="esc-r2-metric"><span>Importe anterior</span><b id="escR2MetricAmount">0 MXN</b></div></div>' +
      '<div class="esc-r2-exempt border rounded bg-light p-3 mt-3" id="escR2ExemptPanel"><div class="d-flex justify-content-between gap-2"><div><label class="form-label fw-bold mb-0" for="escR2ExemptAccounts">Cuentas presupuestales exentas</label><div class="small text-muted">Estas cuentas conservan su importe.</div></div><span class="badge text-bg-light border align-self-start">Opcional</span></div><select id="escR2ExemptAccounts" class="form-select form-select-sm mt-2" multiple size="4">' + ACCOUNTS.map(function (account) { return '<option value="' + account[0] + '">' + account[0] + ' — ' + account[1] + '</option>'; }).join('') + '</select></div>';
    byId('escAplicaA').addEventListener('change', renderScopeMode);
    byId('escAlcanceValor').addEventListener('change', function () { renderBusinessRows(); updateAll(); });
    card.querySelector('.card-body').addEventListener('change', updateAll);
    renderCecoRows();
    renderScopeMode();
  }

  function moveMotiveAndBuildApplication() {
    var typeCard = byId('escTipo') && byId('escTipo').closest('.card');
    var application = byId('escPasoTransversal');
    if (!typeCard || !application) return;
    var oldMotive = byId('escMotivo');
    if (oldMotive) oldMotive.remove();
    typeCard.querySelector('.card-body').insertAdjacentHTML('beforeend', '<div class="mt-3 pt-3 border-top"><label class="form-label fw-bold" for="escMotivo">Motivo del ajuste</label><textarea id="escMotivo" class="form-control form-control-sm" rows="2" maxlength="300" placeholder="Describe el motivo que respalda este escenario (mínimo 15 caracteres)."></textarea></div>');
    var number = application.querySelector('.rounded-circle');
    var title = application.querySelector('h6');
    if (number) number.textContent = '3';
    if (title) title.textContent = 'Aplicación al ejercicio activo';
    application.querySelector('.card-body').innerHTML =
      '<div class="esc-r2-application"><div id="escR2ApplicationIntro"><b>El escenario todavía no afecta el ejercicio.</b><div class="small text-muted mt-1">Puedes guardarlo como borrador. La ventana, el responsable y el flujo se solicitan únicamente cuando eliges “Aplicar escenario”.</div></div>' +
      '<div class="d-none mt-3" id="escR2ApplicationDetails"><div class="alert alert-info py-2 small">Sólo puede existir una ventana de ajustes activa por ejercicio.</div><div class="row g-3"><div class="col-md-6"><label class="form-label small fw-bold">Responsable de ejecutar el ajuste</label><select id="escR2Responsible" class="form-select form-select-sm"><option value="usuarios">Usuarios de carga</option><option value="administracion">Administración</option></select></div><div class="col-md-6"><label class="form-label small fw-bold">Flujo de aprobación</label><select id="escR2Approval" class="form-select form-select-sm"><option value="estandar">Flujo configurado N1 → N2 → N3</option><option value="directa">Aprobación directa de Administración</option></select></div><div class="col-md-6"><label class="form-label small fw-bold" for="escInicioUnico">Inicio de la ventana</label><input id="escInicioUnico" type="datetime-local" class="form-control form-control-sm"></div><div class="col-md-6"><label class="form-label small fw-bold" for="escCierreUnico">Fin de la ventana</label><input id="escCierreUnico" type="datetime-local" class="form-control form-control-sm"></div></div></div></div>';
    var configCard = byId('escBloqueTemporalidad') && byId('escBloqueTemporalidad').closest('.card');
    if (configCard) {
      var configNumber = configCard.querySelector('.rounded-circle');
      if (configNumber) configNumber.textContent = '4';
    }
  }

  function buildSemester() {
    if (!byId('escModoMeses') || byId('escModoSemestre')) return;
    byId('escModoMeses').closest('.form-check').insertAdjacentHTML('afterend', '<div class="form-check"><input class="form-check-input" type="radio" name="escModo" id="escModoSemestre" value="semestre"><label class="form-check-label small" for="escModoSemestre">Por semestre</label></div>');
    byId('escModoMesesBloque').insertAdjacentHTML('afterend', '<div id="escModoSemestreBloque" class="border rounded p-3 bg-light d-none"><label class="form-label small fw-bold mb-2">Distribución por semestre <span class="text-muted fw-normal">(opcional)</span></label><div class="row g-3"><div class="col-md-6"><label class="small text-muted">Q1–Q2 · Ene–Jun</label><div class="input-group input-group-sm"><input class="form-control esc-r2-period" type="number" value="0" disabled><span class="input-group-text">%</span></div><small class="esc-r2-counter text-muted">Capturado: 0% · Total distribuido: 0%</small></div><div class="col-md-6"><label class="small text-muted">Q3–Q4 · Jul–Dic</label><div class="input-group input-group-sm"><input class="form-control esc-r2-period" type="number" min="0" max="100"><span class="input-group-text">%</span></div><small class="esc-r2-counter text-muted">Capturado: 0% · Total distribuido: 0%</small></div></div></div>');
    document.querySelectorAll('input[name="escModo"]').forEach(function (radio) {
      radio.addEventListener('change', function () {
        var semester = byId('escModoSemestre').checked;
        byId('escModoQBloque').classList.toggle('d-none', semester || !byId('escModoQ').checked);
        byId('escModoMesesBloque').classList.toggle('d-none', semester || byId('escModoQ').checked);
        byId('escModoSemestreBloque').classList.toggle('d-none', !semester);
        updateAll();
      });
    });
    byId('escModoSemestreBloque').addEventListener('input', function () {
      var inputs = Array.prototype.slice.call(document.querySelectorAll('.esc-r2-period:not([disabled])'));
      var total = inputs.reduce(function (sum, input) { return sum + (Number(input.value) || 0); }, 0);
      inputs.forEach(function (input) {
        var counter = input.closest('.col-md-6').querySelector('.esc-r2-counter');
        counter.textContent = 'Capturado: ' + (Number(input.value) || 0) + '% · Total distribuido: ' + total + '%';
        counter.className = 'esc-r2-counter ' + (total === 100 ? 'text-success fw-bold' : total > 100 ? 'text-danger fw-bold' : 'text-muted');
      });
    });
  }

  function buildSummary() {
    var summary = byId('escResumen');
    if (!summary) return;
    var card = summary.closest('.card');
    var title = card.querySelector('.card-header h6');
    if (title) title.textContent = 'Resumen del escenario';
    summary.className = 'card-body';
    summary.innerHTML = '<div class="esc-r2-summary" id="escR2Summary"></div>';
    var oldExtra = byId('escResumenTransversal');
    if (oldExtra) oldExtra.remove();
    var oldHierarchy = byId('escHierarchySummary');
    if (oldHierarchy) oldHierarchy.remove();
    summary.insertAdjacentHTML('afterend', '<div class="card-body border-top" id="escR2Hierarchy"><div class="d-flex justify-content-between align-items-center gap-2 mb-2"><div><b>Distribución jerárquica</b><div class="small text-muted">Misma estructura de Liberaciones, sin la columna Ajuste.</div></div><div><button class="btn btn-outline-secondary btn-sm" id="escR2Expand" type="button">Expandir todo</button> <button class="btn btn-outline-secondary btn-sm" id="escR2Collapse" type="button">Contraer todo</button></div></div><div class="table-responsive"><table class="table table-sm mb-0 esc-r2-tree"><thead class="table-light"><tr><th>Línea de negocio + CECOS</th><th>Campañas</th><th>Cuentas</th><th class="text-end">Nuevo Importe</th><th class="text-end">Anterior</th></tr></thead><tbody id="escR2TreeBody"></tbody></table></div></div>');
    byId('escR2Expand').addEventListener('click', function () { document.querySelectorAll('#escR2TreeBody tr').forEach(function (row) { row.hidden = false; }); document.querySelectorAll('.esc-r2-toggle').forEach(function (button) { button.textContent = '−'; }); });
    byId('escR2Collapse').addEventListener('click', function () { document.querySelectorAll('#escR2TreeBody tr').forEach(function (row) { row.hidden = Number(row.dataset.level) > 0; }); document.querySelectorAll('.esc-r2-toggle').forEach(function (button) { button.textContent = '+'; }); });
    byId('escR2TreeBody').addEventListener('click', function (event) {
      if (!event.target.classList.contains('esc-r2-toggle')) return;
      var row = event.target.closest('tr'); var level = Number(row.dataset.level); var hide = event.target.textContent !== '+'; event.target.textContent = hide ? '+' : '−'; var next = row.nextElementSibling;
      while (next && Number(next.dataset.level) > level) { next.hidden = hide; next = next.nextElementSibling; }
    });
  }

  function updateSummary() {
    if (!byId('escR2Summary')) return;
    var cecos = scopeCecos();
    var previous = cecos.reduce(function (sum, ceco) { return sum + ceco.previous; }, 0);
    var type = byId('escTipo').value;
    var typeLabel = byId('escTipo').options[byId('escTipo').selectedIndex].textContent;
    var semester = byId('escModoSemestre') && byId('escModoSemestre').checked;
    var accounts = scopeType() === 'cuenta' ? chosenAccounts().length : Math.max(0, ACCOUNTS.length - exemptAccounts().length);
    byId('escR2Summary').innerHTML = '<section><h6>Alcance</h6><dl><dt>Aplica a</dt><dd>' + scopeLabel() + '</dd><dt>Centros de Costos</dt><dd>' + (scopeType() === 'cuenta' ? 'No requiere selección' : cecos.length) + '</dd><dt>Cuentas exentas</dt><dd>' + (scopeType() === 'cuenta' ? 'No aplica' : exemptAccounts().length) + '</dd></dl></section><section><h6>Ajuste</h6><dl><dt>Tipo</dt><dd>' + typeLabel + '</dd><dt>Distribución</dt><dd>' + (semester ? 'Por semestre' : byId('escModoMeses') && byId('escModoMeses').checked ? 'Por meses' : 'Por trimestres') + '</dd><dt>Motivo</dt><dd>' + ((byId('escMotivo') && byId('escMotivo').value.trim()) || 'Pendiente') + '</dd></dl></section><section><h6>Aplicación</h6><dl><dt>Estado</dt><dd>' + (byId('escR2ApplicationDetails') && !byId('escR2ApplicationDetails').classList.contains('d-none') ? 'Lista para configurar' : 'Borrador') + '</dd><dt>Ventana</dt><dd>Una por ejercicio</dd><dt>Base anterior</dt><dd>' + money(previous) + '</dd></dl></section>';
    byId('escR2MetricBusiness').textContent = unique(cecos.map(function (ceco) { return ceco.business; })).length;
    byId('escR2MetricCeco').textContent = scopeType() === 'cuenta' ? 'Todos' : cecos.length;
    byId('escR2MetricAccounts').textContent = accounts;
    byId('escR2MetricAmount').textContent = money(previous);
    renderTree(cecos, type === 'tope' ? 0.95 : 1, accounts);
  }

  function renderTree(cecos, factor, accountCount) {
    var body = byId('escR2TreeBody');
    if (!body) return;
    var rows = [];
    unique(cecos.map(function (ceco) { return ceco.business; })).forEach(function (businessId) {
      var business = BUSINESSES.find(function (item) { return item.id === businessId; });
      var children = cecos.filter(function (ceco) { return ceco.business === businessId; });
      var previous = children.reduce(function (sum, ceco) { return sum + ceco.previous; }, 0);
      rows.push({level:0,label:business.name,campaign:unique(children.map(function (ceco) { return ceco.campaign; })).length + ' campaña(s)',accounts:accountCount,newAmount:previous * factor,previous:previous,children:true});
      children.forEach(function (ceco) { rows.push({level:1,label:ceco.id + ' · ' + ceco.name,campaign:ceco.campaign,accounts:scopeType() === 'cuenta' ? chosenAccounts().length : ceco.accounts,newAmount:ceco.previous * factor,previous:ceco.previous,children:false}); });
    });
    body.innerHTML = rows.map(function (row) { return '<tr class="level-' + row.level + '" data-level="' + row.level + '"><td><span class="esc-r2-indent" style="--level:' + row.level + '"></span>' + (row.children ? '<button type="button" class="esc-r2-toggle">−</button>' : '<span style="display:inline-block;width:27px"></span>') + row.label + '</td><td>' + row.campaign + '</td><td>' + row.accounts + '</td><td class="text-end fw-semibold">' + money(row.newAmount) + '</td><td class="text-end">' + money(row.previous) + '</td></tr>'; }).join('') || '<tr><td colspan="5" class="text-center text-muted py-4">Selecciona al menos un elemento del alcance.</td></tr>';
  }

  function setupActions() {
    var draft = byId('escBtnBorrador');
    var apply = byId('escBtnConfirmar');
    if (!draft || !apply) return;
    var cleanDraft = draft.cloneNode(true); draft.parentNode.replaceChild(cleanDraft, draft);
    var cleanApply = apply.cloneNode(true); apply.parentNode.replaceChild(cleanApply, apply); cleanApply.removeAttribute('onclick'); cleanApply.innerHTML = '<i class="bi bi-play-circle me-1"></i>Aplicar escenario';
    cleanDraft.addEventListener('click', function () {
      var motive = byId('escMotivo').value.trim();
      if (motive.length < 15) { toast('Captura un motivo de al menos 15 caracteres para guardar el borrador.', 'danger'); return; }
      if (!scopeCecos().length) { toast('Selecciona al menos un elemento del alcance.', 'danger'); return; }
      toast('Escenario guardado como borrador. El ejercicio no fue modificado.', 'success');
    });
    cleanApply.addEventListener('click', function () {
      var details = byId('escR2ApplicationDetails');
      if (details.classList.contains('d-none')) {
        details.classList.remove('d-none');
        cleanApply.innerHTML = '<i class="bi bi-check-circle me-1"></i>Confirmar aplicación';
        details.scrollIntoView({behavior:'smooth',block:'center'});
        updateAll();
        return;
      }
      var motive = byId('escMotivo').value.trim();
      var start = byId('escInicioUnico').value; var end = byId('escCierreUnico').value;
      if (motive.length < 15) { toast('Captura un motivo de al menos 15 caracteres.', 'danger'); return; }
      if (!scopeCecos().length) { toast('Selecciona al menos un elemento del alcance.', 'danger'); return; }
      if (!start || !end || end <= start) { toast('Define una ventana válida; el fin debe ser posterior al inicio.', 'danger'); return; }
      toast('Escenario aplicado al ejercicio activo con una única ventana de ajustes.', 'success');
    });
  }

  function removeLegacyElements() {
    var alert = byId('escAlerta');
    if (alert) alert.remove();
    document.querySelectorAll('#menu a[href="P2_EscenariosPresupuestales.html"]').forEach(function (link) {
      var owner = link.closest('ul') && link.closest('ul').parentElement ? link.closest('ul').parentElement.querySelector(':scope > a') : null;
      if (owner && /liberaciones/i.test(owner.textContent)) link.closest('li').remove();
    });
    document.querySelectorAll('a[href="P2_EscenariosPresupuestales1.html"],a[href="AjustesPresupuestales2027.html"]').forEach(function (link) { link.href = LIST_URL; });
    var heroButton = document.querySelector('.proposal-hero a.btn');
    if (heroButton) { heroButton.href = LIST_URL; heroButton.innerHTML = '<i class="bi bi-arrow-left me-1"></i>Regresar a ajustes'; }
  }

  function updateAll() { window.setTimeout(updateSummary, 0); }

  document.addEventListener('DOMContentLoaded', function () {
    window.setTimeout(function () {
      addStyles();
      removeLegacyElements();
      buildScope();
      moveMotiveAndBuildApplication();
      buildSemester();
      buildSummary();
      setupActions();
      document.addEventListener('input', function (event) { if (event.target.matches('#escMotivo,.esc-r2-period')) updateAll(); });
      document.addEventListener('change', function (event) { if (event.target.matches('#escTipo,#escR2Responsible,#escR2Approval,input[name="escModo"]')) updateAll(); });
      updateAll();
    }, 20);
  });
})();
