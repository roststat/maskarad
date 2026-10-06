"use client";

import Image from "next/image";
import { createContext, ReactNode, useCallback, useContext, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import type { TDocumentDefinitions } from "pdfmake/interfaces";

type Recognition = {
  lang: string;
  interimResults: boolean;
  onresult: (event: { results: { [index: number]: { [index: number]: { transcript: string } } } }) => void;
  onerror: () => void;
  onend: () => void;
  start: () => void;
  stop: () => void;
};

type RecognitionWindow = Window & typeof globalThis & {
  SpeechRecognition?: new () => Recognition;
  webkitSpeechRecognition?: new () => Recognition;
};

type PartyAssistantContextValue = {
  openBrief: () => void;
  briefForLead: string;
  prepareLead: (brief: string) => void;
  clearBriefForLead: () => void;
};

const PartyAssistantContext = createContext<PartyAssistantContextValue | null>(null);

export function PartyAssistantProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const [briefForLead, setBriefForLead] = useState("");
  const openBrief = useCallback(() => setOpen(true), []);
  const closeBrief = useCallback(() => setOpen(false), []);
  const prepareLead = useCallback((brief: string) => setBriefForLead(brief), []);
  const clearBriefForLead = useCallback(() => setBriefForLead(""), []);

  return (
    <PartyAssistantContext.Provider value={{ openBrief, briefForLead, prepareLead, clearBriefForLead }}>
      {children}
      <PartyAssistantDialog open={open} onClose={closeBrief} />
    </PartyAssistantContext.Provider>
  );
}

export function usePartyAssistant() {
  const context = useContext(PartyAssistantContext);
  if (!context) throw new Error("PartyAssistantProvider is missing");
  return context.openBrief;
}

export function useBriefForLead() {
  const context = useContext(PartyAssistantContext);
  if (!context) throw new Error("PartyAssistantProvider is missing");
  return context;
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
  const { prepareLead } = useBriefForLead();
  const [wish, setWish] = useState("");
  const [ready, setReady] = useState(false);
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState("");
  const [isListening, setIsListening] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const recognitionRef = useRef<Recognition | null>(null);

  useEffect(() => {
    if (!open) return;
    const previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    textareaRef.current?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setStatus("");
        onClose();
      }
    };
    window.addEventListener("keydown", onKeyDown);

    return () => {
      recognitionRef.current?.stop();
      recognitionRef.current = null;
      setIsListening(false);
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
      previousFocus?.focus();
    };
  }, [open, onClose]);

  function close() {
    setStatus("");
    onClose();
  }

  function goToApplication() {
    prepareLead(wish.trim());
    close();
    window.requestAnimationFrame(() => document.getElementById("zayavka")?.scrollIntoView({ behavior: "smooth", block: "start" }));
  }

  function dictate() {
    if (isListening) {
      recognitionRef.current?.stop();
      setStatus("Останавливаю диктовку…");
      return;
    }

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
    recognition.onend = () => {
      recognitionRef.current = null;
      setIsListening(false);
    };
    recognitionRef.current = recognition;
    recognition.start();
    setIsListening(true);
    setStatus("Слушаю вас… Нажмите микрофон ещё раз, чтобы остановить запись.");
  }

  async function makeBrief() {
    const input = wish.trim();
    if (input.length < 12) {
      setStatus("Расскажите чуть подробнее — хотя бы одной-двумя фразами.");
      return;
    }

    setBusy(true);
    setStatus("ИИ собирает бриф…");
    try {
      const response = await fetch("/api/party-brief", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ wish: input })
      });
      const result = (await response.json()) as { brief?: string };

      if (!response.ok || !result.brief) {
        setStatus("Не удалось собрать бриф с ИИ. Проверьте текст и попробуйте ещё раз.");
        return;
      }

      setWish(formatBriefParagraphs(result.brief));
      setReady(true);
      setStatus("Бриф готов. Его можно поправить и собрать с ИИ ещё раз.");
    } catch {
      setStatus("Не удалось связаться с помощником. Попробуйте ещё раз.");
    } finally {
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

  if (!open || typeof document === "undefined") return null;

  return createPortal(
    <div className="party-modal" role="dialog" aria-modal="true" aria-label="Конструктор брифа праздника" onMouseDown={close}>
      <div className="party-modal-card" onMouseDown={(event) => event.stopPropagation()}>
        <button className="party-modal-close" type="button" onClick={close} aria-label="Закрыть окно">×</button>
        <span className="eyebrow">Помощник по празднику</span>
        <h2>{ready ? "Ваш бриф праздника" : "Расскажите, какой праздник хотите"}</h2>
        <p>
          {ready
            ? "Проверьте текст, поправьте детали и скачайте PDF. Имя и телефон для этого не нужны."
            : "Надиктуйте или напишите пожелания. Помощник соберёт их в понятный бриф, который можно поправить и сохранить себе в PDF."}
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
          {isListening && <span className="party-listening-indicator" aria-live="polite">Слушаю…</span>}
          <button
            type="button"
            className={"party-dictate" + (isListening ? " is-listening" : "")}
            onClick={dictate}
            aria-label={isListening ? "Остановить диктовку" : "Надиктовать пожелания"}
            aria-pressed={isListening}
            title={isListening ? "Остановить диктовку" : "Надиктовать пожелания"}
          >
            <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><rect x="9" y="3" width="6" height="11" rx="3" /><path d="M6.5 11.5a5.5 5.5 0 0 0 11 0M12 17v3M8.5 20h7" /></svg>
          </button>
        </div>
        <p className="party-voice-note">Диктовка запускается только по нажатию микрофона и может использовать сервис вашего браузера.</p>
        <div className={"party-modal-tools" + (ready ? " is-ready" : "")}>
          <button type="button" className="party-make-brief" onClick={makeBrief} disabled={busy}>
            <MagicIcon /> {busy ? "ИИ собирает бриф…" : "Собрать бриф с ИИ"}
          </button>
          {ready && (
            <button type="button" className="party-download-pdf" onClick={downloadBriefPdf} disabled={busy || !wish.trim()}>
              <PdfIcon /> {busy ? "Готовим PDF…" : "Скачать PDF"}
            </button>
          )}
        </div>
        {ready && (
          <div className="party-offer">
            <strong>Хотите обсудить этот праздник?</strong>
            <p>Приложим бриф к заявке. Останется оставить имя и телефон, чтобы мы могли ответить.</p>
            <button type="button" className="party-offer-button" onClick={goToApplication}>Отправить бриф театру</button>
          </div>
        )}
        <p className="party-modal-status" aria-live="polite">{status}</p>
      </div>
    </div>,
    document.body
  );
}

function formatBriefParagraphs(brief: string) {
  return brief
    .replace(/\r\n/g, "\n")
    .split(/\n+/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean)
    .join("\n\n");
}

function MagicIcon() {
  return (
    <svg className="magic-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="m12 2 1.5 5.5L19 9l-5.5 1.5L12 16l-1.5-5.5L5 9l5.5-1.5L12 2Z" />
      <path d="m19 15 .7 2.3L22 18l-2.3.7L19 21l-.7-2.3L16 18l2.3-.7L19 15Z" />
    </svg>
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
