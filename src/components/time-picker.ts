import { html } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import styles from "../main.css";
import { formatISO, parseISO, setHours, setMinutes } from "date-fns";
import { LitModal } from "./lit-modal";

@customElement("lit-datetime-picker-time-picker")
export class TimePicker extends LitModal {
  static styles = styles;

  @property({
    converter: {
      fromAttribute(value) {
        return value ? parseISO(value) : undefined;
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
  })
  public value?: Date;
  @state({
    hasChanged(value: Date | undefined, oldValue: Date | undefined) {
      if (value == undefined || oldValue == undefined) {
        if (value == undefined && oldValue == undefined) {
          return false;
        }
        return true;
      }
      return formatISO(value) != formatISO(oldValue);
    },
  })
  public tempValue?: Date;

  protected fallbackValue = new Date();

  get date() {
    return this.tempValue || this.value || this.fallbackValue;
  }

  renderContents() {
    return html`
      <div class="pt-8 px-4 pb-4">
        <lit-datetime-picker-clock
          .value=${this.date}
          @hour-input=${(event: CustomEvent<number>) =>
            (this.tempValue = setHours(this.date, event.detail))}
          @minute-input=${(event: CustomEvent<number>) =>
            (this.tempValue = setMinutes(this.date, event.detail))}
        ></lit-datetime-picker-clock>
        <div class="flex flex-row items-center justify-end mt-8">
          <div
            @click=${() => this.close()}
            class="text-button text-gray-600 mr-4"
          >
            Cancel
          </div>
          <div @click=${() => this.doneClick()} class="button">Done</div>
        </div>
      </div>
    `;
  }

  doneClick() {
    this.close();
    this.dispatchEvent(
      new CustomEvent("input", { detail: new Date(this.date) })
    );
  }
}
