import { useEffect, useRef, useState } from 'react';
import clsx from 'clsx';

interface MasonryGridProps {
  children: React.ReactNode;
  className?: string;
  columnWidth?: number;
  gap?: number;
  columnMode?: 'css' | 'js';
}

export function MasonryGrid({
  children,
  className,
  columnWidth = 300,
  gap = 16
  , columnMode = 'js'
}: MasonryGridProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [columns, setColumns] = useState(1);

  useEffect(() => {
    const updateColumns = () => {
      if (!containerRef.current) return;
      const containerWidth = containerRef.current.offsetWidth;
      const columnsCount = Math.max(1, Math.floor(containerWidth / (columnWidth + gap)));
      setColumns(columnsCount);
    };

    updateColumns();
    window.addEventListener('resize', updateColumns);
    return () => window.removeEventListener('resize', updateColumns);
  }, [columnWidth, gap]);

  const items = Array.isArray(children) ? children : [children];
  const columnItems = Array.from({ length: columns }, (_, i) => 
    items.filter((_, index) => index % columns === i)
  );

  if (columnMode === 'css') {
    // Use CSS columns for simpler, mobile-friendly masonry
    return (
      <div
        ref={containerRef}
        className={clsx(className)}
        style={{
          columnWidth: `${columnWidth}px`,
          columnGap: `${gap}px`,
        }}
      >
        {Array.isArray(children) ? children.map((child, i) => (
          <div key={i} style={{ breakInside: 'avoid' }}>
            {child}
          </div>
        )) : <div style={{ breakInside: 'avoid' }}>{children}</div>}
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className={clsx('grid gap-4 auto-rows-max', className)}
      style={{
        gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
        gap: `${gap}px`,
      }}
    >
      {columnItems.map((column, columnIndex) => (
        <div key={columnIndex} className="space-y-4">
          {column}
        </div>
      ))}
    </div>
  );
}