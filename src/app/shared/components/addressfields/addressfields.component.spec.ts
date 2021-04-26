import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddressfieldsComponent } from './addressfields.component';

describe('AddressfieldsComponent', () => {
  let component: AddressfieldsComponent;
  let fixture: ComponentFixture<AddressfieldsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddressfieldsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddressfieldsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
