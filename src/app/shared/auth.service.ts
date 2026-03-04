import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { runtimeConfig } from 'config/runtime-config';
import { getBackendUrl } from 'util/getBackendUrl';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private user: any = null;

  // private baseurl: string = runtimeConfig.backendUrl;
  private readonly baseUrl = getBackendUrl('workforce', 'lms');

  constructor(private http: HttpClient) {}

  initializeUser(): Observable<any> {
    return this.http
      .post(`${this.baseUrl}/Lms/getUserDetailsFromJWT`, {
        withCredentials: true,
      })
      .pipe(
        tap((res: any) => {
          this.user = res.user;
          sessionStorage.setItem('user', JSON.stringify(this.user));
        }),
        catchError((err) => {
          return of(null);
        })
      );
  }

  isLoggedIn(): boolean {
    return !!this.user || !!sessionStorage.getItem('user');
  }

  getUser() {
    return this.user;
  }

  logout(): Observable<any> {
    return this.http
      .post(`${this.baseUrl}/Lms/logout`, { withCredentials: true })
      .pipe(tap((res: any) => {}));
  }

  getAllDesignations(): Observable<string[]> {
    return this.http.post<string[]>(`${this.baseUrl}/Lms/hr/designations`, {
      withCredentials: true,
    });
  }
}
