import { Component, OnInit, AfterViewInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

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

import { ValidationService } from './validation.service';

@Component({
  selector: 'app-share-screen',
  templateUrl: './share-screen.component.html',
  styleUrls: ['./share-screen.component.css']
})
export class ShareScreenComponent implements OnInit, AfterViewInit {

  values: Array<any> = [];
  allValues: Array<any> = ['post@dgs.no', 'lrodal@maritech.no', 'test@best.no', 'test@dgs.no', 'user@domain.com', 'post@host.net'];

  public exampleData: Array<Select2OptionData>;
  public options: Options; files: File[];
  emailbody: FormGroup; buttonname: string;
  private so: SpinnerObject = new SpinnerObject();
  capturedImage;
  drawImage: any;

  public saveBtn(file) {

    var reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend =  () => {
      this.drawImage = reader.result;
      this.toastr.success("Edited Image Saved");
    }
  }

  addCustomUser = term => ({ id: term, name: term });

  constructor(private auth: AuthService, private toastr: ToastrService, private userService: UserService,
    private formBuilder: FormBuilder, public activeModal: NgbActiveModal, private loaderService: LoaderService,
    public _validation: ValidationService
  ) {
    this.getScreenShot();
    this.LoginId = this.auth.currentUserValue.LoginId;
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
  
  ngOnInit(): void {
    this.buttonname = "Share";
    bsCustomFileInput.init();

    this.emailbody = this.formBuilder.group({
      attachment: [''],
      screenShot: [''],
      emailto: ['', Validators.required],
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
       this.setEmailData(result.data)
      }
    });
  }
  

  EmailData: any;
  EmailDataBcc: any;
  setEmailData(data: any) {
    this.EmailData = [];
    if (!!data)
      this.EmailData = data.map(item => {
        return {
          id: item.email,
          name: item.email
        };
      });
    //this.EmailData.sort((x, y) => x.text.localeCompare(y.text));
  }

  
  addCustomEmail = term => ({ id: term, name: term });
  addCustomEmailBcc = term => ({ id: term, name: term });

  onSubmit() {    
    var dataURL = this.drawImage;
    //var dataURL = this.capturedImage;
      this.emailbody.get('screenShot').setValue(dataURL);
      
    var emailtoList = "";
    var emailccList = "";
    this.emailbody.get('emailto').value.forEach(row => {
      if (emailtoList == "") {
        emailtoList = row;
      }
      else
        emailtoList = emailtoList+', ' + row;
    });
    if (this.emailbody.get('emailcc').value != "") {
      this.emailbody.get('emailcc').value.forEach(row => {
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
