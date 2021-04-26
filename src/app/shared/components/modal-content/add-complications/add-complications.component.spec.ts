import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddComplicationsComponent } from './add-complications.component';

describe('AddComplicationsComponent', () => {
  let component: AddComplicationsComponent;
  let fixture: ComponentFixture<AddComplicationsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddComplicationsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddComplicationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
