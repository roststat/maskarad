"use client";

import Image from "next/image";
import { createContext, ReactNode, useCallback, useContext, useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { consentVersion } from "./legal-data";
import { usePathname } from "next/navigation";
import { buildOrganizerMessage, corporateGuestLabel, corporateGuestOptions, corporatePagePath, type CorporateGuestScale } from "./corporate-request-data";
import { reportLeadEvent } from "./lead-analytics";

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
type AssistantOptions = { corporate?: boolean; guests?: CorporateGuestScale };
const PartyAssistantContext = createContext<((options?: AssistantOptions) => void) | null>(null);

export function PartyAssistantProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const [corporate, setCorporate] = useState(false);
  const [guests, setGuests] = useState<CorporateGuestScale>("custom");
  const show = useCallback((options?: AssistantOptions) => {
    setCorporate(options?.corporate ?? pathname === corporatePagePath);
    if (options?.guests) setGuests(options.guests);
    setOpen(true);
  }, [pathname]);
  const close = useCallback(() => setOpen(false), []);
  return <PartyAssistantContext.Provider value={show}>{children}<PartyAssistantDialog open={open} onClose={close} corporate={corporate} guests={guests} onGuestsChange={setGuests} /></PartyAssistantContext.Provider>;
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
  return <button className={"party-assistant-trigger" + (hasScrolled ? " is-scrolled" : "")} type="button" onClick={() => show()} aria-label="Написать организатору">
    <Image className="brand-mark-image" src="/images/legacy/maskarad-mask-transparent.png" alt="" width={1282} height={1227} sizes="43px" priority />
    <span className="party-assistant-badge" aria-hidden="true"><MicIcon /></span>
    <span className="party-assistant-hint"><span className="party-assistant-hint-text">Расскажите о празднике</span><span className="party-assistant-equalizer" aria-hidden="true"><i /><i /><i /></span></span>
  </button>;
}

function PartyAssistantDialog({ open, onClose, corporate, guests, onGuestsChange }: {
  open: boolean;
  onClose: () => void;
  corporate: boolean;
  guests: CorporateGuestScale;
  onGuestsChange: (guests: CorporateGuestScale) => void;
}) {
  const [message, setMessage] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [consent, setConsent] = useState(false);
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState(false);
  const [status, setStatus] = useState("");
  const [listening, setListening] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editStatus, setEditStatus] = useState("");
  const [editError, setEditError] = useState(false);
  const [originalMessage, setOriginalMessage] = useState<string | null>(null);
  const editRequestRef = useRef<AbortController | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<Recognition | null>(null);

  useLayoutEffect(() => {
    const textarea = textareaRef.current;
    if (!open || !textarea) return;
    const fitText = () => {
      textarea.style.height = "auto";
      textarea.style.height = `${textarea.scrollHeight + textarea.offsetHeight - textarea.clientHeight}px`;
    };
    fitText();
    window.addEventListener("resize", fitText);
    return () => window.removeEventListener("resize", fitText);
  }, [message, open]);

  useEffect(() => {
    if (!open) return;
    const previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    setSent(false);
    setStatus("");
    setEditStatus("");
    textareaRef.current?.focus();
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
      if (event.key !== "Tab") return;
      const elements = cardRef.current?.querySelectorAll<HTMLElement>('button:not(:disabled), input:not(:disabled), select:not(:disabled), textarea:not(:disabled), a[href]');
      if (!elements?.length) return;
      const first = elements[0];
      const last = elements[elements.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      editRequestRef.current?.abort();
      editRequestRef.current = null;
      setEditing(false);
      recognitionRef.current?.stop();
      recognitionRef.current = null;
      setListening(false);
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
      previousFocus?.focus();
    };
  }, [open, onClose]);

  useEffect(() => { setSent(false); setStatus(""); }, [corporate, guests]);

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

  async function editText() {
    if (editing || busy || listening) return;
    const original = message;
    if (!original.trim()) {
      setEditError(true);
      setEditStatus("Сначала напишите или наговорите пожелания как получится — можно одним потоком, без структуры. ИИ поможет красиво оформить текст.");
      textareaRef.current?.focus();
      return;
    }
    const controller = new AbortController();
    editRequestRef.current = controller;
    setEditing(true);
    setEditError(false);
    setEditStatus("ИИ оформляет ваши пожелания…");
    try {
      const response = await fetch("/api/text-edit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: original }),
        signal: AbortSignal.any([controller.signal, AbortSignal.timeout(35000)])
      });
      const result = await response.json() as { ok?: boolean; text?: string };
      if (!response.ok || !result.ok || typeof result.text !== "string" || !result.text.trim()) throw new Error("edit_failed");
      if (editRequestRef.current !== controller) return;
      setOriginalMessage(original);
      setMessage(result.text);
      setSent(false);
      setStatus("");
      setEditStatus("Текст оформлен. Проверьте пожелания — можно поправить их перед отправкой.");
    } catch {
      if (controller.signal.aborted || editRequestRef.current !== controller) return;
      setEditError(true);
      setEditStatus("Не удалось оформить текст. Ваши пожелания сохранены — попробуйте ещё раз или отправьте их как есть.");
    } finally {
      if (editRequestRef.current === controller) { editRequestRef.current = null; setEditing(false); }
    }
  }

  async function sendToOrganizer() {
    if (message.trim().length < 5) { setStatus("Напишите пару слов о празднике."); return; }
    if (phone.trim().length < 6) { setStatus("Добавьте телефон, чтобы организатор смог ответить."); return; }
    if (!consent) { setStatus("Подтвердите согласие на обработку данных для ответа на заявку."); return; }
    const requestMessage = buildOrganizerMessage(message, corporate, guests);
    const leadText = ["Здравствуйте! Хочу обсудить праздник.", name.trim() && `Имя: ${name.trim()}`, `Телефон: ${phone.trim()}`, `Пожелания:\n${requestMessage}`].filter(Boolean).join("\n");
    setBusy(true);
    setStatus("Отправляем запрос организатору…");
    try {
      const response = await fetch("/api/leads", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name: name.trim(), phone: phone.trim(), message: requestMessage, page: window.location.pathname, leadText, consent: true, consentVersion }) });
      if (!response.ok) throw new Error("lead_failed");
      setSent(true);
      setStatus("Запрос отправлен организатору. Скоро свяжемся с вами.");
      if (corporate) reportLeadEvent("lead_saved", "corporate_new_year");
    } catch { setStatus("Не удалось отправить запрос. Попробуйте ещё раз или позвоните нам."); if (corporate) reportLeadEvent("lead_error", "corporate_new_year"); }
    finally { setBusy(false); }
  }

  if (!open || typeof document === "undefined") return null;
  return createPortal(<div className="party-modal ym-hide-content" role="dialog" aria-modal="true" aria-label="Запрос организатору" onMouseDown={onClose}>
    <div className="party-modal-card" ref={cardRef} onMouseDown={(event) => event.stopPropagation()}>
      <button className="party-modal-close" type="button" onClick={onClose} aria-label="Закрыть окно">×</button>
      <span className="eyebrow">Написать организатору</span>
      <h2>Коротко расскажите о празднике</h2>
      <p>Напишите или надиктуйте пожелания — мы получим запрос и свяжемся с вами.</p>
      {corporate && <div className="party-guest-field">
        <label htmlFor="party-guest-count">Количество гостей</label>
        <select id="party-guest-count" value={guests} disabled={busy || editing} onChange={(event) => { onGuestsChange(event.target.value as CorporateGuestScale); reportLeadEvent("program_select", "corporate_new_year"); }}>
          {corporateGuestOptions.map(option => <option key={option.id} value={option.id}>{option.label}</option>)}
        </select>
        <span>Общее число гостей, включая взрослых. Число и возраст детей уточним отдельно.</span>
        <p id="party-guest-hint" aria-live="polite">{guests === "custom" ? "Корпоративная ёлка: количество гостей уточним при обсуждении." : `Корпоративная ёлка: ${corporateGuestLabel(guests).toLowerCase()}.`} Укажите дату, площадку, число и возраст детей и пожелания к программе.</p>
      </div>}
      <label className="party-wish-label" htmlFor="party-quick-wish">Ваш запрос</label>
      <div className="party-wish-field">
        <textarea className="ym-disable-keys" id="party-quick-wish" ref={textareaRef} rows={4} value={message} maxLength={1200} disabled={busy || editing} aria-busy={editing} aria-describedby={[corporate ? "party-guest-hint" : "", editStatus ? "party-edit-status" : ""].filter(Boolean).join(" ") || undefined} onChange={(event) => { setMessage(event.target.value); setOriginalMessage(null); setEditStatus(""); setSent(false); setStatus(""); }} placeholder={corporate ? `Корпоративная ёлка${guests === "custom" ? "" : ` — ${corporateGuestLabel(guests).toLowerCase()}`}. Дата, площадка, число и возраст детей, пожелания…` : "Например: день рождения для дочки, 6 лет, дома в субботу…"} />
        <div className="party-wish-tools" role="group" aria-label="Помощь с текстом">
          {listening && <span className="party-listening-indicator">Слушаю…</span>}
          <button type="button" className="party-ai-edit" disabled={editing || busy || listening} onClick={() => void editText()}><span aria-hidden="true">✦</span>{editing ? "ИИ правит…" : "ИИ правка текста"}</button>
          <button type="button" className={"party-dictate" + (listening ? " is-listening" : "")} disabled={editing || busy} onClick={dictate} aria-label={listening ? "Остановить диктовку" : "Надиктовать текст"} aria-pressed={listening} title={listening ? "Остановить диктовку" : "Надиктовать текст"}><MicIcon /></button>
        </div>
      </div>
      {editStatus && <p className={"party-edit-status" + (editError ? " is-error" : "")} id="party-edit-status" role={editError ? "alert" : "status"}>{editStatus}</p>}
      {originalMessage !== null && <button type="button" className="party-edit-undo" disabled={editing || busy} onClick={() => { setMessage(originalMessage); setOriginalMessage(null); setEditError(false); setEditStatus("Исходный текст возвращён."); setSent(false); }}>Вернуть исходный текст</button>}
      <div className="party-send-form">
        <strong>Куда ответить?</strong>
        <div className="party-send-fields"><label>Имя<input className="ym-disable-keys" value={name} onChange={(event) => setName(event.target.value)} placeholder="Как к вам обращаться" autoComplete="name" /></label><label>Телефон<input className="ym-disable-keys" value={phone} onChange={(event) => { setPhone(event.target.value); setSent(false); }} placeholder="+7 ..." inputMode="tel" autoComplete="tel" /></label></div>
        <label className="party-consent"><input type="checkbox" checked={consent} onChange={(event) => setConsent(event.target.checked)} required /><span>Даю <a href="/personal-data-consent" target="_blank" rel="noopener noreferrer">согласие на обработку персональных данных</a> для ответа на запрос. <a href="/privacy-policy" target="_blank" rel="noopener noreferrer">Политика обработки данных</a>.</span></label>
      </div>
      <button type="button" className="party-send-brief" disabled={busy || sent || editing} onClick={() => void sendToOrganizer()}>{busy ? "Отправляем…" : sent ? "Запрос отправлен" : "Отправить запрос организатору"}</button>
      <p className="party-modal-status" role="status">{status}</p>
    </div>
  </div>, document.body);
}

function MicIcon() { return <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><rect x="9" y="3" width="6" height="11" rx="3" /><path d="M6.5 11.5a5.5 5.5 0 0 0 11 0M12 17v3M8.5 20h7" /></svg>; }
