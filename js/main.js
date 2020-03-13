$(document).ready(function() {
  var colors = ["#6272a4", "#8be9fd", "#50fa7b", "#ffb86c", "#ff79c6", "#bd93f9", "#ff5555", "#f1fa8c"],
      tags = $("a.post-tag");
  let cat_colors = new Map();
  for (var i = 0; i < tags.length; i++) {
    tag_color = cat_colors.get(tags[i].text);
    if (tag_color == null) {
      var selectedColor = colors[Math.floor(Math.random()*colors.length)];
      $(tags[i]).css('background-color', selectedColor);
      cat_colors.set(tags[i].text, selectedColor);
    } else{
      $(tags[i]).css('background-color', tag_color);
    }
  }
});
