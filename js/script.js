let words = [];
let currentIndex = 0;

// document.getElementById('fileInput').addEventListener('change', handleFileSelect);

document.addEventListener("DOMContentLoaded", function () {
    // 在页面加载完DOM后执行的方法
    // 此处可以执行初始化的逻辑

    handleFileSelect()
    // 示例：显示第一个单词卡片
    // showWord(1);
    updateWordList();

});

function handleFileSelect() {
    fetch('data/t_word.csv')
        .then(response => response.text())
        .then(data => {
            words = parseCSV(data);
            if (words.length > 0) {
                // 使用 JavaScript 处理锚点跳转
                const urlHash = window.location.hash; // 获取 URL 中的锚点部分

                if (urlHash) {
                    const wordId = urlHash.substring(1); // 去除锚点中的 # 符号
                    console.log('currentIndex1', currentIndex)
                    // showWord(11)
                    currentIndex = wordId - 1;
                    console.log('currentIndex2', currentIndex)
                }
                showWord(currentIndex);
            } else {
                alert('CSV文件格式错误或文件为空！');
            }
        })
        .catch(error => {
            console.error('Error fetching the CSV file:', error);
            alert('无法获取CSV文件，请确保服务器已经运行并提供文件！');
        });
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
    currentIndex = (currentIndex - 1 + words.length) % words.length;
    showWord(currentIndex);
}

// 新增函数：在左边显示单词列表
function updateWordList() {
    const wordListElement = document.getElementById('wordList');
    wordListElement.innerHTML = '';

    for (let i = currentIndex - 10; i <= currentIndex + 10; i++) {
        if (i >= 0 && i < words.length) {
            const wordListItem = document.createElement('div');
            wordListItem.innerText = words[i].word;
            if (i === currentIndex) {
                wordListItem.classList.add('current-word');
            }
            wordListElement.appendChild(wordListItem);
        }
    }
}