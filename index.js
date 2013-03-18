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

  this.id = Button.prototype.id++
  this.event = 'pushbutt-' + this.id
  this.groups = {}
  this.title = ''
  var self = this

  /*
   * Load & set default options
   */
  if (!opts) opts = {}
  if (opts.active) this.active = true
  else this.active = false
  if (!opts.title && opts.title !== 'string')
    opts.title = ''

  /*
   * Set state on next tick
   */
  process.nextTick(function () {
    self.set(self.active)
    self.set(opts.title)
  })

  /*
   * Insert styling - untested yet
   */
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
      self.set(!self.active)
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
     * Perhaps should only emit active states?
     */
    if (this.active) {
      this.emit(this.event, this.id)

      for (var group in this.groups) {
        Button.prototype.emit(group, this.id)
      }
    }
  }

  if (typeof arg === 'string') {
    this.text.innerHTML = arg
    this.title = arg
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

// Button.prototype._elementWidth = function () {
//   var style = {
//     root: window.getComputedStyle(this.element),
//     button: window.getComputedStyle(this.button)
//   }
//   return num(style.root.width) - num(style.button.width)
//        - num(style.button['border-width'])

//   function num (s) {
//     return Number((/^(\d+)/.exec(s) || [0,0])[1])
//   }
// }