import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditMapEquipmentTypeComponent } from './edit-map-equipment-type.component';

describe('EditMapEquipmentTypeComponent', () => {
  let component: EditMapEquipmentTypeComponent;
  let fixture: ComponentFixture<EditMapEquipmentTypeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditMapEquipmentTypeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditMapEquipmentTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
