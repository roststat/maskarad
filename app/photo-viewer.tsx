"use client";

import Image from "next/image";
import { createContext, useCallback, useContext, useEffect, useId, useRef, useState, type ReactNode } from "react";

export type GalleryPhoto = { src: string; alt: string; width: number; height: number };
type PhotoSelection = { photos: readonly GalleryPhoto[]; index: number };
const PhotoViewerContext = createContext<((photos: readonly GalleryPhoto[], index: number) => void) | null>(null);

export function PhotoViewerProvider({ children }: { children: ReactNode }) {
  const [selection, setSelection] = useState<PhotoSelection | null>(null);
  const open = useCallback((photos: readonly GalleryPhoto[], index: number) => {
    if (photos[index]) setSelection({ photos, index });
  }, []);
  const close = useCallback(() => setSelection(null), []);
  return (
    <PhotoViewerContext.Provider value={open}>
      {children}
      {selection && <PhotoViewer photos={selection.photos} initialIndex={selection.index} onClose={close} />}
    </PhotoViewerContext.Provider>
  );
}

export function PhotoOpenButton({ photos, index, children }: { photos: readonly GalleryPhoto[]; index: number; children: ReactNode }) {
  const open = useContext(PhotoViewerContext);
  return <button type="button" className="photo-open-button" aria-haspopup="dialog" aria-label={`Открыть фото: ${photos[index].alt}`} onClick={() => open?.(photos, index)}>{children}</button>;
}

function PhotoViewer({ photos, initialIndex, onClose }: { photos: readonly GalleryPhoto[]; initialIndex: number; onClose: () => void }) {
  const [index, setIndex] = useState(initialIndex);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const gesture = useRef<{ id: number; x: number; y: number; backdrop: boolean } | null>(null);
  const titleId = useId();
  const captionId = useId();
  const photo = photos[index];
  const canBrowse = photos.length > 1;
  const move = (direction: number) => setIndex(value => (value + direction + photos.length) % photos.length);

  useEffect(() => {
    const dialog = dialogRef.current;
    const opener = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const bodyOverflow = document.body.style.overflow;
    const htmlOverflow = document.documentElement.style.overflow;
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";
    dialog?.showModal();
    return () => {
      dialog?.close();
      document.body.style.overflow = bodyOverflow;
      document.documentElement.style.overflow = htmlOverflow;
      if (opener?.isConnected) opener.focus({ preventScroll: true });
    };
  }, []);

  return (
    <dialog ref={dialogRef} className="photo-viewer" aria-labelledby={titleId} aria-describedby={captionId}
      onCancel={event => { event.preventDefault(); onClose(); }} onClose={onClose}
      onClick={event => { if (event.target === event.currentTarget) onClose(); }}
      onKeyDown={event => {
        if (event.key === "Tab") {
          const buttons = [...event.currentTarget.querySelectorAll<HTMLButtonElement>("button:not(:disabled)")];
          const first = buttons[0];
          const last = buttons[buttons.length - 1];
          if (event.shiftKey && document.activeElement === first) {
            event.preventDefault(); last?.focus();
          } else if (!event.shiftKey && document.activeElement === last) {
            event.preventDefault(); first?.focus();
          }
        }
        if (canBrowse && (event.key === "ArrowLeft" || event.key === "ArrowRight")) {
          event.preventDefault(); move(event.key === "ArrowLeft" ? -1 : 1);
        }
      }}>
      <div className="photo-viewer-toolbar">
        <span id={titleId}>Фотографии театра</span>
        <button type="button" className="photo-viewer-close" onClick={onClose} autoFocus>Закрыть <span aria-hidden="true">×</span></button>
      </div>
      <div className="photo-viewer-stage" onDragStart={event => event.preventDefault()}
        onPointerDown={event => {
          if (!event.isPrimary || event.button !== 0) return;
          gesture.current = { id: event.pointerId, x: event.clientX, y: event.clientY, backdrop: event.target === event.currentTarget };
          event.currentTarget.setPointerCapture(event.pointerId);
        }}
        onPointerUp={event => {
          const start = gesture.current;
          gesture.current = null;
          if (!start || start.id !== event.pointerId) return;
          const dx = event.clientX - start.x;
          const dy = event.clientY - start.y;
          if (canBrowse && Math.abs(dx) >= 45 && Math.abs(dx) > Math.abs(dy) * 1.3) {
            move(dx < 0 ? 1 : -1);
          } else if (start.backdrop && Math.abs(dx) < 10 && Math.abs(dy) < 10) {
            onClose();
          }
        }}
        onPointerCancel={() => { gesture.current = null; }}>
        <Image key={photo.src} src={photo.src} alt={photo.alt} width={photo.width} height={photo.height} unoptimized loading="eager" draggable={false} />
      </div>
      {canBrowse && <>
        <button type="button" className="photo-viewer-arrow photo-viewer-prev" aria-label="Предыдущее фото" onClick={() => move(-1)}>‹</button>
        <button type="button" className="photo-viewer-arrow photo-viewer-next" aria-label="Следующее фото" onClick={() => move(1)}>›</button>
      </>}
      <div className="photo-viewer-caption">
        <span className="photo-viewer-count" role="status" aria-live="polite">Фото {index + 1} из {photos.length}</span>
        <p id={captionId}>{photo.alt}</p>
        {canBrowse && <span className="photo-viewer-hint">Листайте стрелками или свайпом</span>}
      </div>
    </dialog>
  );
}
