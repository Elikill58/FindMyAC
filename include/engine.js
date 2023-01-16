let anticheats, result;

(async () => {
    anticheats = await (await fetch("config.json")).json();
    result = [...anticheats];
    document.getElementById("ac-amount").innerHTML = anticheats.length;
})();

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
let questions = [
    { question: "Which platform are you mainly using ?", key: "platforms", action: showArrayContent },
    { question: "What is your budget ?", key: "price", action: showEqualsContent },
    { question: "What is the type of your server ?", key: "server_type", action: showEqualsContent },
    { question: "Which minecraft version are you using ?", key: "minecraft_version", action: showArrayContent },
    { question: "Which plugin have you installed, or agree with requiring them ?", key: "plugin_required", action: showEqualsContent },
    { question: "Which bedrock (geyser) support do you require ?", key: "bedrock", action: showEqualsContent }
];

// load engine
let content;

function getHeaderText(question) {
    const h2 = document.createElement("h2");
    h2.innerHTML = question;
    h2.classList.add("title");
    h2.classList.add("is-2");
    return h2;
}

function getIgnoreButton() {
    const button = document.createElement("button");
    button.innerHTML = "Ignore";
    button.classList.add("button");
    button.classList.add("midnight");
    button.onclick = nextQuestion;
    return button;
}

function showBooleanContent(key) {
    let values = getAllValues(key);
    if(values.length == 1) { // all AC have sames values
        nextQuestion();
        return;
    }
    for(let a of values) {
        const button = document.createElement("button");
        button.innerHTML = a === true ? "Yes" : "No";
        button.onclick = (ev) => filterSameValue(key, a);
        button.classList.add("button");
        content.appendChild(button);
    }
}

function showIntContent(key) {
    let values = getAllValues(key);
    if(values.length == 1) { // all AC have sames values
        nextQuestion();
        return;
    }
    values.sort((a, b) => a - b);
    for(let a of values) {
        const button = document.createElement("button");
        button.innerHTML = a === true ? "Yes" : "No";
        button.onclick = (ev) => filterIntValue(key, a);
        button.classList.add("button");
        content.appendChild(button);
    }
}

function showEqualsContent(key) {
    let values = getAllValues(key);
    if(values.length == 1) { // all AC have sames values
        nextQuestion();
        return;
    }
    values.sort();
    for(let a of values) {
        const button = document.createElement("button");
        button.innerHTML = a;
        button.onclick = (ev) => filterSameValue(key, a);
        button.classList.add("button");
        content.appendChild(button);
    }
}

function showArrayContent(key) {
    let values = getAllValues(key);
    if(values.length == 1) { // all AC have sames values
        nextQuestion();
        return;
    }
    for(let a of values) {
        const button = document.createElement("button");
        button.innerHTML = a;
        button.onclick = (ev) => filterContainsValue(key, a);
        button.classList.add("button");
        content.appendChild(button);
    }
}

function start() {
    content = document.getElementById("main");
    document.getElementById("stop").style.display = null;
    nextQuestion();
}

function nextQuestion() {
    if(questions.length == 0 || result.length <= 1) {
        end();
    } else {
        let q = questions.shift();

        while(content.firstChild && content.removeChild(content.firstChild)); // clear old
        content.appendChild(getHeaderText(q.question));
        content.appendChild(getIgnoreButton());

        q.action(q.key);
    }
}

function end() {
    document.getElementById("stop").style.display = "none";
    if(result.length == 0) {
        const h2 = document.createElement("h2");
        h2.innerHTML = "Nothing found. Maybe your critera are too specific.";
        h2.classList.add("title");
        h2.classList.add("is-2");
        content.appendChild(h2);
        return;
    }
    result.sort((a, b) => ('' + a.name).localeCompare(b.name));
    console.log(result);
    let html = `<h2 class="title is-2">Anticheat Found:</h2>
        <table style="margin: auto;">
        <tr>
            <th>Name</th>
            <th>Price</th>
            <th>Server Type</th>
            <th>MC Version</th>
            <th class="mobile-only">Require</th>
            <th class="mobile-only">Bedrock</th>
            <th>Link</th>
        </tr>`;
    for (const ac of result) {
        html += `<tr>
            <td><span style="background-color: ` + ac.color + ` !important; padding: 4px; border-radius: 3px;">` + ac.name + `</span></td>
            <td>` + ac.price_exact + `</td>
            <td>` + ac.server_type + `</td>
            <td>` + ac.minecraft_version_exact + `</td>
            <td class="mobile-only">` + ac.plugin_required + `</td>
            <td class="mobile-only">` + ac.bedrock + `</td>
            <td><a href="` + ac.link +  `" class="button ac-button">Link</a></td>
        </tr>`;
    }
    html += `</table><br><button onclick="location.reload()" class="button" style="background-color: initial !important;">Restart</button><br><small>Don't agree with this ? Ask for changes on <a href="https://discord.gg/YKbqtA6TAv">discord</a>.</small>`;
    content.innerHTML = html;
}
