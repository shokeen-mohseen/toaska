import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditEquipmentclassComponent } from './add-edit-equipmentclass.component';

describe('AddEditEquipmentclassComponent', () => {
  let component: AddEditEquipmentclassComponent;
  let fixture: ComponentFixture<AddEditEquipmentclassComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddEditEquipmentclassComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddEditEquipmentclassComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
