import { useRef, useCallback, useEffect, type ReactNode } from 'react';

interface BorderGlowProps {
  children?: ReactNode;
  className?: string;
  edgeSensitivity?: number;
  glowColor?: string;
  backgroundColor?: string;
  borderRadius?: number;
  glowRadius?: number;
  glowIntensity?: number;
  coneSpread?: number;
  animated?: boolean;
  colors?: string[];
  fillOpacity?: number;
}

function parseHSL(hslStr: string): { h: number; s: number; l: number } {
  const match = hslStr.match(/([\d.]+)\s*([\d.]+)%?\s*([\d.]+)%?/);
  if (!match) return { h: 40, s: 80, l: 80 };
  return { h: parseFloat(match[1]), s: parseFloat(match[2]), l: parseFloat(match[3]) };
}

function buildBoxShadow(glowColor: string, intensity: number): string {
  const { h, s, l } = parseHSL(glowColor);
  const base = `${h}deg ${s}% ${l}%`;
  const layers: [number, number, number, number, number, boolean][] = [
    [0, 0, 0, 1, 100, true], [0, 0, 1, 0, 60, true], [0, 0, 3, 0, 50, true],
    [0, 0, 6, 0, 40, true], [0, 0, 15, 0, 30, true], [0, 0, 25, 2, 20, true],
    [0, 0, 50, 2, 10, true],
    [0, 0, 1, 0, 60, false], [0, 0, 3, 0, 50, false], [0, 0, 6, 0, 40, false],
    [0, 0, 15, 0, 30, false], [0, 0, 25, 2, 20, false], [0, 0, 50, 2, 10, false],
  ];
  return layers.map(([x, y, blur, spread, alpha, inset]) => {
    const a = Math.min(alpha * intensity, 100);
    return `${inset ? 'inset ' : ''}${x}px ${y}px ${blur}px ${spread}px hsl(${base} / ${a}%)`;
  }).join(', ');
}

function easeOutCubic(x: number) { return 1 - Math.pow(1 - x, 3); }
function easeInCubic(x: number) { return x * x * x; }

interface AnimateOpts {
  start?: number; end?: number; duration?: number; delay?: number;
  ease?: (t: number) => number; onUpdate: (v: number) => void; onEnd?: () => void;
}

function animateValue({ start = 0, end = 100, duration = 1000, delay = 0, ease = easeOutCubic, onUpdate, onEnd }: AnimateOpts) {
  const t0 = performance.now() + delay;
  function tick() {
    const elapsed = performance.now() - t0;
    const t = Math.min(elapsed / duration, 1);
    onUpdate(start + (end - start) * ease(t));
    if (t < 1) requestAnimationFrame(tick);
    else if (onEnd) onEnd();
  }
  setTimeout(() => requestAnimationFrame(tick), delay);
}

const GRADIENT_POSITIONS = ['80% 55%', '69% 34%', '8% 6%', '41% 38%', '86% 85%', '82% 18%', '51% 4%'];
const COLOR_MAP = [0, 1, 2, 0, 1, 2, 1];

function buildMeshGradients(colors: string[]): string[] {
  const gradients: string[] = [];
  for (let i = 0; i < 7; i++) {
    const c = colors[Math.min(COLOR_MAP[i], colors.length - 1)];
    gradients.push(`radial-gradient(at ${GRADIENT_POSITIONS[i]}, ${c} 0px, transparent 50%)`);
  }
  gradients.push(`linear-gradient(${colors[0]} 0 100%)`);
  return gradients;
}

export const BorderGlow = ({
  children,
  className = '',
  edgeSensitivity = 30,
  glowColor = '40 80 80',
  backgroundColor = '#120F17',
  borderRadius = 28,
  glowRadius = 40,
  glowIntensity = 1.0,
  coneSpread = 25,
  animated = false,
  colors = ['#c084fc', '#f472b6', '#38bdf8'],
  fillOpacity = 0.5,
}: BorderGlowProps) => {
  const cardRef = useRef<HTMLDivElement | null>(null);
  const isHoveredRef = useRef(false);
  const cursorAngleRef = useRef(45);
  const edgeProximityRef = useRef(0);
  const sweepActiveRef = useRef(false);

  const getCenterOfElement = useCallback((el: HTMLElement) => {
    const { width, height } = el.getBoundingClientRect();
    return [width / 2, height / 2];
  }, []);

  const getEdgeProximity = useCallback((el: HTMLElement, x: number, y: number) => {
    const [cx, cy] = getCenterOfElement(el);
    const dx = x - cx;
    const dy = y - cy;
    let kx = Infinity;
    let ky = Infinity;
    if (dx !== 0) kx = cx / Math.abs(dx);
    if (dy !== 0) ky = cy / Math.abs(dy);
    return Math.min(Math.max(1 / Math.min(kx, ky), 0), 1);
  }, [getCenterOfElement]);

  const getCursorAngle = useCallback((el: HTMLElement, x: number, y: number) => {
    const [cx, cy] = getCenterOfElement(el);
    const dx = x - cx;
    const dy = y - cy;
    if (dx === 0 && dy === 0) return 0;
    const radians = Math.atan2(dy, dx);
    let degrees = radians * (180 / Math.PI) + 90;
    if (degrees < 0) degrees += 360;
    return degrees;
  }, [getCenterOfElement]);

  const colorSensitivity = edgeSensitivity + 20;

  const updateGlowStyles = useCallback((card: HTMLElement) => {
    const isVisible = isHoveredRef.current || sweepActiveRef.current;
    const proximity = edgeProximityRef.current;
    const angle = cursorAngleRef.current;

    const borderOpacity = isVisible
      ? Math.max(0, (proximity * 100 - colorSensitivity) / (100 - colorSensitivity))
      : 0;
    const glowOpacity = isVisible
      ? Math.max(0, (proximity * 100 - edgeSensitivity) / (100 - edgeSensitivity))
      : 0;

    card.style.setProperty('--border-opacity', String(borderOpacity));
    card.style.setProperty('--glow-opacity', String(glowOpacity));
    card.style.setProperty('--angle-deg', `${angle.toFixed(3)}deg`);
    card.style.setProperty('--trans-style', isVisible ? 'opacity 0.25s ease-out' : 'opacity 0.75s ease-in-out');
  }, [edgeSensitivity, colorSensitivity]);

  const handlePointerMove = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    edgeProximityRef.current = getEdgeProximity(card, x, y);
    cursorAngleRef.current = getCursorAngle(card, x, y);
    updateGlowStyles(card);
  }, [getEdgeProximity, getCursorAngle, updateGlowStyles]);

  const handlePointerEnter = useCallback(() => {
    const card = cardRef.current;
    if (!card) return;
    isHoveredRef.current = true;
    updateGlowStyles(card);
  }, [updateGlowStyles]);

  const handlePointerLeave = useCallback(() => {
    const card = cardRef.current;
    if (!card) return;
    isHoveredRef.current = false;
    updateGlowStyles(card);
  }, [updateGlowStyles]);

  useEffect(() => {
    if (!animated) return;
    const card = cardRef.current;
    if (!card) return;
    
    const angleStart = 110;
    const angleEnd = 465;
    sweepActiveRef.current = true;
    cursorAngleRef.current = angleStart;

    animateValue({
      duration: 500,
      onUpdate: v => {
        edgeProximityRef.current = v / 100;
        updateGlowStyles(card);
      }
    });
    animateValue({
      ease: easeInCubic,
      duration: 1500,
      end: 50,
      onUpdate: v => {
        cursorAngleRef.current = (angleEnd - angleStart) * (v / 100) + angleStart;
        updateGlowStyles(card);
      }
    });
    animateValue({
      ease: easeOutCubic,
      delay: 1500,
      duration: 2250,
      start: 50,
      end: 100,
      onUpdate: v => {
        cursorAngleRef.current = (angleEnd - angleStart) * (v / 100) + angleStart;
        updateGlowStyles(card);
      }
    });
    animateValue({
      ease: easeInCubic,
      delay: 2500,
      duration: 1500,
      start: 100,
      end: 0,
      onUpdate: v => {
        edgeProximityRef.current = v / 100;
        updateGlowStyles(card);
      },
      onEnd: () => {
        sweepActiveRef.current = false;
        updateGlowStyles(card);
      },
    });
  }, [animated, updateGlowStyles]);

  const meshGradients = buildMeshGradients(colors);
  const borderBg = meshGradients.map(g => `${g} border-box`);
  const fillBg = meshGradients.map(g => `${g} padding-box`);

  const cssStyles = `
    .border-glow-root {
      background: var(--bg-color);
      border-radius: calc(var(--border-radius) * 1px);
      transform: translate3d(0, 0, 0.01px);
      box-shadow: rgba(0,0,0,0.1) 0 1px 2px, rgba(0,0,0,0.1) 0 2px 4px, rgba(0,0,0,0.1) 0 4px 8px, rgba(0,0,0,0.1) 0 8px 16px, rgba(0,0,0,0.1) 0 16px 32px, rgba(0,0,0,0.1) 0 32px 64px;
    }
    .border-glow-root .bg-border {
      border: 1px solid transparent;
      background: linear-gradient(var(--bg-color) 0 100%) padding-box, linear-gradient(rgb(255 255 255 / 0%) 0% 100%) border-box, var(--border-bg);
      opacity: var(--border-opacity);
      mask-image: conic-gradient(from var(--angle-deg) at center, black calc(var(--cone-spread) * 1%), transparent calc(var(--cone-spread) * 1% + 15%), transparent calc(100% - var(--cone-spread) * 1% - 15%), black calc(100% - var(--cone-spread) * 1%));
      -webkit-mask-image: conic-gradient(from var(--angle-deg) at center, black calc(var(--cone-spread) * 1%), transparent calc(var(--cone-spread) * 1% + 15%), transparent calc(100% - var(--cone-spread) * 1% - 15%), black calc(100% - var(--cone-spread) * 1%));
      transition: var(--trans-style);
    }
    .border-glow-root .bg-fill {
      border: 1px solid transparent;
      background: var(--fill-bg);
      mask-image: linear-gradient(to bottom, black, black),
                  radial-gradient(ellipse at 50% 50%, black 40%, transparent 65%),
                  radial-gradient(ellipse at 66% 66%, black 5%, transparent 40%),
                  radial-gradient(ellipse at 33% 33%, black 5%, transparent 40%),
                  radial-gradient(ellipse at 66% 33%, black 5%, transparent 40%),
                  radial-gradient(ellipse at 33% 66%, black 5%, transparent 40%),
                  conic-gradient(from var(--angle-deg) at center, transparent 5%, black 15%, black 85%, transparent 95%);
      -webkit-mask-image: linear-gradient(to bottom, black, black),
                  radial-gradient(ellipse at 50% 50%, black 40%, transparent 65%),
                  radial-gradient(ellipse at 66% 66%, black 5%, transparent 40%),
                  radial-gradient(ellipse at 33% 33%, black 5%, transparent 40%),
                  radial-gradient(ellipse at 66% 33%, black 5%, transparent 40%),
                  radial-gradient(ellipse at 33% 66%, black 5%, transparent 40%),
                  conic-gradient(from var(--angle-deg) at center, transparent 5%, black 15%, black 85%, transparent 95%);
      mask-composite: subtract, add, add, add, add, add;
      -webkit-mask-composite: source-out, source-over, source-over, source-over, source-over, source-over;
      opacity: calc(var(--border-opacity) * var(--fill-opacity));
      mix-blend-mode: soft-light;
      transition: var(--trans-style);
    }
    .border-glow-root .outer-glow {
      inset: calc(var(--glow-radius) * -1px);
      mask-image: conic-gradient(from var(--angle-deg) at center, black 2.5%, transparent 10%, transparent 90%, black 97.5%);
      -webkit-mask-image: conic-gradient(from var(--angle-deg) at center, black 2.5%, transparent 10%, transparent 90%, black 97.5%);
      opacity: var(--glow-opacity);
      mix-blend-mode: plus-lighter;
      transition: var(--trans-style);
    }
    .border-glow-root .glow-shadow {
      inset: calc(var(--glow-radius) * 1px);
      box-shadow: var(--glow-shadow);
    }
  `;

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: cssStyles }} />
      <div
        ref={(el) => {
          cardRef.current = el;
          if (!el) return;
          el.style.setProperty('--bg-color', backgroundColor);
          el.style.setProperty('--border-radius', String(borderRadius));
          el.style.setProperty('--glow-radius', String(glowRadius));
          el.style.setProperty('--glow-shadow', buildBoxShadow(glowColor, glowIntensity));
          el.style.setProperty('--cone-spread', String(coneSpread));
          el.style.setProperty('--fill-opacity', String(fillOpacity));
          el.style.setProperty('--border-bg', borderBg.join(', '));
          el.style.setProperty('--fill-bg', fillBg.join(', '));
          
          updateGlowStyles(el);
        }}
        onPointerMove={handlePointerMove}
        onPointerEnter={handlePointerEnter}
        onPointerLeave={handlePointerLeave}
        className={`border-glow-root relative grid isolate border border-white/15 ${className}`}
      >
        {/* mesh gradient border */}
        <div className="bg-border absolute inset-0 rounded-[inherit] -z-[1]" />

        {/* mesh gradient fill near edges */}
        <div className="bg-fill absolute inset-0 rounded-[inherit] -z-[1]" />

        {/* outer glow */}
        <span className="outer-glow absolute pointer-events-none z-[1] rounded-[inherit]">
          <span className="glow-shadow absolute rounded-[inherit]" />
        </span>

        <div className="flex flex-col relative overflow-auto z-[1] w-full h-full">
          {children}
        </div>
      </div>
    </>
  );
};

export default BorderGlow;
