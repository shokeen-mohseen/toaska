import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditEquipmentComponent } from './add-edit-equipment.component';

describe('AddEditEquipmentComponent', () => {
  let component: AddEditEquipmentComponent;
  let fixture: ComponentFixture<AddEditEquipmentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddEditEquipmentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddEditEquipmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
