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


var id = 0
var groups = {}

function Button (opts) {

  var self = new EventEmitter

  self.id = id++
  self.activeEvent = 'active-' + self.id
  self.deactiveEvent = 'deactive-' + self.id

  var active = false
    , title = ''
    , mode = 'toggle'
    , myGroups = []

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
  self.text = button.querySelector('.title')

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
      if (mode === 'toggle')
        self.set(!active)
      if (mode === 'push') {
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
        self.emit(self.activeEvent, self.id)

        myGroups.forEach( function (group) {
          groups[group].forEach( function (butt) {
            if (butt !== self)
              butt.emit(group, self.id)
          })
        })
      }
      /*
       * If in toggle mode, user may want deactive events
       */
      else if (!active && mode === 'toggle')
        self.emit(self.deactiveEvent, self.id)
    }
  }


  function setAttributes (opts) {

    if (!opts) opts = {}
    if (typeof opts.active === 'boolean') {
      if (opts.active) active = true
      else active = false
    }
    if (opts.title && (typeof opts.title === 'string')) {
      title = opts.title
      self.text.innerHTML = opts.title
    }

    if (opts.mode) {
      if (opts.mode === 'toggle')
        mode = opts.mode
    if (opts.mode === 'push') {
      mode = opts.mode
      self.set(false) //Don't want a push button in down state
    }
    }
  }


  function addToggleGroup (group) {
    if (typeof group !== "string")
      throw new Error ("group names must be strings")

    myGroups.push(group)

    if( ! Array.isArray(groups[group]) )  groups[group] = []
    groups[group].push(self)

    self.on(group, groupCallback)
  }

  function groupCallback (id) {
    if (active) {
      active = false
      self.set(active)
    }
  }

  function removeToggleGroup (group) {
    var index
    if (groups[group]) {
      self.removeListener(group, groupCallback)

      index = groups[group].indexOf(self)
      if (index !== -1)
        groups[group].splice(index, 1)

      index = myGroups.indexOf(group)
      if (index !== -1)
        myGroups.splice(index, 1)
    }
  }


  self.set = set
  self.setAttributes = setAttributes
  self.appendTo = appendTo
  self.addToggleGroup = addToggleGroup
  self.removeToggleGroup = removeToggleGroup

  return self

}
