import { CanActivateFn, Router } from "@angular/router";
import { inject } from "@angular/core";
import { AuthService } from "../services/auth.service";

export function moduleGuard(requiredModule: string): CanActivateFn {
  return (route, state) => {
    const authService = inject(AuthService);
    const router = inject(Router);

    if (!authService.isAuthenticated) {
      router.navigate(["/login"], { queryParams: { returnUrl: state.url } });
      return false;
    }

    if (authService.isCliente) {
      router.navigate(["/portal"]);
      return false;
    }

    if (authService.hasModulePermission(requiredModule)) {
      return true;
    }

    const fallbackRoute = authService.getFirstAllowedRoute();
    router.navigate([fallbackRoute]);
    return false;
  };
}
