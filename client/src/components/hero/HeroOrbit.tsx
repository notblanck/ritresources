import React, { useEffect, useRef } from 'react';

const DEG = Math.PI / 180;
const SQUASH = 0.52;

const ICONS: Record<string, string> = {
  folder: '<path d="M3 7a2 2 0 0 1 2-2h4l2 2h6a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7z"/>',
  clipboard: '<rect x="5" y="4" width="14" height="17" rx="2"/><path d="M9 4h6v2H9z"/><path d="M8 11h8M8 15h5"/>',
  fileText: '<path d="M6 3h9l5 5v13H6z"/><path d="M9 12h6M9 16h6"/>',
  star: '<path d="M12 2l2.9 6.6 7.1.6-5.4 4.7 1.7 7-6.3-3.8L5.7 21l1.7-7L2 9.2l7.1-.6z"/>',
  code: '<path d="M9 6l-6 6 6 6M15 6l6 6-6 6"/>',
  cloud: '<path d="M7 18a5 5 0 0 1-1-9.9A6 6 0 0 1 18 8a4.5 4.5 0 0 1-.5 9H7z"/><path d="M12 12v6M9 15l3-3 3 3"/>',
  search: '<circle cx="10" cy="10" r="6"/><path d="M20 20l-5-5"/>',
  cap: '<path d="M2 8l10-5 10 5-10 5-10-5z"/><path d="M6 11v5c0 1.5 2.7 3 6 3s6-1.5 6-3v-5"/><path d="M22 8v6"/>',
  book: '<path d="M12 6c-2-1.5-5-2-8-1v13c3-1 6-.5 8 1 2-1.5 5-2 8-1V5c-3-1-6-.5-8 1z"/>'
};

function renderSvg(pathKey: string, stroke: string): string {
  return `<svg viewBox="0 0 24 24" fill="none" stroke="${stroke}" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${ICONS[pathKey] || ''}</svg>`;
}

export const HeroOrbit: React.FC = () => {
  const stageRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const stage = stageRef.current;
    if (!canvas || !stage) return;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const getRadiusScale = () => {
      const w = window.innerWidth;
      if (w <= 360) return 0.52;
      if (w <= 420) return 0.58;
      if (w <= 480) return 0.65;
      if (w <= 640) return 0.74;
      if (w <= 980) return 0.85;
      return 1.0;
    };
    let radiusScale = getRadiusScale();

    const handleResize = () => {
      radiusScale = getRadiusScale();
    };
    window.addEventListener('resize', handleResize);

    const items = [
      { label: 'NOTES', icon: 'folder', radius: 225, speed: 0.10, phase: 0 * DEG, bobAmp: 8, bobSpeed: 1.3, color: '#1E4FDB', el: null as HTMLDivElement | null },
      { label: 'ASSIGNMENTS', icon: 'clipboard', radius: 225, speed: 0.10, phase: 72 * DEG, bobAmp: 7, bobSpeed: 1.1, color: '#3D8BFF', el: null as HTMLDivElement | null },
      { label: 'PYQ PAPERS', icon: 'fileText', radius: 225, speed: 0.10, phase: 144 * DEG, bobAmp: 9, bobSpeed: 1.4, color: '#1E4FDB', el: null as HTMLDivElement | null },
      { label: 'IMPORTANT QUESTIONS', icon: 'star', radius: 225, speed: 0.10, phase: 216 * DEG, bobAmp: 6, bobSpeed: 1.2, color: '#FF8A00', el: null as HTMLDivElement | null },
      { label: 'CODING RESOURCES', icon: 'code', radius: 225, speed: 0.10, phase: 288 * DEG, bobAmp: 8, bobSpeed: 1.0, color: '#3D8BFF', el: null as HTMLDivElement | null }
    ];

    const support = [
      { icon: 'cloud', radius: 290, speed: -0.055, phase: 35 * DEG, bobAmp: 10, bobSpeed: 0.8, el: null as HTMLDivElement | null },
      { icon: 'search', radius: 290, speed: -0.055, phase: 150 * DEG, bobAmp: 9, bobSpeed: 0.9, el: null as HTMLDivElement | null },
      { icon: 'cap', radius: 270, speed: -0.055, phase: 250 * DEG, bobAmp: 8, bobSpeed: 0.7, el: null as HTMLDivElement | null },
      { icon: 'book', radius: 270, speed: -0.055, phase: 330 * DEG, bobAmp: 9, bobSpeed: 1.0, el: null as HTMLDivElement | null }
    ];

    const colors: Record<string, string> = { orange: '#FF8A00', blue: '#3D8BFF', silver: '#C7CEDC' };
    const pColorOrder = ['orange', 'blue', 'silver', 'blue', 'silver', 'orange', 'blue', 'silver', 'orange', 'blue', 'silver', 'blue'];
    const particles = pColorOrder.map((cKey, i) => ({
      color: colors[cKey],
      radius: 200 + (i % 4) * 35 + ((i * 7) % 20),
      speed: 0.02 + (i % 5) * 0.01,
      phase: (i * 137.5) * DEG,
      size: 5 + (i % 3) * 3,
      el: null as HTMLDivElement | null
    }));

    function buildOrbitEl(cls: string, iconKey: string, iconStroke: string, label: string | null) {
      const wrap = document.createElement('div');
      wrap.className = 'orbit-item' + (cls ? ' ' + cls : '');
      const card = document.createElement('div');
      card.className = 'card';
      const box = document.createElement('div');
      box.className = 'icon-box';
      box.innerHTML = renderSvg(iconKey, iconStroke);
      card.appendChild(box);
      if (label) {
        const chip = document.createElement('div');
        chip.className = 'chip';
        chip.textContent = label;
        card.appendChild(chip);
      }
      wrap.appendChild(card);
      canvas!.appendChild(wrap);
      return wrap;
    }

    items.forEach((it) => {
      it.el = buildOrbitEl('', it.icon, it.color, it.label);
    });

    support.forEach((it) => {
      it.el = buildOrbitEl('support', it.icon, '#3D8BFF', null);
    });

    particles.forEach((p) => {
      const el = document.createElement('div');
      el.className = 'particle';
      el.style.width = p.size + 'px';
      el.style.height = p.size + 'px';
      el.style.background = p.color;
      el.style.boxShadow = '0 0 8px ' + p.color + '99';
      canvas!.appendChild(el);
      p.el = el;
    });

    function place(el: HTMLDivElement | null, x: number, y: number, scale: number, frontOfMedallion: boolean) {
      if (!el) return;
      el.style.transform = `translate(${x}px,${y}px) scale(${scale})`;
      el.style.zIndex = frontOfMedallion ? '12' : '4';
    }

    let animationFrameId: number;

    function render(t: number) {
      const time = t / 1000;

      items.forEach((it) => {
        const angle = it.phase + time * it.speed;
        const currentRadius = it.radius * radiusScale;
        const x = Math.cos(angle) * currentRadius;
        const yBase = Math.sin(angle) * currentRadius * SQUASH;
        const bob = Math.sin(time * it.bobSpeed + it.phase) * (it.bobAmp * radiusScale);
        const y = yBase + bob;
        const front = Math.sin(angle) > -0.15;
        const baseScale = radiusScale < 0.7 ? 0.65 : 0.8;
        const scale = (baseScale + 0.22 * ((Math.sin(angle) + 1) / 2)) * Math.min(1, radiusScale * 1.15);
        place(it.el, x, y, scale, front);
      });

      support.forEach((it) => {
        const angle = it.phase + time * it.speed;
        const currentRadius = it.radius * radiusScale;
        const x = Math.cos(angle) * currentRadius;
        const yBase = Math.sin(angle) * currentRadius * SQUASH;
        const bob = Math.sin(time * it.bobSpeed + it.phase) * (it.bobAmp * radiusScale);
        const y = yBase + bob;
        const front = Math.sin(angle) > -0.15;
        const baseScale = radiusScale < 0.7 ? 0.55 : 0.75;
        const scale = (baseScale + 0.18 * ((Math.sin(angle) + 1) / 2)) * Math.min(1, radiusScale * 1.15);
        place(it.el, x, y, scale, front);
      });

      particles.forEach((p) => {
        const angle = p.phase + time * p.speed;
        const wob = Math.sin(time * 0.4 + p.phase) * (12 * radiusScale);
        const r = (p.radius + wob) * radiusScale;
        const x = Math.cos(angle) * r;
        const y = Math.sin(angle) * r * SQUASH;
        const front = Math.sin(angle) > -0.1;
        const opacity = 0.35 + 0.5 * ((Math.sin(angle) + 1) / 2);
        if (p.el) {
          p.el.style.transform = `translate(${x}px,${y}px) scale(${radiusScale})`;
          p.el.style.opacity = String(opacity);
          p.el.style.zIndex = front ? '11' : '3';
        }
      });

      if (!reduceMotion) {
        animationFrameId = requestAnimationFrame(render);
      }
    }

    if (reduceMotion) {
      render(0);
    } else {
      animationFrameId = requestAnimationFrame(render);
    }

    const handleMouseMove = (e: MouseEvent) => {
      const rect = stage.getBoundingClientRect();
      const relX = (e.clientX - rect.left) / rect.width - 0.5;
      const relY = (e.clientY - rect.top) / rect.height - 0.5;
      const rotY = relX * 10;
      const rotX = -relY * 8;
      canvas.style.transform = `rotateX(${rotX}deg) rotateY(${rotY}deg)`;
    };

    const handleMouseLeave = () => {
      canvas.style.transform = 'rotateX(0deg) rotateY(0deg)';
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        const touch = e.touches[0];
        const rect = stage.getBoundingClientRect();
        const relX = (touch.clientX - rect.left) / rect.width - 0.5;
        const relY = (touch.clientY - rect.top) / rect.height - 0.5;
        const rotY = relX * 8;
        const rotX = -relY * 6;
        canvas.style.transform = `rotateX(${rotX}deg) rotateY(${rotY}deg)`;
      }
    };

    const handleTouchEnd = () => {
      canvas.style.transform = 'rotateX(0deg) rotateY(0deg)';
    };

    stage.addEventListener('mousemove', handleMouseMove);
    stage.addEventListener('mouseleave', handleMouseLeave);
    stage.addEventListener('touchmove', handleTouchMove, { passive: true });
    stage.addEventListener('touchend', handleTouchEnd);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      stage.removeEventListener('mousemove', handleMouseMove);
      stage.removeEventListener('mouseleave', handleMouseLeave);
      stage.removeEventListener('touchmove', handleTouchMove);
      stage.removeEventListener('touchend', handleTouchEnd);
      // Clean up injected DOM elements
      items.forEach((it) => it.el?.remove());
      support.forEach((it) => it.el?.remove());
      particles.forEach((p) => p.el?.remove());
    };
  }, []);

  return (
    <div className="orbit-stage" ref={stageRef}>
      <div className="orbit-canvas" id="orbitCanvas" ref={canvasRef}>
        <div className="glow-base" />
        <div className="pedestal" />
        <div className="ring ring-outer" />
        <div className="ring ring-inner" />

        <div className="medallion">
          <div>
            <div className="medallion-mark">
              <img src="/logo.png" alt="ritresources" />
            </div>
            <div className="medallion-title">RITRESOURCES</div>
            <div className="medallion-sub">RAJALAKSHMI INSTITUTE OF TECHNOLOGY</div>
            <div className="medallion-tag">BELIEVE IN THE POSSIBILITIES</div>
          </div>
        </div>
      </div>
    </div>
  );
};
