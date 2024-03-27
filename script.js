document.addEventListener("DOMContentLoaded", () => {
    const getDefault = (value, defaultValue) => (value == null || value == "") ? defaultValue : value;

    const params = new URLSearchParams(location.search);
    const targetWord = getDefault(params.get("word"), "ミルクちゃん");
    const  displayTitle = getDefault(params.get("title"), getDefault(params.get("word"), "ミルクちゃんチャレンジ"));

    const title = document.getElementById("title");
    const button = document.getElementById("button");
    const buttonTransition = document.getElementById("button-transition");
    const panel = document.getElementById("transition-panel");
    const output = document.getElementById("output");
    const inputTitle = document.getElementById("input-title");
    const inputWord = document.getElementById("input-word");
    const buttonLoad = document.getElementById("button-load");
    const counter = document.getElementById("counter");
    const countmsg = document.getElementById("countmsg");

    const trustedOrigin = "*";
    let loadTimer;

    title.textContent = displayTitle;
    panel.style.display = "none";

    window.addEventListener("message", (ev) => {
        if (ev.origin != trustedOrigin) return;
        switch (ev.data.cmd) {
            case "ack":
                if (loadTimer != null) {
                    clearTimeout(loadTimer);
                    loadTimer = null;
                }
                break;
            default:
                break;
        }
    })

    buttonTransition.addEventListener("click", () => {
        panel.style.display = (panel.style.display == "block")
        ? "none"
        : "block";
    });

    buttonLoad.addEventListener("click", () => {
        const url = new URL(location.href);
        url.searchParams.set("title", inputTitle.value);
        url.searchParams.set("word", inputWord.value);
        window.parent.postMessage({cmd: "location", data: url.href}, trustedOrigin);
        loadTimer = setTimeout(() => {
            location.replace(url);
        }, 10);
    });

    button.addEventListener("click", () => {
        const worker = new Worker("worker.js");
        worker.addEventListener("message", (ev) => {
            switch (ev.data.cmd) {
                case "wo":
                    output.innerText += `${ev.data.data}\n`;
                    break;
                case "wc":
                    counter.textContent = ev.data.data;
                    break;
                case "c":
                    output.textContent = "";
                    counter.textContent = "";
                    break;
                case "s":
                    button.disabled = true;
                    countmsg.textContent = "生成中";
                    break;
                case "e":
                    button.disabled = false;
                    countmsg.textContent = "で完成しました";
                    break;
                default:
                    break;
            }
        }, false);
        worker.postMessage({cmd: "g", data: targetWord});
    });
});
