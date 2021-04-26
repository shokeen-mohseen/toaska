import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FetalHeartAlertPopupComponent } from './fetal-heart.alert.popup.component';

describe('FetalHeart.Alert.PopupComponent', () => {
  let component: FetalHeartAlertPopupComponent;
  let fixture: ComponentFixture<FetalHeartAlertPopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FetalHeartAlertPopupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FetalHeartAlertPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
