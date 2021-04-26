import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AptProcessingFilterComponent } from './apt-processing-filter.component';

describe('AptProcessingFilterComponent', () => {
  let component: AptProcessingFilterComponent;
  let fixture: ComponentFixture<AptProcessingFilterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AptProcessingFilterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AptProcessingFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
