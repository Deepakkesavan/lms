
import { LocationStrategy } from '@angular/common';
import { SilentLocationStrategyService } from './helper/service/SilentLocationStrategy/silent-location-strategy.service';
import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors, withInterceptorsFromDi } from '@angular/common/http';
import { lmsRoutes } from './app.routes';
import { globalErrorHandlerInterceptor } from './shared/interceptors/global-error-handler.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(lmsRoutes),
    // Routing
    { provide: LocationStrategy, useClass: SilentLocationStrategyService },

    // HTTP with global interceptors
    provideHttpClient(
      withInterceptors([globalErrorHandlerInterceptor]),
      withInterceptorsFromDi()
    ),

  ],
};
