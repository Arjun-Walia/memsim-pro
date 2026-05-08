import { useEffect, useRef, React } from 'react';
import { gsap } from 'gsap';

type SplitType = 'chars' | 'words' | 'lines';

interface SplitTextProps {
  text: string;
  className?: string;
  /** Stagger delay in ms between each unit */
  delay?: number;
  /** GSAP tween duration in seconds */
  duration?: number;
  ease?: string;
  splitType?: SplitType;
  from?: gsap.TweenVars;
  to?: gsap.TweenVars;
  /** 0–1 threshold for IntersectionObserver */
  threshold?: number;
  /** rootMargin for IntersectionObserver */
  rootMargin?: string;
  textAlign?: React.CSSProperties['textAlign'];
  onLetterAnimationComplete?: () => void;
}

export default function SplitText({
  text,
  className = '',
  delay = 50,
  duration = 1.25,
  ease = 'power3.out',
  splitType = 'chars',
  from = { opacity: 0, y: 40 },
  to = { opacity: 1, y: 0 },
  threshold = 0.1,
  rootMargin = '-100px',
  textAlign = 'left',
  onLetterAnimationComplete,
}: SplitTextProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const tweenRef = useRef<gsap.core.Tween | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Split text into individual spans
    const units: HTMLElement[] = [];

    if (splitType === 'chars') {
      // Split by words first, preserving spaces
      const words = text.split(' ');
      container.innerHTML = '';
      words.forEach((word, wi) => {
        const wordSpan = document.createElement('span');
        wordSpan.style.display = 'inline-block';
        wordSpan.style.whiteSpace = 'nowrap';
        [...word].forEach((char) => {
          const span = document.createElement('span');
          span.textContent = char;
          span.style.display = 'inline-block';
          wordSpan.appendChild(span);
          units.push(span);
        });
        container.appendChild(wordSpan);
        if (wi < words.length - 1) {
          const space = document.createTextNode('\u00A0');
          container.appendChild(space);
        }
      });
    } else if (splitType === 'words') {
      const words = text.split(' ');
      container.innerHTML = '';
      words.forEach((word, wi) => {
        const span = document.createElement('span');
        span.textContent = word;
        span.style.display = 'inline-block';
        container.appendChild(span);
        units.push(span);
        if (wi < words.length - 1) {
          container.appendChild(document.createTextNode('\u00A0'));
        }
      });
    } else {
      // lines — treat full text as one block
      container.innerHTML = `<span style="display:inline-block">${text}</span>`;
      units.push(container.firstElementChild as HTMLElement);
    }

    // Set initial state
    gsap.set(units, from);

    const animate = () => {
      tweenRef.current = gsap.to(units, {
        ...to,
        duration,
        ease,
        stagger: delay / 1000,
        onComplete: onLetterAnimationComplete,
      });
    };

    // Observe
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          animate();
          observer.disconnect();
        }
      },
      { threshold, rootMargin }
    );
    observer.observe(container);

    return () => {
      observer.disconnect();
      tweenRef.current?.kill();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text, splitType]);

  return (
    <div
      ref={containerRef}
      className={className}
      style={{ textAlign, overflow: 'hidden' }}
      aria-label={text}
    />
  );
}
