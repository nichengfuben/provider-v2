/**
 * Feature: 请求检查器 — 实时显示 API 请求和响应。
 */
var RequestInspector = (function () {
  var _ws = null;
  var _requests = {};  // id -> request data
  var _order = [];     // id order (newest first)
  var _selectedId = null;
  var _maxItems = 100;

  function init() {
    var panel = document.getElementById('requestInspector');
    if (!panel) return;
    connect();
    // Poll: refresh when stats tab is visible
    setInterval(function () {
      var tab = document.getElementById('tab-stats');
      if (tab && tab.classList.contains('active')) {
        renderList();
      }
    }, 2000);
  }

  function connect() {
    if (_ws && (_ws.readyState === WebSocket.CONNECTING || _ws.readyState === WebSocket.OPEN)) return;
    var proto = location.protocol === 'https:' ? 'wss:' : 'ws:';
    _ws = new WebSocket(proto + '//' + location.host + '/v1/webui/ws/requests');
    _ws.onopen = function () {
      var notice = document.getElementById('requestWsNotice');
      if (notice) notice.textContent = 'WebSocket: connected';
    };
    _ws.onmessage = function (e) {
      try {
        var msg = JSON.parse(e.data);
        handleMessage(msg);
      } catch (err) {}
    };
    _ws.onclose = function () {
      var notice = document.getElementById('requestWsNotice');
      if (notice) notice.textContent = 'WebSocket: disconnected';
      setTimeout(connect, 3000);
    };
    _ws.onerror = function () {};
  }

  function handleMessage(msg) {
    if (msg.type === 'request_start') {
      _requests[msg.id] = {
        id: msg.id,
        ts: msg.ts,
        model: msg.model || '',
        messages_count: msg.messages_count || 0,
        has_tools: msg.has_tools || false,
        stream: msg.stream || false,
        status: 'pending',
        latency_ms: null,
        platform: '',
        chunks: []
      };
      _order.unshift(msg.id);
      if (_order.length > _maxItems) {
        var old = _order.pop();
        delete _requests[old];
      }
    } else if (msg.type === 'request_chunk') {
      var req = _requests[msg.id];
      if (req) {
        req.chunks.push(msg.delta || '');
      }
    } else if (msg.type === 'request_end') {
      var req = _requests[msg.id];
      if (req) {
        req.status = msg.status;
        req.latency_ms = msg.latency_ms;
        req.platform = msg.platform || '';
        req.model = req.model || msg.model || '';
      }
    }
    renderList();
    if (_selectedId === msg.id) renderDetail();
  }

  function renderList() {
    var list = document.getElementById('requestList');
    if (!list) return;
    var html = '';
    for (var i = 0; i < _order.length; i++) {
      var req = _requests[_order[i]];
      if (!req) continue;
      var cls = 'req-item' + (_selectedId === req.id ? ' req-selected' : '');
      var statusCls = req.status === 'pending' ? 'req-pending' : (req.status >= 400 ? 'req-error' : 'req-ok');
      var time = new Date(req.ts * 1000);
      var ts = pad(time.getHours()) + ':' + pad(time.getMinutes()) + ':' + pad(time.getSeconds());
      var modelShort = (req.model || '').split('/').pop().split('-').slice(0, 2).join('-');
      var latency = req.latency_ms !== null ? req.latency_ms + 'ms' : '...';
      html += '<div class="' + cls + '" data-req-id="' + req.id + '" onclick="RequestInspector.select(\'' + req.id + '\')">';
      html += '<span class="req-ts">' + ts + '</span>';
      html += '<span class="req-model">' + escapeHtml(modelShort) + '</span>';
      html += '<span class="req-status ' + statusCls + '">' + (req.status === 'pending' ? '...' : req.status) + '</span>';
      html += '<span class="req-latency">' + latency + '</span>';
      html += '</div>';
    }
    list.innerHTML = html || '<div class="text-muted" style="padding:12px;text-align:center;">No requests yet</div>';
  }

  function select(id) {
    _selectedId = id;
    renderList();
    renderDetail();
  }

  function renderDetail() {
    var detail = document.getElementById('requestDetail');
    if (!detail || !_selectedId) return;
    var req = _requests[_selectedId];
    if (!req) { detail.innerHTML = ''; return; }

    var html = '<div class="req-detail">';
    html += '<div class="req-detail-header">';
    html += '<strong>Request ' + req.id + '</strong>';
    html += '<span class="req-status ' + (req.status >= 400 ? 'req-error' : 'req-ok') + '">' + (req.status === 'pending' ? 'In Progress' : 'Status ' + req.status) + '</span>';
    html += '</div>';

    html += '<div class="req-detail-meta">';
    html += '<span>Model: ' + escapeHtml(req.model || 'unknown') + '</span>';
    html += '<span>Platform: ' + escapeHtml(req.platform || 'unknown') + '</span>';
    html += '<span>Messages: ' + req.messages_count + '</span>';
    html += '<span>Tools: ' + (req.has_tools ? 'yes' : 'no') + '</span>';
    html += '<span>Stream: ' + (req.stream ? 'yes' : 'no') + '</span>';
    if (req.latency_ms !== null) html += '<span>Latency: ' + req.latency_ms + 'ms</span>';
    html += '</div>';

    // Show streaming chunks if any
    if (req.chunks.length > 0) {
      html += '<div class="req-detail-section">';
      html += '<div class="req-detail-label">Response Stream</div>';
      html += '<pre class="req-detail-content">' + escapeHtml(req.chunks.join('')) + '</pre>';
      html += '</div>';
    }

    html += '</div>';
    detail.innerHTML = html;
  }

  function pad(n) { return n < 10 ? '0' + n : '' + n; }

  return { init: init, select: select };
})();
