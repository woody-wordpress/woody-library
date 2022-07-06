const LangSwitcherDropdownTrigger = document.querySelectorAll(".lang_switcher-dropdown-trigger");

LangSwitcherDropdownTrigger.forEach((trigger) => {
    trigger.onclick = function () {
        this.classList.toggle("is-open");
        let content = this.nextElementSibling;
        content.classList.toggle("is-open");

        if (content.style.maxHeight && content.style.maxHeight != '0px') {
        //this is if the accordion is open
        content.style.maxHeight = '0px';
        } else {
        //if the accordion is currently closed
        content.style.maxHeight = content.scrollHeight + "px";
        }
    };
});
