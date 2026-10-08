// 定義測驗題目資料陣列，包含題目、四個選項與正確答案索引（0-3）
let questions = [
  {
    text: "在 p5.js 中，哪一個函式用來設定畫布的大小？",
    options: ["setup()", "createCanvas()", "background()", "size()"],
    correct: 1
  },
  {
    text: "哪一個函式只會執行一次，常用來進行初始設定？",
    options: ["draw()", "setup()", "loop()", "preload()"],
    correct: 1
  },
  {
    text: "若要在畫布上畫一個圓形，應該使用哪一個指令？",
    options: ["rect()", "line()", "circle()", "triangle()"],
    correct: 2
  },
  {
    text: "下列哪一個系統變數代表目前滑鼠的 X 座標？",
    options: ["mouseX", "mouseY", "width", "height"],
    correct: 0
  },
  {
    text: "想要改變圖形內部的填滿顏色，應該使用什麼指令？",
    options: ["stroke()", "fill()", "background()", "color()"],
    correct: 1
  }
];

let currentQuestion = 0; // 記錄目前進行到第幾題
let score = 0;           // 記錄使用者答對的總題數
let selectedAnswer = -1; // 記錄使用者點選的選項索引，-1 代表尚未選擇
let isAnswered = false;  // 記錄目前題目是否已經作答完畢

let nextButton;          // 儲存「下一題」或「看結果」的按鈕物件
let animTimer = 0;       // 用於控制答錯時動畫的計時器（時間/角度）

function setup() {
  createCanvas(windowWidth, windowHeight); // 建立全螢幕畫布
  rectMode(CENTER);  // 設定矩形繪製模式為中央置中
  textAlign(CENTER, CENTER); // 設定文字對齊方式為水平置中與垂直置中
  
  // 建立「下一題」控制按鈕
  nextButton = createButton('下一題');
  nextButton.size(120, 40); // 設定按鈕寬高
  nextButton.mousePressed(goToNextQuestion); // 設定按鈕點擊事件的觸發函式
  nextButton.hide(); // 初始時先隱藏按鈕，等玩家作答後才顯示
}

function draw() {
  background(245, 247, 250); // 設定淡灰色背景，讓畫面看起來乾淨舒適

  // 判斷是否已經回答完所有題目
  if (currentQuestion >= questions.length) {
    drawScoreScreen(); // 如果題目結束，繪製最終結算得分畫面
  } else {
    drawQuizScreen();  // 如果還有題目，繪製測驗畫面
  }
}

// 繪製測驗畫面主程式
function drawQuizScreen() {
  let q = questions[currentQuestion]; // 取得當前題目的資料
  
  // 更新動畫計時器
  animTimer += 0.2; 

  // --- 1. 繪製題目區（置中且帶有 e4d9ff 方框） ---
  let qBoxWidth = min(width * 0.8, 600); // 限制題目方框的最大寬度，避免過寬
  let qBoxHeight = 100;                  // 設定題目方框的高度
  let qX = width / 2;                    // 題目水平置中位置
  let qY = height * 0.25;                // 題目垂直位置（畫布上方 1/4 處）

  fill('#e4d9ff'); // 設定題目方框背景顏色為 e4d9ff
  stroke(180, 160, 230); // 設定方框邊框顏色
  strokeWeight(2); // 設定邊框粗細
  rect(qX, qY, qBoxWidth, qBoxHeight, 15); // 繪製圓角矩形方框

  noStroke(); // 關閉邊框，準備繪製文字
  fill(50);   // 設定文字為深灰色
  textSize(20); // 設定題目文字大小
  text(q.text, qX, qY, qBoxWidth - 40, qBoxHeight - 20); // 在方框內繪製置中題目，並限制文字範圍換行

  // --- 2. 繪製四個選項 ---
  let optWidth = min(width * 0.7, 500); // 設定選項方框的寬度
  let optHeight = 60;                   // 設定選項方框的高度
  let startY = height * 0.45;           // 第一個選項的起始垂直位置
  let gapY = 80;                        // 選項之間的垂直間距

  for (let i = 0; i < 4; i++) {
    let optX = width / 2; // 選項預設水平位置為畫面中央
    let optY = startY + i * gapY; // 計算每個選項的垂直位置
    
    let boxColor = color(255); // 預設選項方框背景為白色
    let textColor = color(50); // 預設選項文字顏色為深灰色

    // 如果已經作答，根據對錯套用指定的顏色與動畫位移
    if (isAnswered) {
      if (selectedAnswer === q.correct) {
        // 【狀況 A：使用者答對了】
        if (i === q.correct) {
          boxColor = color('#ffafcc'); // 正確答案顯示粉紅背景 ffafcc
        }
      } else {
        // 【狀況 B：使用者答錯了】
        if (i === q.correct) {
          boxColor = color('#ffafcc'); // 正確答案顯示粉紅背景 ffafcc
          optY += sin(animTimer) * 8;   // 正確答案進行上下跳動動畫（使用正弦波）
        } else if (i === selectedAnswer) {
          boxColor = color('#bde0fe'); // 答錯的選項顯示粉藍背景 bde0fe
          optX += sin(animTimer * 2) * 8; // 答錯的選項進行左右搖晃動畫
        }
      }
    }

    // 繪製選項方框
    fill(boxColor);
    stroke(200);
    strokeWeight(1);
    rect(optX, optY, optWidth, optHeight, 10); // 繪製圓角選項框

    // 繪製選項文字
    noStroke();
    fill(textColor);
    textSize(18);
    text(q.options[i], optX, optY, optWidth - 20, optHeight - 10);
  }

  // --- 3. 定位下一題按鈕 ---
  if (isAnswered) {
    nextButton.position(width / 2 - 60, startY + 4 * gapY); // 將按鈕精準定位在最後一個選項的下方
  }
}

// 監聽滑鼠點擊事件，判斷使用者點選了哪一個選項
function mousePressed() {
  // 如果已經作答完畢，或者已經完成所有題目，就忽略點擊選項的動作
  if (isAnswered || currentQuestion >= questions.length) return;

  let optWidth = min(width * 0.7, 500); // 取得與 draw 中相同的選項寬度
  let optHeight = 60;                   // 取得與 draw 中相同的選項高度
  let startY = height * 0.45;           // 取得第一個選項的起始位置
  let gapY = 80;                        // 取得選項間距

  // 檢查滑鼠點擊是否落在四個選項之一的範圍內
  for (let i = 0; i < 4; i++) {
    let optX = width / 2;
    let optY = startY + i * gapY;

    // 判斷滑鼠座標是否在該選項的矩形邊界內
    if (mouseX > optX - optWidth / 2 && mouseX < optX + optWidth / 2 &&
        mouseY > optY - optHeight / 2 && mouseY < optY + optHeight / 2) {
      
      selectedAnswer = i; // 記錄使用者點選的選項
      isAnswered = true;  // 設定狀態為已作答

      // 檢查是否答對
      if (selectedAnswer === questions[currentQuestion].correct) {
        score++; // 答對了，總分加一分
      }

      // 根據是否為最後一題，動態更改按鈕文字，並將其顯示出來
      if (currentQuestion === questions.length - 1) {
        nextButton.html('查看結果');
      } else {
        nextButton.html('下一題');
      }
      nextButton.show(); // 顯示下一題/看結果按鈕
      break; // 偵測到點擊後就跳出迴圈
    }
  }
}

// 點擊「下一題」按鈕後執行的功能
function goToNextQuestion() {
  currentQuestion++;   // 進入下一題索引
  selectedAnswer = -1; // 重設選擇的答案為未選擇
  isAnswered = false;  // 重設作答狀態為未作答
  nextButton.hide();   // 隱藏按鈕，直到下一題作答後才再次顯示
}

// 繪製最終結算得分畫面
function drawScoreScreen() {
  fill(50); // 設定文字顏色為深灰色
  textSize(32); // 設定大標題字型大小
  text("測驗結束！", width / 2, height * 0.4); // 顯示結束提示文字
  
  textSize(24); // 設定得分字型大小
  // 顯示最終答對題數與總題數
  text("您的總得分為: " + score + " / " + questions.length, width / 2, height * 0.5); 
}

// 當瀏覽器視窗大小改變時，自動重新調整全螢幕畫布大小，維持置中版面
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
