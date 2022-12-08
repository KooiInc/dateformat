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
    dl:   { locale: `default` },
    get re() {
      const keys = Object.keys(this).filter(v => !/^re/.test(v))
      return new RegExp(`\\b(${keys.join(`|`)})\\b`, `g`);
    },
  };
  const shortOpts = {
    tzn: v => ( { timeZoneName: v.slice(4) } ),
    ds:  v => ( { dateStyle: v.slice(3) } ),
    ts:  v => ( { timeStyle: v.slice(3) } ),
    e:   v => ( { era: v.slice(2) } ),
    h12: _ => ( { hour12: true } ),
    tz:  v => ( { timeZone: v.slice(3) } ),
    l:   v => ( { locale: v.slice(2) } )
  };
  const extractFromTemplate = (rawTemplateString = `dtf`, plainTextIndex = 0) => ( {
    texts: rawTemplateString.match(/(?<=\{)(.+?)(?=})/g) || [],
    formatStr: ` ${ rawTemplateString
      .replace(/(?<=\{)(.+?)(?=})/g, _ => `[${plainTextIndex++}]`)
      .replace(/[{}]/g, ``)
      .trim()} `,
    get units() {
      return this.formatStr.match(dtfOptions.re) || [];
    },
    finalize(dtf = ``, h12 = ``, era = ``) {
      return this.formatStr
        .replace(/~(\d+?)/g, `$1`)
        .replace(/\[(\d+?)\]/g, (_, d) => this.texts[d].trim())
        .replace(/dtf/, dtf)
        .replace(/era/, era)
        .replace(/dp\b/, h12); },
  } );
  const getOpts = (...opts) => opts?.reduce( (acc, optValue) => {
    const shortOpt = optValue.slice(0, optValue.indexOf(`:`));
    return shortOpt in shortOpts ? {...acc, ...shortOpts[shortOpt](optValue) }
      : optValue in dtfOptions ? { ...acc, ...dtfOptions[optValue] } : acc;
  }, dtfOptions.dl );

  return (date, template, moreOptions = `l:default`) => {
    const xTemplate = extractFromTemplate(template || undefined);

    if(/ds:|ts:/.test(moreOptions) || !template) {
      const opts = getOpts(...moreOptions.split(`,`));
      const formatted = Intl.DateTimeFormat(opts.locale, opts).format(date);
      return xTemplate.finalize(formatted);
    }

    const optsCollected = getOpts( ...xTemplate.units.concat(moreOptions.split(`,`)).flat() );
    const dtf = Intl.DateTimeFormat(optsCollected.locale, optsCollected)
      .formatToParts(date)
      .reduce( (parts, v) => ( v.type === `literal` ? parts : {...parts, [v.type]: v.value } ), {} );
    xTemplate.formatStr = xTemplate.formatStr
      .replace(dtfOptions.re, dtUnit => dtf[Object.keys(dtfOptions[dtUnit]).shift()] || dtUnit);

    return xTemplate.finalize(``, dtf.dayPeriod, dtf.era);
  };
}