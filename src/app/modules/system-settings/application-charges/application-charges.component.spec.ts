import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ApplicationChargesComponent } from './application-charges.component';

describe('ApplicationChargesComponent', () => {
  let component: ApplicationChargesComponent;
  let fixture: ComponentFixture<ApplicationChargesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ApplicationChargesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ApplicationChargesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
