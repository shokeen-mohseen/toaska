import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MaterialInBoxComponent } from './material-in-box.component';

describe('MaterialInBoxComponent', () => {
  let component: MaterialInBoxComponent;
  let fixture: ComponentFixture<MaterialInBoxComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MaterialInBoxComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MaterialInBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
