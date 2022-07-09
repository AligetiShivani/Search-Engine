const express = require("express");
const ejs = require("ejs");
const path = require("path");
const fs = require('fs').promises;

var TFIDF= require('node-tfidf');
var tfidf = new TFIDF();

var url = urldata.split("\n");
var title = titledata.split("\n");


async function hey()
{
    var urldata=await fs.readFile("./datasets/problem_urls.txt", "utf-8");
    var titledata=await fs.readFile("./datasets/problem_titles.txt", "utf-8");
}
hey ();

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




app.get("/search", (req, res) => {
    const query = req.query;
    const question = query.question;
    const map1 = new Map();

    var flag = 0;

    for (let i = 1; i <= N; i++) {
        tfidf.addFileSync(`./datasets/ps/problem_text_${i}.txt`);
    }

    let problem_text = [];

    for (let i = 1; i <= N; i++) {

        let data;
        try {
            data= readfile(data,`./datasets/ps/problem_text_${i}.txt`);
        }
        catch (error) {
            console.error(`Got an error trying to read the file: ${error.message}`);
        }
        problem_text.push(data);
    }


    tfidf.tfidfs(question, function (i, measure) {
        map1.set(i + 1, measure);
    });
    const sortedNumDesc = new Map([...map1].sort((a, b) => b[1] - a[1]));

    let data_array = [];

    for (const [key, value] of sortedNumDesc.entries()) {
        if (flag < 5 && value!=0) {
            let my_object = {
                title: titletext[key - 1],
                url: urltext[key - 1],
                statement: problem_text[key - 1]
            };
            flag += 1;
            data_array.push(my_object);

            console.log(title[key - 1]);
            console.log(url[key - 1]);
            console.log(problem_text[key - 1]);
        } 
        else {
            break;
        }
     }
    
    setTimeout(() => {
        res.json(data_array);
    }, 2000);
});

app.listen(PORT, () => {
    console.log("Server is running on port " + PORT);
});