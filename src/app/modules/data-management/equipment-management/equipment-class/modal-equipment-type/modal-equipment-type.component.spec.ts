import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalEquipmentTypeComponent } from './modal-equipment-type.component';

describe('ModalEquipmentTypeComponent', () => {
  let component: ModalEquipmentTypeComponent;
  let fixture: ComponentFixture<ModalEquipmentTypeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalEquipmentTypeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalEquipmentTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
