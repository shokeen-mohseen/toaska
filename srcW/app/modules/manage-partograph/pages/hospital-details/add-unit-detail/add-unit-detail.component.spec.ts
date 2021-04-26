import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddUnitDetailComponent } from './add-unit-detail.component';

describe('AddUnitDetailComponent', () => {
  let component: AddUnitDetailComponent;
  let fixture: ComponentFixture<AddUnitDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddUnitDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddUnitDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
