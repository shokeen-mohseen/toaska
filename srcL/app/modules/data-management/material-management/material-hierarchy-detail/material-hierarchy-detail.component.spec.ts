import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MaterialHierarchyDetailComponent } from './material-hierarchy-detail.component';

describe('MaterialHierarchyDetailComponent', () => {
  let component: MaterialHierarchyDetailComponent;
  let fixture: ComponentFixture<MaterialHierarchyDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MaterialHierarchyDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MaterialHierarchyDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
