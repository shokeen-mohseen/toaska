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
exports.TotalSumQuantityModel = exports.InventoryModel = void 0;
var Pagination_Model_1 = require("./Pagination.Model");
var InventoryModel = /** @class */ (function (_super) {
    __extends(InventoryModel, _super);
    function InventoryModel() {
        return _super.call(this) || this;
    }
    return InventoryModel;
}(Pagination_Model_1.PaginationModel));
exports.InventoryModel = InventoryModel;
var TotalSumQuantityModel = /** @class */ (function () {
    function TotalSumQuantityModel() {
    }
    return TotalSumQuantityModel;
}());
exports.TotalSumQuantityModel = TotalSumQuantityModel;
//# sourceMappingURL=inventory.model.js.map