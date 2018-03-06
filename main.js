var inputContent;
var outputContent;

function doTransformation() {
    inputContent = document.getElementsByName('inputText')[0].value;
    // Checks if the content in the input textbox is empty. If so, return an error message.
    if (inputContent == "") {
        alert("Please fill in a valid URL. ");
        return;
    }

    // Does transformation on input text. (TODO)
    outputContent = inputContent + "!!!";

    // Prints the output URL.
    document.getElementsByName('outputText')[0].value = outputContent;
    alert("Your shortened URL is generated.");
}

function doCustomization() {
    inputContent = document.getElementsByName('inputText')[0].value;
    // Checks if the content in the input textbox is empty. If so, return an error message.
    if (inputContent == "") {
        alert("Please fill in a valid URL. ");
        return;
    }

    outputContent = document.getElementsByName('outputText')[0].value;
    // Checks if the content in the output textbox is empty. If so, return an error message.
    if (outputContent == "") {
        alert("Please fill in a valid customized URL. ");
        return;
    }
    // Checks whether this customized URL has been used. (TODO)

    // Prints the output URL.
    document.getElementsByName('outputText')[0].value = outputContent;
    alert("Your customized URL is confirmed.")
}

function updateTopClickTable() {
    // Finds top 5 clicked URL. (TODO)

    // Updates the content in the table. (TODO)
    // Now just hard coded.
    document.getElementById("topClickTable").rows[1].cells[0].innerHTML = "https://shortenedURL.com/test1";
    document.getElementById("topClickTable").rows[1].cells[1].innerHTML = "10000";
    document.getElementById("topClickTable").rows[2].cells[0].innerHTML = "https://shortenedURL.com/test2";
    document.getElementById("topClickTable").rows[2].cells[1].innerHTML = "1000";
    document.getElementById("topClickTable").rows[3].cells[0].innerHTML = "https://shortenedURL.com/test3";
    document.getElementById("topClickTable").rows[3].cells[1].innerHTML = "100";
    document.getElementById("topClickTable").rows[4].cells[0].innerHTML = "https://shortenedURL.com/test4";
    document.getElementById("topClickTable").rows[4].cells[1].innerHTML = "10";
    document.getElementById("topClickTable").rows[5].cells[0].innerHTML = "https://shortenedURL.com/test5";
    document.getElementById("topClickTable").rows[5].cells[1].innerHTML = "1";
}