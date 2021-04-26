import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GeographicinfoComponent } from './geographicinfo.component';

describe('GeographicinfoComponent', () => {
  let component: GeographicinfoComponent;
  let fixture: ComponentFixture<GeographicinfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GeographicinfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GeographicinfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
