export default DateFormatFactory();

function DateFormatFactory() {
  const dtfOptions = {
    MM:   { month: `long` },
    M:    { month: `short` },
    m:    { month: `numeric` },
    mm:   { month: `2-digit` },
    yyyy: { year: `numeric` },
    yy:   { year: `2-digit` },
    WD:   { weekday: `long` },
    wd:   { weekday: `short` },
    d:    { day: `numeric` },
    dd:   { day: `2-digit` },
    h:    { hour: `numeric` },
    hh:   { hour: `2-digit` },
    mi:   { minute: `numeric` },
    mmi:  { minute: `2-digit` },
    s:    { second: `numeric` },
    ss:   { second: `2-digit` },
    ms:   { fractionalSecondDigits: 3 },
    tz:   { timeZoneName: `shortOffset` },
    get re() {
      return new RegExp(`\\b(${Object.keys(this).filter(v => !/^re/.test(v)).join(`|`)})\\b`, `g`);
    },
  };
  const shortOpts = {
    tzn: v => ( { timeZoneName: v.slice(4) } ),
    ds:  v => ( { dateStyle: v.slice(3) } ),
    ts:  v => ( { timeStyle: v.slice(3) } ),
    e:   v => ( { timeStyle: v.slice(2) } ),
    h12: _ => ( { hour12: true } ),
    tz:  v => ( { timeZone: v.slice(3) } ),
    l:   v => ( { locale: v.slice(2) } )
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
  const getOpts = (...opts) => opts?.reduce( (acc, optValue) => {
      const shortOpt = optValue.slice(0, optValue.indexOf(`:`));
      return shortOpt in shortOpts ? {...acc, ...shortOpts[shortOpt](optValue) }
        : optValue in dtfOptions ? { ...acc, ...dtfOptions[optValue] } : acc;
    }, defaultLocale) ?? defaultLocale;

  return (date, template, moreOptions) => {
    const xTemplate = extractFromTemplate(template || undefined);

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