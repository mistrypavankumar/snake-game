"use client";

import { FC, useEffect, useState } from "react";

interface GameBoardProps {}

const GameBoard: FC<GameBoardProps> = ({}) => {
  // Game Board Size
  const GRID_SIZE = 20;

  // Get Random cell for food
  const getRandomCellForFood = () => {
    return {
      x: Math.floor(Math.random() * GRID_SIZE),
      y: Math.floor(Math.random() * GRID_SIZE),
    };
  };

  const [food, setFood] = useState({ x: -1, y: -1 });

  useEffect(() => {
    setFood(getRandomCellForFood());
  }, []);

  // Game states
  const [snake, setSnake] = useState([
    { x: GRID_SIZE / 2, y: GRID_SIZE / 2 },
    {
      x: GRID_SIZE / 2,
      y: GRID_SIZE / 2 + 1,
    },
  ]);

  const [direction, setDirection] = useState("LEFT");
  const [bodyCount, setBodyCount] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  // Adding cooldown
  const [cooldown, setCooldown] = useState(false);

  // Handle keyboard function
  const handleKeyPress = (e: KeyboardEvent) => {
    if (!cooldown) {
      switch (e.key) {
        case "ArrowUp":
          if (direction !== "DOWN") setDirection("UP");
          break;
        case "ArrowRight":
          if (direction !== "LEFT") setDirection("RIGHT");
          break;
        case "ArrowDown":
          if (direction !== "UP") setDirection("DOWN");
          break;
        case "ArrowLeft":
          if (direction !== "RIGHT") setDirection("LEFT");
          break;
      }
    }

    setCooldown(true);
    setTimeout(() => setCooldown(false), 100);
  };

  // Eat food
  const ateFood = () => {
    if (snake[0].x == food.x && snake[0].y == food.y) {
      setFood(getRandomCellForFood());
      setSnake((prevSnakeCell) => {
        return [
          { x: prevSnakeCell[0].x, y: prevSnakeCell[0].y - 1 },
          ...prevSnakeCell,
        ];
      });
    }
  };

  // Move snake Function
  const updateGame = () => {
    // Check game over
    if (
      snake[0].x < 0 ||
      snake[0].y < 0 ||
      snake[0].x >= 20 ||
      snake[0].y >= 20
    ) {
      setGameOver(true);
    }

    // Move snake
    let newSnake = [...snake];
    if (direction === "UP") {
      newSnake.unshift({ x: snake[0].x, y: snake[0].y - 1 });
    } else if (direction === "DOWN") {
      newSnake.unshift({ x: snake[0].x, y: snake[0].y + 1 });
    } else if (direction === "LEFT") {
      newSnake.unshift({ x: snake[0].x - 1, y: snake[0].y });
    } else if (direction === "RIGHT") {
      newSnake.unshift({ x: snake[0].x + 1, y: snake[0].y });
    }

    if (newSnake[0].x === food.x && newSnake[0].y === food.y) {
      // ATE FOOD
      setFood(getRandomCellForFood());
      setBodyCount((prev) => prev + 1);
      setSnake(newSnake);
    } else {
      // WITHOUT FOOD
      newSnake.pop();
      setSnake(newSnake);
    }
  };

  // handke keystoke
  useEffect(() => {
    document.addEventListener("keydown", handleKeyPress);

    return () => {
      document.removeEventListener("keydown", handleKeyPress);
    };
  });

  // Move snake
  useEffect(() => {
    if (!gameOver) {
      const moveSnake = setInterval(updateGame, 50);
      return () => clearInterval(moveSnake);
    }
  });

  // Generate Grid
  const renderGrid = () => {
    const cells = [];

    for (let row = 0; row < GRID_SIZE; row++) {
      for (let col = 0; col < GRID_SIZE; col++) {
        // render snake
        const isSnake = snake.some(
          (segment) => segment.x === col && segment.y === row
        );

        // reder food
        const isFood = food.x === col && food.y === row;
        let cellClass = "cell";

        if (isSnake) {
          cellClass += " snake";
        }

        if (isFood) {
          cellClass += " food";
        }

        cells.push(<div key={`${row}-${col}`} className={cellClass}></div>);
      }
    }
    return cells;
  };

  return (
    <div className="flex flex-col relative">
      Body Count: {bodyCount}{" "}
      <div className="grid game-board">{renderGrid()}</div>
      {gameOver ? (
        <div className="absolute px-10 py-7 flex flex-col justify-center -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2 bg-red-500 z-10 w-fit">
          <p className="text-center pb-5">Game Over</p>
          <button
            onClick={() => {
              window.location.reload();
              setGameOver(false);
            }}
            className="border-2 w-fit px-2 py-2 outline-none bg-black hover:bg-transparent duration-300"
          >
            Restart Game
          </button>
        </div>
      ) : (
        <></>
      )}
    </div>
  );
};

export default GameBoard;
