"use strict";
exports.__esModule = true;
require('chai').should();
// const Vue = require('vue')
var vue_1 = require("vue");
var PLCBlock_1 = require("../src/PLC/PLCBlock");
describe('BaseBlock in Vue data', function () {
    var _a = {
        tBlock: new PLCBlock_1.BaseBlock(true),
        fBlock: new PLCBlock_1.BaseBlock(false),
        dBlock: new PLCBlock_1.BaseBlock()
    }, tBlock = _a.tBlock, fBlock = _a.fBlock, dBlock = _a.dBlock;
    var v = new vue_1["default"]({
        data: function () {
            return {
                tBlock: tBlock,
                fBlock: fBlock,
                dBlock: dBlock
            };
        }
    });
    describe('tBlock', function () {
        describe('#Q', function () {
            it('should equal true', function () {
                tBlock.Q.should.equal(true);
            });
        });
        describe('#toString', function () {
            it('should return true', function () {
                tBlock.toString().should.equal(true);
            });
        });
        function easyLineIn(block, lineIn, Q, toString, pe, ne) {
            block.lineIn(lineIn);
            block.Q.should.equal(Q);
            block.toString().should.equal(toString);
            block.pe().should.equal(pe);
            block.ne().should.equal(ne);
        }
        describe('#lineIn', function () {
            it('lineIn(true), Q -> true, ne & pe -> false', function () {
                easyLineIn(tBlock, true, true, true, false, false);
            });
            it('lineIn(false), Q -> true, ne -> true, pe -> false', function () {
                easyLineIn(tBlock, false, false, false, false, true);
            });
            it('lineIn(false) Q -> false, pe & ne -> false', function () {
                easyLineIn(tBlock, false, false, false, false, false);
            });
            it('lineIn(true) Q -> true, pe -> true, ne -> false', function () {
                easyLineIn(tBlock, true, true, true, true, false);
            });
        });
    });
});
