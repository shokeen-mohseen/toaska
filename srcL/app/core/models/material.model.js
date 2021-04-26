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
exports.MaterialCommodityMap = void 0;
var Pagination_Model_1 = require("./Pagination.Model");
var MaterialCommodityMap = /** @class */ (function (_super) {
    __extends(MaterialCommodityMap, _super);
    function MaterialCommodityMap() {
        var _this = _super.call(this) || this;
        _this.setupComplete = false;
        _this.isReserve = false;
        _this.isActive = false;
        _this.isDeleted = false;
        return _this;
    }
    return MaterialCommodityMap;
}(Pagination_Model_1.PaginationModel));
exports.MaterialCommodityMap = MaterialCommodityMap;
//export class MaterialCommodityMapModel extends Material {
//  defaultCommodity: string;
//  constructor() {
//    super();
//  }
//}
//# sourceMappingURL=material.model.js.map