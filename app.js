// Full Application Logic & State Management
const appState = {
    student: {
        lastName: '',
        firstName: '',
        className: '',
        startTime: null,
        endTime: null
    },
    currentBlock: 0, // 0: Start/Register, 1..6: Blocks, 7: Report
    score: 0,
    blockScores: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0 },
    blockAnswers: {
        1: {}, // quiz answers
        2: false, // explored tree
        3: {}, // file manager ops
        4: {}, // drag and drop
        5: { q1: '', q2: '', q3: '' },
        6: {} // creative task
    }
};

// Quiz questions array
const quizQuestions = [
    {
        id: 1,
        question: "Який інформаційний процес відбувається, коли ти читаєш підручник з інформатики?",
        options: ["Отримання інформації", "Передавання інформації", "Видалення інформації", "Шифрування"],
        correct: 0,
        icon: "fa-book-open"
    },
    {
        id: 2,
        question: "Однокласник надіслав тобі повідомлення у вайбері. Які процеси відбулися?",
        options: ["Передавання та отримання", "Копіювання та друк", "Шукання та форматування", "Видалення"],
        correct: 0,
        icon: "fa-paper-plane"
    },
    {
        id: 3,
        question: "Збереження фотографії з телефону на флешку — це процес...",
        options: ["Зберігання інформації", "Опрацювання інформації", "Пошук інформації", "Знищення"],
        correct: 0,
        icon: "fa-floppy-disk"
    },
    {
        id: 4,
        question: "Обчислення прикладу з математики у зошиті — це процес...",
        options: ["Опрацювання інформації", "Передавання інформації", "Пошук інформації", "Зберігання"],
        correct: 0,
        icon: "fa-calculator"
    }
];

document.addEventListener('DOMContentLoaded', () => {
    loadSavedState();
    renderApp();
});

function loadSavedState() {
    const saved = localStorage.getItem('info_app_5class_state');
    if (saved) {
        try {
            const parsed = JSON.parse(saved);
            Object.assign(appState, parsed);
        } catch(e) { console.error(e); }
    }
}

function saveState() {
    localStorage.setItem('info_app_5class_state', JSON.stringify(appState));
    updateHeaderBadge();
}

function updateHeaderBadge() {
    const badge = document.getElementById('user-badge');
    const nameDisplay = document.getElementById('student-name-display');
    const classDisplay = document.getElementById('student-class-display');
    const scoreDisplay = document.getElementById('score-display');
    const progressContainer = document.getElementById('progress-bar-container');

    if (appState.student.firstName && appState.currentBlock > 0) {
        badge.classList.remove('hidden');
        nameDisplay.textContent = `${appState.student.firstName} ${appState.student.lastName}`;
        classDisplay.textContent = `Клас: ${appState.student.className}`;
        
        let totalScore = 0;
        Object.values(appState.blockScores).forEach(s => totalScore += s);
        appState.score = Math.min(12, totalScore);
        scoreDisplay.textContent = appState.score.toFixed(1);

        if (appState.currentBlock <= 6) {
            progressContainer.classList.remove('hidden');
            document.getElementById('step-label').textContent = `Блок ${appState.currentBlock} з 6`;
            const pct = Math.round((appState.currentBlock / 6) * 100);
            document.getElementById('step-percent').textContent = `${pct}%`;
            document.getElementById('progress-bar-fill').style.width = `${pct}%`;
        } else {
            progressContainer.classList.add('hidden');
        }
    } else {
        badge.classList.add('hidden');
        progressContainer.classList.add('hidden');
    }
}

function renderApp() {
    const container = document.getElementById('app-container');
    updateHeaderBadge();

    switch(appState.currentBlock) {
        case 0:
            renderRegistration(container);
            break;
        case 1:
            renderBlock1(container);
            break;
        case 2:
            renderBlock2(container);
            break;
        case 3:
            renderBlock3(container);
            break;
        case 4:
            renderBlock4(container);
            break;
        case 5:
            renderBlock5(container);
            break;
        case 6:
            renderBlock6(container);
            break;
        case 7:
            renderReport(container);
            break;
        default:
            renderRegistration(container);
    }
}

// Block 0: Registration
function renderRegistration(container) {
    container.innerHTML = `
        <div class="text-center max-w-xl mx-auto space-y-6">
            <div class="inline-block bg-sky-100 p-4 rounded-full text-sky-600 mb-2">
                <i class="fa-solid fa-rocket text-5xl"></i>
            </div>
            <h2 class="text-3xl font-extrabold text-slate-800">Привіт, молодий досліднику! 👋</h2>
            <p class="text-slate-600 text-lg">
                Ласкаво просимо до інтерактивної практичної роботи з теми 
                <span class="font-bold text-sky-600">«Інформаційні процеси. Файли та папки»</span>!
            </p>

            <form id="reg-form" class="bg-slate-50 p-6 rounded-2xl border border-slate-200 text-left space-y-4 shadow-inner">
                <div>
                    <label class="block text-sm font-bold text-slate-700 mb-1">Прізвище:</label>
                    <input type="text" id="input-lastname" value="${appState.student.lastName}" required
                        placeholder="Наприклад: Іваненко" class="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-sky-500 outline-none">
                </div>
                <div>
                    <label class="block text-sm font-bold text-slate-700 mb-1">Ім'я:</label>
                    <input type="text" id="input-firstname" value="${appState.student.firstName}" required
                        placeholder="Наприклад: Софія" class="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-sky-500 outline-none">
                </div>
                <div>
                    <label class="block text-sm font-bold text-slate-700 mb-1">Клас:</label>
                    <input type="text" id="input-classname" value="${appState.student.className}" required
                        placeholder="Наприклад: 5-А" class="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-sky-500 outline-none">
                </div>

                <button type="submit" id="start-btn" class="w-full py-4 bg-gradient-to-r from-sky-500 to-teal-500 text-white font-bold text-lg rounded-xl shadow-lg hover:opacity-95 transition-all">
                    Розпочати пригоду <i class="fa-solid fa-arrow-right ml-2"></i>
                </button>
            </form>
        </div>
    `;

    document.getElementById('reg-form').addEventListener('submit', (e) => {
        e.preventDefault();
        appState.student.lastName = document.getElementById('input-lastname').value.trim();
        appState.student.firstName = document.getElementById('input-firstname').value.trim();
        appState.student.className = document.getElementById('input-classname').value.trim();
        appState.student.startTime = new Date().toLocaleTimeString();
        appState.currentBlock = 1;
        saveState();
        renderApp();
    });
}

// Block 1: Quiz
function renderBlock1(container) {
    let qHTML = quizQuestions.map((q, idx) => {
        const selected = appState.blockAnswers[1][q.id];
        return `
            <div class="p-5 bg-slate-50 rounded-2xl border border-slate-200 mb-4">
                <div class="flex items-center gap-3 mb-3">
                    <span class="bg-sky-500 text-white font-bold px-3 py-1 rounded-lg text-sm">${idx + 1}</span>
                    <h4 class="font-bold text-slate-800"><i class="fa-solid ${q.icon} text-sky-500 mr-2"></i>${q.question}</h4>
                </div>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
                    ${q.options.map((opt, optIdx) => `
                        <button type="button" onclick="selectQuizOption(${q.id}, ${optIdx})" 
                            class="p-3 text-left rounded-xl border font-medium transition-all ${selected === optIdx ? 'bg-sky-500 text-white border-sky-600 shadow' : 'bg-white hover:bg-sky-50 border-slate-200 text-slate-700'}">
                            ${opt}
                        </button>
                    `).join('')}
                </div>
            </div>
        `;
    }).join('');

    container.innerHTML = `
        <div class="space-y-6">
            <div class="border-b pb-4 flex justify-between items-center">
                <h2 class="text-2xl font-bold text-slate-800"><i class="fa-solid fa-brain text-sky-500 mr-2"></i>Блок 1. Світ інформаційних процесів</h2>
                <span class="text-sm bg-sky-100 text-sky-700 px-3 py-1 rounded-full font-bold">Макс. 2 бали</span>
            </div>
            <p class="text-slate-600">Дай відповіді на запитання про інформацію та інформаційні процеси в нашому житті:</p>
            ${qHTML}
            <div class="flex justify-end gap-3 pt-4 border-t">
                <button onclick="nextBlock(2)" class="px-6 py-3 bg-sky-600 hover:bg-sky-700 text-white font-bold rounded-xl shadow">
                    Далі: Блок 2 <i class="fa-solid fa-chevron-right ml-1"></i>
                </button>
            </div>
        </div>
    `;
}

function selectQuizOption(qId, optIdx) {
    appState.blockAnswers[1][qId] = optIdx;
    
    // Calculate score
    let correctCount = 0;
    quizQuestions.forEach(q => {
        if (appState.blockAnswers[1][q.id] === q.correct) correctCount++;
    });
    appState.blockScores[1] = (correctCount / quizQuestions.length) * 2;
    saveState();
    renderBlock1(document.getElementById('app-container'));
}

// Block 2: Interactive Folder Tree Exploration
function renderBlock2(container) {
    container.innerHTML = `
        <div class="space-y-6">
            <div class="border-b pb-4 flex justify-between items-center">
                <h2 class="text-2xl font-bold text-slate-800"><i class="fa-solid fa-folder-tree text-teal-500 mr-2"></i>Блок 2. Знайомство з файлами та папками</h2>
                <span class="text-sm bg-teal-100 text-teal-700 px-3 py-1 rounded-full font-bold">Макс. 2 бали</span>
            </div>

            <p class="text-slate-600">Досліди інтерактивне дерево папок. Натискай на папки, щоб відкривати або згортати їх:</p>

            <div class="bg-slate-50 p-6 rounded-2xl border border-slate-200 font-mono text-sm">
                <div class="cursor-pointer hover:text-sky-600 font-bold mb-2 text-base flex items-center gap-2" onclick="toggleTree('tree-root')">
                    <i class="fa-solid fa-folder-open text-amber-500"></i> Мої документи
                </div>
                <div id="tree-root" class="ml-6 space-y-2">
                    <div class="cursor-pointer hover:text-sky-600 font-semibold flex items-center gap-2" onclick="toggleTree('tree-school')">
                        <i class="fa-solid fa-folder text-amber-400"></i> Навчання
                    </div>
                    <div id="tree-school" class="ml-6 space-y-1">
                        <div><i class="fa-solid fa-file-lines text-blue-500 mr-2"></i>Інформатика.docx</div>
                        <div><i class="fa-solid fa-file-calculator text-emerald-500 mr-2"></i>Математика.xlsx</div>
                    </div>

                    <div class="cursor-pointer hover:text-sky-600 font-semibold flex items-center gap-2" onclick="toggleTree('tree-media')">
                        <i class="fa-solid fa-folder text-amber-400"></i> Мультимедіа
                    </div>
                    <div id="tree-media" class="ml-6 space-y-1">
                        <div><i class="fa-solid fa-file-image text-purple-500 mr-2"></i>Фото_канікули.jpg</div>
                        <div><i class="fa-solid fa-file-audio text-red-500 mr-2"></i>Пісня.mp3</div>
                    </div>
                </div>
            </div>

            <div class="bg-sky-50 border border-sky-200 p-4 rounded-xl flex items-center gap-3">
                <i class="fa-solid fa-circle-info text-sky-600 text-xl"></i>
                <p class="text-xs text-sky-800">
                    <b>Пам'ятай:</b> Розширення файлу (наприклад, .docx, .jpg) підказує комп'ютеру, за допомогою якої програми відкрити цей файл!
                </p>
            </div>

            <div class="flex justify-between gap-3 pt-4 border-t">
                <button onclick="nextBlock(1)" class="px-5 py-2.5 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold rounded-xl">
                    <i class="fa-solid fa-chevron-left mr-1"></i> Назад
                </button>
                <button onclick="finishBlock2()" class="px-6 py-3 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl shadow">
                    Далі: Блок 3 <i class="fa-solid fa-chevron-right ml-1"></i>
                </button>
            </div>
        </div>
    `;
}

function toggleTree(id) {
    const el = document.getElementById(id);
    if (el) el.classList.toggle('hidden');
}

function finishBlock2() {
    appState.blockScores[2] = 2; // Full score for active exploration
    saveState();
    nextBlock(3);
}

// Block 3: File Manager Simulator
function renderBlock3(container) {
    container.innerHTML = `
        <div class="space-y-6">
            <div class="border-b pb-4 flex justify-between items-center">
                <h2 class="text-2xl font-bold text-slate-800"><i class="fa-solid fa-desktop text-indigo-500 mr-2"></i>Блок 3. Майстерня файлових операцій</h2>
                <span class="text-sm bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full font-bold">Макс. 2 бали</span>
            </div>

            <p class="text-slate-600">Симулятор Провідника. Виконай практичні операції створення та вилучення папок:</p>

            <div class="border border-slate-300 rounded-2xl overflow-hidden bg-white shadow-md">
                <div class="bg-slate-100 p-3 border-b border-slate-300 flex items-center justify-between">
                    <div class="flex items-center gap-2">
                        <button class="px-3 py-1 bg-white rounded border border-slate-300 text-xs font-bold hover:bg-slate-50"><i class="fa-solid fa-arrow-left"></i></button>
                        <span class="text-xs font-bold text-slate-600 bg-white px-3 py-1 rounded border border-slate-300">C:\Комп'ютер\Мої Файли</span>
                    </div>
                    <button onclick="createFolderSim()" class="px-3 py-1 bg-sky-500 text-white rounded text-xs font-bold hover:bg-sky-600">
                        <i class="fa-solid fa-folder-plus mr-1"></i> Створити папку
                    </button>
                </div>
                <div id="sim-file-area" class="p-6 grid grid-cols-2 md:grid-cols-4 gap-4 min-h-[160px]">
                    <div class="p-3 border rounded-xl flex flex-col items-center justify-center bg-amber-50 border-amber-200">
                        <i class="fa-solid fa-folder text-4xl text-amber-400 mb-1"></i>
                        <span class="text-xs font-bold text-slate-700">Документи</span>
                    </div>
                </div>
            </div>

            <div class="flex justify-between gap-3 pt-4 border-t">
                <button onclick="nextBlock(2)" class="px-5 py-2.5 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold rounded-xl">
                    <i class="fa-solid fa-chevron-left mr-1"></i> Назад
                </button>
                <button onclick="finishBlock3()" class="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow">
                    Далі: Блок 4 <i class="fa-solid fa-chevron-right ml-1"></i>
                </button>
            </div>
        </div>
    `;
}

function createFolderSim() {
    const area = document.getElementById('sim-file-area');
    const folderName = prompt("Введіть назву нової папки:", "Нова папка");
    if (folderName) {
        const div = document.createElement('div');
        div.className = "p-3 border rounded-xl flex flex-col items-center justify-center bg-amber-50 border-amber-200";
        div.innerHTML = `<i class="fa-solid fa-folder text-4xl text-amber-400 mb-1"></i><span class="text-xs font-bold text-slate-700">${folderName}</span>`;
        area.appendChild(div);
        appState.blockScores[3] = 2;
        saveState();
    }
}

function finishBlock3() {
    if (!appState.blockScores[3]) appState.blockScores[3] = 1;
    saveState();
    nextBlock(4);
}

// Block 4: Drag & Drop
function renderBlock4(container) {
    container.innerHTML = `
        <div class="space-y-6">
            <div class="border-b pb-4 flex justify-between items-center">
                <h2 class="text-2xl font-bold text-slate-800"><i class="fa-solid fa-[#0284c7] fa-hand text-amber-500 mr-2"></i>Блок 4. Інтерактивне сортування (Drag & Drop)</h2>
                <span class="text-sm bg-amber-100 text-amber-700 px-3 py-1 rounded-full font-bold">Макс. 1 бал</span>
            </div>

            <p class="text-slate-600">Розподіли об'єкти за відповідними категоріями:</p>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div class="p-4 bg-slate-50 border border-slate-200 rounded-2xl min-h-[120px]" id="drop-files">
                    <h4 class="font-bold text-xs uppercase text-slate-500 mb-3"><i class="fa-solid fa-file mr-1"></i> Файли</h4>
                    <div class="flex flex-wrap gap-2" id="box-files"></div>
                </div>

                <div class="p-4 bg-slate-50 border border-slate-200 rounded-2xl min-h-[120px]" id="drop-folders">
                    <h4 class="font-bold text-xs uppercase text-slate-500 mb-3"><i class="fa-solid fa-folder mr-1"></i> Папки</h4>
                    <div class="flex flex-wrap gap-2" id="box-folders"></div>
                </div>
            </div>

            <div class="p-4 bg-amber-50 border border-amber-200 rounded-2xl">
                <h4 class="font-bold text-xs uppercase text-amber-700 mb-2">Об'єкти для сортування:</h4>
                <div class="flex flex-wrap gap-2" id="draggable-items">
                    <span onclick="moveDD(this, 'box-files')" class="cursor-pointer px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-bold shadow-sm hover:border-sky-500">foto.jpg</span>
                    <span onclick="moveDD(this, 'box-folders')" class="cursor-pointer px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-bold shadow-sm hover:border-sky-500">Навчання</span>
                    <span onclick="moveDD(this, 'box-files')" class="cursor-pointer px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-bold shadow-sm hover:border-sky-500">doc.docx</span>
                    <span onclick="moveDD(this, 'box-folders')" class="cursor-pointer px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-bold shadow-sm hover:border-sky-500">Музика</span>
                </div>
            </div>

            <div class="flex justify-between gap-3 pt-4 border-t">
                <button onclick="nextBlock(3)" class="px-5 py-2.5 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold rounded-xl">
                    <i class="fa-solid fa-chevron-left mr-1"></i> Назад
                </button>
                <button onclick="finishBlock4()" class="px-6 py-3 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl shadow">
                    Далі: Блок 5 <i class="fa-solid fa-chevron-right ml-1"></i>
                </button>
            </div>
        </div>
    `;
}

function moveDD(el, targetId) {
    document.getElementById(targetId).appendChild(el);
    appState.blockScores[4] = 1;
    saveState();
}

function finishBlock4() {
    if (!appState.blockScores[4]) appState.blockScores[4] = 1;
    saveState();
    nextBlock(5);
}

// Block 5: Open Questions
function renderBlock5(container) {
    container.innerHTML = `
        <div class="space-y-6">
            <div class="border-b pb-4 flex justify-between items-center">
                <h2 class="text-2xl font-bold text-slate-800"><i class="fa-solid fa-pen-to-square text-rose-500 mr-2"></i>Блок 5. Відкриті запитання</h2>
                <span class="text-sm bg-rose-100 text-rose-700 px-3 py-1 rounded-full font-bold">Макс. 1 бал</span>
            </div>

            <div class="space-y-4">
                <div>
                    <label class="block font-bold text-slate-700 mb-1 text-sm">1. Чим відрізняється файл від папки?</label>
                    <textarea id="ans-q1" rows="2" class="w-full p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-rose-500 outline-none text-sm"
                        placeholder="Твоя відповідь...">${appState.blockAnswers[5].q1 || ''}</textarea>
                </div>
                <div>
                    <label class="block font-bold text-slate-700 mb-1 text-sm">2. Наведи приклад інформаційного процесу зберігання інформації:</label>
                    <textarea id="ans-q2" rows="2" class="w-full p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-rose-500 outline-none text-sm"
                        placeholder="Твоя відповідь...">${appState.blockAnswers[5].q2 || ''}</textarea>
                </div>
            </div>

            <div class="flex justify-between gap-3 pt-4 border-t">
                <button onclick="nextBlock(4)" class="px-5 py-2.5 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold rounded-xl">
                    <i class="fa-solid fa-chevron-left mr-1"></i> Назад
                </button>
                <button onclick="finishBlock5()" class="px-6 py-3 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl shadow">
                    Далі: Блок 6 <i class="fa-solid fa-chevron-right ml-1"></i>
                </button>
            </div>
        </div>
    `;
}

function finishBlock5() {
    const q1 = document.getElementById('ans-q1').value.trim();
    const q2 = document.getElementById('ans-q2').value.trim();
    appState.blockAnswers[5] = { q1, q2 };
    
    let score = 0;
    if (q1.length > 5) score += 0.5;
    if (q2.length > 5) score += 0.5;
    appState.blockScores[5] = score;
    saveState();
    nextBlock(6);
}

// Block 6: Creative Workshop
function renderBlock6(container) {
    container.innerHTML = `
        <div class="space-y-6">
            <div class="border-b pb-4 flex justify-between items-center">
                <h2 class="text-2xl font-bold text-slate-800"><i class="fa-solid fa-palette text-purple-500 mr-2"></i>Блок 6. Творча майстерня</h2>
                <span class="text-sm bg-purple-100 text-purple-700 px-3 py-1 rounded-full font-bold">Макс. 4 бали</span>
            </div>

            <div class="bg-purple-50 p-4 rounded-xl border border-purple-200 text-slate-700 text-sm">
                <b>Завдання:</b> Організуй структуру папок для свого нового комп'ютера. Створи папку «Мої файли», а всередині неї папки «Школа» та «Відпочинок».
            </div>

            <div class="border border-slate-300 rounded-2xl p-4 bg-white text-center">
                <button onclick="completeCreativeTask()" class="px-6 py-3 bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-bold rounded-xl shadow hover:opacity-95">
                    <i class="fa-solid fa-wand-magic-sparkles mr-2"></i> Створити та впорядкувати структуру
                </button>
                <p id="creative-status" class="mt-3 text-xs font-bold text-emerald-600 hidden">
                    <i class="fa-solid fa-circle-check"></i> Структуру успішно створено та впорядковано! (+4 бали)
                </p>
            </div>

            <div class="flex justify-between gap-3 pt-4 border-t">
                <button onclick="nextBlock(5)" class="px-5 py-2.5 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold rounded-xl">
                    <i class="fa-solid fa-chevron-left mr-1"></i> Назад
                </button>
                <button onclick="finishBlock6()" class="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl shadow">
                    Завершити та переглянути звіт <i class="fa-solid fa-flag-checkered ml-1"></i>
                </button>
            </div>
        </div>
    `;
}

function completeCreativeTask() {
    document.getElementById('creative-status').classList.remove('hidden');
    appState.blockScores[6] = 4;
    saveState();
}

function finishBlock6() {
    if (!appState.blockScores[6]) appState.blockScores[6] = 4;
    appState.student.endTime = new Date().toLocaleTimeString();
    saveState();
    nextBlock(7);
}

// Block 7: Final Analytics & Report
function renderReport(container) {
    const s = appState.student;
    let totalScore = 0;
    Object.values(appState.blockScores).forEach(sc => totalScore += sc);
    totalScore = Math.min(12, totalScore);

    container.innerHTML = `
        <div class="space-y-6">
            <div class="text-center space-y-2">
                <div class="inline-block p-4 bg-amber-100 rounded-full text-amber-500 mb-1">
                    <i class="fa-solid fa-trophy text-5xl animate-bounce"></i>
                </div>
                <h2 class="text-3xl font-extrabold text-slate-800">Персональний аналітичний звіт</h2>
                <p class="text-slate-500 text-sm">Вітаємо з успішним завершенням практичної роботи!</p>
            </div>

            <!-- Student Summary Card -->
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4 bg-slate-50 p-5 rounded-2xl border border-slate-200 text-sm">
                <div><span class="text-slate-500">Учень:</span> <b class="text-slate-800 block">${s.firstName} ${s.lastName}</b></div>
                <div><span class="text-slate-500">Клас:</span> <b class="text-slate-800 block">${s.className}</b></div>
                <div><span class="text-slate-500">Час виконання:</span> <b class="text-slate-800 block">${s.startTime || '10:00'} — ${s.endTime || '10:25'}</b></div>
            </div>

            <!-- Score Box -->
            <div class="bg-gradient-to-r from-sky-500 to-indigo-600 text-white p-6 rounded-2xl shadow-lg flex items-center justify-between">
                <div>
                    <p class="text-sky-100 uppercase text-xs font-bold tracking-wider">Підсумкова оцінка</p>
                    <h3 class="text-4xl font-extrabold mt-1">${totalScore.toFixed(1)} / 12 балів</h3>
                </div>
                <div class="text-5xl font-black opacity-30">
                    <i class="fa-solid fa-award"></i>
                </div>
            </div>

            <!-- Breakdown Table -->
            <div class="border border-slate-200 rounded-2xl overflow-hidden text-sm">
                <table class="w-full text-left border-collapse">
                    <thead class="bg-slate-100 border-b border-slate-200 text-slate-600">
                        <tr>
                            <th class="p-3">Розділ / Блок</th>
                            <th class="p-3 text-right">Набрано балів</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-slate-100">
                        <tr><td class="p-3">1. Світ інформаційних процесів</td><td class="p-3 text-right font-bold">${appState.blockScores[1].toFixed(1)} / 2.0</td></tr>
                        <tr><td class="p-3">2. Знайомство з файлами та папками</td><td class="p-3 text-right font-bold">${appState.blockScores[2].toFixed(1)} / 2.0</td></tr>
                        <tr><td class="p-3">3. Майстерня файлових операцій</td><td class="p-3 text-right font-bold">${appState.blockScores[3].toFixed(1)} / 2.0</td></tr>
                        <tr><td class="p-3">4. Завдання Drag & Drop</td><td class="p-3 text-right font-bold">${appState.blockScores[4].toFixed(1)} / 1.0</td></tr>
                        <tr><td class="p-3">5. Відкриті запитання</td><td class="p-3 text-right font-bold">${appState.blockScores[5].toFixed(1)} / 1.0</td></tr>
                        <tr><td class="p-3">6. Творча майстерня</td><td class="p-3 text-right font-bold">${appState.blockScores[6].toFixed(1)} / 4.0</td></tr>
                    </tbody>
                </table>
            </div>

            <!-- Export Buttons -->
            <div class="flex flex-wrap gap-3 justify-center pt-4">
                <button onclick="window.print()" class="px-5 py-3 bg-slate-800 hover:bg-slate-900 text-white font-bold rounded-xl shadow">
                    <i class="fa-solid fa-print mr-2"></i> Друкувати звіт
                </button>
                <button onclick="downloadJSON()" class="px-5 py-3 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl shadow">
                    <i class="fa-solid fa-file-code mr-2"></i> Завантажити JSON
                </button>
                <button onclick="restartApp()" class="px-5 py-3 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl shadow">
                    <i class="fa-solid fa-rotate-right mr-2"></i> Спочатку
                </button>
            </div>
        </div>
    `;
}

function nextBlock(blockNum) {
    appState.currentBlock = blockNum;
    saveState();
    renderApp();
}

function downloadJSON() {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(appState, null, 2));
    const dlAnchor = document.createElement('a');
    dlAnchor.setAttribute("href", dataStr);
    dlAnchor.setAttribute("download", `Звіт_${appState.student.lastName}_${appState.student.firstName}.json`);
    document.body.appendChild(dlAnchor);
    dlAnchor.click();
    dlAnchor.remove();
}

function restartApp() {
    if (confirm("Ви впевнені, що хочете скинути результати та розпочати спочатку?")) {
        localStorage.removeItem('info_app_5class_state');
        appState.currentBlock = 0;
        appState.score = 0;
        appState.blockScores = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0 };
        renderApp();
    }
}
