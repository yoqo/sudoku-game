class Sudoku {
  constructor(diff = "easy", preset) {
    this.DifficultyWords = ["easy", "normal", "hard", "hell"];
    this.Difficultys = [3.5, 5, 7, 10];
    this.Difficulty = this.Difficultys[this.DifficultyWords.indexOf(diff)];
    this.BASE = [1, 2, 3, 4, 5, 6, 7, 8, 9];

    this._sudoku = preset
      ? this.copy(preset)
      : [[], [], [], [], [], [], [], [], []];
    this.answer = [[], [], [], [], [], [], [], [], []];
    this.invalid = [];

    this.init();
  }
  setSudoku([row, col], value) {
    this._sudoku[row][col] = value;
    this.mapInvalid();
    return this.win();
  }
  getSudoku() {
    return this._sudoku;
  }
  blank() {
    let arr = [];
    for (let i = 0; i < 9; i++) {
      arr.push([]);
      for (let j = 0; j < 9; j++) {
        arr[i].push(0);
      }
    }
    return arr;
  }
  mapInvalid() {
    this.invalid = [];
    let base = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    let invalidRow = [];
    let invalidCol = [];
    let invalidGrid = [];
    // row duplicate
    for (let i = 0; i < 9; i++) {
      let row = this._sudoku[i];
      for (let n in base) {
        let invalid = [];
        for (let j = 0; j < 9; j++) {
          if (row[j] == base[n]) {
            invalid.push(j);
          }
        }
        if (invalid.length > 1) {
          invalidRow.push(...invalid.map((item) => [i, item]));
        }
      }
    }
    // col duplicate
    for (let i = 0; i < 9; i++) {
      let col = base.map((item, index) => {
        return this._sudoku[index][i];
      });
      for (let n in base) {
        let invalid = [];
        for (let j = 0; j < 9; j++) {
          if (col[j] == base[n]) {
            invalid.push(j);
          }
        }
        if (invalid.length > 1) {
          invalidCol.push(...invalid.map((item) => [item, i]));
        }
      }
    }
    // grid duplicate
    for (var i = 0; i < 3; i++) {
      for (var j = 0; j < 3; j++) {
        let grid = [[], [], []].map((item, index) => {
          return [
            this._sudoku[i * 3 + index][j * 3 + 0],
            this._sudoku[i * 3 + index][j * 3 + 1],
            this._sudoku[i * 3 + index][j * 3 + 2],
          ];
        });
        for (let n in base) {
          let invalid = [];
          for (var x = 0; x < 3; x++) {
            for (var y = 0; y < 3; y++) {
              if (grid[x][y] == base[n]) {
                invalid.push([x, y]);
              }
            }
          }

          if (invalid.length > 1) {
            invalidGrid.push(
              ...invalid.map((item) => [i * 3 + item[0], j * 3 + item[1]])
            );
          }
        }
      }
    }
    this.invalid = this.invalid.concat(invalidRow, invalidCol, invalidGrid);
    return this.invalid;
  }
  checkColumn(col, x) {
    for (var i = 0; i < 9; i++) {
      if (this._sudoku[i][col] === x) {
        return false;
      }
    }
    return true;
  }
  checkRow(row, x) {
    for (var j = 0; j < 9; j++) {
      if (this._sudoku[row][j] === x) {
        return false;
      }
    }
    return true;
  }
  checkBlock(row, col, x) {
    var startRow = Math.floor(row / 3) * 3;
    var startCol = Math.floor(col / 3) * 3;
    for (var i = 0; i < 3; i++) {
      for (var j = 0; j < 3; j++) {
        if (this._sudoku[startRow + i][startCol + j] === x) {
          return false;
        }
      }
    }
    return true;
  }
  check(i, j, x) {
    let b = this.checkBlock(i, j, x);
    let r = this.checkRow(i, x);
    let c = this.checkColumn(j, x);
    let success = b && r && c;
    return success;
  }
  columnOK(col) {
    var sum = 0;
    for (var i = 0; i < 9; i++) {
      sum += this._sudoku[i][col];
    }
    return sum === 45;
  }
  columnsOK() {
    for (var j = 0; j < 9; j++) {
      if (!this.columnOK(j)) {
        return false;
      }
    }
    return true;
  }
  rowOK(row) {
    var sum = 0;
    for (var j = 0; j < 9; j++) {
      sum += this._sudoku[row][j];
    }
    return sum === 45;
  }
  rowsOK() {
    for (var i = 0; i < 9; i++) {
      if (!this.rowOK(i)) {
        return false;
      }
    }
    return true;
  }
  blockOK(n) {
    var startRow = Math.floor((n - 1) / 3) * 3;
    var startCol = ((n - 1) % 3) * 3;
    var sum = 0;
    for (var i = 0; i < 3; i++) {
      for (var j = 0; j < 3; j++) {
        sum += this._sudoku[startRow + i][startCol + j];
      }
    }
    return sum === 45;
  }
  blocksOK() {
    for (var i = 1; i <= 9; i++) {
      if (!this.blockOK(i)) {
        return false;
      }
    }
    return true;
  }
  sudokuOK() {
    return this.columnsOK() && this.rowsOK() && this.blocksOK();
  }
  tryit(i, j) {
    if (i >= 9) {
      return true;
    }
    var s = i;
    var t = j + 1;
    if (t >= 9) {
      t -= 9;
      s++;
    }
    if (this._sudoku[i][j] !== 0) {
      var success = this.tryit(s, t);
      if (success) {
        return true;
      }
    }
    for (var k = 0; k < 9; k++) {
      if (this.check(i, j, this.BASE[k])) {
        this._sudoku[i][j] = this.BASE[k];
        var success = this.tryit(s, t);
        if (success) {
          return true;
        }
        this._sudoku[i][j] = 0;
      }
    }
    return false;
  }
  /**
   * After sorting 1-9 randomly, fill in block n
   */
  setBlockRandomly(n) {
    var startRow = Math.floor((n - 1) / 3) * 3;
    var startCol = ((n - 1) % 3) * 3;
    this.BASE.sort(this.randomComparator);
    for (var i = 0; i < 3; i++) {
      for (var j = 0; j < 3; j++) {
        this._sudoku[startRow + i][startCol + j] = this.BASE[i * 3 + j];
      }
    }
  }
  createSudoku() {
    this.clear(this._sudoku); // Assign the values of Sudoku to 0
    // Because these three block values are not related, they can be filled randomly
    // To reduce the number of searches
    this.setBlockRandomly(3);
    this.setBlockRandomly(5);
    this.setBlockRandomly(7);
    this.BASE.sort(this.randomComparator);
    var success = this.tryit(0, 0);
    return success;
  }
  randomComparator(a, b) {
    return 0.5 - Math.random();
  }
  clear(arr) {
    for (var i = 0; i < 9; i++) {
      for (var j = 0; j < 9; j++) {
        arr[i][j] = 0;
      }
    }
  }
  copy(arr) {
    var a = [[], [], [], [], [], [], [], [], []];
    for (var i = 0; i < 9; i++) {
      for (var j = 0; j < 9; j++) {
        a[i].push(arr[i][j]);
      }
    }
    return a;
  }
  createGame() {
    console.time("[create] Create success! time consuming: ");
    console.log("[create] Create Sudoku...");
    while (!this.createSudoku());
    console.timeEnd("[create] Create success! time consuming: ");
    this.answer = this.copy(this._sudoku);
    // The number of digs in each row is related to the difficulty
    for (var i = 0; i < 9; i++) {
      for (
        var j = 0;
        j < this.Difficulty + Math.floor(Math.random() * 2);
        j++
      ) {
        this._sudoku[i][Math.floor(Math.random() * 9)] = 0;
      }
    }
  }
  setDifficulty(diff) {
    this.Difficulty = this.Difficultys[this.DifficultyWords.indexOf(diff)];
  }
  win() {
    return this.sudokuOK() && this.invalid.length == 0;
  }
  init() {
    if (this._sudoku[0][0] === undefined) {
      this.createGame();
    }
  }
}

class Game {
  constructor() {
    this.DifficultyWords = ["easy", "normal", "hard", "hell"];
    this.levelNums = [40, 40, 40, 40];
    this.$home = $("#home");
    this.$title = $("#home .title");
    this.$game = $("#game");
    this.$board = $("#game #board");
    this.$boardGrid = $("#board #grid");
    this.$boardNumber = $("#board #number");
    this.$level = $("#level");
    this.$levelSelect = $("#level .difficulty");
    this.$levelList = $("#level .list");
    this.$win = $("#win");

    this.gridCls = "grid";
    this.gridNineCls = "grid-nine";
    this.gridTransparentCls = "grid-transparent";
    this.gridNumberCls = "grid-number";
    this.gridNumberInputCls = "grid-number-input";
    this.gridSmallCls = "grid-small";
    this.numberCls = "number";
    this.candidateCls = "candidate";

    // dom cache
    this.$levels = [];
    this.$gridNumbers = [];
    this.$gridGrids = [];

    // Level state
    this.dataUnlock = "data-unlock";
    // Grid state
    this.dataActive = "data-active";
    this.dataInvalid = "data-invalid";
    this.dataFreeze = "data-freeze";
    this.dataLight = "data-light";

    this.sudoku = null;
    this.sudokuStorage = JSON.parse(localStorage.getItem("SUDOKU")) || [];

    this.currentLevel = 0;

    this.DELETE_DELAY = 2000;

    this.audioSrcMusic = [
      "./sound/bgm/Zeta.m4a",
      "./sound/bgm/Eta.m4a",
      "./sound/bgm/waterFrogs.mp3",
    ];
    this.audioSrcSound = {
      success: "./sound/success.mp3",
      water: "./sound/water.mp3",
      bubble: "./sound/bubble.mp3",
    };
    this.bgm = new Audio();
    this.audioFadeTimer = null;

    this.init();
  }

  init() {
    this.renderLevel();
    this.renderBoard();
    this.unlockLevel();
    this.clickLevel();
    this.clickGridCell();
    this.clickSmallNumber();
    this.rightClickSmallNumber();
    this.clickBlank();
    this.enterGridCell();
    this.leaveGridCell();
  }
  switchPage(page) {
    let pages = ["home", "level", "game"];
    let index = pages.indexOf(page);
    if (!~index) return;
    this["$" + pages[index]].style.zIndex = "";
    if (index - 1 > -1) {
      this["$" + pages[index - 1]].style.zIndex = 0;
    }
  }
  home() {
    this.switchPage("home");
  }
  level() {
    this.switchPage("level");

    this.audioFadeOut(this.bgm);
  }
  start(level) {
    this.switchPage("game");
    this.randomColor();
    this.clearSmallNumber();

    clearTimeout(this.audioFadeTimer);
    this.playBgm();

    if (level) {
      this.currentLevel = level;
    } else if (this.currentLevel > 0) {
      level = this.currentLevel;
    } else {
      console.warn("You can't start without a level");
      return false;
    }

    let difficulty = this.levelToDifficulty(level);
    if (this.sudokuStorage.length < level) {
      // Generate new
      this.sudoku = new Sudoku(difficulty);
      this.sudokuStorage.push(this.copy(this.sudoku.getSudoku()));
      localStorage.setItem("SUDOKU", JSON.stringify(this.sudokuStorage));
    } else {
      // Read cache
      console.log(`[loading] level ${level}`);
      let currentSudoku = this.sudokuStorage[level - 1];
      this.sudoku = new Sudoku(difficulty, currentSudoku);
    }
    this.setInvalidGrid();
    this.fillBoard();
  }
  gameOver() {
    this.$win.classList.add("show");
    localStorage.setItem("SUDOKU_COMPLETE", this.currentLevel);
    this.unlockNextLevel();
    setTimeout(() => {
      this.audioPlay(this.audioSrcSound.success);
    }, 700);

    setTimeout(() => {
      this.$win.classList.remove("show");
      this.level();
    }, 3000);
  }
  restart() {
    let difficulty = this.levelToDifficulty(this.currentLevel);
    let currentSudoku = this.sudokuStorage[this.currentLevel - 1];
    this.sudoku = new Sudoku(difficulty, currentSudoku);
    this.setInvalidGrid();
    this.fillBoard();
    this.clearSmallNumber();
  }

  /*----------------- ui -----------------*/
  temporaryClass(dom, className, delay = this.DELETE_DELAY) {
    dom = dom instanceof Array ? dom : [dom];
    for (let i = 0; i < dom.length; i++) {
      dom[i].classList.add(className);
      setTimeout(() => {
        dom[i].classList.remove(className);
      }, delay);
    }
  }
  show() {
    let showCls = "show-flex";
    for (let i = 0; i < arguments.length; i++) {
      if (arguments[i].length) {
        for (let j = 0; j < arguments[i].length; j++) {
          arguments[i][j].classList.add(showCls);
        }
      } else {
        arguments[i].classList.add(showCls);
      }
    }
  }
  hide() {
    let showCls = "show-flex";
    for (let i = 0; i < arguments.length; i++) {
      if (arguments[i].length) {
        for (let j = 0; j < arguments[i].length; j++) {
          arguments[i][j].classList.remove(showCls);
        }
      } else {
        arguments[i].classList.remove(showCls);
      }
    }
  }
  randomColor() {
    let random = Math.ceil(Math.random() * 73); // 73 = 365 / 5
    this.$game.setAttribute("game-color", random);
  }
  highLight(gridIndex) {
    if (
      gridIndex == undefined ||
      this.$gridNumbers[gridIndex].getAttribute(this.dataFreeze) !== null
    ) {
      for (let i = 0; i < this.$gridGrids.length; i++) {
        this.$gridGrids[i].removeAttribute(this.dataLight);
      }
      return;
    }

    let [row, col] = this.gridIndexToMap(gridIndex);
    let girdStart = Math.floor(gridIndex / 9) * 9;
    let light = [];
    for (let i = 0; i < 9; i++) {
      light.push(this.mapToGridIndex([row, i]));
      light.push(this.mapToGridIndex([i, col]));
      light.push(girdStart + i);
    }
    light = [...new Set(light)];
    for (let i = 0; i < this.$gridGrids.length; i++) {
      if (light.includes(i)) {
        this.$gridGrids[i].setAttribute(this.dataLight, "");
      } else {
        this.$gridGrids[i].removeAttribute(this.dataLight);
      }
    }
  }

  /*----------------- event listener -----------------*/
  // Click level
  clickLevel() {
    addEvent(
      this.$levelList,
      "b",
      "click",
      ($this) => {
        let level = parseInt($this.innerHTML);
        this.start(level);
      },
      true
    );
  }
  // Click the grid to pop up small numbers
  clickGridCell() {
    addEvent(this.$boardNumber, "." + this.gridNumberCls, "click", ($this) => {
      let dataFreeze = $this.getAttribute(this.dataFreeze);
      let dataActive = $this.getAttribute(this.dataActive);
      this.inactiveGridNumber();
      if (dataFreeze !== null) return false;
      if (dataActive === null) {
        $this.setAttribute(this.dataActive, "");
        $this.classList.add(this.dataActive);
      }
    });
  }
  enterGridCell() {
    addEvent(
      this.$boardNumber,
      "." + this.gridNumberCls,
      "mouseenter",
      ($this) => {
        let index = parseInt($this.getAttribute("data-index"));
        this.highLight(index);
      },
      true
    );
  }
  leaveGridCell() {
    addEvent(
      this.$boardNumber,
      "." + this.gridNumberCls,
      "mouseleave",
      ($this) => {
        this.highLight();
      },
      true
    );
  }
  // Click the small number and fill in the grid
  clickSmallNumber() {
    addEvent(
      this.$boardNumber,
      "b",
      "click",
      ($this) => {
        let number = parseInt($this.innerHTML);
        let $gridNumber = findTarget($this, "." + this.gridNumberCls);
        // 填入选中数字
        this.setNumber($gridNumber, number);
      },
      true
    );
  }
  // Right click a small number to add a candidate
  rightClickSmallNumber() {
    addEvent(
      this.$boardNumber,
      "b",
      "contextmenu",
      ($this) => {
        let $gridNumber = findTarget($this, "." + this.gridNumberCls);
        $this.classList.contains(this.candidateCls)
          ? $this.classList.remove(this.candidateCls)
          : $this.classList.add(this.candidateCls);
        this.audioPlay(this.audioSrcSound.bubble, 0.5);
        this.setNumber($gridNumber, 0);
      },
      true
    );
  }
  // Click the blank to deactivate the status
  clickBlank() {
    document.addEventListener("click", (e) => {
      let isClickGridNumber = findTarget(e.target, "." + this.gridNumberCls);
      if (!isClickGridNumber) {
        this.inactiveGridNumber();
      }
    });
  }
  setNumber(gridNumber, number) {
    let grindIndex = gridNumber.dataset.index;
    let [row, col] = this.gridIndexToMap(grindIndex);
    let $number = gridNumber.children[1];

    $number.innerHTML = !number ? "" : number;
    if (number) {
      this.audioPlay(this.audioSrcSound.water, 0.7);
      this.clearSmallNumber(gridNumber);
      gridNumber.classList.remove(this.dataActive);
      setTimeout(() => {
        gridNumber.removeAttribute(this.dataActive);
      }, 60);
    } else {
      this.toggleSmallNumber(gridNumber);
    }
    // this.gameOver();

    let win = this.sudoku.setSudoku([row, col], number);
    if (win) {
      this.gameOver();
    } else {
      this.setInvalidGrid();
    }
  }
  clearSmallNumber(gridNumber) {
    let all = gridNumber === undefined;

    let clearAll = () => {
      for (let i = 0; i < this.$gridNumbers.length; i++) {
        let number = this.$gridNumbers[i].getAttribute("data-index");
        let smallActive =
          this.$gridNumbers[i].classList.contains("small-active");
        if (smallActive !== null) {
          clearOne(this.$gridNumbers[i]);
        }
      }
    };
    let clearOne = (gridNumber) => {
      let b = gridNumber.querySelectorAll("." + this.gridSmallCls + " b");
      for (let i = 0; i < b.length; i++) {
        b[i].classList.contains(this.candidateCls) &&
          b[i].classList.remove(this.candidateCls);
      }
      this.toggleSmallNumber(gridNumber);
    };

    all ? clearAll() : clearOne(gridNumber);
  }
  // Deactive all grids
  inactiveGridNumber() {
    for (let i = 0; i < this.$gridNumbers.length; i++) {
      this.$gridNumbers[i].removeAttribute(this.dataActive);
      this.$gridNumbers[i].classList.remove(this.dataActive);
    }
  }
  // Automatically switch the display and hiding of small numbers
  toggleSmallNumber(gridNumber) {
    let $smallNumber = gridNumber.children[2];
    if (!$smallNumber) return false;
    let b = $smallNumber.querySelectorAll("b");
    let hide = true;
    for (let i = 0; i < b.length; i++) {
      if (b[i].classList.contains(this.candidateCls)) {
        hide = false;
        break;
      }
    }
    if (!hide) {
      gridNumber.classList.add("small-active");
    } else {
      gridNumber.classList.remove("small-active");
    }
  }
  // Traversal setting grid invalid state
  setInvalidGrid() {
    let arr = this.sudoku.invalid;
    for (let i = 0; i < 9; i++) {
      for (let j = 0; j < 9; j++) {
        let invalid = false;
        for (let k = 0; k < arr.length; k++) {
          let [row, col] = arr[k];
          if (row == i && col == j) {
            invalid = true;
          }
        }

        let index = this.mapToGridIndex([i, j]);
        if (invalid) {
          if (!this.$gridNumbers[index].hasAttribute(this.dataInvalid))
            this.$gridNumbers[index].setAttribute(this.dataInvalid, "");
        } else {
          if (this.$gridNumbers[index].hasAttribute(this.dataInvalid))
            this.$gridNumbers[index].removeAttribute(this.dataInvalid);
        }
      }
    }
  }
  renderLevel() {
    let dom = [];
    let j = 1;
    for (let i in this.levelNums) {
      dom.push("<li>");
      for (let k = 0; k < this.levelNums[i]; k++) {
        dom.push(`<b>${j}</b>`);
        j++;
      }
      dom.push("</li>");
    }
    this.$levelList.innerHTML = dom.join("");

    this.levelTab(1);
    this.$levels = this.$levelList.querySelectorAll("b");
    this.unlockNextLevel();
  }
  levelTab(n) {
    this.$level.setAttribute("data-tab", n);
  }
  unlockLevel(all) {
    if (all) {
      for (let i = 0; i < this.$levels.length; i++) {
        this.$levels[i].setAttribute(this.dataUnlock, "");
      }
      return;
    }
    for (let i = 0; i < this.sudokuStorage.length; i++) {
      if (i < this.$levels.length) {
        this.$levels[i].setAttribute(this.dataUnlock, "");
      }
    }
  }
  unlockNextLevel() {
    let SUDOKU_COMPLETE = localStorage.getItem("SUDOKU_COMPLETE") || 0;
    for (let i = 0; i < Number(SUDOKU_COMPLETE) + 1; i++) {
      if (this.$levels[i]) {
        this.$levels[i].setAttribute(this.dataUnlock, "");
      }
    }
  }
  levelToDifficulty(level) {
    for (let i = 0; i < this.DifficultyWords.length; i++) {
      let max = 0;
      for (let j = 0; j < i + 1; j++) {
        max += this.levelNums[j];
      }
      if (level <= max) return this.DifficultyWords[i];
    }
    return false;
  }
  renderBoard() {
    let gridNine = `<div class="${this.gridNineCls}">`;
    let grid = `<div class="${this.gridCls}">`;
    let divEnd = "</div>";
    let arrGrid = [];
    let arrGridNumber = [];
    for (let i = 0; i < 9; i++) {
      arrGrid.push(gridNine);
      arrGridNumber.push(gridNine);
      for (let j = 0; j < 9; j++) {
        arrGrid.push(grid, divEnd);
        let gridNumber = `<div class="${this.gridNumberCls} ${this.gridCls} ${
          this.gridTransparentCls
        }" data-index="${j + i * 9}">`;
        let numberInner = ["<i class='dot'></i><span class='number'></span>"];
        numberInner.push("<div class='grid-small'>");
        for (let k = 0; k < 9; k++) {
          numberInner.push(`<b>${k + 1}</b>`);
        }
        numberInner.push(divEnd);
        arrGridNumber.push(gridNumber, ...numberInner, divEnd);
      }
      arrGrid.push(divEnd);
      arrGridNumber.push(divEnd);
    }
    this.$boardGrid.innerHTML = arrGrid.join("");
    this.$boardNumber.innerHTML = arrGridNumber.join("");
    this.$gridNumbers = this.$boardNumber.querySelectorAll(
      `.${this.gridNineCls} .${this.gridNumberCls}`
    );
    this.$gridGrids = this.$boardGrid.querySelectorAll(
      `.${this.gridNineCls} .${this.gridCls}:not(.${this.gridNumberCls})`
    );
  }
  fillBoard() {
    for (let i = 0; i < this.$gridNumbers.length; i++) {
      let $box = this.$gridNumbers[i];
      let $number = $box.children[1];
      let [row, col] = this.gridIndexToMap(i);
      let n = this.sudoku.getSudoku()[row][col];
      if (n === 0) {
        $number.innerHTML = "";
        $box.classList.add(this.gridNumberInputCls);
        $box.removeAttribute(this.dataFreeze);
      } else {
        $number.innerHTML = n;
        $box.setAttribute(this.dataFreeze, "");
        $box.classList.remove(this.gridNumberInputCls);
      }
    }
  }
  gridIndexToMap(i) {
    let col = ((i % 3) + Math.floor(i / 9) * 3) % 9;
    let row = Math.floor((i % 9) / 3) + Math.floor(i / 27) * 3;
    return [row, col];
  }
  mapToGridIndex([row, col]) {
    return (
      Math.floor(col / 3) * 9 +
      (col % 3) +
      Math.floor(row / 3) * 27 +
      (row % 3) * 3
    );
  }
  copy(arr) {
    var a = [[], [], [], [], [], [], [], [], []];
    for (var i = 0; i < 9; i++) {
      for (var j = 0; j < 9; j++) {
        a[i].push(arr[i][j]);
      }
    }
    return a;
  }

  /*----------------- audio -----------------*/
  playBgm() {
    let bgm =
      this.audioSrcMusic[Math.floor(Math.random() * this.audioSrcMusic.length)];
    this.bgm.src = bgm;
    this.bgm.volume = 0.3;
    this.bgm.loop = "loop";
    this.bgm.play();
  }
  audioPlay(url, volume = 0.3) {
    let audio = new Audio(url);
    audio.volume = volume;
    audio.play();
  }
  audioFadeOut(audio) {
    this.audioFadeTimer = setTimeout(() => {
      if (audio.volume <= 0.5 / 17) {
        audio.pause();
      } else {
        audio.volume -= 0.5 / 17;
        this.audioFadeOut(audio);
      }
    }, 60);
  }
}

/*----------------- utils -----------------*/
function $(cls, isAll) {
  if (isAll) {
    return document.querySelectorAll(cls);
  } else {
    return document.querySelector(cls);
  }
}
function addEvent(out, query, event, callback, useCapture = false) {
  out.addEventListener(
    event,
    function (e) {
      e.preventDefault();
      let child = findTarget(e.target, query, useCapture);
      if (!child) {
        return false;
      }
      callback(child);
    },
    useCapture
  );
}
function findTarget(node, query, down = false) {
  if (node == document || !node || node.length == 0) return false;
  let cls = query.split(".")[1];
  let id = query.split("#")[1];
  let test = cls
    ? node.classList?.contains(cls)
    : id
    ? node.id == id
    : node.nodeName == query.toUpperCase();
  return test
    ? node
    : findTarget(down ? node.children : node.parentNode, query, down);
}
