# dateformat

A utility module to format a js Date using Intl.DateTimeFormat and a formatting string
template (like '`yyyy/mm/dd`').

### Syntax:

`[imported format function](date, [template], [moreOptions])`

- no `[template]` or `[moreOptions]`: returns date only, formatted to
  current locale/time zone.
- `date`: a Date Object
- `template`: a string containing the Date elements to print for possible options to use in the formatting string. If two of these options must not be separated by a
  non alphabetic character (typically space, / or -) in the result, use ~ as a separator, e.g. `'yyyy~mm~dd'`.

  You can use plain text in the template by enclosing it in {}, e.g. '`{Today is} WD`'.

  You can also use html in the template string (e.g. '`{<b>Today</b> is} <i>WD</i>`'). Just make sure every option unit (like yyyy, WD, MM) is surrounded by a non word character (so, not a-zA-z).
- `moreOptions`: a string containing one or more (comma separated) shortened option parameters, where:
    - `l:[...]`: the locale (e.g. l:en-US)
    - `tzn:[...]` the format of the timezone name (e.g.: tzn:short)
    - `tz:[...]` the time zone (e.g. tz:Europe/Amsterdam)
    - `ds:[...]/ts:[...]` date- and/or time style (e.g. ds:medium)
      - **Note**: dateStyle can be used with timeStyle and vice versa, but *not* with other options (e.g. weekday, hour, month, etc.), so these are ignored (in other words: you can't use them in your template: only 'dtf' in a template will actually give you a formatted date cf the date-/timestyle you supplied).
    - h12 - use 12 hour clock
      - **Note**: in case of a 12 hour clock OR a locale using
      a 12 hour clock, 'dp' in the template will give you
      the (locale dependent) day period

### Date/Time-units to use in the template string
- `MM`: Locale dependent full month name
- `M`: Locale dependent abbreviated month name
- `m`: Month number (1 - 12),
- `mm`: Month number two digits (01 - 12)
- `yyyy`: The full year
- `yy`: The year (2 digits)
- `WD`: Locale dependent long day of week
- `wd`: Locale dependent abbreviated day of week
- `d`: Date number (1 - 31)
- `dd`: Date number 2 digits (01 - 31)
- `h`: Hour number (1 - 24)
- `hh`: Hour number 2 digits (01 - 24)
- `mi`: Minute number (0 - 59),
- `mmi`: Minute number (00 - 59),
- `s`: Second number (0 - 59)
- `ss`: Second number (00 - 59)
- `ms`: milliseconds number (0 - 999),

### Usage
```js
import dtFormat from '[location of index.js]';
// the module is available from github via `https://kooiinc.github.io/dateformat/index.js`;
const englishWeekdayAbbr = dtFormat(new Date, `wd, d MM yyyy hh:mmi dp`, `l:en`);
const francaisWithText = dtFormat(new Date, `{Voilà} <i>WD</i>, d MM yyyy h{h}:mmi{m}`, `l:fr`)
```

See [this small stackblitz project](https://stackblitz.com/edit/web-platform-5wqvwc?file=script.js) for a few examples.