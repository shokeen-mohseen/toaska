import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditSpecialPrefrenceComponent } from './edit-special-prefrence.component';

describe('EditSpecialPrefrenceComponent', () => {
  let component: EditSpecialPrefrenceComponent;
  let fixture: ComponentFixture<EditSpecialPrefrenceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditSpecialPrefrenceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditSpecialPrefrenceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
