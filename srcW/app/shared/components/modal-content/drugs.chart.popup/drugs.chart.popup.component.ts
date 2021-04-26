// TFSID 16563 Latent Phase: Drugs Given and IV Fluids grid: Merge grid in Lamps 3.0
import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { NgbActiveModal, NgbCarousel, NgbSlideEvent, NgbSlideEventSource, NgbCarouselConfig} from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { AuthService } from '@app/core';

//Task 16912: Partograph - Remove jquery code. done by satyen singh 21/07/2020

@Component({
  selector: 'app-drugs.chart.popup',
  templateUrl: './drugs.chart.popup.component.html',
  styleUrls: ['./drugs.chart.popup.component.css']
})
export class DrugsChartPopupComponent implements OnInit {
  @Input() public modalData;
  @Output() passEntry: EventEmitter<any> = new EventEmitter();
  public drugForm: FormGroup;
  numberOfdrugSpecifications: number;
  slidercounter = 0;
  showNavigationArrows = false;
  showNavigationIndicators = true;
  slideCounter = 1;
  IsNextDisplay: boolean = true;
  IsPreviousDisplay: boolean = false;
  IsButtonDisplay: boolean = true;
   // TFSID 16643 , Rizwan khan, 30 July 2020, Implement save and edit on Drugs POPUP and make it form Reactive
  
  @ViewChild('ngcarousel', { static: false }) ngCarousel: NgbCarousel;
  userName: string;
  constructor(private authenticationService: AuthService, config: NgbCarouselConfig, private formBuilder: FormBuilder, public activeModal: NgbActiveModal) {
    this.slidercounter = 0;
    const currentUser = this.authenticationService.currentUserValue;
    this.userName = currentUser.username;
    config.wrap = false;
    config.interval = 0;
   
  }

  ngOnInit(): void {
   
    this.drugForm = this.formBuilder.group({
      remarks: [this.modalData.remarks],
      drugSpecifications: new FormArray([])
    });

    if (this.modalData.ListArray != null) {
      this.numberOfdrugSpecifications = this.modalData.ListArray.length;

    }
    else {
      this.numberOfdrugSpecifications = 1;
    }
    this.initDrugSpecFirst();

    if (this.modalData.IsDisable) {
      this.IsButtonDisplay = false;
    }
  }

  get f() { return this.drugForm.controls; }
  get t() { return this.f.drugSpecifications as FormArray; }
  

  // TFSID 16643 , Rizwan Khan, 31 July 2020, Appied Previous and Next validation and add logic for checking hide and show respective button
  
  initDrugSpecFirst() {
    if (this.modalData.ListArray == null) {
      this.IsNextDisplay = false;

      for (let i = 0; i < 1; i++) {
        this.t.push(
          this.formBuilder.group({
            Drugs: ['', Validators.required],
            Dose: ['', [Validators.maxLength(100)]],
            Route: ['', [Validators.maxLength(100)]],
            Frequency: ['', [Validators.maxLength(100)]],
            Days: ['', [Validators.maxLength(100)]],
            Instructions: ['', [Validators.maxLength(200)]],
            Drugs1: ['', [Validators.maxLength(100)]],
            Dose1: ['', [Validators.maxLength(100)]],
            Route1: ['', [Validators.maxLength(100)]],
            Frequency1: ['', [Validators.maxLength(100)]],
            Days1: ['', [Validators.maxLength(100)]],
            Instructions1: ['', [Validators.maxLength(200)]]
            }))
      }
      //console.log(this.drugForm.controls)
      console.log(this.t)
      //this.t.push(
      //  this.formBuilder.group({
      //    Drugs: ['', Validators.required],
      //    Dose: [''],
      //    Route: [''],
      //    Frequency: [''],
      //    Days: [''],
      //    Instructions: [''],
      //    //Drugs1: ['', Validators.required],
      //    //Dose1: [''],
      //    //Route1: [''],
      //    //Frequency1: [''],
      //    //Days1: [''],
      //    //Instructions1: ['']
      //  }));

     

    }
    else {
     
      for (let i = 0; i < this.numberOfdrugSpecifications; i++) {
        this.t.push(
          this.formBuilder.group({
            Drugs: [{ value: this.modalData.ListArray[i].Drugs, disabled: this.modalData.IsDisable }, [Validators.required, Validators.maxLength(100)]],
            Dose: [{ value: this.modalData.ListArray[i].Dose, disabled: this.modalData.IsDisable }, Validators.maxLength(100)],
            Route: [{ value: this.modalData.ListArray[i].Route, disabled: this.modalData.IsDisable }, Validators.maxLength(100)],
            Frequency: [{ value: this.modalData.ListArray[i].Frequency, disabled: this.modalData.IsDisable }, Validators.maxLength(100)],
            Days: [{ value: this.modalData.ListArray[i].Days, disabled: this.modalData.IsDisable }, Validators.maxLength(100)],
            Instructions: [{ value: this.modalData.ListArray[i].Instructions, disabled: this.modalData.IsDisable }, Validators.maxLength(200)],
            Drugs1: [{ value: this.modalData.ListArray[i].Drugs1, disabled: this.modalData.IsDisable }, Validators.maxLength(100)],
            Dose1: [{ value: this.modalData.ListArray[i].Dose1, disabled: this.modalData.IsDisable }, Validators.maxLength(100)],
            Route1: [{ value: this.modalData.ListArray[i].Route1, disabled: this.modalData.IsDisable }, Validators.maxLength(100)],
            Frequency1: [{ value: this.modalData.ListArray[i].Frequency1, disabled: this.modalData.IsDisable }, Validators.maxLength(100)],
            Days1: [{ value: this.modalData.ListArray[i].Days1, disabled: this.modalData.IsDisable }, Validators.maxLength(100)],
            Instructions1: [{ value: this.modalData.ListArray[i].Instructions1, disabled: this.modalData.IsDisable }, Validators.maxLength(200)]
          }));



      }
    }
     
  }

  onSubmit() {
    if (this.drugForm.invalid) {
      return;
    }

    console.log(this.drugForm.value)

    //let dSpecification: any = []; let FinalSpecification: any = [];

    //let arraySpecification: any = [];

    //dSpecification = this.drugForm.value.drugSpecifications

    //for (let i = 0; i < dSpecification.length; i++) {

    //  if (dSpecification[i].Drugs != "") {

    //    arraySpecification.push({
    //      Days: dSpecification[i].Days,
    //      Drugs: dSpecification[i].Drugs,
    //      Dose: dSpecification[i].Dose,
    //      Frequency: dSpecification[i].Frequency,
    //      Instructions: dSpecification[i].Instructions,
    //      Route: dSpecification[i].Route,
    //    });

    //  }
      
       
    //    if (dSpecification[i].Drugs1 != "") {
    //    arraySpecification.push({
    //      Days: dSpecification[i].Days1,
    //      Drugs: dSpecification[i].Drugs1,
    //      Dose: dSpecification[i].Dose1,
    //      Frequency: dSpecification[i].Frequency1,
    //      Instructions: dSpecification[i].Instructions1,
    //      Route: dSpecification[i].Route1,
    //    });


    //  }

    //}

    //FinalSpecification.push({
    //  remarks: this.drugForm.value.remarks,
    //  drugSpecifications: arraySpecification
    //})
     
    console.log(this.drugForm.value);
    this.passEntry.emit(this.drugForm.value);
    this.activeModal.close(this.drugForm.value);



  }
      
  // Move to previous slide
  getToPrev() {

    if (this.ngCarousel.activeId == "2") {
      this.IsPreviousDisplay = false;
    }

    if (this.slideCounter == 1) {
      this.IsPreviousDisplay = false;
    }
     //console.log(this.slideCounter)
    if (this.slideCounter > 0) {
      this.slideCounter--;
      this.IsNextDisplay = true;
    }
    else {
      this.IsPreviousDisplay = false;
    }
    this.ngCarousel.prev();
  }

  // Move to next slide
  goToNext() {
    console.log("11111");
    this.ngCarousel.next();
    let arrayList: any;
    arrayList= this.f.drugSpecifications.value
       
    let stempId = this.ngCarousel.activeId
    if (this.slideCounter < parseInt(stempId)) {
      if (this.slideCounter < arrayList.length) {
        ++this.slideCounter;
        this.IsPreviousDisplay = true;
      }
    }
    //console.log(this.slideCounter +"=="+ arrayList.length)
    if (this.slideCounter == arrayList.length) {
      //console.log(this.drugForm.valid)
      // TFSID 17009, Rizwan khan, 8 Aug 2020, Applied the required condition
      if (this.drugForm.valid) {
        console.log("validate")
        this.t.push(
          this.formBuilder.group({
            Drugs: ['', [Validators.required, Validators.maxLength(100)]],
            Dose: ['', [Validators.maxLength(100)]],
            Route: ['', [Validators.maxLength(100)]],
            Frequency: ['', [Validators.maxLength(100)]],
            Days: ['', [Validators.maxLength(100)]],
            Instructions: ['', [Validators.maxLength(200)]],
            Drugs1: ['', [Validators.maxLength(100)]],
            Dose1: ['', [Validators.maxLength(100)]],
            Route1: ['', [Validators.maxLength(100)]],
            Frequency1: ['', [Validators.maxLength(100)]],
            Days1: ['', [Validators.maxLength(100)]],
            Instructions1: ['', [Validators.maxLength(200)]]
          }));
        this.f.drugSpecifications = this.t;
        this.IsNextDisplay = true;
        this.goToNext();
        this.ngCarousel.next();
        this.f.drugSpecifications = this.t;
      }
      else {
        this.IsNextDisplay = false;
        this.IsPreviousDisplay = true;
      }
          
      }

    

   
  }

  checkfill(event) {
    //console.log(this.drugForm.valid)
    if (event.target.value!="") {
      this.IsNextDisplay = true;

    }
    else {
      this.IsNextDisplay = false;
    }
  }

  checkfill1(event) {
    console.log(this.drugForm.valid)
    if (this.drugForm.valid) {
      this.IsNextDisplay = true;

    }
    else {
      this.IsNextDisplay = false;
    }
  }
 

}
