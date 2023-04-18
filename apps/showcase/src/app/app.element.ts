import "./app.element.scss";
import "@vdab/design-component/pill"

export class AppElement extends HTMLElement {
  public static observedAttributes = [];

  connectedCallback() {

    this.innerHTML = `
    <div>
    <vdab-pill removable light>Verwijder mij</vdab-pill>
    </div>
      `;
  }
}
customElements.define("huisstijl-v4-root", AppElement);
