import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EquipmentClassListComponent } from './equipment-class-list.component';

describe('EquipmentClassListComponent', () => {
  let component: EquipmentClassListComponent;
  let fixture: ComponentFixture<EquipmentClassListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EquipmentClassListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EquipmentClassListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
