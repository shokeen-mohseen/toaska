import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditBillofmaterialComponent } from './add-edit-billofmaterial.component';

describe('AddEditBillofmaterialComponent', () => {
  let component: AddEditBillofmaterialComponent;
  let fixture: ComponentFixture<AddEditBillofmaterialComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddEditBillofmaterialComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddEditBillofmaterialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
