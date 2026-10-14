import { readFileSync } from "node:fs";

const source = readFileSync(new URL("../../app/legal-data.ts", import.meta.url), "utf8");
const unfinished = [
  ["оператор", /operator:\s*"\[/],
  ["регистрационный номер оператора", /registryNumber:\s*"\[/],
  ["основание внесения в реестр", /registryBasis:\s*"\[/],
  ["адрес оператора", /address:\s*"\[/],
  ["email оператора", /email:\s*"\[/],
  ["телефон оператора", /phone:\s*"\[/],
  ["хранилище заявок", /leadStorage:\s*"\[/],
  ["канал доставки заявок", /leadDelivery:\s*"\[/],
  ["срок хранения", /retention:\s*"\[/],
  ["дата утверждения", /effectiveDate:\s*"\[/],
  ["версия согласия", /consentVersion\s*=\s*"[^"]*draft/],
  ["подтверждение публикации оператором", /approvedForPublication:\s*false/]
].filter(([, pattern]) => pattern.test(source)).map(([name]) => name);

if (unfinished.length) {
  console.error(`Юридические документы не готовы к публикации: ${unfinished.join(", ")}.`);
  process.exit(1);
}

console.log("Юридические реквизиты заполнены; подтвердите также маршрут заявки и обязанности оператора перед публикацией.");
