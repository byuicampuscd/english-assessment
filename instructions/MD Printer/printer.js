(function () {
    try{
    var o = document.getElementsByTagName("body")[0].innerHTML;
    var a = document.getElementsByClassName("markdown-body")[0].innerHTML;
    document.getElementsByTagName("body")[0].innerHTML = "<article class='markdown-body'>" + a + "</article>";
    window.setTimeout(function () {
        window.print();
        document.getElementsByTagName("body")[0].innerHTML = o;
    }, 50);
    }catch(e){
        alert("I cannot find any content to download!");
    }
}());