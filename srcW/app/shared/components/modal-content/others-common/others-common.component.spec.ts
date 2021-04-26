import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OthersCommonComponent } from './others-common.component';

describe('OthersCommonComponent', () => {
  let component: OthersCommonComponent;
  let fixture: ComponentFixture<OthersCommonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OthersCommonComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OthersCommonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
