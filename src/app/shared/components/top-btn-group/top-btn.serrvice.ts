import { Injectable, EventEmitter } from "@angular/core";
import { ActionType } from "../../../core/models/action-group";
import { Observable, Subject } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class TopButtonBarService {
  private action$: Subject<ActionType> = new Subject();

  action(action: ActionType) {
    this.action$.next(action);
  }

  getAction(): Observable<ActionType> {
    return this.action$.asObservable();
  }
}
