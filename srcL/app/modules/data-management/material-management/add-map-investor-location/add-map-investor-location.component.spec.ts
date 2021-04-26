import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddMapInvestorLocationComponent } from './add-map-investor-location.component';

describe('AddMapInvestorLocationComponent', () => {
  let component: AddMapInvestorLocationComponent;
  let fixture: ComponentFixture<AddMapInvestorLocationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddMapInvestorLocationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddMapInvestorLocationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
