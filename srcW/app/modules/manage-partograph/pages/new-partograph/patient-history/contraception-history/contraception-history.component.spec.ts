import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContraceptionHistoryComponent } from './contraception-history.component';

describe('ContraceptionHistoryComponent', () => {
  let component: ContraceptionHistoryComponent;
  let fixture: ComponentFixture<ContraceptionHistoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContraceptionHistoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContraceptionHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
