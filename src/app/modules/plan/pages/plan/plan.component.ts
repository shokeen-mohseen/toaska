import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { SendObject, Sunbscription } from '../models/send-object'
import { SubscriptionPromotionService } from '../services/subscription-promotion.services';
import { CountryPackages } from '../models/country-packages';
import { MatTableDataSource, MatTable } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, FormArray, Validators, FormControl, AbstractControl } from '@angular/forms';
declare var $: any;
import { ToastrService } from 'ngx-toastr';
import { AuthService, User } from '@app/core';
import { Subscription } from 'rxjs';
import moment from 'moment';
import { retry } from 'rxjs/operators';
import { NgbModalRef, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { HintMessageComponent } from '../../popup/hint-message/hint-message.component';

import { projectkey } from 'environments/projectkey';
import { getGlobalRibbonActions } from '@app/shared/components/top-btn-group/page-actions-map';
import { TopBtnGroupComponent } from '@app/shared/components/top-btn-group/top-btn-group.component';


@Component({
  selector: 'app-plan',
  templateUrl: './plan.component.html',
  styleUrls: ['./plan.component.css']
})
export class PlanComponent implements OnInit, AfterViewInit {

  @ViewChild('btnBar') btnBar: TopBtnGroupComponent;
  actionGroupConfig;

  sendObject: SendObject; couponDescription: string; IsCouponApplied: boolean = false;
  IsCouponSelection: boolean = false; endPromotionate: Date;
  promotionList: any; promotionListUsedByClient: any[];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  form: FormGroup; subscriptionPackageTypeList: any;
  formAppendData: FormGroup; modalRef: NgbModalRef;
  countryPackages: CountryPackages[] = [];
  dataSource: MatTableDataSource<any>;
  currentUser: User; userName: string; sPromotionId = 0;
  displayedColumns: string[] = ['country', 'plan'];
  subscription: Sunbscription; promoteId: number;
  EntityID: number; UserAlertID: Number;
  readonly formControl: AbstractControl; isLoading: boolean;
    IsTosca: boolean;
  constructor(public modalService: NgbModal, private authenticationService: AuthService, private router: Router,private toastr: ToastrService,
    private _formBuilder: FormBuilder, private subscriptionPromotionService: SubscriptionPromotionService) {
    this.currentUser = this.authenticationService.currentUserValue;
    this.userName = this.authenticationService.currentUserValue.LoginId
   // console.log(this.currentUser.ClientId)
    this.sendObject = new SendObject();
    this.subscription = new Sunbscription();
   // this.paginator = 1;
    this.promoteId = 0;
    this.sPromotionId = 0;
   
  }

  actionHandler(type) {
    //if (type === 'add') {}
  }

  ngAfterViewInit() {

    this.btnBar.hideAction('refresh');
    this.btnBar.hideAction('cancel');
    this.btnBar.hideAction('showDetails');
    this.btnBar.hideAction('invoice');
    this.btnBar.hideAction('duplicateForecast');
    this.btnBar.hideAction('deleteSelectedRow');
    this.btnBar.hideAction('deleteSelectedForecast');
    this.btnBar.hideAction('refresh');
    this.btnBar.hideAction('regularOrder');
    this.btnBar.hideAction('bulkOrder');
    this.btnBar.hideAction('copy');
    this.btnBar.hideAction('updateContract');

    this.btnBar.disableAction('add');
    this.btnBar.disableAction('edit');
    this.btnBar.disableAction('delete');
    this.btnBar.disableAction('issue');

    this.btnBar.hideTab('key_Data');
    this.btnBar.hideTab('key_Action');
    this.btnBar.hideTab('key_View');    
  }
  
  ngOnInit() {
    this.promotionListUsedByClient = [];
    this.sendObject.PageNo = 1;
    this.sendObject.PageSize = 400;
   // this.sendObject.ClientId = null;
    this.form = this._formBuilder.group({
      countryFromArray: this._formBuilder.array([])
    });
      
   
    this.subscriptionPromotionService.getCountryWisePackagesAsFormArray(this.sendObject)
      .subscribe(res => {
       // console.log(res)
      this.form.setControl('countryFromArray', res);
      this.form.setControl('ChoosePackage1', null);
      this.form.setControl('ChoosePackage2', null);
      this.form.setControl('ChooseCountry', null);
        this.dataSource = new MatTableDataSource((this.form.get('countryFromArray') as FormArray).controls);
        this.dataSource.filterPredicate = (data: FormGroup, filter: string) => {
         // console.log(data.controls)
          return Object.values(data.controls).some(x => x.get("CountryName").value == filter);
        };
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
        localStorage.removeItem("SubscriptionHint");
      });

    // Discount Coupon List

    this.initailSelectedPlan();

    this.GetPromotionList();


    if (projectkey.projectname == "tosca") {
      this.IsTosca = true;
    }
    else {
      this.IsTosca = false;
    }

    this.actionGroupConfig = getGlobalRibbonActions();
       
    
   
  }
    
  openHintMessage() {
    this.modalRef = this.modalService.open(HintMessageComponent, { size: 'lg', backdrop: 'static' });
    //this.modalRef.componentInstance.modalData = this.modalPopupData;
    this.modalRef.result.then((result) => {
    }).catch((result) => {
    });
  }
  initailSelectedPlan() {

    this.sendObject.ClientId = this.currentUser.ClientId;

    this.formAppendData = this._formBuilder.group({
      IsSelectionAll: [false],
      PromotionId: [0],
      formList: this._formBuilder.array([])
    });
        
  //  console.log(this.formList)
    this.subscriptionPromotionService.GetClientWiseSubscriptionList(this.sendObject)
      .subscribe(res => {
        console.log(res)
        if (res.Message == "Success") {
          //initItems(packageList, CountryName, packaTypeId, FreePartograph, PackageId, packageType, CurrencyCode, SubscriptionStatus): FormGroup {
          let result = res.Data;
          if (res.Data.length > 0) {
            for (var i = 0; i < res.Data.length; i++) {
              console.log("PromotionId " + result[i].PromotionId)
              this.sPromotionId = result[i].PromotionId;
              let countryName = result[i].CountryName + "(" + result[i].CurrencyCode + ")";
              let packageTypeId = result[i].PackageTypeID;
              let FreePartograph = result[i].PackageTypeDesc ;
              let packageId = result[i].PackageId;
              let EffectiveDate = result[i].EffectiveDate;
              let EndDate = result[i].EndDate;
              let CurrencyCode = result[i].CurrencyCode;
              let SubscriptionStatus = result[i].SubscriptionStatus;
              let packaType = result[i].PackageTypeName;
              let IsAutoRenew = result[i].IsAutoRenew;
              let IsActive = result[i].IsActive;
              let IsNew = 2;
              
              this.formList.push(this.initItems(result[i].SubscriptionId, res.Data.length>1? 1: 0,IsNew, IsActive, true, EffectiveDate, EndDate, IsAutoRenew, '', countryName, packageTypeId, FreePartograph, packageId, packaType, CurrencyCode, SubscriptionStatus, result[i].CountryCode));

            }
          }
          if (this.sPromotionId > 0) {
            
            this.GetClientUsedPromotionList();
            this.IsCouponApplied = false;
            this.IsCouponSelection = false;
          }
          else {
            this.IsCouponApplied = true;
            //this.IsCouponSelection = false;
          }

        }



      });
  }
  // Filter 
  applyFilter(filterValue: string) {

    //console.log(this.dataSource)
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  get countryFromArray(): FormArray {
    return this.form.get('countryFromArray') as FormArray;
  }

  get formList(): FormArray {
    return this.formAppendData.get("formList") as FormArray;
    //console.log(this.formAppendData.get('formList'))
    return <FormArray>this.formAppendData.get('formList')
  }

  GetPackageList() {
    this.sendObject.PageNo = 1;
    this.sendObject.PageSize = 100;

    //this.dataList = new CountryPackages();
    this.subscriptionPromotionService.GetPackageList(this.sendObject).subscribe(res => {
      let fiveYrsId: any; let tenYrsId: any;
      let fiveYrs: any; let tenYrs: any; let checkIsTrue = true; let Iscounter = 0;
         
      for (var i = 0; i < res.Data.length; i++) {
        fiveYrs = ''; fiveYrsId = false; tenYrsId = false;
        tenYrs = ''; Iscounter = 0;
        if (res.Data[i].Packages.length > 0) {

          if (res.Data[i].Packages[0] != undefined) {
            fiveYrs = res.Data[i].Packages[0].Amount != undefined ? res.Data[i].Packages[0].Amount : '';
            fiveYrsId = res.Data[i].Packages[0].Id != undefined ? res.Data[i].Packages[0].Id : false; //res.Data[i].Packages[0].Id
            Iscounter = 0;
          }
          else {
            fiveYrs = '';
            fiveYrsId = false
            Iscounter = 1;
          }
          if (res.Data[i].Packages[1] != undefined) {
            tenYrs = res.Data[i].Packages[1].Amount != undefined ? res.Data[i].Packages[1].Amount : '';
            tenYrsId = res.Data[i].Packages[1].Id != undefined ? res.Data[i].Packages[1].Id : false;
            Iscounter = 0;
          }
          else {
            tenYrs = '';
            tenYrsId = false;
            if (Iscounter==1) {
              checkIsTrue = false;
            }
          }


        }
        else {
          checkIsTrue = false;
          fiveYrs = '';
          tenYrs = '';
          tenYrsId = false;
          fiveYrsId = false;
        }

        Iscounter = 0;

        //if (checkIsTrue){
      //this.dynamicData.push({
      //  "CountryName": res.Data[i].CountryName,
      //  "CountryCode": res.Data[i].CountryCode,
      //  "FiveYrs": fiveYrs != undefined ? fiveYrs : '',
      //  "TenYrs": tenYrs != undefined ? tenYrs : '',
      //  "FiveYrsId": fiveYrsId != undefined ? fiveYrsId : false,
      //  "TenYrsId": tenYrsId != undefined ? tenYrsId : false,
      //  "i": i + 1,
      //})

      //  this.Ischecked.push(false);
      //  this.IsRadiobutton1.push(false);
      //  this.IsRadiobutton2.push(false);
    //}
      }

      this.dataSource = new MatTableDataSource<CountryPackages>(res.Data);
    //  this.dataSource.data = this.dynamicData as IPackage[]

      console.log(this.dataSource)
    },
      error => {
        // .... HANDLE ERROR HERE 
        console.log(error);
        //this.data = null;
             }

    );
  }
  
  onCountryChange(event, album: FormGroup) {
    //console.log(album)
    //const ChooseCountry = album.get('ChooseCountry');
    //const ChoosePackage = album.get('ChoosePackage1');
   
  }


  onPackageChange(event, countryFromArray: FormGroup) {

    let isFalse = true;
    let selectedPlanArray = this.formList.value;
    const ChooseCountry = countryFromArray.get('ChooseCountry');
    const ChoosePackage = countryFromArray.get('ChoosePackage1');
    

    for (let i = 0; i < selectedPlanArray.length; i++) {
     
      if (selectedPlanArray[i].CountryCode == countryFromArray.get("CountryCode").value) {
        isFalse = false;
      }
    }
   // console.log(event.target.value)
    if (!isFalse) {
      ChoosePackage.setValue(null);
      this.toastr.error("Same country already exist in selected plan!");
      return;
    }
    //console.log(this.formList.value)
    //console.log(countryFromArray.get("CountryCode"))
    
     ChooseCountry.setValue(true);
   // ChoosePackage.setValue(event.target.value);
  }

  
  AddSubmit() {

    
    let arrayForm: any = []; let countryCodeParent;

    let IsValid = false; let IsValidCountry = false;
   // console.log(this.formList.value);
    let selectedPlanList = this.formList.value
    

    let forData = this.form.value;

    //console.log(forData.countryFromArray)
    if (this.form.value != null) {

      for (let i = 0; i < forData.countryFromArray.length; i++) {
        if (forData.countryFromArray[i].ChoosePackage1) {
          IsValid = true;
        }
      }

      for (let i = 0; i < forData.countryFromArray.length; i++) {
        if (forData.countryFromArray[i].ChooseCountry) {
          IsValidCountry = true;
        }

      }

      if (IsValid && IsValidCountry) {

        for (let i = 0; i < forData.countryFromArray.length; i++) {

          let packaType = ''; let currencyCode = ''; let cnCode = forData.countryFromArray[i].CountryCode;
          let countryName = forData.countryFromArray[i].CountryName + '(' + forData.countryFromArray[i].CurrencyCode + ')'
          let packageId = forData.countryFromArray[i].ChoosePackage1
          let chooseCountry = forData.countryFromArray[i].ChooseCountry
          let packageS = forData.countryFromArray[i].Packages;
          currencyCode = forData.countryFromArray[i].CurrencyCode;
          if (chooseCountry) {
            const JsonPackageList: any = packageS.filter(u => u.Id == packageId);

            if (JsonPackageList.length > 0) {
              //console.log(JsonPackageList)
              let packageTypeId = JsonPackageList[0].PackageTypeID;
              if (packageTypeId == '101') {
                packaType = 'Storage for 5 Years';
              }
              else {
                packaType = 'Storage for 10 Years';
              }
              let FreePartograph = '5 Per Partograph';
              //console.log(this.formList)
              let SubscriptionStatus = 'Pending';
              let IsNew = 1;
              this.formList.push(this.initItems(0,1,IsNew, false, false, '', '', false, JsonPackageList, countryName, packageTypeId, FreePartograph, packageId, packaType, currencyCode, SubscriptionStatus, cnCode));

            }
          }
        }

        this.countryFromArray.controls.forEach(item => item.get("ChoosePackage1").patchValue(null));
        this.toastr.success("Successfully added");

      }
      else {
        this.toastr.error("Select at least one row ");
      }
    }
    else {

    }
  }

  // Add rows in Package 
  initItems(SubscriptionId,IsDelete,IsNew, IsActive, Iselection, EffectiveDate, EndDate, IsAutoRenewal, packageList, CountryName, packaTypeId, FreePartograph, PackageId, packageType, CurrencyCode, SubscriptionStatus, CountryCode): FormGroup {

    //console.log(packageList)
    return this._formBuilder.group({
      SubscriptionId: [SubscriptionId],
      IsNew: [IsNew],
      IsActive: [IsActive],
      Iselection: [Iselection, Validators.required],
      CountryName: [CountryName],
      // EffectiveDate: new FormControl(new Date()),
      EffectiveDate: [EffectiveDate, Validators.required],
      //EffectiveDate: [moment().format('YYYY-MM-DD')],
      //PackageList: [packageList],
      EndDate: [EndDate],
      packageTypeId: [packaTypeId],
      PlanType: [packageType],
      FreePartograph: [FreePartograph],
      IsAutoRenewal: [IsAutoRenewal],
      PackageId: [PackageId],
      CurrencyCode: [CurrencyCode],
      SubscriptionStatus: [SubscriptionStatus],
      CountryCode: [CountryCode],
      IsDelete:[IsDelete]
    });
  }

  DeleteRow(event, index, formData: FormGroup) {

    const IsNew = formData.get('IsNew').value;
    const SubscriptionId = formData.get('SubscriptionId').value;
    //console.log(IsNew)
    if (IsNew != 1) {
      if (this.formList.length == 1) {
        this.toastr.warning("There is only one subscribtion in your account. This can't be deleted");
        return false;
      }
    }

    
    
    if (confirm("Are you sure want to delete this row")) {
      //console.log(this.formList.length)
      
      if (SubscriptionId > 0) {
        this.sendObject.ClientId = this.currentUser.ClientId;
        this.sendObject.Id = SubscriptionId;
        this.sendObject.UpdatedBy = this.currentUser.LoginId;
        this.sendObject.UpdateDateTimeBrowser = new Date();
        this.subscriptionPromotionService.DeleteSubscriptionListUserWise(this.sendObject)
          .subscribe(res => {

            if (res.Message == "Success") {
              this.initailSelectedPlan();
            }

          });
      }
      else {
        this.formList.removeAt(index);
      }

      

     // console.log(this.formList.length)
    }
  }
  
  ChangeDate(event, formData: FormGroup) {
    let yearAdd = 10;
    const packageTypeId = formData.get('packageTypeId').value;
    //console.log(packageTypeId)
    if (packageTypeId == '101') {
      yearAdd = 5;
    }

    let d = new Date(event.target.value);
    d.setFullYear(d.getFullYear() + 1);
    const EffectiveEnDate = formData.get('EndDate');
    EffectiveEnDate.setValue(d);
    
    const EffectiveDate = formData.get('EffectiveDate');
    EffectiveDate.setValue(new Date(event.target.value));

    //formData.get('EffectiveDate').markAsUntouched(null)
    //console.log(event)

    
    //this.forma.patchValue({ myDate: event.target.value });
  }

  // IsAutoRenewal checking
  AutoRenewalPackage(event, formData: FormGroup) {
    //console.log(formData)
    const IsAutoRenewal = formData.get('IsAutoRenewal');
   // console.log(IsAutoRenewal.value)
    //formData.patchValue({ "IsAutoRenewal": IsAutoRenewal.value == true ? false : true });
    //IsAutoRenewal.patchValue(IsAutoRenewal.value == true ? false : true);
  }
  
  IsAllSelect(e) {
    this.formList.controls.forEach(item => item.get("Iselection").patchValue(e.target.checked));
  }


  // select row 
  IsRowSelect(event, formData: FormGroup) {
    const IsAutoRenewal = formData.get('Iselection');
    IsAutoRenewal.setValue(true);
  }
  
  GetPromotionList() {
    this.sendObject.PageNo = 1;
    this.sendObject.PageSize = 100;
    this.sendObject.ClientId = this.currentUser.ClientId;
    this.subscriptionPromotionService.GetPromotionList(this.sendObject)
      .subscribe(res => {
        this.promotionList = res.Data;
        
      });
  }

  GetClientUsedPromotionList() {
    if (this.sPromotionId > 0) {
      this.sendObject.PageNo = 1;
      this.sendObject.PageSize = 1;
      this.sendObject.Id = this.sPromotionId;
      this.formAppendData.patchValue({ "PromotionId": this.sPromotionId });
      this.subscriptionPromotionService.GetClientWisePromotionList(this.sendObject)
        .subscribe(res => {
          this.promotionListUsedByClient = res.Data;

        });
    }
  }
  
  // Discount button 
  DiscountApply() {
   // this.sendObject.PageNo = 1;
    //this.sendObject.PageSize = 100;
    this.sendObject.ClientId = this.currentUser.ClientId;
    if (this.promoteId > 0) {
      this.subscriptionPromotionService.CheckSubscriptionPromotion(this.sendObject)
        .subscribe(res => {
         // console.log(res)
          if (res.Data == undefined) {
            this.IsCouponApplied = true;
            this.IsCouponSelection = true;
            this.formAppendData.patchValue({ "PromotionId": this.promoteId });
          }
          else {
           // this.toastr.error("Discount already in by you!");
            //alert(res.Data.length)
            if (res.Data != undefined || res.Data != null) {
              this.formAppendData.patchValue({ "PromotionId": res.Data.PromotionId });
              this.toastr.error("Discount coupon already used by you!");
              this.IsCouponApplied = false;
            }
            else {
              this.formAppendData.patchValue({ "PromotionId": this.promoteId });
              this.IsCouponApplied = true;
            }
          }
         // console.log(res.Data)
          // this.promotionList = res.Data;

        });
    }
    else {
      this.toastr.error("Select discount coupon!");
      this.formAppendData.patchValue({ "PromotionId": "0" });
    }
    
  }
  Alert() {
   
    let ClientId = null;
    let Name = "Users";
    
   // let entityId: number;
    this.subscriptionPromotionService.getEntityDetails(ClientId, Name).subscribe(res => {
      if (res.message == "Success") {
        this.EntityID = res.data.id;
       // alert(res.data.id);
        Name = "User Registration Request - To User";
        this.subscriptionPromotionService.getUserAlertDetails(ClientId, Name).subscribe(result => {
          if (result.message == "Success") {
            this.UserAlertID = result.data.id;
            let EntityKeyId = this.currentUser.UserId;

            this.subscriptionPromotionService.SaveAlertSystem(this.UserAlertID, this.EntityID, EntityKeyId, this.currentUser.ClientId).subscribe(res => {
              if (res.message == "Success") {
                this.isLoading = false;
                this.toastr.success("Subscription successfully saved");
                this.authenticationService.logout();
                this.router.navigate(['/auth/login']);
              }
              else {
                this.toastr.success("Error");
              }
            });
          }
          else {
            this.UserAlertID = 0;
          }
        });
      }        
        else {
        this.EntityID = 0;
      }
    });
    

   
  }
  // Finally subscribed 
  subscribePlan() {

    if (this.formList.invalid) {
      return;
    }
    

    let IsValidForm = false;
    let arrayFormData: any[]; let packageId; let PromotionId;
    let IsAutoRenewal; let EffectiveDate; let EndDate; 
    let formData = this.formAppendData.value;
    let isNew = 1;
    arrayFormData = [];
    //console.log(formData.length)
    console.log(formData)
    PromotionId = formData.PromotionId;

    if (PromotionId == 0 || PromotionId == null || PromotionId == undefined) {
      this.toastr.error("select Discount coupon and then click on Apply button");
      return false;
    }
    for (let i = 0; i < 1; i++) {
      let formListData = formData.formList;
      //console.log(formListData)
     // PromotionId = formListData[i].PromotionId;
      for (let j = 0; j < formListData.length; j++) {
        isNew = formListData[j].IsNew;
        console.log(isNew)
        if (isNew == 1) {
          if (formListData[j].Iselection) {
            IsValidForm = true;
            packageId = formListData[j].PackageId;
            if (formListData[j].IsAutoRenewal) {
              IsAutoRenewal = 1;
            }
            else {
              IsAutoRenewal = 0
            }

            EffectiveDate = formListData[j].EffectiveDate;
            EndDate = formListData[j].EndDate;

            this.subscription.ActivationCode = 'A001';
            this.subscription.PackageId = packageId
            this.subscription.CreateDateTimeBrowser = new Date();
            this.subscription.PromotionId = PromotionId;
            this.subscription.IsActive = true;
            this.subscription.SubscriptionStatus = true;
            this.subscription.ClientId = this.currentUser.ClientId;
            this.subscription.StartDate = new Date(EffectiveDate);
            this.subscription.EndDate = new Date(EndDate);
            this.subscription.DeviceId = 1;
            this.subscription.UserId = this.currentUser.UserId;
            this.subscription.CreatedBy = this.currentUser.LoginId;
            this.subscription.UpdatedBy = this.currentUser.LoginId;
            this.subscription.UpdateDateTimeBrowser = new Date();
            this.subscription.IsAutoRenew = IsAutoRenewal;

            arrayFormData.push(this.subscription);
          }
        }
      }

    }

    if (IsValidForm) {
      this.isLoading = true;
      this.subscriptionPromotionService.SaveSubscription(arrayFormData).subscribe(res => {
        if (res.Message == "Success") {
         
          this.initailSelectedPlan();
          this.GetClientUsedPromotionList();
          this.Alert();
          //this.isLoading = false;
          //this.formAppendData.controls.formList = null;
          //this.formAppendData = null;
          //this.formList.reset();
          //this.toastr.success("Subscription successfully saved")
          //window.location.reload();

          
        }
        else {
          this.isLoading = false;
          this.toastr.success("Error");
        }
      });
    }
    else {
      this.toastr.warning("Select at least one row");
    }

   
  }

  // chnages Discount Code
  OnPromotionChange(event) {

    this.IsCouponSelection = false;
    //this.IsCouponApplied = false;
    //console.log(event)
    if (event.target.value > 0) {
      this.endPromotionate = new Date(event.target.value);
      this.endPromotionate.setFullYear(this.endPromotionate.getFullYear() + 1);
      //this.IsCouponApplied = true;
      this.promoteId = event.target.value;
    }
    else {
      //this.IsCouponApplied = false;
      this.promoteId = 0;
      this.IsCouponSelection = false;
    }
    this.couponDescription = event.target.options[event.target.options.selectedIndex].text;
    //console.log(this.couponDescription)
   
    //console.log(this.formAppendData.value)
        

  }

}

