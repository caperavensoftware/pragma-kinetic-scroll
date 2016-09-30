import {assert, expect} from 'chai';
import * as sinon from 'sinon';
import 'aurelia-polyfills';
import {PragmaKineticScroll} from './../../src/attributes/pragma-kinetic-scroll';

class ElementMock {
    addEventListener(event, method){};
    removeEventListener(event, method){};
}

describe('PragmaKineticScroll Tests', function() {
    var pragmaKineticScroll;
    var element = new ElementMock();

    beforeEach(function() {
        pragmaKineticScroll = new PragmaKineticScroll (element);
    });
    
    it('constructor', function() {
        expect(pragmaKineticScroll).to.not.be.null;
    });

    it('attached', function() {
        // Arrange
        const addEventListenerSpy = sinon.spy(element, "addEventListener");

        // Act
        pragmaKineticScroll.attached();

        // Assert
        assert(addEventListenerSpy.callCount == 6);
        assert(addEventListenerSpy.calledWith("touchstart"));
        assert(addEventListenerSpy.calledWith("mousedown"));
        assert(addEventListenerSpy.calledWith("touchmove"));
        assert(addEventListenerSpy.calledWith("mousemove"));
        assert(addEventListenerSpy.calledWith("touchend"));
        assert(addEventListenerSpy.calledWith("mouseup"));
        addEventListenerSpy.restore();
    });

    it('detached', function() {
        // Arrange
        const removeEventListenerSpy = sinon.spy(element, "removeEventListener");

        // Act
        pragmaKineticScroll.detached();

        // Assert
        assert(removeEventListenerSpy.callCount == 6);
        assert(removeEventListenerSpy.calledWith("touchstart"));
        assert(removeEventListenerSpy.calledWith("mousedown"));
        assert(removeEventListenerSpy.calledWith("touchmove"));
        assert(removeEventListenerSpy.calledWith("mousemove"));
        assert(removeEventListenerSpy.calledWith("touchend"));
        assert(removeEventListenerSpy.calledWith("mouseup"));
        removeEventListenerSpy.restore();
    });
});