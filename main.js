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