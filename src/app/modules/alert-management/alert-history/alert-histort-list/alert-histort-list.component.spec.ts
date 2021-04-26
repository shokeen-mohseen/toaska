import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AlertHistortListComponent } from './alert-histort-list.component';

describe('AlertHistortListComponent', () => {
  let component: AlertHistortListComponent;
  let fixture: ComponentFixture<AlertHistortListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AlertHistortListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AlertHistortListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
