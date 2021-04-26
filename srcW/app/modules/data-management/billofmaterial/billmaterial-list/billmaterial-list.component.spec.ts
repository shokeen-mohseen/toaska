import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BillmaterialListComponent } from './billmaterial-list.component';

describe('BillmaterialListComponent', () => {
  let component: BillmaterialListComponent;
  let fixture: ComponentFixture<BillmaterialListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BillmaterialListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BillmaterialListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
