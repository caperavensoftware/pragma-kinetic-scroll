import {bindable} from 'aurelia-framework';

export class Welcome {
    @bindable items;

    constructor() {
        this.items = [1000];

        for (var i = 0; i < 1000; i++) {
            this.items.push({
                text: `Item Number: ${i}`
            });
        }
    }
}