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
exports.MessageViewModel = void 0;
var Pagination_Model_1 = require("./Pagination.Model");
var MessageViewModel = /** @class */ (function (_super) {
    __extends(MessageViewModel, _super);
    function MessageViewModel() {
        return _super.call(this) || this;
    }
    return MessageViewModel;
}(Pagination_Model_1.PaginationModel));
exports.MessageViewModel = MessageViewModel;
//# sourceMappingURL=message.js.map