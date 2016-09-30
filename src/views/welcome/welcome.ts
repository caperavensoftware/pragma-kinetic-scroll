import {bindable} from 'aurelia-framework';

export class Welcome {
    @bindable items;

    constructor() {
        this.items = [100];

        for (var i = 0; i < 100; i++) {
            this.items.push({
                text: `Item Number: ${i}`
            });
        }
    }
}