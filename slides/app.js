// Slide navigation
    const slides = [...document.querySelectorAll('.slide')];
    let current = 0;
    function goTo(index) {
      if (index < 0 || index >= slides.length) return;
      slides[current].classList.remove('active');
      slides[index].classList.add('active');
      current = index;
      updateProgress();
      updateCounter();
      updateNotes();
    }
    document.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowRight' || e.key === ' ') {
        e.preventDefault();
        goTo(current + 1);
      }
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        goTo(current - 1);
      }
      if (e.key.toLowerCase() === 'f') toggleFullscreen();
      if (e.key.toLowerCase() === 's') toggleNotes();
    });
    // Touch/swipe
    let touchStartX = 0;
    document.addEventListener('touchstart', (e) => {
      touchStartX = e.touches[0].clientX;
    });
    document.addEventListener('touchend', (e) => {
      const diff = touchStartX - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 50) diff > 0 ? goTo(current + 1) : goTo(current - 1);
    });

    function updateProgress() {
      document.getElementById('progress').style.width = (current / (slides.length - 1) * 100) + '%';
    }

    function updateCounter() {
      document.getElementById('counter').textContent = (current + 1) + ' / ' + slides.length;
    }

    function toggleFullscreen() {
      if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen();
      } else {
        document.exitFullscreen();
      }
    }

    let notesWindow = null;
    function toggleNotes() {
      if (notesWindow && !notesWindow.closed) {
        notesWindow.close();
        notesWindow = null;
        return;
      }
      notesWindow = window.open('', 'SpeakerNotes', 'width=520,height=420,top=80,left=80');
      notesWindow.document.write(`
        <!doctype html>
        <html>
          <head>
            <meta charset="utf-8">
            <title>Speaker Notes</title>
            <style>
              body { margin: 0; padding: 22px; background: #111; color: #f0f0f0; font: 18px/1.6 system-ui, sans-serif; }
              #sn { color: #60a5fa; font: 700 13px/1.4 monospace; letter-spacing: .04em; text-transform: uppercase; }
              #nt { white-space: pre-wrap; margin-top: 18px; }
            </style>
          </head>
          <body>
            <div id="sn">Slide</div>
            <div id="nt"></div>
          </body>
        </html>
      `);
      notesWindow.document.close();
      updateNotes();
    }

    function updateNotes() {
      if (!notesWindow || notesWindow.closed) return;
      try {
        const note = slides[current].dataset.notes || '(No notes)';
        notesWindow.document.getElementById('nt').textContent = note;
        notesWindow.document.getElementById('sn').textContent = 'Slide ' + (current + 1) + ' / ' + slides.length;
      } catch(e) {}
    }

    function initMagnetLines() {
      const containers = [...document.querySelectorAll('.magnet-lines')];
      containers.forEach((container) => {
        const rows = Number(container.dataset.rows || 10);
        const columns = Number(container.dataset.columns || 12);
        const baseAngle = Number(container.dataset.baseAngle || -10);
        container.style.gridTemplateColumns = `repeat(${columns}, 1fr)`;
        container.style.gridTemplateRows = `repeat(${rows}, 1fr)`;
        container.replaceChildren(...Array.from({ length: rows * columns }, () => {
          const line = document.createElement('span');
          line.style.setProperty('--rotate', `${baseAngle}deg`);
          return line;
        }));

        const items = [...container.querySelectorAll('span')];
        const rotateToPointer = (pointer) => {
          items.forEach((item) => {
            const rect = item.getBoundingClientRect();
            const centerX = rect.x + rect.width / 2;
            const centerY = rect.y + rect.height / 2;
            const b = pointer.x - centerX;
            const a = pointer.y - centerY;
            const c = Math.sqrt(a * a + b * b) || 1;
            const angle = ((Math.acos(b / c) * 180) / Math.PI) * (pointer.y > centerY ? 1 : -1);
            item.style.setProperty('--rotate', `${angle}deg`);
          });
        };

        window.addEventListener('pointermove', rotateToPointer);
        requestAnimationFrame(() => {
          const rect = container.getBoundingClientRect();
          rotateToPointer({ x: rect.left + rect.width * 0.58, y: rect.top + rect.height * 0.42 });
        });
      });
    }

    initMagnetLines();
    updateProgress();
    updateCounter();
