import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditMapPreferredMaterialsComponent } from './add-edit-map-preferred-materials.component';

describe('AddEditMapPreferredMaterialsComponent', () => {
  let component: AddEditMapPreferredMaterialsComponent;
  let fixture: ComponentFixture<AddEditMapPreferredMaterialsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddEditMapPreferredMaterialsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddEditMapPreferredMaterialsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
