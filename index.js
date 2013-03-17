var hyperglue = require('hyperglue')
var EventEmitter = require('events').EventEmitter
var html = require('./static/html')
var css = require('./static/css')

module.exports = Button
var insertedCss = false;

function Button (opts) {

  if (!(this instanceof Button)) return new Button(opts)
  EventEmitter.call(this)
  this.groups = {}
  var self = this

  if (!opts) opts = {}
  if (opts.active) this.active = true
  else this.active = false
  if (!opts.name && opts.name !== 'string')
    opts.name = ''

  process.nextTick(function () {
    self.set(self.active)
    self.set(opts.name)
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

  var root = this.element = hyperglue(html);
  var button = this.button = root.querySelector('.button')
  var title = this.title = button.querySelector('.title')

  var pressed = false
  button.addEventListener('mousedown', function (ev) {
    /*
     * Always appear down while mouse is held down over button
     */
    ev.preventDefault()
    button.className = 'button pressed'
    pressed = true
  })

  root.addEventListener('mousedown', function (ev) {
    ev.preventDefault()
  })

  window.addEventListener('mouseup', mouseup);

  function mouseup () {
    if (pressed) {
      self.set(!self.active)
      pressed = false
    }
  }
}

Button.prototype = new EventEmitter

Button.prototype.appendTo = function (target) {
  if (typeof target === 'string') {
    target = document.querySelector(target)
  }
  target.appendChild(this.element)
}

Button.prototype.set = function (arg) {
  var self = this
  if (typeof arg === 'boolean') {
    if (arg) {
      this.emit('active')
      this.active = true
      this.button.className = 'button pressed'
    }
    else {
      this.emit('deactive')
      this.active = false
      this.button.className = 'button'
    }
  }
  if (typeof arg === 'string') {
    // var fontSize =  titleSize(arg)
    // console.log(fontSize)
    // this.title.style.fontSize = fontSize
    this.title.innerHTML = arg
  }

Button.prototype.toggleGroup = function (groupName) {
  if (typeof groupName !== "string")
    throw new Error("Button group name argument must be a string")
  if (this.groups[groupName] === undefined)
  this.groups[groupName] = true


Button.prototype._elementWidth = function () {
  var style = {
    root: window.getComputedStyle(this.element),
    button: window.getComputedStyle(this.button)
  }
  return num(style.root.width) - num(style.button.width)
       - num(style.button['border-width'])

}
  function num (s) {
    return Number((/^(\d+)/.exec(s) || [0,0])[1])
  }
}

//   function titleSize (s) {
//     var count = 0
//     self.dummy.textContent = s
//     self.dummy.style.fontSize = 2
//     console.log(self.dummy)
//     var diff
//     while (self.element.offsetWidth - self.dummy.offsetWidth > 2) {
//       diff = Math.round( (self.dummy.offsetWidth - self.element.offsetWidth ) / 5 )
//       self.dummy.style.fontSize = parseInt(self.dummy.style.fontSize) - diff

//       if (count > 10)
//         break
//       count += 1
//     }
//     return self.dummy.style.fontSize
//   }
  // this.dummy = document.createElement('div')
  // this.dummy.className = 'title'
  // this.dummy.style.visibility = 'hidden'
  // button.appendChild(this.dummy)

