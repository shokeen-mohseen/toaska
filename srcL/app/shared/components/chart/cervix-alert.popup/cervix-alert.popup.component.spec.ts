import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CervixAlertPopupComponent } from './cervix-alert.popup.component';

describe('CervixAlert.PopupComponent', () => {
  let component: CervixAlertPopupComponent;
  let fixture: ComponentFixture<CervixAlertPopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CervixAlertPopupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CervixAlertPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
