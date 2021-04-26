import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddFuelsurchargeComponent } from './add-fuelsurcharge.component';

describe('AddFuelsurchargeComponent', () => {
  let component: AddFuelsurchargeComponent;
  let fixture: ComponentFixture<AddFuelsurchargeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddFuelsurchargeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddFuelsurchargeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
