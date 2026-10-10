"use client";

import { BriefEntry, LeadForm } from "./lead-form";
import { reportLeadEvent } from "./lead-analytics";
import { corporateFormats } from "./corporate-request-data";
import { usePartyAssistant } from "./party-assistant-widget";

export function CorporateNewYearRequest() {
  const open = usePartyAssistant();

  return (
    <section className="ny-request" id="zayavka" aria-labelledby="ny-request-title">
      <div className="intro">
        <span className="eyebrow">Под масштаб вашей компании</span>
        <h2 id="ny-request-title">От камерной ёлки до большого праздника</h2>
        <p>Все программы авторские: спектакли и развлекательные зоны. Нажмите на подходящий вариант — обсудим состав и бюджет с организатором.</p>
      </div>
      <div className="ny-format-options" role="group" aria-label="Масштаб корпоративной ёлки">
        {corporateFormats.map((item) => (
          <button key={item.id} type="button" aria-haspopup="dialog" onClick={() => { open({ corporate: true, guests: item.id }); reportLeadEvent("program_select", "corporate_new_year"); }}>
            <span className="ny-format-guests">{item.guests}</span>
            <strong>{item.title}</strong>
            <span>{item.text}</span>
          </button>
        ))}
      </div>
      <p className="ny-format-note">Это ориентиры по общему числу гостей, включая взрослых. Число и возраст детей уточним отдельно. Если у вас 300–500 гостей или количество ещё неизвестно, подберём программу индивидуально.</p>
      <div className="cta-panel ny-request-panel">
        <div>
          <span className="eyebrow">Индивидуальное предложение</span>
          <h2>Соберём ёлку под вашу компанию</h2>
          <p>Оставьте контакт — обсудим ваш праздник и подготовим индивидуальное предложение.</p>
        </div>
        <LeadForm
          label="Отправить заявку"
          message="Корпоративная ёлка для детей сотрудников. Состав и бюджет — индивидуально."
          eventCategory="corporate_new_year"
          successText="Запрос на корпоративную ёлку отправлен. При обсуждении уточним дату, площадку, число гостей и детей, затем подготовим индивидуальное предложение. Если вопрос срочный, позвоните нам."
        />
      </div>
      <BriefEntry />
    </section>
  );
}
