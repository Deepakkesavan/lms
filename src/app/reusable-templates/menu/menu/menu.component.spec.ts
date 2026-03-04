import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuComponent } from './menu.component';
import { CommonModule } from '@angular/common';
import { NgceComponentsModule } from '@clarium/ngce-components';

import { NgceIconModule } from '@clarium/ngce-icon';
import { ElementRef, signal } from '@angular/core';
import { buffer } from 'rxjs';

describe('MenuComponent', () => {
  let component: MenuComponent;
  let fixture: ComponentFixture<MenuComponent>;
  const mockElementRef = {
    nativeElement: {
      contains: jasmine.createSpy().and.returnValue(false), // Simulate outside click
    },
  };
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        MenuComponent,
        CommonModule,
        NgceComponentsModule,
        NgceIconModule,
      ],
      providers: [{ provide: ElementRef, useValue: mockElementRef }],
    }).compileComponents();

    fixture = TestBed.createComponent(MenuComponent);

    component = fixture.componentInstance;
    component['isOpen'] = signal(false);
    component.direction.set('left');
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should toggle dropdown', () => {
    component.toggleDropdown();
    expect(component.isOpen()).toBeTruthy();
  });

  it('should select item', () => {
    component.selectItem('edit');
    expect(component.isOpen()).toBeFalse();
  });

  it('should set isOpen to false on outsideClick', () => {
    const fakeTarget = document.createElement('div');

    const event = new MouseEvent('click');
    Object.defineProperty(event, 'target', {
      value: fakeTarget,
      writable: false,
    });

    // Make the method public for testing or test through event handler
    (component as any).onOutsideClick(event);

    expect((component as any).isOpen()).toBeFalse();
  });

  it('should set direction left when buffer value is less than spaceLeft and more that spaceRight', () => {
    const mockIconEl = {
      getBoundingClientRect: () => ({
        top: 100,
        bottom: 120,
        left: 300,
        right: 400,
        width: 100,
        height: 20,
      }),
    };
    spyOn(
      component['elementRef'].nativeElement,
      'querySelector'
    ).and.returnValue(mockIconEl);

    // Force viewport size if needed
    spyOnProperty(window, 'innerWidth').and.returnValue(500);
    spyOnProperty(window, 'innerHeight').and.returnValue(800);

    (component as any).setDropdownDirection();

    expect(component.direction()).toBe('left');
  });

  it('should set direction to right when spaceLeft < buffer and spaceRight > buffer', () => {
    const mockIconEl = {
      getBoundingClientRect: () => ({
        top: 100,
        bottom: 120,
        left: 10,
        right: 60,
      }),
    };

    spyOn(
      component['elementRef'].nativeElement,
      'querySelector'
    ).and.returnValue(mockIconEl);
    spyOnProperty(window, 'innerWidth').and.returnValue(500);

    (component as any).setDropdownDirection();

    expect(component.direction()).toBe('right');
  });

  it('should set direction to bottom when spaceBottom > spaceTop', () => {
    const mockIconEl = {
      getBoundingClientRect: () => ({
        top: 100,
        bottom: 120,
        left: 200,
        right: 250,
      }),
    };

    spyOn(
      component['elementRef'].nativeElement,
      'querySelector'
    ).and.returnValue(mockIconEl);
    spyOnProperty(window, 'innerHeight').and.returnValue(1000);

    (component as any).setDropdownDirection();

    expect(component.direction()).toBe('bottom');
  });

  it('should set direction to top when spaceTop > spaceBottom and no side has enough space', () => {
    const mockIconEl = {
      getBoundingClientRect: () => ({
        top: 700,
        bottom: 750,
        left: 10,
        right: 30,
      }),
    };

    spyOn(
      component['elementRef'].nativeElement,
      'querySelector'
    ).and.returnValue(mockIconEl);
    spyOnProperty(window, 'innerHeight').and.returnValue(900); // spaceBottom = 150 < spaceTop = 700
    spyOnProperty(window, 'innerWidth').and.returnValue(100); // spaceLeft = 10, spaceRight = 70

    (component as any).setDropdownDirection();

    expect(component.direction()).toBe('top');
  });
});
