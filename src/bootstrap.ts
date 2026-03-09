import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import  AppComponent  from './app/app.component';

console.log('[LMS] Module loaded - ready for manual bootstrap');

export { AppComponent, appConfig, bootstrapApplication };