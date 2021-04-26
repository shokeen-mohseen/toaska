import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { BPByLocation, BPByCarrier } from '../models/BusinessPartner.model';
import { BaseService } from './base.service';
import { PreferenceTypeService } from './preferencetype.service';

@Injectable({
  providedIn: 'root'
})

export class UomService extends BaseService {
  
  constructor(private http: HttpClient,
    preferenceService: PreferenceTypeService) {
    super(preferenceService);
  }

  getUomList(clientId: number) {
    var RequestObject = {
      ClientID: clientId
    };

    return this.http.post<any>(`${this.MASTER_SERVICE_URL}/Uom/List`, RequestObject)
      .pipe(map(result => {
        return result;
      }));
  }

}
