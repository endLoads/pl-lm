(function () {
    'use strict';

    // Основной объект плагина калькулятора
    var Calculator = {
        name: 'calculator',
        version: '1.0.0',
        debug: false,
        settings: {
            enabled: true,
            theme: 'default', // default, dark, light
            history_enabled: true,
            sound_enabled: false
        },
        history: [],
        isOpen: false
    };

    // CSS стили для калькулятора
    var calculatorCSS = `
        .calculator-modal {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.8);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 10000;
            opacity: 0;
            transition: opacity 0.3s ease;
        }
        
        .calculator-modal.show {
            opacity: 1;
        }
        
        .calculator-container {
            background: var(--color-background, #1a1a1a);
            border-radius: 12px;
            padding: 20px;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
            max-width: 400px;
            width: 90%;
            border: 2px solid var(--color-border, #333);
            transform: scale(0.8);
            transition: transform 0.3s ease;
        }
        
        .calculator-modal.show .calculator-container {
            transform: scale(1);
        }
        
        .calculator-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 20px;
            padding-bottom: 10px;
            border-bottom: 1px solid var(--color-border, #333);
        }
        
        .calculator-title {
            color: var(--color-text, #fff);
            font-size: 18px;
            font-weight: bold;
        }
        
        .calculator-close {
            background: none;
            border: none;
            color: var(--color-text, #fff);
            font-size: 24px;
            cursor: pointer;
            padding: 5px;
            border-radius: 50%;
            transition: background 0.2s ease;
        }
        
        .calculator-close:hover {
            background: rgba(255, 255, 255, 0.1);
        }
        
        .calculator-display {
            background: var(--color-input-background, #2a2a2a);
            border: 1px solid var(--color-border, #444);
            border-radius: 8px;
            padding: 15px;
            margin-bottom: 20px;
            text-align: right;
            color: var(--color-text, #fff);
            font-size: 24px;
            font-family: 'Courier New', monospace;
            min-height: 60px;
            display: flex;
            flex-direction: column;
            justify-content: center;
        }
        
        .calculator-expression {
            font-size: 14px;
            color: var(--color-text-secondary, #aaa);
            margin-bottom: 5px;
        }
        
        .calculator-result {
            font-size: 28px;
            font-weight: bold;
        }
        
        .calculator-buttons {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 10px;
        }
        
        .calculator-btn {
            background: var(--color-button-background, #3a3a3a);
            border: 1px solid var(--color-border, #555);
            color: var(--color-text, #fff);
            border-radius: 8px;
            padding: 15px;
            font-size: 18px;
            cursor: pointer;
            transition: all 0.2s ease;
            user-select: none;
        }
        
        .calculator-btn:hover {
            background: var(--color-button-hover, #4a4a4a);
            transform: translateY(-1px);
        }
        
        .calculator-btn:active {
            transform: translateY(0);
            box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.3);
        }
        
        .calculator-btn.operator {
            background: var(--color-accent, #007bff);
            color: white;
        }
        
        .calculator-btn.operator:hover {
            background: var(--color-accent-hover, #0056b3);
        }
        
        .calculator-btn.equals {
            background: var(--color-success, #28a745);
            color: white;
        }
        
        .calculator-btn.equals:hover {
            background: var(--color-success-hover, #1e7e34);
        }
        
        .calculator-btn.clear {
            background: var(--color-danger, #dc3545);
            color: white;
        }
        
        .calculator-btn.clear:hover {
            background: var(--color-danger-hover, #c82333);
        }
        
        .calculator-btn.zero {
            grid-column: span 2;
        }
        
        .calculator-history {
            max-height: 150px;
            overflow-y: auto;
            margin-top: 15px;
            padding-top: 15px;
            border-top: 1px solid var(--color-border, #333);
        }
        
        .calculator-history-item {
            color: var(--color-text-secondary, #aaa);
            font-size: 14px;
            padding: 5px 0;
            border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }
        
        .calculator-history-expression {
            color: var(--color-text, #fff);
        }
        
        .calculator-settings {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-top: 15px;
            padding-top: 15px;
            border-top: 1px solid var(--color-border, #333);
        }
        
        .calculator-setting {
            display: flex;
            align-items: center;
            gap: 5px;
            color: var(--color-text-secondary, #aaa);
            font-size: 12px;
        }
        
        .calculator-setting input[type="checkbox"] {
            margin: 0;
        }
    `;

    // Функция для создания HTML структуры калькулятора
    function createCalculatorHTML() {
        return `
            <div class="calculator-modal" id="calculator-modal">
                <div class="calculator-container">
                    <div class="calculator-header">
                        <div class="calculator-title">Калькулятор</div>
                        <button class="calculator-close" onclick="Calculator.close()">&times;</button>
                    </div>
                    
                    <div class="calculator-display">
                        <div class="calculator-expression" id="calculator-expression"></div>
                        <div class="calculator-result" id="calculator-result">0</div>
                    </div>
                    
                    <div class="calculator-buttons">
                        <button class="calculator-btn clear" onclick="Calculator.clearAll()">C</button>
                        <button class="calculator-btn clear" onclick="Calculator.clearEntry()">CE</button>
                        <button class="calculator-btn operator" onclick="Calculator.inputOperator('/')">/</button>
                        <button class="calculator-btn operator" onclick="Calculator.inputOperator('*')">×</button>
                        
                        <button class="calculator-btn" onclick="Calculator.inputNumber('7')">7</button>
                        <button class="calculator-btn" onclick="Calculator.inputNumber('8')">8</button>
                        <button class="calculator-btn" onclick="Calculator.inputNumber('9')">9</button>
                        <button class="calculator-btn operator" onclick="Calculator.inputOperator('-')">-</button>
                        
                        <button class="calculator-btn" onclick="Calculator.inputNumber('4')">4</button>
                        <button class="calculator-btn" onclick="Calculator.inputNumber('5')">5</button>
                        <button class="calculator-btn" onclick="Calculator.inputNumber('6')">6</button>
                        <button class="calculator-btn operator" onclick="Calculator.inputOperator('+')">+</button>
                        
                        <button class="calculator-btn" onclick="Calculator.inputNumber('1')">1</button>
                        <button class="calculator-btn" onclick="Calculator.inputNumber('2')">2</button>
                        <button class="calculator-btn" onclick="Calculator.inputNumber('3')">3</button>
                        <button class="calculator-btn equals" onclick="Calculator.calculate()" rowspan="2">=</button>
                        
                        <button class="calculator-btn zero" onclick="Calculator.inputNumber('0')">0</button>
                        <button class="calculator-btn" onclick="Calculator.inputNumber('.')">.</button>
                        <button class="calculator-btn equals" onclick="Calculator.calculate()">=</button>
                    </div>
                    
                    <div class="calculator-history" id="calculator-history" style="display: none;"></div>
                    
                    <div class="calculator-settings">
                        <div class="calculator-setting">
                            <input type="checkbox" id="history-toggle" checked onchange="Calculator.toggleHistory()">
                            <label for="history-toggle">История</label>
                        </div>
                        <div class="calculator-setting">
                            <input type="checkbox" id="sound-toggle" onchange="Calculator.toggleSound()">
                            <label for="sound-toggle">Звук</label>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    // Расширение объекта Calculator функциями
    Calculator.currentInput = '';
    Calculator.expression = '';
    Calculator.result = 0;
    Calculator.lastResult = null;
    Calculator.awaitingOperand = false;

    // Инициализация калькулятора
    Calculator.init = function() {
        if (this.debug) console.log('Calculator: Инициализация плагина');
        
        // Добавляем стили
        if (!document.getElementById('calculator-styles')) {
            var style = document.createElement('style');
            style.id = 'calculator-styles';
            style.textContent = calculatorCSS;
            document.head.appendChild(style);
        }

        // Добавляем пункт в меню настроек
        this.addToSettings();
        
        // Добавляем горячие клавиши
        this.addKeyboardListener();
        
        if (this.debug) console.log('Calculator: Плагин успешно инициализирован');
    };

    // Добавление в меню настроек
    Calculator.addToSettings = function() {
        try {
            Lampa.SettingsApi.addComponent({
                component: 'calculator',
                name: 'Калькулятор',
                icon: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none"><rect x="4" y="2" width="16" height="20" rx="2" stroke="currentColor" stroke-width="2"/><rect x="8" y="6" width="8" height="2" fill="currentColor"/><circle cx="8" cy="12" r="1" fill="currentColor"/><circle cx="12" cy="12" r="1" fill="currentColor"/><circle cx="16" cy="12" r="1" fill="currentColor"/><circle cx="8" cy="16" r="1" fill="currentColor"/><circle cx="12" cy="16" r="1" fill="currentColor"/><circle cx="16" cy="16" r="1" fill="currentColor"/></svg>'
            });

            Lampa.SettingsApi.addParam({
                component: 'calculator',
                param: {
                    name: 'calculator_enabled',
                    type: 'trigger',
                    default: true,
                    value: this.settings.enabled
                },
                field: {
                    name: 'Включить калькулятор',
                    description: 'Добавляет калькулятор в интерфейс Lampa'
                },
                onChange: function(value) {
                    Calculator.settings.enabled = value;
                    Calculator.saveSettings();
                }
            });

            Lampa.SettingsApi.addParam({
                component: 'calculator',
                param: {
                    name: 'calculator_open',
                    type: 'button'
                },
                field: {
                    name: 'Открыть калькулятор',
                    description: 'Открыть калькулятор для выполнения вычислений'
                },
                onChange: function() {
                    Calculator.open();
                }
            });

        } catch (e) {
            if (this.debug) console.error('Calculator: Ошибка при добавлении в настройки:', e);
        }
    };

    // Открытие калькулятора
    Calculator.open = function() {
        if (!this.settings.enabled) return;
        
        if (this.isOpen) return;
        this.isOpen = true;

        // Удаляем существующий модал, если есть
        var existingModal = document.getElementById('calculator-modal');
        if (existingModal) {
            existingModal.remove();
        }

        // Создаем новый модал
        var modalHTML = createCalculatorHTML();
        document.body.insertAdjacentHTML('beforeend', modalHTML);

        // Показываем модал с анимацией
        var modal = document.getElementById('calculator-modal');
        setTimeout(() => {
            modal.classList.add('show');
        }, 10);

        // Обновляем дисплей
        this.updateDisplay();
        
        // Показываем историю, если включена
        if (this.settings.history_enabled) {
            this.showHistory();
        }

        // Фокус на модал для обработки клавиш
        modal.focus();

        if (this.debug) console.log('Calculator: Калькулятор открыт');
    };

    // Закрытие калькулятора
    Calculator.close = function() {
        var modal = document.getElementById('calculator-modal');
        if (modal) {
            modal.classList.remove('show');
            setTimeout(() => {
                modal.remove();
                Calculator.isOpen = false;
            }, 300);
        }
        
        if (this.debug) console.log('Calculator: Калькулятор закрыт');
    };

    // Ввод числа
    Calculator.inputNumber = function(num) {
        if (this.awaitingOperand) {
            this.currentInput = num;
            this.awaitingOperand = false;
        } else {
            this.currentInput = this.currentInput === '0' ? num : this.currentInput + num;
        }
        this.updateDisplay();
        this.playSound();
    };

    // Ввод оператора
    Calculator.inputOperator = function(operator) {
        if (this.currentInput === '' && operator === '-') {
            this.currentInput = '-';
            this.updateDisplay();
            return;
        }

        if (this.currentInput !== '') {
            if (this.expression !== '' && !this.awaitingOperand) {
                this.calculate();
            } else {
                this.result = parseFloat(this.currentInput);
            }
        }

        this.expression = this.result + ' ' + (operator === '*' ? '×' : operator) + ' ';
        this.currentInput = '';
        this.awaitingOperand = true;
        this.updateDisplay();
        this.playSound();
    };

    // Вычисление результата
    Calculator.calculate = function() {
        if (this.expression === '' || this.currentInput === '') return;

        try {
            var fullExpression = this.expression.replace('×', '*') + this.currentInput;
            var calculationResult = eval(fullExpression);
            
            // Округляем результат до разумного количества знаков
            if (calculationResult % 1 !== 0) {
                calculationResult = parseFloat(calculationResult.toFixed(10));
            }

            // Добавляем в историю
            if (this.settings.history_enabled) {
                this.addToHistory(this.expression + this.currentInput, calculationResult);
            }

            this.result = calculationResult;
            this.lastResult = calculationResult;
            this.currentInput = calculationResult.toString();
            this.expression = '';
            this.awaitingOperand = true;
            
            this.updateDisplay();
            this.playSound('success');
            
        } catch (e) {
            this.currentInput = 'Ошибка';
            this.updateDisplay();
            this.playSound('error');
            
            setTimeout(() => {
                this.clearAll();
            }, 1500);
        }
    };

    // Очистка всего
    Calculator.clearAll = function() {
        this.currentInput = '';
        this.expression = '';
        this.result = 0;
        this.awaitingOperand = false;
        this.updateDisplay();
        this.playSound();
    };

    // Очистка текущего ввода
    Calculator.clearEntry = function() {
        this.currentInput = '';
        this.updateDisplay();
        this.playSound();
    };

    // Обновление дисплея
    Calculator.updateDisplay = function() {
        var expressionEl = document.getElementById('calculator-expression');
        var resultEl = document.getElementById('calculator-result');
        
        if (expressionEl && resultEl) {
            expressionEl.textContent = this.expression;
            resultEl.textContent = this.currentInput || '0';
        }
    };

    // Добавление в историю
    Calculator.addToHistory = function(expression, result) {
        this.history.unshift({
            expression: expression,
            result: result,
            timestamp: new Date()
        });

        // Ограничиваем размер истории
        if (this.history.length > 50) {
            this.history = this.history.slice(0, 50);
        }

        this.saveSettings();
        this.updateHistoryDisplay();
    };

    // Показать/скрыть историю
    Calculator.toggleHistory = function() {
        this.settings.history_enabled = !this.settings.history_enabled;
        this.saveSettings();
        
        if (this.settings.history_enabled) {
            this.showHistory();
        } else {
            this.hideHistory();
        }
    };

    // Показать историю
    Calculator.showHistory = function() {
        var historyEl = document.getElementById('calculator-history');
        if (historyEl) {
            historyEl.style.display = 'block';
            this.updateHistoryDisplay();
        }
    };

    // Скрыть историю
    Calculator.hideHistory = function() {
        var historyEl = document.getElementById('calculator-history');
        if (historyEl) {
            historyEl.style.display = 'none';
        }
    };

    // Обновление отображения истории
    Calculator.updateHistoryDisplay = function() {
        var historyEl = document.getElementById('calculator-history');
        if (!historyEl || !this.settings.history_enabled) return;

        var historyHTML = '';
        this.history.slice(0, 10).forEach(function(item) {
            historyHTML += `
                <div class="calculator-history-item">
                    <div class="calculator-history-expression">${item.expression} = ${item.result}</div>
                </div>
            `;
        });

        historyEl.innerHTML = historyHTML || '<div class="calculator-history-item">История пуста</div>';
    };

    // Переключение звука
    Calculator.toggleSound = function() {
        this.settings.sound_enabled = !this.settings.sound_enabled;
        this.saveSettings();
    };

    // Воспроизведение звука
    Calculator.playSound = function(type = 'click') {
        if (!this.settings.sound_enabled) return;

        try {
            var frequency = type === 'success' ? 800 : type === 'error' ? 200 : 400;
            var context = new (window.AudioContext || window.webkitAudioContext)();
            var oscillator = context.createOscillator();
            var gainNode = context.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(context.destination);
            
            oscillator.frequency.value = frequency;
            oscillator.type = 'sine';
            
            gainNode.gain.setValueAtTime(0.1, context.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, context.currentTime + 0.1);
            
            oscillator.start(context.currentTime);
            oscillator.stop(context.currentTime + 0.1);
        } catch (e) {
            // Игнорируем ошибки звука
        }
    };

    // Обработка клавиатуры
    Calculator.addKeyboardListener = function() {
        document.addEventListener('keydown', function(e) {
            if (!Calculator.isOpen) return;

            e.preventDefault();
            
            switch(e.key) {
                case '0': case '1': case '2': case '3': case '4':
                case '5': case '6': case '7': case '8': case '9':
                    Calculator.inputNumber(e.key);
                    break;
                case '.':
                    Calculator.inputNumber('.');
                    break;
                case '+': case '-':
                    Calculator.inputOperator(e.key);
                    break;
                case '*':
                    Calculator.inputOperator('*');
                    break;
                case '/':
                    Calculator.inputOperator('/');
                    break;
                case 'Enter': case '=':
                    Calculator.calculate();
                    break;
                case 'Escape':
                    Calculator.close();
                    break;
                case 'Backspace':
                    Calculator.clearEntry();
                    break;
                case 'Delete':
                    Calculator.clearAll();
                    break;
            }
        });
    };

    // Сохранение настроек
    Calculator.saveSettings = function() {
        try {
            var settings = {
                enabled: this.settings.enabled,
                theme: this.settings.theme,
                history_enabled: this.settings.history_enabled,
                sound_enabled: this.settings.sound_enabled,
                history: this.history
            };
            localStorage.setItem('calculator_settings', JSON.stringify(settings));
        } catch (e) {
            if (this.debug) console.error('Calculator: Ошибка сохранения настроек:', e);
        }
    };

    // Загрузка настроек
    Calculator.loadSettings = function() {
        try {
            var saved = localStorage.getItem('calculator_settings');
            if (saved) {
                var settings = JSON.parse(saved);
                Object.assign(this.settings, settings);
                this.history = settings.history || [];
            }
        } catch (e) {
            if (this.debug) console.error('Calculator: Ошибка загрузки настроек:', e);
        }
    };

    // Экспорт объекта в глобальную область
    window.Calculator = Calculator;

    // Инициализация при загрузке Lampa
    if (window.Lampa) {
        Calculator.loadSettings();
        Calculator.init();
    } else {
        document.addEventListener('DOMContentLoaded', function() {
            var checkLampa = setInterval(function() {
                if (window.Lampa) {
                    clearInterval(checkLampa);
                    Calculator.loadSettings();
                    Calculator.init();
                }
            }, 100);
        });
    }

    if (Calculator.debug) console.log('Calculator: Плагин загружен');

})();