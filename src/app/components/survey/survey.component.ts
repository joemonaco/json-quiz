import { Component, OnInit } from "@angular/core";
import {
  FormBuilder,
  FormArray,
  FormGroup,
  Validators,
  FormControl
} from "@angular/forms";
import { GetJsonService } from "src/app/services/get-json.service";

@Component({
  selector: "app-survey",
  templateUrl: "./survey.component.html",
  styleUrls: ["./survey.component.css"]
})
export class SurveyComponent implements OnInit {
  quizForm: FormGroup;
  randomizeQuiz = false;
  finalJSON = {};

  selectionMade = false;
  imported = false;

  quizJSON = [];
  types = [
    "Multiple Choice",
    "Multiple Select",
    "Short Answer",
    "Long Answer",
    "Numerical",
    "Likert",
    "Likert Group"
  ];

  //options for type
  //multiple choice, multiple select, fill in the blank

  constructor(private fb: FormBuilder, private quizService: GetJsonService) {}

  ngOnInit() {
    this.quizForm = this.fb.group({
      questions: this.fb.array([this.initQuestions()])
    });
    console.log(this.quizForm.value.questions[0]);
    this.quizService.initQuiz();
  }

  //Check if importing or creating new
  makeForm(importJSON) {
    if (importJSON) {
      this.parseQuiz();
      this.imported = true;
    }
    this.selectionMade = true;
  }

  //Initial Questions array with empty values
  initQuestions() {
    return this.fb.group({
      Type: "",
      prompt: "",
      valid: false,
      Answers: this.fb.array([]),
      minAnswers: 0,
      maxAnswers: 0,
      other: false,
      prompts: this.fb.array([]),
      numLines: 0,
      range: "",
      labels: this.fb.array([]),
      NA: false
    });
  }

  //Initial Answers array with empty values
  initAnswers() {
    return this.fb.group({
      Answer: [""]
    });
  }

  //Initial Labels array with empty values
  initLabel() {
    return this.fb.group({
      label: [""]
    });
  }

  //Initial Prompts array with empty values
  initPrompt() {
    return this.fb.group({
      prompt: [""]
    });
  }

  //Add empty question
  addQuestion() {
    const control = <FormArray>this.quizForm.controls.questions;
    // const control = <FormArray>this.quizForm.controls["questions"];
    control.push(this.initQuestions());
  }

  //Update values of forms based on json
  setQuestions(data) {
    /*
       Type: "",
      prompt: "",
      valid: false,
      Answers: this.fb.array([]),
      minAnswers: 0,
      maxAnswers: 0,
      other: false,
      prompts: this.fb.array([]),
      numLines: 0,
      range: "",
      labels: this.fb.array([]),
      NA: false
    */
    const control = <FormArray>this.quizForm.controls["questions"];

    for (let j = 0; j < data.length; j++) {
      control.at(j).patchValue({
        Type: data[j]["type"],
        prompt: data[j]["prompt"],
        valid: data[j]["mustBeValid"],
        other: data[j]["other"],
        numLines: data[j]["numLines"],
        range: data[j]["range"],
        NA: data[j]["NA"]
      });
      if (data[j]["answers"]) {
        this.addAllAnswers(j, data[j]["answers"]);
      }
      if (data[j]["prompts"]) {
        this.addAllPrompts(j, data[j]["prompts"]);
      }
      if (data[j]["labels"]) {
        this.addAllLabels(j, data[j]["labels"]);
      }
      this.addMinMax(j, data);
      if (j < data.length - 1) {
        control.push(this.initQuestions());
      }
    }
  }

  addMinMax(qIndex, data) {
    const control = <FormArray>this.quizForm.controls.questions;

    switch (data[qIndex]["type"]) {
      case "Multiple Select":
        control.at(qIndex).patchValue({
          minAnswers: data[qIndex]["minAnswers"],
          maxAnswers: data[qIndex]["maxAnswers"]
        });
        break;
      case "Numerical":
        control.at(qIndex).patchValue({
          minAnswers: data[qIndex]["minValue"],
          maxAnswers: data[qIndex]["maxValue"]
        });
        break;
      case "Short Answer":
      case "Long Answer":
        control.at(qIndex).patchValue({
          minAnswers: data[qIndex]["minLength"],
          maxAnswers: data[qIndex]["maxLength"]
        });
        break;
      default:
        break;
    }
  }

  //Add all answers from json into correct form array
  addAllAnswers(qIndex, data) {
    const control = (<FormArray>this.quizForm.controls["questions"])
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
  //Add all answers from json into correct form array
  addAllPrompts(qIndex, data) {
    const control = (<FormArray>this.quizForm.controls["questions"])
      .at(qIndex)
      .get("prompts") as FormArray;

    for (let i = 0; i < data.length; i++) {
      control.push(
        this.fb.group({
          prompt: data[i]
        })
      );
    }
  }
  //Add all answers from json into correct form array
  addAllLabels(qIndex, data) {
    const control = (<FormArray>this.quizForm.controls["questions"])
      .at(qIndex)
      .get("labels") as FormArray;

    for (let i = 0; i < data.length; i++) {
      control.push(
        this.fb.group({
          label: data[i]
        })
      );
    }
  }

  //Delete question from form
  deleteQuestion(qIndex) {
    const control = <FormArray>this.quizForm.controls["questions"];
    // const control = (<FormArray>this.quizForm.controls["questions"])
    //   .at(qIndex)
    //   .get("questions") as FormArray;

    if (control.length > 1) {
      control.removeAt(qIndex);
    }
  }

  //Add answer to right question with empty values
  addAnswer(qIndex) {
    const control = (<FormArray>this.quizForm.controls["questions"])
      .at(qIndex)
      .get("Answers") as FormArray;
    control.push(this.initAnswers());
  }

  addLabel(qIndex) {
    const control = (<FormArray>this.quizForm.controls["questions"])
      .at(qIndex)
      .get("labels") as FormArray;

    // const control = ((<FormArray>this.quizForm.controls['buckets']).at(ix).get('Ys') as FormArray).at(iy).get('Zs') as FormArray;
    control.push(this.initLabel());
  }

  addPrompt(qIndex) {
    const control = (<FormArray>this.quizForm.controls["questions"])
      .at(qIndex)
      .get("prompts") as FormArray;

    // const control = ((<FormArray>this.quizForm.controls['buckets']).at(ix).get('Ys') as FormArray).at(iy).get('Zs') as FormArray;
    control.push(this.initPrompt());
  }

  //Delete answer from question
  deleteAnswer(qIndex) {
    const control = (<FormArray>this.quizForm.controls["questions"])

      .at(qIndex)
      .get("Answers") as FormArray;

    if (control.length >= 1) {
      control.removeAt(control.length - 1);
    }
  }

  deleteLabel(qIndex) {
    const control = (<FormArray>this.quizForm.controls["questions"])
      .at(qIndex)
      .get("labels") as FormArray;

    if (control.length >= 1) {
      control.removeAt(control.length - 1);
    }
  }

  deletePrompt(qIndex) {
    const control = (<FormArray>this.quizForm.controls["questions"])
      .at(qIndex)
      .get("prompts") as FormArray;

    if (control.length >= 1) {
      control.removeAt(control.length - 1);
    }
  }

  //Grab the json form and get array of questions
  parseQuiz() {
    let questions = <FormArray>this.quizForm.controls.questions;
    console.log();
    this.quizService.getQuiz().subscribe(data => {
      // this.parseQuiz(data);
      console.log(data);
      this.setQuestions(data["questions"]);
    });
  }

  mcObj(question) {
    let answers = [];
    console.log("in mcOBJ");
    console.log(question);
    for (let k = 0; k < question["Answers"].length; k++) {
      answers.push(question["Answers"][k]["Answer"]);
    }

    return {
      type: "Multiple Choice",
      prompt: question["prompt"],
      mustBeValid: question["valid"],
      answers: answers,
      other: question["other"]
    };
  }

  msObj(question) {
    let answers = [];
    console.log(question);
    for (let k = 0; k < question["Answers"].length; k++) {
      answers.push(question["Answers"][k]["Answer"]);
    }

    return {
      type: "Multiple Select",
      prompt: question["prompt"],
      mustBeValid: question["valid"],
      answers: answers,
      minAnswers: question["minAnswers"],
      maxAnswers: question["maxAnswers"],
      other: question["other"]
    };
  }

  saObj(question) {
    return {
      type: "Short Answer",
      prompt: question["prompt"],
      mustBeValid: question["valid"],
      minLength: question["minAnswers"],
      maxLength: question["maxAnswers"]
    };
  }

  laObj(question) {
    return {
      type: "Long Answer",
      prompt: question["prompt"],
      mustBeValid: question["valid"],
      minLength: question["minAnswers"],
      maxLength: question["maxAnswers"],
      numLines: question["numLines"]
    };
  }

  numObj(question) {
    return {
      type: "Numerical",
      prompt: question["prompt"],
      mustBeValid: question["valid"],
      minValue: question["minAnswers"],
      maxValue: question["maxAnswers"]
    };
  }

  likertObj(question) {
    let labels = [];
    console.log(question);
    for (let k = 0; k < question["labels"].length; k++) {
      labels.push(question["labels"][k]["label"]);
    }

    return {
      type: "Likert",
      prompt: question["prompt"],
      mustBeValid: question["valid"],
      range: question["range"],
      labels: labels,
      NA: question["NA"]
    };
  }

  lgObj(question) {
    let labels = [];
    for (let k = 0; k < question["labels"].length; k++) {
      labels.push(question["labels"][k]["label"]);
    }

    let prompts = [];
    for (let k = 0; k < question["prompts"].length; k++) {
      prompts.push(question["prompts"][k]["prompt"]);
    }

    return {
      type: "Likert Group",
      prompts: prompts,
      mustBeValid: question["valid"],
      range: question["range"],
      labels: labels,
      NA: question["NA"]
    };
  }

  //Submit form and build dictionary to build json
  submit() {
    let questions = this.quizForm.value.questions;
    let allQuestions = [];
    for (let i = 0; i < questions.length; i++) {
      let type = questions[i]["Type"];
      switch (type) {
        case "Multiple Choice":
          console.log("IN MULTIPLE");
          allQuestions.push(this.mcObj(questions[i]));
          break;
        case "Multiple Select":
          allQuestions.push(this.msObj(questions[i]));
          break;
        case "Short Answer":
          allQuestions.push(this.saObj(questions[i]));
          break;
        case "Long Answer":
          allQuestions.push(this.laObj(questions[i]));
          break;
        case "Numerical":
          allQuestions.push(this.numObj(questions[i]));
          break;
        case "Likert":
          allQuestions.push(this.likertObj(questions[i]));
          break;
        default:
          allQuestions.push(this.lgObj(questions[i]));
          break;
      }
    }

    this.finalJSON["questions"] = allQuestions;

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
