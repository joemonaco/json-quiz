import { Component, OnInit } from "@angular/core";
import {
  FormBuilder,
  FormArray,
  FormGroup,
  Validators,
  FormControl
} from "@angular/forms";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { GetJsonService } from "src/app/services/get-json.service";

@Component({
  selector: "app-json-form",
  templateUrl: "./json-form.component.html",
  styleUrls: ["./json-form.component.css"]
})
export class JsonFormComponent implements OnInit {
  quizForm: FormGroup;
  randomizeQuiz = false;
  finalJSON = [{}];

  quizJSON = [];

  constructor(
    private fb: FormBuilder,
    private httpClient: HttpClient,
    private quizService: GetJsonService
  ) {}

  ngOnInit() {
    this.quizForm = this.fb.group({
      questions: this.fb.array([this.initQuestions()])
    });

    this.quizService.initQuiz();
    this.quizService.getQuiz().subscribe(data => {
      this.parseQuiz(data);
    });
  }

  initQuestions() {
    return this.fb.group({
      //  ---------------------forms fields on x level ------------------------
      Type: [],
      Text: [],
      Points: [],
      // ---------------------------------------------------------------------
      Answers: this.fb.array([]),
      CorrectAnswers: this.fb.array([]),
      Randomize: [false]
    });
  }

  initAnswers() {
    return this.fb.group({
      Answer: [""]
    });
  }

  initCorretAnswers() {
    return this.fb.group({
      Correct: [""]
    });
  }

  addQuestion() {
    const control = <FormArray>this.quizForm.controls["questions"];
    control.push(this.initQuestions());
  }

  setQuestions(data) {
    let control = <FormArray>this.quizForm.controls.questions;

    for (let i = 0; i < data.length; i++) {
      control.at(i).patchValue({
        Type: [data[i]["type"]],
        Text: [data[i]["text"]],
        Points: [data[i]["point_value"]],
        Randomize: [data[i]["randomize"]]
      });
      this.addAllAnswers(i, data[i]["answers"]);
      this.addAllCorrect(i, data[i]["correct_answers"]);
      if (i < data.length - 1) {
        control.push(this.initQuestions());
      }
    }
  }

  addAllAnswers(index, data) {
    const control = (<FormArray>this.quizForm.controls["questions"])
      .at(index)
      .get("Answers") as FormArray;

    for (let i = 0; i < data.length; i++) {
      control.push(
        this.fb.group({
          Answer: data[i]
        })
      );
    }
  }

  // addFirstCorrect(index, data) {
  //   const control = (<FormArray>this.quizForm.controls["questions"])
  //     .at(index)
  //     .get("CorrectAnswers") as FormArray;

  //   return this.fb.group({
  //     Correct: [data[0]]
  //   });
  // }

  addAllCorrect(index, data) {
    const control = (<FormArray>this.quizForm.controls["questions"])
      .at(index)
      .get("CorrectAnswers") as FormArray;

    for (let i = 0; i < data.length; i++) {
      control.push(
        this.fb.group({
          Correct: [data[i]]
        })
      );
    }
  }

  deleteQuestion(index: number) {
    const control = <FormArray>this.quizForm.controls["questions"];
    if (control.length > 1) {
      control.removeAt(index);
    }
  }

  addAnswer(index) {
    const control = (<FormArray>this.quizForm.controls["questions"])
      .at(index)
      .get("Answers") as FormArray;
    control.push(this.initAnswers());
  }

  deleteAnswer(index: number) {
    const control = (<FormArray>this.quizForm.controls["questions"])
      .at(index)
      .get("Answers") as FormArray;

    control.removeAt(index);
    if (control.length > 1) {
      control.removeAt(index);
      console.log(index);
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

  parseQuiz(data) {
    console.log(data);
    let questions = data[0]["questions"];
    console.log("qeustions", questions);
    this.setQuestions(questions);
  }

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
