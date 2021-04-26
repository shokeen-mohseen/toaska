import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditBusinessCharacteristicsComponent } from './add-edit-business-characteristics.component';

describe('AddEditBusinessCharacteristicsComponent', () => {
  let component: AddEditBusinessCharacteristicsComponent;
  let fixture: ComponentFixture<AddEditBusinessCharacteristicsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddEditBusinessCharacteristicsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddEditBusinessCharacteristicsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
