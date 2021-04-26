import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditBusinessPartnerComponent } from './edit-business-partner.component';

describe('EditBusinessPartnerComponent', () => {
  let component: EditBusinessPartnerComponent;
  let fixture: ComponentFixture<EditBusinessPartnerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditBusinessPartnerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditBusinessPartnerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
