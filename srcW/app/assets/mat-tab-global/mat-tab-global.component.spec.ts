import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MatTabGlobalComponent } from './mat-tab-global.component';

describe('MatTabGlobalComponent', () => {
  let component: MatTabGlobalComponent;
  let fixture: ComponentFixture<MatTabGlobalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MatTabGlobalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MatTabGlobalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
