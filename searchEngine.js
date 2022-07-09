const express = require("express");
const ejs = require("ejs");
const path = require("path");
const dotenv = require('dotenv');

var TFIDF= require('node-tfidf');
var tfidf = new TFIDF();


var fs1 = require("fs");
var urldata = fs1.readFileSync("./datasets/problem_urls.txt", "utf-8");
var url = urldata.split("\n");

console.log(url[0]);


var fs2 = require("fs");
var titledata = fs2.readFileSync("./datasets/problem_titles.txt", "utf-8");
var title = titledata.split("\n");


var fs3 = require("fs");
var codedata = fs3.readFileSync("./datasets/problem_codes.txt", "utf-8");
var code = codedata.split("\n");

var fs4 = require("fs");
var submissiondata = fs4.readFileSync("./datasets/problem_submissions.txt", "utf-8");
var submission = submissiondata.split("\n");

var fs5 = require("fs");
var difficultydata = fs5.readFileSync("./datasets/problem_difficulty.txt", "utf-8");
var difficulty = difficultydata.split("\n");

const app = express();
app.use(express.json());

var N=3639;
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "/public")));
const PORT = process.env.PORT || 3000;


app.get("/", (req, res) => {
    res.render("index");
});

app.get("/home", (req, res) => {
    res.render("index");
});

var fs=require("fs");
app.get("/search", (req, res) => {
    const query = req.query;
    const question = query.question;
    const map1 = new Map();
    var flag = 0;
    for (let i = 1; i <= N; i++) {
        tfidf.addFileSync(`./datasets/ps/problem_text_${i}.txt`);
    }
    let txt = [];
    for (let i = 1; i <= N; i++) {
        let data = fs.readFileSync(`./datasets/ps/problem_text_${i}.txt`, 'utf-8');
        txt.push(data);
    }


    tfidf.tfidfs(question, function (i, measure) {
        map1.set(i + 1, measure);
    });
    const sortedNumDesc = new Map([...map1].sort((a, b) => b[1] - a[1]));

    let data_array = [];

    for (const [key, value] of sortedNumDesc.entries()) {
        if (flag < 5 && value!=0) {
            if(code[key-1]==undefined)
            {

            }
            else{
              
                let my_object = {
                code:code[key-1],
                title: title[key - 1],
                txt: txt[key - 1],
                url: url[key - 1],
                submission:submission[key - 1],
                difficulty: difficulty[key-1]
                };
                flag += 1;
                data_array.push(my_object);
            }

        } 
        else {
            break;
        }
     }
    
    setTimeout(() => {
       // console.log("data_arr",data_array);
        res.json(data_array);
    }, 2000);
});

app.listen(PORT, () => {
    console.log("Server is running on port " + PORT);
});