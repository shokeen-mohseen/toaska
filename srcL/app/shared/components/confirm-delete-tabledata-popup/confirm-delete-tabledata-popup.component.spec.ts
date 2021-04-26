import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmDeleteTabledataPopupComponent } from './confirm-delete-tabledata-popup.component';

describe('ConfirmDeleteTabledataPopupComponent', () => {
  let component: ConfirmDeleteTabledataPopupComponent;
  let fixture: ComponentFixture<ConfirmDeleteTabledataPopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConfirmDeleteTabledataPopupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmDeleteTabledataPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
