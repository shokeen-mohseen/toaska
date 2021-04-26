import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateTblPopupComponent } from './update-tbl-popup.component';

describe('UpdateTblPopupComponent', () => {
  let component: UpdateTblPopupComponent;
  let fixture: ComponentFixture<UpdateTblPopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UpdateTblPopupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateTblPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
