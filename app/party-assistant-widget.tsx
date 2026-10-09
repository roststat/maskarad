"use client";

import Image from "next/image";
import { createContext, ReactNode, useCallback, useContext, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { consentVersion } from "./legal-data";

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
const PartyAssistantContext = createContext<(() => void) | null>(null);

export function PartyAssistantProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const show = useCallback(() => setOpen(true), []);
  const close = useCallback(() => setOpen(false), []);
  return <PartyAssistantContext.Provider value={show}>{children}<PartyAssistantDialog open={open} onClose={close} /></PartyAssistantContext.Provider>;
}

export function usePartyAssistant() {
  const show = useContext(PartyAssistantContext);
  if (!show) throw new Error("PartyAssistantProvider is missing");
  return show;
}

export function PartyAssistantWidget() {
  const show = usePartyAssistant();
  const [hasScrolled, setHasScrolled] = useState(false);
  useEffect(() => {
    const watchScroll = () => setHasScrolled(window.scrollY > 32);
    watchScroll();
    window.addEventListener("scroll", watchScroll, { passive: true });
    return () => window.removeEventListener("scroll", watchScroll);
  }, []);
  return <button className={"party-assistant-trigger" + (hasScrolled ? " is-scrolled" : "")} type="button" onClick={show} aria-label="Написать организатору">
    <Image className="brand-mark-image" src="/images/legacy/maskarad-mask-transparent.png" alt="" width={1282} height={1227} sizes="43px" priority />
    <span className="party-assistant-badge" aria-hidden="true"><MicIcon /></span>
    <span className="party-assistant-hint"><span className="party-assistant-hint-text">Расскажите о празднике</span><span className="party-assistant-equalizer" aria-hidden="true"><i /><i /><i /></span></span>
  </button>;
}

function PartyAssistantDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [message, setMessage] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [consent, setConsent] = useState(false);
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState(false);
  const [status, setStatus] = useState("");
  const [listening, setListening] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const recognitionRef = useRef<Recognition | null>(null);

  useEffect(() => {
    if (!open) return;
    const previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    textareaRef.current?.focus();
    const onKeyDown = (event: KeyboardEvent) => { if (event.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      recognitionRef.current?.stop();
      recognitionRef.current = null;
      setListening(false);
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
      previousFocus?.focus();
    };
  }, [open, onClose]);

  function dictate() {
    if (listening) { recognitionRef.current?.stop(); return; }
    const Recognition = (window as RecognitionWindow).SpeechRecognition ?? (window as RecognitionWindow).webkitSpeechRecognition;
    if (!Recognition) { setStatus("Голосовой ввод не поддерживается этим браузером. Напишите текстом."); return; }
    const recognition = new Recognition();
    recognition.lang = "ru-RU";
    recognition.interimResults = false;
    recognition.onresult = (event) => {
      setMessage((text) => (text + " " + event.results[0][0].transcript).trim());
      setStatus("Текст можно поправить перед отправкой.");
    };
    recognition.onerror = () => setStatus("Не удалось распознать речь. Попробуйте ещё раз или напишите текстом.");
    recognition.onend = () => { recognitionRef.current = null; setListening(false); };
    recognitionRef.current = recognition;
    recognition.start();
    setListening(true);
    setStatus("Слушаю вас… Нажмите микрофон ещё раз, чтобы остановить запись.");
  }

  async function sendToOrganizer() {
    if (message.trim().length < 5) { setStatus("Напишите пару слов о празднике."); return; }
    if (phone.trim().length < 6) { setStatus("Добавьте телефон, чтобы организатор смог ответить."); return; }
    if (!consent) { setStatus("Подтвердите согласие на обработку данных для ответа на заявку."); return; }
    const leadText = ["Здравствуйте! Хочу обсудить праздник.", name.trim() && `Имя: ${name.trim()}`, `Телефон: ${phone.trim()}`, `Пожелания:\n${message.trim()}`].filter(Boolean).join("\n");
    setBusy(true);
    setStatus("Отправляем запрос организатору…");
    try {
      const response = await fetch("/api/leads", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name: name.trim(), phone: phone.trim(), message: message.trim(), page: window.location.pathname, leadText, consent: true, consentVersion }) });
      if (!response.ok) throw new Error("lead_failed");
      setSent(true);
      setStatus("Запрос отправлен организатору. Скоро свяжемся с вами.");
    } catch { setStatus("Не удалось отправить запрос. Попробуйте ещё раз или позвоните нам."); }
    finally { setBusy(false); }
  }

  if (!open || typeof document === "undefined") return null;
  return createPortal(<div className="party-modal ym-hide-content" role="dialog" aria-modal="true" aria-label="Запрос организатору" onMouseDown={onClose}>
    <div className="party-modal-card" onMouseDown={(event) => event.stopPropagation()}>
      <button className="party-modal-close" type="button" onClick={onClose} aria-label="Закрыть окно">×</button>
      <span className="eyebrow">Написать организатору</span>
      <h2>Коротко расскажите о празднике</h2>
      <p>Напишите или надиктуйте пожелания — мы получим запрос и свяжемся с вами.</p>
      <label className="party-wish-label" htmlFor="party-quick-wish">Ваш запрос</label>
      <div className="party-wish-field">
        <textarea className="ym-disable-keys" id="party-quick-wish" ref={textareaRef} value={message} onChange={(event) => { setMessage(event.target.value); setSent(false); setStatus(""); }} placeholder="Например: день рождения для дочки, 6 лет, дома в субботу…" />
        {listening && <span className="party-listening-indicator">Слушаю…</span>}
        <button type="button" className={"party-dictate" + (listening ? " is-listening" : "")} onClick={dictate} aria-label={listening ? "Остановить диктовку" : "Надиктовать текст"} aria-pressed={listening} title={listening ? "Остановить диктовку" : "Надиктовать текст"}><MicIcon /></button>
      </div>
      <p className="party-voice-note">Диктовка запускается по нажатию и может использовать сервис вашего браузера.</p>
      <div className="party-send-form">
        <strong>Куда ответить?</strong>
        <div className="party-send-fields"><label>Имя<input className="ym-disable-keys" value={name} onChange={(event) => setName(event.target.value)} placeholder="Как к вам обращаться" autoComplete="name" /></label><label>Телефон<input className="ym-disable-keys" value={phone} onChange={(event) => { setPhone(event.target.value); setSent(false); }} placeholder="+7 ..." inputMode="tel" autoComplete="tel" /></label></div>
        <label className="party-consent"><input type="checkbox" checked={consent} onChange={(event) => setConsent(event.target.checked)} required /><span>Даю <a href="/personal-data-consent" target="_blank" rel="noopener noreferrer">согласие на обработку персональных данных</a> для ответа на запрос. <a href="/privacy-policy" target="_blank" rel="noopener noreferrer">Политика обработки данных</a>.</span></label>
      </div>
      <button type="button" className="party-send-brief" disabled={busy || sent} onClick={() => void sendToOrganizer()}>{busy ? "Отправляем…" : sent ? "Запрос отправлен" : "Отправить запрос организатору"}</button>
      <p className="party-modal-status" role="status">{status}</p>
    </div>
  </div>, document.body);
}

function MicIcon() { return <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><rect x="9" y="3" width="6" height="11" rx="3" /><path d="M6.5 11.5a5.5 5.5 0 0 0 11 0M12 17v3M8.5 20h7" /></svg>; }
