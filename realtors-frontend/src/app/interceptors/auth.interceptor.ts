import { HttpInterceptorFn, HttpRequest, HttpHandlerFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';

export const authInterceptor: HttpInterceptorFn = (
  request: HttpRequest<unknown>,
  next: HttpHandlerFn
): Observable<any> => {
  const authService = inject(AuthService);
  let isRefreshing = false;

  const addTokenToRequest = (req: HttpRequest<unknown>, token: string): HttpRequest<unknown> => {
    return req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  };

  const handle401Error = (req: HttpRequest<unknown>, next: HttpHandlerFn): Observable<any> => {
    isRefreshing = true;
    return authService.refreshToken().pipe(
      switchMap(response => {
        isRefreshing = false;
        return next(addTokenToRequest(req, response.accessToken));
      }),
      catchError(error => {
        isRefreshing = false;
        authService.logout();
        return throwError(() => error);
      })
    );
  };

  const token = authService.getAccessToken();
  
  if (token) {
    request = addTokenToRequest(request, token);
  }

  return next(request).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401 && !isRefreshing) {
        return handle401Error(request, next);
      }
      return throwError(() => error);
    })
  );
}; 