/**
 * برمجية درس: نمو وتوزيع السكان في وطننا العربي - الصف السادس الابتدائي
 * كود JavaScript نقي متكامل: إدارة المساعدة، محاكي الكثافة، الفيديو، والأنشطة والاختبار
 */

// ==========================================
// 1. نظام التنقل والتقدم وقائمة المساعدة (Modal)
// ==========================================
const navButtons = document.querySelectorAll('.nav-btn');
const pageSections = document.querySelectorAll('.page-section');
const progressBar = document.getElementById('progress-bar');
const menuToggle = document.getElementById('menuToggle');
const mainNav = document.getElementById('mainNav');

// أوزان تقدم الدرس
const sectionProgress = {
    'home': 10,
    'video-section': 25,
    'objectives': 40,
    'content': 65,
    'activities': 80,
    'summary': 90,
    'quiz': 100
};

function navigateTo(targetId) {
    pageSections.forEach(sec => {
        sec.classList.remove('active');
        if (sec.id === targetId) sec.classList.add('active');
    });

    navButtons.forEach(btn => {
        btn.classList.toggle('active', btn.dataset.target === targetId);
    });

    if (progressBar && sectionProgress[targetId]) {
        progressBar.style.width = `${sectionProgress[targetId]}%`;
    }

    if (mainNav.classList.contains('show')) {
        mainNav.classList.remove('show');
    }

    localStorage.setItem('arab_pop_current_sec', targetId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

navButtons.forEach(btn => {
    btn.addEventListener('click', () => navigateTo(btn.dataset.target));
});

if (menuToggle) {
    menuToggle.addEventListener('click', () => mainNav.classList.toggle('show'));
}

// التحكم بنافذة دليل المساعدة
const helpModal = document.getElementById('helpModal');
const openHelpBtn = document.getElementById('openHelpBtn');
const closeHelpBtn = document.getElementById('closeHelpBtn');
const gotItBtn = document.getElementById('gotItBtn');

function toggleModal(show) {
    if (helpModal) {
        if (show) helpModal.classList.add('open');
        else helpModal.classList.remove('open');
    }
}

if (openHelpBtn) openHelpBtn.addEventListener('click', () => toggleModal(true));
if (closeHelpBtn) closeHelpBtn.addEventListener('click', () => toggleModal(false));
if (gotItBtn) gotItBtn.addEventListener('click', () => toggleModal(false));

// إغلاق المودال عند الضغط خارجه
window.addEventListener('click', (e) => {
    if (e.target === helpModal) toggleModal(false);
});

// ==========================================
// 2. تبويبات الأهداف والمحطات التعليمية
// ==========================================
function switchObjTab(tabKey) {
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.obj-content-tab').forEach(t => t.classList.remove('active'));

    const targetTab = document.getElementById(`obj-${tabKey}`);
    if (targetTab) targetTab.classList.add('active');

    const activeBtn = Array.from(document.querySelectorAll('.tab-btn')).find(b => b.getAttribute('onclick').includes(tabKey));
    if (activeBtn) activeBtn.classList.add('active');
}

let currentUnitIndex = 1;
const totalUnits = 5;

function showUnit(num) {
    currentUnitIndex = num;
    document.querySelectorAll('.unit-btn').forEach((btn, idx) => {
        btn.classList.toggle('active', (idx + 1) === num);
    });

    document.querySelectorAll('.unit-panel').forEach((panel, idx) => {
        panel.classList.toggle('active', (idx + 1) === num);
    });

    const prevBtn = document.getElementById('prevUnitBtn');
    const nextBtn = document.getElementById('nextUnitBtn');

    if (prevBtn) prevBtn.style.visibility = (num === 1) ? 'hidden' : 'visible';
    if (nextBtn) {
        nextBtn.textContent = (num === totalUnits) ? 'الانتقال للأنشطة التفاعلية 🎮' : 'المحطة التالية ➡️';
    }
}

function navigateUnit(dir) {
    const target = currentUnitIndex + dir;
    if (target >= 1 && target <= totalUnits) {
        showUnit(target);
    } else if (target > totalUnits) {
        navigateTo('activities');
    }
}

// ==========================================
// 3. الآلة الحاسبة الجغرافية التفاعلية للكثافة
// ==========================================
function calculateDensityInteractive() {
    const popInput = document.getElementById('calcPopInput');
    const areaInput = document.getElementById('calcAreaInput');
    const resultBox = document.getElementById('calcResultDisplay');

    const pop = parseFloat(popInput.value);
    const area = parseFloat(areaInput.value);

    if (!pop || !area || area <= 0) {
        resultBox.innerHTML = `<span style="color:var(--danger)">⚠️ يرجى كتابة أرقام صحيحة أكبر من الصفر!</span>`;
        return;
    }

    const density = Math.round(pop / area);
    let statusText = "";
    if (density >= 1000) {
        statusText = "منطقة مرتفعة الكثافة جداً (مثل وادي النيل ودلتاه) 🟢";
    } else if (density >= 200) {
        statusText = "منطقة متوسطة الكثافة (مثل السواحل والهضاب المعتدلة) 🟡";
    } else {
        statusText = "منطقة منخفضة أو نادرة السكان (مثل المناطق الصحراوية) 🔴";
    }

    resultBox.innerHTML = `الكثافة السكانية = <strong>${density.toLocaleString()} نسمة / كم²</strong> — (${statusText})`;
}

// ==========================================
// 4. الخريطة التفاعلية الجغرافية المحدثة
// ==========================================
const regionInfo = {
    'nile': {
        title: 'وادي النيل ودلتاه (مصر والسودان) 🌊',
        badge: 'كثافة سكانية مرتفعة جداً 🟢',
        desc: 'أقدم وأهم مناطق الاستقرار البشري في العالم؛ لوفرة المياه العذبة الدائمة والتربة الخصبة، واستواء السطح وسهولة المواصلات.'
    },
    'mesopotamia': {
        title: 'سهول دجلة والفرات (العراق) 🌾',
        badge: 'كثافة سكانية مرتفعة 🟢',
        desc: 'سهول فيضية كبرى في الجناح الآسيوي، قامت عليها الحضارات لوفرة مياه نهري دجلة والفرات والتربة الصالحة للزراعة.'
    },
    'coasts': {
        title: 'السهول الساحلية (بلاد الشام وشمال إفريقيا) 🏖️',
        badge: 'كثافة سكانية معتدلة إلى مرتفعة 🟢',
        desc: 'مناخ معتدل وأمطار شتوية وفيرة، مع سهولة التجارة والصيد عبر البحر المتوسط.'
    },
    'gulf': {
        title: 'المدن البترولية في الخليج العربي 🛢️',
        badge: 'مراكز جذب بشري واقتصادي 🟡',
        desc: 'رغم قسوة المناخ الصحراوي؛ إلا أن تدفق النفط والغاز وفر فرص عمل مجزية استقطبت ملايين السكان والعمالة من الداخل والخارج.'
    },
    'sahara': {
        title: 'الصحراء الكبرى وصحراء الربع الخالي 🏜️',
        badge: 'مناطق نادرة السكان (شبه خالية) 🔴',
        desc: 'بسبب شدة الجفاف وندرة الأمطار والحرارة الشديدة؛ ويقتصر وجود السكان فيها على مناطق الواحات فقط.'
    }
};

document.querySelectorAll('.map-region').forEach(region => {
    region.addEventListener('click', () => {
        const key = region.dataset.region;
        const data = regionInfo[key];
        const display = document.getElementById('regionInfoCard');
        if (data && display) {
            display.innerHTML = `
                <div style="animation: fadeIn 0.3s ease;">
                    <span class="badge">${data.badge}</span>
                    <h4 style="color:var(--primary); font-size:1.25rem; margin:10px 0;">${data.title}</h4>
                    <p style="font-size:1rem; line-height:1.6;">${data.desc}</p>
                </div>
            `;
        }
    });
});

// ==========================================
// 5. لعبة السحب والإسقاط (Drag & Drop)
// ==========================================
function handleDragStart(e) {
    e.dataTransfer.setData('text/plain', e.target.id);
}

function allowDrop(e) {
    e.preventDefault();
}

function handleDrop(e, targetType) {
    e.preventDefault();
    const itemId = e.dataTransfer.getData('text/plain');
    const draggedEl = document.getElementById(itemId);
    const feedback = document.getElementById('dragFeedback');

    if (!draggedEl) return;

    if (draggedEl.dataset.type === targetType) {
        draggedEl.classList.add('correct');
        draggedEl.draggable = false;
        e.currentTarget.querySelector('.zone-items').appendChild(draggedEl);
        feedback.innerHTML = `<span style="color:var(--success)">✔️ رائع! تصنيف في محله.</span>`;
        checkGameFinish();
    } else {
        draggedEl.classList.add('wrong');
        feedback.innerHTML = `<span style="color:var(--danger)">❌ تأنَّ يا بطل! هل هذا العامل من صنع الطبيعة أم نشاط بشري؟</span>`;
        setTimeout(() => draggedEl.classList.remove('wrong'), 1000);
    }
}

// دعم اللمس المباشر للأجهزة الذكية
let activeTouchItem = null;
document.querySelectorAll('.drag-item').forEach(item => {
    item.addEventListener('click', () => {
        if (!item.draggable) return;
        activeTouchItem = item;
        document.querySelectorAll('.drag-item').forEach(i => i.style.outline = 'none');
        item.style.outline = '3px solid var(--accent)';
        document.getElementById('dragFeedback').innerHTML = `<span style="color:var(--secondary)">👉 اخترت: (${item.innerText})؛ اضغط الآن على الصندوق المناسب!</span>`;
    });
});

['zoneNatural', 'zoneHuman'].forEach(zid => {
    const zone = document.getElementById(zid);
    if (!zone) return;
    zone.addEventListener('click', () => {
        if (activeTouchItem) {
            const expected = (zid === 'zoneNatural') ? 'natural' : 'human';
            if (activeTouchItem.dataset.type === expected) {
                activeTouchItem.classList.add('correct');
                activeTouchItem.draggable = false;
                activeTouchItem.style.outline = 'none';
                zone.querySelector('.zone-items').appendChild(activeTouchItem);
                document.getElementById('dragFeedback').innerHTML = `<span style="color:var(--success)">✔️ ممتاز! إجابة صحيحة.</span>`;
                activeTouchItem = null;
                checkGameFinish();
            } else {
                document.getElementById('dragFeedback').innerHTML = `<span style="color:var(--danger)">❌ تصنيف غير صحيح، حاول مجدداً!</span>`;
            }
        }
    });
});

function checkGameFinish() {
    if (document.getElementById('itemsSource').children.length === 0) {
        document.getElementById('dragFeedback').innerHTML = `<span style="color:var(--primary); font-size:1.15rem;">🎉 مبارك! صنفت جميع العوامل الستة بنجاح 100%!</span>`;
    }
}

function resetDragGame() {
    const src = document.getElementById('itemsSource');
    const move = (cont) => {
        while (cont.firstChild) {
            const el = cont.firstChild;
            el.classList.remove('correct', 'wrong');
            el.draggable = true;
            el.style.outline = 'none';
            src.appendChild(el);
        }
    };
    move(document.getElementById('naturalItems'));
    move(document.getElementById('humanItems'));
    document.getElementById('dragFeedback').innerHTML = '';
    activeTouchItem = null;
}

// ==========================================
// 6. بنك أسئلة الاختبار النهائي الشامل (15 سؤالاً)
// ==========================================
const examQuestions = [
    // 7 أسئلة اختيار من متعدد
    {
        type: 'mcq',
        category: 'distribution',
        question: 'تأتي جمهورية مصر العربية في المرتبة الأولى عربياً من حيث السكان؛ حيث تضم نحو:',
        options: ['ربع سكان الوطن العربي', 'نصف سكان الوطن العربي', 'عُشر سكان الوطن العربي', 'ثلاثة أرباع السكان'],
        correct: 0,
        explanation: 'تضم مصر بمفردها أكثر من ربع (25%) إجمالي سكان الوطن العربي.'
    },
    {
        type: 'mcq',
        category: 'growth',
        question: 'يرتفع معدل النمو السكاني في وطننا العربي (1.8%) عن المعدل العالمي بفضل:',
        options: ['كثرة المواليد وتحسن الرعاية الصحية والهجرة', 'ندرة الأمطار والجفاف', 'قلة الخدمات والمستشفيات', 'انخفاض عدد المهاجرين'],
        correct: 0,
        explanation: 'الزيادة الطبيعية (ارتفاع المواليد وقلة الوفيات) إضافة للهجرة الخارجية هما سبب ارتفاع النمو السكاني.'
    },
    {
        type: 'mcq',
        category: 'distribution',
        question: 'يعيش نحو 61% من إجمالي سكان الوطن العربي في دول الجناح:',
        options: ['الإفريقي', 'الآسيوي', 'الأوروبي', 'الأسترالي'],
        correct: 0,
        explanation: 'يستحوذ الجناح الإفريقي على حوالي 61% من السكان مقارنة بـ 39% للجناح الآسيوي.'
    },
    {
        type: 'mcq',
        category: 'factors',
        question: 'أي المناطق الآتية يتركز بها السكان في الجناح الآسيوي لوجود سهول فيضية خصبة؟',
        options: ['سهول دجلة والفرات بالعراق', 'صحراء الربع الخالي', 'صحراء النفوذ', 'هضبة حضرموت'],
        correct: 0,
        explanation: 'سهول دجلة والفرات توفر المياه العذبة والأراضي الزراعية المنبسطة.'
    },
    {
        type: 'mcq',
        category: 'problems',
        question: 'من أمثلة الدول العربية التي تعاني من قلة في السكان وزيادة في الموارد المالية:',
        options: ['المملكة العربية السعودية وقطر', 'مصر والأردن', 'سوريا واليمن', 'السودان والصومال'],
        correct: 0,
        explanation: 'دول الخليج العربي تمتلك ثروات بترولية ضخمة لكنها تعاني من نقص الأيدي العاملة الوطنية.'
    },
    {
        type: 'mcq',
        category: 'calculation',
        question: 'إذا كان عدد سكان إحدى المدن 300,000 نسمة ومساحتها 150 كم²؛ فإن كثافتها السكانية تكون:',
        options: ['2,000 نسمة/كم²', '200 نسمة/كم²', '500 نسمة/كم²', '150 نسمة/كم²'],
        correct: 0,
        explanation: 'الكثافة = عدد السكان ÷ المساحة = 300,000 ÷ 150 = 2,000 نسمة/كم².'
    },
    {
        type: 'mcq',
        category: 'factors',
        question: 'يعد اعتدال درجات الحرارة وسقوط الأمطار الشتوية من أهم أسباب تركز السكان في:',
        options: ['سواحل بلاد الشام وشمال إفريقيا', 'وسط الصحراء الكبرى', 'صحراء الدهناء', 'المناطق شديدة الانحدار الجبلي'],
        correct: 0,
        explanation: 'المناخ المعتدل للبحر المتوسط عامل جذب طبيعي رئيسي للسكان.'
    },

    // 4 أسئلة صواب وخطأ
    {
        type: 'boolean',
        category: 'distribution',
        question: 'يتوزع سكان الوطن العربي بالتساوي العادل بين جميع أراضيه ودوله.',
        options: ['صواب', 'خطأ'],
        correct: 1,
        explanation: 'خطأ؛ يتسم توزيع السكان بعدم التجانس والتفاوت الشديد (مناطق مزدحمة وصحارٍ شبه خالية).'
    },
    {
        type: 'boolean',
        category: 'growth',
        question: 'يقصد بـ "النمو السكاني" زيادة عدد السكان خلال فترة زمنية محددة.',
        options: ['صواب', 'خطأ'],
        correct: 0,
        explanation: 'صواب؛ هذا هو التعريف العلمي الدقيق للنمو السكاني.'
    },
    {
        type: 'boolean',
        category: 'factors',
        question: 'يفضل السكان عموماً الإقامة فوق قمم الجبال شديدة الوعروع بدلاً من السهول.',
        options: ['صواب', 'خطأ'],
        correct: 1,
        explanation: 'خطأ؛ يفضل السكان السهول لسهولة الحركة والزراعة، ويستثنى جبال لبنان واليمن فقط لاعتدال مناخها.'
    },
    {
        type: 'boolean',
        category: 'problems',
        question: 'يساعد بناء المدن الجديدة الذكية واستصلاح الصحراء في حل مشكلة الازدحام السكاني.',
        options: ['صواب', 'خطأ'],
        correct: 0,
        explanation: 'صواب؛ التوسع خارج المدن القديمة يقلل العبء على الخدمات ويحمي الأراضي الزراعية.'
    },

    // سؤالان إكمال عبارة
    {
        type: 'fill',
        category: 'distribution',
        question: 'تحتل دولة ..... المركز الثاني من حيث عدد السكان في وطننا العربي بعد مصر.',
        acceptable: ['السودان', 'جمهورية السودان'],
        explanation: 'تأتي السودان في المركز الثاني عربياً بعد مصر.'
    },
    {
        type: 'fill',
        category: 'factors',
        question: 'تعد موارد ..... العذبة والتربة الخصبة أهم العوامل الطبيعية لجذب واستقرار السكان.',
        acceptable: ['المياه', 'الميه', 'الماء'],
        explanation: 'الماء هو أصل الحياة وأول شرط للاستقرار البشري والزراعي.'
    },

    // سؤالان خريطة وتفكير جغرافي
    {
        type: 'mcq',
        category: 'thinking',
        question: 'تحليل موقف: كيف يمكن التغلب على مشكلة البطالة في دول الفائض السكاني ونقص العمالة في دول الخليج؟',
        options: ['تحقيق التكامل والتعاون وتيسير انتقال الأيدي العاملة العربية', 'وقف بناء المشروعات الصناعية', 'منع السفر والتنقل نهائياً', 'إلغاء المدارس والجامعات'],
        correct: 0,
        explanation: 'التكامل العربي بنقل الكفاءات والعمالة إلى مواطن وفرة الموارد يحقق التوازن المنشود.'
    },
    {
        type: 'mcq',
        category: 'thinking',
        question: 'من خلال الخريطة؛ لماذا يندر السكان في صحراء الربع الخالي جنوب شرق شبه الجزيرة العربية؟',
        options: ['لقسوة المناخ والجفاف الشديد وندرة مصادر المياه', 'لكثرة المستنقعات المائية', 'لوجود غابات استوائية كثيفة', 'بسبب التجمد والجليد الدائم'],
        correct: 0,
        explanation: 'المناخ الصحراوي القاحل وندرة مياه الشرب يجعل الحياة صعبة للغاية إلا في الواحات.'
    }
];

// ==========================================
// 7. محرك الاختبار النهائي وإصدار التقرير
// ==========================================
let examIdx = 0;
let examScore = 0;
let studentFullName = "";
let examLog = [];

function startFinalQuiz() {
    const input = document.getElementById('studentNameInput');
    studentFullName = input.value.trim();

    if (!studentFullName) {
        alert("يرجى كتابة اسمك الكريم أولاً للبدء!");
        input.focus();
        return;
    }

    examIdx = 0;
    examScore = 0;
    examLog = [];

    document.getElementById('quiz-start-screen').style.display = 'none';
    document.getElementById('quiz-result-screen').style.display = 'none';
    document.getElementById('quiz-question-screen').style.display = 'block';

    renderExamQuestion();
}

function renderExamQuestion() {
    const q = examQuestions[examIdx];
    const total = examQuestions.length;

    document.getElementById('questionCounter').textContent = `السؤال ${examIdx + 1} من ${total}`;
    document.getElementById('currentScoreBadge').textContent = `الدرجة: ${examScore}`;
    document.getElementById('quizProgressFill').style.width = `${(examIdx / total) * 100}%`;

    const tag = document.getElementById('qTypeTag');
    if (q.type === 'mcq') tag.textContent = 'اختيار من متعدد';
    else if (q.type === 'boolean') tag.textContent = 'صواب أم خطأ';
    else if (q.type === 'fill') tag.textContent = 'أكمل بالكلمة المناسبة';

    document.getElementById('qText').textContent = q.question;

    const optsBox = document.getElementById('qOptionsContainer');
    const fillBox = document.getElementById('qFillContainer');
    const fbBox = document.getElementById('qFeedback');
    const nextBtn = document.getElementById('nextQuestionBtn');

    optsBox.innerHTML = '';
    optsBox.style.display = 'none';
    fillBox.style.display = 'none';
    fbBox.style.display = 'none';
    nextBtn.style.display = 'none';

    if (q.type === 'mcq' || q.type === 'boolean') {
        optsBox.style.display = 'flex';
        q.options.forEach((opt, idx) => {
            const btn = document.createElement('button');
            btn.className = 'quiz-opt-btn';
            btn.textContent = opt;
            btn.onclick = () => handleExamChoice(idx, btn);
            optsBox.appendChild(btn);
        });
    } else if (q.type === 'fill') {
        fillBox.style.display = 'flex';
        const fillInput = document.getElementById('fillAnswerInput');
        fillInput.value = '';
        fillInput.disabled = false;
        fillInput.focus();
    }
}

function handleExamChoice(selectedIdx, btn) {
    const q = examQuestions[examIdx];
    const btns = document.querySelectorAll('.quiz-opt-btn');
    btns.forEach(b => b.disabled = true);

    const isCorrect = (selectedIdx === q.correct);
    if (isCorrect) {
        examScore++;
        btn.classList.add('selected-correct');
    } else {
        btn.classList.add('selected-wrong');
        if (btns[q.correct]) btns[q.correct].classList.add('show-truth');
    }

    examLog.push({
        question: q.question,
        userAns: q.options[selectedIdx],
        correctAns: q.options[q.correct],
        isCorrect: isCorrect,
        explanation: q.explanation,
        category: q.category
    });

    showExamFeedback(isCorrect, q.explanation);
}

function submitFillAnswer() {
    const q = examQuestions[examIdx];
    const input = document.getElementById('fillAnswerInput');
    const val = input.value.trim().toLowerCase();

    if (!val) {
        alert("يرجى كتابة كلمة الإجابة أولاً!");
        input.focus();
        return;
    }

    input.disabled = true;
    const isCorrect = q.acceptable.some(ans => val.includes(ans.toLowerCase()) || ans.toLowerCase().includes(val));

    if (isCorrect) examScore++;

    examLog.push({
        question: q.question,
        userAns: val,
        correctAns: q.acceptable[0],
        isCorrect: isCorrect,
        explanation: q.explanation,
        category: q.category
    });

    showExamFeedback(isCorrect, q.explanation);
}

function showExamFeedback(isCorrect, explanation) {
    const fbBox = document.getElementById('qFeedback');
    const nextBtn = document.getElementById('nextQuestionBtn');

    fbBox.style.display = 'block';
    if (isCorrect) {
        fbBox.className = 'question-feedback';
        fbBox.style.backgroundColor = 'var(--success-light)';
        fbBox.style.color = '#166534';
        fbBox.innerHTML = `✔️ <strong>أحسنت!</strong> إجابة صحيحة. (${explanation})`;
    } else {
        fbBox.className = 'question-feedback';
        fbBox.style.backgroundColor = 'var(--danger-light)';
        fbBox.style.color = '#991b1b';
        fbBox.innerHTML = `❌ <strong>إجابة غير دقيقة!</strong> التوضيح: ${explanation}`;
    }

    document.getElementById('currentScoreBadge').textContent = `الدرجة: ${examScore}`;

    if (examIdx < examQuestions.length - 1) {
        nextBtn.textContent = 'السؤال التالي ⬅️';
    } else {
        nextBtn.textContent = 'إظهار التقرير والشهادة 🏆';
    }
    nextBtn.style.display = 'inline-block';
}

function nextQuizQuestion() {
    examIdx++;
    if (examIdx < examQuestions.length) {
        renderExamQuestion();
    } else {
        showFinalExamReport();
    }
}

function showFinalExamReport() {
    document.getElementById('quiz-question-screen').style.display = 'none';
    document.getElementById('quiz-result-screen').style.display = 'block';

    const total = examQuestions.length;
    const percent = Math.round((examScore / total) * 100);

    document.getElementById('studentGreeting').innerHTML = `تهانينا للطالب المتميز: <strong>${studentFullName}</strong>`;
    document.getElementById('finalScoreVal').textContent = `${examScore} / ${total}`;
    document.getElementById('finalPercentVal').textContent = `${percent}%`;

    const trophy = document.getElementById('resultTrophy');
    const title = document.getElementById('resultTitle');
    const grade = document.getElementById('finalGradeVal');

    if (percent >= 85) {
        trophy.textContent = '🥇🌟';
        title.textContent = 'عبقري الجغرافيا المتفوق!';
        grade.textContent = 'ممتاز 🎖️';
        grade.style.color = 'var(--primary)';
    } else if (percent >= 65) {
        trophy.textContent = '🥈👏';
        title.textContent = 'أداء جيد جداً ومحاولة رائعة!';
        grade.textContent = 'جيد جداً 👍';
        grade.style.color = 'var(--secondary)';
    } else {
        trophy.textContent = '📚💪';
        title.textContent = 'محاولة طيبة.. راجع الشرح مرة أخرى لتصل للقمة!';
        grade.textContent = 'يحتاج لمراجعة 📖';
        grade.style.color = 'var(--accent)';
    }

    // تحليل نقاط القوة والمراجعة
    analyzePupilReport();

    // استعراض الإجابات
    const acc = document.getElementById('answersAccordion');
    acc.innerHTML = '';
    examLog.forEach((item, i) => {
        const row = document.createElement('div');
        row.className = `review-item ${item.isCorrect ? 'is-correct' : 'is-wrong'}`;
        row.innerHTML = `
            <strong>س ${i + 1}: ${item.question}</strong>
            <div style="margin-top:4px;">
                <span>إجابتك: <strong>${item.userAns}</strong> ${item.isCorrect ? '✅' : '❌'}</span>
                ${!item.isCorrect ? `<span style="margin-right:15px; color:var(--primary)">الصواب: <strong>${item.correctAns}</strong></span>` : ''}
            </div>
            <div style="font-size:0.85rem; color:var(--text-muted); margin-top:4px;">💡 ${item.explanation}</div>
        `;
        acc.appendChild(row);
    });

    // حفظ النتيجة في LocalStorage
    localStorage.setItem('arab_pop_score_saved', JSON.stringify({
        name: studentFullName,
        score: examScore,
        date: new Date().toLocaleDateString('ar-EG')
    }));
}

function analyzePupilReport() {
    const strList = document.getElementById('strengthsList');
    const weakList = document.getElementById('weaknessesList');
    strList.innerHTML = '';
    weakList.innerHTML = '';

    const wrongList = examLog.filter(x => !x.isCorrect);

    if (wrongList.length === 0) {
        strList.innerHTML = `
            <li>إتقان كامل بنسبة 100% لمفاهيم النمو والكثافة والتوزيع السكاني.</li>
            <li>قدرة متميزة على التمييز بين مشكلات الفائض والعجز في الموارد.</li>
        `;
        weakList.innerHTML = `<li>لا توجد نقاط ضعف، نتيجتك كاملة ومشرفة!</li>`;
    } else {
        const cats = wrongList.map(w => w.category);
        if (cats.includes('growth')) weakList.innerHTML += `<li>مراجعة أسباب النمو السكاني السريع (الوحدة 1).</li>`;
        else strList.innerHTML += `<li>فهم قوي لمعدلات وأسباب النمو السكاني العربي.</li>`;

        if (cats.includes('distribution')) weakList.innerHTML += `<li>مراجعة نسب توزيع السكان بين الجناحين الإفريقي والآسيوي (الوحدة 2).</li>`;
        else strList.innerHTML += `<li>إتقان ترتيب وتوزيع دول الوطن العربي سكاناً.</li>`;

        if (cats.includes('problems') || cats.includes('thinking')) weakList.innerHTML += `<li>الاطلاع على نمطي المشكلة السكانية (فائض سكاني vs فائض موارد).</li>`;
        else strList.innerHTML += `<li>وعي ممتاز بحلول التكامل السكاني بين الأقطار العربية.</li>`;
    }
}

function restartQuiz() {
    document.getElementById('quiz-result-screen').style.display = 'none';
    document.getElementById('quiz-start-screen').style.display = 'block';
}

// استعادة الجلسة والتهيئة الأولية
window.addEventListener('DOMContentLoaded', () => {
    const saved = localStorage.getItem('arab_pop_current_sec') || 'home';
    navigateTo(saved);

    const prevScore = localStorage.getItem('arab_pop_score_saved');
    if (prevScore) {
        const d = JSON.parse(prevScore);
        const alertBox = document.getElementById('lastScoreAlert');
        if (alertBox) {
            alertBox.style.display = 'block';
            alertBox.innerHTML = `📌 أهلاً بك يا <strong>${d.name}</strong> مجدداً! آخر نتيجة لك كانت <strong>${d.score} من 15</strong> بتاريخ ${d.date}.`;
        }
    }
});