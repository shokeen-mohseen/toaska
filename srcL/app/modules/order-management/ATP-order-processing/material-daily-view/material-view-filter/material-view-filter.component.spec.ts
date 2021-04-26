import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MaterialViewFilterComponent } from './material-view-filter.component';

describe('MaterialViewFilterComponent', () => {
  let component: MaterialViewFilterComponent;
  let fixture: ComponentFixture<MaterialViewFilterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MaterialViewFilterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MaterialViewFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
