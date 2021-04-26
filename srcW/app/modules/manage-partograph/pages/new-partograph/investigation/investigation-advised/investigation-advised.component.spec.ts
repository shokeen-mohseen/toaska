import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InvestigationAdvisedComponent } from './investigation-advised.component';

describe('InvestigationAdvisedComponent', () => {
  let component: InvestigationAdvisedComponent;
  let fixture: ComponentFixture<InvestigationAdvisedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InvestigationAdvisedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InvestigationAdvisedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
