import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import jsPDF from 'jspdf';


@Component({
  selector: 'app-angular-pdf',
  templateUrl: './angular-pdf.component.html',
  styleUrls: ['./angular-pdf.component.css']
})
export class AngularPdfComponent implements OnInit {

  @ViewChild('htmlData') htmlData: ElementRef;

  USERS = [
    {
      "id": 1,
      "name": "Leanne Graham",
      "email": "sincere@april.biz",
      "phone": "1-770-736-8031 x56442"
    },
    {
      "id": 2,
      "name": "Ervin Howell",
      "email": "shanna@melissa.tv",
      "phone": "010-692-6593 x09125"
    },
    {
      "id": 3,
      "name": "Clementine Bauch",
      "email": "nathan@yesenia.net",
      "phone": "1-463-123-4447",
    },
    {
      "id": 4,
      "name": "Patricia Lebsack",
      "email": "julianne@kory.org",
      "phone": "493-170-9623 x156"
    },
    {
      "id": 5,
      "name": "Chelsey Dietrich",
      "email": "lucio@annie.ca",
      "phone": "(254)954-1289"
    },
    {
      "id": 6,
      "name": "Mrs. Dennis",
      "email": "karley@jasper.info",
      "phone": "1-477-935-8478 x6430"
    }
  ];

  constructor() { }

  public openPDF(): void {
    const DATA = this.htmlData.nativeElement;
    const doc = new jsPDF('p', 'pt', 'a4');
    //doc.fromHTML(DATA.innerHTML, 15, 15);
    //var string = doc.output('dataurlnewwindow');
    const string = doc.output('datauristring');
    const iframe = "<iframe width='100%' height='100%' src='" +
      string + "'></iframe>"
    const x = window.open();
    x.document.open();    
    x.document.write(iframe);
    //x.document.write("<link rel=\"stylesheet\" href=\"node_modules/bootstrap/dist/css/bootstrap.min.css\" type=\"text/css\" />");
    x.document.close();
  }


  public downloadPDF(): void {
    const DATA = this.htmlData.nativeElement;
    const doc = new jsPDF('p', 'pt', 'a4');

    const handleElement = {
      '#editor': function (element, renderer) {
        return true;
      }
    };
    //doc.fromHTML(DATA.innerHTML, 15, 15, {
    //  'width': 200,
    //  'elementHandlers': handleElement
    //});

    doc.save('angular-demo.pdf');
  }

  ngOnInit(): void {
  }

}
