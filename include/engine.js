
let anticheats = [];
let result = [...anticheats];

fetch("config.json").then(resp => {
    resp.json().then(json => {
        anticheats = json;
        result = [...json];
    })
});

function getAllValues(key) {
    let val = [];
    for(let ac of result) {
        let obj = ac[key];
        if(obj instanceof Array) {
            for(let arr of obj) {
                if(val.indexOf(arr) == -1) {
                    val.push(arr);
                }
            }
        } else {
            if(val.indexOf(obj) == -1) {
                val.push(obj);
            }
        }
    }
    return val;
}

// load filters

function filterIntValue(key, val) {
    result = result.filter((ac, index, arr) => ac[key] >= val);
    nextQuestion();
}

function filterSameValue(key, val) {
    result = result.filter((ac, index, arr) => ac[key] == val);
    nextQuestion();
}

function filterContainsValue(key, val) {
    result = result.filter((ac, index, arr) => ac[key].indexOf(val) != -1);
    nextQuestion();
}

// load questions
let questions = [];

questions.push({ question: "Which platform are you mainly using ?", key: "platforms", action: showArrayContent });
questions.push({ question: "What is your budget ?", key: "price", action: showEqualsContent });

// load engine
let c;

function getHeaderText(question) {
    return `<h2 class="title is-2" style="color:white;">` + question + `</h2>`;
}

function showBooleanContent(question, key) {
    let buttons = `<button onclick="nextQuestion();" class="button is-black">Ignore</button>`;
    let values = getAllValues(key);
    if(values.length == 1) { // all AC have sames values
        nextQuestion();
        return;
    }
    for(let a of values) {
        buttons += `<button onclick="filterSameValue('` + key + `','` + a + `');" class="button is-black">` + (a === true ? "Yes" : "No") + `</button>`;
    }
    c.innerHTML = getHeaderText(question) + buttons;
}

function showIntContent(question, key) {
    let buttons = `<button onclick="nextQuestion();" class="button is-black">Ignore</button>`;
    let values = getAllValues(key);
    if(values.length == 1) { // all AC have sames values
        nextQuestion();
        return;
    }
    values.sort((a, b) => a - b);
    for(let a of values) {
        buttons += `<button onclick="filterIntValue('` + key + `','` + a + `');" class="button is-black">` + a + `</button>`;
    }
    c.innerHTML = getHeaderText(question) + buttons;
}

function showEqualsContent(question, key) {
    let buttons = `<button onclick="nextQuestion();" class="button is-black">Ignore</button>`;
    let values = getAllValues(key);
    if(values.length == 1) { // all AC have sames values
        nextQuestion();
        return;
    }
    values.sort();
    for(let a of values) {
         buttons += `<button onclick="filterSameValue('` + key + `','` + a + `');" class="button is-black">` + a + `</button>`;
    }
    c.innerHTML = getHeaderText(question) + buttons;
}

function showArrayContent(question, key) {
    let buttons = `<button onclick="nextQuestion();" class="button is-black">Ignore</button>`;
    let values = getAllValues(key);
    if(values.length == 1) { // all AC have sames values
        nextQuestion();
        return;
    }
    for(let a of values) {
        buttons += `<button onclick="filterContainsValue('` + key + `','` + a + `');" class="button is-black">` + a + `</button>`;
    }
    c.innerHTML = getHeaderText(question) + buttons;
}

function start() {
    c = document.getElementById("main");
    nextQuestion();
}

function nextQuestion() {
    if(questions.length == 0 || result.length <= 1) {
        end();
    } else {
        let q = questions.shift();
        q.action(q.question, q.key);
    }
}

function end() {
    console.log(result);
    let names = "";
    for (const ac of result) {
        names += `<a href="` + ac.link +  `" class="button is-black ac-button" style="background-color: ` + ac.color + ` !important;">` + ac.name + `</a>`;
    }
    c.innerHTML = `<h2 class="title is-2" style="color:white;">Founded AC:</h2>` + names;
}