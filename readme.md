PUSHBUTT
========

chainable toggle button widget based on [@substack](https://github.com/substack)'s [slideways](https://github.com/substack/slideways)

Simple example
==============
``` js
var PushButt = require('../.')

var result = document.querySelector('#result')
  , count = 0
  , butt = PushButt({ title: 'butts' })

butt.appendTo('#button')
butt.addToggleGroup('groupA')
butt.on(butt.event, function (id) {
    result.innerHTML = "" + count++
})
```

Multi-Toggle Group Example
==========================
[example](http://bpostlethwaite.github.com/pushbutt/)
``` js

var PushButt = require('../.')

var result = document.querySelector('#result')
  , button = document.querySelector('#button')
  , buttonGroup = []
  , butt, text, i

/*
 * Build 5 buttons in a toggle group
 */
for (i = 0; i < 5; i++) {
  butt = PushButt({ title: 'button-' + i })
  butt.appendTo(button)
  butt.addToggleGroup('groupA')
  butt.on(butt.event, callback)
  buttonGroup[i] = butt
}
/*
 * Remove 5th button from group
 */
buttonGroup[4].removeToggleGroup('groupA')

button.appendChild(document.createElement('br'))
button.appendChild(document.createElement('br'))
/*
 * Build another 5 toggle group
 */
for (i = 5; i < 10; i++) {
  butt = PushButt({ title: 'button-' + i })
  butt.appendTo(button)
  butt.addToggleGroup('groupB')
  butt.on(butt.event, callback )

  buttonGroup[i] = butt
}
/*
 * Remove 10th button
 */
buttonGroup[9].removeToggleGroup('groupB')


function callback (id) {
  result.innerHTML = "Caught " + id
}

```

Methods
=======

## var butt = PushButt(opts)
Returns a push button instance using options `opts`.
Available options are:
``` js
{
  "active": true || false
, "title": "Button Text Here"
}
```
## butt.appendTo(target)
Append the button widget to the dom element or query selector string `target`.

## butt.set(arg)
If `arg` is a `"bool"` this method programmatically toggles the value of the button, `true` sets button into on state, `false` sets button into off state.
If `arg` is a `"string"` the `set` method sets the displayed title of the button.

## butt.addToggleGroup(groupname)
Adds the button `butt` to the group `groupname`. This turns the buttons into a radiobutton like mode where a single button is active at any time. Setting a new button as active deactives the previously active button.

## butt.removeToggleGroup(groupname)
Removes the button `butt` from the group `groupname`.

Events
======
## butt.on(butt.event, function (id) {})
Every time a button becomes active it emits event `'butt.event'` which is a unique ID for that button. The event value is the numberic `id` of the button.

Attributes
==========
## butt.element
html dom element container

## butt.id
The numeric ID of the button

## butt.event
The emitted event name on button press. Event name is `'pushbutt-' + butt.id`.

## butt.title
The title of the button. Note that setting this property will not cause the title text in the button element to change. The `butt.set('newName')` method will set both `butt.title` as well as set the text in the html element.

install
=======

With npm do:

``` js
npm install pushbutt
```

Use browserify to `require('pushbutt')`.

license
=======
MIT
