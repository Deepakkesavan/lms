import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';
import { inject } from '@angular/core';
import { SnackbarService } from '@clarium/ngce-components';

export const globalErrorHandlerInterceptor: HttpInterceptorFn = (req, next) => {
    req = req.clone({ withCredentials: true });
    const snackbarService = inject(SnackbarService);

    return next(req).pipe(
        catchError((error: HttpErrorResponse) => {
            let errorMessage = 'Something went wrong';

            // Check for different error response formats
            if (error.error) {
                if (error.error.Errors && error.error.Errors[0]) {
                    errorMessage = error.error.Errors[0].Message || errorMessage;
                } else if (error.error.errors && error.error.errors[0]) {
                    errorMessage = error.error.errors[0].message || errorMessage;
                } else if (typeof error.error === 'string') {
                    errorMessage = error.error;
                }
            }

            console.error('LMS Global Error:', errorMessage, error);

            snackbarService.show(errorMessage, 'danger');

            return throwError(() => ({
                status: error.status,
                message: errorMessage,
            }));
        })
    );
};
