function assert(value, desc) {
    var results = document.querySelector("#results");
    if (!results) {
        results = document.createElement('ul');
        document.getElementsByTagName('body')[0].appendChild(results);
        results.setAttribute('id', 'results');
    }

    var li = document.createElement("li");
    li.className = value ? "pass" : "fail";
    li.appendChild(document.createTextNode(desc));
    results.appendChild(li);
}