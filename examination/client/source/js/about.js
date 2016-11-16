function About(container) {
    var aboutTemplate = document.querySelector("#aboutTemplate");
    var aboutDiv = document.importNode(aboutTemplate.content.firstElementChild, true);
    container.appendChild(aboutDiv);
}

module.exports = About;
