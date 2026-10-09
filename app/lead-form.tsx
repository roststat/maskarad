"use client";

import { FormEvent, useId, useMemo, useRef, useState } from "react";
import { phoneHref } from "./data";
import { consentVersion } from "./legal-data";
import { usePartyAssistant } from "./party-assistant-widget";
import { reportLeadEvent } from "./lead-analytics";

type LeadFormProps = {
  label: string;
  message?: string;
  successText?: string;
  eventCategory?: "corporate_new_year";
};

type LeadStatus = "idle" | "error" | "sending" | "sent" | "fallback" | "copied";

export function LeadForm({ label, message = "", successText, eventCategory }: LeadFormProps) {
  const formId = useId();
  const [status, setStatus] = useState<LeadStatus>("idle");
  const [leadText, setLeadText] = useState("");
  const [consent, setConsent] = useState(false);
  const submitting = useRef(false);

  const fields = useMemo(
    () => ({
      name: `${formId}-name`,
      phone: `${formId}-phone`,
    }),
    [formId]
  );

  async function submitLead(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitting.current) return;
    const form = event.currentTarget;
    const data = new FormData(form);
    const phone = String(data.get("phone") || "").trim();

    if (phone.length < 6) {
      setStatus("error");
      return;
    }
    if (!consent) {
      setStatus("error");
      return;
    }

    const nextLeadText = [
      message || "Здравствуйте! Хочу обсудить детский праздник.",
      formatLine("Имя", data.get("name")),
      formatLine("Телефон", phone),
    ]
      .filter(Boolean)
      .join("\n");

    setLeadText(nextLeadText);
    submitting.current = true;
    setStatus("sending");

    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          name: String(data.get("name") || "").trim(),
          phone,
          message,
          page: window.location.pathname,
          leadText: nextLeadText,
          consent: true,
          consentVersion
        })
      });

      if (response.ok) {
        setStatus("sent");
        form.reset();
        setConsent(false);
        if (eventCategory) reportLeadEvent("lead_saved", eventCategory);
        return;
      }

      setStatus("fallback");
      if (eventCategory) reportLeadEvent("lead_error", eventCategory);
    } catch {
      setStatus("fallback");
      if (eventCategory) reportLeadEvent("lead_error", eventCategory);
    } finally {
      submitting.current = false;
    }
  }

  async function copyLead() {
    if (!leadText) return;

    try {
      await navigator.clipboard.writeText(leadText);
      setStatus("copied");
    } catch {
      setStatus("fallback");
    }
  }

  return (
    <form className="lead-form ym-hide-content" onSubmit={submitLead} onChange={() => { if (status === "sent") setStatus("idle"); }}>
      <div className="lead-form-grid">
        <label htmlFor={fields.name}>
          Имя
          <input className="ym-disable-keys" id={fields.name} name="name" placeholder="Как к вам обращаться" autoComplete="name" />
        </label>
        <label htmlFor={fields.phone}>
          Телефон
          <input
            className="ym-disable-keys"
            id={fields.phone}
            name="phone"
            placeholder="+7 ..."
            inputMode="tel"
            autoComplete="tel"
            aria-invalid={status === "error"}
          />
        </label>
      </div>
      <label className="lead-consent">
        <input type="checkbox" checked={consent} onChange={(event) => { setConsent(event.target.checked); setStatus("idle"); }} required />
        <span>Даю <a href="/personal-data-consent" target="_blank" rel="noopener noreferrer">согласие на обработку персональных данных</a> для ответа на заявку. <a href="/privacy-policy" target="_blank" rel="noopener noreferrer">Политика обработки данных</a>.</span>
      </label>
      <div className="lead-form-actions">
        <button type="submit" disabled={status === "sending" || status === "sent"}>
          {status === "sending" ? "Отправляем..." : label}
        </button>
        <a href={phoneHref}>Позвонить</a>
      </div>
      {leadText && status !== "sent" && (
        <div className="lead-form-fallback" aria-label="Запасные способы отправки заявки">
          <button type="button" onClick={copyLead}>
            Скопировать заявку
          </button>
        </div>
      )}
      {status !== "idle" && <p className="lead-form-status" aria-live="polite">
        {status === "error" && "Укажите телефон и подтвердите согласие на обработку данных."}
        {status === "sending" && "Пробуем отправить заявку через основной канал."}
        {status === "sent" && (successText || "Заявка отправлена. Если вопрос срочный, лучше сразу позвонить.")}
        {status === "fallback" && "Не удалось сохранить заявку. Позвоните нам или скопируйте текст для себя."}
        {status === "copied" && "Текст заявки скопирован. Его можно отправить в любой удобный мессенджер."}
      </p>}
    </form>
  );
}

export function BriefEntry() {
  const openBrief = usePartyAssistant();

  return (
    <aside className="brief-entry" aria-label="Написать организатору о празднике">
      <button type="button" onClick={openBrief}>
        <span className="lead-brief-copy">
          <strong>Написать организатору <span aria-hidden="true">→</span></strong>
          <span>Коротко расскажите о празднике текстом или голосом и отправьте запрос.</span>
          <span className="lead-brief-hint">Можно надиктовать <span className="lead-brief-equalizer" aria-hidden="true"><i /><i /><i /></span></span>
        </span>
      </button>
    </aside>
  );
}

function formatLine(label: string, value: FormDataEntryValue | null) {
  const text = String(value || "").trim();
  return text ? `${label}: ${text}` : "";
}
