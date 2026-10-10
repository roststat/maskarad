export const corporatePagePath = "/prazdniki/korporativnyy-novogodniy-prazdnik";

export function corporateMessageIntro(scale: CorporateGuestScale) {
  return scale === "custom"
    ? "Планируем корпоративную ёлку для детей сотрудников."
    : `Планируем корпоративную ёлку для детей сотрудников: ${corporateGuestLabel(scale).toLowerCase()}, включая взрослых.`;
}

export const corporateGuestOptions = [
  { id: "custom", label: "Пока не знаю — обсудим" },
  { id: "small", label: "До 100 гостей" },
  { id: "medium", label: "До 250–300 гостей" },
  { id: "between", label: "300–500 гостей" },
  { id: "large", label: "Более 500 гостей" }
] as const;

export type CorporateGuestScale = typeof corporateGuestOptions[number]["id"];

export const corporateFormats = [
  { id: "small", title: "Камерная ёлка", guests: "До 100 гостей", text: "Авторская программа со спектаклем и развлекательными зонами для небольшой компании." },
  { id: "medium", title: "Ёлка для компании", guests: "До 250–300 гостей", text: "Спектакль и развлекательные зоны: состав программы согласуем под масштаб вашего события." },
  { id: "large", title: "Масштабный праздник", guests: "Более 500 гостей", text: "Индивидуальная программа для большого события: спектакли и развлекательные зоны." }
] as const;

export function corporateGuestLabel(scale: CorporateGuestScale) {
  return corporateGuestOptions.find(item => item.id === scale)!.label;
}

export function buildOrganizerMessage(message: string, corporate: boolean, scale: CorporateGuestScale) {
  if (!corporate) return message.trim();
  return [
    "Корпоративная ёлка для детей сотрудников.",
    `Количество гостей: ${scale === "custom" ? "уточним при обсуждении" : corporateGuestLabel(scale).toLowerCase()}.`,
    message.trim()
  ].filter(Boolean).join("\n");
}
