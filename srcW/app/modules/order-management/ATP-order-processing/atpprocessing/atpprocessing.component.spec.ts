import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ATPProcessingComponent } from './atpprocessing.component';

describe('ATPProcessingComponent', () => {
  let component: ATPProcessingComponent;
  let fixture: ComponentFixture<ATPProcessingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ATPProcessingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ATPProcessingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
