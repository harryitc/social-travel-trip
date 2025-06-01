import { ContainerBlot, Root } from '../lib/parchment-3.0.0/parchment';

class Container extends ContainerBlot {
    //Constructor
    constructor(scroll: Root, public domNode: HTMLElement) {
        super(scroll, domNode);
    }
}

export default Container;
