import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MaterialDailyViewComponent } from './material-daily-view.component';

describe('MaterialDailyViewComponent', () => {
  let component: MaterialDailyViewComponent;
  let fixture: ComponentFixture<MaterialDailyViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MaterialDailyViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MaterialDailyViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
