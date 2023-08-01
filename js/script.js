let total_words = [];
let kiled_words = [];

let today_learning_words = [];
let today_review_words = [];
let today_learning_and_review_words = [];

let currentIndex = 0;
let learn_count = 10;

// 获取当前日期
const now = new Date();

// 指定日期
const targetDate = new Date('2023-08-01');

// 计算时间差,并转化为天数
const diffTime = now - targetDate;
const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));


let day_number = diffDays
console.log('day_number',day_number);
// document.getElementById('fileInput').addEventListener('change', handleFileSelect);

document.addEventListener("DOMContentLoaded", function () {
    // 在页面加载完DOM后执行的方法
    // 此处可以执行初始化的逻辑

    handleFileSelect()
    // 示例：显示第一个单词卡片
    // showWord(1);
    // updateWordList();

});

// 定义一个函数，用于判断一个单词是否在 sub_word 中

// 定义一个函数，用于判断一个单词是否在 sub_word 中
function isInKilledWord(word) {
    return kiled_words.some((subWord) => subWord.word === word.word);
}

// 获取当前时间要学习的单词
// 所有单词 - 已斩词，按顺序抽取120个，即为今日要学习的单词
// getTodayWords
function handleFileSelect() {
    fetch('data/t_word.csv')
        .then(response => response.text())
        .then(data => {
            // 所有单词
            total_words = parseCSV(data);
            console.log('total_words', total_words);

            if (total_words.length > 0) {
                // 已斩词
                fetch('data/killed_words/jack_ren.csv')
                    .then(response => response.text())
                    .then(data => {
                        kiled_words = parseCSV(data);
                        console.log('kiled_words', kiled_words);

                        // 今日要学习的词

                        today_learning_words = getWordsToStudy(total_words, kiled_words, day_number)
                        console.log('today_learning_words', today_learning_words);

                        // 今日要复习的单词
                        // 抽象一个函数：获取第 n 天要学习的单词
                        // in：所有单词，已斩词，第几天，out: 今天要学的单词

                        const daysToSubtract = [1, 2, 4, 7, 15, 30];
                        for (const days of daysToSubtract) {
                            if (day_number > days) {
                                console.log('push:', days)
                                const wordsToStudy = getWordsToStudy(total_words, kiled_words, day_number - days);
                                // 使用了扩展运算符...来将获取的单词数组展开并添加到today_learning_words中。这样，我们避免了重复代码，并且将多个查询合并为一个数组。
                                today_review_words.push(...wordsToStudy)
                                // today_learning_and_review_words.push(...wordsToStudy);
                            }
                        }
                        console.log('today_review_words', today_review_words);

                        today_learning_and_review_words.push(...today_learning_words)
                        today_learning_and_review_words.push(...today_review_words)

                        if (today_learning_and_review_words.length > 0) {
                            showWord(0)
                        }


                    })
                    .catch(error => {
                        console.error('Error fetching the CSV file:', error);
                        alert('无法获取CSV文件，请确保服务器已经运行并提供文件！');
                    });
                // showWord(currentIndex);
            } else {
                alert('CSV文件格式错误或文件为空！');
            }
        })
        .catch(error => {
            console.error('Error fetching the CSV file:', error);
            alert('无法获取CSV文件，请确保服务器已经运行并提供文件！');
        });
}

function getWordsToStudy(allWords, killedWords, dayNumber) {
    // 过滤出未学习的单词
    const notLearnedWords = allWords.filter((word) => !isInKilledWord(word));

    // 计算今天要学习的单词数
    const wordsPerDay = Math.ceil(notLearnedWords.length / dayNumber);

    // 获取今天要学习的单词
    const wordsToStudyToday = notLearnedWords.slice((dayNumber - 1) * learn_count, dayNumber * learn_count);

    return wordsToStudyToday;
}

// 获取往日要复习的单词 1, 2, 4, 15, 30


// function handleFileSelect() {
//     fetch('data/t_word.csv')
//         .then(response => response.text())
//         .then(data => {
//             words = parseCSV(data);
//             if (words.length > 0) {
//                 // 使用 JavaScript 处理锚点跳转
//                 const urlHash = window.location.hash; // 获取 URL 中的锚点部分
//
//                 if (urlHash) {
//                     const wordId = urlHash.substring(1); // 去除锚点中的 # 符号
//                     console.log('currentIndex1', currentIndex)
//                     // showWord(11)
//                     currentIndex = wordId - 1;
//                     console.log('currentIndex2', currentIndex)
//                 }
//                 showWord(currentIndex);
//             } else {
//                 alert('CSV文件格式错误或文件为空！');
//             }
//         })
//         .catch(error => {
//             console.error('Error fetching the CSV file:', error);
//             alert('无法获取CSV文件，请确保服务器已经运行并提供文件！');
//         });
// }

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


function showWord(index) {
    // 获取单词的文本和链接元素
    const wordElement = document.getElementById('word');
    const wordLinkElement = document.getElementById('wordLink');
    // 设置 Word 链接的文本和目标链接
    wordLinkElement.innerText = today_learning_and_review_words[index].word;
    wordLinkElement.href = `https://m.youdao.com/result?lang=en&word=${encodeURIComponent(today_learning_and_review_words[index].word)}`;

    let new_learned = currentIndex > today_learning_words.length ? today_learning_words.length : currentIndex
    let total_learned = kiled_words.length + (day_number - 1) * learn_count + new_learned
    let review_learned = currentIndex - today_learning_words.length < 0 ? 0 : currentIndex - today_learning_words.length

    document.getElementById('totalWords').innerText = '总单词量：' + total_learned + '/' + total_words.length + '，新学：' + new_learned + '/' + today_learning_words.length + '，复习：' + review_learned + '/' + today_review_words.length;
    document.getElementById('id').innerText = today_learning_and_review_words[index].id;
    // document.getElementById('word').innerText = today_learning_and_review_words[index].word;
    document.getElementById('pronunciation').innerText = today_learning_and_review_words[index].pronunciation;
    document.getElementById('translation').innerText = today_learning_and_review_words[index].translation;
}

function showNextWord() {
    currentIndex = currentIndex + 1;
    if (currentIndex >= today_learning_and_review_words.length) {
        alert("已经是最后一个了！")
        currentIndex = currentIndex - 1;
    }
    showWord(currentIndex);
}

function showLastWord() {
    currentIndex = currentIndex - 1;
    if (currentIndex < 0) {
        alert("已经是第一个了！")
        currentIndex = 0;
    }
    showWord(currentIndex);
}

// 新增函数：在左边显示单词列表
// function updateWordList() {
//     const wordListElement = document.getElementById('wordList');
//     wordListElement.innerHTML = '';
//
//     for (let i = currentIndex - 10; i <= currentIndex + 10; i++) {
//         if (i >= 0 && i < words.length) {
//             const wordListItem = document.createElement('div');
//             wordListItem.innerText = words[i].word;
//             if (i === currentIndex) {
//                 wordListItem.classList.add('current-word');
//             }
//             wordListElement.appendChild(wordListItem);
//         }
//     }
// }

// 跳转到指定编号的单词
function jumpToWord() {
    const totalWordCount = today_learning_and_review_words.length;
    const jumpInput = document.getElementById('jumpInput');
    const targetWordIndex = parseInt(jumpInput.value) - 1; // 用户输入的编号从1开始，数组索引从0开始，所以需要减1

    console.log('targetWordIndex', targetWordIndex);
    console.log('totalWordCount', totalWordCount);
    if (Number.isNaN(targetWordIndex) || targetWordIndex < 0 || targetWordIndex >= totalWordCount) {
        console.log('targetWordIndex', targetWordIndex);
        alert('无效的单词编号，请输入有效的编号！');
    } else {
        currentIndex = targetWordIndex;
        showWord(currentIndex);
    }

    // 清空输入框
    jumpInput.value = '';
}