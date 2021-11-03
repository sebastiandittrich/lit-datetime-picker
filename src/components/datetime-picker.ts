import { html } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { createRef, ref } from "lit/directives/ref.js";
import {
  formatISO,
  getDate,
  getMinutes,
  getMonth,
  getYear,
  intlFormat,
  parseISO,
  setDate,
  setHours,
  setMinutes,
  setMonth,
  setYear,
} from "date-fns";
import { LitModal } from "./lit-modal";
import { TimePicker } from "./time-picker";
import getHours from "date-fns/getHours";
import { prefixed } from "../utils";

@customElement(prefixed("datetime-picker"))
export class DatetimePicker extends LitModal {
  @property({
    reflect: true,
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
  })
  public value?: Date;

  @property({ type: Number })
  public startOfWeek: 0 | 1 | 2 | 3 | 4 | 5 | 6 = 0;

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
  public tempValue: Date = new Date();

  protected fallbackValue = new Date();

  get selected() {
    return this.tempValue || this.value || this.fallbackValue;
  }

  timePickerRef: { value?: TimePicker } = createRef<TimePicker>();

  onTimePickerInput({ detail: date }: CustomEvent<Date>) {
    this.tempValue = setHours(this.tempValue, getHours(date));
    this.tempValue = setMinutes(this.tempValue, getMinutes(date));
  }

  onCalendarInput({ detail: date }: CustomEvent<Date>) {
    this.tempValue = setDate(this.tempValue, getDate(date));
    this.tempValue = setMonth(this.tempValue, getMonth(date));
    this.tempValue = setYear(this.tempValue, getYear(date));
  }

  doneClick() {
    return this.dispatchEvent(
      new CustomEvent("input", { detail: new Date(this.tempValue) })
    );
  }

  renderContents() {
    return html` <div class="px-6 py-4">
      <lit-datetime-picker-time-picker
        ${ref(this.timePickerRef)}
        .value=${this.selected}
        @input=${this.onTimePickerInput}
      ></lit-datetime-picker-time-picker>
      <lit-datetime-picker-calendar
        .value=${this.selected}
        @input=${this.onCalendarInput}
        .startOfWeek=${this.startOfWeek}
      ></lit-datetime-picker-calendar>
      <div class="flex flex-row items-center mt-4">
        <svg
          class="h-4 w-4"
          xmlns="http://www.w3.org/2000/svg"
          class="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <div
          role="textbox"
          class="bg-gray-200 px-3 py-2 rounded text-sm ml-4 flex-1 text-gray-900 clickable"
          @click=${() => this.timePickerRef.value?.show()}
        >
          ${intlFormat(this.selected, {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </div>
      </div>
      <div class="flex flex-row items-center justify-end mt-8">
        <div
          @click=${() => this.close()}
          class="text-button text-gray-600 mr-4"
        >
          Cancel
        </div>
        <div @click=${this.doneClick} class="button">Done</div>
      </div>
    </div>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "lit-datetime-picker": DatetimePicker;
  }
}
