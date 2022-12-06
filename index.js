export default DateFormatFactory();
function DateFormatFactory() {
  const dtfOptions = {
    MM: { month: `long` },
    M: { month: `short` },
    m: { month: `numeric` },
    mm: { month: `2-digit` },
    yyyy: { year: `numeric` },
    yy: { year: `2-digit` },
    WD: { weekday: `long` },
    wd: { weekday: `short` },
    d: { day: `numeric` },
    dd: { day: `2-digit` },
    h: { hour: `numeric` },
    hh: { hour: `2-digit` },
    mi: { minute: `numeric` },
    mmi: { minute: `2-digit` },
    s: { second: `numeric` },
    ss: { second: `2-digit` },
    ms: { fractionalSecondDigits: 3 },
    tz: { timeZoneName: `shortOffset` },
    get re() {
      const keys = Object.keys(this).filter(v => !/^re/.test(v))
      return new RegExp(`\\b(${keys.join(`|`)})\\b`, `g`);
    },
  };
  const defaultLocale = { locale: `default` };
  const extractFromTemplate = (rawTemplateString = `dtf`, plainTextIndex = 0) => {
    return {
      texts: rawTemplateString.match(/(?<=\{)(.+?)(?=})/g) || [],
      formatStr: ` ${ (rawTemplateString)
        .replace(/(?<=\{)(.+?)(?=})/g, _ => `[${plainTextIndex++}]`)
        .replace(/[{}]/g, ``)
        .trim()} `,
      finalize(dtf = ``, h12 = ``) {
        return this.formatStr
          .replace(/(?<=\[)(\d+?)(?=])/g, d => this.texts[d].trim())
          .replace(/dtf/, dtf)
          .replace(/dp\b/, h12)
          .replace(/[~\[\]]/g, ``); }
    };
  };
  const getOpts = (...opts) => {
    if (opts && opts.length) {
      return opts.reduce( (acc, v) =>
        v.startsWith(`tzn:`) ? { ...acc, ...{ timeZoneName: v.slice(4) } }
        : v.startsWith(`ds:`) ?  { ...acc, ...{ dateStyle: v.slice(3) } }
        : v.startsWith(`ts:`) ?  { ...acc, ...{ timeStyle: v.slice(3) } }
        : v.startsWith(`e:`) ?  { ...acc, ...{ timeStyle: v.slice(2) } }
        : v === `h12` ?  { ...acc, ...{ hour12: true } }
        : v.startsWith(`tz:`) ? { ...acc, ...{ timeZone: v.slice(3) } }
        : v.startsWith(`l:`) ? { ...acc, ...{ locale: v.slice(2) } }
        : dtfOptions[(v || `X`)] ? { ...acc, ...dtfOptions[v]}
        : acc, defaultLocale);
    }
    return {locale: `default`};
  };

  return (date, template, moreOptions) => {
    const xTemplate = extractFromTemplate(template?.trim() ?? undefined);

    if(/ds:|ts:/.test(moreOptions) || !template) {
      const opts = !moreOptions ? defaultLocale : getOpts(...moreOptions.split(`,`));
      const formatted = Intl.DateTimeFormat(opts.locale, opts).format(date);
      return xTemplate.finalize(formatted);
    }

    const optsCollected = {
      ...getOpts(...xTemplate.formatStr.match(dtfOptions.re)),
      ...(moreOptions ? getOpts(...moreOptions.split(`,`)) : {}) };
    const dtf = Intl.DateTimeFormat(optsCollected.locale, optsCollected)
      .formatToParts(date)
      .filter(v => v.type !== `literal`);
    const hour12 = dtf.find(v => v.type === `dayPeriod`)?.value || ``;
    xTemplate.formatStr = xTemplate.formatStr
      .replace(dtfOptions.re, dtUnit => {
        const key = Object.keys(dtfOptions[dtUnit]).shift();
        return dtf.find(v => v.type === key)?.value || dtUnit; } );

    return xTemplate.finalize(...[,hour12]);
  };
}