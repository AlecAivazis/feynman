 {% compress js %}
  script(src="{% static 'thirdparty/jquery/dist/jquery.js' %}" type="text/javascript")
  script(src="{% static 'thirdparty/jquery-ui/jquery-ui.min.js' %}" type="text/javascript")
  script(src="{% static 'thirdparty/angular/angular.js' %}" type="text/javascript")
  script(src="{% static 'thirdparty/underscore/underscore.js' %}" type="text/javascript")
  {% endcompress %}
  script(src="http://gabelerner.github.io/canvg/rgbcolor.js" type="text/javascript")
  script(src="http://gabelerner.github.io/canvg/canvg.js" type="text/javascript")
  {% compress js %}
  script(src="{% static 'scripts/base64.js' %}" type="text/javascript")
  script(src="{% static 'thirdparty/FileSaver/FileSaver.js' %}" type="text/javascript")

  script(src="{% static 'thirdparty/snap.svg/dist/snap.svg.js' %}" type="text/javascript")
  script(type="text/javascript"
         src="{% static 'thirdparty/angular-bootstrap-colorpicker/js/bootstrap-colorpicker-module.js' %}")
  script(src="{% static 'angular-slider/slider.js' %}" type="text/javascript")
  script(src="{% static 'thirdparty/handlebars/handlebars.js' %}" type="text/javascript")
  script(src="{% static 'thirdparty/jquery-cookie/jquery.cookie.js' %}" type="text/javascript")
  script(src="{% static 'scripts/overlay.js' %}")

  script(src="{% static 'scripts/svgDataURL.coffee' %}", type="text/coffeescript")

  script(src="{% static 'scripts/Anchor.coffee' %}", type="text/coffeescript")
  script(src="{% static 'scripts/CircularConstraint.coffee' %}", type="text/coffeescript")
  script(src="{% static 'scripts/FeynmanCanvas.coffee' %}", type="text/coffeescript")
  script(src="{% static 'scripts/Line.coffee' %}", type="text/coffeescript")
  script(src="{% static 'scripts/Text.coffee' %}", type="text/coffeescript")

  script(src="{% static 'scripts/feynmanColorpicker.coffee' %}", type="text/coffeescript")
  script(src="{% static 'scripts/UndoEntry.coffee' %}", type="text/coffeescript")
  script(src="{% static 'scripts/UndoMulti.coffee' %}", type="text/coffeescript")
  script(src="{% static 'scripts/undo.coffee' %}", type="text/coffeescript")
  script(src="{% static 'scripts/toolbar.coffee' %}", type="text/coffeescript")

  script(src="{% static 'scripts/app.coffee' %}", type="text/coffeescript")
  {% endcompress %}