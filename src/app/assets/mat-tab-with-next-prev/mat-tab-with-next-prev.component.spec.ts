import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MatTabWithNextPrevComponent } from './mat-tab-with-next-prev.component';

describe('MatTabWithNextPrevComponent', () => {
  let component: MatTabWithNextPrevComponent;
  let fixture: ComponentFixture<MatTabWithNextPrevComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MatTabWithNextPrevComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MatTabWithNextPrevComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
