function renderConfig(summary) {
  // Fetch real config from /v1/config (matches config.toml structure)
  fetchJson('/v1/config').then(function(config) {
    _renderConfigData(config);
  }).catch(function() {
    // Fallback to summary if fetch fails
    _renderConfigData(summary.config || {});
  });
}

function _renderConfigData(config) {
  var configText = JSON.stringify(config, null, 2);
  configJsonBox.textContent = configText;
  if (configEditArea && !configEditArea.classList.contains('hidden')) {
    configEditArea.value = configText;
  }

  // Internal fields to skip
  var skipFields = ['group_list_set', 'platform_list_set', 'enabled_platforms_set', 'proxy_url_patterns', 'templates'];

  // Render all top-level sections from the real config
  var sectionNames = Object.keys(config).filter(function(s) {
    return typeof config[s] === 'object' && config[s] !== null && !Array.isArray(config[s]);
  });

  configGrid.innerHTML = sectionNames.map(function(section) {
    var payload = config[section] || {};
    var fields = Object.keys(payload).filter(function(key) {
      return skipFields.indexOf(key) === -1;
    }).map(function(key) {
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
