/*
[Script]
gpt_ai_panel = type=generic, timeout=20, script-path=https://raw.githubusercontent.com/ocd0711/Profiles/master/Surge/Js/gpt_ai_panel.js, argument=icon=lasso.and.sparkles&iconerr=xmark.seal.fill&icon-color=#336FA9&iconerr-color=#D65C51

[Panel]
gpt_ai_panel = script-name=gpt_ai_panel, update-interval=600
*/

const BASE_UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36';
const commonHeaders = { 'User-Agent': BASE_UA };
const panelArgs = parseArgument(typeof $argument !== 'undefined' ? $argument : '');
const CHATGPT_SUPPORTED_REGIONS = new Set([
  'T1', 'XX', 'AL', 'DZ', 'AD', 'AO', 'AG', 'AR', 'AM', 'AU', 'AT', 'AZ',
  'BS', 'BD', 'BB', 'BE', 'BZ', 'BJ', 'BT', 'BA', 'BW', 'BR', 'BG', 'BF',
  'CV', 'CA', 'CL', 'CO', 'KM', 'CR', 'HR', 'CY', 'DK', 'DJ', 'DM', 'DO',
  'EC', 'SV', 'EE', 'FJ', 'FI', 'FR', 'GA', 'GM', 'GE', 'DE', 'GH', 'GR',
  'GD', 'GT', 'GN', 'GW', 'GY', 'HT', 'HN', 'HU', 'IS', 'IN', 'ID', 'IQ',
  'IE', 'IL', 'IT', 'JM', 'JP', 'JO', 'KZ', 'KE', 'KI', 'KW', 'KG', 'LV',
  'LB', 'LS', 'LR', 'LI', 'LT', 'LU', 'MG', 'MW', 'MY', 'MV', 'ML', 'MT',
  'MH', 'MR', 'MU', 'MX', 'MC', 'MN', 'ME', 'MA', 'MZ', 'MM', 'NA', 'NR',
  'NP', 'NL', 'NZ', 'NI', 'NE', 'NG', 'MK', 'NO', 'OM', 'PK', 'PW', 'PA',
  'PG', 'PE', 'PH', 'PL', 'PT', 'QA', 'RO', 'RW', 'KN', 'LC', 'VC', 'WS',
  'SM', 'ST', 'SN', 'RS', 'SC', 'SL', 'SG', 'SK', 'SI', 'SB', 'ZA', 'ES',
  'LK', 'SR', 'SE', 'CH', 'TH', 'TG', 'TO', 'TT', 'TN', 'TR', 'TV', 'UG',
  'AE', 'US', 'UY', 'VU', 'ZM', 'BO', 'BN', 'CG', 'CZ', 'VA', 'FM', 'MD',
  'PS', 'KR', 'TW', 'TZ', 'TL', 'GB',
]);

!(async () => {
  const [proxy, netflix, disney, chatgpt, claude, gemini] = await Promise.all([
    timed(fetchProxy),
    timed(checkNetflix),
    timed(checkDisney),
    timed(checkChatGPT),
    timed(checkClaude),
    timed(checkGemini),
  ]);

  const services = [
    { name: 'YouTube', info: { ok: proxy.code === 'OK', region: proxy.cc, ms: proxy.ms } },
    { name: 'Netflix', info: resultInfo(netflix, proxy.cc) },
    { name: 'Disney+', info: resultInfo(disney, proxy.cc) },
    { name: 'ChatGPT', info: resultInfo(chatgpt, proxy.cc) },
    { name: 'Claude', info: resultInfo(claude, proxy.cc) },
    { name: 'Gemini', info: resultInfo(gemini, proxy.cc) },
  ];

  const okCount = services.filter((item) => item.info.ok).length;
  const time = new Date().toTimeString().slice(0, 5);
  const content = services
    .map((item) => `${item.info.ok ? '✓' : '✗'} ${item.name.padEnd(8, ' ')} ${formatRegion(item.info.region)} · ${item.info.ms}ms`)
    .join('\n');

  $done({
    title: `解锁检测 ${okCount}/${services.length} · ${formatRegion(proxy.cc)} · ${time}`,
    content,
    icon: okCount === services.length
      ? panelArgs.icon || 'checkmark.seal.fill'
      : panelArgs.iconerr || 'exclamationmark.triangle.fill',
    'icon-color': okCount === services.length
      ? panelArgs['icon-color'] || '#2F9E58'
      : panelArgs['iconerr-color'] || (okCount ? '#D99A2B' : '#D64545'),
  });
})().catch(() => {
  $done({
    title: '解锁检测失败',
    content: '脚本执行异常',
    icon: panelArgs.iconerr || 'xmark.seal.fill',
    'icon-color': panelArgs['iconerr-color'] || '#D64545',
  });
});

function parseArgument(argument) {
  return argument.split('&').reduce((args, item) => {
    const index = item.indexOf('=');
    if (index !== -1) args[item.slice(0, index)] = item.slice(index + 1);
    return args;
  }, {});
}

function timed(fn) {
  const start = Date.now();
  return fn()
    .then((result) => ({ ...result, ms: Date.now() - start }))
    .catch(() => ({ code: 'ERR', ms: Date.now() - start }));
}

function resultInfo(result, fallbackRegion) {
  const ok = result.code !== 'ERR';
  const region = result.region || (result.code === 'OK' ? fallbackRegion : result.code);
  return { ok, region: region || (ok ? 'XX' : '--'), ms: result.ms };
}

function formatRegion(region) {
  return region && region !== '--' ? `${flagEmoji(region)} ${region}` : '--';
}

function flagEmoji(countryCode) {
  if (!/^[A-Z]{2}$/.test(countryCode || '')) return '';
  const code = countryCode === 'TW' ? 'CN' : countryCode;
  return code
    .split('')
    .map((char) => String.fromCodePoint(127397 + char.charCodeAt()))
    .join('');
}

function httpGet(url, options = {}) {
  return new Promise((resolve, reject) => {
    $httpClient.get({ url, ...options }, (error, response, body) => {
      if (error) {
        reject(error);
        return;
      }
      resolve({
        status: response && (response.status || response.statusCode),
        body: body || '',
      });
    });
  });
}

async function fetchProxy() {
  const res = await httpGet('http://ip-api.com/json/?lang=zh-CN', { timeout: 4 });
  const data = JSON.parse(res.body || '{}');
  const cc = data.countryCode || 'XX';
  return { code: cc === 'XX' ? 'ERR' : 'OK', cc };
}

async function checkNetflix() {
  const res = await httpGet('https://www.netflix.com/title/70143836', {
    timeout: 4,
    headers: commonHeaders,
  });
  return { code: res.status === 200 ? 'OK' : 'ERR' };
}

async function checkDisney() {
  const res = await httpGet('https://www.disneyplus.com', {
    timeout: 4,
    headers: commonHeaders,
  });
  return { code: res.status && res.status !== 403 ? 'OK' : 'ERR' };
}

async function checkChatGPT() {
  const res = await httpGet('http://chat.openai.com/cdn-cgi/trace', { timeout: 3 });
  const trace = parseTrace(res.body);
  const ok = CHATGPT_SUPPORTED_REGIONS.has(trace.loc);
  return { code: ok ? 'OK' : 'ERR', region: trace.loc };
}

function parseTrace(body) {
  return (body || '').split('\n').reduce((trace, line) => {
    const index = line.indexOf('=');
    if (index !== -1) trace[line.slice(0, index)] = line.slice(index + 1);
    return trace;
  }, {});
}

async function checkClaude() {
  const res = await httpGet('https://claude.ai/login', {
    timeout: 5,
    headers: commonHeaders,
  });
  return { code: res.status ? 'OK' : 'ERR' };
}

async function checkGemini() {
  const res = await httpGet('https://gemini.google.com/app', {
    timeout: 4,
    headers: commonHeaders,
  });
  return { code: res.status ? 'OK' : 'ERR' };
}
