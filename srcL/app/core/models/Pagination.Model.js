"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaginationModel = void 0;
var PaginationModel = /** @class */ (function () {
    function PaginationModel() {
        this.pageNo = 1;
        this.pageSize = 10;
        this.sortOrder = "ASC";
        this.pageSizeOptions = [10, 20, 30, 40, 50];
    }
    return PaginationModel;
}());
exports.PaginationModel = PaginationModel;
//# sourceMappingURL=Pagination.Model.js.map