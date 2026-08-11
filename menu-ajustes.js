(function () {
  'use strict';

  function loadBrandTheme() {
    if (document.getElementById('ipso-brand-theme')) return;
    var stylesheet = document.createElement('link');
    stylesheet.id = 'ipso-brand-theme';
    stylesheet.rel = 'stylesheet';
    stylesheet.href = 'ipso-brand-theme.css';
    document.head.appendChild(stylesheet);
  }

  function clean(value) {
    return String(value || '').replace(/\s+/g, ' ').trim().toLowerCase();
  }

  function pageName() {
    return clean(location.pathname.split('/').pop());
  }

  function isExercisePage(page) {
    return page === 'parametros.html' || page === 'parametrosactuales.html';
  }

  function createChild(url, label) {
    var item = document.createElement('li');
    item.innerHTML = '<a href="' + url + '"><span class="material-symbols-outlined">arrow_right</span>' + label + '</a>';
    return item;
  }

  function init() {
    var menu = document.getElementById('menu');
    if (!menu || menu.dataset.adjustmentsMenu === 'ready') return;

    var links = Array.prototype.slice.call(menu.querySelectorAll('a[href]'));
    var parametersLink = links.find(function (link) {
      var href = clean(link.getAttribute('href'));
      var label = clean(link.textContent);
      return href === 'parametros.html' || label.indexOf('parametros de carga') >= 0;
    });
    if (!parametersLink) return;

    var parent = parametersLink.closest('li');
    if (!parent) return;
    var submenu = parent.querySelector(':scope > ul');
    if (!submenu) {
      submenu = document.createElement('ul');
      submenu.className = 'mm-collapse';
      parent.appendChild(submenu);
    }

    parametersLink.setAttribute('href', 'javascript:;');
    parametersLink.classList.add('has-arrow');
    parametersLink.setAttribute('aria-expanded', 'false');

    if (!submenu.querySelector('a[href="Parametros.html"]')) submenu.appendChild(createChild('Parametros.html', 'Ejercicios Presupuestales'));
    if (!submenu.querySelector('a[href="P2_EscenariosPresupuestales.html"]')) submenu.appendChild(createChild('P2_EscenariosPresupuestales.html', 'Ajustes Presupuestales'));

    Array.prototype.slice.call(menu.querySelectorAll('a[href="P2_EscenariosPresupuestales.html"]')).forEach(function (link) {
      if (submenu.contains(link)) return;
      var branch = link.closest('ul');
      var branchOwner = branch && branch.parentElement ? branch.parentElement.querySelector(':scope > a') : null;
      if (branchOwner && clean(branchOwner.textContent).indexOf('liberaciones') >= 0) {
        var item = link.closest('li');
        if (item) item.remove();
      }
    });

    Array.prototype.slice.call(menu.querySelectorAll('a[href="P2_EscenariosPresupuestales1.html"], a[href="AjustesPresupuestales2027.html"]')).forEach(function (link) {
      var item = link.closest('li');
      if (item) item.remove();
    });

    function setOpen(open) {
      submenu.classList.toggle('mm-show', open);
      submenu.style.height = open ? '' : '0px';
      parent.classList.toggle('mm-active', open);
      parametersLink.setAttribute('aria-expanded', open ? 'true' : 'false');
    }

    parametersLink.addEventListener('click', function (event) {
      event.preventDefault();
      setOpen(!submenu.classList.contains('mm-show'));
    });

    var page = pageName();
    var scenarioPages = ['p2_escenariospresupuestales.html', 'p2_esc_nuevoescenario.html', 'esc_detalleescenario.html', 'esc_soleditable.html', 'esc_solconsulta.html', 'esc_solaprobador.html', 'esc_aejercicio_backoffice.html', 'esc_aejercicio_grupoelektra.html', 'esc_aejercicio_totalplay.html'];
    if (isExercisePage(page) || scenarioPages.indexOf(page) >= 0) {
      setOpen(true);
      Array.prototype.slice.call(submenu.querySelectorAll('li')).forEach(function (item) { item.classList.remove('mm-active'); });
      var activeUrl = isExercisePage(page) ? 'Parametros.html' : 'P2_EscenariosPresupuestales.html';
      var activeLink = submenu.querySelector('a[href="' + activeUrl + '"]');
      if (activeLink && activeLink.closest('li')) activeLink.closest('li').classList.add('mm-active');
    }

    menu.dataset.adjustmentsMenu = 'ready';
  }

  loadBrandTheme();
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', function () { window.setTimeout(init, 0); });
  else window.setTimeout(init, 0);
})();
