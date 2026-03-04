// import { ComponentFixture, TestBed } from '@angular/core/testing';

// import { UserNameWithIconComponent } from './user-name-with-icon.component';
// import { MoreTeamMembersComponent } from '../more-team-members/more-team-members.component';

// describe('UserNameWithIconComponent', () => {
//   let component: UserNameWithIconComponent;
//   let fixture: ComponentFixture<UserNameWithIconComponent>;
//   let hostComponent: MoreTeamMembersComponent;

//   beforeEach(async () => {
//     await TestBed.configureTestingModule({
//       imports: [UserNameWithIconComponent],
//       declarations: [MoreTeamMembersComponent],
//     }).compileComponents();

//     fixture = TestBed.createComponent(UserNameWithIconComponent);
//     hostComponent = fixture.componentInstance;
//     component = fixture.debugElement.children[0].componentInstance;
//     fixture.detectChanges();
//   });

//   it('should create', () => {
//     expect(component).toBeTruthy();
//   });

//   it('should display initials from first and last name', () => {
//     hostComponent.testData = { firstName: 'Sai', lastName: 'Ganta' };
//     fixture.detectChanges();

//     const initials = fixture.nativeElement
//       .querySelector('.icon')
//       .textContent.trim();
//     expect(initials).toBe('SG');
//   });

//   it('should display first two letters of firstName when lastName is missing', () => {
//     hostComponent.testData = { firstName: 'Sai', lastName: '' };
//     fixture.detectChanges();

//     const initials = fixture.nativeElement
//       .querySelector('.icon')
//       .textContent.trim();
//     expect(initials).toBe('SA');
//   });

//   it('should handle missing firstName and lastName gracefully', () => {
//     hostComponent.testData = { firstName: '', lastName: '' };
//     fixture.detectChanges();

//     const initials = fixture.nativeElement
//       .querySelector('.icon')
//       .textContent.trim();
//     expect(initials).toBe('');
//   });

//   it('should display full name with CapitalizePipe', () => {
//     hostComponent.testData = { firstName: 'sai', lastName: 'ganta' };
//     fixture.detectChanges();

//     const fullName = fixture.nativeElement
//       .querySelector('.info p')
//       .textContent.trim();
//     expect(fullName).toBe('Sai Ganta');
//   });
// });
