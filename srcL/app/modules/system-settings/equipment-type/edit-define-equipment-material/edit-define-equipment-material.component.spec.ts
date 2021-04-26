import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditDefineEquipmentMaterialComponent } from './edit-define-equipment-material.component';

describe('EditDefineEquipmentMaterialComponent', () => {
  let component: EditDefineEquipmentMaterialComponent;
  let fixture: ComponentFixture<EditDefineEquipmentMaterialComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditDefineEquipmentMaterialComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditDefineEquipmentMaterialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
