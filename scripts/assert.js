function assert(value, desc) {
    var results = document.querySelector("#results");
    if (!results) {
        resultsList = document.createElement('ul');
        document.getElementsByTagName('body')[0].appendChild(resultsList);
        resultsList.setAttribute('id', 'results');
    }

    var li = document.createElement("li");
    li.className = value ? "pass" : "fail";
    li.appendChild(document.createTextNode(desc));
    resultsList.appendChild(li);
}