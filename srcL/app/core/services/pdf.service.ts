import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { PreferenceTypeService } from './preferencetype.service';
import jspdf from 'jspdf';
import html2canvas from 'html2canvas';
import { LoaderService } from '../../shared/components/spinner/loader.service';
import { SpinnerObject } from '../models/SpinnerObject.model';

@Injectable({
  providedIn: 'root'
})
export class PdfService extends BaseService {
  private options = { headers: new HttpHeaders().set('Content-Type', 'application/json') };
  private so: SpinnerObject = new SpinnerObject();
  constructor(private httpClient: HttpClient,
    preferenceService: PreferenceTypeService,
    private loaderService: LoaderService)
  {
    super(preferenceService)
  }

  openPDFFromHTMLElement(data: HTMLElement, reportName: string) {
    const 
      options = {
        background: "white",
        allowTaint: true,
        useCORS: false,
        height: data.clientHeight,
        width: data.clientWidth
      };
    this.so.status = true;
    this.so.source = "pdfService";
    this.loaderService.isLoading.next(this.so);
    html2canvas(data, options).then((canvas) => {
      let imgData = canvas.toDataURL('image/png');

      let imgWidth = 210,
        pageHeight = 295,
        imgHeight = canvas.height * imgWidth / canvas.width,
        heightLeft = imgHeight,
        doc = new jspdf('p', 'mm'),
        position = 0;

      doc.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        doc.addPage();
        doc.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }
      doc.save(reportName + '.pdf');
      this.so.status = false;
      this.loaderService.isLoading.next(this.so);
    });
  }

  openPDFFromString(html_string: string, reportName: string) {
    console.log("In PDF service");
    var iframe = document.createElement('iframe');
    document.body.appendChild(iframe);
    var iframedoc = iframe.contentDocument || iframe.contentWindow.document;
    iframedoc.body.innerHTML = html_string;
    html2canvas(iframedoc.body).then(canvas => {
      var imgWidth = 208;
      var imgHeight = canvas.height * imgWidth / canvas.width;
      const contentDataURL = canvas.toDataURL('image/png')
      let pdf = new jspdf('p', 'mm', 'a4');
      var position = 0;
      pdf.addImage(contentDataURL, 'PNG', 0, position, imgWidth, imgHeight)
      pdf.save(reportName + '.pdf');
    });
  }
  
}
