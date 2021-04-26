"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var PatientPartographBase = /** @class */ (function () {
    function PatientPartographBase() {
    }
    return PatientPartographBase;
}());
exports.PatientPartographBase = PatientPartographBase;
var PatientRegistration = /** @class */ (function (_super) {
    __extends(PatientRegistration, _super);
    function PatientRegistration() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return PatientRegistration;
}(PatientPartographBase));
exports.PatientRegistration = PatientRegistration;
var PatientPartographDetail = /** @class */ (function (_super) {
    __extends(PatientPartographDetail, _super);
    function PatientPartographDetail() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return PatientPartographDetail;
}(PatientPartographBase));
exports.PatientPartographDetail = PatientPartographDetail;
//# sourceMappingURL=partograph-registration.js.map