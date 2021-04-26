import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { SpinnerObject } from '../../../core/models/SpinnerObject.model';

@Injectable({
  providedIn: 'root'
})

export class LoaderService {
  result: any;
  public mainSource: string;

  public isLoading: BehaviorSubject<SpinnerObject> = new BehaviorSubject<SpinnerObject>(null);
    //= new BehaviorSubject(this.result);
  //public source = new BehaviorSubject("");

  constructor() { }
}



