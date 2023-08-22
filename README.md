# intl-DateFormatter

A utility module to format a js Date using [Intl.DateTimeFormat](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat/DateTimeFormat) with a formatting string
template (like '`yyyy/mm/dd`'). This module is used in the more comprehensive date module [`es-date-fiddler`](https://github.com/KooiInc/es-date-fiddler).

### Usage
The module is available as ES module import @
- https://kooiinc.github.io/dateformat/index.js
- https://dateformat.kooi.dev/index.js
- *minified by cdn.jsdelivr.net from npm*
  <br>https://cdn.jsdelivr.net/npm/intl-dateformatter@latest/index.min.js

For running in the browser one of the urls with filename **DTFormat.js** instead of index.js.

### Install from npm
```cmd
npm install intl-dateformatter
```

## Loading
```js
// ------------------------------
// Directly
// ------------------------------
// ES Module import (from jsdelivr network, index.JS, script type="module")
import dtFormat from 'https://cdn.jsdelivr.net/npm/intl-dateformatter/index.js';
// ES Module ("type": "module" in package.json)
import dtFormat from '[location of index.JS]';
// CJS require
const dtFormat = require(`[location of index.CJS]`);
// ------------------------------
// installed with npm
// ------------------------------
// CJS import
const dtFormat = require('intl-dateformatter');
// ES Import ("type": "module" in package.json)
import dtFormat from 'intl-dateformatter';
```

For straightforward loading this library in your browser source it to `DTFormat.js`.<br>
Putting a script tag before your own script exposes the global function `window.dtFormat`.

```html
<script src="//cdn.jsdelivr.net/npm/intl-dateformatter/DTFormat.js"></script>
```

### Examples
See [this small stackblitz project](https://stackblitz.com/edit/web-platform-5wqvwc?file=script.js) for examples.

### Syntax:
`[imported format function](date, [template], [moreOptions])`
- no `[template]` or `[moreOptions]`: returns date only, formatted to
  current locale/time zone.
- `date`: a Date Object
- `template`: a string containing date/time units to print/output. See ['Date/Time-units to use in the template string'](#datetime-units-to-use-in-the-template-string) below.
  - Make sure every option unit (like yyyy, WD, MM) is surrounded by a non word character (like space, /, -, so *not* [a-zA-Z]).
  - You can use plain text in the template by enclosing it in `{}` (curly brackets), e.g. '`{Today is} WD`'.<br>
      This is especially useful if the text contains strings which may be matched as option unit (e.g. the *s* in `it's ` without curly brackets will be replaced with the date seconds value).
  - If two of the (numeric) options must not be separated in the result, put `~` (tilde) between them, e.g. `'yyyy~mm~dd'` => 20221102.<br>Use `{~}` or `~~` to output a tilde literal in the template (e.g.: `'yyyy~~mm{~}dd'` => 2022&#126;11&#126;02).
  - `dtf` in the template prints the date formatted with the given options. If the template parameter is empty, `dtf` is inserted automatically. 
  - You can also use html in the template string (e.g. '`{<b>Today</b> is} <i>WD</i>`').
- `moreOptions`: a string containing one or more (comma separated) shortened option parameters, where:
    - `l:[...]`: the locale (e.g. `l:en-US`, `l:fa-ir-u-ca-persian-nu-arabext`), see [this list](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes) for locales, or [this page](https://betterprogramming.pub/formatting-dates-with-the-datetimeformat-object-9c808dc58604) for locale extension keys, or [Unicode Technical Standard #35](https://www.unicode.org/reports/tr35/tr35.html#BCP_47_Conformance).
    - `tzn:[short|long|shortOffset|longOffset|shortGeneric|longGeneric]` the format of the timezone name (e.g.: `l:en-GB,tzn:short` = CET)
    - `tz:[...]` the time zone (e.g. `tz:Europe/Amsterdam`), see column *TZ database name* in [this list](https://en.wikipedia.org/wiki/List_of_tz_database_time_zones)
    - `ds:/ts:[full|long|medium|short]` date- and/or time style (e.g. ds:medium)
      - **Note**: dateStyle can be used with timeStyle and vice versa, but *not* with other options (e.g. weekday, hour, month, etc.), so these are ignored (in other words: you can't use them in your template: only '`dtf`' in a template will actually give you a formatted date cf the date-/timestyle you supplied).
    - `e:[long|short|narrow]` the (locale specific) era representation (e.g. `l:en,e:long`: *era* in the template string is replaced with 'Anno Domini').
    - `h12` use 12 hour clock.
    - `hrc:[11|12|23|24]` The hour cycle to use.
       - **Note**: in case of a 12 hour clock (`h12` or `hrc:11/12`) *OR* a locale using a 12 hour clock, `dp` in the template will be replaced by the (locale specific) day period.
 
  Spaces are allowed in the `moreOptions` string, e.g. `l: en, tz: Asia / Shanghai, e:long`.  

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
- `ms`: Milliseconds number (0 - 999),
- `dp`: When the locale is in a 12 hour time zone, displays the <b>d</b>ay <b>p</b>eriod (AM or PM)
- `yn`: The year name (used with some calendars, like chinese or tibetan),
- `tz`: the time zone (e.g. 'GMT+1')
   - **Note** the way time zone is displayed depends on the time zone name given (see `tzn:` in [syntax](#Syntax))

### Note on numeric vs 2-digit
You would expect that `numeric` always returns 1 digit, but this is not always the case. It depends on the `locale` value used. 
In this library the choice is made to **always** return 1 digit for `d`, `m`, `h`, `mi`, and `s`.
