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

  self.id = Button.id++
  var activeEvent = 'active-' + self.id
    , deactiveEvent = 'deactive-' + self.id
    , groups = {}
    , active = false
  self.title = ''
  self.mode = 'toggle'

  /*
   * Set state on next tick
   */
  process.nextTick(function () {
    self.setAttributes(opts)
    self.set(active)
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
  var root = self.element = hyperglue(html);
  var button = self.button = root.querySelector('.button')
  var text = self.text = button.querySelector('.title')

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
        self.set(!active)
      if (self.mode === 'push') {
        self.set(true)
        self.set(false)
      }
      pressed = false
    }
  }


  function appendTo (target) {
    if (typeof target === 'string') {
      target = document.querySelector(target)
    }
    target.appendChild(self.element)
  }


  function set (arg) {
    if (typeof arg === 'boolean') {

      active = arg
      self.button.className = arg  ? 'button pressed' : 'button'

    /*
     * If button has just gone active, alert group buttons
     * and emit active state
     */
      if (active) {
        console.log('emitting!')
      self.emit(activeEvent, self.id)

      for (var group in groups) {
        Button.prototype.emit(group, self.id)
      }
    }
      /*
     * If in toggle mode, user may want deactive events
     */
      else if (!active && self.mode === 'toggle')
      self.emit(deactiveEvent, self.id)
    }
  }


  function setAttributes (opts) {

    if (!opts) opts = {}
    if (typeof opts.active === 'boolean') {
      if (opts.active) active = true
      else active = false
    }
    if (opts.title && (typeof opts.title === 'string')) {
      self.title = opts.title
      self.text.innerHTML = opts.title
    }

    if (opts.mode) {
      if (opts.mode === 'toggle')
        self.mode = opts.mode
    if (opts.mode === 'push') {
      self.mode = opts.mode
      self.set(false) //Don't want a push button in down state
    }
    }
  }


  function addToggleGroup (groupname) {
    if (typeof groupname !== "string")
      throw new Error ("group names must be strings")
    if (groups[groupname] === undefined) {
      groups[groupname] = {
        name: groupname,
        callback: function (id) {
          if (active && self.id !== id) {
            active = false
            self.set(active)
          }
        }
      }
      Button.prototype.on(groupname, groups[groupname].callback)
    }
  }

  function removeToggleGroup (groupname) {
    if (groups[groupname]) {
      self.removeListener(groupname, groups[groupname].callback)
      delete groups[groupname]
    }
  }


  self.set = set
  self.setAttributes = setAttributes
  self.appendTo = appendTo
  self.addToggleGroup = addToggleGroup
  self.removeToggleGroup = removeToggleGroup

  return self

}


/*
 * Class logic
 */
Button.id = 0
Button.prototype = new EventEmitter
//require('util').inherits(Button, EventEmitter)