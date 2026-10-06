"use client";

import { FormEvent, useId, useMemo, useState } from "react";
import { phoneHref } from "./data";
import { usePartyAssistant } from "./party-assistant-widget";

const whatsappPhone = "79951219467";

type LeadFormProps = {
  label: string;
};

type LeadStatus = "idle" | "error" | "sending" | "sent" | "fallback" | "copied";

export function LeadForm({ label }: LeadFormProps) {
  const formId = useId();
  const [status, setStatus] = useState<LeadStatus>("idle");
  const [leadText, setLeadText] = useState("");

  const fields = useMemo(
    () => ({
      name: `${formId}-name`,
      phone: `${formId}-phone`,
    }),
    [formId]
  );

  async function submitLead(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const phone = String(data.get("phone") || "").trim();

    if (phone.length < 6) {
      setStatus("error");
      return;
    }

    const nextLeadText = [
      "Здравствуйте! Хочу обсудить детский праздник.",
      formatLine("Имя", data.get("name")),
      formatLine("Телефон", phone),
    ]
      .filter(Boolean)
      .join("\n");

    setLeadText(nextLeadText);
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
          message: "",
          page: window.location.pathname,
          leadText: nextLeadText
        })
      });

      if (response.ok) {
        setStatus("sent");
        form.reset();
        return;
      }

      setStatus("fallback");
    } catch {
      setStatus("fallback");
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
    <form className="lead-form" onSubmit={submitLead}>
      <div className="lead-form-grid">
        <label htmlFor={fields.name}>
          Имя
          <input id={fields.name} name="name" placeholder="Как к вам обращаться" autoComplete="name" />
        </label>
        <label htmlFor={fields.phone}>
          Телефон
          <input
            id={fields.phone}
            name="phone"
            placeholder="+7 ..."
            inputMode="tel"
            autoComplete="tel"
            aria-invalid={status === "error"}
          />
        </label>
      </div>
      <div className="lead-form-actions">
        <button type="submit" disabled={status === "sending"}>
          {status === "sending" ? "Отправляем..." : label}
        </button>
        <a href={phoneHref}>Позвонить</a>
      </div>
      {leadText && status !== "sent" && (
        <div className="lead-form-fallback" aria-label="Запасные способы отправки заявки">
          <a href={`https://wa.me/${whatsappPhone}?text=${encodeURIComponent(leadText)}`} target="_blank" rel="noreferrer">
            Отправить в WhatsApp
          </a>
          <button type="button" onClick={copyLead}>
            Скопировать заявку
          </button>
        </div>
      )}
      {status !== "idle" && <p className="lead-form-status" aria-live="polite">
        {status === "error" && "Добавьте телефон, чтобы театр смог связаться с вами."}
        {status === "sending" && "Пробуем отправить заявку через основной канал."}
        {status === "sent" && "Заявка отправлена. Если вопрос срочный, лучше сразу позвонить."}
        {status === "fallback" && "Основной канал пока не подключен. Можно позвонить, отправить текст в мессенджер или скопировать заявку."}
        {status === "copied" && "Текст заявки скопирован. Его можно отправить в любой удобный мессенджер."}
      </p>}
    </form>
  );
}

export function BriefEntry() {
  const openBrief = usePartyAssistant();

  return (
    <aside className="brief-entry" aria-label="Бриф праздника для себя">
      <button type="button" onClick={openBrief}>
        <span className="lead-brief-art" aria-hidden="true">
          <svg viewBox="0 0 74 82" fill="none">
            <rect x="11" y="5" width="48" height="64" rx="7" fill="#fff" stroke="#6A2841" strokeWidth="2" />
            <path d="M45 5v10a5 5 0 0 0 5 5h9" fill="#F9EAD8" stroke="#6A2841" strokeWidth="2" />
            <path d="M21 28h27M21 35h22M21 42h26" stroke="#D4AFC0" strokeWidth="2.5" strokeLinecap="round" />
            <rect x="26" y="52" width="44" height="23" rx="6" fill="#6A2841" />
            <text x="48" y="68" fill="white" fontFamily="Arial, sans-serif" fontSize="11" fontWeight="700" textAnchor="middle">PDF</text>
            <path d="m5 51 3 2 2 4 2-4 3-2-3-2-2-4-2 4-3 2Z" fill="#EFB952" />
          </svg>
          <span className="lead-brief-mic">
            <svg viewBox="0 0 24 24" fill="none"><rect x="9" y="3" width="6" height="11" rx="3" /><path d="M6.5 11.5a5.5 5.5 0 0 0 11 0M12 17v3M8.5 20h7" /></svg>
          </span>
        </span>
        <span className="lead-brief-copy">
          <strong>Бриф праздника в PDF для себя <span aria-hidden="true">→</span></strong>
          <span>Соберите идеи и сохраните документ без заявки и номера телефона.</span>
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
