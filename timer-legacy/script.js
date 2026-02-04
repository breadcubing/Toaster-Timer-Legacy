document.addEventListener('DOMContentLoaded', () => {
    // --- DOM Elements ---
    const timerEl = document.getElementById('timer');
    const scrambleEl = document.getElementById('scramble');
    const solvesListEl = document.getElementById('solves-list');
    const puzzleSelectorEl = document.getElementById('puzzle-select');
    const puzzleTypeDisplayEl = document.getElementById('puzzle-type-display');
    const clearSolvesBtn = document.getElementById('clear-solves');
    const mainTimerArea = document.getElementById('main-timer-area');

    // Session Elements
    const sessionSelectorEl = document.getElementById('session-selector');
    const newSessionBtn = document.getElementById('new-session-btn');
    const renameSessionBtn = document.getElementById('rename-session-btn');
    const deleteSessionBtn = document.getElementById('delete-session-btn');
    
    // Modal Elements
    const confirmationModal = document.getElementById('confirmation-modal');
    const modalConfirmBtn = document.getElementById('modal-confirm-btn');
    const modalCancelBtn = document.getElementById('modal-cancel-btn');

    // Stats Elements
    const bestTimeEl = document.getElementById('best-time');
    const worstTimeEl = document.getElementById('worst-time');
    const averageTimeEl = document.getElementById('average-time');
    const ao5El = document.getElementById('ao5');
    const ao12El = document.getElementById('ao12');
    const bestAo5El = document.getElementById('best-ao5');
    const worstAo5El = document.getElementById('worst-ao5');
    const bestAo12El = document.getElementById('best-ao12');
    const worstAo12El = document.getElementById('worst-ao12');

    // --- State ---
    let timerState = 'stopped'; // 'stopped', 'inspecting', 'holding', 'running'
    let timerInterval;
    let timeElapsed = 0;
    let useInspection = false;
    let inspectionInterval;
    let inspectionPenalty = 0; // 0 for none, 1 for +2, Infinity for DNF
    let inspectionState = 'disabled'; // 'disabled', 'enabled', 'countdown'
    let inspectionCountdown = 0;

    // App data structure
    let appData = {
        sessions: [],
        activeSessionId: null
    };

    let currentPuzzle = '3x3';
    let currentScramble = '';


    // --- SCRAMBLE GENERATION ---
    const moves = {
        '2x2': { faces: ['R', 'U', 'F'], modifiers: ['', "'", '2'] },
        '3x3': { faces: ['R', 'L', 'U', 'D', 'F', 'B'], modifiers: ['', "'", '2'] },
        '4x4': { faces: ['R', 'L', 'U', 'D', 'F', 'B', 'Rw', 'Lw', 'Uw', 'Dw', 'Fw', 'Bw'], modifiers: ['', "'", '2'] },
        '5x5': { faces: ['R', 'L', 'U', 'D', 'F', 'B', 'Rw', 'Lw', 'Uw', 'Dw', 'Fw', 'Bw'], modifiers: ['', "'", '2'] },
        'pyraminx': { faces: ['R', 'L', 'U', 'B'], modifiers: ["", "'"], tips: ['r', 'l', 'u', 'b'] }
    };


    function generateScramble() {
        const puzzleMoves = moves[currentPuzzle];
        let scramble = [];
        let scrambleLength = { '2x2': 9, '3x3': 20, '4x4': 45, '5x5': 60, 'pyraminx': 10 }[currentPuzzle];
        let lastMove = '';


        while (scramble.length < scrambleLength) {
            let move = puzzleMoves.faces[Math.floor(Math.random() * puzzleMoves.faces.length)];
            if (move.charAt(0) !== lastMove.charAt(0)) {
                let modifier = puzzleMoves.modifiers[Math.floor(Math.random() * puzzleMoves.modifiers.length)];
                scramble.push(move + modifier);
                lastMove = move;
            }
        }
        
        if (currentPuzzle === 'pyraminx') {
            let numTips = Math.floor(Math.random() * 4);
            let shuffledTips = puzzleMoves.tips.sort(() => 0.5 - Math.random());
            for(let i=0; i < numTips; i++) {
                let tipModifier = Math.random() > 0.5 ? "'" : "";
                scramble.push(shuffledTips[i] + tipModifier);
            }
        }
        currentScramble = scramble.join(' ');


        scrambleEl.textContent = currentScramble;
        timerState = 'stopped';
        resetTimerDisplay();
        timerEl.classList.add('timer-ready');
    }


    // --- TIMER LOGIC ---
    function formatTime(ms) {
        if (ms === Infinity) return 'DNF';
        if (ms === null || ms === -Infinity || isNaN(ms)) return '-';
        
        const totalSeconds = ms / 1000;
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = Math.floor(totalSeconds % 60);
        const hundredths = Math.floor((ms % 1000) / 10);


        let formatted = '';
        if (minutes > 0) {
            formatted += `${minutes}:${seconds.toString().padStart(2, '0')}.` ;
        } else {
            formatted += `${seconds}.` ;
        }
        formatted += hundredths.toString().padStart(2, '0');
        return formatted;
    }
    
    function formatSolveTime(solve) {
        if (solve.isDNF) return 'DNF';
        const displayTime = solve.time + (solve.penaltyValue * 2000);
        let formatted = formatTime(displayTime);
        if (solve.penaltyValue > 0) {
            formatted += '+';
        }
        return formatted;
    }
    
    function resetTimerDisplay() {
         timerEl.className = 'text-8xl sm:text-9xl md:text-[8rem] lg:text-[10rem] font-bold tracking-tighter';
         timerEl.textContent = formatTime(0);
    }


    function startTimer() {
        if (timerState !== 'holding') return;
        clearInterval(inspectionInterval); // Stop inspection if it's running
        timerStartTime = Date.now();
        timerState = 'running';
        resetTimerDisplay();
        timerInterval = setInterval(() => {
            timeElapsed = Date.now() - timerStartTime;
            timerEl.textContent = formatTime(timeElapsed);
        }, 10);
        puzzleSelectorEl.style.visibility = 'hidden';
    }


    function stopTimer() {
        if (timerState !== 'running') return;
        clearInterval(timerInterval);
        timerState = 'stopped';
        addSolve(timeElapsed);
        generateScramble();
        puzzleSelectorEl.style.visibility = 'visible';
    }


    // --- PUZZLE SWITCHING ---
    function switchPuzzle(puzzle) {
        if (puzzle !== currentPuzzle && timerState !== 'running') {
            currentPuzzle = puzzle;
            
            puzzleTypeDisplayEl.textContent = {'2x2': '2x2x2', '3x3': '3x3x3', '4x4': '4x4x4', '5x5': '5x5x5', 'pyraminx': 'Pyraminx'}[currentPuzzle];
            generateScramble();
            updateUI();
        }
    }


    // --- EVENT LISTENERS ---
    // Keyboard controls
    window.addEventListener('keydown', (e) => {
        if (!confirmationModal.classList.contains('hidden')) return;


        if (e.code === 'Space') {
            e.preventDefault();
            if (timerState === 'stopped') {
                if (useInspection) {
                    startInspection();
                } else {
                    timerState = 'holding';
                    resetTimerDisplay();
                    timerEl.classList.add('timer-holding');
                }
            } else if (timerState === 'running') {
                stopTimer();
            } else if (timerState === 'inspecting') {
                timerState = 'holding';
                timerEl.classList.remove('timer-inspecting');
                timerEl.classList.add('timer-holding');
            }
        } else if (timerState !== 'running') {
            switch (e.key) {
                case 'q': case 'Q':
                    e.preventDefault();
                    if (solves.filter(s => s.puzzle === currentPuzzle).length > 0) showModal();
                    break;
                case '2': switchPuzzle('2x2'); break;
                case '3': switchPuzzle('3x3'); break;
                case '4': switchPuzzle('4x4'); break;
                case '5': switchPuzzle('5x5'); break;
                case 'p': case 'P': switchPuzzle('pyraminx'); break;
            }
        }
    });


    window.addEventListener('keyup', (e) => {
        if (e.code !== 'Space' || !confirmationModal.classList.contains('hidden')) return;
        e.preventDefault();
        if (timerState === 'holding') startTimer();
    });
    
    // Touch controls
    mainTimerArea.addEventListener('touchstart', (e) => {
        e.preventDefault();
        if (timerState === 'stopped') {
            if (useInspection) {
                startInspection();
            } else {
                timerState = 'holding';
                resetTimerDisplay();
                timerEl.classList.add('timer-holding');
            }
        } else if (timerState === 'running') {
            stopTimer();
        } else if (timerState === 'inspecting') {
            timerState = 'holding';
            timerEl.classList.remove('timer-inspecting');
            timerEl.classList.add('timer-holding');
        }
    }, { passive: false });


    mainTimerArea.addEventListener('touchend', (e) => {
        e.preventDefault();
        if (timerState === 'holding') startTimer();
    });
    
    puzzleSelectorEl.addEventListener('change', (e) => {
        const selectedPuzzle = e.target.value;
        switchPuzzle(selectedPuzzle);
    });

    // Session UI Event Listeners
    sessionSelectorEl.addEventListener('change', (e) => {
        switchSession(parseInt(e.target.value));
    });

    newSessionBtn.addEventListener('click', createNewSession);
    renameSessionBtn.addEventListener('click', renameCurrentSession);
    deleteSessionBtn.addEventListener('click', deleteCurrentSession);

    // --- MODAL AND CLEAR LOGIC ---
    function showModal() { confirmationModal.classList.remove('hidden'); confirmationModal.classList.add('flex'); }
    function hideModal() { confirmationModal.classList.add('hidden'); confirmationModal.classList.remove('flex'); }
    clearSolvesBtn.addEventListener('click', () => {
        const currentSession = getCurrentSession();
        if (!currentSession) return;
        if (currentSession.solves.filter(s => s.puzzle === currentPuzzle).length > 0) showModal();
    });
    modalCancelBtn.addEventListener('click', hideModal);
    modalConfirmBtn.addEventListener('click', () => {
        const currentSession = getCurrentSession();
        if (!currentSession) return;
        currentSession.solves = currentSession.solves.filter(solve => solve.puzzle !== currentPuzzle);
        saveData();
        updateUI();
        hideModal();
    });

    // --- DATA & UI MANAGEMENT ---
    function addSolve(time) {
        const currentSession = getCurrentSession();
        if (!currentSession) return;

        let isDNF = false;
        let penaltyValue = 0;

        if (inspectionPenalty === 1) {
            penaltyValue = 1;
        } else if (inspectionPenalty === Infinity || time === Infinity) {
            isDNF = true;
        }

        currentSession.solves.unshift({ id: Date.now(), time, puzzle: currentPuzzle, scramble: currentScramble, penaltyValue, isDNF });
        inspectionPenalty = 0; // Reset penalty after use
        saveData();
        updateUI();
    }
    
    function deleteSolve(id) {
        const currentSession = getCurrentSession();
        if (!currentSession) return;
        currentSession.solves = currentSession.solves.filter(solve => solve.id !== id);
        saveData();
        updateUI();
    }
    
    function cyclePlus2Penalty(id) {
        const currentSession = getCurrentSession();
        if (!currentSession) return;
        const solve = currentSession.solves.find(s => s.id === id);
        if (solve && !solve.isDNF) {
            solve.penaltyValue = (solve.penaltyValue + 1) % 9; // Cycles 0-8
            saveData();
            updateUI();
        }
    }

    function toggleDNF(id) {
        const currentSession = getCurrentSession();
        if (!currentSession) return;
        const solve = currentSession.solves.find(s => s.id === id);
        if (solve) {
            solve.isDNF = !solve.isDNF;
            if (solve.isDNF) {
                solve.penaltyValue = 0; // DNF overrides +2
            }
            saveData();
            updateUI();
        }
    }


    function updateUI() {
        renderSolvesList();
        calculateStats();
    }


    solvesListEl.addEventListener('click', (e) => {
        const button = e.target.closest('button');
        if (!button) return;
        const id = parseInt(button.dataset.id, 10);
        const action = button.dataset.action;


        if (action === 'plus2') {
            cyclePlus2Penalty(id);
        } else if (action === 'dnf') {
            toggleDNF(id);
        } else if (action === 'delete') {
            deleteSolve(id);
        }
    });


    function renderSolvesList() {
        const currentSession = getCurrentSession();
        solvesListEl.innerHTML = '';
        if (!currentSession) {
            solvesListEl.innerHTML = `<tr><td colspan="3" class="text-center text-gray-500 py-4">No session selected.</td></tr>`;
            return;
        }

        const filteredSolves = currentSession.solves.filter(s => s.puzzle === currentPuzzle);
        if (filteredSolves.length === 0) {
            solvesListEl.innerHTML = `<tr><td colspan="3" class="text-center text-gray-500 py-4">No solves yet.</td></tr>`;
            return;
        }
        filteredSolves.forEach((solve, index) => {
            const tr = document.createElement('tr');
            tr.className = 'border-b border-gray-700';
            
            const plus2Class = solve.penaltyValue > 0 ? 'active-plus-2' : 'bg-gray-600 hover:bg-gray-500';
            const dnfClass = solve.isDNF ? 'active-dnf' : 'bg-gray-600 hover:bg-gray-500';
            const plus2Text = solve.penaltyValue > 0 ? `+${solve.penaltyValue * 2}`  : '+2';
            const isInspectionPenalty = solve.penaltyValue > 0 || solve.isDNF;

            tr.innerHTML = `
                <td class="px-2 py-2 font-medium">${filteredSolves.length - index}</td>
                <td class="px-2 py-2 font-semibold text-lg">${formatSolveTime(solve)}</td>
                <td class="px-2 py-2 text-right space-x-1">
                    <button data-id="${solve.id}" data-action="plus2" class="penalty-btn text-xs font-bold py-1 px-2 rounded ${plus2Class}" ${solve.isDNF || isInspectionPenalty ? 'disabled' : ''}>${plus2Text}</button>
                    <button data-id="${solve.id}" data-action="dnf" class="penalty-btn text-xs font-bold py-1 px-2 rounded ${dnfClass}" ${isInspectionPenalty ? 'disabled' : ''}>DNF</button>
                    <button data-id="${solve.id}" data-action="delete" class="delete-btn text-red-400 hover:text-red-300 font-bold text-lg px-2">&times;</button>
                </td>
            `;
            solvesListEl.appendChild(tr);
        });
    }
    
    function getCalculatedTime(solve) {
        if (!solve) return null;
        if (solve.isDNF) return Infinity;
        return solve.time + (solve.penaltyValue * 2000);
    }


    function getOlympicAverage(solvesChunk) {
        if (solvesChunk.length < 3) return null;
        const calculatedTimes = solvesChunk.map(getCalculatedTime);
        if (calculatedTimes.filter(t => t === Infinity).length >= 2) return Infinity;
        const sorted = [...calculatedTimes].sort((a, b) => a - b);
        const trimmed = sorted.slice(1, -1);
        if (trimmed.length === 0) return null;
        return trimmed.reduce((acc, time) => acc + time, 0) / trimmed.length;
    }


    function calculateSessionAverages(allSolves, count) {
        if (allSolves.length < count) return { best: null, worst: null };
        let best = Infinity, worst = -Infinity;
        for (let i = 0; i <= allSolves.length - count; i++) {
            const avg = getOlympicAverage(allSolves.slice(i, i + count));
            if (avg === null) continue;
            if (avg < best) best = avg;
            if (avg > worst) worst = avg;
        }
        return { best: best === Infinity ? null : best, worst: worst === -Infinity ? null : worst };
    }


    function calculateStats() {
        const currentSession = getCurrentSession();
        if (!currentSession) {
             [bestTimeEl, worstTimeEl, averageTimeEl, ao5El, ao12El, bestAo5El, worstAo5El, bestAo12El, worstAo12El].forEach(el => el.textContent = '-');
            return;
        }

        const currentPuzzleSolves = currentSession.solves.filter(s => s.puzzle === currentPuzzle);
        if (currentPuzzleSolves.length === 0) {
            [bestTimeEl, worstTimeEl, averageTimeEl, ao5El, ao12El, bestAo5El, worstAo5El, bestAo12El, worstAo12El].forEach(el => el.textContent = '-');
            return;
        }
        const calculatedTimes = currentPuzzleSolves.map(getCalculatedTime);
        const validTimes = calculatedTimes.filter(t => t !== Infinity);
        bestTimeEl.textContent = validTimes.length ? formatTime(Math.min(...validTimes)) : '-';
        worstTimeEl.textContent = validTimes.length ? formatTime(Math.max(...validTimes)) : '-';
        averageTimeEl.textContent = validTimes.length ? formatTime(validTimes.reduce((a, b) => a + b, 0) / validTimes.length) : '-';
        ao5El.textContent = formatTime(getOlympicAverage(currentPuzzleSolves.slice(0, 5)));
        ao12El.textContent = formatTime(getOlympicAverage(currentPuzzleSolves.slice(0, 12)));
        const sessionAo5 = calculateSessionAverages(currentPuzzleSolves, 5);
        bestAo5El.textContent = formatTime(sessionAo5.best);
        worstAo5El.textContent = formatTime(sessionAo5.worst);
        const sessionAo12 = calculateSessionAverages(currentPuzzleSolves, 12);
        bestAo12El.textContent = formatTime(sessionAo12.best);
        worstAo12El.textContent = formatTime(sessionAo12.worst);
    }


    // --- LOCAL STORAGE & SESSION MANAGEMENT ---

    function saveData() {
        localStorage.setItem('cubingAppData', JSON.stringify(appData));
    }

    function getCurrentSession() {
        if (!appData.activeSessionId) return null;
        return appData.sessions.find(s => s.id === appData.activeSessionId);
    }

    function populateSessionSelector() {
        sessionSelectorEl.innerHTML = '';
        appData.sessions.forEach(session => {
            const option = document.createElement('option');
            option.value = session.id;
            option.textContent = session.name;
            if (session.id === appData.activeSessionId) {
                option.selected = true;
            }
            sessionSelectorEl.appendChild(option);
        });
    }

    function switchSession(sessionId) {
        appData.activeSessionId = sessionId;
        saveData();
        updateUI();
        generateScramble();
    }

    function createNewSession() {
        const sessionName = prompt('Enter a name for the new session:', `Session ${appData.sessions.length + 1}`);
        if (sessionName) {
            const newSession = {
                id: Date.now(),
                name: sessionName,
                solves: []
            };
            appData.sessions.push(newSession);
            appData.activeSessionId = newSession.id;
            populateSessionSelector();
            saveData();
            updateUI();
        }
    }

    function renameCurrentSession() {
        const currentSession = getCurrentSession();
        if (!currentSession) return;

        const newName = prompt('Enter the new name for the session:', currentSession.name);
        if (newName && newName !== currentSession.name) {
            currentSession.name = newName;
            populateSessionSelector();
            saveData();
        }
    }

    function deleteCurrentSession() {
        if (appData.sessions.length <= 1) {
            alert('You cannot delete the only session.');
            return;
        }
        const currentSession = getCurrentSession();
        if (confirm(`Are you sure you want to delete the session "${currentSession.name}"? This cannot be undone.`)) {
            appData.sessions = appData.sessions.filter(s => s.id !== currentSession.id);
            appData.activeSessionId = appData.sessions[0].id; // Switch to the first available session
            populateSessionSelector();
            saveData();
            updateUI();
        }
    }

    function loadData() {
        const savedData = localStorage.getItem('cubingAppData');
        if (savedData) {
            appData = JSON.parse(savedData);
        } else {
            // Migration from old format or first time launch
            const oldSolves = localStorage.getItem('cubingSolves');
            const defaultSession = {
                id: Date.now(),
                name: 'Default Session',
                solves: oldSolves ? JSON.parse(oldSolves) : []
            };
            appData.sessions.push(defaultSession);
            appData.activeSessionId = defaultSession.id;
            localStorage.removeItem('cubingSolves');
            saveData();
        }

        if (!appData.sessions || appData.sessions.length === 0) {
             const defaultSession = {
                id: Date.now(),
                name: 'Default Session',
                solves: []
            };
            appData.sessions.push(defaultSession);
            appData.activeSessionId = defaultSession.id;
            saveData();
        }
    }

    function startInspection() {
        timerState = 'inspecting';
        inspectionPenalty = 0;
        let inspectionElapsed = 0;
        timerEl.textContent = 15;
        timerEl.classList.add('timer-inspecting');

        inspectionInterval = setInterval(() => {
            inspectionElapsed++;
            const timeRemaining = 15 - inspectionElapsed;
            timerEl.textContent = timeRemaining;

            // Visual warnings
            if (inspectionElapsed === 8 || inspectionElapsed === 12) {
                timerEl.style.color = '#facc15'; // yellow-400
                setTimeout(() => { timerEl.style.color = ''; }, 500);
            }

            // +2 Penalty period
            if (inspectionElapsed >= 15 && inspectionElapsed < 17) {
                inspectionPenalty = 1; // +2
                timerEl.textContent = '+2';
            }

            // DNF
            if (inspectionElapsed >= 17) {
                clearInterval(inspectionInterval);
                inspectionPenalty = Infinity; // DNF
                timerEl.textContent = 'DNF';
                timerState = 'stopped';
                addSolve(Infinity); // Log the DNF solve automatically
                setTimeout(() => {
                    generateScramble();
                }, 1000);
            }
        }, 1000);
    }

    // --- INITIALIZATION ---
    function init() {
        useInspection = localStorage.getItem('useInspection') === 'true';
        loadData();
        populateSessionSelector();
        generateScramble();
        updateUI();
    }


    init();
});
