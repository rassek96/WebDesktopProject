function Calc(container) {
    var calcDiv = document.importNode(document.querySelector("#calcTemplate").content.firstElementChild, true);
    container.appendChild(calcDiv);
    var resultBox = container.querySelector(".result");
    var resultBoxValue = "";
    var number1 = "";

    // Lyssnar efter ett knapptryck
    container.querySelector(".calcButtonsNumbers").addEventListener("click", function(event) {
        var buttonClicked = event.target;
        var buttonValue = buttonClicked.getAttribute("value");
        resultBoxValue = resultBox.getAttribute("value");

        if (buttonValue === "Clear") {
            number1 = "";
            resultBox.setAttribute("value", number1);
        }
        else if (buttonValue === "Ans") {
            number1 += container.querySelector(".calcAns").getAttribute("name");
            resultBox.setAttribute("value", number1);
        }
        else if (buttonValue === "=") {
            container.querySelector(".calcProblem").textContent = number1 + " =";
            number1 = eval(number1);
            container.querySelector(".calcAns").setAttribute("name", number1);
            resultBox.setAttribute("value", number1);
            number1 = "";
        }
        else {
            number1 += buttonValue;
            resultBox.setAttribute("value", number1);
        }
    });
}

module.exports = Calc;
