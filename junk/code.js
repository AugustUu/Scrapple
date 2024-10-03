/// code.js
function handlePaste(e) {
    var clipboardData, pastedData;

    e.stopPropagation();
    e.preventDefault();

    clipboardData = e.clipboardData || window.clipboardData;
    pastedData = clipboardData.getData('Text');

    const data = "query=" + encodeURIComponent(pastedData);

    const xhr = new XMLHttpRequest();
    
    xhr.addEventListener("readystatechange", function () {
      if (this.readyState === this.DONE) {
        console.log(JSON.parse(this.responseText).solution.solution.default);
        navigator.clipboard.writeText(JSON.parse(this.responseText).solution.solution.default);
      }
    });
    
    xhr.open("POST", "https://corsproxy.io/?"+ encodeURIComponent("https://www.symbolab.com/pub_api/bridge/solution"));
    xhr.setRequestHeader("content-type", "application/x-www-form-urlencoded; charset=UTF-8");
    
    xhr.send(data);

}

document.getElementById("content").addEventListener('paste', handlePaste);

