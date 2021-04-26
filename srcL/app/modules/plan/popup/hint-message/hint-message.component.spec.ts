import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HintMessageComponent } from './hint-message.component';

describe('HintMessageComponent', () => {
  let component: HintMessageComponent;
  let fixture: ComponentFixture<HintMessageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HintMessageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HintMessageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
