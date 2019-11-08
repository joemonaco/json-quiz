import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { JsonFormComponent } from "./components/json-form/json-form.component";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { HttpClientModule } from "@angular/common/http";
import { GetJsonService } from "./services/get-json.service";

@NgModule({
  declarations: [AppComponent, JsonFormComponent],
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
