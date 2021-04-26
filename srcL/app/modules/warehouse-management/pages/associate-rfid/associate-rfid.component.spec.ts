import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AssociateRfidComponent } from './associate-rfid.component';

describe('AssociateRfidComponent', () => {
  let component: AssociateRfidComponent;
  let fixture: ComponentFixture<AssociateRfidComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AssociateRfidComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssociateRfidComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
