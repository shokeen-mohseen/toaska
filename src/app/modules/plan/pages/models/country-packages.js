"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var forms_1 = require("@angular/forms");
var CountryPackages = /** @class */ (function () {
    function CountryPackages() {
    }
    CountryPackages.asFormGroup = function (countryPackage) {
        var fg = new forms_1.FormGroup({
            CountryName: new forms_1.FormControl(countryPackage.CountryName),
            CountryCode: new forms_1.FormControl(countryPackage.CountryCode),
            Packages: new forms_1.FormControl(countryPackage.Packages),
            ChoosePackage1: new forms_1.FormControl(null),
            ChoosePackage2: new forms_1.FormControl(null),
            ChooseCountry: new forms_1.FormControl(null),
        });
        return fg;
    };
    return CountryPackages;
}());
exports.CountryPackages = CountryPackages;
//# sourceMappingURL=country-packages.js.map