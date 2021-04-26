import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CharthistoryComponent } from './charthistory.component';

describe('CharthistoryComponent', () => {
  let component: CharthistoryComponent;
  let fixture: ComponentFixture<CharthistoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CharthistoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CharthistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
