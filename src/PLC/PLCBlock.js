"use strict";
exports.__esModule = true;
var BaseBlock = /** @class */ (function () {
    function BaseBlock(initVal) {
        this.token = Symbol('token for closure');
        this.Q = Boolean(initVal);
        BaseBlock.stateClosure[this.token] = {
            posEdge: false,
            negEdge: false
        };
    }
    BaseBlock.prototype.toString = function () {
        return this.Q;
    };
    BaseBlock.prototype.lineIn = function (newVal) {
        newVal = Boolean(newVal);
        var closure = BaseBlock.stateClosure[this.token];
        if (newVal === this.Q) {
            // this.Q: true -> true | false -> false
            closure.negEdge = closure.posEdge = false;
            return;
        }
        if (this.Q - newVal === 1) {
            // this.Q: true -> false
            closure.negEdge = true;
            closure.posEdge = false;
        }
        else {
            // this.Q: false -> true
            closure.posEdge = true;
            closure.negEdge = false;
        }
        this.Q = newVal;
    };
    BaseBlock.prototype.ne = function () {
        return BaseBlock.stateClosure[this.token].negEdge;
    };
    BaseBlock.prototype.pe = function () {
        return BaseBlock.stateClosure[this.token].posEdge;
    };
    BaseBlock.stateClosure = {};
    return BaseBlock;
}());
exports.BaseBlock = BaseBlock;
