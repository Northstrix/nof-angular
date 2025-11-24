import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app';
import { importProvidersFrom } from '@angular/core';
import { LucideAngularModule, Globe, Github, Check, Copy } from 'lucide-angular';

bootstrapApplication(AppComponent, {
  ...appConfig,
  providers: [
    ...(appConfig.providers || []),
    importProvidersFrom(LucideAngularModule.pick({ Globe, Github, Check, Copy }))
  ]
})
.catch((err) => console.error(err));
