import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { HomeComponent } from './home/home.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { ProfileComponent } from './profile/profile.component';
import { CookieService } from 'ngx-cookie-service';
import { ListingsComponent } from './listings/listings.component';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatCardModule} from '@angular/material/card';
import { MatInputModule} from "@angular/material/input";
import {MatFormFieldModule} from "@angular/material/form-field";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { MatNativeDateModule } from '@angular/material/core';
import { DetailComponent } from './listings/detail/detail.component';
import { FormComponent } from './listings/form/form.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    SignupComponent,
    HomeComponent,
    ProfileComponent,
    ListingsComponent,
    DetailComponent,
    FormComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    AppRoutingModule,
    NgbModule,
    FormsModule,
    ReactiveFormsModule,
    MatDatepickerModule,
    MatCardModule,
    MatInputModule,
    MatFormFieldModule,
    MatNativeDateModule
  ],
  providers: [CookieService,
    MatDatepickerModule,
    MatNativeDateModule],
  bootstrap: [AppComponent]
})
export class AppModule { }
