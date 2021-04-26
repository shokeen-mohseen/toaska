import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddMarcoIndicatorComponent } from './add-marco-indicator.component';

describe('AddMarcoIndicatorComponent', () => {
  let component: AddMarcoIndicatorComponent;
  let fixture: ComponentFixture<AddMarcoIndicatorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddMarcoIndicatorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddMarcoIndicatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
