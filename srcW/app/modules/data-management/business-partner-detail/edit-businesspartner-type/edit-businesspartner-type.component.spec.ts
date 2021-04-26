import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditBusinesspartnerTypeComponent } from './edit-businesspartner-type.component';

describe('EditBusinesspartnerTypeComponent', () => {
  let component: EditBusinesspartnerTypeComponent;
  let fixture: ComponentFixture<EditBusinesspartnerTypeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditBusinesspartnerTypeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditBusinesspartnerTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
