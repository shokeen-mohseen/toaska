import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CurrentInventoryListComponent } from './current-inventory-list.component';

describe('CurrentInventoryListComponent', () => {
  let component: CurrentInventoryListComponent;
  let fixture: ComponentFixture<CurrentInventoryListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CurrentInventoryListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CurrentInventoryListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
