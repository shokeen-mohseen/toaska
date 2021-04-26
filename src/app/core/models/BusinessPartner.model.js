"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Charge = exports.ChargeMapComputationMethod = exports.ChargeCategory = exports.ChargeType = void 0;
var ChargeType = /** @class */ (function () {
    function ChargeType() {
    }
    return ChargeType;
}());
exports.ChargeType = ChargeType;
var ChargeCategory = /** @class */ (function () {
    function ChargeCategory() {
    }
    return ChargeCategory;
}());
exports.ChargeCategory = ChargeCategory;
var ChargeMapComputationMethod = /** @class */ (function () {
    function ChargeMapComputationMethod() {
    }
    return ChargeMapComputationMethod;
}());
exports.ChargeMapComputationMethod = ChargeMapComputationMethod;
var Charge = /** @class */ (function () {
    function Charge() {
        this.isActive = false;
        this.domesticOnly = false;
        this.exportOnly = false;
        this.domesticExportBoth = false;
    }
    return Charge;
}());
exports.Charge = Charge;
//# sourceMappingURL=charge.model.js.map