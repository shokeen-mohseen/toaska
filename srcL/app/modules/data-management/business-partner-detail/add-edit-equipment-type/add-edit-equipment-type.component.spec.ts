import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditEquipmentTypeComponent } from './add-edit-equipment-type.component';

describe('AddEditEquipmentTypeComponent', () => {
  let component: AddEditEquipmentTypeComponent;
  let fixture: ComponentFixture<AddEditEquipmentTypeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddEditEquipmentTypeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddEditEquipmentTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
