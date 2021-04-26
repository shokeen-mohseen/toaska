import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AtpTblListComponent } from './atp-tbl-list.component';

describe('AtpTblListComponent', () => {
  let component: AtpTblListComponent;
  let fixture: ComponentFixture<AtpTblListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AtpTblListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AtpTblListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
