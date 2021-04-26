import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AssociateRfidListComponent } from './associate-rfid-list.component';

describe('AssociateRfidListComponent', () => {
  let component: AssociateRfidListComponent;
  let fixture: ComponentFixture<AssociateRfidListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AssociateRfidListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssociateRfidListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
