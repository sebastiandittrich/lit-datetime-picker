import { LitElement, html } from "lit";
import { property } from "lit/decorators.js";
import styles from "../main.css";

export abstract class LitModal extends LitElement {
  static styles = styles;

  @property({ reflect: true, type: Boolean })
  protected open: boolean = false;

  close() {
    this.open = false;
  }
  show() {
    this.open = true;
  }

  render() {
    if (!this.open) return null;
    return html`<div class="fixed stacking top-0 right-0 left-0 bottom-0">
      <div @click=${() => this.close()} class="bg-black opacity-50"></div>
      <div
        class="border rounded-lg shadow bg-white self-center z-10 justify-self-center"
      >
        ${this.renderContents()}
      </div>
    </div>`;
  }

  abstract renderContents(): unknown;
}
