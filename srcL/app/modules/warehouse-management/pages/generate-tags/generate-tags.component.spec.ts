import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GenerateTagsComponent } from './generate-tags.component';

describe('GenerateTagsComponent', () => {
  let component: GenerateTagsComponent;
  let fixture: ComponentFixture<GenerateTagsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GenerateTagsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GenerateTagsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
