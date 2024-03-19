const getRandomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

self.addEventListener("message", (ev) => {
    switch (ev.data.cmd) {
        case "g": {
            self.postMessage({cmd: "s", data: ""});
            const targetWord = ev.data.data;
            self.postMessage({cmd: "c", data: ""});
            let count = 0;
            let lastGenerated = "";
            do {
                count++;
                lastGenerated = "";
                const wordArray = targetWord.split("");
                while (wordArray.length > 0) {
                    const index = getRandomInt(0, wordArray.length - 1);
                    const one = wordArray[index];
                    wordArray.splice(index, 1);
                    lastGenerated += one;
                    //debugger;
                }
                self.postMessage({cmd: "wo", data: `${count.toString()}: ${lastGenerated}`});
                self.postMessage({cmd: "wc", data: count.toString()});
            } while (lastGenerated != targetWord);
            self.postMessage({cmd: "e", data: ""});
            break;
        }
        default:
            break;
    }
}, false);
