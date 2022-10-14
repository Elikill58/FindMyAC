
let anticheats = [];
let result = [...anticheats];

fetch("config.json").then(resp => {
    resp.json().then(json => {
        anticheats = json;
        result = [...json];
        document.getElementById("ac-amount").innerHTML = anticheats.length;
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
questions.push({ question: "Which plugin have you installed, or agree with requiring them ?", key: "plugin_required", action: showEqualsContent });
questions.push({ question: "Which bedrock (geyser) support do you require ?", key: "bedrock", action: showEqualsContent });

// load engine
let c;

function getHeaderText(question) {
    return `<h2 class="title is-2">` + question + `</h2>`;
}

function showBooleanContent(question, key) {
    let buttons = `<button onclick="nextQuestion();" class="button">Ignore</button>`;
    let values = getAllValues(key);
    if(values.length == 1) { // all AC have sames values
        nextQuestion();
        return;
    }
    for(let a of values) {
        buttons += `<button onclick="filterSameValue('` + key + `','` + a + `');" class="button">` + (a === true ? "Yes" : "No") + `</button>`;
    }
    c.innerHTML = getHeaderText(question) + buttons;
}

function showIntContent(question, key) {
    let buttons = `<button onclick="nextQuestion();" class="button">Ignore</button>`;
    let values = getAllValues(key);
    if(values.length == 1) { // all AC have sames values
        nextQuestion();
        return;
    }
    values.sort((a, b) => a - b);
    for(let a of values) {
        buttons += `<button onclick="filterIntValue('` + key + `','` + a + `');" class="button">` + a + `</button>`;
    }
    c.innerHTML = getHeaderText(question) + buttons;
}

function showEqualsContent(question, key) {
    let buttons = `<button onclick="nextQuestion();" class="button">Ignore</button>`;
    let values = getAllValues(key);
    if(values.length == 1) { // all AC have sames values
        nextQuestion();
        return;
    }
    values.sort();
    for(let a of values) {
         buttons += `<button onclick="filterSameValue('` + key + `','` + a + `');" class="button">` + a + `</button>`;
    }
    c.innerHTML = getHeaderText(question) + buttons;
}

function showArrayContent(question, key) {
    let buttons = `<button onclick="nextQuestion();" class="button">Ignore</button>`;
    let values = getAllValues(key);
    if(values.length == 1) { // all AC have sames values
        nextQuestion();
        return;
    }
    for(let a of values) {
        buttons += `<button onclick="filterContainsValue('` + key + `','` + a + `');" class="button">` + a + `</button>`;
    }
    c.innerHTML = getHeaderText(question) + buttons;
}

function start() {
    c = document.getElementById("main");
    document.getElementById("stop").style.display = null;
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
    document.getElementById("stop").style.display = "none";
    if(result.length == 0) {
        c.innerHTML = `<h2 class="title is-2">Nothing found. Maybe your critera are too specific.</h2>`;
        return;
    }
    result.sort((a, b) => ('' + a.name).localeCompare(b.name));
    console.log(result);
    let html = `<h2 class="title is-2">Founded AC:</h2>
        <table style="margin: auto;">
        <tr>
            <th>Name</th>
            <th>Price</th>
            <th>Link</th>
        </tr>`;
    for (const ac of result) {
        html += `<tr>
            <td><span style="background-color: ` + ac.color + ` !important; padding: 4px; border-radius: 3px;">` + ac.name + `</span></td>
            <td>` + ac.price + `</td>
            <td><a href="` + ac.link +  `" class="button ac-button">Link</a></td>
        </tr>`;
        //c.innerHTML += `<tr><td>href="` + ac.link +  `" class="button ac-button" style="background-color: ` + ac.color + ` !important;">` + ac.name + `</a>`;
    }
    html += `</table>`;
    c.innerHTML = html;
}