import {inject, customAttribute, DOM} from 'aurelia-framework';

@customAttribute('pragma-kinetic-scroll')
@inject(DOM.Element)
export class PragmaKineticScroll {
    element: any;
    targetId: string;
    scrollTarget: any;
    tapMethod: any;
    trackMethod: any;
    autoScrollMethod: any;

    dragMethod: any;
    releaseMethod: any;
    sizeChangedMethod: any;
    parentBounds: any;
    childBounds: any;

    max: number;
    min: number;
    offset: number;
    oldY: number;
    pressed: boolean;

    velocity: number;
    amplitude: number;
    frame: any;
    timestamp: any;
    ticker: any;
    target: number;

    constructor(element) {
        this.element = element;
        this.tapMethod = this.tap.bind(this);
        this.dragMethod = this.drag.bind(this);
        this.releaseMethod = this.release.bind(this);
        this.sizeChangedMethod = this.sizeChanged.bind(this);
        this.trackMethod = this.track.bind(this);
        this.autoScrollMethod = this.autoScroll.bind(this);
    }

    valueChanged(newValue) {
        if (newValue) {
            this.targetId = newValue;
        }
    }

    setup() {
        this.parentBounds = this.element.getBoundingClientRect();
        this.offset = 0;
        this.min = 0;
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
        addEventListener('resize', this.sizeChangedMethod);
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

        this.element.removeEventListener("mouseleave", this.releaseMethod);

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

        this.velocity = this.amplitude = 0;
        this.frame = this.offset;
        this.timestamp = Date.now();
        clearInterval(this.ticker);
        this.ticker = setInterval(this.trackMethod, 100);

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
        if (!this.pressed) {
            return;
        }

        this.pressed = false;

        clearInterval(this.ticker);

        if (Math.abs(this.velocity) > 10) {
            this.amplitude = this.velocity;
            this.target = Math.round(this.offset + this.amplitude);
            this.timestamp = Date.now();
            requestAnimationFrame(this.autoScrollMethod);
        }

        event.preventDefault();
        event.stopPropagation();
        return false;
    }

    sizeChanged() {
        this.parentBounds = this.element.getBoundingClientRect();
    }

    track() {
        const power = 1000;
        let now = Date.now();
        let elapsed = now - this.timestamp;
        this.timestamp = now;
        let delta = this.offset - this.frame;
        this.frame = this.offset;

        let v = power * delta / (1 + elapsed);
        this.velocity = 0.8 * v + 0.2 * this.velocity;
    }

    autoScroll() {
        const timeConstant = 325;

        let elapsed, delta;
        if (this.amplitude) {
            elapsed = Date.now() - this.timestamp;
            delta = -this.amplitude * Math.exp(-elapsed / timeConstant);

            if (Math.abs(delta) > 1) {
                this.scroll(this.target + delta);
                requestAnimationFrame(this.autoScrollMethod);
            } else {
                this.scroll(this.target);
            }
        }
    }
 }