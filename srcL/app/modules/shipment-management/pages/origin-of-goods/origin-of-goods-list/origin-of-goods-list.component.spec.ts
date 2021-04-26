import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OriginOfGoodsListComponent } from './origin-of-goods-list.component';

describe('OriginOfGoodsListComponent', () => {
  let component: OriginOfGoodsListComponent;
  let fixture: ComponentFixture<OriginOfGoodsListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OriginOfGoodsListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OriginOfGoodsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
