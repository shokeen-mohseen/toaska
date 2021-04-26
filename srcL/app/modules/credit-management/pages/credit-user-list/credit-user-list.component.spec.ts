import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreditUserListComponent } from './credit-user-list.component';

describe('CreditUserListComponent', () => {
  let component: CreditUserListComponent;
  let fixture: ComponentFixture<CreditUserListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreditUserListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreditUserListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
