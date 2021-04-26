import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PrintLevelComponent } from './print-level.component';

describe('PrintLevelComponent', () => {
  let component: PrintLevelComponent;
  let fixture: ComponentFixture<PrintLevelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PrintLevelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PrintLevelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
