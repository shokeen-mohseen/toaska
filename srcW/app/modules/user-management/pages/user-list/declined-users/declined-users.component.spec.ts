import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeclinedUsersComponent } from './declined-users.component';

describe('DeclinedUsersComponent', () => {
  let component: DeclinedUsersComponent;
  let fixture: ComponentFixture<DeclinedUsersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeclinedUsersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeclinedUsersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
