var Memory = require("./memory");
var Chat = require("./chat");
var Calc = require("./calc");
var About = require("./about");
require("./dragAndDrop");

var desktop = document.querySelector("#desktop");
var memoryApp = document.querySelector("#memory");
var chatApp = document.querySelector("#chat");
var calcApp = document.querySelector("#calc");
var aboutApp = document.querySelector("#about");
var windowTemplate = document.querySelectorAll("#windowTemplate")[0].content.firstElementChild;
var logoTemplate = document.querySelector("#logoTemplate").content.firstElementChild;

function openApp() {
    var windowDiv = document.importNode(windowTemplate, true);
    desktop.appendChild(windowDiv);
    var allWindows = document.querySelectorAll(".window");
    var latestWindow = allWindows[allWindows.length - 1];
    latestWindow.querySelector(".timer").textContent = "";

    var windowClose = latestWindow.querySelector(".windowClose");
    windowClose.addEventListener("click", function() {
        desktop.removeChild(windowDiv);
    });

    return latestWindow;
}

memoryApp.addEventListener("click", function() {
    var latestWindow = openApp();
    var logoDiv = document.importNode(logoTemplate, true);
    latestWindow.querySelector(".windowTaskbar").appendChild(document.createTextNode("Memory"));
    new Memory(4, 4, "contentDiv", latestWindow);
    latestWindow.querySelector(".logoDiv").appendChild(logoDiv.querySelector(".memoryLogo"));
});

chatApp.addEventListener("click", function() {
    var latestWindow = openApp();
    var logoDiv = document.importNode(logoTemplate, true);
    new Chat(latestWindow.querySelector(".contentDiv"));
    latestWindow.querySelector(".logoDiv").appendChild(logoDiv.querySelector(".chatLogo"));
    latestWindow.querySelector(".windowTaskbar").appendChild(document.createTextNode("Chat"));
});

calcApp.addEventListener("click", function() {
    var latestWindow = openApp();
    var logoDiv = document.importNode(logoTemplate, true);
    new Calc(latestWindow.querySelector(".contentDiv"));
    latestWindow.querySelector(".logoDiv").appendChild(logoDiv.querySelector(".calcLogo"));
    latestWindow.querySelector(".windowTaskbar").appendChild(document.createTextNode("Calculator"));
});

aboutApp.addEventListener("click", function() {
    var latestWindow = openApp();
    var logoDiv = document.importNode(logoTemplate, true);
    new About(latestWindow.querySelector(".contentDiv"));
    latestWindow.querySelector(".logoDiv").appendChild(logoDiv.querySelector(".aboutLogo"));
    latestWindow.querySelector(".windowTaskbar").appendChild(document.createTextNode("About"));
});
