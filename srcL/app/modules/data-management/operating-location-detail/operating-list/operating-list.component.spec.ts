import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OperatingListComponent } from './operating-list.component';

describe('OperatingListComponent', () => {
  let component: OperatingListComponent;
  let fixture: ComponentFixture<OperatingListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OperatingListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OperatingListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
