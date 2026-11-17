// ===================================================================
// KVOLT-INSPIRED AUDIO-FORWARD INTERACTIVE SCRIPTS
// With Light / Dark Theme Switcher & Enhanced Text Contrast
// Le Thuy An E-Portfolio (Music Education & AI)
// ===================================================================

// Early Theme Setup
(function() {
  const savedTheme = localStorage.getItem('theme') || 'dark';
  document.documentElement.setAttribute('data-theme', savedTheme);
})();

document.addEventListener('DOMContentLoaded', () => {
  // 1. Theme Toggle Setup
  const navMenu = document.querySelector('.nav-menu');
  let currentTheme = localStorage.getItem('theme') || 'dark';
  document.documentElement.setAttribute('data-theme', currentTheme);

  // Inject Theme Toggle Button if not already in HTML
  if (navMenu && !document.getElementById('theme-toggle')) {
    const toggleLi = document.createElement('li');
    toggleLi.className = 'nav-item';
    toggleLi.innerHTML = `
      <button class="theme-toggle-btn" id="theme-toggle" aria-label="Chuyển chế độ Sáng / Tối" title="Chuyển chế độ Sáng / Tối">
        <span class="theme-icon">${currentTheme === 'light' ? '☀️' : '🌙'}</span>
        <span class="theme-label">${currentTheme === 'light' ? 'Sáng' : 'Tối'}</span>
      </button>
    `;
    navMenu.appendChild(toggleLi);
  }

  const themeToggleBtn = document.getElementById('theme-toggle');
  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const activeTheme = document.documentElement.getAttribute('data-theme') || 'dark';
      const newTheme = activeTheme === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', newTheme);
      localStorage.setItem('theme', newTheme);

      const iconSpan = themeToggleBtn.querySelector('.theme-icon');
      const labelSpan = themeToggleBtn.querySelector('.theme-label');
      if (iconSpan) iconSpan.innerText = newTheme === 'light' ? '☀️' : '🌙';
      if (labelSpan) labelSpan.innerText = newTheme === 'light' ? 'Sáng' : 'Tối';

      showToast(newTheme === 'light' ? 'Đã chuyển sang chế độ Sáng (Light Mode)' : 'Đã chuyển sang chế độ Tối (Dark Mode)');
    });
  }

  // 2. Mobile Menu Toggle
  const toggleBtn = document.querySelector('.mobile-toggle');
  if (toggleBtn && navMenu) {
    toggleBtn.addEventListener('click', () => {
      navMenu.classList.toggle('active');
    });
  }

  // 3. Navbar Scroll Effect
  const header = document.querySelector('.site-header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      header?.classList.add('scrolled');
    } else {
      header?.classList.remove('scrolled');
    }
  });

  // 4. Toast Notification Helper
  function showToast(message) {
    let toast = document.querySelector('.toast-msg');
    if (!toast) {
      toast = document.createElement('div');
      toast.className = 'toast-msg';
      document.body.appendChild(toast);
    }
    toast.innerHTML = `<span style="color: var(--accent-emerald);">✓</span> <span>${message}</span>`;
    toast.classList.add('show');
    setTimeout(() => {
      toast.classList.remove('show');
    }, 2800);
  }

  // 5. Prompt Copy to Clipboard
  const copyButtons = document.querySelectorAll('.copy-btn');
  copyButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetId = btn.getAttribute('data-target');
      const textToCopy = document.getElementById(targetId)?.innerText;
      if (textToCopy) {
        navigator.clipboard.writeText(textToCopy).then(() => {
          const original = btn.innerText;
          btn.innerText = '✓ Đã sao chép';
          btn.style.background = 'var(--primary)';
          btn.style.color = '#fff';
          showToast('Đã sao chép câu lệnh Prompt vào bộ nhớ tạm!');
          setTimeout(() => {
            btn.innerText = original;
            btn.style.background = '';
            btn.style.color = '';
          }, 2200);
        });
      }
    });
  });

  // 6. Persistent Bottom Audio Player Initialization
  let globalAudio = document.getElementById('global-kvolt-audio');
  if (!globalAudio) {
    globalAudio = document.createElement('audio');
    globalAudio.id = 'global-kvolt-audio';
    globalAudio.src = 'audio/di_cay_88bpm.m4a';
    globalAudio.preload = 'metadata';
    document.body.appendChild(globalAudio);
  }

  // Inject persistent bottom player if not present in HTML
  let bottomPlayer = document.querySelector('.kvolt-bottom-player');
  if (!bottomPlayer) {
    bottomPlayer = document.createElement('div');
    bottomPlayer.className = 'kvolt-bottom-player';
    bottomPlayer.innerHTML = `
      <div class="player-left">
        <div class="player-art">🌾</div>
        <div class="player-meta">
          <h4>Đi cấy (Dân ca Thanh Hóa)</h4>
          <span>Acoustic Lofi · 88 BPM • Bản phối mới AI</span>
        </div>
      </div>
      <div class="player-center">
        <div class="player-controls">
          <button class="player-btn-circle" id="kvolt-play-btn" title="Phát / Dừng bản phối">▶</button>
        </div>
        <div class="player-timeline">
          <span class="player-time" id="kvolt-time-current">0:00</span>
          <div class="player-progress-bar" id="kvolt-progress-track">
            <div class="player-progress-fill" id="kvolt-progress-fill"></div>
          </div>
          <span class="player-time" id="kvolt-time-total">0:34</span>
        </div>
      </div>
      <div class="player-right">
        <a href="audio/di_cay_88bpm.m4a" download class="player-action-btn">⬇ Tải Audio (.m4a)</a>
      </div>
    `;
    document.body.appendChild(bottomPlayer);
  }

  const playBtn = document.getElementById('kvolt-play-btn');
  const progressTrack = document.getElementById('kvolt-progress-track');
  const progressFill = document.getElementById('kvolt-progress-fill');
  const timeCurrent = document.getElementById('kvolt-time-current');
  const timeTotal = document.getElementById('kvolt-time-total');
  const visualizerBars = document.querySelectorAll('.music-visualizer .bar');

  // Also sync with in-page player if present (e.g. on bai-tap-3.html)
  const inPagePlayBtn = document.querySelector('.play-toggle-btn');

  function updatePlayState(isPlaying) {
    if (playBtn) {
      playBtn.innerHTML = isPlaying ? '❚❚' : '▶';
      playBtn.style.boxShadow = isPlaying ? '0 0 20px var(--primary-glow)' : '';
    }
    if (inPagePlayBtn) {
      inPagePlayBtn.innerHTML = isPlaying ? '❚❚' : '▶';
    }
    visualizerBars.forEach(bar => {
      bar.style.animationPlayState = isPlaying ? 'running' : 'paused';
    });
  }

  if (globalAudio) {
    globalAudio.addEventListener('loadedmetadata', () => {
      if (timeTotal && globalAudio.duration) {
        const m = Math.floor(globalAudio.duration / 60);
        const s = Math.floor(globalAudio.duration % 60);
        timeTotal.innerText = `${m}:${s < 10 ? '0' : ''}${s}`;
      }
    });

    globalAudio.addEventListener('timeupdate', () => {
      if (globalAudio.duration) {
        const percent = (globalAudio.currentTime / globalAudio.duration) * 100;
        if (progressFill) progressFill.style.width = percent + '%';
        if (timeCurrent) {
          const m = Math.floor(globalAudio.currentTime / 60);
          const s = Math.floor(globalAudio.currentTime % 60);
          timeCurrent.innerText = `${m}:${s < 10 ? '0' : ''}${s}`;
        }
      }
    });

    globalAudio.addEventListener('ended', () => {
      updatePlayState(false);
      if (progressFill) progressFill.style.width = '0%';
      if (timeCurrent) timeCurrent.innerText = '0:00';
    });

    if (playBtn) {
      playBtn.addEventListener('click', () => {
        if (globalAudio.paused) {
          globalAudio.play().then(() => {
            updatePlayState(true);
            showToast('Đang phát bản phối: Đi cấy (Acoustic Lofi 88 BPM)');
          }).catch(err => {
            console.warn('Audio play error:', err);
          });
        } else {
          globalAudio.pause();
          updatePlayState(false);
          showToast('Đã tạm dừng bản phối');
        }
      });
    }

    if (progressTrack) {
      progressTrack.addEventListener('click', (e) => {
        const rect = progressTrack.getBoundingClientRect();
        const clickPos = (e.clientX - rect.left) / rect.width;
        if (globalAudio.duration) {
          globalAudio.currentTime = clickPos * globalAudio.duration;
        }
      });
    }

    // Connect in-page player button if on Bai tap 3
    if (inPagePlayBtn) {
      inPagePlayBtn.addEventListener('click', () => {
        if (globalAudio.paused) {
          globalAudio.play().then(() => {
            updatePlayState(true);
            showToast('Đang phát bản phối âm thanh: Đi cấy (Acoustic Lofi 88 BPM)');
          });
        } else {
          globalAudio.pause();
          updatePlayState(false);
        }
      });
    }
  }
});
