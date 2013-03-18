/*
 * PUSHBUTT
 *
 * Ben Postlethwaite
 * 2013
 * code base adapted from @substack's SLIDEWAYS
 *
 * License MIT
 */

"use strict";

var hyperglue = require('hyperglue')
var EventEmitter = require('events').EventEmitter
var html = require('./static/html')
var css = require('./static/css')

module.exports = Button
var insertedCss = false;

function Button (opts) {

  if (!(this instanceof Button)) return new Button(opts)
  EventEmitter.call(this)

  var self = this
  this.id = Button.prototype.id++
  this.activeEvent = 'active-' + this.id
  this.deactiveEvent = 'deactive-' + this.id
  this.groups = {}
  this.active = false
  this.title = ''
  this.mode = 'toggle'

  /*
   * Set state on next tick
   */
  process.nextTick(function () {
    self.setAttributes(opts)
    self.set(self.active)
  })

  if (!insertedCss && opts.insertCss !== false) {
    var style = document.createElement('style');
    style.appendChild(document.createTextNode(css));
    if (document.head.childNodes.length) {
      document.head.insertBefore(style, document.head.childNodes[0]);
    }
    else {
      document.head.appendChild(style);
    }
    insertedCss = true;
  }

  /*
   * Tie to DOM
   */
  var root = this.element = hyperglue(html);
  var button = this.button = root.querySelector('.button')
  var text = this.text = button.querySelector('.title')

  /*
   * Pressed state
   */
  var pressed = false
  button.addEventListener('mousedown', function (ev) {
    /*
     * Always appear down while mouse is held down over button
     */
    ev.preventDefault()
    button.className = 'button pressed'
    pressed = true
  })

  window.addEventListener('mouseup', mouseup)
  function mouseup () {
    if (pressed) {
      if (self.mode === 'toggle')
        self.set(!self.active)
      if (self.mode === 'push') {
        self.set(true)
        self.set(false)
      }
      pressed = false
    }
  }
}

Button.prototype = new EventEmitter

Button.prototype.id = 0

Button.prototype.appendTo = function (target) {
  if (typeof target === 'string') {
    target = document.querySelector(target)
  }
  target.appendChild(this.element)
}

Button.prototype.set = function (arg) {
  if (typeof arg === 'boolean') {

    this.active = arg
    this.button.className = arg  ? 'button pressed' : 'button'

    /*
     * If button has just gone active, alert group buttons
     * and emit active state
     */
    if (this.active) {
      this.emit(this.activeEvent, this.id)

      for (var group in this.groups) {
        Button.prototype.emit(group, this.id)
      }
    }
    /*
     * If in toggle mode, user may want deactive events
     */
    else if (!this.active && this.mode === 'toggle')
      this.emit(this.deactiveEvent, this.id)
  }
}

Button.prototype.setAttributes = function (opts) {

  if (!opts) opts = {}
  if (typeof opts.active === 'boolean') {
    if (opts.active) this.active = true
    else this.active = false
  }
  if (opts.title && (typeof opts.title === 'string')) {
    this.title = opts.title
    this.text.innerHTML = opts.title
  }

  if (opts.mode) {
    if (opts.mode === 'toggle')
      this.mode = opts.mode
    if (opts.mode === 'push') {
      this.mode = opts.mode
      this.set(false) //Don't want a push button in down state
    }
  }
}


Button.prototype.addToggleGroup = function (groupname) {
  var self = this
  if (typeof groupname !== "string")
    throw new Error ("group names must be strings")
  if (self.groups[groupname] === undefined) {
    self.groups[groupname] = {
      name: groupname,
      callback: function (id) {
        if (self.active && self.id !== id) {
          self.active = false
          self.set(self.active)
        }
      }
    }
    Button.prototype.on(groupname, self.groups[groupname].callback)
  }
}

Button.prototype.removeToggleGroup = function (groupname) {
  if (this.groups[groupname]) {
    this.removeListener(groupname, this.groups[groupname].callback)
    delete this.groups[groupname]
  }
}
