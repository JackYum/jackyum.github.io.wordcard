let words = [ /* 这里存放所有单词的数组 */];
let displayedWordCount = 0; // 记录已经显示的单词数量

function handleFileSelect() {
    fetch('data/t_word.csv')
        .then(response => response.text())
        .then(data => {
            words = parseCSV(data);
            console.log('2-----', words.length)
            if (words.length > 0) {
                currentIndex = 0;
                initLazyLoad(); // 在请求完成后生成单词列表
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
            parsedWords.push({id, word, pronunciation, translation: cleanTranslation});
        }
    }
    return parsedWords;
}


const wordListElement = document.getElementById('wordList');

function handleLazyLoad() {
    const visibleAreaHeight = window.innerHeight; // 可视区域的高度
    const scrollY = window.scrollY || window.pageYOffset; // 滚动距离
    const totalHeight = wordListElement.clientHeight; // 列表总高度

    if (scrollY + visibleAreaHeight >= totalHeight - 200) {
        // 当滚动到列表底部时，加载更多单词数据
        const itemsPerPage = 20; // 每次加载的单词数量
        const endIndex = Math.min(displayedWordCount + itemsPerPage, words.length);

        for (let i = displayedWordCount; i < endIndex; i++) {
            const listItem = document.createElement('tr');
            const idCell = document.createElement('td');
            const wordCell = document.createElement('td');
            const translationCell = document.createElement('td');
            const link = document.createElement('a');
            link.innerText = words[i].word;
            link.href = `index.html#${words[i].id}`;
            idCell.innerText = words[i].id;
            wordCell.appendChild(link);
            translationCell.innerText = words[i].translation;
            listItem.appendChild(idCell);
            listItem.appendChild(wordCell);
            listItem.appendChild(translationCell);
            wordListElement.appendChild(listItem);
        }

        displayedWordCount = endIndex;
    }
}

function initLazyLoad() {
    handleLazyLoad(); // 首次加载可见区域内的单词数据

    // 监听滚动事件，当用户滚动时触发懒加载
    window.addEventListener('scroll', handleLazyLoad);
}

// 示例：初始化懒加载
// initLazyLoad();
handleFileSelect();