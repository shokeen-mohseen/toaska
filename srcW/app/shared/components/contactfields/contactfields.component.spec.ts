import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactfieldsComponent } from './contactfields.component';

describe('ContactfieldsComponent', () => {
  let component: ContactfieldsComponent;
  let fixture: ComponentFixture<ContactfieldsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContactfieldsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContactfieldsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
