var inputContent;

function doTransformation() {
    inputContent = document.getElementsByName('inputText')[0].value;
    // Checks if the content in the input textbox is empty. If so, return an error message.
    if (inputContent == "") {
        alert("Please fill in valid URL. ");
        return;
    }
    alert("SEE! Magic! ");
    // Does transformation on input text.
    document.getElementsByName('outputText')[0].value = inputContent + "!!!";
}