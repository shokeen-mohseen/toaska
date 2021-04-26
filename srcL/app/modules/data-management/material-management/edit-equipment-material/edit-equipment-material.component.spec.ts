import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditEquipmentMaterialComponent } from './edit-equipment-material.component';

describe('EditEquipmentMaterialComponent', () => {
  let component: EditEquipmentMaterialComponent;
  let fixture: ComponentFixture<EditEquipmentMaterialComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditEquipmentMaterialComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditEquipmentMaterialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
