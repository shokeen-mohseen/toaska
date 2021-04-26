import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShiptoContactDetailpopupComponent } from './shipto-contact-detailpopup.component';

describe('ShiptoContactDetailpopupComponent', () => {
  let component: ShiptoContactDetailpopupComponent;
  let fixture: ComponentFixture<ShiptoContactDetailpopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShiptoContactDetailpopupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShiptoContactDetailpopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
