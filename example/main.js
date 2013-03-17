var Butts = require('../.')
var button = Butts({ name: 'Clustered' })
button.appendTo('#button')

var result = document.querySelector('#result')
button.on('value', function (value) {
    result.value = value
})
