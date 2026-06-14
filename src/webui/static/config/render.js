function renderConfig(summary) {

  var config = summary.config || {};
  var configText = JSON.stringify(config, null, 2);
  configJsonBox.textContent = configText;
  if (configEditArea && !configEditArea.classList.contains('hidden')) {
    configEditArea.value = configText;
  }

  // Sections to render (skip internal/complex ones)
  var sections = [
    ['server', config.server || {}],
    ['auth', config.auth || {}],
    ['gateway', config.gateway || {}],
    ['proxy', config.proxy || {}],
    ['fncall', config.fncall || {}],
    ['debug', config.debug || {}],
    ['autoupdate', config.autoupdate || {}],
    ['platforms', config.platforms || {}]
  ];

  configGrid.innerHTML = sections.map(function(entry) {
    var section = entry[0];
    var payload = entry[1];
    var fields = Object.keys(payload).map(function(key) {
      var val = payload[key];
      var fieldId = 'cfg-' + section + '-' + key;
      var label = '<span class="config-field-label">' + key + '</span>';
      var control = '';

      if (typeof val === 'boolean') {
        control = '<label class="config-toggle"><input type="checkbox" id="' + fieldId + '" data-section="' + section + '" data-key="' + key + '"' + (val ? ' checked' : '') + '><span class="toggle-slider"></span></label>';
      } else if (typeof val === 'number') {
        control = '<input type="number" class="config-input" id="' + fieldId + '" data-section="' + section + '" data-key="' + key + '" value="' + val + '">';
      } else if (typeof val === 'string') {
        control = '<input type="text" class="config-input" id="' + fieldId + '" data-section="' + section + '" data-key="' + key + '" value="' + escapeHtml(val) + '">';
      } else if (Array.isArray(val) || typeof val === 'object') {
        control = '<textarea class="config-json" id="' + fieldId + '" data-section="' + section + '" data-key="' + key + '" rows="2">' + escapeHtml(JSON.stringify(val, null, 2)) + '</textarea>';
      }

      return '<div class="config-field">' + label + control + '</div>';
    }).join('');

    return '<div class="border border-border rounded-xl p-3.5 bg-panel-alt card-hover-lift"><div class="text-[13px] text-muted m-0 mb-2">[' + section + ']</div>' + fields + '</div>';
  }).join('');

  // Bind change events
  configGrid.querySelectorAll('[data-section]').forEach(function(el) {
    el.addEventListener('change', onConfigFieldChange);
    el.addEventListener('input', onConfigFieldChange);
  });

  updateConfigSaveStatus();
}

