import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClaimFilterComponent } from './claim-filter.component';

describe('ClaimFilterComponent', () => {
  let component: ClaimFilterComponent;
  let fixture: ComponentFixture<ClaimFilterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClaimFilterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClaimFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
