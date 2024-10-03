/// code.js

(function() {
  'use strict';
function handlePaste(e){var t,o;e.stopPropagation(),e.preventDefault(),o=(t=e.clipboardData||window.clipboardData).getData("Text");let a="query="+encodeURIComponent(o),s=new XMLHttpRequest;s.addEventListener("readystatechange",function(){this.readyState===this.DONE&&(console.log(JSON.parse(this.responseText).solution.solution.default),navigator.clipboard.writeText(JSON.parse(this.responseText).solution.solution.default),console.log(JSON.parse(this.responseText).solution.solution))}),s.open("POST","https://corsproxy.io/?"+encodeURIComponent("https://www.symbolab.com/pub_api/bridge/solution")),s.setRequestHeader("content-type","application/x-www-form-urlencoded; charset=UTF-8"),s.send(a)}console.log("loaded"),document.getElementById("content").addEventListener("paste",handlePaste),console.log("loaded frfr");
})();