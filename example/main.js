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


buttonGroup[9].set(true)

process.nextTick(function () {
  buttonGroup[4].set('frank')
  buttonGroup[9].set('zappa')
})
