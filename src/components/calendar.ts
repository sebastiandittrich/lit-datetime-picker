import { LitElement, html } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { classMap } from "lit/directives/class-map.js";
import styles from "../main.css";
import {
  addDays,
  addMonths,
  differenceInCalendarDays,
  endOfMonth,
  endOfWeek,
  formatISO,
  getDate,
  intlFormat,
  isSameDay,
  isSameMonth,
  parseISO,
  startOfMonth,
  startOfWeek,
  subMonths,
} from "date-fns";

@customElement("lit-datetime-picker-calendar")
export class Calendar extends LitElement {
  static styles = styles;

  @state({
    hasChanged() {
      return true;
    },
  })
  protected currentMonth: Date = new Date();

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
  })
  public value: Date = new Date();

  @property({ type: Number })
  public startOfWeek: 0 | 1 | 2 | 3 | 4 | 5 | 6 = 0;

  get weeks(): {
    isToday: boolean;
    isSelected: boolean;
    isOutOfMonth: boolean;
    date: Date;
  }[][] {
    const first = startOfWeek(startOfMonth(new Date(this.currentMonth)), {
      weekStartsOn: this.startOfWeek,
    });
    const last = endOfWeek(endOfMonth(new Date(this.currentMonth)), {
      weekStartsOn: this.startOfWeek,
    });

    const sortedByWeeks: { [key: string]: Array<{}> } = {};
    let current = first;
    do {
      const index = formatISO(
        startOfWeek(current, { weekStartsOn: this.startOfWeek })
      );
      if (!sortedByWeeks[index]) {
        sortedByWeeks[index] = [];
      }
      sortedByWeeks[index].push({
        isToday: differenceInCalendarDays(current, new Date()) == 0,
        isSelected: this.value && isSameDay(this.value, current),
        isOutOfMonth: !isSameMonth(current, this.currentMonth),
        date: current,
      });
      current = addDays(new Date(current), 1);
    } while (current <= last || Object.keys(sortedByWeeks).length < 6);

    return Object.keys(sortedByWeeks).reduce(
      (weeks, current) => [...weeks, sortedByWeeks[current]],
      [] as any
    );
  }

  dayClick(day: Date) {
    this.dispatchEvent(new CustomEvent("input", { detail: day }));
  }

  render() {
    return html`<div class="">
      <div class="flex flex-row items-center justify-between font-medium">
        <svg
          @click="${() =>
            (this.currentMonth = subMonths(this.currentMonth, 1))}"
          class="clickable p-2 rounded-full hover:bg-gray-200 h-8 w-8"
          xmlns="http://www.w3.org/2000/svg"
          class="h-5 w-5"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fill-rule="evenodd"
            d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
            clip-rule="evenodd"
          />
        </svg>
        <div class="text-sm">
          ${intlFormat(this.currentMonth, {
            month: "long",
            year: "numeric",
          })}
        </div>

        <svg
          @click="${() =>
            (this.currentMonth = addMonths(this.currentMonth, 1))}"
          class="clickable p-2 rounded-full hover:bg-gray-200 h-8 w-8"
          xmlns="http://www.w3.org/2000/svg"
          class="h-5 w-5"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fill-rule="evenodd"
            d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
            clip-rule="evenodd"
          />
        </svg>
      </div>
      <div class="mt-4 -mx-2">
        <div
          class="text-gray-500 text-xs flex flex-row items-center justify-between row font-medium"
        >
          ${"MTWTFSS"
            .split("")
            .map(
              (day) => html`<div class="p-2 flex-1 text-center">${day}</div>`
            )}
        </div>
        ${this.weeks.map(
          (week, index) => html`<div
            class="text-sm flex flex-row items-center justify-between row"
          >
            ${week.map(
              (day) => html`<div
                class="flex-1 text-center flex flex-row items-center justify-center w-10 h-10"
              >
                ${!day.isOutOfMonth
                  ? html`<div
                      @click=${() => this.dayClick(day.date)}
                      class="rounded-full day clickable flex flex-row items-center justify-center w-full h-full ${classMap(
                        {
                          "text-blue-700": day.isToday && !day.isSelected,
                          "text-white": day.isSelected,
                          "bg-blue-700": day.isSelected,
                        }
                      )}"
                    >
                      ${getDate(day.date)}
                    </div>`
                  : null}
              </div>`
            )}
          </div>`
        )}
      </div>
    </div>`;
  }
}
