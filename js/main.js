$(document).ready(function() {
  var unused_colors = ["#6272a4", "#8be9fd", "#50fa7b", "#ffb86c", "#ff79c6", "#bd93f9", "#ff5555", "#f1fa8c"],
      tags = $("a.post-tag"), used_colors = [];
  let cat_colors = new Map();
  for (var i = 0; i < tags.length; i++) {
    tag_color = cat_colors.get(tags[i].text);
    if (tag_color == null) {
      if (unused_colors.length != 0){
        var selectedColor = unused_colors[Math.floor(Math.random()*unused_colors.length)];
        $(tags[i]).css('background-color', selectedColor);
        cat_colors.set(tags[i].text, selectedColor);
        var index = unused_colors.indexOf(selectedColor)
        unused_colors.splice(index, 1)
        used_colors.push(selectedColor)
      } else{
        var selectedColor = used_colors[Math.floor(Math.random()*used_colors.length)];
        $(tags[i]).css('background-color', selectedColor);
        cat_colors.set(tags[i].text, selectedColor);
      }
    } else{
      $(tags[i]).css('background-color', tag_color);
    }
  }
});
