String.prototype.formatUnicorn = function () {

  var str = this.toString();

  if (!arguments.length) return str

  var type = typeof arguments[0]
    , args = type == 'string' || type == 'number' ? Array.prototype.slice.call(arguments) : arguments[0]

  for (var arg in args) str = str.replace(new RegExp('\\{' + arg + '\\}', 'gi'), args[arg])

  return str

}

