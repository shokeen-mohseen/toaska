import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MaterialGroupDetailComponent } from './material-group-detail.component';

describe('MaterialGroupDetailComponent', () => {
  let component: MaterialGroupDetailComponent;
  let fixture: ComponentFixture<MaterialGroupDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MaterialGroupDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MaterialGroupDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
