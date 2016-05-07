# this file describes a color picker directive 
#
# author: alec aivazis

# external imports
angular = require('angular')
$ = require('jquery')
colorpicker = require('angular-bootstrap-colorpicker')

console.log colorpicker

angular.module('feynman.colorpicker', ['colorpicker.module'])

.directive 'colorPicker', ->
  restrict: 'EA'
  replace: 'true'
  scope:
    model: '='
  template:'<div><div class="colorContainer"><div style="background: {{model}}"> &nbsp; </div></div><input class="colorInput" colorpicker="hex" type="text" ng-model="model" name="color"></div></div>'
  link: (scope, elem, attr) ->
    $('.colorContainer').on 'click', ->
      $(this).siblings('.colorInput').eq(0).trigger('click')


# end of file
