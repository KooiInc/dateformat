  import assert from 'node:assert/strict';
import dtFormat from "./index.js";

runTests();

function runTests() {
  let errors = false;
  const logs = [];
  const getLine = err => `\n   @line ${err.stack.split(`\n`)[1].split(`:`).slice(-2, -1).shift()}\n`;
  const log = (...strs) => strs.forEach(str => logs.push(`  ${str.replace(/\n/, `\n  `)}`));
  let workingDate;
  console.clear();
  try {
    workingDate = new Date(2023, 0, 1, 12, 33, 19, 357);
    log(`---`, `workingDate: ${dtFormat(workingDate, `yyyy/mm/dd hh:mmi:ss.ms`)}`);
    const params = ["WD, d MM yyyy era h{h}:mmi{m}:ss{s et} ms {millisecondes}", "l:fr,e:long"];
    const formatted = dtFormat(workingDate, `WD, d MM yyyy era h{h}:mmi{m}:ss{s et} ms {millisecondes}`, `l:fr,e:long`);
    const expected = `dimanche, 1 janvier 2023 après Jésus-Christ 12h:33m:19s et 357 millisecondes`
    log(`parameters "${params.join( `" | "`)}"`, `expected: ${expected}`, `received: ${formatted}`);
    assert.strictEqual( formatted, expected );
    log(` => OK!`, `---`);
  } catch (err) {
    errors = true;
    log(`   ERROR for test ${err.message}${getLine(err)}   expected: ${err.expected},\n     actual: ${err.actual}\n`);
  }

  try {
    workingDate = new Date(1928, 2, 15, 13, 30);
    log(`workingDate: ${dtFormat(workingDate, `yyyy/mm/dd hh:mmi:ss.ms`)}`);
    const params = ["", "l:zh-Hant,tz:Asia/Shanghai,ds:medium,ts:long"];
    const formatted = dtFormat(workingDate, ...params);
    const expected = `1928年3月15日 晚上9:30:00 [GMT+8]`;
    log(`parameters "${params.join( `" | "`)}"`, `expected: ${expected}`, `received: ${formatted}`);
    assert.strictEqual( formatted, expected );
    log(` => OK!`, `---`);
  } catch(err) {
    errors = true;
    log(`   ERROR for test ${err.message}${getLine(err)}   expected: ${err.expected},\n     actual: ${err.actual}\n`);
  }

  try {
    workingDate = new Date(1933, 1, 5);
    log(`workingDate: ${dtFormat(workingDate, `yyyy/mm/dd hh:mmi:ss.ms`)}`);
    const params = ["WD d MM yyyy tz", "l:nl,tz:UTC,tzn:long"];
    const formatted = dtFormat(workingDate, ...params);
    const expected = `zondag 5 februari 1933 gecoördineerde wereldtijd`;
    log(`parameters "${params.join( `" | "`)}"`, `expected: ${expected}`, `received: ${formatted}`);
    assert.strictEqual( formatted, expected );
    log(` => OK!`, `---`);
  } catch(err) {
    errors = true;
    log(`   ERROR for test ${err.message}${getLine(err)}   expected: ${err.expected},\n     actual: ${err.actual}\n`);
  }

  try {
    workingDate = new Date(1991, 7, 27, 13, 30);
    log(`workingDate: ${dtFormat(workingDate, `yyyy/mm/dd hh:mmi:ss.ms`)}`);
    const params = [`{LKS} WD, d MM yyyy om h uur mmi`, `l:nl`];
    const formatted = dtFormat(workingDate, ...params);
    const expected = `LKS dinsdag, 27 augustus 1991 om 13 uur 30`;
    log(`parameters "${params.join( `" | "`)}"`, `expected: ${expected}`, `received: ${formatted}`);
    assert.strictEqual( formatted, expected );
    log(` => OK!`, `---`);
  } catch(err) {
    errors = true;
    log(`   ERROR for test ${err.message}${getLine(err)}   expected: ${err.expected},\n     actual: ${err.actual}\n`);
  }

  try {
    workingDate = new Date(1994, 9, 6, 0, 30);
    log(`workingDate: ${dtFormat(workingDate, `yyyy/mm/dd hh:mmi:ss.ms`)}`);
    const params = [`{AJ} WD, MM d{th} yyyy era at h hour mmi`, `l:en,e:long`];
    const formatted = dtFormat(workingDate, ...params);
    const expected = `AJ Thursday, October 6th 1994 Anno Domini at 12 hour 30`;
    log(`parameters "${params.join( `" | "`)}"`, `expected: ${expected}`, `received: ${formatted}`);
    assert.strictEqual( formatted, expected );
    log(` => OK!`, `---`);
  } catch(err) {
    errors = true;
    log(`   ERROR for test ${err.message}${getLine(err)}   expected: ${err.expected},\n     actual: ${err.actual}\n`);
  }

  try {
    workingDate = new Date(1997, 3, 24, 1, 30);
    log(`workingDate: ${dtFormat(workingDate, `yyyy/mm/dd hh:mmi:ss.ms`)}`);
    const params = [`{BJ} WD, d MM yyyy, h horas mmi tz`, `l:pt,tzn:long,tz:Europe/Lisbon`];
    const formatted = dtFormat(workingDate, ...params);
    const expected = `BJ quinta-feira, 24 abril 1997, 00 horas 30 Horário de Verão da Europa Ocidental`;
    log(`parameters "${params.join( `" | "`)}"`, `expected: ${expected}`, `received: ${formatted}`);
    assert.strictEqual( formatted, expected );
    log(` => OK!`, `---`);
  } catch(err) {
    errors = true;
    log(`   ERROR for test ${err.message}${getLine(err)}   expected: ${err.expected},\n     actual: ${err.actual}\n`);
  }

  try {
    workingDate = new Date(1957, 2, 18, 13, 30);
    log(`workingDate: ${dtFormat(workingDate, `yyyy/mm/dd hh:mmi:ss.ms`)}`);
    const params = [`WD d MM yyyy h:mi (tz)`, `l:ID,tz:Asia/Jayapura,tzn:short`];
    const formatted = dtFormat(workingDate, ...params);
    const expected = `Senin 18 Maret 1957 22:00 (GMT+9.30)`;
    log(`parameters "${params.join( `" | "`)}"`, `expected: ${expected}`, `received: ${formatted}`);
    assert.strictEqual( formatted, expected );
    log(` => OK!`, `---`);
  } catch(err) {
    errors = true;
    log(`   ERROR for test ${err.message}${getLine(err)}   expected: ${err.expected},\n     actual: ${err.actual}\n`);
  }

  if (errors) { log (`THERE WERE ERRORS!`); }
  logIt(...logs);
}

function logIt(...args) {
  args.forEach(arg => console.log(arg instanceof Object ? JSON.stringify(arg, null, 2) : arg));
}