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
  const defaultLocale = {locale: `default` };
  const extractFromTemplate = (str = `dtf`, plainTextIndex = 0) => ( {
    texts: str.match(/(?<=\{)(.+?)(?=})/g) || [],
    formatStr: ` ${ str
      .replace(/(?<=\{)(.+?)(?=})/g, _ => `[${plainTextIndex++}]`)
      .replace(/[{}]/g, ``)
      .trim()} `}  );
  const getOpts = (...opts) => {
    if (opts && opts.length) {
      return opts.reduce( (acc, v) =>
        v.startsWith(`tzn:`) ? {...acc, ...{ timeZoneName: v.slice(4) } }
        : v.startsWith(`ds:`) ?  {...acc, ...{ dateStyle: v.slice(3) } }
        : v.startsWith(`ts:`) ?  {...acc, ...{ timeStyle: v.slice(3) } }
        : v === `h12` ?  {...acc, ...{ hour12: true } }
        : v.startsWith(`tz:`) ? {...acc, ...{ timeZone: v.slice(3) } }
        : v.startsWith(`l:`) ? {...acc, ...{ locale: v.slice(2) } }
        : dtfOptions[(v || `X`)] ? {...acc, ...dtfOptions[v]}
        : acc, defaultLocale);
    }
    return {locale: `default`};
  };
  const finalizeDtString = xTemplate =>
    xTemplate.formatStr
      .replace(/(?<=\[)(\d+?)(?=])/g, d => xTemplate.texts[d].trim())
      .replace(/[~\[\]]/g, ``);

  return (date, template, moreOptions) => {
    const xTemplate = extractFromTemplate(template);

    if(/ds:|ts:/.test(moreOptions) || !template) {
      const opts = !moreOptions ? defaultLocale : getOpts(...moreOptions.split(`,`));
      const dtf = Intl.DateTimeFormat(opts.locale, opts).format(date);
      return `${finalizeDtString(xTemplate).replace(/dtf/, dtf)}`;
    }

    const optsCollected = {
        ...getOpts(...xTemplate.formatStr.match(dtfOptions.re)),
        ...(moreOptions ? getOpts(...moreOptions.split(`,`)) : {}) };
    const dtf = Intl.DateTimeFormat(optsCollected.locale, optsCollected)
      .formatToParts(date)
      .filter(v => v.type !== `literal`);
    const hour12 = dtf.find(v => v.type === `dayPeriod`);
    xTemplate.formatStr = xTemplate.formatStr
      .replace(dtfOptions.re, dtUnit => {
          const key = Object.keys(dtfOptions[dtUnit]).shift();
          return dtf.find(v => v.type === key)?.value || dtUnit; } );

    if (hour12 && /dp\b/.test(xTemplate.formatStr)) {
      xTemplate.formatStr = xTemplate.formatStr.replace(/dp\b/, hour12.value);
    }

    return finalizeDtString(xTemplate);
  };
}