// ===================================================================
// MODERN ANIMATED INTERACTION SCRIPTS
// ===================================================================

document.addEventListener('DOMContentLoaded', () => {
  // 1. Mobile Menu Toggle
  const toggleBtn = document.querySelector('.mobile-toggle');
  const navMenu = document.querySelector('.nav-menu');
  if (toggleBtn && navMenu) {
    toggleBtn.addEventListener('click', () => {
      navMenu.classList.toggle('active');
    });
  }

  // 2. Scroll Reveal Animations with IntersectionObserver
  const revealElements = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.12,
      rootMargin: '0px 0px -40px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));
  } else {
    // Fallback for older browsers
    revealElements.forEach(el => el.classList.add('active'));
  }

  // 3. Toast Notification Helper
  function showToast(message) {
    let toast = document.querySelector('.toast-msg');
    if (!toast) {
      toast = document.createElement('div');
      toast.className = 'toast-msg';
      document.body.appendChild(toast);
    }
    toast.innerHTML = `<span>✓</span> <span>${message}</span>`;
    toast.classList.add('show');
    setTimeout(() => {
      toast.classList.remove('show');
    }, 2800);
  }

  // 4. Prompt Copy to Clipboard
  const copyButtons = document.querySelectorAll('.copy-btn');
  copyButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetId = btn.getAttribute('data-target');
      const textToCopy = document.getElementById(targetId)?.innerText;
      if (textToCopy) {
        navigator.clipboard.writeText(textToCopy).then(() => {
          const original = btn.innerText;
          btn.innerText = '✓ Đã sao chép';
          btn.style.background = '#10B981';
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

  // 5. Interactive Real Audio Player
  const playBtn = document.querySelector('.play-toggle-btn');
  const audioElement = document.getElementById('audio-player-element');
  const progressTrack = document.querySelector('.progress-track');
  const progressFill = document.querySelector('.progress-fill');
  const timeCurrent = document.querySelector('.time-current');
  const timeTotal = document.querySelector('.time-total');
  const visualizerBars = document.querySelectorAll('.music-visualizer .bar');

  if (playBtn) {
    // If audio element is available
    if (audioElement) {
      audioElement.addEventListener('loadedmetadata', () => {
        if (timeTotal && audioElement.duration) {
          const m = Math.floor(audioElement.duration / 60);
          const s = Math.floor(audioElement.duration % 60);
          timeTotal.innerText = `${m}:${s < 10 ? '0' : ''}${s}`;
        }
      });

      audioElement.addEventListener('timeupdate', () => {
        if (audioElement.duration) {
          const percent = (audioElement.currentTime / audioElement.duration) * 100;
          if (progressFill) progressFill.style.width = percent + '%';

          if (timeCurrent) {
            const m = Math.floor(audioElement.currentTime / 60);
            const s = Math.floor(audioElement.currentTime % 60);
            timeCurrent.innerText = `${m}:${s < 10 ? '0' : ''}${s}`;
          }
        }
      });

      audioElement.addEventListener('ended', () => {
        playBtn.innerHTML = '▶';
        playBtn.style.background = '';
        if (progressFill) progressFill.style.width = '0%';
        if (timeCurrent) timeCurrent.innerText = '0:00';
        visualizerBars.forEach(bar => {
          bar.style.animationPlayState = 'paused';
        });
      });

      // Seeking when clicking progress bar
      if (progressTrack) {
        progressTrack.addEventListener('click', (e) => {
          const rect = progressTrack.getBoundingClientRect();
          const clickPos = (e.clientX - rect.left) / rect.width;
          if (audioElement.duration) {
            audioElement.currentTime = clickPos * audioElement.duration;
          }
        });
      }

      playBtn.addEventListener('click', () => {
        if (audioElement.paused) {
          audioElement.play().then(() => {
            playBtn.innerHTML = '❚❚';
            playBtn.style.background = 'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)';
            showToast('Đang phát bản phối âm thanh: Đi cấy (Acoustic Lofi 88 BPM)');
            visualizerBars.forEach(bar => {
              bar.style.animationPlayState = 'running';
            });
          }).catch((err) => {
            console.error('Audio playback error:', err);
            showToast('Vui lòng cấp quyền phát âm thanh trên trình duyệt.');
          });
        } else {
          audioElement.pause();
          playBtn.innerHTML = '▶';
          playBtn.style.background = '';
          showToast('Đã tạm dừng bản phối âm thanh');
          visualizerBars.forEach(bar => {
            bar.style.animationPlayState = 'paused';
          });
        }
      });
    }
  }

  // 6. Interactive Dropzone Click
  const dropzones = document.querySelectorAll('.upload-placeholder');
  dropzones.forEach(zone => {
    zone.addEventListener('click', () => {
      showToast('Khung giữ chỗ: Bạn có thể thay thế bằng ảnh chụp màn hình thực tế của bạn.');
    });
  });
});
