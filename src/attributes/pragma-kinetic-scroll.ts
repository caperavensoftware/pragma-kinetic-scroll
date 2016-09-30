import {inject, customAttribute, DOM} from 'aurelia-framework';

@customAttribute('pragma-kinetic-scroll')
@inject(DOM.Element)
export class PragmaKineticScroll {
    tapMethod;
    dragMethod;
    releaseMethod;

    constructor(private element) {
        this.tapMethod = this.tap.bind(this);
        this.dragMethod = this.drag.bind(this);
        this.releaseMethod = this.drag.bind(this);
    }

    attached() {
        this.element.addEventListener("touchstart", this.tapMethod);
        this.element.addEventListener("mousedown", this.tapMethod);
        this.element.addEventListener("touchmove", this.dragMethod);
        this.element.addEventListener("mousemove", this.dragMethod);
        this.element.addEventListener("touchend", this.releaseMethod);
        this.element.addEventListener("mouseup", this.releaseMethod);
    }

    detached() {
        this.element.removeEventListener("touchstart", this.tapMethod);
        this.element.removeEventListener("mousedown", this.tapMethod);
        this.element.removeEventListener("touchmove", this.dragMethod);
        this.element.removeEventListener("mousemove", this.dragMethod);
        this.element.removeEventListener("touchend", this.releaseMethod);
        this.element.removeEventListener("mouseup", this.releaseMethod);
    }

    tap(event) {

    }

    drag(event) {

    }

    release(event) {

    }
 }