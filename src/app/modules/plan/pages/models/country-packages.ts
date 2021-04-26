import { PackagePlan } from "./packages";
import { FormGroup, FormControl } from "@angular/forms";

export class CountryPackages {
  countryname: string;
  CountryName: string;
  CountryCode: string;
  CurrencyCode: string;
  ChoosePackage1: number;
  ChoosePackage2: number;
  ChooseCountry: number;
  Packages: PackagePlan[]


  static asFormGroup(countryPackage: CountryPackages): FormGroup {
    const fg = new FormGroup({
     countryname: new FormControl(countryPackage.CountryName),
      CountryName: new FormControl(countryPackage.CountryName),
      CountryCode: new FormControl(countryPackage.CountryCode),
      CurrencyCode: new FormControl(countryPackage.CurrencyCode),
      Packages: new FormControl(countryPackage.Packages),
      ChoosePackage1: new FormControl(null),
      ChoosePackage2: new FormControl(null),
      ChooseCountry: new FormControl(null),
    });
    return fg;
  }

}
