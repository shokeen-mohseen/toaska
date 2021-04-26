import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MultipleClientComponent } from './multiple-client.component';

describe('MultipleClientComponent', () => {
  let component: MultipleClientComponent;
  let fixture: ComponentFixture<MultipleClientComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MultipleClientComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MultipleClientComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
