import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditDefineCharacteristicsComponent } from './add-edit-define-characteristics.component';

describe('AddEditDefineCharacteristicsComponent', () => {
  let component: AddEditDefineCharacteristicsComponent;
  let fixture: ComponentFixture<AddEditDefineCharacteristicsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddEditDefineCharacteristicsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddEditDefineCharacteristicsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
