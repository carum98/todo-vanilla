// @ts-nocheck
const colors = [
    '#f43b30',
    '#e71f56',
    '#9c27b0',
    '#673ab7',
    '#3f51b5',
    '#5677fc',
    '#03a9f4',
    '#00bcd4',
    '#009688',
    '#259b24',
    '#8bc34a',
    '#cddc39',
    '#ffeb3b',
    '#ffc107',
    '#ff9800',
    '#ff5722',
    '#795548',
    '#607d8b',
    '#9e9e9e',
]

export class ColorPicker extends HTMLElement {
    static formAssociated = true

    constructor() {
        super()
        this.value = '#f43b30'
        this.internals = this.attachInternals();

        this.attachShadow({ mode: "open" })
    }

    static get observedAttributes() {
        return ["value"]
    }
    
    attributeChangedCallback(name, old, now) {
        const active = this.shadowRoot.querySelector('button.active')

        if (active) {
            active.classList.remove('active')
        }

        const button = this.shadowRoot.querySelector(`button[data-color="${now}"]`)
        button.classList.add('active')
    }

    connectedCallback() {
        this.shadowRoot.innerHTML = /* html */`
            <style>${ColorPicker.styles}</style>

            <div class="color-picker">
                ${colors.map(color => `<button class="color" style="background-color: ${color};" data-color="${color}"></button>`).join('')}
            </div>
        `

        const buttons = this.shadowRoot.querySelectorAll('button')

        for (const button of buttons) {
            button.addEventListener('click', () => {
                this.setAttribute('value', button.dataset.color)
                this.setValue(button.dataset.color)
            })
        }

        this.setAttribute('value', this.value)
        this.setValue(this.value)
    }

    setValue(v) {
        this.value = v;
        this.internals.setFormValue(v);
    }

    static get styles() {
        return /* css */`
        .color-picker {
            display: grid;
            grid-template-columns: repeat(6, 1fr);
            gap: 5px;
        
            & button {
                position: relative;
                width: 40px;
                height: 40px;
                border-radius: 10px;
                border: none;
                cursor: pointer;
        
                &.active::before {
                    content: '✔';
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    font-size: 20px;
                    color: #fff;
                }
            }
        }
        `
    }
}
