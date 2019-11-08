import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { JsonFormComponent } from "./components/json-form/json-form.component";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

import { HttpClient } from "@angular/common/http";

@NgModule({
  declarations: [AppComponent, JsonFormComponent],
  imports: [BrowserModule, AppRoutingModule, FormsModule, ReactiveFormsModule],
  providers: [HttpClient],
  bootstrap: [AppComponent]
})
export class AppModule {}
