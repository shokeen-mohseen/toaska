import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RecentcommentComponent } from './recentcomment.component';

describe('RecentcommentComponent', () => {
  let component: RecentcommentComponent;
  let fixture: ComponentFixture<RecentcommentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RecentcommentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RecentcommentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
