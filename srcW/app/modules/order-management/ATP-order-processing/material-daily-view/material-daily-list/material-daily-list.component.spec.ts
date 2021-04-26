import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MaterialDailyListComponent } from './material-daily-list.component';

describe('MaterialDailyListComponent', () => {
  let component: MaterialDailyListComponent;
  let fixture: ComponentFixture<MaterialDailyListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MaterialDailyListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MaterialDailyListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
