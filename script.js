document.addEventListener("DOMContentLoaded", () => {
    const targetWord = "ミルクちゃん";

    const button = document.getElementById("button");
    const output = document.getElementById("output");
    const counter = document.getElementById("counter");
    const countmsg = document.getElementById("countmsg");

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
