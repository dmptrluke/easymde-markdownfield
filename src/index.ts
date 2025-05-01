export { EasyMDE } from "./easymde";
export * from "./imports";

export class EasyMarkdownEditor extends HTMLElement {
    name = "World";

    constructor() {
        super();
        this.name = "World";
    }

    connectedCallback() {
        const shadow = this.attachShadow({ mode: "closed" });
        shadow.innerHTML = "Hello World!" + this.name;
    }

    static get observedAttributes() {
        return ["name"];
    }

    attributeChangedCallback(name: string, oldValue: string, newValue: string) {
        if (name === "name") {
            this.name = newValue;
        }
        console.log("Attribute Changed", name, oldValue, newValue);
    }
}

customElements.define("easy-markdown-editor", EasyMarkdownEditor);
