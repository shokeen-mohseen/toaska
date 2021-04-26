import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FpsWorkbenchInitialComponent } from './fps-workbench-initial.component';

describe('FpsWorkbenchInitialComponent', () => {
  let component: FpsWorkbenchInitialComponent;
  let fixture: ComponentFixture<FpsWorkbenchInitialComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FpsWorkbenchInitialComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FpsWorkbenchInitialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
