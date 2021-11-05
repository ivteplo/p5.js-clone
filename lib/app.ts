import Color from "color"
import { requestAnimationFrame } from "request-animation-frame-polyfill"

import ColorValue from "./ColorValue"
import { degreesToRadians } from "./helpers"

let canvas: HTMLCanvasElement
let context: CanvasRenderingContext2D
let currentPath: Path2D = new Path2D()

const _useCanvas = (_canvas: HTMLCanvasElement) => {
  canvas = _canvas
  context = canvas.getContext("2d")
}

/**
 * Function to create an app for a specific canvas
 * @param canvas canvas to draw on
 * @param initialize function that is called when the canvas was initialized
 * @param draw function that is called on every frame
 */
export function app(
  canvas: HTMLCanvasElement,
  initialize: () => void,
  draw: () => void
) {
  if (!(canvas instanceof HTMLCanvasElement)) {
    throw "Expected an HTMLCanvasElement to be passed"
  }

  if (initialize instanceof Function) {
    _useCanvas(canvas)
    initialize()
  }

  ;(function startDrawing() {
    _useCanvas(canvas)

    draw()
    requestAnimationFrame(startDrawing)
  })()
}

/**
 * Function to set size of the canvas
 * @param width
 * @param height
 */
export function size(width: number, height: number) {
  canvas.width = width
  canvas.height = height
}

/**
 * Function to clear a canvas
 * @param x
 * @param y
 * @param width
 * @param height
 */
export function clear(
  x: number = 0,
  y: number = 0,
  width: number = canvas.width,
  height: number = canvas.height
) {
  context.clearRect(x, y, width, height)
}

/**
 * Function to fill the whole canvas with some color
 * @param color
 */
export function background(color: ColorValue) {
  push()
  fillColor(color)
  noStroke()
  rectangle(0, 0, canvas.width, canvas.height)
  pop()
}

/**
 * Function to save the current state of canvas in order to be able to restore it after some kind of translations/rotations etc.
 */
export function push() {
  context.save()
}

/**
 * Function to restore the previous state of canvas (rotation, translation, etc.)
 */
export function pop() {
  context.restore()
}

/**
 * Function to rotate the canvas by (angle) degrees
 * @param angle
 */
export function rotate(angle: number) {
  context.rotate(degreesToRadians(angle))
}

/**
 * Function to move coordinates start by (x, y) vector
 * @param x
 * @param y
 */
export function translate(x: number, y: number) {
  context.translate(x, y)
}

/**
 * Function to change the fill color
 * @param color
 */
export function fillColor(color: ColorValue) {
  context.fillStyle = new Color(color).toString()
}

/**
 * Function to change the stroke color
 * @param color
 */
export function strokeColor(color: ColorValue) {
  context.strokeStyle = new Color(color).toString()
}

/**
 * Function to stop drawing a stroke around shapes
 */
export function noStroke() {
  strokeColor("transparent")
}

/**
 * Function to stop filling shapes
 */
export function noFill() {
  fillColor("transparent")
}

/**
 * Function to start a path
 */
export function beginPath() {
  if (!currentPath) {
    currentPath = new Path2D()
  }
}

/**
 * Function to start a path
 */
export function closePath() {
  currentPath.closePath()
  fillAndStroke()

  currentPath = new Path2D()
}

/**
 * Function to draw a rectangle
 * @param x
 * @param y
 * @param width
 * @param height
 */
export function rectangle(x: number, y: number, width: number, height: number) {
  const points = [
    [x + width, y],
    [x + width, y + height],
    [x, y + height],
  ]

  beginPath()

  currentPath.moveTo(x, y)
  for (let i = 0; i < points.length; i += 1) {
    const [endX, endY] = points[i]
    lineTo(endX, endY)
  }

  closePath()
  fillAndStroke()
}

/**
 * Function to draw a circle
 * @param x
 * @param y
 * @param diameter
 */
export function circle(x: number, y: number, diameter: number) {
  ellipse(x, y, diameter, diameter)
}

/**
 * Function to draw an ellipse
 * @param x
 * @param y
 * @param width
 * @param height
 */
export function ellipse(x: number, y: number, width: number, height: number) {
  currentPath.ellipse(x, y, width / 2, height / 2, 0, 0, Math.PI * 2)
  fillAndStroke()
}

/**
 * Function to draw a line
 * @param startX
 * @param startY
 * @param endX
 * @param endY
 */
export function line(
  startX: number,
  startY: number,
  endX: number,
  endY: number
) {
  beginPath()
  moveTo(startX, startY)
  lineTo(endX, endY)
  closePath()
}

/**
 * Function to draw a line from current position to the specified coordinates
 * @param x
 * @param y
 */
export function lineTo(x: number, y: number) {
  currentPath.lineTo(x, y)
  fillAndStroke()
}

/**
 * Function to change the start of the next line to the specified coordinates
 * @param x
 * @param y
 */
export function moveTo(x: number, y: number) {
  currentPath.moveTo(x, y)
}

function fillAndStroke() {
  context.fill(currentPath)
  context.stroke(currentPath)
}
