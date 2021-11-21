import React, { useEffect } from "react";
import styles from "./Background.module.scss";
import { Svg, SVG, Shape as SvgShape } from "@svgdotjs/svg.js";

const Background: React.FC = () => {
  useEffect(() => {
    const draw = SVG().addTo(`.${styles.background}`).size("100%", "100%");

    drawBackground(draw);
  }, []);

  return <div className={styles.background}></div>;
};

export default Background;

const MAX_SHAPES = 10;
const CREATE_CHANCE = 0.02;
// const CREATE_CHANCE = 100;
const SHAPES = ["circle", "triangle", "square", "pentagon", "hexagon"];
const DIRECTIONS = ["left", "right", "top", "bottom"];

function randBetween(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

abstract class Shape {
  drawInstance: Svg;
  shape!: SvgShape;

  posX: number;
  posY: number;
  radius: number;
  velocity: { x: number; y: number; spin: number };
  opacity: number;
  fadeRate: number;
  rotation: number;

  constructor(drawInstance: Svg) {
    this.drawInstance = drawInstance;

    const { posX, posY, velX, velY } = this._getStartPosition();

    this.radius = randBetween(25, 200);
    this.posX = posX;
    this.posY = posY;
    this.velocity = {
      x: velX / 100,
      y: velY / 100,
      spin: randBetween(-10, 10) / 100,
    };
    this.opacity = Math.random();
    this.fadeRate = randBetween(1, 100) / 20000;
    this.rotation = randBetween(0, 360);

    this.draw();
  }

  _getStartPosition() {
    const direction = DIRECTIONS[Math.floor(Math.random() * DIRECTIONS.length)];

    const w = window.innerWidth;
    const h = window.innerHeight;

    switch (direction) {
      case "left":
        return {
          posX: randBetween(-400, w + 400),
          posY: randBetween(-400, h + 400),
          velX: randBetween(1, 100),
          velY: randBetween(-100, 100),
        };
      case "right":
        return {
          posX: randBetween(w, w + 400),
          posY: randBetween(0, h),
          velX: randBetween(-1, -100),
          velY: randBetween(-100, 100),
        };
      case "top":
        return {
          posX: randBetween(0, w),
          posY: randBetween(-400, 0),
          velX: randBetween(-100, 100),
          velY: randBetween(1, 100),
        };
      case "bottom":
        return {
          posX: randBetween(0, w),
          posY: randBetween(h, h + 400),
          velX: randBetween(-100, 100),
          velY: randBetween(-1, -100),
        };
      default:
        throw Error("invalid direction");
    }
  }

  abstract draw(): void;

  move() {
    this.posX += this.velocity.x;
    this.posY += this.velocity.y;
    this.rotation += this.velocity.spin;
    this.opacity -= this.fadeRate;

    this.shape
      .move(this.posX, this.posY)
      .attr({ opacity: this.opacity })
      .transform({ rotate: this.rotation });
  }
}

class Circle extends Shape {
  draw() {
    this.shape = this.drawInstance
      .circle(this.radius * 2)
      .move(this.posX, this.posY)
      .stroke({ width: 2 })
      .attr({ stroke: "#fff", fill: "#222", opacity: this.opacity });
  }
}

class Triangle extends Shape {
  draw() {
    this.shape = this.drawInstance
      .polygon(
        `${-this.radius / 2},0 0,${this.radius * 0.86} ${this.radius / 2},0`
      )
      .move(this.posX, this.posY)
      .stroke({ width: 2 })
      .rotate(this.rotation)
      .attr({
        stroke: "#fff",
        fill: "#222",
        opacity: this.opacity,
      });
  }
}

class Square extends Shape {
  draw() {
    this.shape = this.drawInstance
      .rect(this.radius * 2, this.radius * 2)
      .move(this.posX, this.posY)
      .stroke({ width: 2 })
      .rotate(this.rotation)
      .attr({
        stroke: "#fff",
        fill: "#222",
        opacity: this.opacity,
      });
  }
}

class Pentagon extends Shape {
  constructor(drawInstance: Svg) {
    super(drawInstance);
    this.radius /= 2;
  }

  draw() {
    this.shape = this.drawInstance
      .polygon(
        `${0},${-this.radius} ${-this.radius * 0.95},${-this.radius * 0.31} ${
          -this.radius * 0.59
        },${this.radius * 0.81} ${this.radius * 0.59},${this.radius * 0.81} ${
          this.radius * 0.95
        },${-this.radius * 0.31}`
      )
      .move(this.posX, this.posY)
      .stroke({ width: 2 })
      .rotate(this.rotation)
      .attr({
        stroke: "#fff",
        fill: "#222",
        opacity: this.opacity,
      });
  }
}

class Hexagon extends Shape {
  constructor(drawInstance: Svg) {
    super(drawInstance);
    this.radius /= 2;
  }

  draw() {
    this.shape = this.drawInstance
      .polygon(
        `${this.radius / 2},${-this.radius * 0.87} ${-this.radius / 2},${
          -this.radius * 0.87
        } ${-this.radius},0 ${-this.radius / 2},${this.radius * 0.87} ${
          this.radius / 2
        },${this.radius * 0.87} ${this.radius},0`
      )
      .move(this.posX, this.posY)
      .stroke({ width: 2 })
      .rotate(this.rotation)
      .attr({
        stroke: "#fff",
        fill: "#222",
        opacity: this.opacity,
      });
  }
}

function drawBackground(draw: Svg) {
  let shapeCache: Shape[] = [];

  function frame() {
    shapeCache.forEach((shape) => {
      shape.move();
    });

    // Create new
    if (
      shapeCache.length < MAX_SHAPES &&
      Math.random() < (MAX_SHAPES - shapeCache.length) * 0.2 * CREATE_CHANCE
    ) {
      const shape = SHAPES[Math.floor(Math.random() * SHAPES.length)];

      switch (shape) {
        case "circle":
          shapeCache.push(new Circle(draw));
          break;
        case "triangle":
          shapeCache.push(new Triangle(draw));
          break;
        case "square":
          shapeCache.push(new Square(draw));
          break;
        case "pentagon":
          shapeCache.push(new Pentagon(draw));
          break;
        case "hexagon":
          shapeCache.push(new Hexagon(draw));
          break;
      }
    }

    // Garbage collect
    shapeCache = shapeCache.filter((shape) => shape.opacity > 0);

    requestAnimationFrame(frame);
  }

  frame();
}
