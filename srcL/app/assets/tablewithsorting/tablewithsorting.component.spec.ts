import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TablewithsortingComponent } from './tablewithsorting.component';

describe('TablewithsortingComponent', () => {
  let component: TablewithsortingComponent;
  let fixture: ComponentFixture<TablewithsortingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TablewithsortingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TablewithsortingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
