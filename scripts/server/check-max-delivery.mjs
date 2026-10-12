import assert from "node:assert/strict";
import { formatMaxLead, sendLeadToMax } from "../../app/api/leads/max.ts";

const lead = {
  id: "11111111-1111-4111-8111-111111111111",
  name: "Тест",
  phone: "+7 000 000-00-00",
  message: "Синтетическая заявка без реальных персональных данных.",
  page: "/test",
  createdAt: "2026-10-12T10:00:00.000Z"
};

assert.equal((await sendLeadToMax(lead, { env: {} })).status, "disabled");
assert.equal((await sendLeadToMax(lead, { env: { MAX_BOT_TOKEN: "abcdefghijklmnopqrstuvwxyz", MAX_CHAT_ID: "", MAX_USER_ID: "" } })).status, "failed");
assert.equal((await sendLeadToMax(lead, { env: { MAX_BOT_TOKEN: "abcdefghijklmnopqrstuvwxyz", MAX_CHAT_ID: "1", MAX_USER_ID: "2" } })).status, "failed");

let request;
const result = await sendLeadToMax(lead, {
  env: {
    MAX_BOT_TOKEN: "abcdefghijklmnopqrstuvwxyz",
    MAX_CHAT_ID: "1234567890"
  },
  fetchImpl: async (url, init) => {
    request = { url, init };
    return new Response(JSON.stringify({ message: { body: { mid: "mid.73" } } }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  }
});

assert.deepEqual(result, { status: "sent", messageId: "mid.73" });
assert.equal(request.url, "https://platform-api2.max.ru/messages?disable_link_preview=true&chat_id=1234567890");
assert.equal(request.init.headers.Authorization, "abcdefghijklmnopqrstuvwxyz");
const body = JSON.parse(request.init.body);
assert.equal(body.notify, true);
assert.match(body.text, /Новая заявка с сайта/);
assert.match(body.text, /Синтетическая заявка/);
assert.equal(formatMaxLead({ ...lead, message: "я".repeat(5000) }).length, 4000);

const direct = await sendLeadToMax(lead, {
  env: { MAX_BOT_TOKEN: "abcdefghijklmnopqrstuvwxyz", MAX_USER_ID: "987654321" },
  fetchImpl: async (url) => {
    assert.match(String(url), /user_id=987654321/);
    return new Response(JSON.stringify({ message: {} }), { status: 200 });
  }
});
assert.equal(direct.status, "sent");

const rejected = await sendLeadToMax(lead, {
  env: { MAX_BOT_TOKEN: "abcdefghijklmnopqrstuvwxyz", MAX_CHAT_ID: "12345" },
  fetchImpl: async () => new Response(JSON.stringify({ code: "unauthorized" }), { status: 401 })
});
assert.deepEqual(rejected, { status: "failed", reason: "request_failed" });

console.log("MAX lead delivery contract passed without external requests.");
