import { html } from "lit";
import { customElement } from "lit/decorators.js";
import { LitModal } from "./lit-modal";

@customElement("lit-datetime-picker-modal")
export class Modal extends LitModal {
  renderContents() {
    if (!this.open) return null;
    return html`<slot></slot>`;
  }
}
