import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DefineEquipmentMaterialComponent } from './define-equipment-material.component';

describe('DefineEquipmentMaterialComponent', () => {
  let component: DefineEquipmentMaterialComponent;
  let fixture: ComponentFixture<DefineEquipmentMaterialComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DefineEquipmentMaterialComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DefineEquipmentMaterialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
