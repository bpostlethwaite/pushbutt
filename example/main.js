var PushButt = require('../.')



var result = document.querySelector('#result')
var buttonGroup = []
var button, text

for (var i = 0; i < 5; i++) {
  button = PushButt({ title: 'button-' + i })
  button.appendTo('#button')
  button.addToggleGroup('groupA')
  button.on(button.event, callback.bind(button) )

  buttonGroup[i] = button
}

function callback (value, id) {

  console.log(this.id + ' got ' + id)
  // text = document.createTextNode(this.id + ' got ' + id)
  // result.appendChild(text)
  // result.appendChild(document.createElement('br'))
}

buttonGroup[4].removeToggleGroup('groupA')
