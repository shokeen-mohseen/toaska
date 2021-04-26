import { Component, OnInit, AfterViewInit } from '@angular/core';
import { NgbActiveModal, NgbModalRef, NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { Select2OptionData } from 'ng-select2';
import { Options } from 'select2';
import { NgSelectModule, NgOption } from "@ng-select/ng-select";
import bsCustomFileInput from 'bs-custom-file-input';
import { FormGroup, FormBuilder, Validators  } from '@angular/forms';
import html2canvas from 'html2canvas';
import { HttpClient } from '@angular/common/http';
import { UserService } from '../../../core/services/user.service';
import { ToastService } from '../../../core/services/alert.service';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../../core';
import { LoaderService } from '../spinner/loader.service';
import { SpinnerObject } from '../../../core/models/SpinnerObject.model';
import * as $ from "jquery";
import { ValidationService } from './validation.service';
import { confirmationpopup } from '../confirmation-popup/confirmation-popup.component';

@Component({
  selector: 'app-share-screen',
  templateUrl: './share-screen.component.html',
  styleUrls: ['./share-screen.component.css']
})
export class ShareScreenComponent implements OnInit, AfterViewInit {

  emailValues: Array<any> = [];
  bccValues: Array<any> = [];
  //allValues: Array<any> = ['post@dgs.no', 'lrodal@maritech.no', 'test@best.no', 'test@dgs.no', 'user@domain.com', 'post@host.net'];
  modalRef: NgbModalRef;
  public exampleData: Array<Select2OptionData>;
  public options: Options; files: File[];
  emailbody: FormGroup; buttonname: string;
  private so: SpinnerObject = new SpinnerObject();
  capturedImage;
  drawImage: any;
  emailRequired: boolean = false;
  imgSaved: boolean = false;
  
  saveBtn(file) {
    alert("Edited Image Saved");
    var reader = new FileReader();    
    reader.readAsDataURL(file);    
    reader.onloadend =  () => {
      this.drawImage = reader.result;
    }
  }
  
  async loaderStart(source: string) {
    this.so.status = true;
    this.so.source = source;
    this.loaderService.mainSource = this.so.source;
    this.loaderService.isLoading.next(this.so);
  }
  addCustomUser = term => ({ id: term, name: term });

  constructor(private auth: AuthService, private toastr: ToastrService, private userService: UserService,
    private formBuilder: FormBuilder, public activeModal: NgbActiveModal, private loaderService: LoaderService,
    private modelservice: NgbModal,
    public _validation: ValidationService
  ) {
    this.getScreenShot();
    this.LoginId = this.auth.currentUserValue.LoginId;
    this.bccValues.push(this.LoginId);
}
    ngAfterViewInit(): void {
      this.getUserList();
    }
  LoginId: any
  getScreenShot() {
    html2canvas(document.querySelector("#takeScreenShot"), {
      scrollX: 0,
      scrollY: 0,
      allowTaint: true,
      useCORS: true,
      logging: false,
      height: document.body.scrollHeight,
      windowHeight: document.body.scrollHeight
    }).then(canvas => {
    this.so.status = false;
    this.so.source = "share"      
    this.capturedImage = canvas.toDataURL();      
      this.loaderService.isLoading.next(this.so);
    });
}
  //$("p").click();
  ngOnInit(): void {
    this.buttonname = "Share";
    bsCustomFileInput.init();

    this.emailbody = this.formBuilder.group({
      attachment: [''],
      screenShot: [''],
      emailto: [''],
      emailcc: [''],
      description: ['']
    });

    this.EmailDataBcc = [      
        this.LoginId      
    ];

    this.options = {
      multiple: true,
      closeOnSelect: false,
      tags: true
    };
  }
  
  setExampleData(data: any) {
    this.exampleData = [];
    if (!!data)
      this.exampleData = data.map(item => {
        return {
          itemName: item.name,
          id: item.id
        };
      });
    //this.MaterialData.sort((x, y) => x.itemName.localeCompare(y.itemName));
  }

  onFileSelect(event) {
    
    if (event.target.files.length > 0) {
      this.files = event.target.files;
            
    }
  }

  getUserList() {
    this.userService.getUserEmailList().subscribe(result => {

      if (!!result) {
        //this.EmailData = result
       this.setEmailData(result.data)
      }
    });
  }
  

  EmailData: Array<any> = [];
  
  EmailDataBcc: any;
  setEmailData(data: any) {
    data.forEach(row => {
      this.EmailData.push(row.email);     
    });    
  }

  
  addCustomEmail = term => ({ id: term, name: term });
  addCustomEmailBcc = term => ({ id: term, name: term });

  onSubmit() {
    
    if (this.emailValues.length == 0) {
      this.emailRequired = true;
      return;
    }

    var dataURL = "";
    if (this.drawImage != undefined) {
      dataURL = this.drawImage;
    }
    else {
      dataURL = this.capturedImage;
    }
    
      this.emailbody.get('screenShot').setValue(dataURL);
      
    var emailtoList = "";
    var emailccList = "";
    this.emailValues.forEach(row => {
      if (emailtoList == "") {
        emailtoList = row;
      }
      else
        emailtoList = emailtoList+', ' + row;
    });
    if (this.bccValues.length != 0) {
      this.bccValues.forEach(row => {
        if (emailccList == "") {
          emailccList = row;
        }
        else
          emailccList = emailccList + ', ' + row;
      });
      if (!emailccList.includes(this.LoginId)) {        
        emailccList = emailccList + ', ' + this.LoginId;
      }
    }
    else {
      emailccList = this.LoginId;
    }

    

      var RequestObject = {
        emailto: emailtoList,
        emailcc: emailccList,
        description: this.emailbody.get('description').value,
        screenShot: this.emailbody.get('screenShot').value,
        clientId: this.auth.currentUserValue.ClientId
    };
    
      this.userService.SaveAlertTemplates(RequestObject).subscribe(data => {

        this.toastr.success("Email sent successfully.");
        this.activeModal.close();

      })
    
  }
}
