"use client";

import Image from "next/image";
import { FormEvent, useEffect, useState } from "react";
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

export function PartyAssistantWidget() {
  const [open, setOpen] = useState(false);
  const [wish, setWish] = useState("");
  const [status, setStatus] = useState("");
  const [hasScrolled, setHasScrolled] = useState(false);

  useEffect(() => {
    const watchScroll = () => setHasScrolled(window.scrollY > 32);
    watchScroll();
    window.addEventListener("scroll", watchScroll, { passive: true });
    return () => window.removeEventListener("scroll", watchScroll);
  }, []);

  function close() {
    setOpen(false);
    setStatus("");
  }

  function dictate() {
    const Recognition = (window as RecognitionWindow).SpeechRecognition ?? (window as RecognitionWindow).webkitSpeechRecognition;
    if (!Recognition) return setStatus("Голосовой ввод не поддерживается этим браузером. Напишите пожелания текстом.");
    const recognition = new Recognition();
    recognition.lang = "ru-RU";
    recognition.interimResults = false;
    recognition.onresult = (event) => {
      setWish((value) => `${value} ${event.results[0][0].transcript}`.trim());
      setStatus("Текст готов — его можно поправить или собрать в бриф.");
    };
    recognition.onerror = () => setStatus("Не удалось распознать речь. Попробуйте ещё раз.");
    recognition.onend = () => undefined;
    recognition.start();
    setStatus("Слушаю вас…");
  }

  async function makeBrief() {
    if (wish.trim().length < 12) {
      setStatus("Расскажите чуть подробнее — хотя бы одной-двумя фразами.");
      return;
    }

    setStatus("Помощник собирает понятный бриф…");
    try {
      const response = await fetch("/api/party-brief", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ wish })
      });
      const result = (await response.json()) as { brief?: string; error?: string };
      if (response.ok && result.brief) {
        setWish(result.brief);
        setStatus("Бриф готов — проверьте и поправьте его при необходимости.");
        return;
      }
      setStatus(result.error === "assistant_not_configured" ? "ИИ-помощник ещё подключается. Пожелания можно отправить как есть." : "Не получилось собрать бриф. Пожелания можно отправить как есть.");
    } catch {
      setStatus("Не получилось собрать бриф. Пожелания можно отправить как есть.");
    }
  }

  async function downloadBriefPdf() {
    const brief = wish.trim();
    if (!brief) {
      setStatus("Сначала надиктуйте или напишите пожелания — затем их можно сохранить в PDF.");
      return;
    }

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
        info: { title: "Пожелания к празднику — Маскарад" },
        defaultStyle: { font: "Roboto", fontSize: 11, color: "#24131a", lineHeight: 1.35 },
        content: [
          { text: "МАСКАРАД", style: "brand" },
          { text: "Пожелания к празднику", style: "title" },
          { text: "Этот черновик можно сохранить, поправить и обсудить с театром.", style: "subtitle" },
          { canvas: [{ type: "line", x1: 0, y1: 0, x2: 499, y2: 0, lineColor: "#F2BD4D", lineWidth: 2 }], margin: [0, 14, 0, 18] },
          { text: brief, style: "brief" },
          { text: "Театр праздника «Маскарад»\n+7 995 121-94-67", style: "footer" }
        ],
        styles: {
          brand: { color: "#5B1833", bold: true, fontSize: 10, characterSpacing: 1.1 },
          title: { color: "#5B1833", bold: true, fontSize: 24, margin: [0, 7, 0, 5] },
          subtitle: { color: "#6B5961", fontSize: 10 },
          brief: { fontSize: 12, lineHeight: 1.55 },
          footer: { color: "#6B5961", fontSize: 9, margin: [0, 34, 0, 0] }
        }
      };

      await pdfMake.createPdf(documentDefinition).download("pozhelaniya-k-prazdniku-maskarad.pdf");
      setStatus("PDF скачан — его можно сохранить себе или отправить в театр.");
    } catch {
      setStatus("Не удалось создать PDF. Попробуйте ещё раз.");
    }
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const phone = String(data.get("phone") || "").trim();
    if (phone.length < 6) return setStatus("Добавьте телефон, чтобы театр мог связаться с вами.");
    setStatus("Отправляем заявку…");
    const leadText = ["Заявка через помощника по празднику", `Имя: ${String(data.get("name") || "").trim()}`, `Телефон: ${phone}`, `Пожелания: ${wish}`].join("\n");
    try {
      const response = await fetch("/api/leads", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name: data.get("name"), phone, message: wish, leadText, page: window.location.pathname }) });
      setStatus(response.ok ? "Заявка отправлена. Скоро свяжемся с вами." : "Не удалось отправить. Попробуйте позвонить нам.");
    } catch {
      setStatus("Не удалось отправить. Попробуйте позвонить нам.");
    }
  }

  return (
    <>
      <button className={`party-assistant-trigger${hasScrolled ? " is-scrolled" : ""}`} type="button" onClick={() => setOpen(true)} aria-label="Рассказать о празднике голосом">
        <Image className="brand-mark-image" src="/images/legacy/maskarad-mask-transparent.png" alt="" width={1282} height={1227} sizes="43px" priority />
        <span className="party-assistant-badge" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none"><rect x="9" y="3" width="6" height="11" rx="3" /><path d="M6.5 11.5a5.5 5.5 0 0 0 11 0M12 17v3M8.5 20h7" /></svg>
        </span>
        <span className="party-assistant-hint">
          <span className="party-assistant-hint-text">Расскажите о празднике</span>
          <span className="party-assistant-equalizer" aria-hidden="true"><i /><i /><i /></span>
        </span>
      </button>
      {open && typeof document !== "undefined" &&
        createPortal(
          <div className="party-modal" role="dialog" aria-modal="true" aria-label="Помощник по празднику" onMouseDown={close}>
            <div className="party-modal-card" onMouseDown={(event) => event.stopPropagation()}>
              <button className="party-modal-close" type="button" onClick={close} aria-label="Закрыть окно">×</button>
              <span className="eyebrow">Помощник по празднику</span>
              <h2>Расскажите, какой праздник хотите</h2>
              <p>
                Надиктуйте или напишите пожелания. Помощник соберёт их в понятный бриф, который можно поправить перед отправкой или{" "}
                <span className="party-pdf-note"><PdfIcon /> сохранить себе в PDF</span>.
              </p>
              <div className="party-wish-field">
                <textarea value={wish} onChange={(event) => setWish(event.target.value)} placeholder="Например: дочке 6 лет, будут друзья дома, любит русалок…" />
                <button type="button" className="party-dictate" onClick={dictate} aria-label="Надиктовать пожелания" title="Надиктовать пожелания">
                  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><rect x="9" y="3" width="6" height="11" rx="3" /><path d="M6.5 11.5a5.5 5.5 0 0 0 11 0M12 17v3M8.5 20h7" /></svg>
                </button>
              </div>
              <div className="party-modal-tools">
                <button type="button" className="party-make-brief" onClick={makeBrief}>Собрать бриф с ИИ</button>
                <button type="button" className="party-download-pdf" onClick={downloadBriefPdf}><PdfIcon /> Скачать PDF</button>
              </div>
              <form className="party-modal-form" onSubmit={submit}>
                <input name="name" placeholder="Ваше имя" autoComplete="name" />
                <input name="phone" placeholder="Телефон" inputMode="tel" autoComplete="tel" />
                <button type="submit">Отправить пожелания</button>
              </form>
              <p className="party-modal-status" aria-live="polite">{status}</p>
            </div>
          </div>,
          document.body
        )}
    </>
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
