"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommodityPaginatorListViewModel = exports.PeriodicElement = exports.CommodityTypeListViewModel = exports.CommodityCallListViewModel = void 0;
var CommodityCallListViewModel = /** @class */ (function () {
    function CommodityCallListViewModel() {
        this.PageNo = 1;
        this.PageSize = 10;
    }
    return CommodityCallListViewModel;
}());
exports.CommodityCallListViewModel = CommodityCallListViewModel;
var CommodityTypeListViewModel = /** @class */ (function () {
    function CommodityTypeListViewModel() {
        this.ClientID = 100;
    }
    return CommodityTypeListViewModel;
}());
exports.CommodityTypeListViewModel = CommodityTypeListViewModel;
var PeriodicElement = /** @class */ (function () {
    function PeriodicElement() {
        this.IsSeleted = false;
        this.Count = 0;
        this.IsSeleted = false;
        this.Count = 0;
    }
    return PeriodicElement;
}());
exports.PeriodicElement = PeriodicElement;
//export class CommodityType {
//  code: any;  
//  name: any;  
//}
var CommodityPaginatorListViewModel = /** @class */ (function () {
    function CommodityPaginatorListViewModel() {
        this.ClientID = 100;
        this.PageNo = 0;
        this.PageSize = 10;
    }
    return CommodityPaginatorListViewModel;
}());
exports.CommodityPaginatorListViewModel = CommodityPaginatorListViewModel;
//# sourceMappingURL=commodity.model.js.map