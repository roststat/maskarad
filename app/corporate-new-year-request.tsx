"use client";

import { useState } from "react";
import { BriefEntry, LeadForm } from "./lead-form";
import { reportLeadEvent } from "./lead-analytics";

const formats = [
  { id: "small", title: "Камерная ёлка", guests: "До 100 гостей", text: "Авторская программа со спектаклем и развлекательными зонами для небольшой компании." },
  { id: "medium", title: "Ёлка для компании", guests: "До 250–300 гостей", text: "Спектакль и развлекательные зоны: состав программы согласуем под масштаб вашего события." },
  { id: "large", title: "Масштабный праздник", guests: "Более 500 гостей", text: "Индивидуальная программа для большого события: спектакли и развлекательные зоны." },
] as const;

export function CorporateNewYearRequest() {
  const [selected, setSelected] = useState<string>("custom");
  const format = formats.find((item) => item.id === selected);
  const selectedText = format ? `${format.title}, ${format.guests.toLowerCase()}` : "Масштаб уточним при обсуждении";

  return (
    <section className="ny-request" id="zayavka" aria-labelledby="ny-request-title">
      <div className="intro">
        <span className="eyebrow">Под масштаб вашей компании</span>
        <h2 id="ny-request-title">От камерной ёлки до большого праздника</h2>
        <p>Все программы авторские: спектакли и развлекательные зоны. Выберите ориентир — состав и бюджет согласуем индивидуально.</p>
      </div>
      <div className="ny-format-options" role="group" aria-label="Масштаб корпоративной ёлки">
        {formats.map((item) => (
          <button key={item.id} type="button" aria-pressed={selected === item.id} onClick={() => { setSelected(item.id); reportLeadEvent("program_select", "corporate_new_year"); }}>
            <span className="ny-format-guests">{item.guests}</span>
            <strong>{item.title}</strong>
            <span>{item.text}</span>
            <span className="ny-format-choice">{selected === item.id ? "Выбрано" : "Выбрать этот масштаб"}</span>
          </button>
        ))}
      </div>
      <p className="ny-format-note">Это ориентиры по общему числу гостей, включая взрослых. Число и возраст детей уточним отдельно. Если у вас 300–500 гостей или количество ещё неизвестно, подберём программу индивидуально.</p>
      <button className="ny-custom-choice" type="button" aria-pressed={selected === "custom"} onClick={() => setSelected("custom")}>Уточнить масштаб с организатором</button>
      <div className="cta-panel ny-request-panel">
        <div>
          <span className="eyebrow">Индивидуальное предложение</span>
          <h2>Соберём ёлку под вашу компанию</h2>
          <p>Оставьте контакт — обсудим дату, площадку, число гостей и детей, затем согласуем состав и расчёт.</p>
          <p className="ny-selected-summary" aria-live="polite">Ваш запрос: {selectedText}.</p>
        </div>
        <LeadForm
          label="Получить предложение"
          message={`Корпоративная ёлка для детей сотрудников. ${selectedText}. Состав и бюджет — индивидуально.`}
          eventCategory="corporate_new_year"
          successText="Запрос на корпоративную ёлку отправлен. При обсуждении уточним дату, площадку, число гостей и детей, затем подготовим индивидуальное предложение. Если вопрос срочный, позвоните нам."
        />
      </div>
      <BriefEntry />
    </section>
  );
}
