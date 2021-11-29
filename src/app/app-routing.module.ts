import {NgModule} from '@angular/core';
import {AppComponent} from './view/game/app.component';
import {RouterModule} from '@angular/router';
import {MainMenuComponent} from './view/menu/main-menu/main-menu.component';

const paths = [
  {path: '', component: MainMenuComponent},
  {path: 'game', component: AppComponent},
  {path: '**', redirectTo: ''}
];

@NgModule({
  imports: [
    RouterModule.forRoot(paths),
  ],
  exports: [
    RouterModule
  ]
})
export class AppRoutingModule {
}
