import React, { useState, useRef, useEffect } from 'react';
import { clsx } from 'clsx';
import { Badge } from '../ui/Badge';
import { TRUST_SIGNALS } from '../../data/product';
import { Shield, ChevronLeft, ChevronRight } from 'lucide-react';

// ── Image carousel data (placeholder images — replace with real product shots)
const IMAGES = [
  {
    src: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=800&q=80',
    alt: 'Kerala Ayurveda Ashwagandha Capsules bottle — front',
  },
  {
    src: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=800&q=80',
    alt: 'Ashwagandha root powder close-up',
  },
  {
    src: 'https://images.unsplash.com/photo-1576671081837-49000212a370?w=800&q=80',
    alt: 'Lifestyle — morning wellness routine',
  },
];

interface ProductHeroProps {
  /** Expose for screen-reader announcements when variant changes */
  selectedVariantTitle: string;
}

export function ProductHero({ selectedVariantTitle }: ProductHeroProps) {
  const [activeImg, setActiveImg] = useState(0);
  const [loaded, setLoaded] = useState<boolean[]>(Array(IMAGES.length).fill(false));
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomPos, setZoomPos] = useState({ x: 50, y: 50 });
  const imgContainerRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  // Preload next image when current changes
  useEffect(() => {
    const next = (activeImg + 1) % IMAGES.length;
    const img = new Image();
    img.src = IMAGES[next].src;
  }, [activeImg]);

  function handleLoad(i: number) {
    setLoaded((prev) => {
      const next = [...prev];
      next[i] = true;
      return next;
    });
  }

  function goTo(i: number) {
    setActiveImg(((i % IMAGES.length) + IMAGES.length) % IMAGES.length);
    setIsZoomed(false);
  }

  // ── Zoom on hover (desktop only) ────────────────────────────────────────────
  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const rect = imgContainerRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setZoomPos({ x, y });
  }

  // ── Keyboard navigation on thumbnail list ───────────────────────────────────
  function handleThumbKey(e: React.KeyboardEvent, i: number) {
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      const next = (i + 1) % IMAGES.length;
      goTo(next);
      (listRef.current?.children[next] as HTMLElement)?.focus();
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      const prev = (i - 1 + IMAGES.length) % IMAGES.length;
      goTo(prev);
      (listRef.current?.children[prev] as HTMLElement)?.focus();
    }
  }

  return (
    <div className="flex flex-col gap-4" aria-label="Product gallery">

      {/* Main image */}
      <div
        ref={imgContainerRef}
        className={clsx(
          'relative overflow-hidden rounded-2xl bg-stone-100 aspect-square cursor-zoom-in',
          isZoomed && 'cursor-zoom-out',
        )}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsZoomed(true)}
        onMouseLeave={() => setIsZoomed(false)}
        // Touch: tap to cycle on mobile
        onClick={() => {
          if (window.matchMedia('(pointer: coarse)').matches) {
            goTo(activeImg + 1);
          }
        }}
      >
        {IMAGES.map((img, i) => (
          <React.Fragment key={img.src}>
            {/* Skeleton shown until image loads */}
            {!loaded[i] && i === activeImg && (
              <div
                className="absolute inset-0 skeleton"
                aria-hidden="true"
              />
            )}
            <img
              src={img.src}
              alt={img.alt}
              className={clsx(
                'absolute inset-0 h-full w-full object-cover',
                'transition-opacity duration-500 ease-in-out',
                i === activeImg ? 'opacity-100' : 'opacity-0',
                /* Zoom transform — only when hovered and loaded */
                i === activeImg && isZoomed && loaded[i] &&
                  'transition-transform duration-200',
              )}
              style={
                i === activeImg && isZoomed && loaded[i]
                  ? {
                      transformOrigin: `${zoomPos.x}% ${zoomPos.y}%`,
                      transform: 'scale(1.55)',
                    }
                  : undefined
              }
              loading={i === 0 ? 'eager' : 'lazy'}
              onLoad={() => handleLoad(i)}
              draggable={false}
            />
          </React.Fragment>
        ))}

        {/* Prev / Next arrows — visible on hover on desktop */}
        {IMAGES.length > 1 && (
          <>
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); goTo(activeImg - 1); }}
              aria-label="Previous image"
              className={clsx(
                'absolute left-2 top-1/2 -translate-y-1/2',
                'flex h-8 w-8 items-center justify-center rounded-full',
                'bg-white/80 text-ka-bark shadow-sm backdrop-blur-sm',
                'opacity-0 group-hover:opacity-100 hover:opacity-100 focus-visible:opacity-100',
                'transition-opacity duration-150',
                'md:flex hidden',
              )}
            >
              <ChevronLeft size={16} aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); goTo(activeImg + 1); }}
              aria-label="Next image"
              className={clsx(
                'absolute right-2 top-1/2 -translate-y-1/2',
                'flex h-8 w-8 items-center justify-center rounded-full',
                'bg-white/80 text-ka-bark shadow-sm backdrop-blur-sm',
                'opacity-0 hover:opacity-100 focus-visible:opacity-100',
                'transition-opacity duration-150',
                'md:flex hidden',
              )}
            >
              <ChevronRight size={16} aria-hidden="true" />
            </button>
          </>
        )}

        {/* Dot indicators on mobile */}
        <div
          className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 md:hidden"
          aria-hidden="true"
        >
          {IMAGES.map((_, i) => (
            <span
              key={i}
              className={clsx(
                'h-1.5 rounded-full transition-all duration-300',
                i === activeImg
                  ? 'w-4 bg-white'
                  : 'w-1.5 bg-white/50',
              )}
            />
          ))}
        </div>

        {/* Variant label overlay */}
        <div className="absolute bottom-3 left-3 md:block hidden">
          <Badge variant="gold" className="shadow-sm text-xs">
            {selectedVariantTitle}
          </Badge>
        </div>
      </div>

      {/* Thumbnails — keyboard accessible */}
      <div
        ref={listRef}
        className="flex gap-2"
        role="list"
        aria-label="Product images"
      >
        {IMAGES.map((img, i) => (
          <button
            key={img.src}
            role="listitem"
            type="button"
            tabIndex={i === activeImg ? 0 : -1}
            onClick={() => goTo(i)}
            onKeyDown={(e) => handleThumbKey(e, i)}
            aria-label={`View: ${img.alt}`}
            aria-current={i === activeImg ? 'true' : undefined}
            className={clsx(
              'relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg border-2',
              'transition-all duration-150',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ka-green-500 focus-visible:ring-offset-2',
              i === activeImg
                ? 'border-ka-green-500 ring-2 ring-ka-green-200 shadow-sm'
                : 'border-transparent hover:border-ka-green-300 hover:shadow-sm',
            )}
          >
            {/* Thumbnail skeleton */}
            {!loaded[i] && (
              <div className="absolute inset-0 skeleton rounded-lg" aria-hidden="true" />
            )}
            <img
              src={img.src}
              alt=""
              className={clsx(
                'h-full w-full object-cover transition-opacity duration-300',
                loaded[i] ? 'opacity-100' : 'opacity-0',
                i === activeImg ? 'scale-100' : 'hover:scale-105',
                'transition-transform duration-200',
              )}
              loading="lazy"
              aria-hidden="true"
              onLoad={() => handleLoad(i)}
            />
          </button>
        ))}
      </div>

      {/* Trust signals */}
      <div
        className="flex flex-col gap-1.5 rounded-xl border border-ka-green-100 bg-ka-green-50 px-4 py-3"
        aria-label="Trust signals"
      >
        {TRUST_SIGNALS.map((signal, i) => (
          <div
            key={signal}
            className="flex items-center gap-2 text-sm text-ka-green-700 animate-fade-up"
            style={{ animationDelay: `${i * 50}ms` }}
          >
            <Shield size={13} className="flex-shrink-0 text-ka-green-500" aria-hidden="true" />
            <span>{signal}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
