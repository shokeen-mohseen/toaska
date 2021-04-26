import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddeditMicroIndicatorDetailComponent } from './addedit-micro-indicator-detail.component';

describe('AddeditMicroIndicatorDetailComponent', () => {
  let component: AddeditMicroIndicatorDetailComponent;
  let fixture: ComponentFixture<AddeditMicroIndicatorDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddeditMicroIndicatorDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddeditMicroIndicatorDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
