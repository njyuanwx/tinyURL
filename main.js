var inputContent;

function doTransformation() {
    inputContent = document.getElementsByName('inputText')[0].value;
    if (inputContent == "") {
        alert("Please fill in valid URL. ");
        return;
    }
    alert("SEE! Magic! ");
    document.getElementsByName('outputText')[0].value = inputContent + "!!!";
}