import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DelSignComponent } from './del-sign.component';

describe('DelSignComponent', () => {
  let component: DelSignComponent;
  let fixture: ComponentFixture<DelSignComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DelSignComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DelSignComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
