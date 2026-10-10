// Contract checks: no real provider calls or lead submissions.
const fs = require('node:fs');
const assert = require('node:assert/strict');
const ts = require('typescript');
const { NextResponse } = require('next/server');

function load(filename, dependencies) {
  const code = ts.transpileModule(fs.readFileSync(filename, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText;
  const module = { exports: {} };
  new Function('require', 'module', 'exports', code)(name => dependencies[name], module, module.exports);
  return module.exports;
}
const corporate = load('app/corporate-request-data.ts', {});
const success = text => Response.json({ status: 'completed', output: [{ content: [{ type: 'output_text', text }] }] });
const draft = 'будем отдыхать на природе нужен полный расклад';
const request = payload => new Request('https://site.test/api/text-edit', { method: 'POST', headers: { Origin: 'https://site.test', 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
const originalFetch = global.fetch;
const originalKey = process.env.OPENAI_API_KEY;
const originalWarn = console.warn;
const diagnostics = [];
console.warn = (...args) => diagnostics.push(args);
process.env.OPENAI_API_KEY = 'fixture-not-a-real-key';
function route(alternate = () => { throw new Error('unexpected_alternate_request'); }) {
  return load('app/api/text-edit/route.ts', { 'next/server': { NextResponse }, '../../corporate-request-data': corporate, './alternate-dns': { requestWithAlternateDns: alternate } }).POST;
}

(async () => {
  let passed = 0;
  global.fetch = () => { throw new Error('validation_should_not_call_provider'); };
  const validation = route();
  for (const [payload, error] of [[{ text: '' }, 'text_required'], [{ text: draft, context: { event: 'corporate_new_year', guests: 'fake' } }, 'invalid_context'], [{ text: draft, context: { event: 'fake', guests: 'medium' } }, 'invalid_context']]) {
    const response = await validation(request(payload));
    assert.equal(response.status, 400); assert.equal((await response.json()).error, error); passed++;
  }
  let sent;
  global.fetch = async (url, options) => { sent = JSON.parse(options.body); return success('Хотим провести праздник на природе. Пришлите подробное предложение.'); };
  const response = await route()(request({ text: draft, context: { event: 'corporate_new_year', guests: 'medium' }, name: 'PRIVATE_NAME', phone: 'PRIVATE_PHONE' }));
  const edited = await response.json();
  assert.equal(response.status, 200);
  assert.match(edited.text, /до 250–300 гостей, включая взрослых/);
  assert.match(sent.instructions, /НЕ число детей/);
  assert.equal(sent.input, draft);
  assert.ok(!JSON.stringify(sent).includes('PRIVATE_')); passed++;

  const generic = await route()(request({ text: draft }));
  assert.ok(!(await generic.json()).text.includes('корпоративную')); passed++;
  const unknown = await route()(request({ text: draft, context: { event: 'corporate_new_year', guests: 'custom' } }));
  assert.ok(!(await unknown.json()).text.includes('250')); passed++;

  let standardCalls = 0, alternateCalls = 0;
  global.fetch = async () => { standardCalls++; throw new TypeError('fetch failed', { cause: { code: 'UND_ERR_CONNECT_TIMEOUT' } }); };
  const recovered = route(async () => { alternateCalls++; return success('Проведём праздник на природе.'); });
  assert.equal((await recovered(request({ text: draft }))).status, 200);
  assert.equal((await recovered(request({ text: draft }))).status, 200);
  assert.equal(standardCalls, 1); assert.equal(alternateCalls, 2); passed++;

  let calls = 0;
  global.fetch = async () => ++calls === 1 ? new Response('unavailable', { status: 503 }) : success('Проведём праздник на природе.');
  assert.equal((await route()(request({ text: draft }))).status, 200); assert.equal(calls, 2); passed++;

  const budgets = [];
  global.fetch = async (url, options) => { budgets.push(JSON.parse(options.body).max_output_tokens); return budgets.length === 1 ? Response.json({ status: 'incomplete', output_text: 'Обрыв' }) : success('Полный ответ.'); };
  assert.equal((await route()(request({ text: draft }))).status, 200); assert.deepEqual(budgets, [2000, 4000]); passed++;

  calls = 0;
  global.fetch = async () => { calls++; return success('x'.repeat(1201)); };
  const invalid = await route()(request({ text: draft }));
  assert.equal(invalid.status, 502); assert.equal(calls, 2); assert.equal((await invalid.json()).error, 'editor_invalid_response'); passed++;
  assert.ok(!JSON.stringify(diagnostics).includes(draft));
  assert.ok(!JSON.stringify(diagnostics).includes(process.env.OPENAI_API_KEY));
  console.log(`Text editor contract checks passed: ${passed}/10 (context, validation, retry, alternate DNS, incomplete/oversized output, safe diagnostics).`);
})().catch(error => { console.error(error); process.exitCode = 1; }).finally(() => {
  global.fetch = originalFetch; console.warn = originalWarn;
  if (originalKey === undefined) delete process.env.OPENAI_API_KEY; else process.env.OPENAI_API_KEY = originalKey;
});
