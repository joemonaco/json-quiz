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
  types = ["multiple choice", "multiple select", "fill in the blank"];

  //options for type
  //multiple choice, multiple select, fill in the blank

  constructor(private fb: FormBuilder, private quizService: GetJsonService) {}

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
      num_questions: [],
      randomize: false,
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
    const control = <FormArray>this.quizForm.controls.buckets;
    control.push(this.initBucket());
  }

  //Add empty question
  addQuestion(index) {
    const control = (<FormArray>this.quizForm.controls["buckets"])
      .at(index)
      .get("questions") as FormArray;
    control.push(this.initQuestions());
  }

  //Update values of forms based on json
  setQuestions(i, data) {
    const control = (<FormArray>this.quizForm.controls["buckets"])
      .at(i)
      .get("questions") as FormArray;

    for (let j = 0; j < data.length; j++) {
      control.at(j).patchValue({
        Type: [data[j]["type"]],
        Text: [data[j]["text"]],
        Points: [data[j]["point_value"]],
        Randomize: [data[j]["randomize"]]
      });
      this.addAllAnswers(i, j, data[j]["answers"]);
      this.addAllCorrect(i, j, data[j]["correct_answers"]);
      if (j < data.length - 1) {
        console.log("i: " + i + " data.length: ", data.length);
        control.push(this.initQuestions());
      }
    }
  }

  //Add all answers from json into correct form array
  addAllAnswers(bIndex, qIndex, data) {
    const control = ((<FormArray>this.quizForm.controls["buckets"])
      .at(bIndex)
      .get("questions") as FormArray)
      .at(qIndex)
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
  addAllCorrect(bIndex, qIndex, data) {
    const control = ((<FormArray>this.quizForm.controls["buckets"])
      .at(bIndex)
      .get("questions") as FormArray)
      .at(qIndex)
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

    control.push(this.initAnswers());
  }

  //Delete answer from question
  deleteAnswer(bIndex, qIndex) {
    const control = ((<FormArray>this.quizForm.controls["buckets"])
      .at(bIndex)
      .get("questions") as FormArray)
      .at(qIndex)
      .get("Answers") as FormArray;

    if (control.length >= 1) {
      control.removeAt(control.length - 1);
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
    if (control.length >= 1) {
      control.removeAt(control.length - 1);
    }
  }

  //Grab the json form and get array of questions
  parseQuiz() {
    let bucketControl = <FormArray>this.quizForm.controls.buckets;
    console.log();
    this.quizService.getQuiz().subscribe(data => {
      // this.parseQuiz(data);
      console.log(data);
      for (let i = 0; i < data.length; i++) {
        bucketControl.at(i).patchValue({
          num_questions: data[i]["num_questions"]
        });
        let questions = data[i]["questions"];
        console.log("qeustions", questions);
        this.setQuestions(i, questions);

        if (i < data.length - 1) {
          bucketControl.push(this.initBucket());
        }
      }
    });
  }

  //Submit form and build dictionary to build json
  submit() {
    let buckets = this.quizForm.value.buckets;
    for (let i = 0; i < buckets.length; i++) {
      // this.finalJSON.push(null);
      let questions = buckets[i]["questions"];

      let allQuestions = [];

      for (let j = 0; j < questions.length; j++) {
        let answers = [];
        let correctAnswers = [];
        for (let k = 0; k < questions[j]["Answers"].length; k++) {
          answers.push(questions[j]["Answers"][k]["Answer"]);
        }
        for (let k = 0; k < questions[j]["CorrectAnswers"].length; k++) {
          correctAnswers.push(questions[j]["CorrectAnswers"][k]["Correct"]);
        }

        allQuestions.push({
          type: questions[j]["Type"],
          text: questions[j]["Text"],
          point_value: questions[j]["Points"][0],
          answers: answers,
          correct_answers: correctAnswers,
          randomize: questions[j]["Randomize"]
        });
      }
      let obj = {
        num_questions: buckets[i]["num_questions"],
        randomize: buckets[i]["randomize"],
        questions: allQuestions
      };
      if (i == 0) {
        this.finalJSON[0] = obj;
      } else {
        this.finalJSON.push(obj);
      }

      // this.finalJSON[i]["num_questions"] = questions.length;
      // this.finalJSON[i]["randomize"] = this.randomizeQuiz;
      // this.finalJSON[i]["questions"] = allQuestions;
    }

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
