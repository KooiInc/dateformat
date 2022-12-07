# dateformat

A utility module to format a js Date using [Intl.DateTimeFormat](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat/DateTimeFormat) and a formatting string
template (like '`yyyy/mm/dd`').

### Usage
```js
import dtFormat from '[location of index.js]';
// the module is available @
// https://kooiinc.github.io/dateformat/index.js
// https://dateformat.kooi.dev/index.js
// **minified by cdn.jsdelivr.net from npm
// https://cdn.jsdelivr.net/npm/intl-dateformatter@latest/index.min.js
const englishWeekdayAbbr = dtFormat(new Date, `wd, d MM yyyy hh:mmi dp`, `l:en`);
// Mon, 5 December 2022 12:13 PM
const francaisWithText = dtFormat(new Date, `{Voilà} <i>WD</i>, d MM yyyy h{h}:mmi{m}`, `l:fr`);
// Voilà lundi, 5 décembre 2022 12h:13m
```
See [this small stackblitz project](https://stackblitz.com/edit/web-platform-5wqvwc?file=script.js) for a few examples.

### Syntax:

`[imported format function](date, [template], [moreOptions])`

- no `[template]` or `[moreOptions]`: returns date only, formatted to
  current locale/time zone.
- `date`: a Date Object
- `template`: a string containing date/time units to print/output. See ['Date/Time-units to use in the template string'](#datetime-units-to-use-in-the-template-string) below.
  - Make sure every option unit (like yyyy, WD, MM) is surrounded by a non word character (like space, /, -, so *not* [a-zA-Z]).
  - You can use plain text in the template by enclosing it in `{}`, e.g. '`{Today is} WD`'.
  - If two of the (numeric) options must not be separated in the result, put `~` (tilde) between them, e.g. `'yyyy~mm~dd'` => 20221102.<br>Use `{~}` or `~~` to output a tilde literal in the template (e.g.: `'yyyy~~mm{~}dd'` => 2022&#126;11&#126;02).
  - `dtf` in the template prints the date formatted with the given options. If the template parameter is empty, `dtf` is inserted automatically. 
  - You can also use html in the template string (e.g. '`{<b>Today</b> is} <i>WD</i>`').
- `moreOptions`: a string containing one or more (comma separated) shortened option parameters, where:
    - `l:[...]`: the locale (e.g. `l:en-US`, `l:fa-ir-u-ca-persian-nu-arabext`), see [this list](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes) for locales, or [this page](https://betterprogramming.pub/formatting-dates-with-the-datetimeformat-object-9c808dc58604) for locale extension keys, or [Unicode Technical Standard #35](https://www.unicode.org/reports/tr35/tr35.html#BCP_47_Conformance).
    - `tzn:[short|long|shortOffset|longOffset|shortGeneric|longGeneric]` the format of the timezone name (e.g.: `l:en-GB,tzn:short` = CET)
    - `tz:[...]` the time zone (e.g. `tz:Europe/Amsterdam`), see column *TZ database name* in [this list](https://en.wikipedia.org/wiki/List_of_tz_database_time_zones)
    - `ds:/ts:[full|long|medium|short]` date- and/or time style (e.g. ds:medium)
      - **Note**: dateStyle can be used with timeStyle and vice versa, but *not* with other options (e.g. weekday, hour, month, etc.), so these are ignored (in other words: you can't use them in your template: only '`dtf`' in a template will actually give you a formatted date cf the date-/timestyle you supplied).
    - `e:[long|short|narrow]` the era representation (e.g. `l:en,e:long` = 'Anno Domini'). 
    - `h12` - use 12 hour clock.
      - **Note**: in case of a 12 hour clock *OR* a locale using a 12 hour clock, `dp` in the template will give you
      the (locale dependent) day period (e.g. AM/PM).

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
