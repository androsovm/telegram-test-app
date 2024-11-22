import WebApp from '@twa-dev/sdk'

class PenaltyGame {
    constructor() {
        this.score = 0;
        this.attempt = 1;
        this.maxAttempts = 5;
        this.isAnimating = false;

        this.initializeElements();
        this.initializeEventListeners();
        this.initializeTelegram();
    }

    initializeElements() {
        this.scoreElement = document.getElementById('score');
        this.attemptElement = document.getElementById('attempt');
        this.goalkeeper = document.querySelector('.goalkeeper');
        this.ball = document.querySelector('.ball');
    }

    initializeEventListeners() {
        document.getElementById('shoot-left').addEventListener('click', () => this.shoot('left'));
        document.getElementById('shoot-center').addEventListener('click', () => this.shoot('center'));
        document.getElementById('shoot-right').addEventListener('click', () => this.shoot('right'));
    }

    initializeTelegram() {
        WebApp.ready();
        WebApp.MainButton.setText('НОВАЯ ИГРА');
        WebApp.MainButton.show();
        WebApp.MainButton.onClick(() => this.resetGame());
    }

    shoot(direction) {
        if (this.isAnimating || this.attempt > this.maxAttempts) return;

        this.isAnimating = true;
        const goalkeeperDirection = this.getRandomDirection();
        
        // Анимация вратаря
        this.goalkeeper.style.left = {
            'left': '20%',
            'center': '50%',
            'right': '80%'
        }[goalkeeperDirection];

        // Анимация мяча
        this.ball.classList.add('shooting');
        this.ball.style.left = {
            'left': '20%',
            'center': '50%',
            'right': '80%'
        }[direction];

        // Определяем гол
        const isGoal = direction !== goalkeeperDirection;

        setTimeout(() => {
            if (isGoal) {
                this.score++;
                this.scoreElement.textContent = this.score;
                WebApp.showPopup({
                    message: 'ГОЛ! 🎉'
                });
            } else {
                WebApp.showPopup({
                    message: 'Вратарь отбил! 🧤'
                });
            }

            setTimeout(() => {
                this.ball.classList.remove('shooting');
                this.ball.style.left = '50%';
                this.goalkeeper.style.left = '50%';
                this.isAnimating = false;

                this.attempt++;
                this.attemptElement.textContent = Math.min(this.attempt, this.maxAttempts);

                if (this.attempt > this.maxAttempts) {
                    this.endGame();
                }
            }, 1000);
        }, 500);
    }

    getRandomDirection() {
        const directions = ['left', 'center', 'right'];
        return directions[Math.floor(Math.random() * directions.length)];
    }

    endGame() {
        WebApp.showPopup({
            message: `Игра окончена! Ваш счёт: ${this.score} из ${this.maxAttempts}`,
            buttons: [{
                text: "Новая игра",
                type: "ok"
            }]
        }).then(() => {
            this.resetGame();
        });
    }

    resetGame() {
        this.score = 0;
        this.attempt = 1;
        this.scoreElement.textContent = this.score;
        this.attemptElement.textContent = this.attempt;
        this.goalkeeper.style.left = '50%';
        this.ball.style.left = '50%';
    }
}

// Инициализация игры
new PenaltyGame();