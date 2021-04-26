import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditFreightlanesComponent } from './add-edit-freightlanes.component';

describe('AddEditFreightlanesComponent', () => {
  let component: AddEditFreightlanesComponent;
  let fixture: ComponentFixture<AddEditFreightlanesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddEditFreightlanesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddEditFreightlanesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
