document.addEventListener('DOMContentLoaded', () => {
  const $ = id => document.getElementById(id);

  const screens = ['monthScreen', 'welcomeScreen', 'birthdayScreen'].map($);
  const monthList = $('monthList');

  const months = [
    'January', 'February', 'March', 'April',
    'May', 'June', 'July', 'August',
    'September', 'October', 'November', 'December'
  ];

  let monthDone = false;
  let blown = false;
  let listening = false;

  let stream = null;
  let context = null;
  let analyser = null;
  let raf = null;

  function showScreen(target) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    target.classList.add('active');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // Build the month list.
  months.forEach(m => {
    const el = document.createElement('div');
    el.className = 'month-item' + (m === 'November' ? ' selected' : '');
    el.textContent = m;
    monthList.appendChild(el);
  });

  function finishMonths() {
    if (monthDone) return;

    monthDone = true;

    const item = monthList.querySelector('.month-item');
    const index = months.indexOf('November');
    const h = item ? item.getBoundingClientRect().height : 50;
    const windowEl = document.querySelector('.month-window');

    const offset = windowEl.clientHeight / 2 - h * index - h / 2;

    monthList.style.transition = 'transform 1.2s cubic-bezier(.2,.7,.2,1)';
    monthList.style.transform = `translateY(${offset}px)`;

    document.querySelector('.date-reveal').classList.add('show');

    $('monthCaption').textContent =
      'November 7 — the day we celebrate you.';

    $('continueBtn').disabled = false;
  }

  // Month intro animation.
  monthList.style.transform = 'translateY(0)';

  window.setTimeout(finishMonths, 1000);

  $('skipBtn').addEventListener('click', finishMonths);

  $('continueBtn').addEventListener('click', () => {
    showScreen($('welcomeScreen'));
  });

  // Background music.
  function startMusic() {
    const music = $('bgMusic');

    music.volume = 0.45;

    music.play()
      .then(() => $('musicLabel').textContent = 'Playing')
      .catch(() => $('musicLabel').textContent = 'Tap to play');
  }

  $('startBtn').addEventListener('click', () => {
    startMusic();

    showScreen($('birthdayScreen'));

    releaseButterflies(15);
    hearts(18);
    confetti(45);

    $('sceneLabel').textContent =
      'A little birthday surprise is here. ♡';

    $('cinemaCaption').textContent =
      'For the friend who makes life brighter.';
  });

  $('musicBtn').addEventListener('click', () => {
    const music = $('bgMusic');

    if (music.paused) {
      startMusic();
    } else {
      music.pause();
      $('musicLabel').textContent = 'Paused';
    }
  });

  // Live countdown to November 7.
  function updateHeroCountdown() {
    const now = new Date();

    const isBirthday =
      now.getMonth() === 10 && now.getDate() === 7;

    const targetYear =
      (now.getMonth() > 10 ||
      (now.getMonth() === 10 && now.getDate() > 7))
        ? now.getFullYear() + 1
        : now.getFullYear();

    const target = new Date(targetYear, 10, 7, 0, 0, 0);

    const remaining = Math.max(0, target.getTime() - now.getTime());

    const days = Math.floor(remaining / 86400000);
    const hours = Math.floor((remaining % 86400000) / 3600000);
    const minutes = Math.floor((remaining % 3600000) / 60000);
    const seconds = Math.floor((remaining % 60000) / 1000);

    const put = (id, value) => {
      const node = $(id);

      if (node) {
        node.textContent = String(value).padStart(2, '0');
      }
    };

    if (isBirthday) {
      $('heroCountdown').innerHTML =
        '<span class="countdown-kicker">TODAY IS YOUR DAY</span>' +
        '<div class="countdown-birthday">A whole day to celebrate YOU ♡</div>';

      return;
    }

    put('countDays', days);
    put('countHours', hours);
    put('countMinutes', minutes);
    put('countSeconds', seconds);
  }

  updateHeroCountdown();
  setInterval(updateHeroCountdown, 1000);

  // Secret letter popup.
  const heroLetterModal = $('heroLetterModal');
  const heroLetterBtn = $('heroLetterBtn');

  const closeHeroLetter = () => {
    heroLetterModal.classList.remove('open');
    heroLetterModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  };

  if (heroLetterBtn && heroLetterModal) {
    heroLetterBtn.addEventListener('click', () => {
      heroLetterModal.classList.add('open');
      heroLetterModal.setAttribute('aria-hidden', 'false');

      document.body.style.overflow = 'hidden';

      $('closeHeroLetter').focus();

      hearts(12);
    });

    $('closeHeroLetter').addEventListener('click', closeHeroLetter);

    heroLetterModal
      .querySelectorAll('[data-close-letter]')
      .forEach(el => el.addEventListener('click', closeHeroLetter));

    document.addEventListener('keydown', e => {
      if (
        e.key === 'Escape' &&
        heroLetterModal.classList.contains('open')
      ) {
        closeHeroLetter();
      }
    });
  }

  // Jump directly to the photo gallery.
  const memoryJumpBtn = $('memoryJumpBtn');

  if (memoryJumpBtn) {
    memoryJumpBtn.addEventListener('click', () => {
      $('memoryGallery').scrollIntoView({
        behavior: 'smooth',
        block: 'center'
      });

      $('memoryUpload').focus({ preventScroll: true });
    });
  }

  // Floating hearts.
  function hearts(n = 1) {
    const host = $('hearts');

    for (let i = 0; i < n; i++) {
      const el = document.createElement('span');

      el.className = 'floating-heart';

      el.textContent = ['♡', '♥', '✧', '✦'][
        Math.floor(Math.random() * 4)
      ];

      el.style.left = Math.random() * 100 + '%';
      el.style.fontSize = (13 + Math.random() * 19) + 'px';
      el.style.animationDuration = (5 + Math.random() * 5) + 's';

      host.appendChild(el);

      setTimeout(() => el.remove(), 11000);
    }
  }

  setInterval(() => {
    if (!document.hidden) hearts();
  }, 1000);

  // Confetti.
  function confetti(n = 80) {
    const host = $('confetti');

    const colors = [
      '#f2a5c8',
      '#ffe5f1',
      '#e6c68d',
      '#fff7fb',
      '#bb6d9c'
    ];

    for (let i = 0; i < n; i++) {
      const el = document.createElement('i');

      el.className = 'confetti-piece';

      el.style.left = Math.random() * 100 + '%';

      el.style.background =
        colors[Math.floor(Math.random() * colors.length)];

      el.style.animationDuration = (2.5 + Math.random() * 3) + 's';
      el.style.animationDelay = Math.random() + 's';

      host.appendChild(el);

      setTimeout(() => el.remove(), 6500);
    }
  }

  // Stop microphone safely.
  function stopMic() {
    listening = false;

    if (raf) cancelAnimationFrame(raf);
    raf = null;

    if (stream) {
      stream.getTracks().forEach(t => t.stop());
      stream = null;
    }

    if (context) {
      context.close().catch(() => {});
      context = null;
    }

    analyser = null;
  }

  // Firework sound effect.
  function playFireworkPop(audioContext, frequency = 110) {
    if (!audioContext) return;

    try {
      const duration = 0.22;

      const buffer = audioContext.createBuffer(
        1,
        Math.floor(audioContext.sampleRate * duration),
        audioContext.sampleRate
      );

      const data = buffer.getChannelData(0);

      for (let i = 0; i < data.length; i++) {
        const fade = 1 - i / data.length;
        data[i] = (Math.random() * 2 - 1) * fade * fade;
      }

      const noise = audioContext.createBufferSource();
      noise.buffer = buffer;

      const filter = audioContext.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.value = 1400 + Math.random() * 1000;

      const gain = audioContext.createGain();

      gain.gain.setValueAtTime(.0001, audioContext.currentTime);
      gain.gain.exponentialRampToValueAtTime(
        .16,
        audioContext.currentTime + .015
      );

      gain.gain.exponentialRampToValueAtTime(
        .0001,
        audioContext.currentTime + duration
      );

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(audioContext.destination);

      noise.start();
      noise.stop(audioContext.currentTime + duration);

      const tone = audioContext.createOscillator();
      const toneGain = audioContext.createGain();

      tone.type = 'sine';

      tone.frequency.setValueAtTime(
        frequency,
        audioContext.currentTime
      );

      tone.frequency.exponentialRampToValueAtTime(
        38,
        audioContext.currentTime + .28
      );

      toneGain.gain.setValueAtTime(.0001, audioContext.currentTime);

      toneGain.gain.exponentialRampToValueAtTime(
        .12,
        audioContext.currentTime + .02
      );

      toneGain.gain.exponentialRampToValueAtTime(
        .0001,
        audioContext.currentTime + .3
      );

      tone.connect(toneGain);
      toneGain.connect(audioContext.destination);

      tone.start();
      tone.stop(audioContext.currentTime + .31);

    } catch (error) {
      // Sound is decorative; the visual show still works.
    }
  }

  // Fireworks animation.
  function launchFireworks() {
    const overlay = $('fireworksOverlay');
    const canvas = $('fireworksCanvas');
    const countdown = $('fireworksCountdown');
    const message = $('fireworksMessage');

    if (!overlay || !canvas || overlay.dataset.started === 'yes') return;

    overlay.dataset.started = 'yes';
    overlay.classList.add('show');
    overlay.setAttribute('aria-hidden', 'false');

    const ctx = canvas.getContext('2d');

    if (!ctx) return;

    let width = 0;
    let height = 0;
    let particles = [];
    let rockets = [];
    let frame = 0;
    let running = true;

    const colors = [
      '#ffe5a8',
      '#ffc36e',
      '#ff8ebd',
      '#f7d7ff',
      '#a9ddff',
      '#fff7e8'
    ];

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);

      width = window.innerWidth;
      height = window.innerHeight;

      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);

      canvas.style.width = width + 'px';
      canvas.style.height = height + 'px';

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    resize();

    window.addEventListener('resize', resize);

    let soundContext = null;

    try {
      const AudioCtor = window.AudioContext || window.webkitAudioContext;

      if (AudioCtor) {
        soundContext = new AudioCtor();
        soundContext.resume().catch(() => {});
      }
    } catch (error) {
      soundContext = null;
    }

    function burst(x, y, power = 1) {
      const color = colors[Math.floor(Math.random() * colors.length)];
      const count = Math.floor(65 * power);

      for (let i = 0; i < count; i++) {
        const angle =
          Math.PI * 2 * i / count + Math.random() * .12;

        const speed = (1.3 + Math.random() * 4.3) * power;

        particles.push({
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          life: 55 + Math.random() * 35,
          max: 90,
          size: 1 + Math.random() * 2.4,
          color,
          trail: Math.random() > .55
        });
      }

      playFireworkPop(soundContext, 90 + Math.random() * 70);
    }

    function rocket(x, targetY) {
      rockets.push({
        x,
        y: height + 12,
        targetY,
        vy: -8 - Math.random() * 2,
        color: colors[Math.floor(Math.random() * colors.length)]
      });
    }

    let launchTimers = [];

    const schedule = (fn, delay) => {
      launchTimers.push(setTimeout(fn, delay));
    };

    const reduced =
      window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const sequence = ['3', '2', '1'];

    sequence.forEach((number, i) => {
      schedule(() => {
        countdown.textContent = number;
        countdown.classList.remove('pop');
        void countdown.offsetWidth;
        countdown.classList.add('pop');
      }, i * 850);
    });

    schedule(() => {
      countdown.classList.remove('pop');
      message.classList.add('show');

      if (reduced) {
        burst(width * .25, height * .28, .8);
        burst(width * .75, height * .25, .8);
        return;
      }

      for (let i = 0; i < 10; i++) {
        schedule(() => {
          rocket(
            width * (.12 + Math.random() * .76),
            height * (.16 + Math.random() * .42)
          );
        }, i * 420);
      }

      schedule(() => {
        burst(width * .5, height * .28, 1.25);
        burst(width * .22, height * .38, .85);
        burst(width * .78, height * .34, .9);
      }, 4300);

    }, 2750);

    function animate() {
      if (!running) return;

      frame = requestAnimationFrame(animate);

      ctx.fillStyle = 'rgba(5,3,8,.19)';
      ctx.fillRect(0, 0, width, height);

      rockets = rockets.filter(r => r.y > r.targetY);

      rockets.forEach(r => {
        r.y += r.vy;
        r.vy *= .99;

        ctx.beginPath();
        ctx.moveTo(r.x, r.y + 18);
        ctx.lineTo(r.x, r.y);

        ctx.strokeStyle = r.color;
        ctx.lineWidth = 2;
        ctx.shadowBlur = 12;
        ctx.shadowColor = r.color;
        ctx.stroke();
        ctx.shadowBlur = 0;

        if (r.y <= r.targetY) {
          burst(r.x, r.y, .85 + Math.random() * .35);
        }
      });

      particles = particles.filter(p => p.life > 0);

      particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += .035;
        p.vx *= .992;
        p.vy *= .992;
        p.life--;

        const alpha = Math.max(0, p.life / p.max);

        ctx.globalAlpha = alpha;
        ctx.fillStyle = p.color;
        ctx.shadowBlur = 9;
        ctx.shadowColor = p.color;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();

        if (p.trail && p.life % 3 === 0) {
          ctx.globalAlpha = alpha * .35;
          ctx.fillRect(p.x - 1, p.y - 5, 2, 5);
        }
      });

      ctx.globalAlpha = 1;
      ctx.shadowBlur = 0;
    }

    animate();

    schedule(() => {
      running = false;

      cancelAnimationFrame(frame);

      window.removeEventListener('resize', resize);

      if (soundContext) {
        soundContext.close().catch(() => {});
      }

      overlay.classList.remove('show');
      overlay.setAttribute('aria-hidden', 'true');
      overlay.dataset.started = 'finished';

      setTimeout(() => {
        overlay.style.display = 'none';
        releaseLanterns(11);
        releaseButterflies(8);
      }, 900);

    }, 14500);
  }

  // Blow out birthday candles.
  function blowCandles() {
    if (blown) return;

    blown = true;

    stopMic();

    document.querySelectorAll('.candle').forEach((c, i) => {
      setTimeout(() => c.classList.add('out'), i * 180);
    });

    $('wishControls').classList.add('hidden');
    $('wishMade').classList.remove('hidden');

    confetti(120);
    hearts(25);

    launchFireworks();
  }

  $('blowBtn').addEventListener('click', blowCandles);

  // Microphone candle blowing.
  $('micBtn').addEventListener('click', async () => {
    if (blown || listening) return;

    if (!navigator.mediaDevices?.getUserMedia) {
      $('micStatus').textContent =
        'Microphone needs HTTPS or localhost. Use the manual button instead.';
      return;
    }

    try {
      $('micStatus').textContent =
        'Please allow microphone access…';

      stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: false,
          noiseSuppression: false,
          autoGainControl: false
        }
      });

      const AC = window.AudioContext || window.webkitAudioContext;

      context = new AC();
      await context.resume();

      analyser = context.createAnalyser();
      analyser.fftSize = 1024;
      analyser.smoothingTimeConstant = .15;

      context.createMediaStreamSource(stream).connect(analyser);

      const samples = new Uint8Array(analyser.fftSize);

      let loud = 0;
      listening = true;

      $('micBtn').innerHTML = 'Listening — blow now <span>◉</span>';
      $('micStatus').textContent = 'Blow gently toward your microphone. 💨';

      function detect() {
        if (!listening || blown || !analyser) return;

        analyser.getByteTimeDomainData(samples);

        let sum = 0;

        for (const x of samples) {
          const v = (x - 128) / 128;
          sum += v * v;
        }

        const volume = Math.sqrt(sum / samples.length);

        loud = volume > .13 ? loud + 1 : Math.max(0, loud - 1);

        if (loud >= 6) return blowCandles();

        raf = requestAnimationFrame(detect);
      }

      detect();

    } catch (e) {
      stopMic();

      $('micStatus').textContent =
        'Microphone access failed. Allow it in your browser or use the manual button.';

      $('micBtn').innerHTML = 'Try microphone again <span>◉</span>';
    }
  });

  // Open the main birthday letter.
  $('letterBtn').addEventListener('click', () => {
    $('letterSection').classList.remove('hidden');

    $('letterSection').scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    });

    confetti(30);
  });

  $('backBtn').addEventListener('click', () => {
    $('letterSection').classList.add('hidden');

    $('birthdayScreen').scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    });
  });

  // Interactive gift box.
  const giftScene = $('giftScene');

  function openGift() {
    if (!giftScene || giftScene.classList.contains('opened')) return;

    giftScene.classList.add('opened');

    $('giftReveal').classList.remove('hidden');

    confetti(45);
    hearts(18);
  }

  if (giftScene) {
    giftScene.addEventListener('click', openGift);

    giftScene.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openGift();
      }
    });
  }

  // Keep the wish private to this page.
  const wishForm = $('secretWishForm');

  if (wishForm) {
    wishForm.addEventListener('submit', e => {
      e.preventDefault();

      const input = $('secretWishInput');
      const wish = input.value.trim();

      if (!wish) return;

      $('secretWishResult').textContent =
        'Your wish is sent to the stars. Keep believing. ✨';

      input.value = '';

      confetti(35);
      hearts(15);
    });
  }

  // Butterflies appear after the birthday experience begins.
  function releaseButterflies(total = 12) {
    const layer = $('ambientMagic');

    if (!layer) return;

    const glyphs = ['🦋', '🦋', '✧'];

    for (let i = 0; i < total; i++) {
      setTimeout(() => {
        const item = document.createElement('span');

        item.className = 'butterfly';

        item.textContent =
          glyphs[Math.floor(Math.random() * glyphs.length)];

        item.style.left = (5 + Math.random() * 90) + '%';

        item.style.setProperty(
          '--flight',
          (14 + Math.random() * 9) + 's'
        );

        item.style.setProperty(
          '--drift',
          (Math.random() * 150 - 75) + 'px'
        );

        layer.appendChild(item);

        setTimeout(() => item.remove(), 24000);

      }, i * 650);
    }
  }

  // Release glowing sky lanterns.
  function releaseLanterns(total = 9) {
    const layer = $('lanternLayer');

    if (!layer) return;

    for (let i = 0; i < total; i++) {
      setTimeout(() => {
        const lantern = document.createElement('span');

        lantern.className = 'sky-lantern';

        lantern.style.left = (5 + Math.random() * 90) + '%';

        lantern.style.setProperty(
          '--rise',
          (15 + Math.random() * 8) + 's'
        );

        lantern.style.setProperty(
          '--sway',
          (Math.random() * 100 - 50) + 'px'
        );

        lantern.style.setProperty(
          '--tilt',
          (Math.random() * 20 - 10) + 'deg'
        );

        layer.appendChild(lantern);

        setTimeout(() => lantern.remove(), 25000);

      }, i * 850);
    }
  }

  // Tap a star to reveal a friendship message.
  document.querySelectorAll('.shooting-star').forEach(star => {
    star.addEventListener('click', () => {
      $('starMessage').textContent = star.dataset.message;

      star.classList.add('revealed');

      confetti(18);
    });
  });

  // Local photo previews.
  // Selected images are not uploaded anywhere.
  const memoryUpload = $('memoryUpload');

  if (memoryUpload) {
    memoryUpload.addEventListener('change', () => {
      const gallery = $('memoryGallery');

      const files = Array.from(memoryUpload.files || [])
        .filter(file => file.type.startsWith('image/'))
        .slice(0, 12);

      if (!files.length) return;

      gallery.innerHTML = '';

      files.forEach((file, index) => {
        const card = document.createElement('figure');

        card.className = 'memory-photo';

        card.style.setProperty(
          '--tilt',
          (Math.random() * 3 - 1.5) + 'deg'
        );

        const img = document.createElement('img');

        img.alt = 'Birthday memory ' + (index + 1);
        img.src = URL.createObjectURL(file);

        img.onload = () => URL.revokeObjectURL(img.src);

        const caption = document.createElement('span');

        caption.textContent = 'A memory to keep ♡';

        card.append(img, caption);

        gallery.appendChild(card);
      });
    });
  }

  // Reveal the final hidden birthday message.
  const lastSurpriseBtn = $('lastSurpriseBtn');

  if (lastSurpriseBtn) {
    lastSurpriseBtn.addEventListener('click', () => {
      $('lastSurpriseMessage').classList.remove('hidden');

      lastSurpriseBtn.textContent =
        'A little note, just for you ♡';

      lastSurpriseBtn.disabled = true;

      hearts(22);
      confetti(45);
    });
  }

  window.addEventListener('pagehide', stopMic);
});