import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SecondStageLabourComponent } from './second-stage-labour.component';

describe('SecondStageLabourComponent', () => {
  let component: SecondStageLabourComponent;
  let fixture: ComponentFixture<SecondStageLabourComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SecondStageLabourComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SecondStageLabourComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
