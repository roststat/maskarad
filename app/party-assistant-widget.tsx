"use client";

import Image from "next/image";
import { createContext, FormEvent, ReactNode, useCallback, useContext, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import type { TDocumentDefinitions } from "pdfmake/interfaces";

type Recognition = {
  lang: string;
  interimResults: boolean;
  onresult: (event: { results: { [index: number]: { [index: number]: { transcript: string } } } }) => void;
  onerror: () => void;
  onend: () => void;
  start: () => void;
};

type RecognitionWindow = Window & typeof globalThis & {
  SpeechRecognition?: new () => Recognition;
  webkitSpeechRecognition?: new () => Recognition;
};

const PartyAssistantContext = createContext<(() => void) | null>(null);

export function PartyAssistantProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const openBrief = useCallback(() => setOpen(true), []);
  const closeBrief = useCallback(() => setOpen(false), []);

  return (
    <PartyAssistantContext.Provider value={openBrief}>
      {children}
      <PartyAssistantDialog open={open} onClose={closeBrief} />
    </PartyAssistantContext.Provider>
  );
}

export function usePartyAssistant() {
  const openBrief = useContext(PartyAssistantContext);
  if (!openBrief) throw new Error("PartyAssistantProvider is missing");
  return openBrief;
}

export function PartyAssistantWidget() {
  const openBrief = usePartyAssistant();
  const [hasScrolled, setHasScrolled] = useState(false);

  useEffect(() => {
    const watchScroll = () => setHasScrolled(window.scrollY > 32);
    watchScroll();
    window.addEventListener("scroll", watchScroll, { passive: true });
    return () => window.removeEventListener("scroll", watchScroll);
  }, []);

  return (
    <button className={"party-assistant-trigger" + (hasScrolled ? " is-scrolled" : "")} type="button" onClick={openBrief} aria-label="Составить бриф праздника">
      <Image className="brand-mark-image" src="/images/legacy/maskarad-mask-transparent.png" alt="" width={1282} height={1227} sizes="43px" priority />
      <span className="party-assistant-badge" aria-hidden="true">
        <svg viewBox="0 0 24 24" fill="none"><rect x="9" y="3" width="6" height="11" rx="3" /><path d="M6.5 11.5a5.5 5.5 0 0 0 11 0M12 17v3M8.5 20h7" /></svg>
      </span>
      <span className="party-assistant-hint">
        <span className="party-assistant-hint-text">Расскажите о празднике</span>
        <span className="party-assistant-equalizer" aria-hidden="true"><i /><i /><i /></span>
      </span>
    </button>
  );
}

function PartyAssistantDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [wish, setWish] = useState("");
  const [ready, setReady] = useState(false);
  const [showContact, setShowContact] = useState(false);
  const [sent, setSent] = useState(false);
  const [busy, setBusy] = useState(false);
  const [sending, setSending] = useState(false);
  const [status, setStatus] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (!open) return;
    const previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    textareaRef.current?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setShowContact(false);
        setStatus("");
        onClose();
      }
    };
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
      previousFocus?.focus();
    };
  }, [open, onClose]);

  function close() {
    setShowContact(false);
    setStatus("");
    onClose();
  }

  function dictate() {
    const Recognition = (window as RecognitionWindow).SpeechRecognition ?? (window as RecognitionWindow).webkitSpeechRecognition;
    if (!Recognition) return setStatus("Голосовой ввод не поддерживается этим браузером. Напишите пожелания текстом.");
    const recognition = new Recognition();
    recognition.lang = "ru-RU";
    recognition.interimResults = false;
    recognition.onresult = (event) => {
      setWish((value) => (value + " " + event.results[0][0].transcript).trim());
      setStatus("Текст готов — его можно поправить перед сборкой брифа.");
    };
    recognition.onerror = () => setStatus("Не удалось распознать речь. Попробуйте ещё раз или напишите текстом.");
    recognition.onend = () => undefined;
    recognition.start();
    setStatus("Слушаю вас…");
  }

  async function makeBrief() {
    const input = wish.trim();
    if (input.length < 12) {
      setStatus("Расскажите чуть подробнее — хотя бы одной-двумя фразами.");
      return;
    }

    setBusy(true);
    setStatus("Собираем бриф…");
    try {
      const response = await fetch("/api/party-brief", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ wish: input })
      });
      const result = (await response.json()) as { brief?: string };
      if (response.ok && result.brief) {
        setWish(result.brief);
        setStatus("Бриф готов. Проверьте детали и при желании поправьте текст.");
      } else {
        setStatus("Помощник пока не смог упорядочить текст. Ваши пожелания сохранены как черновик для PDF.");
      }
    } catch {
      setStatus("Помощник пока не смог упорядочить текст. Ваши пожелания сохранены как черновик для PDF.");
    } finally {
      setReady(true);
      setBusy(false);
    }
  }

  async function downloadBriefPdf() {
    const brief = wish.trim();
    if (!brief) {
      setStatus("Добавьте пожелания, чтобы сохранить PDF.");
      return;
    }

    setBusy(true);
    setStatus("Готовим PDF…");
    try {
      const pdfMakeModule = await import("pdfmake/build/pdfmake");
      const fontsModule = await import("pdfmake/build/vfs_fonts");
      const pdfMake = pdfMakeModule.default ?? pdfMakeModule;
      const fonts = fontsModule.default ?? fontsModule;

      pdfMake.addVirtualFileSystem(fonts);
      const documentDefinition: TDocumentDefinitions = {
        pageSize: "A4",
        pageMargins: [48, 52, 48, 52],
        info: { title: "Бриф праздника — Маскарад" },
        defaultStyle: { font: "Roboto", fontSize: 11, color: "#24131a", lineHeight: 1.35 },
        content: [
          { text: "МАСКАРАД", style: "brand" },
          { text: "Бриф праздника", style: "title" },
          { text: "Ваш черновик для планирования праздника. Его можно сохранить и дополнить позже.", style: "subtitle" },
          { canvas: [{ type: "line", x1: 0, y1: 0, x2: 499, y2: 0, lineColor: "#F2BD4D", lineWidth: 2 }], margin: [0, 14, 0, 18] },
          { text: brief, style: "brief" },
          { text: "Если понадобится помощь с программой: Театр праздника «Маскарад»\n+7 995 121-94-67 · maskarad-teatr.ru", style: "footer" }
        ],
        styles: {
          brand: { color: "#5B1833", bold: true, fontSize: 10, characterSpacing: 1.1 },
          title: { color: "#5B1833", bold: true, fontSize: 24, margin: [0, 7, 0, 5] },
          subtitle: { color: "#6B5961", fontSize: 10 },
          brief: { fontSize: 12, lineHeight: 1.55 },
          footer: { color: "#6B5961", fontSize: 9, margin: [0, 34, 0, 0] }
        }
      };

      await pdfMake.createPdf(documentDefinition).download("brif-prazdnika-maskarad.pdf");
      setStatus("PDF скачан. Он останется у вас, даже если вы не отправите заявку.");
    } catch {
      setStatus("Не удалось создать PDF. Попробуйте ещё раз.");
    } finally {
      setBusy(false);
    }
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const phone = String(data.get("phone") || "").trim();
    if (phone.length < 6) return setStatus("Добавьте телефон, чтобы театр смог связаться с вами.");

    setSending(true);
    setStatus("Отправляем бриф театру…");
    const leadText = [
      "Заявка по брифу праздника",
      "Имя: " + String(data.get("name") || "").trim(),
      "Телефон: " + phone,
      "Бриф: " + wish.trim()
    ].join("\n");
    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: data.get("name"), phone, message: wish.trim(), leadText, page: window.location.pathname })
      });
      if (response.ok) {
        setSent(true);
        setStatus("Бриф отправлен. Мы свяжемся с вами.");
      } else {
        setStatus("Не удалось отправить бриф. PDF можно сохранить и связаться с нами по телефону.");
      }
    } catch {
      setStatus("Не удалось отправить бриф. PDF можно сохранить и связаться с нами по телефону.");
    } finally {
      setSending(false);
    }
  }

  if (!open || typeof document === "undefined") return null;

  return createPortal(
    <div className="party-modal" role="dialog" aria-modal="true" aria-label="Конструктор брифа праздника" onMouseDown={close}>
      <div className="party-modal-card" onMouseDown={(event) => event.stopPropagation()}>
        <button className="party-modal-close" type="button" onClick={close} aria-label="Закрыть окно">×</button>
        <span className="eyebrow">Помощник по празднику</span>
        <h2>{ready ? "Ваш бриф праздника" : "Составьте бриф для себя"}</h2>
        <p>
          {ready
            ? "Проверьте текст, поправьте детали и скачайте PDF. Имя и телефон для этого не нужны."
            : "Напишите или надиктуйте пожелания — помощник соберёт их в бриф, который можно сохранить себе."}
        </p>
        <label className="party-wish-label" htmlFor="party-brief-wish">{ready ? "Бриф — его можно редактировать" : "Каким вы представляете праздник?"}</label>
        <div className="party-wish-field">
          <textarea
            id="party-brief-wish"
            ref={textareaRef}
            value={wish}
            onChange={(event) => { setWish(event.target.value); setStatus(""); }}
            placeholder="Например: дочке 6 лет, будут друзья дома, любит русалок…"
          />
          {!ready && (
            <button type="button" className="party-dictate" onClick={dictate} aria-label="Надиктовать пожелания" title="Надиктовать пожелания">
              <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><rect x="9" y="3" width="6" height="11" rx="3" /><path d="M6.5 11.5a5.5 5.5 0 0 0 11 0M12 17v3M8.5 20h7" /></svg>
            </button>
          )}
        </div>
        {!ready ? (
          <div className="party-modal-tools">
            <button type="button" className="party-make-brief" onClick={makeBrief} disabled={busy}>
              {busy ? "Собираем бриф…" : "Составить бриф"}
            </button>
          </div>
        ) : (
          <>
            <div className="party-modal-tools">
              <button type="button" className="party-download-pdf" onClick={downloadBriefPdf} disabled={busy || !wish.trim()}>
                <PdfIcon /> {busy ? "Готовим PDF…" : "Скачать PDF для себя"}
              </button>
            </div>
            <p className="party-private-note">PDF создаётся на вашем устройстве. Заявка не отправится сама.</p>
            <div className="party-offer">
              <strong>Хотите, чтобы мы предложили программу?</strong>
              <p>Если решите обратиться к нам, отправьте бриф — мы обсудим подходящий формат праздника.</p>
              {!showContact && !sent && (
                <button type="button" className="party-offer-button" onClick={() => setShowContact(true)}>Отправить бриф театру</button>
              )}
              {showContact && !sent && (
                <form className="party-modal-form" onSubmit={submit}>
                  <input name="name" placeholder="Ваше имя" aria-label="Ваше имя" autoComplete="name" />
                  <input name="phone" placeholder="Телефон" aria-label="Телефон" inputMode="tel" autoComplete="tel" />
                  <button type="submit" disabled={sending}>{sending ? "Отправляем…" : "Отправить бриф"}</button>
                </form>
              )}
              {sent && <p className="party-offer-sent">Спасибо! Бриф отправлен театру.</p>}
            </div>
          </>
        )}
        <p className="party-modal-status" aria-live="polite">{status}</p>
      </div>
    </div>,
    document.body
  );
}

function PdfIcon() {
  return (
    <svg className="pdf-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M6.5 2.75h7l4 4v14.5H6.5z" />
      <path d="M13.5 2.75v4h4" />
      <path d="M8.25 15.75h7.5M8.25 18.25h5.5" />
    </svg>
  );
}
