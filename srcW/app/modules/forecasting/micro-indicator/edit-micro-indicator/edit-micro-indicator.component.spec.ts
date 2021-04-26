import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditMicroIndicatorComponent } from './edit-micro-indicator.component';

describe('EditMicroIndicatorComponent', () => {
  let component: EditMicroIndicatorComponent;
  let fixture: ComponentFixture<EditMicroIndicatorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditMicroIndicatorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditMicroIndicatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
