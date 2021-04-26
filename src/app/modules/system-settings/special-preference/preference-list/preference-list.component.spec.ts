import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PreferenceListComponent } from './preference-list.component';

describe('PreferenceListComponent', () => {
  let component: PreferenceListComponent;
  let fixture: ComponentFixture<PreferenceListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PreferenceListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PreferenceListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
