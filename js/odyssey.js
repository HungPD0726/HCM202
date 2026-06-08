document.addEventListener('DOMContentLoaded', function () {

  // ── DOM References ────────────────────────────────────────────────
  var svgEl = document.getElementById('odyssey-svg');
  var autoplayBtn = document.getElementById('autoplay-btn');
  var resetMapBtn = document.getElementById('reset-map-btn');
  var toggleMuteBtn = document.getElementById('toggle-mute');
  var toggleBioBtn = document.getElementById('toggle-bio-btn');
  var closeBioBtn = document.getElementById('close-bio-btn');
  var drawerOverlay = document.getElementById('drawer-overlay');
  var bioDrawer = document.getElementById('bio-drawer');
  
  var infoBadge = document.getElementById('info-badge');
  var infoLocation = document.getElementById('info-location');
  var infoYear = document.getElementById('info-year');
  var infoImage = document.getElementById('info-image');
  var infoDesc = document.getElementById('info-desc');
  var infoIdeology = document.getElementById('info-ideology');
  var prevBtn = document.getElementById('prev-milestone');
  var nextBtn = document.getElementById('next-milestone');

  // ── Preferences ───────────────────────────────────────────────────
  var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var isMobile = window.innerWidth <= 768;

  // ── Sound effects system (Shared from app.js) ─────────────────────
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
    if (isMuted) return;
    try {
      initAudio();
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
    } catch (e) {
      console.warn('Audio playTone error:', e);
    }
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

  // ── Milestone Data ────────────────────────────────────────────────
  var milestones = [
    {
      id: "saigon",
      name: "Bến Nhà Rồng (Sài Gòn)",
      year: "1911",
      lon: 106.7068, lat: 10.7628,
      image: "assets/nguyễn tất thành ra đi tìm đường cứu nước.jpg",
      desc: "Ngày 5/6/1911, người thanh niên Nguyễn Tất Thành (lấy tên là Văn Ba) đã xuống tàu Đô đốc Latouche-Tréville rời Bến cảng Nhà Rồng ra đi tìm con đường cứu nước giải phóng dân tộc.",
      ideology: "Khởi đầu cho hành trình thực tiễn, định hình ý chí tìm con đường độc lập dân tộc tự chủ hoàn toàn mới."
    },
    {
      id: "london",
      name: "Luân Đôn (Vương Quốc Anh)",
      year: "1913 - 1917",
      lon: -0.1278, lat: 51.5074,
      image: "assets/Bác Hồ ở Boston.jpg",
      desc: "Tại Anh, Người đã làm nhiều công việc vất vả như cào tuyết, quét dọn, phụ bếp ở khách sạn Carlton. Việc sống và lao động giúp Người thấu hiểu hơn về giai cấp vô sản và nhân dân lao động ở nước bản xứ.",
      ideology: "Giúp củng cố lập trường giai cấp, thấu suốt bản chất bóc lột của chủ nghĩa đế quốc Anh ngay tại trung tâm chế độ."
    },
    {
      id: "paris",
      name: "Paris (Cộng Hòa Pháp)",
      year: "1917 - 1923",
      lon: 2.3522, lat: 48.8566,
      image: "assets/Nguyễn Ái Quốc thành lập đảng cộng sản Pháp.jpg",
      desc: "Năm 1919, Người gửi bản Yêu sách của nhân dân An Nam đến Hội nghị Versailles. Tháng 7/1920, Người tiếp cận Luận cương của Lênin về dân tộc và thuộc địa. Tháng 12/1920, Người bỏ phiếu sáng lập Đảng Cộng sản Pháp.",
      ideology: "Mốc quan trọng nhất: Chuyển biến lập trường từ chủ nghĩa yêu nước sang chủ nghĩa cộng sản khoa học."
    },
    {
      id: "moscow",
      name: "Mát-xcơ-va (Liên Xô)",
      year: "1923 - 1924",
      lon: 37.6173, lat: 55.7558,
      image: "assets/Nhà báo cách mạng quốc tế Nguyễn Ái Quốc.jpg",
      desc: "Người đến Liên Xô học tập lý luận và hoạt động thực tiễn tại Quốc tế Cộng sản, dự Đại hội V Quốc tế Cộng sản, viết nhiều bài báo định hình tư tưởng thuộc địa.",
      ideology: "Hoàn thiện thế giới quan Mác - Lênin và chuẩn bị hệ thống lý luận giải phóng dân tộc cho cách mạng Việt Nam."
    },
    {
      id: "guangzhou",
      name: "Quảng Châu (Trung Quốc)",
      year: "1924 - 1927",
      lon: 113.2644, lat: 23.1291,
      image: "assets/Nhà báo cách mạng quốc tế Nguyễn Ái Quốc.jpg",
      desc: "Người thành lập Hội Việt Nam Cách mạng Thanh niên (1925), ra báo Thanh niên, mở các lớp chính trị huấn luyện cán bộ, biên soạn tập bài giảng thành cuốn sách Đường Kách mệnh (1927).",
      ideology: "Chuẩn bị về mặt chính trị, tư tưởng và tổ chức cán bộ, định hình vai trò hạt nhân lãnh đạo của Đảng."
    },
    {
      id: "hongkong",
      name: "Hồng Kông",
      year: "1930",
      lon: 114.1694, lat: 22.3193,
      image: "assets/Nhà báo cách mạng quốc tế Nguyễn Ái Quốc.jpg",
      desc: "Từ ngày 6/1 đến 7/2/1930, Người chủ trì Hội nghị thống nhất các tổ chức cộng sản trong nước tại Cửu Long (Hồng Kông) để thành lập Đảng Cộng sản Việt Nam.",
      ideology: "Kết quả tất yếu của quá trình kết hợp chủ nghĩa Mác - Lênin với phong trào yêu nước và phong trào công nhân."
    },
    {
      id: "pacbo",
      name: "Pac Bó (Cao Bằng)",
      year: "1941",
      lon: 106.1883, lat: 22.8633,
      image: "assets/Bác Hồ tại Pác bó.jpg",
      desc: "Ngày 28/1/1941, Người vượt biên giới Việt - Trung trở về Tổ quốc sau 30 năm bôn ba. Người sống và làm việc tại hang Cốc Bó (Pác Bó, Cao Bằng) để trực tiếp lãnh đạo chuẩn bị tổng khởi nghĩa.",
      ideology: "Hiện thực hóa lý luận cách mạng trực tiếp vào điều kiện cụ thể trong nước, chuẩn bị cho Cách mạng Tháng Tám."
    }
  ];

  // Projection setup for detailed geographic world map
  var projection = d3.geoMercator()
    .scale(300)
    .center([55, 34])
    .translate([500, 260]);

  var geoPath = d3.geoPath().projection(projection);

  // Convert longitude and latitude to x,y SVG coordinates
  milestones.forEach(function (m) {
    var projected = projection([m.lon, m.lat]);
    m.x = projected[0];
    m.y = projected[1];
  });

  var currentIndex = 0;
  var autoplayTimer = null;
  var isAutoplayActive = false;

  // ── D3 SVG Map Drawing ────────────────────────────────────────────
  var svg = d3.select(svgEl);
  var mainG = svg.append('g').attr('class', 'map-main-group');

  // Zoom setup
  var zoom = d3.zoom().scaleExtent([0.8, 8]).on('zoom', function (event) {
    mainG.attr('transform', event.transform);
  });
  svg.call(zoom);

  // 1. Draw Map Grid background
  for (var i = 50; i < 1000; i += 50) {
    mainG.append('line').attr('class', 'map-grid-line').attr('x1', i).attr('y1', 0).attr('x2', i).attr('y2', 550);
  }
  for (var j = 50; j < 550; j += 50) {
    mainG.append('line').attr('class', 'map-grid-line').attr('x1', 0).attr('y1', j).attr('x2', 1000).attr('y2', j);
  }

  // 2. Draw fallback schematic shapes first
  var continents = [
    // Eurasia & Africa
    { path: "M 280,120 L 460,80 L 580,70 L 880,100 L 920,250 L 820,380 L 650,420 L 500,320 L 330,300 Z", label: "Á - Âu" },
    { path: "M 330,300 L 490,320 L 510,480 L 440,520 L 330,420 Z", label: "Châu Phi" },
    // Americas
    { path: "M 30,100 L 220,100 L 220,240 L 120,280 Z", label: "Bắc Mỹ" },
    { path: "M 120,280 L 220,280 L 180,480 L 120,440 Z", label: "Nam Mỹ" },
    // Oceania
    { path: "M 800,420 L 900,420 L 900,480 L 800,480 Z", label: "Châu Đại Dương" }
  ];

  var continentPaths = mainG.selectAll('.continent-shape')
    .data(continents)
    .enter()
    .append('path')
    .attr('class', 'continent-shape')
    .attr('d', function (d) { return d.path; });

  // Async load local detailed world map GeoJSON
  d3.json('data/world.geojson').then(function (geoData) {
    // Remove the schematic continent shapes
    continentPaths.remove();

    // Draw the detailed geographic countries
    mainG.selectAll('.continent-shape')
      .data(geoData.features)
      .enter()
      .insert('path', '.travel-path') // Insert countries behind travel lines and markers
      .attr('class', 'continent-shape')
      .attr('d', geoPath)
      .append('title')
      .text(function (d) { return d.properties.name; });
  }).catch(function (err) {
    console.warn('Failed to load local world.geojson. Schematic fallback is kept.', err);
  });

  // 3. Draw Connecting Paths
  // Generate curve coordinates between milestones
  var lineGenerator = d3.line().curve(d3.curveBasis);
  
  for (var k = 0; k < milestones.length - 1; k++) {
    var p1 = milestones[k];
    var p2 = milestones[k + 1];
    
    // Draw a curved line to represent global voyages
    var midX = (p1.x + p2.x) / 2;
    var midY = (p1.y + p2.y) / 2 - 30; // Push upwards for curve
    
    var pathData = lineGenerator([
      [p1.x, p1.y],
      [midX, midY],
      [p2.x, p2.y]
    ]);

    mainG.append('path')
      .attr('class', 'travel-path')
      .attr('d', pathData);
  }

  // 4. Draw pulsing markers for milestones
  var markers = mainG.selectAll('.map-marker')
    .data(milestones)
    .enter()
    .append('g')
    .attr('class', 'map-marker')
    .attr('transform', function (d) { return 'translate(' + d.x + ',' + d.y + ')'; })
    .on('click', function (event, d) {
      event.stopPropagation();
      var idx = milestones.findIndex(m => m.id === d.id);
      selectMilestone(idx);
    });

  markers.append('circle').attr('class', 'marker-pulse').attr('r', 16);
  markers.append('circle').attr('class', 'marker-dot').attr('r', 8);

  // Label text under markers
  markers.append('text')
    .attr('class', 'marker-text')
    .attr('y', 20)
    .attr('text-anchor', 'middle')
    .text(function (d) { return d.name.split(' ')[0]; });

  // ── Render Card Details ───────────────────────────────────────────
  function selectMilestone(index, autoZoom) {
    if (index < 0 || index >= milestones.length) return;
    currentIndex = index;
    var d = milestones[index];

    // Play click sound
    if (autoZoom !== 'load') {
      playClickSound();
    }

    // Update active marker states
    mainG.selectAll('.map-marker').classed('active', false);
    d3.select(markers.nodes()[index]).classed('active', true);

    // Update info panel content safely
    if (infoBadge) infoBadge.textContent = 'Mốc ' + (index + 1) + ' / ' + milestones.length;
    if (infoLocation) infoLocation.textContent = d.name;
    if (infoYear) infoYear.textContent = d.year;
    if (infoDesc) infoDesc.textContent = d.desc;
    if (infoIdeology) infoIdeology.textContent = d.ideology;
    
    if (infoImage) {
      infoImage.src = d.image;
      infoImage.alt = d.name;
    }

    // Trigger GSAP fade slide-up animation for premium content changes
    if (typeof gsap !== 'undefined' && autoZoom !== 'load') {
      gsap.fromTo('#journey-info-panel > *', 
        { opacity: 0, y: 12 },
        { opacity: 1, y: 0, duration: 0.35, stagger: 0.06, ease: "power2.out" }
      );
    }

    // Update buttons disabled status
    if (prevBtn) prevBtn.disabled = (index === 0);
    if (nextBtn) {
      if (index === milestones.length - 1) {
        nextBtn.innerHTML = 'Hoàn thành <i class="bi bi-patch-check-fill"></i>';
      } else {
        nextBtn.innerHTML = 'Tiếp theo <i class="bi bi-arrow-right"></i>';
      }
    }

    // Zoom and pan D3 view to coordinate
    if (autoZoom !== false) {
      zoomTo(d.x, d.y, index === 0 ? 1.0 : 2.5);
    }
  }

  function zoomTo(x, y, scale) {
    var width = svgEl.clientWidth;
    var height = svgEl.clientHeight;
    
    // Scale down scale factor on mobile
    if (isMobile) {
      scale = Math.min(scale, 1.8);
    }
    
    var tx = width / 2 - scale * x;
    var ty = height / 2 - scale * y;

    var durationVal = prefersReducedMotion ? 0.01 : 1000;
    
    svg.transition()
      .duration(durationVal)
      .ease(d3.easeCubicInOut)
      .call(zoom.transform, d3.zoomIdentity.translate(tx, ty).scale(scale));
  }

  function resetView() {
    var width = svgEl.clientWidth;
    var height = svgEl.clientHeight;
    var scale = isMobile ? 0.8 : 1.0;
    
    var durationVal = prefersReducedMotion ? 0.01 : 800;
    
    svg.transition()
      .duration(durationVal)
      .call(zoom.transform, d3.zoomIdentity.translate(width / 2 - scale * 500, height / 2 - scale * 275).scale(scale));
  }

  // ── Autoplay controls ─────────────────────────────────────────────
  function startAutoplay() {
    if (isAutoplayActive) return;
    isAutoplayActive = true;
    
    if (autoplayBtn) {
      autoplayBtn.innerHTML = '<i class="bi bi-stop-circle-fill"></i> Tạm dừng tự động';
      autoplayBtn.classList.add('active');
    }

    // Select the first if we completed
    if (currentIndex >= milestones.length - 1) {
      selectMilestone(0);
    }

    autoplayTimer = setInterval(function () {
      if (currentIndex < milestones.length - 1) {
        selectMilestone(currentIndex + 1);
      } else {
        stopAutoplay();
        playChimeSound();
        alert('Chúc mừng! Bạn đã hoàn thành hành trình 30 năm bôn ba cứu nước của Chủ tịch Hồ Chí Minh (1911 - 1941).');
      }
    }, 4500);
  }

  function stopAutoplay() {
    if (!isAutoplayActive) return;
    isAutoplayActive = false;
    clearInterval(autoplayTimer);
    autoplayTimer = null;
    
    if (autoplayBtn) {
      autoplayBtn.innerHTML = '<i class="bi bi-play-circle-fill"></i> Bắt đầu hành trình tự động';
      autoplayBtn.classList.remove('active');
    }
  }

  if (autoplayBtn) {
    autoplayBtn.addEventListener('click', function () {
      if (isAutoplayActive) {
        stopAutoplay();
      } else {
        startAutoplay();
      }
    });
  }

  if (resetMapBtn) {
    resetMapBtn.addEventListener('click', resetView);
  }

  // ── Nav Button Events ─────────────────────────────────────────────
  if (prevBtn) {
    prevBtn.addEventListener('click', function () {
      stopAutoplay();
      if (currentIndex > 0) selectMilestone(currentIndex - 1);
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', function () {
      stopAutoplay();
      if (currentIndex < milestones.length - 1) {
        selectMilestone(currentIndex + 1);
      } else {
        playChimeSound();
        alert('Chúc mừng! Bạn đã hoàn thành hành trình 30 năm bôn ba cứu nước của Bác (1911 - 1941). Hãy bấm nút tiểu sử trên thanh công cụ để xem tiểu sử đầy đủ của Người.');
      }
    });
  }

  // ── Biography Drawer Controls ─────────────────────────────────────
  var heroOpenBioBtn = document.getElementById('hero-open-bio');

  function openDrawer() {
    playClickSound();
    document.body.classList.add('drawer-open');
    if (bioDrawer) {
      bioDrawer.classList.add('open');
      bioDrawer.setAttribute('aria-hidden', 'false');
    }
    if (drawerOverlay) {
      drawerOverlay.classList.add('open');
      drawerOverlay.classList.add('show');
      drawerOverlay.setAttribute('aria-hidden', 'false');
    }

    // Trigger GSAP stagger slide-in animation for timeline cards
    if (typeof gsap !== 'undefined') {
      gsap.fromTo('.bio-time-card', 
        { opacity: 0, x: 40 },
        { opacity: 1, x: 0, duration: 0.45, stagger: 0.08, ease: "power2.out", delay: 0.15 }
      );
    }
  }

  function closeDrawer() {
    playClickSound();
    document.body.classList.remove('drawer-open');
    if (bioDrawer) {
      bioDrawer.classList.remove('open');
      bioDrawer.setAttribute('aria-hidden', 'true');
    }
    if (drawerOverlay) {
      drawerOverlay.classList.remove('open');
      drawerOverlay.classList.remove('show');
      drawerOverlay.setAttribute('aria-hidden', 'true');
    }
  }

  if (toggleBioBtn) {
    toggleBioBtn.addEventListener('click', function (e) {
      e.stopPropagation();
      if (bioDrawer && bioDrawer.classList.contains('open')) {
        closeDrawer();
      } else {
        openDrawer();
      }
    });
  }

  if (heroOpenBioBtn) {
    heroOpenBioBtn.addEventListener('click', function (e) {
      e.stopPropagation();
      openDrawer();
    });
  }

  if (closeBioBtn) {
    closeBioBtn.addEventListener('click', closeDrawer);
  }

  if (drawerOverlay) {
    drawerOverlay.addEventListener('click', closeDrawer);
  }

  // Initialize
  selectMilestone(0, 'load');
  setTimeout(resetView, 300);

  // Close modals on Escape key
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      stopAutoplay();
      resetView();
      closeDrawer();
    }
  });

});
