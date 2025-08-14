import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { AppComponent } from './app/app.component';
import { routes } from './app/app-routing.module';
import { authInterceptor } from './app/core/services/auth.interceptor';
import { ThemeService } from './app/core/services/theme.service';
import { environment } from './environments/environment';

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes),
    provideHttpClient(withInterceptors([authInterceptor])),
    provideAnimations(),
    ThemeService
  ]
}).then(appRef => {
  if (environment.useDynamicTheme) {
    const injector = appRef.injector;
    const theme = injector.get(ThemeService);
    theme.get().subscribe();
    theme.connectToUpdates();
  }
}).catch(err => console.error(err));
