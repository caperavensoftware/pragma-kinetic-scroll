import {expect} from 'chai';
import {Welcome} from './../../../src/views/welcome/welcome';

describe('Welcome Tests', function() {
   var welcome;

   beforeEach(function() {
       welcome = new Welcome();
   });

   it('constructor', function() {
       expect(welcome).to.not.be.null;
   });
})