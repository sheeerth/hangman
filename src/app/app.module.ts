import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './view/game/app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {ComponentsModule} from './components/components.module';
import {MatButtonModule} from '@angular/material/button';
import {HttpClientJsonpModule, HttpClientModule} from '@angular/common/http';
import {MatDialogModule} from '@angular/material/dialog';
import {AppRoutingModule} from './app-routing.module';
import { MainComponent } from './view/main/main.component';
import {MenuModule} from './view/menu/menu.module';
import { HangmanCanvasDirective } from './view/game/hangman-canvas.directive';

@NgModule({
  declarations: [
    AppComponent,
    MainComponent,
    HangmanCanvasDirective
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    MenuModule,
    ComponentsModule,
    MatButtonModule,
    HttpClientModule,
    MatDialogModule,
    HttpClientJsonpModule,
  ],
  providers: [],
  bootstrap: [MainComponent]
})
export class AppModule { }
