import { readFileSync } from "node:fs";

const source = readFileSync(new URL("../../app/legal-data.ts", import.meta.url), "utf8");
const unfinished = [
  ["адрес оператора", /address:\s*"\[/],
  ["email оператора", /email:\s*"\[/],
  ["хранилище заявок", /leadStorage:\s*"\[/],
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
