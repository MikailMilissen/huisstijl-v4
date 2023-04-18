import {LitElement, html, unsafeCSS} from "lit";
import {property, customElement, state, query} from "lit/decorators.js";
import {when} from 'lit/directives/when.js';
import styles from './pill.scss?inline';
import {E2E} from '../../../../test/e2e'
import {classMap} from "lit-html/directives/class-map.js";

export enum PillColorsEnum {
  Neutral = "neutral",
  Success = "success",
  Info = "info",
  Warning = "warning",
  Danger = "danger",
}

export type PillColors = `${PillColorsEnum}`;

@customElement("vdab-pill")
export class Pill extends LitElement {
  // Data

  static styles = unsafeCSS(styles);

  @property({type: String}) color: PillColors = "neutral";
  @property({type: Boolean}) light: boolean = false;
  @property({type: Boolean}) white: boolean = false;
  @property({type: Boolean}) removable: boolean | undefined = undefined;

  @state() text: string = "";
  @state() removedByUser: boolean = false;

  @query(".c-pill") pillContainer: HTMLDivElement;
  @query(".c-pill_item__button") removeButton: HTMLButtonElement;

  private handleSlotChange() {
    const slotContent = this.pillSlot?.assignedNodes()[0];
    if (slotContent != null && slotContent instanceof Text) {
      this.text = slotContent.textContent;
    }

  }

  removePill() {
    if (this.removable) {
      this.dispatchEvent(new CustomEvent("removed"));
      this.remove();
    }
  }

  addHoverClass() {
    this.removablePill?.classList.add("-hover");
  }

  removeHoverClass() {
    this.removablePill?.classList.remove("-hover");
  }

  private removeIconTemplate(removable: boolean) {
    return when(removable, () => html`
      <svg style="display:none" data-e2e=${E2E.PillRemoveIcon}>
        <defs>
          <symbol id="i-close" viewBox="0 0 24 24">
            <path
              d="M14.375 11.975L19.775 6.625C20.075 6.325 20.075 5.775 19.775 5.475L18.525 4.225C18.225 3.925 17.675 3.925 17.375 4.225L12.025 9.625L6.625 4.225C6.325 3.925 5.775 3.925 5.475 4.225L4.225 5.475C3.925 5.775 3.925 6.325 4.225 6.625L9.625 11.975L4.225 17.375C3.925 17.675 3.925 18.225 4.225 18.525L5.475 19.775C5.775 20.075 6.325 20.075 6.625 19.775L12.025 14.375L17.375 19.775C17.675 20.075 18.225 20.075 18.525 19.775L19.775 18.525C20.075 18.225 20.075 17.675 19.775 17.375L14.375 11.975Z"
            />
          </symbol>
        </defs>
      </svg>`, null
    );
  }

  private removeButtonTemplate(removable: boolean) {
    return when(removable, () => html`
        <div class="c-pill_item__button-container" data-e2e="${E2E.PillItemButtonContainer}">
          <button
            class="c-pill_item__button ${classMap(this._classes)}"
            @click="${this.removePill}"
            @focus="${this.addHoverClass}"
            @blur="${this.removeHoverClass}"
            @mouseenter="${this.addHoverClass}"
            @mouseleave="${this.removeHoverClass}"
            data-e2e="${E2E.PillItemButton}"
            aria-label="${this.ariaLabel}"
          >
            <svg aria-hidden="true" class="c-icon-text__icon" role="button">
              <use xlink:href="#i-close"></use>
            </svg>
          </button>
        </div>`
      , null);
  }

  render() {
    return html`
      ${this.removeIconTemplate(this.removable)}
      <div class="c-pill" data-e2e=${E2E.Pill}>
        <div
          class="c-pill_item ${classMap(this._classes)}"
          data-e2e="${E2E.PillItem}"
        >
          <div class="c-pill_item__content">
            <slot data-e2e="${E2E.PillTextSlot}" @slotchange=${this.handleSlotChange}></slot>
            ${this.removeButtonTemplate(this.removable)}
          </div>
        </div>
      </div>
    `;
  }

  // Getters & setters

  public get removablePill(): HTMLDivElement {
    return this.shadowRoot.querySelector(".c-pill_item");
  }

  public get pillSlot(): HTMLSlotElement {
    return this.shadowRoot.querySelector("slot");
  }

  public get ariaLabel(): string {
    return `Verwijder ${this.text}`;
  }

  public get sanitizedColor(): PillColorsEnum {
    const lowerCaseColor = this.color.toLowerCase();
    if (!(Object.values(PillColorsEnum).includes(lowerCaseColor as PillColorsEnum))) {
      throw Error(`Invalid color property: "${this.color}"`);
    }
    return this.color.toLowerCase() as PillColorsEnum;
  }

  public  get neutral(): boolean {
    return this.sanitizedColor === "neutral";
  }


  public  get success(): boolean {
    return this.sanitizedColor === "success";
  }


  public  get info(): boolean {
    return this.sanitizedColor === "info";
  }


  public  get warning(): boolean {
    return this.sanitizedColor === "warning";
  }


  public  get danger(): boolean {
    return this.sanitizedColor === "danger";
  }

  private get _classes() {
    return {
      "-neutral": this.neutral,
      "-success": this.success,
      "-info": this.info,
      "-warning": this.warning,
      "-danger": this.danger,
      "-light": this.light,
      "-white": this.white,
    }
  }

}
