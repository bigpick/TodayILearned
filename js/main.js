$(document).ready(function() {
});

$(document).ready(function() {
  var colors = ["#6272a4", "#8be9fd", "#50fa7b", "#ffb86c", "#ff79c6", "#bd93f9", "#ff5555", "#f1fa8c"],
      tags = $("a.post-tag");

  for (var i = 0; i < tags.length; i++) {
    var selectedColor = colors[Math.floor(Math.random()*colors.length)];
    $(tags[i]).css('background-color', selectedColor);
  }
});
