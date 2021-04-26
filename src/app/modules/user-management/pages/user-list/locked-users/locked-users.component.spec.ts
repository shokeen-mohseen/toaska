import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LockedUsersComponent } from './locked-users.component';

describe('LockedUsersComponent', () => {
  let component: LockedUsersComponent;
  let fixture: ComponentFixture<LockedUsersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LockedUsersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LockedUsersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
