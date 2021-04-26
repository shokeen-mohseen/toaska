import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OriginOfGoodsComponent } from './origin-of-goods.component';

describe('OriginOfGoodsComponent', () => {
  let component: OriginOfGoodsComponent;
  let fixture: ComponentFixture<OriginOfGoodsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OriginOfGoodsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OriginOfGoodsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
