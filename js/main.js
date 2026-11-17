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

  // 6. In-Page Audio Player (for Bai tap 3 - không gim cố định ở chân trang)
  const inPageAudio = document.getElementById('audio-player-element');
  const inPagePlayBtn = document.querySelector('.play-toggle-btn');
  const inPageProgressTrack = document.querySelector('.progress-track');
  const inPageProgressFill = document.querySelector('.progress-fill');
  const inPageTimeCurrent = document.querySelector('.time-current');
  const inPageTimeTotal = document.querySelector('.time-total');
  const visualizerBars = document.querySelectorAll('.music-visualizer .bar');

  if (inPageAudio && inPagePlayBtn) {
    function updateInPageState(isPlaying) {
      inPagePlayBtn.innerHTML = isPlaying ? '❚❚' : '▶';
      visualizerBars.forEach(bar => {
        bar.style.animationPlayState = isPlaying ? 'running' : 'paused';
      });
    }

    inPagePlayBtn.addEventListener('click', () => {
      if (inPageAudio.paused) {
        inPageAudio.play().then(() => {
          updateInPageState(true);
          showToast('Đang phát bản phối: Đi cấy (Acoustic Lofi 88 BPM)');
        }).catch(err => {
          console.warn('Audio play error:', err);
        });
      } else {
        inPageAudio.pause();
        updateInPageState(false);
        showToast('Đã tạm dừng bản phối');
      }
    });

    inPageAudio.addEventListener('loadedmetadata', () => {
      if (inPageTimeTotal && inPageAudio.duration) {
        const m = Math.floor(inPageAudio.duration / 60);
        const s = Math.floor(inPageAudio.duration % 60);
        inPageTimeTotal.innerText = `${m}:${s < 10 ? '0' : ''}${s}`;
      }
    });

    inPageAudio.addEventListener('timeupdate', () => {
      if (inPageAudio.duration) {
        const percent = (inPageAudio.currentTime / inPageAudio.duration) * 100;
        if (inPageProgressFill) inPageProgressFill.style.width = percent + '%';
        if (inPageTimeCurrent) {
          const m = Math.floor(inPageAudio.currentTime / 60);
          const s = Math.floor(inPageAudio.currentTime % 60);
          inPageTimeCurrent.innerText = `${m}:${s < 10 ? '0' : ''}${s}`;
        }
      }
    });

    inPageAudio.addEventListener('ended', () => {
      updateInPageState(false);
      if (inPageProgressFill) inPageProgressFill.style.width = '0%';
      if (inPageTimeCurrent) inPageTimeCurrent.innerText = '0:00';
    });

    if (inPageProgressTrack) {
      inPageProgressTrack.addEventListener('click', (e) => {
        const rect = inPageProgressTrack.getBoundingClientRect();
        const clickPos = (e.clientX - rect.left) / rect.width;
        if (inPageAudio.duration) {
          inPageAudio.currentTime = clickPos * inPageAudio.duration;
        }
      });
    }
  }
});
