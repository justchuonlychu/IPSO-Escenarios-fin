(function () {
  'use strict';

  var LIST_URL = 'P2_EscenariosPresupuestales.html';
  var ACCOUNTS = [
    ['609011', 'Televisión'], ['609012', 'Radio'], ['609013', 'Espectaculares'],
    ['609023', 'Promociones y Sorteos'], ['609028', 'Publicidad Digital'],
    ['609031', 'Material POP'], ['609041', 'Medios Digitales'],
    ['609045', 'Digital y Redes Sociales']
  ];
  var BUSINESSES = [
    { id:'credito', name:'Crédito', group:'Grupo Elektra', country:'México', division:'Oferteo', cecos:2, requests:8, amount:18900000 },
    { id:'marca', name:'Marca', group:'Grupo Elektra', country:'México', division:'Marca', cecos:1, requests:5, amount:12400000 },
    { id:'digital', name:'Estrategia Digital', group:'Grupo Elektra', country:'México', division:'Estrategia', cecos:2, requests:7, amount:11300000 },
    { id:'corporativo', name:'Servicios Corporativos', group:'Back Office', country:'México', division:'Sin División', cecos:1, requests:4, amount:8600000 },
    { id:'totalplay', name:'Totalplay', group:'Totalplay', country:'México', division:'Estrategia', cecos:2, requests:6, amount:15200000 },
    { id:'honduras', name:'Operación Honduras', group:'Totalplay', country:'Honduras', division:'Estrategia', cecos:1, requests:3, amount:3600000 }
  ];

  function byId(id) { return document.getElementById(id); }
  function money(value) { return Number(value || 0).toLocaleString('es-MX') + ' MXN'; }
  function toast(message, type) {
    if (window.IPSO_ESC && window.IPSO_ESC.toast) window.IPSO_ESC.toast(message, type || 'info');
    else window.alert(message);
  }
  function unique(values) { return values.filter(function (value, index) { return values.indexOf(value) === index; }); }
  function selectedBusinesses() {
    return Array.prototype.map.call(document.querySelectorAll('.esc-business-check:checked'), function (item) { return item.value; });
  }
  function selectedExemptAccounts() {
    return Array.prototype.map.call(document.querySelectorAll('.esc-exempt-account:checked'), function (item) { return item.value; });
  }

  function addStyles() {
    if (byId('esc-canonical-style')) return;
    var style = document.createElement('style');
    style.id = 'esc-canonical-style';
    style.textContent =
      '.esc-scope-table th{font-size:.68rem;text-transform:uppercase;letter-spacing:.35px;color:#596875}' +
      '.esc-scope-table td{vertical-align:middle}.esc-scope-table .form-check-input{width:1.05rem;height:1.05rem}' +
      '.esc-scope-metrics{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:.65rem}' +
      '.esc-scope-metric{border:1px solid #e2e7eb;border-radius:7px;padding:.75rem;background:#fff}' +
      '.esc-scope-metric span{display:block;color:#6b7785;font-size:.68rem;text-transform:uppercase}' +
      '.esc-scope-metric b{display:block;margin-top:.2rem;color:#173641}' +
      '.esc-account-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:.45rem .9rem;max-height:180px;overflow:auto}' +
      '.esc-account-option{border:1px solid #e2e7eb;border-radius:6px;padding:.55rem .65rem;background:#fff}' +
      '.esc-period-counter{display:block;margin-top:.3rem;color:#667085;font-size:.67rem;line-height:1.25}' +
      '.esc-period-counter.is-complete{color:#147a48;font-weight:700}.esc-period-counter.is-over{color:#b42318;font-weight:700}' +
      '.esc-tree-tools{display:flex;gap:.4rem;justify-content:flex-end;margin-bottom:.65rem}' +
      '.esc-tree-table{min-width:900px}.esc-tree-table td,.esc-tree-table th{vertical-align:middle}' +
      '.esc-tree-label{display:flex;align-items:center;gap:.4rem}.esc-tree-indent{display:inline-block;width:calc(var(--level) * 17px)}' +
      '.esc-tree-toggle{width:20px;height:20px;padding:0;border:1px solid #aab8c2;border-radius:4px;background:#fff;color:#294b58;font-weight:700;line-height:16px}' +
      '.esc-tree-toggle.empty{visibility:hidden}.esc-tree-row.level-0 td{background:#edf2f5;font-weight:700}' +
      '.esc-tree-row.level-1 td{background:#f7f9fa;font-weight:600}.esc-tree-row.level-3 td:first-child{font-weight:600}' +
      '.esc-single-window .esc-eliminar-ventana,#escAgregarVentana{display:none!important}' +
      '@media(max-width:900px){.esc-scope-metrics{grid-template-columns:repeat(2,minmax(0,1fr))}.esc-account-grid{grid-template-columns:1fr}}';
    document.head.appendChild(style);
  }

  function optionsFor(type) {
    if (type === 'grupo') return unique(BUSINESSES.map(function (item) { return item.group; }));
    if (type === 'pais') return unique(BUSINESSES.map(function (item) { return item.country; }));
    if (type === 'division') return unique(BUSINESSES.map(function (item) { return item.division; }));
    if (type === 'negocio') return BUSINESSES.map(function (item) { return item.name; });
    if (type === 'ceco') return ['100901 — Dir. Gral. Conectividad', '291374 — Mercadotecnia Digital', '240090 — Crédito Hipotecario', '920182 — Mkt Honduras'];
    return ACCOUNTS.map(function (item) { return item[0] + ' — ' + item[1]; });
  }

  function matchingBusinesses() {
    var type = byId('escAplicaA').value;
    var value = byId('escAlcanceValor').value;
    if (type === 'grupo') return BUSINESSES.filter(function (item) { return item.group === value; });
    if (type === 'pais') return BUSINESSES.filter(function (item) { return item.country === value; });
    if (type === 'division') return BUSINESSES.filter(function (item) { return item.division === value; });
    if (type === 'negocio') return BUSINESSES.filter(function (item) { return item.name === value; });
    if (type === 'ceco') return BUSINESSES.filter(function (item, index) { return index % 2 === 0; });
    return BUSINESSES.filter(function (item) { return item.group === 'Grupo Elektra'; });
  }

  function renderScopeOptions() {
    var type = byId('escAplicaA').value;
    var options = optionsFor(type);
    byId('escScopeValueLabel').textContent = {
      grupo:'Grupo Empresarial', pais:'País', division:'División', negocio:'Negocio', ceco:'Centro de Costos', cuenta:'Cuenta presupuestal'
    }[type];
    byId('escAlcanceValor').innerHTML = options.map(function (item, index) {
      var selected = type === 'grupo' && item === 'Grupo Elektra' ? ' selected' : (!index ? ' selected' : '');
      return '<option value="' + item + '"' + selected + '>' + item + '</option>';
    }).join('');
    renderBusinessTable();
  }

  function renderBusinessTable() {
    var matches = matchingBusinesses();
    byId('escBusinessRows').innerHTML = matches.map(function (item) {
      return '<tr><td><input class="form-check-input esc-business-check" type="checkbox" value="' + item.id + '" checked aria-label="Seleccionar ' + item.name + '"></td>' +
        '<td><b>' + item.name + '</b><div class="small text-muted">ID: NEG-' + item.id.toUpperCase().slice(0,5) + '</div></td>' +
        '<td>' + item.group + '</td><td>' + item.country + '</td><td>' + item.division + '</td><td>' + item.cecos + '</td></tr>';
    }).join('');
    byId('escBusinessAll').checked = matches.length > 0;
    updateScopeSummary();
  }

  function updateScopeSummary() {
    var chosen = selectedBusinesses();
    var rows = BUSINESSES.filter(function (item) { return chosen.indexOf(item.id) >= 0; });
    var cecos = rows.reduce(function (sum, item) { return sum + item.cecos; }, 0);
    var requests = rows.reduce(function (sum, item) { return sum + item.requests; }, 0);
    var amount = rows.reduce(function (sum, item) { return sum + item.amount; }, 0);
    byId('escScopeBusinessCount').textContent = rows.length;
    byId('escScopeCecoCount').textContent = cecos;
    byId('escScopeRequestCount').textContent = requests;
    byId('escScopeAmount').textContent = money(amount);
    byId('escScopeCaption').textContent = rows.length + ' negocio(s) seleccionado(s) · ' + cecos + ' Centro(s) de Costos';
    syncExistingSummary(rows, cecos, amount);
    renderHierarchy(rows);
  }

  function syncExistingSummary(rows, cecos, amount) {
    var type = byId('escAplicaA').value;
    var level = byId('escAplicaA').options[byId('escAplicaA').selectedIndex].textContent;
    var value = byId('escAlcanceValor').value;
    var scopeText = level + ': ' + value;
    var exempt = selectedExemptAccounts().length;
    var extra = byId('escResumenAlcanceAmplio');
    if (extra) {
      extra.innerHTML = '<div class="small text-uppercase text-muted fw-semibold">Alcance y cuentas</div><div class="fw-semibold">' + scopeText + '</div><div class="esc-muted-note">' + exempt + ' cuenta(s) exenta(s)</div>';
    }
    var summary = byId('escResumen');
    if (!summary) return;
    Array.prototype.slice.call(summary.querySelectorAll('.d-flex')).forEach(function (row) {
      var parts = row.querySelectorAll('span');
      if (parts.length < 2) return;
      var label = parts[0].textContent.trim();
      if (label === 'Aplica a') parts[1].textContent = scopeText;
      if (label === 'Centros de Costos') parts[1].textContent = cecos + ' seleccionados';
      if (label === 'Carga Aprobada') parts[1].textContent = money(amount);
      if (label === 'Temporalidad' && byId('escModoSemestre') && byId('escModoSemestre').checked) parts[1].textContent = 'Por semestre';
    });
  }

  function buildScopeStep() {
    var scope = byId('escAplicaA');
    if (!scope) return;
    var card = scope.closest('.card');
    if (!card) return;
    var body = card.querySelector('.card-body');
    body.innerHTML =
      '<div class="row g-3 align-items-end"><div class="col-md-4"><label class="form-label small fw-bold" for="escAplicaA">Aplicar el ajuste a</label>' +
      '<select class="form-select form-select-sm" id="escAplicaA"><option value="grupo">Grupo Empresarial</option><option value="pais">País</option><option value="division">División</option><option value="negocio">Negocio</option><option value="ceco">Centro de Costos</option><option value="cuenta">Cuenta presupuestal</option></select></div>' +
      '<div class="col-md-5"><label class="form-label small fw-bold" id="escScopeValueLabel" for="escAlcanceValor">Grupo Empresarial</label><select class="form-select form-select-sm" id="escAlcanceValor"></select></div>' +
      '<div class="col-md-3"><div class="small text-muted">Base de referencia</div><b>V4 sincronizada con SIPRES</b></div></div>' +
      '<div class="mt-4"><div class="d-flex flex-wrap justify-content-between gap-2 align-items-end mb-2"><div><label class="form-label fw-bold mb-0">Negocios a los que aplica el escenario</label><div class="small text-muted" id="escScopeCaption"></div></div><div class="small text-muted">Puedes excluir negocios sin perder el filtro seleccionado.</div></div>' +
      '<div class="table-responsive border rounded"><table class="table table-sm table-hover esc-scope-table align-middle mb-0"><thead class="table-light"><tr><th><input id="escBusinessAll" class="form-check-input" type="checkbox" checked aria-label="Seleccionar todos los negocios"></th><th>Negocio</th><th>Grupo empresarial</th><th>País</th><th>División</th><th>CeCos</th></tr></thead><tbody id="escBusinessRows"></tbody></table></div></div>' +
      '<div class="esc-scope-metrics mt-3"><div class="esc-scope-metric"><span>Negocios</span><b id="escScopeBusinessCount">0</b></div><div class="esc-scope-metric"><span>Centros de Costos</span><b id="escScopeCecoCount">0</b></div><div class="esc-scope-metric"><span>Solicitudes aprobadas</span><b id="escScopeRequestCount">0</b></div><div class="esc-scope-metric"><span>Importe anual</span><b id="escScopeAmount">0 MXN</b></div></div>' +
      '<div class="border rounded bg-light p-3 mt-3"><div class="d-flex justify-content-between gap-3 mb-2"><div><label class="form-label fw-bold mb-0">Cuentas presupuestales que quedan exentas del escenario</label><div class="small text-muted">Las cuentas marcadas conservan sus importes y no participan en la redistribución.</div></div><span class="badge text-bg-light border text-secondary align-self-start">Opcional</span></div><div class="esc-account-grid">' +
      ACCOUNTS.map(function (item) { return '<label class="esc-account-option"><input class="form-check-input me-2 esc-exempt-account" type="checkbox" value="' + item[0] + '"><b>' + item[0] + '</b> — ' + item[1] + '</label>'; }).join('') + '</div></div>';

    byId('escAplicaA').addEventListener('change', renderScopeOptions);
    byId('escAlcanceValor').addEventListener('change', renderBusinessTable);
    byId('escBusinessAll').addEventListener('change', function () {
      document.querySelectorAll('.esc-business-check').forEach(function (item) { item.checked = byId('escBusinessAll').checked; });
      updateScopeSummary();
    });
    body.addEventListener('change', function (event) {
      if (event.target.classList.contains('esc-business-check') || event.target.classList.contains('esc-exempt-account')) updateScopeSummary();
    });
    renderScopeOptions();
  }

  function buildSingleWindow() {
    var windows = byId('escVentanas');
    if (!windows) return;
    windows.classList.add('esc-single-window');
    windows.innerHTML = '<div class="esc-window-row border rounded p-3"><div class="row g-3"><div class="col-md-6"><label class="form-label small fw-bold mb-1" for="escInicioUnico">Inicio de la ventana</label><input id="escInicioUnico" type="datetime-local" class="form-control form-control-sm esc-inicio"></div><div class="col-md-6"><label class="form-label small fw-bold mb-1" for="escCierreUnico">Cierre de la ventana</label><input id="escCierreUnico" type="datetime-local" class="form-control form-control-sm esc-cierre"></div></div><div class="small text-muted mt-2">La ventana sólo se habilita al aplicar el escenario. Guardar como borrador no notifica ni modifica solicitudes.</div></div>';
    var section = windows.closest('.esc-flow-section');
    if (section) {
      var label = section.querySelector('label');
      var note = section.querySelector('.esc-flow-note');
      if (label) label.textContent = 'Ventana del escenario';
      if (note) note.textContent = 'Cada escenario tiene una sola ventana de inicio y cierre.';
    }
    if (byId('escResumenVentanas')) byId('escResumenVentanas').textContent = 'Una ventana por definir';
  }

  function counterText(value, total, isPercent) {
    if (!isPercent) return 'Capturado: ' + money(value) + ' · Total: ' + money(total);
    return 'Capturado: ' + value + '% · Total distribuido: ' + total + '%';
  }
  function updatePeriodCounters() {
    var isPercent = !(byId('escUnidadImp') && byId('escUnidadImp').checked);
    var mode = document.querySelector('input[name="escModo"]:checked');
    var selector = mode && mode.value === 'semestre' ? '.esc-val-semestre' : (mode && mode.value === 'meses' ? '.esc-val-mes' : '.esc-val-q');
    var inputs = Array.prototype.slice.call(document.querySelectorAll(selector)).filter(function (input) { return !input.disabled; });
    var total = inputs.reduce(function (sum, input) { return sum + (Number(input.value) || 0); }, 0);
    inputs.forEach(function (input) {
      var counter = input.closest('td') ? input.closest('td').querySelector('.esc-period-counter') : input.closest('.col-6,.col-md-3').querySelector('.esc-period-counter');
      if (!counter) {
        counter = document.createElement('span'); counter.className = 'esc-period-counter'; input.closest('td,.col-6,.col-md-3').appendChild(counter);
      }
      counter.textContent = counterText(Number(input.value) || 0, total, isPercent);
      counter.classList.toggle('is-complete', isPercent && total === 100);
      counter.classList.toggle('is-over', isPercent && total > 100);
    });
  }

  function addCountersToRenderedPeriods() {
    document.querySelectorAll('.esc-val-q,.esc-val-mes,.esc-val-semestre').forEach(function (input) {
      var holder = input.closest('td,.col-6,.col-md-3');
      if (holder && !holder.querySelector('.esc-period-counter')) holder.insertAdjacentHTML('beforeend', '<span class="esc-period-counter"></span>');
    });
    updatePeriodCounters();
  }

  function buildSemesterMode() {
    if (!byId('escModoQ') || byId('escModoSemestre')) return;
    var monthOption = byId('escModoMeses').closest('.form-check');
    monthOption.insertAdjacentHTML('afterend', '<div class="form-check"><input class="form-check-input" type="radio" name="escModo" id="escModoSemestre" value="semestre"><label class="form-check-label small" for="escModoSemestre">Por semestre</label></div>');
    byId('escModoMesesBloque').insertAdjacentHTML('afterend', '<div id="escModoSemestreBloque" class="border rounded p-3 bg-light d-none"><label class="form-label small fw-bold text-dark mb-2">Distribución por semestre <span class="text-muted fw-normal">(opcional)</span></label><div class="row g-2"><div class="col-6"><label class="small text-muted">H1 · Ene-Jun</label><div class="input-group input-group-sm"><input class="form-control esc-val-semestre" data-periodo="H1" type="number" min="0" max="100" disabled title="Periodo transcurrido"><span class="input-group-text esc-uni">%</span></div><span class="esc-period-counter"></span></div><div class="col-6"><label class="small text-muted">H2 · Jul-Dic</label><div class="input-group input-group-sm"><input class="form-control esc-val-semestre" data-periodo="H2" type="number" min="0" max="100"><span class="input-group-text esc-uni">%</span></div><span class="esc-period-counter"></span></div></div><div class="small mt-2" id="escSumaSemestre"></div></div>');
    var originalMode = window.escPintarModo;
    window.escPintarModo = function () {
      var selected = document.querySelector('input[name="escModo"]:checked');
      var semester = selected && selected.value === 'semestre';
      if (!semester && typeof originalMode === 'function') originalMode();
      byId('escModoQBloque').classList.toggle('d-none', semester || !byId('escModoQ').checked);
      byId('escModoMesesBloque').classList.toggle('d-none', semester || byId('escModoQ').checked);
      byId('escModoSemestreBloque').classList.toggle('d-none', !semester);
      window.setTimeout(function () {
        addCountersToRenderedPeriods();
        syncExistingSummary(BUSINESSES.filter(function (item) { return selectedBusinesses().indexOf(item.id) >= 0; }), Number(byId('escScopeCecoCount').textContent) || 0, selectedBusinesses().reduce(function (sum, id) { var item = BUSINESSES.find(function (business) { return business.id === id; }); return sum + (item ? item.amount : 0); }, 0));
      }, 0);
    };
    document.querySelectorAll('input[name="escModo"]').forEach(function (radio) { radio.onchange = window.escPintarModo; });
    document.addEventListener('input', function (event) {
      if (event.target.matches('.esc-val-q,.esc-val-mes,.esc-val-semestre')) updatePeriodCounters();
    });
    ['escUnidadPct','escUnidadImp'].forEach(function (id) { if (byId(id)) byId(id).addEventListener('change', function () { window.setTimeout(addCountersToRenderedPeriods, 0); }); });
    var originalMonth = window.escPintarMesSolicitud;
    window.escPintarMesSolicitud = function () { if (typeof originalMonth === 'function') originalMonth(); window.setTimeout(addCountersToRenderedPeriods, 0); };
    addCountersToRenderedPeriods();
  }

  function renderHierarchy(rows) {
    var host = byId('escHierarchyBody');
    if (!host) return;
    var exempt = selectedExemptAccounts();
    var tree = [];
    unique(rows.map(function (item) { return item.group; })).forEach(function (group) {
      var groupRows = rows.filter(function (item) { return item.group === group; });
      tree.push({ level:0, label:group, kind:'Grupo empresarial', amount:groupRows.reduce(function (s,i) { return s+i.amount; },0), children:true });
      unique(groupRows.map(function (item) { return item.country; })).forEach(function (country) {
        var countryRows = groupRows.filter(function (item) { return item.country === country; });
        tree.push({ level:1, label:country, kind:'País', amount:countryRows.reduce(function (s,i) { return s+i.amount; },0), children:true });
        unique(countryRows.map(function (item) { return item.division; })).forEach(function (division) {
          var divisionRows = countryRows.filter(function (item) { return item.division === division; });
          tree.push({ level:2, label:division, kind:'División', amount:divisionRows.reduce(function (s,i) { return s+i.amount; },0), children:true });
          divisionRows.forEach(function (business) {
            tree.push({ level:3, label:business.name, kind:'Negocio', amount:business.amount, children:true });
            tree.push({ level:4, label:business.cecos + ' Centro(s) de Costos', kind:'CeCo', amount:business.amount, children:false });
          });
        });
      });
    });
    host.innerHTML = tree.map(function (row) {
      return '<tr class="esc-tree-row level-' + row.level + '" data-level="' + row.level + '"><td><div class="esc-tree-label"><span class="esc-tree-indent" style="--level:' + row.level + '"></span><button class="esc-tree-toggle' + (row.children ? '' : ' empty') + '" type="button">−</button><span>' + row.label + '</span></div></td><td>' + row.kind + '</td><td>' + money(row.amount) + '</td><td>' + (exempt.length ? exempt.length + ' cuenta(s) exenta(s)' : 'Sin cuentas exentas') + '</td></tr>';
    }).join('');
  }

  function buildHierarchySummary() {
    var summary = byId('escResumenTransversal');
    if (!summary || byId('escHierarchySummary')) return;
    var card = summary.closest('.card');
    var title = card && card.querySelector('.card-header h6');
    if (title) title.textContent = 'Resumen del escenario';
    summary.insertAdjacentHTML('afterend', '<div class="card-body border-top" id="escHierarchySummary"><div class="d-flex flex-wrap justify-content-between gap-2 align-items-center mb-2"><div><b>Vista jerárquica del ajuste</b><div class="small text-muted">Previsualización del alcance que se guardará o aplicará.</div></div><div class="esc-tree-tools"><button type="button" class="btn btn-outline-secondary btn-sm" id="escExpandHierarchy">Expandir todo</button><button type="button" class="btn btn-outline-secondary btn-sm" id="escCollapseHierarchy">Contraer todo</button></div></div><div class="table-responsive"><table class="table table-sm esc-tree-table mb-0"><thead class="table-light"><tr><th>Jerarquía</th><th>Nivel</th><th>Importe anual</th><th>Exclusiones</th></tr></thead><tbody id="escHierarchyBody"></tbody></table></div></div>');
    function toggleRow(button) {
      var row = button.closest('tr'); var level = Number(row.dataset.level); var hide = button.textContent !== '+'; button.textContent = hide ? '+' : '−';
      var next = row.nextElementSibling;
      while (next && Number(next.dataset.level) > level) { if (Number(next.dataset.level) === level + 1 || !hide) next.hidden = hide; next = next.nextElementSibling; }
    }
    byId('escHierarchySummary').addEventListener('click', function (event) { if (event.target.classList.contains('esc-tree-toggle') && !event.target.classList.contains('empty')) toggleRow(event.target); });
    byId('escExpandHierarchy').addEventListener('click', function () { document.querySelectorAll('.esc-tree-row').forEach(function (row) { row.hidden = false; }); document.querySelectorAll('.esc-tree-toggle:not(.empty)').forEach(function (b) { b.textContent = '−'; }); });
    byId('escCollapseHierarchy').addEventListener('click', function () { document.querySelectorAll('.esc-tree-row').forEach(function (row) { row.hidden = Number(row.dataset.level) > 0; }); document.querySelectorAll('.esc-tree-toggle:not(.empty)').forEach(function (b) { b.textContent = '+'; }); });
  }

  function enforceValidation() {
    var previousConfirm = window.escConfirmar;
    window.escConfirmar = function () {
      var motive = byId('escMotivo') ? byId('escMotivo').value.trim() : '';
      if (motive.length < 15) { toast('Debe capturar un motivo detallado del ajuste (mínimo 15 caracteres).', 'danger'); return; }
      if (!selectedBusinesses().length) { toast('Selecciona al menos un negocio y un Centro de Costos para definir el alcance.', 'danger'); return; }
      var start = byId('escInicioUnico') && byId('escInicioUnico').value;
      var end = byId('escCierreUnico') && byId('escCierreUnico').value;
      if (!start || !end || end <= start) { toast('Define una ventana válida: el cierre debe ser posterior al inicio.', 'danger'); return; }
      if (typeof previousConfirm === 'function') previousConfirm();
    };
    var draft = byId('escBtnBorrador');
    if (draft) {
      var cleanDraft = draft.cloneNode(true); draft.parentNode.replaceChild(cleanDraft, draft);
      cleanDraft.addEventListener('click', function () {
        var motive = byId('escMotivo') ? byId('escMotivo').value.trim() : '';
        if (motive.length < 15) { toast('Debe capturar un motivo detallado del ajuste (mínimo 15 caracteres).', 'danger'); return; }
        if (!selectedBusinesses().length) { toast('Selecciona al menos un negocio para guardar el alcance.', 'danger'); return; }
        localStorage.setItem('ipso-escenario-borrador', JSON.stringify({ tipo:byId('escTipo').value, motivo:motive, guardado:new Date().toISOString() }));
        toast('El escenario se guardó como borrador. No se abrió la ventana ni se enviaron notificaciones.', 'success');
      });
    }
  }

  function fixLinks() {
    document.querySelectorAll('a[href="P2_EscenariosPresupuestales1.html"],a[href="AjustesPresupuestales2027.html"],a[href="Liberaciones.html"]').forEach(function (link) {
      var text = (link.textContent || '').toLowerCase();
      if (text.indexOf('liberaci') < 0) link.href = LIST_URL;
    });
    var returnButton = document.querySelector('.proposal-hero a.btn');
    if (returnButton) { returnButton.href = LIST_URL; returnButton.innerHTML = '<i class="bi bi-arrow-left me-1"></i>Regresar a ajustes'; }
  }

  document.addEventListener('DOMContentLoaded', function () {
    window.setTimeout(function () {
      addStyles();
      buildScopeStep();
      buildSingleWindow();
      buildSemesterMode();
      buildHierarchySummary();
      updateScopeSummary();
      enforceValidation();
      fixLinks();
    }, 0);
  });
})();
