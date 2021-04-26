import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditMarcoIndicatorComponent } from './edit-marco-indicator.component';

describe('EditMarcoIndicatorComponent', () => {
  let component: EditMarcoIndicatorComponent;
  let fixture: ComponentFixture<EditMarcoIndicatorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditMarcoIndicatorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditMarcoIndicatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
