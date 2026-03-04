import { TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { ThemeService } from '@clarium/ngce-components';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';

describe('AppComponent', () => {
  let themeService: jasmine.SpyObj<ThemeService>;
  beforeEach(async () => {
    themeService = jasmine.createSpyObj<ThemeService>('ThemeService', [
      'applyTheme',
      'setTypography',
      'init',
    ]);
    await TestBed.configureTestingModule({
      imports: [AppComponent, CommonModule, RouterOutlet],
      providers: [{ provide: ThemeService, useValue: themeService }],
    }).compileComponents();
  });

  it('should create the app and call themeService methods in constructor', () => {
    const fixture = TestBed.createComponent(AppComponent);

    const app = fixture.componentInstance;
    expect(app).toBeTruthy();

    expect(themeService.applyTheme).toHaveBeenCalledWith('black-theme');
    expect(themeService.setTypography).toHaveBeenCalledWith({
      'font-family': "'Arial',sans-serif",
    });
  });
});
