import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditFuelsurchargeComponent } from './edit-fuelsurcharge.component';

describe('EditFuelsurchargeComponent', () => {
  let component: EditFuelsurchargeComponent;
  let fixture: ComponentFixture<EditFuelsurchargeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditFuelsurchargeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditFuelsurchargeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
