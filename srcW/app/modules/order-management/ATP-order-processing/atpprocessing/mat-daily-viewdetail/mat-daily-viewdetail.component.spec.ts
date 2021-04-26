import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MatDailyViewdetailComponent } from './mat-daily-viewdetail.component';

describe('MatDailyViewdetailComponent', () => {
  let component: MatDailyViewdetailComponent;
  let fixture: ComponentFixture<MatDailyViewdetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MatDailyViewdetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MatDailyViewdetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
