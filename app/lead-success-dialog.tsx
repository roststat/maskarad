"use client";

import { useEffect, useRef, type RefObject } from "react";
import { createPortal } from "react-dom";

export function LeadSuccessContent({ message, onClose, actionRef }: { message: string; onClose: () => void; actionRef?: RefObject<HTMLButtonElement | null> }) {
  return <div className="lead-success-content">
    <span className="lead-success-icon" aria-hidden="true">✓</span>
    <span className="eyebrow">Заявка принята</span>
    <h2>Спасибо! Заявка отправлена</h2>
    <p>{message}</p>
    <button ref={actionRef} type="button" className="lead-success-action" onClick={onClose}>Понятно</button>
  </div>;
}

export function LeadSuccessDialog({ open, message, onClose }: { open: boolean; message: string; onClose: () => void }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const actionRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    actionRef.current?.focus();
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
      if (event.key !== "Tab") return;
      const elements = cardRef.current?.querySelectorAll<HTMLElement>("button:not(:disabled), a[href]");
      if (!elements?.length) return;
      const first = elements[0];
      const last = elements[elements.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
      previousFocus?.focus();
    };
  }, [open, onClose]);

  if (!open || typeof document === "undefined") return null;
  return createPortal(<div className="party-modal lead-success-dialog ym-hide-content" role="dialog" aria-modal="true" aria-label="Заявка отправлена" onMouseDown={onClose}>
    <div className="party-modal-card lead-success-card" ref={cardRef} onMouseDown={(event) => event.stopPropagation()}>
      <button className="party-modal-close" type="button" onClick={onClose} aria-label="Закрыть окно">×</button>
      <div className="lead-success-content">
        <span className="lead-success-icon" aria-hidden="true">✓</span>
        <span className="eyebrow">Заявка принята</span>
        <h2>Спасибо! Заявка отправлена</h2>
        <p>{message}</p>
        <button ref={actionRef} type="button" className="lead-success-action" onClick={onClose}>Понятно</button>
      </div>
    </div>
  </div>, document.body);
}
