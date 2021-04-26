import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkbenchInitialComponent } from './workbench-initial.component';

describe('WorkbenchInitialComponent', () => {
  let component: WorkbenchInitialComponent;
  let fixture: ComponentFixture<WorkbenchInitialComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WorkbenchInitialComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkbenchInitialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
