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

  // 5. Interactive Audio Player Simulation
  const playBtn = document.querySelector('.play-toggle-btn');
  const progressFill = document.querySelector('.progress-fill');
  const timeCurrent = document.querySelector('.time-current');
  const visualizerBars = document.querySelectorAll('.music-visualizer .bar');
  let isPlaying = false;
  let progress = 35;
  let intervalId = null;

  if (playBtn) {
    playBtn.addEventListener('click', () => {
      isPlaying = !isPlaying;
      if (isPlaying) {
        playBtn.innerHTML = '❚❚';
        playBtn.style.background = 'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)';
        showToast('Đang phát bản phối thử nghiệm AI: Lí kéo chài (108 BPM)');
        
        // Start simulated progress
        intervalId = setInterval(() => {
          progress += 0.5;
          if (progress > 100) progress = 0;
          if (progressFill) progressFill.style.width = progress + '%';
          
          if (timeCurrent) {
            const totalSec = Math.floor((progress / 100) * 165);
            const mins = Math.floor(totalSec / 60);
            const secs = totalSec % 60;
            timeCurrent.innerText = `${mins}:${secs < 10 ? '0' : ''}${secs}`;
          }
        }, 500);

        // Animate visualizer
        visualizerBars.forEach(bar => {
          bar.style.animationPlayState = 'running';
        });
      } else {
        playBtn.innerHTML = '▶';
        playBtn.style.background = '';
        clearInterval(intervalId);
        showToast('Đã tạm dừng bản phối');
        visualizerBars.forEach(bar => {
          bar.style.animationPlayState = 'paused';
        });
      }
    });
  }

  // 6. Interactive Dropzone Click
  const dropzones = document.querySelectorAll('.upload-placeholder');
  dropzones.forEach(zone => {
    zone.addEventListener('click', () => {
      showToast('Khung giữ chỗ: Bạn có thể thay thế bằng ảnh chụp màn hình thực tế của bạn.');
    });
  });
});
