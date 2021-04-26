import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddMicroIndicatorComponent } from './add-micro-indicator.component';

describe('AddMicroIndicatorComponent', () => {
  let component: AddMicroIndicatorComponent;
  let fixture: ComponentFixture<AddMicroIndicatorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddMicroIndicatorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddMicroIndicatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
