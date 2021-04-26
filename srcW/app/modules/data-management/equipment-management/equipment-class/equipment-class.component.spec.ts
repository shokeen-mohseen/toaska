import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EquipmentClassComponent } from './equipment-class.component';

describe('EquipmentClassComponent', () => {
  let component: EquipmentClassComponent;
  let fixture: ComponentFixture<EquipmentClassComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EquipmentClassComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EquipmentClassComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
