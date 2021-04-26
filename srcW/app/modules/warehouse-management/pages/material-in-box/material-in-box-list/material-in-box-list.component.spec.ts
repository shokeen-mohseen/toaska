import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MaterialInBoxListComponent } from './material-in-box-list.component';

describe('MaterialInBoxListComponent', () => {
  let component: MaterialInBoxListComponent;
  let fixture: ComponentFixture<MaterialInBoxListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MaterialInBoxListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MaterialInBoxListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
