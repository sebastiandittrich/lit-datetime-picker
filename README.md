# lit-datetime-picker

This is a datetime picker web component built with [Lit](https://lit.dev/), aiming to reproduce the appearance of the Material UI datetime picker.

## Installation

### Using NPM

```sh
npm install lit-datetime-picker
```

Then, insert `import 'lit-datetime-picker'` anywhere in your code (an `index.js` would be ideal), so that the web component can register itself.

### Through CDN

```html
<html>
  <head>
    <script src="https://unpkg.com/lit-datetime-picker"></script>
  </head>
</html>
```

## Using the Component

```html
<body>
  <button
    onclick="document.getElementsByTagName('lit-datetime-picker')[0].show()"
  >
    Choose Datetime
  </button>
  <lit-datetime-picker
    oninput="console.log(arguments[0].detail)"
  ></lit-datetime-picker>
</body>
```

## Using a different Prefix

You can change the prefix when consuming the component through a CDN (default is `lit`):

```html
<script
  src="https://unpkg.com/lit-datetime-picker"
  prefix="some-prefix"
></script>
<some-prefix-datetime-picker></some-prefix-datetime-picker>
```

## Public API

### Methods

#### Show

Call this method to show the modal to the user.

```ts
import { DatetimePicker } from "lit-datetime-picker/components/datetime-picker";

(someref as DatetimePicker).show();
```

#### Close

Call this method to close the modal if it is open.

```ts
import { DatetimePicker } from "lit-datetime-picker/components/datetime-picker";

(someref as DatetimePicker).close();
```

### Attributes

#### Value

You can use this attribute to set a default value in ISO format.

```html
<lit-datetime-picker value="2021-06-26T01:15:58.251Z"></lit-datetime-picker>
```
#### Start of Week

You can use the `startOfWeek` attribute to set the start of the calendar week. Defaults to `0`, meaning the week starts with sunday.

```html
<!-- Setting the week to start with monday-->
<lit-datetime-picker startOfWeek="1"></lit-datetime-picker>
```

### Events

#### Input

You can watch the `input` event on the custom element to receive input when the `done` button is clicked in the picker. The event will be a CustomEvent with type `CustomEvent<Date>`. This event has the following important properties:

```ts
interface extends Event {
    detail: Date
}
```
