import { LitElement, html } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import styles from "../main.css";
import { formatISO, getHours, getMinutes, parseISO } from "date-fns";
import { classMap } from "lit-html/directives/class-map.js";
import { CircleSelect } from "./circle-select";

@customElement("lit-datetime-picker-clock")
export class Clock extends LitElement {
  static styles = styles;

  @state()
  current: "hour" | "minute" = "hour";

  @property({
    converter: {
      fromAttribute(value) {
        return value ? parseISO(value) : undefined;
      },
      toAttribute(value: Date | undefined) {
        return value ? formatISO(value) : undefined;
      },
    },
    hasChanged(value: Date | undefined, oldValue: Date | undefined) {
      if (value == undefined || oldValue == undefined) {
        if (value == undefined && oldValue == undefined) {
          return false;
        }
        return true;
      }
      return formatISO(value) != formatISO(oldValue);
    },
    type: String,
  })
  public value: Date = new Date();

  render() {
    return html`<div class="flex flex-col items-center">
      <div class="text-5xl">
        <span
          @click=${() => (this.current = "hour")}
          class=${classMap({ "text-gray-400": this.current != "hour" })}
          >${getHours(this.value).toString().padStart(2, "0")}</span
        >
        <span class="mx-1">:</span>
        <span
          @click=${() => (this.current = "minute")}
          class=${classMap({ "text-gray-400": this.current != "minute" })}
          >${getMinutes(this.value).toString().padStart(2, "0")}</span
        >
      </div>
      <div class="mt-4 mx-4">
        <div class="stacking bg-gray-200 rounded-full w-64 h-64">
          ${this.current == "hour"
            ? html`<lit-datetime-picker-circle-select
                  from="1"
                  to="12"
                  shift="1"
                  @input=${(event: Event) =>
                    this.dispatchEvent(
                      new CustomEvent("hour-input", {
                        detail: (event.target as CircleSelect).value,
                      })
                    )}
                  value=${getHours(this.value)}
                  @selected=${() => (this.current = "minute")}
                ></lit-datetime-picker-circle-select>
                <lit-datetime-picker-circle-select
                  from="13"
                  to="24"
                  shift="1"
                  class="m-10 text-sm text-gray-700"
                  @input=${(event: Event) =>
                    this.dispatchEvent(
                      new CustomEvent("hour-input", {
                        detail: (event.target as CircleSelect).value,
                      })
                    )}
                  value=${getHours(this.value)}
                  @selected=${() => (this.current = "minute")}
                ></lit-datetime-picker-circle-select>`
            : html`
                <lit-datetime-picker-circle-select
                  from="0"
                  to="59"
                  every="5"
                  @input=${(event: Event) =>
                    this.dispatchEvent(
                      new CustomEvent("minute-input", {
                        detail: (event.target as CircleSelect).value,
                      })
                    )}
                  value=${getMinutes(this.value)}
                ></lit-datetime-picker-circle-select>
            </div>`}
        </div>
      </div>
    </div>`;
  }
}
