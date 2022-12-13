export default DateFormatFactory();

function DateFormatFactory() {
  const dtfOptions = {
    fixed: {
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
      h12:  { hour12: true },
    },
    dynamic:  {
      tzn: v => ( { timeZoneName: v.slice(4) } ),
      hrc: v => ( { hourCycle: `h${v.slice(4)}` } ),
      ds:  v => ( { dateStyle: v.slice(3) } ),
      ts:  v => ( { timeStyle: v.slice(3) } ),
      tz:  v => ( { timeZone: v.slice(3) } ),
      e:   v => ( { era: v.slice(2) } ),
      l:   v => ( { locale: v.slice(2) } ),
    },
    retrieveDyn(fromValue) {
      const key = fromValue?.slice(0, fromValue.indexOf(`:`));
      return this.dynamic[key] && this.dynamic[key](fromValue);
    },
    get re() { return new RegExp(`\\b(${Object.keys(this.fixed).join(`|`)})\\b`, `g`); },
  };
  const extractFromTemplate = (rawTemplateString = `dtf`, plainTextIndex = 0) => ( {
    texts: rawTemplateString.match(/(?<=\{)(.+?)(?=})/g) || [],
    formatStr: ` ${ rawTemplateString
      .replace(/(?<=\{)(.+?)(?=})/g, _ => `[${plainTextIndex++}]`)
      .replace(/[{}]/g, ``)
      .trim()} `,
    get units() { return this.formatStr.match(dtfOptions.re) || []; },
    finalize(dtf = ``, h12 = ``, era = ``) {
      return this.formatStr
        .replace(/~(\d+?)/g, `$1`)
        .replace(/\[(\d+?)]/g, (_, d) => this.texts[d].trim())
        .replace(/dtf/, dtf)
        .replace(/era/, era)
        .replace(/dp\b/, h12); },
  } );
  const getOpts = (...opts) => opts?.reduce( (acc, optValue) =>
    ({...acc, ...(dtfOptions.retrieveDyn(optValue) || dtfOptions.fixed[optValue]),}),
    dtfOptions.fixed.dl );
  const dtSimple = (date, xTemplate, moreOptions) => {
    const opts = getOpts(...moreOptions.split(`,`));
    const formatted = Intl.DateTimeFormat(opts.locale, opts).format(date);

    return xTemplate.finalize(formatted);
  };
  const dtFormatted = (date, xTemplate, moreOptions) => {
    const optsCollected = getOpts( ...xTemplate.units.concat(moreOptions.split(`,`)).flat() );
    const fixedOpts = {...dtfOptions.fixed};
    const dtf = Intl.DateTimeFormat(optsCollected.locale, optsCollected).formatToParts(date)
      .reduce( (parts, v) => (v.type === `literal` ? parts : {...parts, [v.type]: v.value } ), {} );
    fixedOpts.ms = optsCollected.fractionalSecondDigits ? { fractionalSecond: true } : fixedOpts.ms;
    xTemplate.formatStr = xTemplate.formatStr
      .replace(dtfOptions.re, dtUnit => dtf[Object.keys(fixedOpts[dtUnit]).shift()] || dtUnit);

    return xTemplate.finalize(``, dtf.dayPeriod, dtf.era);
  }

  return (date, template, moreOptions = `l:default`) => (/ds:|ts:/.test(moreOptions) || !template)
    ? dtSimple(...[date, extractFromTemplate(template || undefined), moreOptions])
    : dtFormatted(...[date, extractFromTemplate(template || undefined), moreOptions]);
}