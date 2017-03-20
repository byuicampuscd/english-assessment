/* exported DropDown */
/* global google */
/*
 * The script used to generated the dropdown menus in the sidebar.
 */
(function () {

    /**
     * This creates a dropdown menus within a specified element.
     * @param {Object[]} options - The array of items on the list.
     * @param {string} parent - The id of the element to place the dropdown in.
     * @param {string} id - The id to give the dropdown menu.
     */
    var DropDown = function (options, parent, id) {
        this.options = options;
        this.parent = parent;
        this.id = id;
        var section = document.createElement("div");
        section.className = "si";
        var list = document.createElement("ul");
        document.onclick = function () {
            section.innerHTML = "";
        };

        // nested to keep scope
        function handle(e) {
            var items = list.getElementsByTagName("li");
            var text, a;
            this.selected = 0;
            if (e.key == "ArrowUp") {
                items[this.selected].className = "";
                this.selected--;
                if (this.selected < 0) this.selected = items.length - 1;
                items[this.selected].className = "selected";
            } else if (e.key == "ArrowDown") {
                items[this.selected].className = "";
                this.selected++;
                if (this.selected >= items.length) this.selected = 0;
                items[this.selected].className = "selected";
            } else if (e.key == "Enter") {
                e.preventDefault();

                items[this.selected].className = "";
                textArea.focus();

                var next = items[this.selected].innerText;
                text = e.target.value.split(",");
                text[text.length - 1] = next;
                var fill = "";
                for (a in text) {
                    if (parseInt(a, 10) < text.length - 1)
                        fill += text[a].trim() + ",";
                    else
                        fill += text[a].trim();
                }
                e.target.value = fill;
                section.innerHTML = "";
                this.selected = 0;
            } else {
                this.selected = 0;
                list.innerHTML = "";
                section.innerHTML = "";
                var found = false;
                text = e.target.value.toLowerCase().split(",");
                for (a in text) {
                    list.innerHTML = "";
                    found = false;
                    for (var i in options) {
                        var regex = new RegExp(text[a].trim(), "g");
                        if (options[i].toLowerCase().match(regex) != null) {
                            found = true;
                            var item = document.createElement("li");
                            item.appendChild(document.createTextNode(options[i]));
                            item.onclick = function (ev) {
                                textArea.focus();
                                var next = ev.target.textContent;
                                var fill = "";
                                text[a] = next;
                                for (var b in text) fill += parseInt(b, 10) < text.length - 1 ? text[b].trim().toLowerCase() + ", " : text[b].trim().toLowerCase();
                                e.target.value = fill;
                                list.innerHTML = "";
                                section.innerHTML = "";
                            };
                            //if ((text.indexOf(options[i].toLowerCase())) < 0) {
                            list.appendChild(item);
                            //}
                        }
                    }

                }
                if (!found) {
                    text = document.createTextNode("No items foud!");
                    var p = document.createElement("li");
                    p.className = "err";
                    p.appendChild(text);
                    list.appendChild(p);
                }
                section.appendChild(list);
                document.getElementById(parent).appendChild(section);
            }
        }
        var example_text = "";
        var times = 0;
        for (var i in options) {
            if (example_text.indexOf(options[i]) < 0) {
                example_text += options[i] + ", ";
                times++;
            }
            if (times > 2) break;
        }
        example_text += "etc.";
        var textArea = document.createElement("textarea");
        textArea.id = id;
        textArea.onkeyup = handle;
        textArea.placeholder = example_text;
        document.getElementById(parent).appendChild(textArea);
    };

    //var d = new DropDown(["Dog","Cat","Fish","Turtle"],"target","pets");
    google.script.run.withSuccessHandler(function (data) {
        new DropDown(data, "days", "day");
    }).getDataFromCol(8);
    google.script.run.withSuccessHandler(function (data) {
        new DropDown(data, "coursez", "courses");
    }).getDataFromCol(4);
    google.script.run.withSuccessHandler(function (data) {
        new DropDown(data, "students", "stud");
    }).getDataFromCol(2, true);
    document.getElementById("back").onclick = function () {
        focus();
    };
    for (var i in document.getElementsByTagName("h1")) {
        document.getElementsByTagName("h1")[i].onclick = function () {
            focus();
        };
    }
}());