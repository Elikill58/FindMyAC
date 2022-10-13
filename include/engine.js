
let anticheats = [];
let result = [...anticheats];

fetch("include/config.json").then(resp => {
    resp.json().then(json => {
        anticheats = json;
        result = [...json];
    })
});

function getAllValues(key) {
    let val = [];
    for(let ac of result) {
        if(val.indexOf(ac[key]) == -1) {
            val.push(ac[key]);
        }
    }
    val.sort();
    return val;
}

// load questions

function showPriceQuestion() {
    return showIntContent("Which price ?", "price");
}

function showGhostQuestion() {
    return showBooleanContent("Ghost checks ?", "ghost");
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

let questions = [];

questions.push({ show: showPriceQuestion });
questions.push({ show: showGhostQuestion });

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
    for(let a of values) {
        if(a == 0 && key == "price")
            buttons += `<button onclick="filterSameValue('price','0');" class="button is-black">Free</button>`;
        else
            buttons += `<button onclick="filterIntValue('` + key + `','` + a + `');" class="button is-black">` + a + `</button>`;
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
        q.show();
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