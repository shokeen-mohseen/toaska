import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddBillmaterialListComponent } from './add-billmaterial-list.component';

describe('AddBillmaterialListComponent', () => {
  let component: AddBillmaterialListComponent;
  let fixture: ComponentFixture<AddBillmaterialListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddBillmaterialListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddBillmaterialListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
