import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { JsonFormComponent } from "./components/json-form/json-form.component";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { HttpClientModule } from "@angular/common/http";
import { GetJsonService } from "./services/get-json.service";
import { SurveyComponent } from './components/survey/survey.component';

@NgModule({
  declarations: [AppComponent, JsonFormComponent, SurveyComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule
  ],
  providers: [GetJsonService],
  bootstrap: [AppComponent]
})
export class AppModule {}
