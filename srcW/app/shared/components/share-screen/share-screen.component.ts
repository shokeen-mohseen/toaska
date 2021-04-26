import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { Select2OptionData } from 'ng-select2';
import { Options } from 'select2';
import bsCustomFileInput from 'bs-custom-file-input';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import html2canvas from 'html2canvas';
import { HttpClient } from '@angular/common/http';
import { UserService } from '../../../core/services/user.service';
import { ToastService } from '../../../core/services/alert.service';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../../core';

@Component({
  selector: 'app-share-screen',
  templateUrl: './share-screen.component.html',
  styleUrls: ['./share-screen.component.css']
})
export class ShareScreenComponent implements OnInit {

  public exampleData: Array<Select2OptionData>;
  public options: Options; files: File[];
  emailbody: FormGroup; buttonname: string;

  constructor(private auth: AuthService, private toastr: ToastrService, private userService: UserService,
    private formBuilder: FormBuilder, public activeModal: NgbActiveModal
  ) { }

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

    this.exampleData = [
      {
        id: 'devendra.sharma@osoftec.com',
        text: 'devendra.sharma@osoftec.com'
      },
      {
        id: 'lampsdemo@adectec.com',
        text: 'lampsdemo@adectec.com'
      },
      
    ];

    this.options = {
      multiple: true,
      closeOnSelect: false,
      tags: true
    };
  }

  onFileSelect(event) {
    debugger;
    if (event.target.files.length > 0) {
      this.files = event.target.files;
            
    }
  }

  getBase64(file) {
    var reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = function () {
      console.log(reader.result);
    };
    reader.onerror = function (error) {
      console.log('Error: ', error);
    };
  }

  onSubmit() {
    debugger;   
    
    this.buttonname = '';
    html2canvas(document.body).then(canvas => {
      var dataURL = canvas.toDataURL('image/png').replace(/^data:image\/(png|jpg);base64,/, '');
      this.emailbody.get('screenShot').setValue(dataURL);
      let formData = new FormData();
      formData.append('emailto', this.emailbody.get('emailto').value);
      formData.append('emailcc', this.emailbody.get('emailcc').value);
      formData.append('description', this.emailbody.get('description').value);
      formData.append('attachment', this.files[0]);
      formData.append('screenShot', this.emailbody.get('screenShot').value);
      formData.append('clientId', this.auth.currentUserValue.ClientId.toString());

      this.userService.SaveAlertTemplates(formData).subscribe(data => {

        this.toastr.success("Email send successfully");
        this.activeModal.close();

      })
       
     
      console.log(formData)

     
    })
    }

    //console.log(formData)
    //this.httpClient.post<any>(this.SERVER_URL, formData).subscribe(
    //  (res) => console.log(res),
    //  (err) => console.log(err)
    //);
  //}
}
