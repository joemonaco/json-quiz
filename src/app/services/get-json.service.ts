import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root"
})
export class GetJsonService {
  quiz: any;
  constructor(private http: HttpClient) {}

  initQuiz() {
    this.quiz = this.http.get<any[]>("../assets/test_form.json");
  }

  getQuiz(): Observable<any[]> {
    return this.quiz;
  }
}
