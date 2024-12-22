/**
 * Snake game.
 */
export default class Snake {
  private ctx: CanvasRenderingContext2D;
  private gridSize: number = 6;
  private delay: number = 300;
  private squareSize: number = 0;
  private direction = 'right';
  private snakeColor = '#e1ffb7';
  private snakeHeadColor = '#0f0';
  private appleColor = '#f00';
  private snake: number[][] = [];
  private snakeLength: number = 1;
  private apple: number[] = [];
  private setIntervalId: number = 0;

  constructor() {
    // Get canvas element.
    const canvas = document.getElementById('canvas') as HTMLCanvasElement;
    if (!canvas) {
      throw new Error('Canvas context is not available.');
    }

    this.ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
    this.squareSize = canvas.width / this.gridSize;
  }

  /**
   * Start the game.
   */
  public start() {
    console.log('%c🐍 Game started.', 'color: green;');

    this.listenForUserInput();

    this.setIntervalId = setInterval(() => {
      this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
      this.drawApple();
      this.drawSnake();
      this.checkSnakeEatApple();
      this.checkSnakeEatTail();

    }, this.delay);
  }

  /**
   * Stop the game.
   */
  public stop() {
    console.log('%c🐍 Game stopped.', 'color: red;');
    clearInterval(this.setIntervalId);
  };

  /**
   * Check if snake eats apple.
   */
  private checkSnakeEatApple() {
    if (this.snake[0][0] === this.apple[0] && this.snake[0][1] === this.apple[1]) {
      // Increase snake length.
      this.snakeLength += 1;
      console.log('%c🐍 Snake length: ' + this.snakeLength, 'color: lightgreen;');
      this.apple = [];

      this.drawApple();
      console.log('%c🍎 Apple eaten.', 'color: orange;');
    }
  }

  /**
   * Check if snake eats tail.
   */
  private checkSnakeEatTail() {
    this.snake.forEach((position, index) => {
      if (this.snakeLength === 1) {
        return;
      }

      if (index === 0) {
        return;
      }

      if (this.snake[0][0] === position[0] && this.snake[0][1] === position[1]) {
        console.log('%c🐍 Snake eats tail.', 'color: red;');
        this.snake = [];
        this.snakeLength = 1;
        this.stop();
      }
    });
  }

  /**
   * Listen for user input.
   */
  private listenForUserInput() {
    document.addEventListener('keydown', (event) => {
      let directionEmoji = '';

      switch (event.key) {
        case 'ArrowUp':
          if (this.direction === 'down') {
            return;
          }

          this.direction = 'up';
          directionEmoji = '⬆️';
          break;

        case 'ArrowDown':
          if (this.direction === 'up') {
            return;
          }

          this.direction = 'down';
          directionEmoji = '⬇️';
          break;

        case 'ArrowLeft':
          if (this.direction === 'right') {
            return;
          }

          this.direction = 'left';
          directionEmoji = '⬅️';
          break;

        case 'ArrowRight':
          if (this.direction === 'left') {
            return;
          }

          this.direction = 'right';
          directionEmoji = '➡️';
          break;
      }

      console.log(`%c Direction ${directionEmoji}`, 'color: lightblue;');
    });
  }

  /**
   * Draw snake head.
   */
  private drawSnake() {
    // Draw snake head.
    let [x, y] = this.getHeadPosition();
    this.snake.unshift([x, y]);
    this.drawSquare(x, y, this.snakeHeadColor);

    // Remove snake tail.
    if (this.snake.length > this.snakeLength) {
      this.snake.pop();
    }

    if (this.snake.length == 1) {
      return;
    }

    // Draw snake body.
    this.snake.forEach((position, index) => {
      if (index === 0) {
        return;
      }

      this.drawSquare(position[0], position[1], this.snakeColor);
    });
  }

  /**
   * Draw apple.
   */
  private drawApple() {
    if (!this.apple.length) {
      let [x, y] = this.getRandomSquarePosition();

      // Check if apple is not on snake.
      while (this.snake.some(position => position[0] === x && position[1] === y)) {
        [x, y] = this.getRandomSquarePosition();
      }

      this.apple = [x, y];
    }

    this.drawSquare(this.apple[0], this.apple[1], this.appleColor);
  }

  private drawSquare(x: number, y: number, color: string) {
    this.ctx.fillStyle = color;
    const [positionX, positionY] = this.convertToSquarePxPosition(x, y);
    this.ctx.fillRect(positionX, positionY, this.squareSize, this.squareSize);
  }

  /**
   * Get random square position.
   */
  private getRandomSquarePosition() {
    const x = Math.floor(Math.random() * this.gridSize);
    const y = Math.floor(Math.random() * this.gridSize);
    return [x, y];
  }

  /**
   * Convert to square position.
   */
  private convertToSquarePxPosition(x: number, y: number) {
    return [this.getSquarePxPosition(x), this.getSquarePxPosition(y)];
  }

  /**
   * Get square position in pixel.
   */
  private getSquarePxPosition(position: number) {
    return position * this.squareSize;
  }

  private getHeadPosition() {
    // Set snake head at random position.
    if (this.snake.length === 0) {
      const [x, y] = this.getRandomSquarePosition();
      return [x, y];
    }

    // Get current snake head position.
    let [x, y] = this.snake[0];

    switch (this.direction) {
      case 'right':
        x = x === this.gridSize - 1 ? 0 : x + 1;
        break;
      case 'left':
        x = x === 0 ? this.gridSize - 1 : x - 1;
        break;
      case 'up':
        y = y === 0 ? this.gridSize - 1 : y - 1;
        break;
      case 'down':
        y = y === this.gridSize - 1 ? 0 : y + 1;
        break;
    }

    return [x, y];
  }

}
