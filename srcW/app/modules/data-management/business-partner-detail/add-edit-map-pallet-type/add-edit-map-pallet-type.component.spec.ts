import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditMapPalletTypeComponent } from './add-edit-map-pallet-type.component';

describe('AddEditMapPalletTypeComponent', () => {
  let component: AddEditMapPalletTypeComponent;
  let fixture: ComponentFixture<AddEditMapPalletTypeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddEditMapPalletTypeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddEditMapPalletTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
