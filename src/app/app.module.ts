import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { environment } from 'src/environments/environment';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SharedModule } from './shared/shared.module';
import { provideAuth, getAuth } from '@angular/fire/auth';
import { provideFirebaseApp, getApp, initializeApp } from '@angular/fire/app';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { UserModule } from './user/user.module';
import { HomeModule } from './home/home.module';

const AngularFire = [
  provideFirebaseApp(() => initializeApp(environment.firebase)),
  // provideAnalytics(() => getAnalytics()),
  provideAuth(() => getAuth()),
  provideFirestore(() => getFirestore()),
  // provideFunctions(() => getFunctions()),
  // providePerformance(() => getPerformance()),
  // provideRemoteConfig(() => getRemoteConfig()),
  // provideStorage(() => getStorage()),
];

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    UserModule,
    SharedModule,
    HomeModule,
    ...AngularFire,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
