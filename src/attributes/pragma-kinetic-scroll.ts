import {inject, customAttribute, DOM} from 'aurelia-framework';

@customAttribute('pragma-kinetic-scroll')
@inject(DOM.Element)
export class PragmaKineticScroll {
    element: any;
    targetId: string;
    scrollTarget: any;
    tapMethod: any;

    dragMethod: any;
    releaseMethod: any;
    parentBounds: any;
    childBounds: any;

    max: number;
    min: number;
    offset: number;
    oldY: number;
    pressed: boolean;

    constructor(element) {
        this.element = element;
        this.tapMethod = this.tap.bind(this);
        this.dragMethod = this.drag.bind(this);
        this.releaseMethod = this.release.bind(this);
    }

    valueChanged(newValue) {
        if (newValue) {
            this.targetId = newValue;
        }
    }

    setup() {
        this.parentBounds = this.element.getBoundingClientRect();
        this.offset = 0;
        this.min = -30;
        this.pressed = false;

        this.scrollTarget.addEventListener("touchstart", this.tapMethod);
        this.scrollTarget.addEventListener("mousedown", this.tapMethod);
        this.scrollTarget.addEventListener("touchmove", this.dragMethod);
        this.scrollTarget.addEventListener("mousemove", this.dragMethod);
        this.scrollTarget.addEventListener("touchend", this.releaseMethod);
        this.scrollTarget.addEventListener("mouseup", this.releaseMethod);

        this.element.style.overflow = "hidden";
    }

    attached() {
        this.element.addEventListener("mouseleave", this.releaseMethod);

        this.scrollTarget = document.getElementById(this.targetId);
        this.setup();
    }

    detached() {
        this.scrollTarget.removeEventListener("touchstart", this.tapMethod);
        this.scrollTarget.removeEventListener("mousedown", this.tapMethod);
        this.scrollTarget.removeEventListener("touchmove", this.dragMethod);
        this.scrollTarget.removeEventListener("mousemove", this.dragMethod);
        this.scrollTarget.removeEventListener("touchend", this.releaseMethod);
        this.scrollTarget.removeEventListener("mouseup", this.releaseMethod);

        this.scrollTarget = null;
        this.element = null;
    }

    ypos(e) {
        // touch event
        if (e.targetTouches && (e.targetTouches.length >= 1)) {
            return e.targetTouches[0].clientY;
        }

        // mouse event
        return e.clientY;
    }


    scroll(y) {
        this.offset = (y > this.max) ? this.max : (y < this.min) ? this.min : y;
        this.scrollTarget.style.transform = 'translateY(' + (-this.offset) + 'px)';
    }

    tap(event) {
        this.pressed = true;
        this.oldY = this.ypos(event);
        this.childBounds = this.scrollTarget.getBoundingClientRect();
        this.max = Math.abs(this.parentBounds.height - this.childBounds.height);

        event.preventDefault();
        event.stopPropagation();
        return false;
    }

    drag(event) {
        var y, delta;
        if (this.pressed) {
            y = this.ypos(event);
            delta = this.oldY - y;
            if (delta > 5 || delta < -5) {
                this.oldY = y;
                this.scroll(this.offset + delta);
            }
        }
        event.preventDefault();
        event.stopPropagation();
        return false;
    }

    release(event) {
        this.pressed = false;

        if (this.offset <= this.min) {
            this.snapToTop();
        }

        event.preventDefault();
        event.stopPropagation();
        return false;
    }

    snapToTop() {
        this.scrollTarget.style.transform = 'translateY(0px)';
    }
 }