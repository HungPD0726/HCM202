/**
 * HCM202 Map — Tư tưởng Hồ Chí Minh
 * Full-featured: Mind Map + Progress Tracking + Quiz System
 */
document.addEventListener('DOMContentLoaded', async function () {

  // ── DOM refs ──────────────────────────────────────────────────────
  var loader = document.getElementById('loader');
  var svgEl = document.getElementById('mindmap-svg');
  var canvasEl = document.getElementById('particle-canvas');
  var detailPanel = document.getElementById('detail-panel');
  var closePanelBtn = document.getElementById('close-panel');
  var breadcrumbEl = document.getElementById('breadcrumb');
  var progFill = document.getElementById('prog-fill');
  var totalCount = document.getElementById('total-count');
  var learnedCount = document.getElementById('learned-count');
  var timelineContainer = document.getElementById('timeline-container');
  var timelineMarks = document.querySelectorAll('.timeline-mark');
  var searchBtnToggle = document.getElementById('search-btn-toggle');
  var searchInputContainer = document.getElementById('search-input-container');
  var navTimelineBtn = document.getElementById('nav-timeline-btn');
  var introOverlay = document.getElementById('intro-overlay');
  var teamAvatarBtn = document.getElementById('team-avatar-btn');
  var introCloseBtnTop = document.getElementById('intro-close-btn-top');
  var introViewMapBtn = document.getElementById('intro-view-map-btn');
  var toggleMuteBtn = document.getElementById('toggle-mute');

  // ── Performance & Preferences ──────────────────────────────────────
  var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var isMobile = window.innerWidth <= 768;

  // ── Secure HTML Escaping & Formatting ──────────────────────────────
  function escapeHTML(str) {
    if (typeof str !== 'string') return '';
    return str.replace(/[&<>'"]/g, function (tag) {
      return {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        "'": '&#39;',
        '"': '&quot;'
      }[tag] || tag;
    });
  }

  function formatSafeHTML(text) {
    if (typeof text !== 'string') return '';
    var escaped = escapeHTML(text);
    escaped = escaped
      .replace(/&lt;br\s*\/?&gt;/gi, '<br>')
      .replace(/&lt;b&gt;(.*?)&lt;\/b&gt;/gi, '<strong>$1</strong>')
      .replace(/&lt;strong&gt;(.*?)&lt;\/strong&gt;/gi, '<strong>$1</strong>')
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    return escaped;
  }

  // ── Study status & countdown state ─────────────────────────────────
  var currentStudyNode = null;
  var studyCountdownInterval = null;
  var studyTimeRemaining = 0;

  function updateStudyStatusUI(nodeId) {
    var badge = document.getElementById('study-status-badge');
    if (!badge) return;
    
    if (studiedNodes.has(nodeId)) {
      badge.className = 'status-completed';
      badge.innerHTML = '<i class="bi bi-patch-check-fill"></i> Đã hoàn thành';
    } else if (currentStudyNode === nodeId && studyTimeRemaining > 0) {
      badge.className = 'status-studying';
      badge.innerHTML = '<i class="bi bi-hourglass-split"></i> Đang học (' + studyTimeRemaining + 's)';
    } else {
      badge.className = 'status-not-started';
      badge.innerHTML = '<i class="bi bi-book-half"></i> Chưa học';
    }
  }

  // ── Sound effects system (Web Audio API) ──────────────────────────
  var isMuted = localStorage.getItem('hcm202_muted') === 'true';
  var audioCtx = null;

  function initAudio() {
    if (!audioCtx) {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
  }

  function playTone(freq, startTime, duration, type) {
    var osc = audioCtx.createOscillator();
    var gain = audioCtx.createGain();
    
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    
    osc.type = type || 'sine';
    osc.frequency.setValueAtTime(freq, startTime);
    
    gain.gain.setValueAtTime(0.2, startTime);
    gain.gain.exponentialRampToValueAtTime(0.005, startTime + duration);
    
    osc.start(startTime);
    osc.stop(startTime + duration);
  }

  function playClickSound() {
    if (isMuted) return;
    try {
      initAudio();
      var osc = audioCtx.createOscillator();
      var gain = audioCtx.createGain();
      
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      
      osc.type = 'sine';
      var now = audioCtx.currentTime;
      osc.frequency.setValueAtTime(600, now);
      osc.frequency.exponentialRampToValueAtTime(100, now + 0.08);
      
      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.08);
      
      osc.start(now);
      osc.stop(now + 0.08);
    } catch (e) {
      console.warn('Audio click error:', e);
    }
  }

  function playChimeSound() {
    if (isMuted) return;
    try {
      initAudio();
      var now = audioCtx.currentTime;
      playTone(523.25, now, 0.15, 'sine');
      playTone(659.25, now + 0.1, 0.35, 'sine');
    } catch (e) {
      console.warn('Audio chime error:', e);
    }
  }

  function playFanfareSound(success) {
    if (isMuted) return;
    try {
      initAudio();
      var now = audioCtx.currentTime;
      if (success) {
        playTone(523.25, now, 0.12, 'triangle');
        playTone(659.25, now + 0.12, 0.12, 'triangle');
        playTone(783.99, now + 0.24, 0.12, 'triangle');
        playTone(1046.50, now + 0.36, 0.45, 'triangle');
      } else {
        playTone(392.00, now, 0.15, 'sine');
        playTone(311.13, now + 0.15, 0.15, 'sine');
        playTone(293.66, now + 0.3, 0.45, 'sine');
      }
    } catch (e) {
      console.warn('Audio fanfare error:', e);
    }
  }

  function updateMuteButtonUI() {
    if (toggleMuteBtn) {
      var icon = toggleMuteBtn.querySelector('i');
      if (icon) {
        if (isMuted) {
          icon.className = 'bi bi-volume-mute-fill';
          toggleMuteBtn.title = 'Bật âm thanh';
          toggleMuteBtn.classList.add('muted');
        } else {
          icon.className = 'bi bi-volume-up-fill';
          toggleMuteBtn.title = 'Tắt âm thanh';
          toggleMuteBtn.classList.remove('muted');
        }
      }
    }
  }

  if (toggleMuteBtn) {
    updateMuteButtonUI();
    toggleMuteBtn.addEventListener('click', function (e) {
      e.stopPropagation();
      isMuted = !isMuted;
      localStorage.setItem('hcm202_muted', isMuted);
      updateMuteButtonUI();
      if (!isMuted) {
        playClickSound();
      }
    });
  }

  // ── D3 setup ──────────────────────────────────────────────────────
  var svg = d3.select(svgEl);
  var g = svg.append('g').attr('class', 'main-group');

  // ── Particle system ───────────────────────────────────────────────
  var ctx = canvasEl.getContext('2d');

  function resizeCanvas() {
    var rect = canvasEl.parentElement.getBoundingClientRect();
    canvasEl.width = rect.width;
    canvasEl.height = rect.height;
  }
  resizeCanvas();

  var particles = [], animFrameId = null;
  window.addEventListener('resize', resizeCanvas);

  function tickParticles() {
    if (!particles.length) { animFrameId = null; return; }
    ctx.clearRect(0, 0, canvasEl.width, canvasEl.height);
    for (var i = particles.length - 1; i >= 0; i--) {
      var p = particles[i];
      p.x += p.vx; p.y += p.vy; p.vy += p.gravity;
      p.life -= p.decay; p.radius *= 0.97;
      if (p.life <= 0 || p.radius < 0.3) { particles.splice(i, 1); continue; }
      ctx.save(); ctx.globalAlpha = p.life;
      ctx.beginPath(); ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      if (p.glow) { ctx.shadowBlur = p.radius * 3; ctx.shadowColor = p.color; }
      ctx.fillStyle = p.color; ctx.fill(); ctx.restore();
    }
    animFrameId = requestAnimationFrame(tickParticles);
  }

  function spawnParticles(sx, sy, color, count) {
    count = count || 60;
    for (var i = 0; i < count; i++) {
      var a = Math.random() * Math.PI * 2, s = 1.5 + Math.random() * 4.5;
      particles.push({
        x: sx, y: sy, vx: Math.cos(a) * s, vy: Math.sin(a) * s - 1, gravity: 0.08,
        life: 0.75 + Math.random() * 0.25, decay: 0.012 + Math.random() * 0.014,
        radius: 2 + Math.random() * 4.5, color: color, glow: Math.random() > 0.4
      });
    }
    for (var j = 0; j < 25; j++) {
      var a2 = Math.random() * Math.PI * 2, s2 = 3 + Math.random() * 7;
      particles.push({
        x: sx, y: sy, vx: Math.cos(a2) * s2, vy: Math.sin(a2) * s2, gravity: 0.06,
        life: 0.5 + Math.random() * 0.4, decay: 0.02 + Math.random() * 0.02,
        radius: 1 + Math.random() * 2, color: '#ffffff', glow: true
      });
    }
    if (!animFrameId) animFrameId = requestAnimationFrame(tickParticles);
  }

  // ── SVG Defs ──────────────────────────────────────────────────────
  var defs = svg.append('defs');
  var ngf = defs.append('filter').attr('id', 'node-glow').attr('x', '-100%').attr('y', '-100%').attr('width', '300%').attr('height', '300%');
  ngf.append('feGaussianBlur').attr('stdDeviation', '8').attr('result', 'blur');
  ngf.append('feMerge').selectAll('feMergeNode').data(['blur', 'SourceGraphic']).enter().append('feMergeNode').attr('in', function (d) { return d; });
  var sgf = defs.append('filter').attr('id', 'strong-glow').attr('x', '-200%').attr('y', '-200%').attr('width', '500%').attr('height', '500%');
  sgf.append('feGaussianBlur').attr('stdDeviation', '15').attr('result', 'blur');
  sgf.append('feMerge').selectAll('feMergeNode').data(['blur', 'SourceGraphic']).enter().append('feMergeNode').attr('in', function (d) { return d; });

  var goldGlow = defs.append('filter').attr('id', 'gold-glow').attr('x', '-50%').attr('y', '-50%').attr('width', '200%').attr('height', '200%');
  goldGlow.append('feGaussianBlur').attr('stdDeviation', '10').attr('result', 'blur');
  goldGlow.append('feComponentTransfer').attr('in', 'blur').attr('result', 'glow')
    .append('feFuncA').attr('type', 'linear').attr('slope', '1.5');
  goldGlow.append('feMerge').selectAll('feMergeNode').data(['glow', 'SourceGraphic']).enter().append('feMergeNode').attr('in', function (d) { return d; });

  var shockwaveLayer = g.append('g').attr('class', 'shockwave-layer');

  // ── Progress tracking ─────────────────────────────────────────────
  var studiedNodes = new Set();
  var nodeTimers = {};
  var allNodeCount = 0;

  function markStudied(nodeId, playSound) {
    if (!nodeId) return;
    if (studiedNodes.has(nodeId)) return;
    studiedNodes.add(nodeId);
    
    try {
      localStorage.setItem('hcm202_studied_nodes', JSON.stringify(Array.from(studiedNodes)));
    } catch (e) {
      console.warn('Save progress failed:', e);
    }

    var n = studiedNodes.size;
    if (learnedCount) learnedCount.textContent = n;
    var pct = allNodeCount > 0 ? (n / allNodeCount) * 100 : 0;
    if (progFill) progFill.style.width = pct + '%';

    if (playSound) {
      playChimeSound();
    }

    g.selectAll('.node').each(function (d) {
      if (d && d.data && d.data.id === nodeId) {
        d3.select(this).select('.studied-ring').style('opacity', 1);
      }
    });

    updateStudyStatusUI(nodeId);
  }

  function startStudyTimer(nodeId) {
    if (!nodeId) return;
    if (studiedNodes.has(nodeId)) {
      updateStudyStatusUI(nodeId);
      return;
    }
    
    if (studyCountdownInterval) {
      clearInterval(studyCountdownInterval);
      studyCountdownInterval = null;
    }
    if (nodeTimers[nodeId]) {
      clearTimeout(nodeTimers[nodeId]);
      delete nodeTimers[nodeId];
    }

    currentStudyNode = nodeId;
    studyTimeRemaining = 15;
    updateStudyStatusUI(nodeId);

    nodeTimers[nodeId] = setTimeout(function () {
      if (studyCountdownInterval) {
        clearInterval(studyCountdownInterval);
        studyCountdownInterval = null;
      }
      markStudied(nodeId, true);
      delete nodeTimers[nodeId];
      g.selectAll('.node').each(function (d) {
        if (d && d.data && d.data.id === nodeId) {
          var c = d3.select(this).select('circle');
          if (c && c.node()) {
            var durationVal = prefersReducedMotion ? 0.01 : 0.25;
            gsap.to(c.node(), {
              attr: { r: nodeRadius(d.data) * 1.4 }, duration: durationVal, ease: 'power2.out',
              onComplete: function () { 
                gsap.to(c.node(), { attr: { r: nodeRadius(d.data) }, duration: prefersReducedMotion ? 0.01 : 0.4, ease: 'elastic.out(1,0.4)' }); 
              }
            });
          }
        }
      });
    }, 15000);

    studyCountdownInterval = setInterval(function () {
      studyTimeRemaining--;
      if (studyTimeRemaining <= 0) {
        clearInterval(studyCountdownInterval);
        studyCountdownInterval = null;
      } else {
        if (currentStudyNode === nodeId) {
          updateStudyStatusUI(nodeId);
        }
      }
    }, 1000);
  }

  function stopStudyTimer(nodeId) {
    if (!nodeId) return;
    if (studyCountdownInterval) {
      clearInterval(studyCountdownInterval);
      studyCountdownInterval = null;
    }
    if (nodeTimers[nodeId]) {
      clearTimeout(nodeTimers[nodeId]);
      delete nodeTimers[nodeId];
    }
    if (currentStudyNode === nodeId) {
      currentStudyNode = null;
    }
  }

  // ── Zoom ──────────────────────────────────────────────────────────
  var currentTransform = d3.zoomIdentity;
  var focusedNode = null;
  var showAllNodes = false;
  var zoom = d3.zoom().scaleExtent([0.01, 3]).on('zoom', function (event) {
    currentTransform = event.transform;
    g.attr('transform', event.transform);
  });
  svg.call(zoom);

  // ── Load data ─────────────────────────────────────────────────────
  var lastRoot = null;
  var mapData, quizData;
  try {
    mapData = await d3.json('data/mindmap.json');
    quizData = await d3.json('data/quiz.json');

    allNodeCount = d3.hierarchy(mapData).descendants().length - 1;
    if (totalCount) totalCount.textContent = allNodeCount;

    try {
      var savedProgress = localStorage.getItem('hcm202_studied_nodes');
      if (savedProgress) {
        var parsed = JSON.parse(savedProgress);
        if (Array.isArray(parsed)) {
          parsed.forEach(function (id) {
            markStudied(id, false);
          });
        }
      }
    } catch (e) {
      console.warn('Load progress failed:', e);
    }

    buildMap(mapData);
    gsap.to(loader, { opacity: 0, duration: 0.5, onComplete: function () { loader.style.display = 'none'; openIntro(); } });
  } catch (err) {
    console.error('Load error:', err);
    loader.innerHTML = '<p style="color:#ef5350">Lỗi tải dữ liệu. Vui lòng tải lại trang.</p>';
  }

  // ── Build mind map ────────────────────────────────────────────────

  function updateLinks() {
    var ringElement = d3.select('.map-ring').node();
    var currentRingRadius = ringElement ? parseFloat(ringElement.getAttribute('r')) : 260;

    var radialLink = d3.linkRadial()
      .angle(function (d) { return d.x * Math.PI / 180; })
      .radius(function (d) { return d.radius; })
      .source(function (d) {
        if (d.source.depth === 0) {
          return { x: d.target.x, radius: currentRingRadius + 3 };
        }
        return d.source;
      });

    g.selectAll('.link').attr('d', radialLink);
  }

  function buildMap(data) {
    g.selectAll('.link, .node').remove();
    var root = d3.hierarchy(data);
    var treeLayout = d3.tree().size([360, 1]).separation(function (a, b) {
      return (a.parent === b.parent ? 5 : 7) / (a.depth || 1);
    });
    treeLayout(root);

    root.descendants().forEach(function (d) {
      var angle = (d.x - 90) * Math.PI / 180;
      var radius = d.depth === 1 ? 680 :
        d.depth === 2 ? 1300 :
          d.depth === 3 ? 1950 :
            d.depth === 4 ? 2600 :
              d.depth === 5 ? 3200 : 0;
      d.radius = radius;
      d.x_cart = radius * Math.cos(angle);
      d.y_cart = radius * Math.sin(angle);
      if (d.depth === 0) { d.x_cart = 0; d.y_cart = 0; }
    });

    g.selectAll('.link').data(root.links()).enter().append('path').attr('class', 'link')
      .style('stroke', function (d) { return colorOf(d.target); })
      .style('stroke-width', function (d) { return d.target.depth === 1 ? '6px' : '3px'; });

    updateLinks();
    update(root);
    renderBranchLabels();
    lastRoot = root;
  }

  function renderBranchLabels() {
    const branchData = (mapData && Array.isArray(mapData.children)) ? mapData.children : [];
    const radius = 860;
    const labels = branchData.map(function (branch, i) {
      const angle = (-90 + (360 / branchData.length) * i) * Math.PI / 180;
      return {
        text: 'Chương ' + ['I', 'II', 'III', 'IV', 'V', 'VI'][i],
        x: Math.cos(angle) * radius,
        y: Math.sin(angle) * radius
      };
    });

    d3.select("#mindmap-container").selectAll(".branch-label").remove();

    labels.forEach(l => {
      d3.select("#mindmap-container")
        .append("div")
        .attr("class", "branch-label")
        .text(l.text)
        .style("left", "50%")
        .style("top", "50%")
        .style("transform", `translate(calc(-50% + ${l.x}px), calc(-50% + ${l.y}px))`);
    });
  }

  function update(root) {
    var nodes = g.selectAll('.node').data(root.descendants()).enter()
      .append('g').attr('class', function (d) { return 'node level-' + d.data.level; })
      .attr('transform', function (d) { return 'translate(' + d.x_cart + ',' + d.y_cart + ')'; })
      .on('click', function (event, d) { event.stopPropagation(); onNodeClick(event, d); })
      .on('mouseenter', function (event, d) {
        if (d.depth === 0) {
          var img = d3.select(this).select('image');
          gsap.to(img.node(), { attr: { width: 1500, height: 1920, x: -750, y: -960 }, duration: 0.3, ease: 'back.out(1.5)' });
          return;
        }
        var r = nodeRadius(d.data);
        var el = d3.select(this).select('circle');
        gsap.to(el.node(), { attr: { r: r * 1.3 }, duration: 0.2, ease: 'back.out(2)' });
      })
      .on('mouseleave', function (event, d) {
        if (d.depth === 0) {
          var img = d3.select(this).select('image');
          gsap.to(img.node(), { attr: { width: 1200, height: 1600, x: -600, y: -800 }, duration: 0.3 });
          return;
        }
        var r = nodeRadius(d.data);
        var el = d3.select(this).select('circle');
        gsap.to(el.node(), { attr: { r: r }, duration: 0.2 });
      });

    nodes.filter(function (d) { return d.depth > 0; }).append('circle')
      .attr('class', 'studied-ring')
      .attr('r', function (d) { return nodeRadius(d.data) + 8; })
      .style('fill', 'none')
      .style('stroke', function (d) { return colorOf(d); })
      .style('stroke-width', '2.5')
      .style('stroke-dasharray', '6 3')
      .style('opacity', function (d) { return studiedNodes.has(d.data.id) ? 1 : 0; })
      .style('pointer-events', 'none');

    nodes.append('circle').attr('class', 'node-circle')
      .attr('r', function (d) { return nodeRadius(d.data); })
      .style('fill', function (d) { return d.data.level === 0 ? 'transparent' : 'var(--bg)'; })
      .style('stroke', function (d) { return d.depth === 0 ? 'none' : colorOf(d); })
      .style('stroke-width', function (d) { return d.depth === 0 ? '0' : d.depth === 1 ? '6px' : '4px'; });

    nodes.filter(function (d) { return d.depth === 0; })
      .append('circle')
      .attr('class', 'map-ring')
      .attr('r', 260)
      .attr('cx', 0)
      .attr('cy', 0)
      .style('fill', 'rgba(120, 10, 10, 0.4)')
      .style('stroke', '#facc15')
      .style('stroke-width', 6)
      .style('filter', 'url(#gold-glow)')
      .style('opacity', 0.95)
      .style('pointer-events', 'none');

    gsap.to(g.selectAll('.map-ring').nodes(), {
      attr: { r: 275 },
      opacity: 0.6,
      duration: 1.5,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
      onUpdate: updateLinks
    });

    nodes.filter(function (d) { return d.depth === 0; })
      .append('image')
      .attr('href', 'assets/map.png')
      .attr('width', 1400).attr('height', 1800)
      .attr('x', -700).attr('y', -900)
      .style('position', 'relative')
      .style('z-index', 10)
      .style('pointer-events', 'all')
      .style('cursor', 'pointer');

    nodes.filter(function (d) { return d.depth === 0; }).append('text')
      .attr('text-anchor', 'middle')
      .style('font-size', '52px')
      .style('font-weight', '800')
      .style('fill', '#ffffff')
      .style('text-shadow', '2px 4px 6px rgba(0,0,0,0.8)')
      .style('font-family', "'Be Vietnam Pro', sans-serif")
      .attr('y', 230)
      .each(function (d) {
        var el = d3.select(this);
        var lines = (d.data.name || '').split('\n');
        lines.forEach(function (line, i) {
          el.append('tspan').attr('x', 0).attr('dy', i === 0 ? '0' : '1.3em').text(line);
        });
      });

    nodes.filter(function (d) { return d.depth > 0 && !!d.data.icon; })
      .each(function (d) {
        var el = d3.select(this);
        var icon = d.data.icon;
        if (icon.toLowerCase().endsWith('.png')) {
          var size = d.depth === 1 ? 60 : 40;
          if (icon.toLowerCase() === 'vietnam.png' || icon.toLowerCase() === 'assets/vietnam.png' || icon.toLowerCase().endsWith('/vietnam.png')) size = 48;
          el.append('image')
            .attr('xlink:href', icon)
            .attr('width', size)
            .attr('height', size)
            .attr('x', -size / 2)
            .attr('y', -size / 2);
        } else {
          el.append('text')
            .attr('text-anchor', 'middle')
            .attr('dy', '.35em')
            .style('font-size', d.depth === 1 ? '36px' : '24px')
            .style('fill', colorOf(d))
            .text(icon);
        }
      });

    nodes.filter(function (d) { return d.depth > 0; }).append('text').attr('class', 'node-text')
      .attr('x', function (d) { return d.x < 180 ? nodeRadius(d.data) + 14 : -(nodeRadius(d.data) + 14); })
      .style('text-anchor', function (d) { return d.x < 180 ? 'start' : 'end'; })
      .style('font-size', function (d) {
        if (d.depth === 1) return '40px';
        if (d.depth === 2) return '32px';
        if (d.depth === 3) return '28px';
        return '24px';
      })
      .style('font-weight', function (d) { return d.depth <= 2 ? '700' : '600'; })
      .each(function (d) {
        var el = d3.select(this);
        var lines = (d.data.name || '').split('\n');
        var xOff = d.x < 180 ? nodeRadius(d.data) + 14 : -(nodeRadius(d.data) + 14);
        lines.forEach(function (line, i) {
          el.append('tspan').attr('x', xOff).attr('dy', i === 0 ? '0.35em' : '1.2em').text(line);
        });
      });

    gsap.set(g.selectAll('.node').nodes(), { opacity: 0, scale: 0, svgOrigin: '0 0' });
    gsap.to(g.selectAll('.node').nodes(), {
      opacity: function (i, el) {
        var d = d3.select(el).datum();
        if (showAllNodes) return 1;
        return d.depth <= 1 ? 1 : 0.07;
      },
      scale: 1, duration: 0.5, ease: 'back.out(1.7)', stagger: 0.02, delay: 0.35
    });
    gsap.to(g.selectAll('.link').nodes(), {
      opacity: function (i, el) {
        var d = d3.select(el).datum();
        if (showAllNodes) return 0.9;
        return d.target.depth <= 1 ? 0.9 : 0.04;
      },
      duration: 0.8, stagger: 0.012, delay: 0.2
    });

    initialView(root);
    lastRoot = root;
  }

  // ── Sidebar: zoom to branch ───────────────────────────────────────
  function zoomToBranchByData(branchData) {
    g.selectAll('.node').each(function (d) {
      if (d.data === branchData) zoomToBranch(d);
    });
  }

  // ── Nav active state helper ───────────────────────────────────────
  function setNavActive(branchId) {
    document.querySelectorAll('.nav-item[data-branch]').forEach(function (n) {
      n.classList.remove('nav-active');
    });
    if (branchId) {
      var el = document.querySelector('.nav-item[data-branch="' + branchId + '"]');
      if (el) el.classList.add('nav-active');
    }
  }

  // ── Click handler ─────────────────────────────────────────────────
  var currentNodeId = null;

  function onNodeClick(event, d, targetEl) {
    if (event && event.stopPropagation) event.stopPropagation();
    playClickSound();
    var nodeColor = colorOf(d) || '#5c6bc0';
    var el = targetEl || (event ? event.currentTarget : null);

    if (event && typeof event.clientX === 'number') {
      var containerRect = canvasEl.parentElement.getBoundingClientRect();
      var sx = event.clientX - containerRect.left;
      var sy = event.clientY - containerRect.top;
      var cnt = d.depth === 0 ? 100 : d.depth === 1 ? 75 : 50;
      if (isMobile) cnt = Math.floor(cnt * 0.4);
      if (prefersReducedMotion) cnt = 0;
      if (cnt > 0) {
        spawnParticles(sx, sy, nodeColor, cnt);
      }
    }

    emitRings(d.x_cart, d.y_cart, nodeColor, d.depth, d.data);
    if (el) bloomNode(el, d, nodeColor);
    highlightLinks(d, nodeColor);

    if (d.depth === 0) {
      resetBranchFocus(true);
      showDetails(d.data);
      return;
    } else if (d.depth === 1) {
      zoomToBranch(d);
      // Highlight the matching nav item
      setNavActive(d.data.id);
    } else {
      zoomToNode(d);
      // Highlight the parent branch nav item
      var parentBranch = d.ancestors().find(function (a) { return a.depth === 1; });
      if (parentBranch) setNavActive(parentBranch.data.id);
    }

    showDetails(d.data);

    if (d.data.id) {
      if (currentNodeId && currentNodeId !== d.data.id) stopStudyTimer(currentNodeId);
      currentNodeId = d.data.id;
      startStudyTimer(d.data.id);
    }
  }

  // ── Zoom helpers ──────────────────────────────────────────────────
  function zoomToBranch(d) {
    focusedNode = d;
    var vw = svgEl.parentElement.clientWidth, vh = svgEl.parentElement.clientHeight;
    var allDesc = d.descendants();
    var xs = allDesc.map(function (n) { return n.x_cart; }).concat([d.x_cart, 0]);
    var ys = allDesc.map(function (n) { return n.y_cart; }).concat([d.y_cart, 0]);
    var minX = Math.min.apply(null, xs), maxX = Math.max.apply(null, xs);
    var minY = Math.min.apply(null, ys), maxY = Math.max.apply(null, ys);
    var bw = maxX - minX + 400, bh = maxY - minY + 400;
    var midX = (minX + maxX) / 2, midY = (minY + maxY) / 2;
    var panelW = 600, usableW = vw - panelW - 60;
    var scale = Math.min(Math.min(usableW / bw, vh / bh) * 0.88, 2.5);
    if (d.data.id === 'ch1') scale *= 2.5;
    else if (d.depth === 1) scale *= 1.5;
    scale = Math.max(scale, 0.05);
    var tx = (vw - panelW) / 2 - scale * midX, ty = vh / 2 - scale * midY - 40;
    if (d.data.id === 'ch1') tx -= 150;
    svg.transition().duration(900).ease(d3.easeCubicInOut).call(zoom.transform, d3.zoomIdentity.translate(tx, ty).scale(scale));
    dimSiblings(d);
  }

  function zoomToNode(d) {
    focusedNode = d;
    var vw = svgEl.parentElement.clientWidth, vh = svgEl.parentElement.clientHeight;
    var panelW = 600, usableW = vw - panelW - 60;
    var scale = Math.min(currentTransform.k * 1.5, 2.2);
    var tx = (vw - panelW) / 2 - scale * d.x_cart, ty = vh / 2 - scale * d.y_cart - 40;
    if (d.data.id === 'ch1') tx -= 150;
    svg.transition().duration(600).ease(d3.easeCubicInOut).call(zoom.transform, d3.zoomIdentity.translate(tx, ty).scale(scale));
    dimSiblings(d);
  }

  function dimSiblings(focusD) {
    var activeSet = new Set();
    focusD.descendants().forEach(function (n) { activeSet.add(n.data.id || n.data.name); });
    var curr = focusD;
    while (curr) {
      activeSet.add(curr.data.id || curr.data.name);
      curr = curr.parent;
    }

    g.selectAll('.node').each(function (nd) {
      if (showAllNodes) { gsap.to(this, { opacity: 1, duration: 0.45 }); return; }
      var isActive = activeSet.has(nd.data.id || nd.data.name) || nd.depth === 0;
      gsap.to(this, { opacity: isActive ? 1 : 0.07, duration: 0.45 });
    });
    g.selectAll('.link').each(function (ld) {
      if (showAllNodes) { gsap.to(this, { opacity: 0.9, duration: 0.45 }); return; }
      var sActive = activeSet.has(ld.source.data.id || ld.source.data.name);
      var tActive = activeSet.has(ld.target.data.id || ld.target.data.name);
      gsap.to(this, { opacity: (sActive && tActive) ? 0.9 : 0.04, duration: 0.45 });
    });
  }

  function dimBranches() {
    g.selectAll('.node').each(function (nd) {
      if (showAllNodes) { gsap.to(this, { opacity: 1, duration: 0.45 }); return; }
      var isActive = nd.depth <= 1;
      gsap.to(this, { opacity: isActive ? 1 : 0.07, duration: 0.45 });
    });
    g.selectAll('.link').each(function (ld) {
      if (showAllNodes) { gsap.to(this, { opacity: 0.9, duration: 0.45 }); return; }
      var isActive = ld.target.depth <= 1;
      gsap.to(this, { opacity: isActive ? 0.9 : 0.04, duration: 0.45 });
    });
  }

  function resetBranchFocus(keepDetails) {
    focusedNode = null;
    currentNodeId = null;
    dimBranches();
    initialView(lastRoot);
    if (!keepDetails) hideDetails();
    // Xóa active state trên nav
    setNavActive(null);
  }

  svg.on('click', function (event) {
    if ((event.target === svgEl || event.target.tagName.toLowerCase() === 'svg') && focusedNode) {
      resetBranchFocus();
    }
  });

  // ── Effects ───────────────────────────────────────────────────────
  function emitRings(cx, cy, color, depth, data) {
    var count = depth === 0 ? 4 : depth === 1 ? 3 : 2;
    var baseR = depth === 0 ? 260 : nodeRadius(data);
    var rangeFactor = depth === 0 ? 280 : depth === 1 ? 180 : 110;
    var effectColor = depth === 0 ? '#facc15' : color;
    for (var i = 0; i < count; i++) {
      (function (idx) {
        var ring = shockwaveLayer.append('circle').attr('cx', cx).attr('cy', cy).attr('r', baseR)
          .style('fill', 'none').style('stroke', effectColor).style('stroke-width', depth <= 1 ? 5 : 3)
          .style('opacity', 0.9).style('pointer-events', 'none');
        gsap.to(ring.node(), {
          attr: { r: 70 + rangeFactor + idx * 50 }, opacity: 0, strokeWidth: 1,
          duration: 0.8 + idx * 0.18, delay: idx * 0.1, ease: 'power2.out', onComplete: function () { ring.remove(); }
        });
      })(i);
    }
    var flash = shockwaveLayer.append('circle').attr('cx', cx).attr('cy', cy).attr('r', baseR * 2)
      .style('fill', effectColor).style('opacity', 0.35).style('pointer-events', 'none');
    gsap.to(flash.node(), { attr: { r: baseR * 0.3 }, opacity: 0, duration: 0.28, ease: 'expo.out', onComplete: function () { flash.remove(); } });
  }

  function bloomNode(nodeEl, d, color) {
    var circle = d3.select(nodeEl).select('circle.node-circle');
    var r = d.depth === 0 ? 260 : nodeRadius(d.data);
    var effectColor = d.depth === 0 ? '#facc15' : color;

    if (d.depth === 0) {
      circle.style('stroke-width', '6px');
      circle.style('filter', 'url(#strong-glow)');
      gsap.timeline({
        onComplete: function () { circle.style('filter', null); circle.style('stroke', 'none'); }
      })
        .to(circle.node(), { attr: { r: r * 0.95 }, duration: 0.08, ease: 'power3.in' })
        .to(circle.node(), { attr: { r: r * 1.1 }, stroke: effectColor, duration: 0.2, ease: 'expo.out' })
        .to(circle.node(), { attr: { r: r }, stroke: 'none', duration: 0.45, ease: 'elastic.out(1,0.4)' });
      return;
    }

    circle.style('filter', 'url(#strong-glow)');
    gsap.timeline({
      onComplete: function () { circle.style('filter', null); }
    })
      .to(circle.node(), { attr: { r: r * 0.65 }, duration: 0.08, ease: 'power3.in' })
      .to(circle.node(), { attr: { r: r * 1.8 }, stroke: '#ffffff', duration: 0.2, ease: 'expo.out' })
      .to(circle.node(), { attr: { r: r }, stroke: effectColor, duration: 0.45, ease: 'elastic.out(1,0.4)' });
  }

  function highlightLinks(d, color) {
    var desc = d.descendants ? d.descendants() : [d];
    var names = new Set(desc.map(function (n) { return n.data.name; }));
    g.selectAll('.link').each(function (ld) {
      var isDesc = names.has(ld.target.data.name) && names.has(ld.source.data.name);
      var isIncoming = ld.target.data.name === d.data.name;
      if (!isDesc && !isIncoming) return;
      var baseW = ld.target.depth === 1 ? 6 : 3;
      gsap.killTweensOf(this);
      gsap.timeline().to(this, { attr: { 'stroke-width': baseW * 2.5 }, duration: 0.08, ease: 'power3.out' })
        .to(this, { attr: { 'stroke-width': baseW }, duration: 0.5, ease: 'elastic.out(1,0.5)' });
    });
  }

  // ── Detail panel ──────────────────────────────────────────────────
  function showDetails(data) {
    var titleEl = document.getElementById('topic-title');
    if (titleEl) {
      titleEl.textContent = (data.name || '').replace('\n', ' ');
    }
    
    let contentParts = [];
    if (data.description) contentParts.push(formatSafeHTML(data.description));
    if (data.vietnam_example) contentParts.push(formatSafeHTML(data.vietnam_example));
    if (data.meaning) contentParts.push(formatSafeHTML(data.meaning));

    const contentEl = document.getElementById('topic-content');
    if (contentEl) {
      contentEl.innerHTML = contentParts.join('<br><br>').replace(/\n/g, '<br>');
    }

    if (detailPanel) {
      detailPanel.classList.add('open');
      document.body.classList.add('detail-open');
      var durationVal = prefersReducedMotion ? 0.01 : 0.6;
      gsap.fromTo(detailPanel, { y: '120%', x: '0%' }, { y: '0%', x: '0%', duration: durationVal, ease: 'expo.out' });
    }

    if (data && data.id) {
      updateStudyStatusUI(data.id);
    }

    try {
      if (timelineContainer) timelineContainer.classList.add('at-panel');
      if (data && data.id) updateTimeline(data.id);
      setTimeout(function () {
        var active = document.querySelector('.timeline-mark.active');
        if (active && active.scrollIntoView) {
          active.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' });
        }
      }, 250);
    } catch (e) {
      console.warn('Timeline positioning/update failed', e);
    }
  }

  function hideDetails() {
    if (detailPanel && !detailPanel.classList.contains('open')) return;
    if (currentNodeId) stopStudyTimer(currentNodeId);
    if (timelineContainer) timelineContainer.classList.remove('at-panel');
    if (detailPanel) {
      var durationVal = prefersReducedMotion ? 0.01 : 0.5;
      gsap.to(detailPanel, {
        y: '120%',
        duration: durationVal,
        ease: 'power2.in',
        onComplete: function () {
          detailPanel.classList.remove('open');
          document.body.classList.remove('detail-open');
        }
      });
    }
  }

  closePanelBtn.addEventListener('click', hideDetails);

  // ── Timeline Logic ────────────────────────────────────────────────
  function updateTimeline(activeId) {
    var match = String(activeId || '').match(/^ch\d+/);
    var targetId = match ? match[0] : null;
    timelineMarks.forEach(function (mark) {
      if (mark.getAttribute('data-id') === targetId) {
        mark.classList.add('active');
      } else {
        mark.classList.remove('active');
      }
    });
  }

  timelineMarks.forEach(function (mark) {
    mark.addEventListener('click', function (e) {
      var id = this.getAttribute('data-id');
      var found = false;
      g.selectAll('.node').each(function (d) {
        if (d.data.id === id) {
          onNodeClick(e, d, this);
          found = true;
        }
      });
      if (!found) {
        console.warn('Timeline node not found in map:', id);
      }
    });
  });

  // ── View helpers ──────────────────────────────────────────────────
  function initialView(root) {
    if (root) lastRoot = root;
    var parent = svgEl.parentElement;
    var scale = (Math.min(parent.clientWidth, parent.clientHeight) * 0.92) / (520 * 2 + 400);
    svg.transition().duration(1000).call(zoom.transform, d3.zoomIdentity.translate(parent.clientWidth / 2, parent.clientHeight / 2 - 40).scale(scale));
  }

  function resetView() {
    var b = g.node().getBBox(), parent = svgEl.parentElement;
    var scale = 0.8 / Math.max(b.width / parent.clientWidth, b.height / parent.clientHeight || 1);
    var midX = b.x + b.width / 2, midY = b.y + b.height / 2;
    svg.transition().duration(750).call(zoom.transform, d3.zoomIdentity.translate(parent.clientWidth / 2 - scale * midX, parent.clientHeight / 2 - scale * midY).scale(scale));
  }

  // ── Utility ───────────────────────────────────────────────────────
  function colorOf(d) {
    if (!d || !d.data) return '#fff';
    if (d.data.level === 0) return '#fff';
    if (d.data.color) return d.data.color;
    var p = d.parent;
    while (p) { if (p.data.color) return p.data.color; p = p.parent; }
    return '#fff';
  }

  function nodeRadius(d) {
    var level = d && d.level !== undefined ? d.level : (d && d.data ? d.data.level : 3);
    switch (level) {
      case 0: return 190;
      case 1: return 42;
      case 2: return 24;
      case 3: return 18;
      default: return 14;
    }
  }

  // ── Controls ──────────────────────────────────────────────────────
  document.getElementById('zoom-in').addEventListener('click', function () { svg.transition().call(zoom.scaleBy, 1.5); });
  document.getElementById('zoom-out').addEventListener('click', function () { svg.transition().call(zoom.scaleBy, 0.5); });
  document.getElementById('reset-view').addEventListener('click', resetView);

  var toggleAllBtn = document.getElementById('toggle-all');
  if (toggleAllBtn) {
    toggleAllBtn.addEventListener('click', function () {
      showAllNodes = !showAllNodes;
      this.classList.toggle('active', showAllNodes);
      var icon = this.querySelector('i');
      if (icon) {
        if (showAllNodes) {
          icon.classList.remove('bi-eye');
          icon.classList.add('bi-eye-fill');
        } else {
          icon.classList.remove('bi-eye-fill');
          icon.classList.add('bi-eye');
        }
      }
      if (!focusedNode) { dimBranches(); } else { dimSiblings(focusedNode); }
    });
  }

  // ── Search ────────────────────────────────────────────────────────
  var searchInput = document.getElementById('search-input');
  var searchResults = document.getElementById('search-results');

  function getAllNodes(node, path) {
    var result = [];
    path = path || '';
    var myPath = path ? path + ' › ' + node.name.replace('\n', ' ') : node.name.replace('\n', ' ');
    if (node.level > 0) result.push({ data: node, path: myPath });
    (node.children || []).forEach(function (c) { result = result.concat(getAllNodes(c, myPath)); });
    return result;
  }

  if (searchInput) {
    searchInput.addEventListener('input', function () {
      var q = this.value.trim().toLowerCase();
      if (!q || !mapData) { searchResults.classList.remove('visible'); return; }
      var all = getAllNodes(mapData);
      var matches = all.filter(function (n) { return n.data.name.toLowerCase().includes(q) || (n.data.description || '').toLowerCase().includes(q); }).slice(0, 6);
      if (!matches.length) { searchResults.classList.remove('visible'); return; }
      searchResults.innerHTML = matches.map(function (m) {
        var cleanName = escapeHTML(m.data.name.replace('\n', ' '));
        var cleanPath = escapeHTML(m.path);
        var attrName = escapeHTML(m.data.name.replace(/"/g, ''));
        return '<div class="sr-item" data-name="' + attrName + '"><div class="sri-name">' + cleanName + '</div><div class="sri-path">' + cleanPath + '</div></div>';
      }).join('');
      searchResults.classList.add('visible');
      searchResults.querySelectorAll('.sr-item').forEach(function (item) {
        item.addEventListener('click', function () {
          var name = this.getAttribute('data-name');
          g.selectAll('.node').each(function (d) {
            if ((d.data.name || '').replace('\n', ' ') === name) {
              onNodeClick({ stopPropagation: function () { }, currentTarget: this }, d);
            }
          });
          searchResults.classList.remove('visible');
          searchInput.value = '';
          if (searchInputContainer) searchInputContainer.classList.remove('active');
        });
      });
    });
  }

  // ── Search toggle ──────────────────────────────────────────────────
  if (searchBtnToggle) {
    searchBtnToggle.addEventListener('click', function (e) {
      e.stopPropagation();
      searchInputContainer.classList.toggle('active');
      if (searchInputContainer.classList.contains('active')) {
        searchInput.focus();
      }
    });
  }

  // ── Global click delegation ────────────────────────────────────────
  document.addEventListener('click', function (e) {

    // ① Header nav branch links — FIX: stopPropagation + particles từ vị trí nav
    var navItem = e.target.closest('.nav-item[data-branch]');
    if (navItem) {
      e.preventDefault();
      e.stopPropagation();
      var branchId = navItem.getAttribute('data-branch');

      if (!lastRoot || !lastRoot.children) return;

      var targetNode = lastRoot.children.find(function (c) {
        return c.data.id === branchId;
      });

      if (targetNode) {
        // Highlight nav
        setNavActive(branchId);

        // Particles từ vị trí nút nav trên header
        var rect = navItem.getBoundingClientRect();
        var containerRect = canvasEl.parentElement.getBoundingClientRect();
        var sx = rect.left + rect.width / 2 - containerRect.left;
        var sy = rect.bottom - containerRect.top + 10;
        spawnParticles(sx, sy, colorOf(targetNode), 50);

        zoomToBranch(targetNode);
        showDetails(targetNode.data);
      }
      return;
    }

    // ② Timeline toggle button
    if (e.target.closest('#nav-timeline-btn')) {
      timelineContainer.classList.toggle('visible');
      return;
    }

    // ③ Search box / Results
    if (!e.target.closest('.search-box')) {
      if (searchResults) searchResults.classList.remove('visible');
      if (searchInputContainer && !searchBtnToggle.contains(e.target)) {
        searchInputContainer.classList.remove('active');
      }
    }

    // ④ UI element detection
    var isClickInsidePanel = e.target.closest('#detail-panel');
    var isClickOnNode = e.target.closest('.node');
    var isClickOnBranchBtn = e.target.closest('.branch-btn');
    var isClickSearchItem = e.target.closest('.sr-item');
    var isClickOnControls = e.target.closest('.controls');
    var isClickOnBreadcrumb = e.target.closest('#breadcrumb');
    var isClickOnTopBar = e.target.closest('#topbar');
    var isClickOnSidebar = e.target.closest('#sidebar');
    var isClickOnChatBtn = e.target.closest('#ai-chatbot-btn');
    var isClickOnChatWindow = e.target.closest('#ai-chat-window');
    var isClickOnBranchNav = e.target.closest('#branch-nav');
    var isClickOnIntro = e.target.closest('#intro-overlay') || e.target.closest('#team-avatar-btn');

    var isClickOnAnyUIElement = isClickInsidePanel || isClickOnNode || isClickOnBranchBtn || isClickSearchItem || isClickOnControls || isClickOnBreadcrumb || isClickOnTopBar || isClickOnSidebar || isClickOnChatBtn || isClickOnChatWindow || isClickOnBranchNav || isClickOnIntro;

    if (!isClickOnAnyUIElement && focusedNode) {
      resetBranchFocus();
    }

    var isOpeningNode = isClickOnNode || isClickOnBranchBtn || isClickSearchItem || isClickOnBranchNav;
    var isInteractingWithChat = isClickOnChatBtn || isClickOnChatWindow || isClickOnIntro;

    if (!isClickInsidePanel && !isOpeningNode && !isInteractingWithChat) {
      if (detailPanel.classList.contains('open')) {
        hideDetails();
      }
    }
  });

  // ─────────────────────────────────────────────────────────────────
  // ══ QUIZ SYSTEM ══════════════════════════════════════════════════
  // ─────────────────────────────────────────────────────────────────
  var quizOverlay = document.getElementById('quiz-overlay');
  var quizStart = document.getElementById('quiz-start');
  var quizQScreen = document.getElementById('quiz-question-screen');
  var quizResultsDiv = document.getElementById('quiz-results');

  var currentQuiz = [];
  var currentQIdx = 0;
  var userAnswers = [];
  var timerInterval = null;
  var elapsed = 0;
  var bestScore = null;
  var originalQuizHTML = "";
  if (quizStart) {
    originalQuizHTML = quizStart.innerHTML;
  }

  function openQuiz() {
    if (quizOverlay) {
      quizOverlay.classList.add('show');
    }
    showQuizStart();
  }

  function closeQuiz() {
    if (quizOverlay) {
      quizOverlay.classList.remove('show');
    }
    clearInterval(timerInterval);
  }

  function showQuizStart() {
    if (quizStart) {
      quizStart.innerHTML = originalQuizHTML;
      quizStart.style.display = 'block';
    }
    if (quizQScreen) quizQScreen.style.display = 'none';
    if (quizResultsDiv) quizResultsDiv.style.display = 'none';
  }
  window.showQuizStart = showQuizStart;

  async function startQuizByTopic(topic) {
    if (!quizStart) return;

    quizStart.innerHTML = `
      <div class="quiz-loading-container" style="display:flex;flex-direction:column;align-items:center;justify-content:center;padding:100px 0;">
        <div class="spinner"></div>
        <p style="margin-top:20px;color:var(--gold);font-weight:600;">Đang tải ngân hàng câu hỏi...</p>
      </div>
    `;

    let qData = [];
    try {
      if (topic === 'all') {
        const indices = [1, 2, 3, 4, 5, 6];
        const loads = indices.map(i => d3.json(`data/chapter${i}.json`));
        const results = await Promise.all(loads);
        qData = results.flat();
      } else {
        qData = await d3.json(`data/chapter${topic}.json`);
      }
    } catch (err) {
      console.error('Quiz load error:', err);
      quizStart.innerHTML = `
        <div class="quiz-error-container" style="text-align:center;padding:60px 20px;">
          <i class="bi bi-exclamation-triangle-fill" style="font-size:3rem;color:#ef5350;"></i>
          <h3 style="margin-top:16px;color:#fff;font-weight:700;">Tải dữ liệu thất bại</h3>
          <p style="color:var(--text-muted);margin:12px 0 24px;">Không thể tải dữ liệu câu hỏi từ máy chủ. Vui lòng kiểm tra kết nối mạng của bạn.</p>
          <button class="start-btn" onclick="showQuizStart()">Thử lại</button>
        </div>
      `;
      return;
    }

    if (!qData || !qData.length) {
      quizStart.innerHTML = `
        <div class="quiz-error-container" style="text-align:center;padding:60px 20px;">
          <i class="bi bi-folder-minus" style="font-size:3rem;color:var(--gold);"></i>
          <h3 style="margin-top:16px;color:#fff;font-weight:700;">Ngân hàng câu hỏi trống</h3>
          <p style="color:var(--text-muted);margin:12px 0 24px;">Không tìm thấy câu hỏi nào cho chương này.</p>
          <button class="start-btn" onclick="showQuizStart()">Quay lại</button>
        </div>
      `;
      return;
    }

    var shuffled = qData.slice().sort(function () { return Math.random() - 0.5; });
    currentQuiz = shuffled.slice(0, 20);
    currentQIdx = 0;
    userAnswers = [];
    elapsed = 0;

    quizStart.style.display = 'none';
    quizQScreen.style.display = 'flex';
    quizResultsDiv.style.display = 'none';

    clearInterval(timerInterval);
    timerInterval = setInterval(function () {
      elapsed++;
      var tv = document.getElementById('timer-val');
      if (tv) tv.textContent = elapsed;
    }, 1000);

    renderQuestion();
  }

  window.startQuizByTopic = startQuizByTopic;

  function renderQuestion() {
    var q = currentQuiz[currentQIdx];
    var total = currentQuiz.length;
    document.getElementById('quiz-q-num').textContent = 'Câu ' + (currentQIdx + 1);
    document.getElementById('quiz-question').textContent = q.question;
    document.getElementById('quiz-progress-text').textContent = (currentQIdx + 1) + ' / ' + total;
    document.getElementById('quiz-prog-fill').style.width = (((currentQIdx) / total) * 100) + '%';
    document.getElementById('quiz-explain').style.display = 'none';
    document.getElementById('quiz-explain').textContent = '';

    var nextBtn = document.getElementById('quiz-next-btn');
    nextBtn.disabled = true;
    nextBtn.textContent = '';
    nextBtn.innerHTML = currentQIdx < total - 1 ? 'Tiếp theo <i class="bi bi-arrow-right"></i>' : 'Xem kết quả <i class="bi bi-patch-check"></i>';

    var optContainer = document.getElementById('quiz-options');
    optContainer.innerHTML = '';
    q.options.forEach(function (opt, i) {
      var btn = document.createElement('button');
      btn.className = 'quiz-opt';
      btn.textContent = String.fromCharCode(65 + i) + '. ' + opt;
      btn.addEventListener('click', function () { selectAnswer(i); });
      optContainer.appendChild(btn);
    });
  }

  function selectAnswer(idx) {
    var q = currentQuiz[currentQIdx];
    var opts = document.querySelectorAll('.quiz-opt');
    opts.forEach(function (o) { o.disabled = true; });
    userAnswers[currentQIdx] = idx;

    var isCorrect = idx === q.answer;
    opts[idx].classList.add(isCorrect ? 'correct' : 'wrong');
    if (!isCorrect) opts[q.answer].classList.add('correct');

    var explEl = document.getElementById('quiz-explain');
    if (explEl) {
      explEl.innerHTML = '<i class="bi bi-lightbulb-fill"></i> ' + formatSafeHTML(q.explain || '');
      explEl.style.display = 'block';
    }

    document.getElementById('quiz-next-btn').disabled = false;
  }

  document.getElementById('quiz-next-btn').addEventListener('click', function () {
    if (userAnswers[currentQIdx] === undefined) return;
    currentQIdx++;
    if (currentQIdx < currentQuiz.length) {
      renderQuestion();
    } else {
      clearInterval(timerInterval);
      showResults();
    }
  });

  async function showResults() {
    quizQScreen.style.display = 'none';
    quizResultsDiv.style.display = 'block';
    quizResultsDiv.scrollTop = 0;

    var correct = 0;
    var wrongQuestions = [];
    userAnswers.forEach(function (ans, i) {
      if (ans === currentQuiz[i].answer) { correct++; }
      else { wrongQuestions.push(currentQuiz[i]); }
    });

    var pct = Math.round((correct / currentQuiz.length) * 100);
    playFanfareSound(pct >= 50);
    if (bestScore === null || correct > bestScore) bestScore = correct;

    var scoreClass = pct >= 80 ? 'score-green' : pct >= 50 ? 'score-orange' : 'score-red';
    var stars = pct >= 80 ? '<i class="bi bi-star-fill"></i><i class="bi bi-star-fill"></i><i class="bi bi-star-fill"></i>' : pct >= 60 ? '<i class="bi bi-star-fill"></i><i class="bi bi-star-fill"></i>' : '<i class="bi bi-star-fill"></i>';
    var msg = pct >= 80 ? 'Xuất sắc! Bạn nắm vững kiến thức.' : pct >= 60 ? 'Khá tốt! Tiếp tục ôn luyện.' : 'Cần ôn tập thêm. Đừng nản!';

    var html = '<div style="padding:40px; text-align:center;">'
      + '<div style="font-size:2.5rem;margin-bottom:12px;color:var(--gold)">' + stars + '</div>'
      + '<h2>Kết quả thi</h2>'
      + '<div class="results-score ' + scoreClass + '">' + correct + '<span style="font-size:1.4rem;opacity:0.5">/' + currentQuiz.length + '</span></div>'
      + '<div class="results-meta">' + msg + ' | <i class="bi bi-stopwatch"></i> ' + elapsed + 's | Tỉ lệ đúng: ' + pct + '%</div>';

    html += '<div class="ai-analysis-box">'
      + '<div class="ai-analysis-header"><i class="bi bi-robot"></i> AI Phân tích & Lời khuyên</div>'
      + '<div id="ai-advice-content">Hệ thống đang phân tích kết quả của bạn...</div>'
      + '</div></div>';

    html += '<div style="padding:0 40px 40px;">'
      + '<div style="font-size:0.82rem;font-weight:700;color:var(--muted);text-transform:uppercase;letter-spacing:1px;margin-bottom:12px">Chi tiết câu trả lời</div>';

    currentQuiz.forEach(function (q, i) {
      var ua = userAnswers[i];
      var ok = ua === q.answer;
      var escQuestion = escapeHTML(q.question);
      var escUserOpt = escapeHTML(q.options[ua]);
      var escCorrectOpt = escapeHTML(q.options[q.answer]);
      var formattedExplain = formatSafeHTML(q.explain);

      html += '<div class="result-item ' + (ok ? 'correct' : 'wrong') + '">'
        + '<div class="ri-q">' + (i + 1) + '. ' + escQuestion + '</div>'
        + '<div class="ri-your" style="color:' + (ok ? 'var(--green)' : '#ef5350') + '">'
        + (ok ? '<i class="bi bi-check-circle-fill"></i>' : '<i class="bi bi-x-circle-fill"></i>') + ' Bạn chọn: ' + String.fromCharCode(65 + ua) + '. ' + escUserOpt
        + '</div>';
      if (!ok) html += '<div class="ri-correct"><i class="bi bi-check-circle"></i> Đáp án đúng: ' + String.fromCharCode(65 + q.answer) + '. ' + escCorrectOpt + '</div>';
      if (q.explain) html += '<div class="ri-explain"><i class="bi bi-lightbulb-fill"></i> ' + formattedExplain + '</div>';
      html += '</div>';
    });

    html += '<div class="results-actions"><button id="back-btn"><i class="bi bi-arrow-left"></i> Quay lại menu chính</button></div></div>';

    quizResultsDiv.innerHTML = html;
    document.getElementById('back-btn').addEventListener('click', function () { showQuizStart(); });
    analyzeResultsByAI(wrongQuestions, correct, currentQuiz.length);
  }

  async function analyzeResultsByAI(wrongQuestions, correct, total) {
    const adviceEl = document.getElementById('ai-advice-content');
    if (!adviceEl) return;

    if (wrongQuestions.length === 0) {
      adviceEl.textContent = "Chúc mừng! Bạn đã trả lời đúng tất cả các câu hỏi. Hãy tiếp tục duy trì phong độ này!";
      return;
    }

    const topics = wrongQuestions.map(q => q.question).join(", ");
    const prompt = `Người dùng vừa làm bài thi trắc nghiệm HCM202 - Tư tưởng Hồ Chí Minh.
    Kết quả: đúng ${correct}/${total} câu.
    Những nội dung người dùng trả lời sai hoặc chưa vững: ${topics}.
    Hãy đưa ra lời khuyên ngắn gọn (khoảng 3-4 câu), tập trung vào những mảng kiến thức cần ôn tập lại và động viên người dùng.
    Dùng ngôn từ của một trợ lý học tập tận tâm.`;

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [
            { role: 'system', content: 'Bạn là chuyên gia về học phần HCM202 - Tư tưởng Hồ Chí Minh, hãy phân tích kết quả thi và đưa ra lời khuyên học tập.' },
            { role: 'user', content: prompt }
          ]
        })
      });
      const data = await response.json();
      if (data.content) {
        adviceEl.innerHTML = formatSafeHTML(data.content).replace(/\n/g, '<br>');
      } else {
        adviceEl.textContent = "AI hiện không thể đưa ra phân tích chi tiết. Tuy nhiên, bạn nên tập trung xem lại các câu hỏi đã trả lời sai.";
      }
    } catch (error) {
      console.error('AI Analysis error:', error);
      adviceEl.textContent = "Không thể kết nối với AI để phân tích. Hãy tự ôn tập lại các phần kiến thức tương ứng nhé!";
    }
  }

  var quizOpenBtn = document.getElementById('quiz-open-btn');
  if (quizOpenBtn) quizOpenBtn.addEventListener('click', openQuiz);

  var quizCancelBtn = document.querySelector('.quiz-close-top');
  if (quizCancelBtn) quizCancelBtn.addEventListener('click', closeQuiz);

  if (quizOverlay) {
    quizOverlay.addEventListener('click', function (e) {
      if (e.target === quizOverlay) closeQuiz();
    });
  }

  // ── INTRO MODAL LOGIC ──────────────────────────────────────────────
  function openIntro() {
    if (introOverlay) {
      introOverlay.classList.add('show');
    }
  }

  function closeIntro() {
    if (introOverlay) {
      introOverlay.classList.remove('show');
    }
  }

  if (teamAvatarBtn) {
    teamAvatarBtn.addEventListener('click', openIntro);
  }

  if (introCloseBtnTop) {
    introCloseBtnTop.addEventListener('click', closeIntro);
  }

  if (introOverlay) {
    introOverlay.addEventListener('click', function (e) {
      if (e.target === introOverlay) closeIntro();
    });
  }

  if (introViewMapBtn) {
    introViewMapBtn.addEventListener('click', function () {
      closeIntro();
      if (lastRoot) {
        onNodeClick(null, lastRoot);
      }
    });
  }

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      if (quizOverlay && quizOverlay.classList.contains('show')) closeQuiz();
      if (introOverlay && introOverlay.classList.contains('show')) closeIntro();
      if (detailPanel && detailPanel.classList.contains('open')) hideDetails();
    }
  });

  // ─────────────────────────────────────────────────────────────────
  // ══ AI CHATBOT LOGIC ═════════════════════════════════════════════
  // ─────────────────────────────────────────────────────────────────
  const chatBtn = document.getElementById('ai-chatbot-btn');
  const chatWindow = document.getElementById('ai-chat-window');
  const closeChatBtn = document.getElementById('close-chat');
  const chatInput = document.getElementById('chat-input');
  const sendChatBtn = document.getElementById('send-chat');
  const chatMessages = document.getElementById('chat-messages');

  if (chatBtn && chatWindow) {
    let chatHistory = [
      {
        role: 'system',
        content: 'Bạn là một trợ lý học tập am hiểu học phần HCM202 - Tư tưởng Hồ Chí Minh. Bạn chỉ trả lời các câu hỏi liên quan đến Tư tưởng Hồ Chí Minh, cuộc đời và sự nghiệp Hồ Chí Minh, hoặc nội dung 6 chương của giáo trình HCM202. Với câu hỏi ngoài phạm vi này, hãy lịch sự từ chối và nhắc rằng bạn tập trung hỗ trợ học phần HCM202.'
      }
    ];

    chatBtn.addEventListener('click', () => { chatWindow.classList.toggle('chat-hidden'); });

    if (closeChatBtn) {
      closeChatBtn.addEventListener('click', () => { chatWindow.classList.add('chat-hidden'); });
    }

    async function sendMessage() {
      const text = chatInput.value.trim();
      if (!text) return;

      appendMessage('user', text);
      chatInput.value = '';
      chatHistory.push({ role: 'user', content: text });

      const typingId = 'typing-' + Date.now();
      appendMessage('system', '...', typingId);

      try {
        const response = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ messages: chatHistory })
        });
        const data = await response.json();
        const typingEl = document.getElementById(typingId);
        if (typingEl) typingEl.remove();

        if (data.content) {
          appendMessage('system', data.content);
          chatHistory.push({ role: 'assistant', content: data.content });
        } else {
          appendMessage('system', 'Xin lỗi, có lỗi xảy ra. Bạn vui lòng thử lại sau.');
        }
      } catch (error) {
        console.error('Chat error:', error);
        const typingEl = document.getElementById(typingId);
        if (typingEl) typingEl.remove();
        appendMessage('system', 'Không thể kết nối với server. Hãy chắc chắn backend đã được chạy.');
      }
    }

    function appendMessage(role, text, id) {
      const msg = document.createElement('div');
      msg.className = 'message ' + role;
      if (id) msg.id = id;
      
      if (role === 'system') {
        let formatted = text.trim();
        formatted = formatted.replace(/^\*+\s*/, '');
        msg.innerHTML = formatSafeHTML(formatted).replace(/\n/g, '<br>');
      } else {
        msg.textContent = text;
      }
      
      chatMessages.appendChild(msg);
      chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    if (sendChatBtn) sendChatBtn.addEventListener('click', sendMessage);
    if (chatInput) {
      chatInput.addEventListener('keydown', (e) => { if (e.key === 'Enter') sendMessage(); });
    }
  }

});
