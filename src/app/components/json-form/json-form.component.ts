import { Component, OnInit } from "@angular/core";
import {
  FormBuilder,
  FormArray,
  FormGroup,
  Validators,
  FormControl
} from "@angular/forms";
import { HttpClient } from "@angular/common/http";

@Component({
  selector: "app-json-form",
  templateUrl: "./json-form.component.html",
  styleUrls: ["./json-form.component.css"]
})
export class JsonFormComponent implements OnInit {
  quizForm: FormGroup;
  randomizeQuiz = false;
  finalJSON = [{}];

  constructor(private fb: FormBuilder, private httpClient: HttpClient) {}

  ngOnInit() {
    this.quizForm = this.fb.group({
      questions: this.fb.array([this.initQuestions()])
    });
  }

  initQuestions() {
    return this.fb.group({
      //  ---------------------forms fields on x level ------------------------
      Type: ["Type", [Validators.required]],
      Text: ["Text", [Validators.required]],
      Points: [, [Validators.required]],
      // ---------------------------------------------------------------------
      Answers: this.fb.array([this.initAnswers()]),
      CorrectAnswers: this.fb.array([this.initCorretAnswers()]),
      Randomize: [false]
    });
  }

  initAnswers() {
    return this.fb.group({
      Answer: ["", [Validators.required]]
    });
  }

  initCorretAnswers() {
    return this.fb.group({
      Correct: ["", [Validators.required]]
    });
  }

  addQuestion() {
    const control = <FormArray>this.quizForm.controls["questions"];
    control.push(this.initQuestions());
  }

  deleteQuestion(index: number) {
    const control = <FormArray>this.quizForm.controls["questions"];
    if (control.length > 1) {
      control.removeAt(index);
    }
  }

  addAnswer(ix) {
    const control = (<FormArray>this.quizForm.controls["questions"])
      .at(ix)
      .get("Answers") as FormArray;
    control.push(this.initAnswers());
  }

  deleteAnswer(index: number) {
    const control = (<FormArray>this.quizForm.controls["questions"])
      .at(index)
      .get("Answers") as FormArray;
    if (control.length > 1) {
      control.removeAt(index);
    }
  }

  addCorrect(ix) {
    const control = (<FormArray>this.quizForm.controls["questions"])
      .at(ix)
      .get("CorrectAnswers") as FormArray;
    control.push(this.initCorretAnswers());
  }

  deleteCorrect(index) {
    const control = (<FormArray>this.quizForm.controls["questions"])
      .at(index)
      .get("CorrectAnswers") as FormArray;
    if (control.length > 1) {
      control.removeAt(index);
    }
  }

  populateForm() {}

  submit() {
    let questions = this.quizForm.value.questions;
    this.finalJSON[0]["num_questions"] = questions.length;
    this.finalJSON[0]["randomize"] = this.randomizeQuiz;

    let allQuestions = [];

    for (let i = 0; i < questions.length; i++) {
      let answers = [];
      let correctAnswers = [];
      for (let j = 0; j < questions[i]["Answers"].length; j++) {
        answers.push(questions[i]["Answers"][j]["Answer"]);
      }
      for (let j = 0; j < questions[i]["CorrectAnswers"].length; j++) {
        correctAnswers.push(questions[i]["CorrectAnswers"][j]["Correct"]);
      }

      allQuestions.push({
        type: questions[i]["Type"],
        text: questions[i]["Text"],
        point_value: questions[i]["Points"],
        answers: answers,
        correct_answers: correctAnswers,
        randomize: questions[i]["Randomize"]
      });
    }
    this.finalJSON[0]["questions"] = allQuestions;
    console.log(this.finalJSON);
    this.saveJSON(JSON.stringify(this.finalJSON), "stuff.json");
  }

  saveJSON(text, filename) {
    var a = document.createElement("a");
    a.setAttribute(
      "href",
      "data:text/plain;charset=utf-u," + encodeURIComponent(text)
    );
    a.setAttribute("download", filename);
    a.click();
  }
}
