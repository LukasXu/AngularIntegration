import { Injector, NgModule } from '@angular/core';
import { createCustomElement } from '@angular/elements';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  entryComponents: [AppComponent]
})
export class AppModule { 
  constructor(private injector: Injector) {
    
  }

  ngDoBootstrap() {
    if (!customElements.get('app-angular-spfx')) {
      const el = createCustomElement(AppComponent, {injector: this.injector});
      customElements.define('app-angular-spfx', el)
    }
  };
}
