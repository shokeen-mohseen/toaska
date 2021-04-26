import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ReplaySubject, Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';
import { MatSelect } from '@angular/material/select';
import { List, LISTS } from './demo-data';

@Component({
  selector: 'app-multiselect-dropdown',
  templateUrl: './multiselect-dropdown.component.html',
  styleUrls: ['./multiselect-dropdown.component.css']
})
export class MultiselectDropdownComponent implements OnInit, AfterViewInit, OnDestroy {

  /** list of lists */
  protected lists: List[] = LISTS;

  /** control for the selected list for multi-selection */
  public listMultiCtrl: FormControl = new FormControl();

  /** control for the MatSelect filter keyword multi-selection */
  public listMultiFilterCtrl: FormControl = new FormControl();

  /** list of lists filtered by search keyword */
  public filteredListsMulti: ReplaySubject<List[]> = new ReplaySubject<List[]>(1);

  @ViewChild('multiSelect', { static: true }) multiSelect: MatSelect;

  /** Subject that emits when the component has been destroyed. */
  protected _onDestroy = new Subject<void>();


  constructor() { }

  ngOnInit() {
    // set initial selection
    //this.listMultiCtrl.setValue([this.lists[1], this.lists[3], this.lists[4]]);

    // load the initial list
    this.filteredListsMulti.next(this.lists.slice());

    // listen for search field value changes
    this.listMultiFilterCtrl.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterListsMulti();
      });
  }

  ngAfterViewInit() {
    this.setInitialValue();
  }

  ngOnDestroy() {
    this._onDestroy.next();
    this._onDestroy.complete();
  }

  toggleSelectAll(selectAllValue: boolean) {
    this.filteredListsMulti.pipe(take(1), takeUntil(this._onDestroy))
      .subscribe(val => {
        if (selectAllValue) {
          this.listMultiCtrl.patchValue(val);
        } else {
          this.listMultiCtrl.patchValue([]);
        }
      });
  }

  /**
   * Sets the initial value after the filteredLists are loaded initially
   */
  protected setInitialValue() {
    this.filteredListsMulti
      .pipe(take(1), takeUntil(this._onDestroy))
      .subscribe(() => {
        // setting the compareWith property to a comparison function
        // triggers initializing the selection according to the initial value of
        // the form control (i.e. _initializeSelection())
        // this needs to be done after the filteredLists are loaded initially
        // and after the mat-option elements are available
        this.multiSelect.compareWith = (a: List, b: List) => a && b && a.id === b.id;
      });
  }

  protected filterListsMulti() {
    if (!this.lists) {
      return;
    }
    // get the search keyword
    let search = this.listMultiFilterCtrl.value;
    if (!search) {
      this.filteredListsMulti.next(this.lists.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    // filter the lists
    this.filteredListsMulti.next(
      this.lists.filter(list => list.name.toLowerCase().indexOf(search) > -1)
    );
  }

}
