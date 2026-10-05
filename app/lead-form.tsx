"use client";

import { FormEvent, useId, useMemo, useState } from "react";
import { phoneHref } from "./data";

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
      occasion: `${formId}-occasion`,
      date: `${formId}-date`,
      age: `${formId}-age`,
      location: `${formId}-location`,
      message: `${formId}-message`
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
      formatLine("Формат", data.get("occasion")),
      formatLine("Дата", data.get("date")),
      formatLine("Возраст детей", data.get("age")),
      formatLine("Площадка", data.get("location")),
      formatLine("Комментарий", data.get("message"))
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
          occasion: String(data.get("occasion") || "").trim(),
          date: String(data.get("date") || "").trim(),
          age: String(data.get("age") || "").trim(),
          location: String(data.get("location") || "").trim(),
          message: String(data.get("message") || "").trim(),
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
        <label htmlFor={fields.occasion}>
          Формат
          <select id={fields.occasion} name="occasion" defaultValue="">
            <option value="" disabled>
              Что планируете
            </option>
            <option>День рождения</option>
            <option>Спектакль</option>
            <option>Детский сад</option>
            <option>Школа</option>
            <option>Выпускной</option>
            <option>Новогодний праздник</option>
            <option>Другое</option>
          </select>
        </label>
        <label htmlFor={fields.date}>
          Дата
          <input id={fields.date} name="date" placeholder="Например, 20 октября" />
        </label>
        <label htmlFor={fields.age}>
          Возраст детей
          <input id={fields.age} name="age" placeholder="Например, 5-7 лет" />
        </label>
        <label htmlFor={fields.location}>
          Площадка
          <input id={fields.location} name="location" placeholder="Дом, сад, школа, ресторан..." />
        </label>
      </div>
      <label htmlFor={fields.message}>
        Комментарий
        <textarea id={fields.message} name="message" placeholder="Любимая тема, количество детей, пожелания..." />
      </label>
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
      <p className="lead-form-status" aria-live="polite">
        {status === "error" && "Добавьте телефон, чтобы театр смог связаться с вами."}
        {status === "sending" && "Пробуем отправить заявку через основной канал."}
        {status === "sent" && "Заявка отправлена. Если вопрос срочный, лучше сразу позвонить."}
        {status === "fallback" && "Основной канал пока не подключен. Можно позвонить, отправить текст в мессенджер или скопировать заявку."}
        {status === "copied" && "Текст заявки скопирован. Его можно отправить в любой удобный мессенджер."}
        {status === "idle" && "Заявка уйдет через основной канал сайта. Для срочного заказа лучше позвонить."}
      </p>
    </form>
  );
}

function formatLine(label: string, value: FormDataEntryValue | null) {
  const text = String(value || "").trim();
  return text ? `${label}: ${text}` : "";
}
