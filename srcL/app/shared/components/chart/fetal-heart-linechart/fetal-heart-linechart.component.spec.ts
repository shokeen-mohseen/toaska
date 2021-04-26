import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FetalHeartLinechartComponent } from './fetal-heart-linechart.component';

describe('FetalHeartLinechartComponent', () => {
  let component: FetalHeartLinechartComponent;
  let fixture: ComponentFixture<FetalHeartLinechartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FetalHeartLinechartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FetalHeartLinechartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
