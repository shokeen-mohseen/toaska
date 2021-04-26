import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MaterialHierarchyComponent } from './material-hierarchy.component';

describe('MaterialHierarchyComponent', () => {
  let component: MaterialHierarchyComponent;
  let fixture: ComponentFixture<MaterialHierarchyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MaterialHierarchyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MaterialHierarchyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
