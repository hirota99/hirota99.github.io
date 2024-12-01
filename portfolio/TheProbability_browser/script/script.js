class Game {
    constructor() {
        this.currentFloor = 1; // 現在の階層
        this.maxFloor = 1048576; // クリア条件
        this.storyMessages = [
            "このゲームは1/2の確率を当て続けてゴールを目指すゲームです。",
            "右か左か完全にランダムの正解を、20回連続で当て続ける必要があります。",
            "成功した暁には、あなたは『1/1,048,576』の確率を当てた幸運の持ち主となります。",
            "ただし、途中で失敗したら最初からやり直しになりますのでご注意ください。",
            "それでは、あなたの運を見せてもらいましょう・・・",
        ];
        this.currentMessageIndex = 0;

        // 要素取得
        this.titleScreen = document.getElementById('titleScreen');
        this.storyScreen = document.getElementById('storyScreen');
        this.gameContainer = document.getElementById('gameContainer');
        this.historyButton = document.getElementById('historyButton');
        this.historyPopup = document.getElementById('historyPopup');
        this.closePopupButton = document.getElementById('closePopupButton');
        this.downloadButton = document.getElementById('downloadButton');
        this.storyMessageElement = document.getElementById('storyMessage');
        this.statusElement = document.getElementById('status');
        this.messageElement = document.getElementById("message"); // メッセージ表示用要素
        this.gameMessageElement = document.getElementById('gameMessage');
        this.backToTitleButton = document.getElementById('backToTitleButton');
        this.retryButton = document.getElementById('retryButton'); // リトライボタン
        this.whiteout = document.getElementById('whiteout'); // ホワイトアウト要素
        this.blackout = document.getElementById('blackout'); // ブラックアウト要素

        // イベントリスナー
        document.getElementById('startButton').addEventListener('click', () => this.startStory());
        this.historyButton.addEventListener('click', () => this.showHistoryPopup());
        this.closePopupButton.addEventListener('click', () => this.closeHistoryPopup());

        document.getElementById('nextButton').addEventListener('click', () => this.showNextStory());
        document.getElementById('doorA').addEventListener('click', () => this.selectDoor('A'));
        document.getElementById('doorB').addEventListener('click', () => this.selectDoor('B'));
        this.backToTitleButton.addEventListener('click', () => this.returnToTitle());
        this.retryButton.addEventListener('click', () => this.retryGame());
    }

    // 制作ヒストリーポップアップを表示
    showHistoryPopup() {
        this.historyPopup.classList.remove('hidden'); // 非表示クラスを削除
        setTimeout(() => {
            this.historyPopup.classList.add('visible'); // トランジション効果で表示
        }, 10); // クラス付与のタイミングをずらしてアニメーションを実行
    }

    // 制作ヒストリーポップアップを非表示
    closeHistoryPopup() {
        this.historyPopup.classList.remove('visible'); // トランジション効果で非表示
        setTimeout(() => {
            this.historyPopup.classList.add('hidden'); // 完全に非表示に
        }, 2000); // トランジション時間に合わせて待機
    }

    // タイトル画面からストーリー画面へ
    startStory() {
        this.triggerWhiteout(() => {
            this.titleScreen.style.display = 'none'; // タイトル画面を非表示
            this.storyScreen.style.display = 'flex'; // ストーリー画面を表示
            this.currentMessageIndex = 0; // メッセージインデックスをリセット
            this.showStoryMessage();
        });
    }

    // ストーリーメッセージのトランジション表示
    showStoryMessage() {
        const message = this.storyMessages[this.currentMessageIndex];
        this.storyMessageElement.classList.remove('visible'); // 透明化
        setTimeout(() => {
            this.storyMessageElement.textContent = message; // 新しいテキストを設定
            this.storyMessageElement.classList.add('visible'); // フェードイン
        }, 500); // 前のメッセージが消えるまで待機
    }

    // 次のストーリーメッセージを表示
    showNextStory() {
        this.currentMessageIndex++;
        if (this.currentMessageIndex < this.storyMessages.length) {
            this.showStoryMessage(); // 次のメッセージを表示
        } else {
            // ストーリー終了後、ホワイトアウトでゲーム画面へ
            this.triggerWhiteout(() => {
                this.storyScreen.style.display = 'none'; // ストーリー画面を非表示
                this.gameContainer.style.display = 'flex'; // ゲーム画面を表示
                this.updateStatus();
                this.updateMessage("進む扉を選んでください。", 100); // 文字を順番に表示していく
            });
        }
    }

    // ホワイトアウトトランジション
    triggerWhiteout(callback) {
        this.whiteout.classList.add('active'); // ホワイトアウトを有効化
        setTimeout(() => {
            callback(); // コールバック関数を実行
            setTimeout(() => {
                this.whiteout.classList.remove('active'); // ホワイトアウトを無効化
            }, 1000); // トランジション終了後に非アクティブ化
        }, 1000); // ホワイトアウトが完全に白くなるまで待機
    }

    // ブラックアウトトランジション
    triggerBlackout(callback) {
        this.blackout.classList.add('active'); // ブラックアウトを有効化
        setTimeout(() => {
            callback(); // コールバック関数を実行
            setTimeout(() => {
                this.blackout.classList.remove('active'); // ブラックアウトを無効化
            }, 1000); // トランジション終了後に非アクティブ化
        }, 1000); // ブラックアウトが完全に黒くなるまで待機
    }

    // ゲームメッセージ更新
    updateMessage(message, speed = 100) {
        const messageContainer = this.gameMessageElement; // メッセージ表示コンテナ
        let charIndex = 0; // 現在表示中の文字インデックス
        messageContainer.textContent = ""; // 初期化

        // 1文字ずつメッセージを表示する関数
        const typeWriter = () => {
            if (charIndex < message.length) {
                messageContainer.textContent += message[charIndex]; // 次の文字を追加
                charIndex++; // インデックスを進める
                setTimeout(typeWriter, speed); // 指定したスピードで次の文字を表示
            }
        };

        typeWriter(); // タイピング効果を開始
    }

    // ステータス更新
    updateStatus() {
        this.statusElement.textContent = `現在の階層: ${this.currentFloor}  / 1,048,576`;
    }

    // 扉選択処理
    selectDoor(choice) {
        const correctChoice = Math.random() < 0.5 ? 'A' : 'B'; // ランダムで正解を決定
        const isCorrect = choice === correctChoice;

        // ドット表示と結果メッセージの表示を行う
        this.displayResult(isCorrect);

        if (isCorrect) {
            // 正解時の処理は displayResult 内で実行
            if (this.currentFloor >= this.maxFloor) {
                setTimeout(() => {
                    this.updateMessage("おめでとうございます！ゲームクリア！", 100);
                    this.resetGame();
                }, 2500); // ドット表示終了後にクリア処理を実行
            }
        }
    }

    // 扉選択時の結果表示処理
    displayResult(isCorrect) {
        const messageContainer = document.querySelector('.message');
        const delayBetweenDots = 500; // ドット間の遅延（ミリ秒）
        const dots = "・・・・・"; // ドット表示用の文字列
        let currentDotIndex = 0;

        // ドットを一文字ずつ表示する関数
        const showDots = () => {
            if (currentDotIndex < dots.length) {
                messageContainer.textContent += dots[currentDotIndex];
                currentDotIndex++;
                setTimeout(showDots, delayBetweenDots);
            } else {
                setTimeout(() => {
                    if (isCorrect) {
                        messageContainer.textContent = "正解！次のフロアに進みます";
                        this.currentFloor *= 2; // フロアを倍に
                        setTimeout(() => {
                            this.updateStatus();
                            messageContainer.textContent = "進む扉を選んでください。"; // メッセージをリセット
                        }, 2000);
                    } else {
                        // 「残念！ゲームオーバー」を表示
                        messageContainer.textContent = "残念！ゲームオーバー";
                        this.disableDoors(); // 扉を無効化
                        setTimeout(() => {
                            // メッセージを消し、リトライボタンを表示
                            messageContainer.textContent = "";
                            this.showRetryButton(messageContainer);
                        }, 2000); // 2秒後にボタンを表示
                    }
                }, 500); // ドットの最後の表示後の遅延
            }
        };

        // ドットの初期表示を開始
        messageContainer.textContent = ""; // メッセージをリセット
        showDots();
    }

    // 扉を無効化する関数
    disableDoors() {
        document.getElementById('doorA').classList.add('disabled');
        document.getElementById('doorB').classList.add('disabled');
    }

    // 扉を有効化する関数
    enableDoors() {
        document.getElementById('doorA').classList.remove('disabled');
        document.getElementById('doorB').classList.remove('disabled');
    }

    // リトライボタンを表示
    showRetryButton(container) {
        this.retryButton.classList.remove('hidden');
        this.retryButton.style.display = 'block';

        // ボタンをメッセージ表示部分に追加
        container.appendChild(this.retryButton);
    }

    // リトライボタンを押したときの処理
    retryGame() {
        this.retryButton.style.display = 'none'; // ボタンを非表示に
        this.enableDoors(); // 扉を再び有効化
        this.triggerWhiteout(() => {
            this.gameContainer.style.display = 'none'; // ゲーム画面を非表示
            this.storyScreen.style.display = 'flex'; // ストーリー画面を再表示
            this.currentMessageIndex = 0; // メッセージインデックスをリセット
            this.showStoryMessage(); // ストーリーメッセージを最初から表示
        });
    }

    // ゲームリセット処理
    resetGame() {
        setTimeout(() => {
            this.currentFloor = 1;
            this.updateStatus();
            this.updateMessage("扉を選んでください。");
        }, 2000); // 2秒後にリセット
    }

    // タイトル画面に戻る処理
    returnToTitle() {
        this.triggerBlackout(() => {
            this.gameContainer.style.display = 'none'; // ゲーム画面を非表示
            this.titleScreen.style.display = 'flex'; // タイトル画面を再表示
            this.currentFloor = 1; // ゲームデータの初期化
            this.updateStatus();
        });
    }
}

// ゲームインスタンスの初期化
window.onload = () => {
    new Game();
};