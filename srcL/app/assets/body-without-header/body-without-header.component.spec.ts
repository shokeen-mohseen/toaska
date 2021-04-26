import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BodyWithoutHeaderComponent } from './body-without-header.component';

describe('BodyWithoutHeaderComponent', () => {
  let component: BodyWithoutHeaderComponent;
  let fixture: ComponentFixture<BodyWithoutHeaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BodyWithoutHeaderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BodyWithoutHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
