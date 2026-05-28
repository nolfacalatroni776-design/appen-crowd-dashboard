import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Info } from 'lucide-react';

interface MetricInfoProps {
  tip?: string;
  align?: 'left' | 'right';
  className?: string;
  iconClassName?: string;
}

type TooltipPlacement = 'top' | 'bottom';

const VIEWPORT_PADDING = 12;
const TOOLTIP_GAP = 10;

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

export default function MetricInfo({ tip, align = 'left', className = '', iconClassName = 'w-3.5 h-3.5' }: MetricInfoProps) {
  const triggerRef = useRef<HTMLSpanElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const closeTimerRef = useRef<number | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [position, setPosition] = useState({
    left: 0,
    top: 0,
    arrowLeft: 16,
    placement: 'bottom' as TooltipPlacement,
    ready: false,
  });

  const updatePosition = useCallback(() => {
    const trigger = triggerRef.current;
    const panel = panelRef.current;
    if (!trigger || !panel) return;

    const triggerRect = trigger.getBoundingClientRect();
    const panelRect = panel.getBoundingClientRect();
    const panelWidth = Math.min(panelRect.width, window.innerWidth - VIEWPORT_PADDING * 2);
    const panelHeight = Math.min(panelRect.height, window.innerHeight - VIEWPORT_PADDING * 2);
    const maxLeft = Math.max(VIEWPORT_PADDING, window.innerWidth - panelWidth - VIEWPORT_PADDING);
    const preferredLeft = align === 'right' ? triggerRect.right - panelWidth : triggerRect.left;
    const left = clamp(preferredLeft, VIEWPORT_PADDING, maxLeft);

    const spaceBelow = window.innerHeight - triggerRect.bottom;
    const spaceAbove = triggerRect.top;
    const placement: TooltipPlacement =
      spaceBelow >= panelHeight + TOOLTIP_GAP || spaceBelow >= spaceAbove ? 'bottom' : 'top';
    const preferredTop =
      placement === 'bottom'
        ? triggerRect.bottom + TOOLTIP_GAP
        : triggerRect.top - panelHeight - TOOLTIP_GAP;
    const maxTop = Math.max(VIEWPORT_PADDING, window.innerHeight - panelHeight - VIEWPORT_PADDING);
    const top = clamp(preferredTop, VIEWPORT_PADDING, maxTop);
    const arrowLeft = clamp(triggerRect.left + triggerRect.width / 2 - left - 4, 12, panelWidth - 20);

    setPosition({ left, top, arrowLeft, placement, ready: true });
  }, [align]);

  const clearCloseTimer = useCallback(() => {
    if (closeTimerRef.current === null) return;

    window.clearTimeout(closeTimerRef.current);
    closeTimerRef.current = null;
  }, []);

  const openTooltip = useCallback(() => {
    clearCloseTimer();
    setIsOpen(true);
  }, [clearCloseTimer]);

  const closeTooltip = useCallback(() => {
    clearCloseTimer();
    closeTimerRef.current = window.setTimeout(() => {
      setIsOpen(false);
      closeTimerRef.current = null;
    }, 120);
  }, [clearCloseTimer]);

  useLayoutEffect(() => {
    if (!isOpen) return;
    setPosition((current) => ({ ...current, ready: false }));
    updatePosition();
  }, [isOpen, tip, updatePosition]);

  useEffect(() => {
    if (!isOpen) return;

    window.addEventListener('resize', updatePosition);
    window.addEventListener('scroll', updatePosition, true);

    return () => {
      window.removeEventListener('resize', updatePosition);
      window.removeEventListener('scroll', updatePosition, true);
    };
  }, [isOpen, updatePosition]);

  useEffect(() => clearCloseTimer, [clearCloseTimer]);

  if (!tip) return null;

  const tooltipPanel =
    isOpen && typeof document !== 'undefined'
      ? createPortal(
          <div
            ref={panelRef}
            className="fixed z-[9999] w-72 max-w-[calc(100vw-24px)] overflow-y-auto rounded-md bg-slate-800 p-3 text-left text-xs font-normal leading-relaxed text-white shadow-2xl shadow-slate-950/25 whitespace-pre-line"
            style={{
              left: position.left,
              top: position.top,
              maxHeight: 'calc(100vh - 24px)',
              visibility: position.ready ? 'visible' : 'hidden',
            }}
            onMouseEnter={openTooltip}
            onMouseLeave={closeTooltip}
            role="tooltip"
          >
            {tip}
            <span
              className={`absolute h-2 w-2 rotate-45 bg-slate-800 ${
                position.placement === 'bottom' ? '-top-1' : '-bottom-1'
              }`}
              style={{ left: position.arrowLeft }}
            />
          </div>,
          document.body
        )
      : null;

  return (
    <span
      ref={triggerRef}
      className={`ml-1 inline-flex items-center align-middle ${className}`}
      onClick={(event) => event.stopPropagation()}
      onMouseDown={(event) => event.stopPropagation()}
      onMouseEnter={openTooltip}
      onMouseLeave={closeTooltip}
      onFocus={openTooltip}
      onBlur={closeTooltip}
      tabIndex={0}
    >
      <Info className={`${iconClassName} cursor-help text-slate-400`} />
      {tooltipPanel}
    </span>
  );
}
