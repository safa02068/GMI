import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { AppComponent } from './app.component';

@NgModule({
  // ❌ NE PAS mettre AppComponent ici
  declarations: [],
  // ✅ Importer AppComponent comme un module standalone
  imports: [
    BrowserModule,
    HttpClientModule,
    AppComponent
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }