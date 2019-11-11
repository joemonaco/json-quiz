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

  selectionMade = false;

  quizJSON = [];

  constructor(
    private fb: FormBuilder,
    private httpClient: HttpClient,
    private quizService: GetJsonService
  ) {}

  ngOnInit() {
    this.quizForm = this.fb.group({
      buckets: this.fb.array([this.initBucket()])
    });

    this.quizService.initQuiz();
  }

  //Check if importing or creating new
  makeForm(importJSON) {
    if (importJSON) {
      this.parseQuiz();
    }
    this.selectionMade = true;
  }

  initBucket() {
    return this.fb.group({
      questions: this.fb.array([this.initQuestions()])
    });
  }

  //Initial Questions array with empty values
  initQuestions() {
    return this.fb.group({
      Type: [],
      Text: [],
      Points: [],
      Answers: this.fb.array([]),
      CorrectAnswers: this.fb.array([]),
      Randomize: [false]
    });
  }

  //Initial Answers array with empty values
  initAnswers() {
    return this.fb.group({
      Answer: [""]
    });
  }

  //Initial Correct Answers array with empty values
  initCorretAnswers() {
    return this.fb.group({
      Correct: [""]
    });
  }

  addBucket() {
    const control = <FormArray>this.quizForm.controls["buckets"];
    control.push(this.initBucket());
  }

  //Add empty question
  addQuestion(index) {
    const control = (<FormArray>this.quizForm.controls["buckets"])
      .at(index)
      .get("questions") as FormArray;
    // const control = <FormArray>this.quizForm.controls["questions"];
    control.push(this.initQuestions());
  }

  //Update values of forms based on json
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

  //Add all answers from json into correct form array
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

  //Add all correct answers from json into correct form array
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

  //Delete question from form
  deleteQuestion(bIndex, qIndex) {
    // const control = <FormArray>this.quizForm.controls["questions"];
    const control = (<FormArray>this.quizForm.controls["buckets"])
      .at(bIndex)
      .get("questions") as FormArray;

    if (control.length > 1) {
      control.removeAt(qIndex);
    }
  }

  //Add answer to right question with empty values
  addAnswer(bIndex, qIndex) {
    const control = ((<FormArray>this.quizForm.controls["buckets"])
      .at(bIndex)
      .get("questions") as FormArray)
      .at(qIndex)
      .get("Answers") as FormArray;

    // const control = ((<FormArray>this.quizForm.controls['buckets']).at(ix).get('Ys') as FormArray).at(iy).get('Zs') as FormArray;
    control.push(this.initAnswers());
  }

  //Delete answer from question
  deleteAnswer(bIndex, qIndex) {
    const control = ((<FormArray>this.quizForm.controls["buckets"])
      .at(bIndex)
      .get("questions") as FormArray)
      .at(qIndex)
      .get("Answers") as FormArray;

    // control.removeAt(index);
    if (control.length > 1) {
      control.removeAt(qIndex);
      // console.log(index);
    }
  }

  //Add another correct answer to right question
  addCorrect(bIndex, qIndex) {
    const control = ((<FormArray>this.quizForm.controls["buckets"])
      .at(bIndex)
      .get("questions") as FormArray)
      .at(qIndex)
      .get("CorrectAnswers") as FormArray;

    control.push(this.initCorretAnswers());
  }

  //Delete correct answer from right question
  deleteCorrect(bIndex, qIndex) {
    const control = ((<FormArray>this.quizForm.controls["buckets"])
      .at(bIndex)
      .get("questions") as FormArray)
      .at(qIndex)
      .get("CorrectAnswers") as FormArray;
    if (control.length > 1) {
      control.removeAt(qIndex);
    }
  }

  //Grab the json form and get array of questions
  parseQuiz() {
    console.log();
    this.quizService.getQuiz().subscribe(data => {
      // this.parseQuiz(data);
      console.log(data);
      let questions = data[0]["questions"];
      console.log("qeustions", questions);
      this.setQuestions(questions);
    });
  }

  //Submit form and build dictionary to build json
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
        point_value: questions[i]["Points"][0],
        answers: answers,
        correct_answers: correctAnswers,
        randomize: questions[i]["Randomize"]
      });
    }
    this.finalJSON[0]["questions"] = allQuestions;
    console.log(this.finalJSON);
    this.saveJSON(JSON.stringify(this.finalJSON), "stuff.json");
  }

  //Download json file with given file name
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
