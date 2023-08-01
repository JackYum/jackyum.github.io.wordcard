let words = [];
let currentIndex = 0;

document.getElementById('fileInput').addEventListener('change', handleFileSelect);

function handleFileSelect(event) {
    const file = event.target.files[0];
    if (!file) {
        alert('请选择CSV文件！');
        return;
    }

    const reader = new FileReader();
    reader.onload = function (e) {
        const contents = e.target.result;
        words = parseCSV(contents);
        if (words.length > 0) {
            currentIndex = 0;
            showWord(currentIndex);
        } else {
            alert('CSV文件格式错误或文件为空！');
        }
    };
    reader.readAsText(file);
}

function parseCSVOld(csvContent) {
    const lines = csvContent.split(/\r?\n/);
    const parsedWords = [];
    for (const line of lines) {
        // id	word	认识与否	pronounce	chinese
        const [id, word, know, pronunciation, translation] = line.split(',');
        if (word) {
            parsedWords.push({id, word, pronunciation, translation});
        }
    }
    return parsedWords;
}
function parseCSV(csvContent) {
    const lines = csvContent.split(/\r?\n/);
    const parsedWords = [];
    for (const line of lines) {
        // id	word	认识与否	pronounce	chinese
        const [id, word, pronunciation, translation] = line.split(',');
        if (word && translation) {
            // Remove surrounding quotes from the translation field if present
            const cleanTranslation = translation.replace(/^"(.*)"$/, '$1');
            parsedWords.push({ id, word, pronunciation, translation: cleanTranslation });
        }
    }
    return parsedWords;
}


function showWord(index) {
    document.getElementById('id').innerText = words[index].id;
    document.getElementById('word').innerText = words[index].word;
    document.getElementById('pronunciation').innerText = words[index].pronunciation;
    document.getElementById('translation').innerText = words[index].translation;
}

function showNextWord() {
    currentIndex = (currentIndex + 1) % words.length;
    // console.log(currentIndex)
    showWord(currentIndex);
}

function showLastWord() {
    currentIndex = (currentIndex - 1) % words.length;
    showWord(currentIndex);
}