import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GeneralPhysicalExaminationComponent } from './general-physical-examination.component';

describe('GeneralPhysicalExaminationComponent', () => {
  let component: GeneralPhysicalExaminationComponent;
  let fixture: ComponentFixture<GeneralPhysicalExaminationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GeneralPhysicalExaminationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GeneralPhysicalExaminationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
