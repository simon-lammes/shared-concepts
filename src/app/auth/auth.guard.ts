import { map, first, tap } from 'rxjs/operators';
import { AngularFireAuth } from '@angular/fire/auth';
import { Injectable } from '@angular/core';
import { CanLoad, Route, UrlSegment, Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanLoad, CanActivate {

  constructor(
    private afService: AngularFireAuth,
    private router: Router
  ){}

  canLoad(route: Route, segments: UrlSegment[]): Observable<boolean> | Promise<boolean> | boolean {
    return this.isAuthenticated();
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
    return this.isAuthenticated();
  }

  isAuthenticated(): Observable<boolean> {
    return this.afService.authState.pipe(map(user => {
      return !!user;
    }),
    tap(isAuthenticated => {
      if (!isAuthenticated) {
        this.router.navigateByUrl('/auth')
      }
    }), first());
  }
}
