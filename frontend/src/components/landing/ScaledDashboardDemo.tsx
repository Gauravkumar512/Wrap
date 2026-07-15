import { useEffect, useRef, useState } from 'react';
import { DashboardDemo } from './DashboardDemo';

const DESIGN_WIDTH = 640;

export function ScaledDashboardDemo() {
  const outerRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(0);
  const [naturalHeight, setNaturalHeight] = useState(0);

  useEffect(() => {
    const el = outerRef.current;
    if (!el) return;
    const observer = new ResizeObserver(([entry]) => {
      setContainerWidth(entry.contentRect.width);
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const isScaled = containerWidth > 0 && containerWidth < DESIGN_WIDTH;
  const scale = isScaled ? containerWidth / DESIGN_WIDTH : 1;

  useEffect(() => {
    const el = innerRef.current;
    if (!el || !isScaled) return;
    const observer = new ResizeObserver(([entry]) => {
      setNaturalHeight(entry.contentRect.height);
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, [isScaled]);

  return (
    <div
      ref={outerRef}
      style={{
        width: '100%',
        overflow: 'hidden',
        height: isScaled && naturalHeight ? naturalHeight * scale : undefined,
        visibility: containerWidth === 0 ? 'hidden' : 'visible',
      }}
    >
      <div
        ref={innerRef}
        style={{
          width: isScaled ? `${DESIGN_WIDTH}px` : '100%',
          transform: isScaled ? `scale(${scale})` : undefined,
          transformOrigin: 'top left',
        }}
      >
        <DashboardDemo />
      </div>
    </div>
  );
}
