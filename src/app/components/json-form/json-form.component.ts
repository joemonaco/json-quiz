import { Component, OnInit } from "@angular/core";
import { FormBuilder } from "@angular/forms";

@Component({
  selector: "app-json-form",
  templateUrl: "./json-form.component.html",
  styleUrls: ["./json-form.component.css"]
})
export class JsonFormComponent implements OnInit {
  numOfQuestions = 0;
  numQuestionsArr = [];

  constructor() {}

  ngOnInit() {}

  numberQuestions(value) {
    this.numQuestionsArr = [];
    for (let i = 0; i < value; i++) {
      this.numQuestionsArr.push(null);
    }
  }

  //Use blur for each input and then add to the array

  update(index, value) {
    console.log(index, value);
  }

  submitQuiz() {}
}
