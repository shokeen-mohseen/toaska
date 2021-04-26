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
exports.OperatingLocation2 = exports.OperatingLocation = exports.BaseOpearting = void 0;
var Pagination_Model_1 = require("../../../../core/models/Pagination.Model");
var BaseOpearting = /** @class */ (function (_super) {
    __extends(BaseOpearting, _super);
    function BaseOpearting() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return BaseOpearting;
}(Pagination_Model_1.PaginationModel));
exports.BaseOpearting = BaseOpearting;
var OperatingLocation = /** @class */ (function (_super) {
    __extends(OperatingLocation, _super);
    function OperatingLocation() {
        var _this = _super.call(this) || this;
        _this.isSelected = false;
        return _this;
    }
    return OperatingLocation;
}(BaseOpearting));
exports.OperatingLocation = OperatingLocation;
var OperatingLocation2 = /** @class */ (function () {
    function OperatingLocation2() {
    }
    return OperatingLocation2;
}());
exports.OperatingLocation2 = OperatingLocation2;
//# sourceMappingURL=operating-location.js.map