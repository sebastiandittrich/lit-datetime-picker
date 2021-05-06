import { html } from "lit";
import { customElement } from "lit/decorators.js";
import { LitModal } from "./lit-modal";

@customElement("lit-datetime-picker-modal")
export class Modal extends LitModal {
  renderContents() {
    if (!this.open) return null;
    return html`<div class="fixed stacking top-0 right-0 left-0 bottom-0">
      <div @click=${() => this.close()} class="bg-black opacity-50"></div>
      <div
        class="border rounded shadow bg-white self-center z-10 justify-self-center"
      >
        <slot></slot>
      </div>
    </div>`;
  }
}
