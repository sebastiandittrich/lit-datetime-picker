import { LitElement, html, css } from "lit";
import { customElement, property } from "lit/decorators.js";
import styles from "../main.css";
import { styleMap } from "lit-html/directives/style-map.js";

@customElement("lit-datetime-picker-circle-select")
export class CircleSelect extends LitElement {
  static styles = [
    styles,
    css`
      :host {
        display: flex;
        flex-direction: column;
        justify-content: center;
        border-radius: 100%;
      }
    `,
  ];

  constructor() {
    super();

    this.addEventListener("click", this.drag.click);
    this.addEventListener("touchmove", this.drag.touchMove);
    this.addEventListener("touchend", () =>
      setTimeout(() => this.dispatchEvent(new Event("selected")), 100)
    );
  }

  @property({ type: Boolean })
  public active: boolean = false;
  @property({ type: Number })
  public from: number = 0;
  @property({ type: Number })
  public to: number = 10;
  @property({ type: Number })
  public shift: number = 0;
  @property({ type: Number })
  public every: number = 1;
  @property({ type: Number, reflect: true })
  public value: number = 0;

  protected get values() {
    return Array.from(
      { length: this.to - this.from + 1 },
      (v, i) => i + this.from
    );
  }
  protected get stepsize() {
    return (2 * Math.PI) / this.values.length;
  }

  protected halfPi = Math.PI / 2;
  protected doublePi = Math.PI * 2;

  protected rotation(value: number) {
    return (
      (this.stepsize * (this.values.indexOf(value) + this.shift) +
        this.halfPi) %
      this.doublePi
    );
  }
  protected isSelected(value: number) {
    return this.value == value;
  }
  protected showFull(value: number) {
    return this.values.indexOf(value) % this.every == 0;
  }

  protected drag = {
    click: (event: MouseEvent) => {
      this.drag.handleInput(event as MouseEvent & { target: HTMLElement });
      this.dispatchEvent(new Event("selected"));
    },
    touchMove: (event: TouchEvent) => {
      event.preventDefault();
      const touch = event.touches[0];
      const target = event.target as HTMLElement;
      this.drag.handleInput({
        target,
        offsetX: touch.clientX - target.offsetLeft,
        offsetY: touch.clientY - target.offsetTop,
      });
    },
    getAngleFromCoordinate({ x, y }: { x: number; y: number }) {
      // Middle
      if (x == 0 && y == 0) {
        return Math.PI / 2;
      }
      // Top
      if (x == 0 && y > 0) {
        return Math.PI / 2;
      }
      // Bottom
      if (x == 0 && y < 0) {
        return (3 * Math.PI) / 2;
      }
      // Left
      if (x > 0 && y == 0) {
        return 0;
      }
      // Right
      if (x < 0 && y == 0) {
        return Math.PI;
      }
      if (x >= 0 && y >= 0) {
        // Up left
        return Math.atan(y / x);
      }
      if (x < 0 && y > 0) {
        // Up right
        return 0.5 * Math.PI + Math.atan(-x / y);
      }
      if (x < 0 && y < 0) {
        // Down right
        return 1 * Math.PI + Math.atan(-y / -x);
      }
      // Down left
      return 1.5 * Math.PI + Math.atan(-x / y);
    },
    handleInput: ({
      offsetX,
      offsetY,
      target: { offsetHeight: height, offsetWidth: width },
    }: {
      target: HTMLElement;
      offsetX: number;
      offsetY: number;
    }) => {
      // Origin top left
      const clicked = { x: offsetX / width, y: offsetY / height };
      // Origin on center
      const projected = { x: 0.5 - clicked.x, y: 0.5 - clicked.y };

      const alpha = this.drag.getAngleFromCoordinate(projected);

      let smallest = { diff: Infinity, value: null as null | number };
      for (const value of this.values) {
        const diff = Math.abs(this.rotation(value) - alpha);
        if (diff < smallest.diff) {
          smallest = { diff, value };
        }
      }

      this.value = smallest.value!;
      this.dispatchEvent(new Event("input"));
    },
  };

  render() {
    return html`<div class="flex flex-col justify-center">
      <div class="stacking pointer-events-none select-none">
        ${this.values.includes(this.value)
          ? html`<div
              class="flex flex-col justify-center"
              style=${styleMap({
                transform: `rotate(${this.rotation(this.value)}rad)`,
              })}
            >
              <div style="width: calc(50% + (0.5rem /2))" class="stacking">
                <div
                  class="bg-blue-500 rounded-full self-center justify-self-end"
                  style="width: calc(100% - 0.5rem); height: 2px"
                ></div>
                <div class="flex flex-row justify-between items-center">
                  <div class="h-10 w-10 bg-blue-500 rounded-full m-1"></div>
                  <div class="h-2 w-2 bg-blue-500 rounded-full"></div>
                </div>
              </div>
            </div>`
          : null}
        ${this.values.map(
          (value) => html`<div
            class="flex flex-row"
            style=${styleMap({
              transform: `rotate(${this.rotation(value)}rad)`,
            })}
          >
            <div
              class="${this.isSelected(value)
                ? "text-white"
                : ""} w-10 h-10 rounded-full flex flex-row items-center justify-center m-1"
              style=${styleMap({
                transform: `rotate(-${this.rotation(value)}rad)`,
              })}
            >
              <div
                style=${!this.isSelected(value)
                  ? `min-height: 0.5rem; min-width: 0.5rem`
                  : ""}
              >
                ${this.showFull(value)
                  ? html`<span>${value}</span>`
                  : this.isSelected(value)
                  ? html`<div class="bg-white h-1 w-1 rounded-full"></div>`
                  : null}
              </div>
            </div>
          </div>`
        )}
      </div>
    </div>`;
  }
}
