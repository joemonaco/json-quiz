import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { SurveyComponent } from "./components/survey/survey.component";
import { JsonFormComponent } from "./components/json-form/json-form.component";

const routes: Routes = [
  { path: "", component: JsonFormComponent },
  { path: "survey", component: SurveyComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
