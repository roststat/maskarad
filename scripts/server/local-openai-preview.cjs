// Load only the existing site's OpenAI connection into local process memory.
// This script never writes credentials to a file or prints their values.
const { execFileSync, spawn } = require('node:child_process');
const { openSync, closeSync } = require('node:fs');
const remoteCode = 'const fs=require("fs");const text=fs.readFileSync("/opt/maskarad/app/.env.production","utf8");const result={};for(const line of text.split(/\\r?\\n/)){const match=line.match(/^(OPENAI_API_KEY|OPENAI_BASE_URL|OPENAI_BRIEF_MODEL)\\s*=\\s*(.*)$/);if(!match)continue;let value=match[2].trim();const quote=value.charCodeAt(0);if((quote===34||quote===39)&&value.charCodeAt(value.length-1)===quote)value=value.slice(1,-1);if(value)result[match[1]]=value;}process.stdout.write(JSON.stringify(result));';
let config;
try {
  const response = execFileSync('ssh', ['-p', '2222', '-o', 'BatchMode=yes', '-o', 'ConnectTimeout=10', 'avtozabota-test', "node -e '" + remoteCode + "'"], { encoding: 'utf8', timeout: 20000, stdio: ['ignore', 'pipe', 'pipe'] });
  config = JSON.parse(response);
  if (!config.OPENAI_API_KEY) throw new Error('not_configured');
} catch {
  console.error('Existing OpenAI connection could not be loaded. No credentials printed or saved.');
  process.exit(1);
}
const detached = process.argv.includes('--detach');
const log = detached ? openSync('/tmp/maskarad-local-preview.log', 'a', 0o600) : null;
const child = spawn(process.execPath, ['node_modules/next/dist/bin/next', 'start', '--port', '4310'], {
  cwd: process.cwd(), env: { ...process.env, ...config }, detached,
  stdio: detached ? ['ignore', log, log] : 'inherit'
});
if (detached) {
  closeSync(log);
  child.unref();
  console.log('Local preview started on 4310. Existing OpenAI connection is in process memory only.');
} else {
  process.on('SIGTERM', () => child.kill('SIGTERM'));
  process.on('SIGINT', () => child.kill('SIGINT'));
  child.on('exit', code => process.exit(code || 0));
}
