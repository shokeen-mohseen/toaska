import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageLocationMaterialMappingComponent } from './manage-location-material-mapping.component';

describe('ManageLocationMaterialMappingComponent', () => {
  let component: ManageLocationMaterialMappingComponent;
  let fixture: ComponentFixture<ManageLocationMaterialMappingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManageLocationMaterialMappingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageLocationMaterialMappingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
