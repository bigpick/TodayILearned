---
author: george_pick
layout: post
title: "CSS Fundamentals"
excerpt: "Really basic information about CSS, as laid out by W3 schools."
categories: [Web Design]
---

# [CSS Tutorial](https://www.w3schools.com/css/default.asp) -- An introduction to CSS from W3schools

Notes taken down as part of following along with the above quick tutorial on CSS. Wanted to get a refresher on some of this stuff, before looking into things for designing custom [Ghost](https://ghost.org/marketplace/) themes.

## [Introduction](https://www.w3schools.com/css/css_intro.asp)

**Cascading Style Sheets**: A.K.A CSS, describes how HTML elements are to be displayed on screen, paper, or other media.
 * Controls layout of multiple pages at once.
 * External style sheets are stored in _CSS files_.
 * CSS is designed to enable the separation of presentation and content, including layout, colors, and fonts.
> "The name cascading comes from the specified priority scheme to determine which style rule applies if more than one rule matches a particular element. This cascading priority scheme is predictable." <sup>[1](https://en.wikipedia.org/wiki/CSS)</sup>

A trivial example style sheet:

{% highlight css %}
body {
  background-color: lightblue;
}

h1 {
  color: white;
  text-align: center;
}

p {
  font-family: verdana;
  font-size: 20px;
}
{% endhighlight %}

HTML wasn't supposed to contain any tags for _formatting_ for a web page; it was created to _describe the content_ of a web page. At some ppoint, HTML tags like `<font>` were added and broke that concept. As such, the World Wide Web Consortium (W3C) created CSS, which removed the stle formatting from the HTML page.

## [Syntax](https://www.w3schools.com/css/css_syntax.asp)

A CSS rule-set consists of a _selector_ followed by a _declaration block_.
 * **Selector**: In the above example, `body`, `h1`, `p`, etc... are the selectors. They point to the HTML element you want to style. Can apply to the following:
   * Elements of a specific type (`h2`, `p`, etc...)
   * Elements specified by _attribute_, particularly:
     * **id**: An identifier unique within the document.
     * **class**: An identifier that can annotate multiple elements in a document.
   * Elements depending on how they are placed relative to others in the document tree.
 * **Declaration block**: Contains one or more _declarations_, separated by semicolons.
   * Each _declaration_ includes a CSS property name, followed by a semicolon, followed by it's value (`color: blue`, `font-size: 12px`, etc.)
   * Multiple declarations are separated with semicolons (`;`), and declaration blocks are surrounded by braces (`{ }`).

An example:

{% highlight css %}
 declaration block
  |
  |
selector
↓ ↓
p {
      property  value
        ↓        ↓
    font-size: 16px;
    color: red;
    text-align: center;
}
{% endhighlight %}

Here, we have are defining how to style any paragraphs (via the `p` selector), stating that we want it to be size 16 font, colored red, and centered in the middle of it's element.

**Classes and IDs**:
* Case sensitive.
* Start with letters, can include alphanumeric characters, hyphens, and underscores.
* Classes may apply to any bumber of instances of any elements, while an ID may only be applied to a single element.

**Pseudo-classes**: Used in CSS selectors to allow formatting based on informationtion not in the document tree; example is `:hover`, which identifies content when the user points to the visible element.
* Are appened to a selector; ie. `a:hover`, or `#elementid:hover`, etc.
* Pseduo classes document elements, such as `:link` or `:visited`.

**Pseudo-elements**: Make a selection that may consist of partial elements, such as `::first-line` or `::first-letter`.

Selectors can be combined; joined in a spaced list to specify elements by location, element type, id, class, or any combination. Ordering of selectors is important!! The ordering is right-most important;

Example:

{% highlight css %}
// Applies to all div elements that are in elements of class myClass
div .myClass {color:red;}
{% endhighlight %}

**Length Units**:
* Non-zero values representing measures _must_ include a length unit; examples of length units are as follows:
  * **px**: As in `200px`
  * **ex**: As in `1ex`; "x-height", aka corpus size, is the distance between baseline and the mean line of lowercase letters in a typeface. Usually is the height of the letter "x" in the font (hence the name), as well a v, w, and z. Less stable than using `em` for digital pages. since different browsers dimension ex differently than the actual x-height of a font. An example of using ex would be for super- or subscript (by defining the "bottom" i.e baseline of the lettering to be at + or - the x height):

        {% highlight css %}
          sup {
            position: relative;
            bottom: 1ex;
          }
          sub {
            position: relative;
            bottom: -1ex;
          }
        {% endhighlight %}

  * **em**: As in `0.7em`; Typography measurement unit; equal to the currently specified **point size**. I.e, `1em` in a 16-point typeface is 16 points. Originally a reference to the width of the capital M in a typeface (hence the name) which was often the same as the point size.
    * > em unit is the height of the font in nominal points or inches. The actual, physical height of any given portion of the font depends on the user-defined DPI setting, current element font-size, and the particular font being used.
    * **point size**: Smallest unit of measure in typography. Used for measuring font size, leading, and other items on a printed page. In general, the DeskTip Publishing Point (DTP) is the de facto standard for digital printing.
    * **em dash** and **em space**): `—` and ` ` are each _one em_ wide.
  * **vw**: As in `80vw`
  * **percentage**: As in `80%`
  * Absolute measures, such as `cm`, `in`, `mm`, `pc` (pica), and `pt` (point)

## [CSS Selectors](https://www.w3schools.com/css/css_selectors.asp)

Used to select the specific HTML elements you wish to style. Can be divided into five categories:

1. Simple selectors (select elements based on name, id, or class)
2. Combinator selectors (select elements based on a specific relationship between them)
3. Pseudo-class selectors (select elements based on a certain _state_)
4. Pseudo-elements selectors (select and style _part of an element_)
5. Attribute selectors (select elements based on an attribute or attribtue value)

### CSS element Selector

The element selector selects HTML elements based on the element name (in this case, `p`):

{% highlight css %}
p {
    text-align: center;
    color: red;
}
{% endhighlight %}

### CSS id Selector

Uses the `id` attribute of an HTML element to select it specifically:

{% highlight css %}
// Will be applied to the HTML element with -- id="paragraph1"
#paragraph1 {
    text-align: center;
    color: red;
}
{% endhighlight %}

### CSS class Selector

Selects HTML elements with a specific class attribute:

{% highlight css %}
// Only select elements that are centered
.center {
    text-align: center;
    color: red;
}
{% endhighlight %}

Can also specificy specific elements that match a given attribute:

{% highlight css %}
// Only select paragraph elements that are centered
p.center {
    text-align: center;
    color: red;
}
{% endhighlight %}

### CSS universal Selector
Selects all HTML elements on the page:

{% highlight css %}
* {
    text-align: center;
    color: red;
}
{% endhighlight %}

### CSS Grouping Selector
Selects all HTML elements with the same style definitions.

{% highlight css %}
h1 {
    text-align: center;
    color: red;
}
h2 {
    text-align: center;
    color: red;
}
p {
    text-align: center;
    color: red;
}
{% endhighlight %}

When really, we could re-write the above using grouping via the `,` syntax:

{% highlight css %}
h1, h2, p {
    text-align: center;
    color: red;
}
{% endhighlight %}

## [How to Add CSS](https://www.w3schools.com/css/css_howto.asp)

Three ways:
1. External CSS
2. Internal CSS
3. Inline CSS

### External CSS
Each HTML page must include a reference to the external style sheet file inside a `<link>` element, inside the `head` section:

{% highlight css %}
<!DOCTYPE html>
<html>
  <head>
  <link rel="stylesheet" href="mystylesheet.css">
  </head>

  <body>
    <h1>This is a header.</h1>
    <p>This is a paragraph.</p>
  </body>
</html>
{% endhighlight %}

Which would then get styled using the `mystylesheet.css`. External CSS must be saved with `.css` and should not contain HTML tags.

### Internal CSS
Defined _inside_ the `<style>` element of an HTML page, inside the `head` section; Good if single page has a unique style or not much styling; e.g

{% highlight html %}
<!DOCTYPE html>
<html>
  <head>
    <style>
      body {
        background-color: linen;
      }

      h1 {
        color: maroon;
        margin-left: 40px;
      }
    </style>
  </head>
  <body>

  <h1>This is a heading</h1>
  <p>This is a paragraph.</p>

  </body>
</html>
{% endhighlight %}

### Inline CSS
Apply unique styling inline to a single element; e.g

{% highlight html %}
<h1 style="color:blue;text-align:center;">This is a blue heading that is center aligned</h1>
{% endhighlight %}

### Multiple Style Sheets
If properties have been defined for the same selector in different style sheets, the value from the _last read style sheet will be used_.

I.e, if you have an _external style sheet_ like so:

{% highlight css %}
//mystyle.css
h1 {
  color: navy;
}
{% endhighlight %}

and an _internal style sheet_ like so:

{% highlight css %}
h1 {
  color: orange;
}
{% endhighlight %}

Whether or not your h1 is going to end up orange or navy depends on how you define the abovementioned style sheets in your HTML:

* Orange:
{% highlight html %}
<!DOCTYPE html>
<html>
  <head>
    <link rel="stylesheet" type="text/css" href="mystyle.css">
    <style>
      h1 {
        color: orange;
      }
    </style>
  </head>
  <body>

  <h1>This heading will be orange</h1>

  </body>
</html>
{% endhighlight %}


* Navy:
{% highlight html %}
<!DOCTYPE html>
<html>
  <head>
    <style>
      h1 {
        color: orange;
      }
    </style>
    <link rel="stylesheet" type="text/css" href="mystyle.css">
  </head>
  <body>

  <h1>This heading will be navy</h1>

  </body>
</html>
{% endhighlight %}

### Cascading Order
What style is used when there are more than one style specified for an HTML element?

Well, all the styles in a page will "cascade" into a new "virtual" style sheet by the following rules, with descending priority:

1. Inline Style
2. External and internal style sheets
3. Browser default

## [CSS Comments](https://www.w3schools.com/css/css_comments.asp)

Starts with `/*` and ends with `*/`:

{% highlight css %}
/* This is a css comment */
{% endhighlight %}

### HTML and CSS Comments
HTML comments:

{% highlight html %}
<!-- This is a HTML comment -->
{% endhighlight %}

## [CSS Colors](https://www.w3schools.com/css/css_colors.asp)
Specified using pre-defined color names, RGB, HEX, HSL, RGBA, or HSLA values.

### CSS Color Names
Can be specified using a pre-defined color name, e.g:

{% highlight html%}
<!DOCTYPE html>
<html>
  <body>
    <h1 style="background-color:Tomato;">Tomato</h1>
    <h1 style="background-color:Orange;">Orange</h1>
    <h1 style="background-color:DodgerBlue;">DodgerBlue</h1>
    <h1 style="background-color:MediumSeaGreen;">MediumSeaGreen</h1>
    <h1 style="background-color:Gray;">Gray</h1>
    <h1 style="background-color:SlateBlue;">SlateBlue</h1>
    <h1 style="background-color:Violet;">Violet</h1>
    <h1 style="background-color:LightGray;">LightGray</h1>
  </body>
</html>
{% endhighlight %}

For a full list of the 140 supported color names, [see this page that lists colornames supported by all browsers](https://www.w3schools.com/colors/colors_names.asp).

### CSS Background Coloring
Is done via the `background-color:XXXX;` syntax:

{% highlight html%}
    <h1 style="background-color:Orange;">Orange background</h1>
{% endhighlight %}

### CSS Text color
Is done via the `color:XXXX;` syntax:

{% highlight html%}
    <h1 style="color:Black;">Black text</h1>
{% endhighlight %}

### CSS Border Color
Is done via the `border:` syntax:

{% highlight html%}
<!-- Draw a 2px wide, solid tomato border -->
<h1 style="border:2px solid Tomato;">Hello World</h1>
{% endhighlight %}

### CSS Color Values
Colors can also be specified using RGB/HEX/HSL/RGBA/HSLA values:

* RGB:

{% highlight css %}
h1 {
    background-color: rgb(255, 99, 71);
}
{% endhighlight %}

* Hex:

{% highlight css %}
h1 {
    background-color: #ff6347;
}
{% endhighlight %}

* [HSL -- hue, saturation, lightness](https://en.wikipedia.org/wiki/HSL_and_HSV):

{% highlight css %}
h1 {
    background-color: hsl(9, 100%, 64%);
}
{% endhighlight %}

* RGBA (RGB + Alpha, where the alpha value defines the opacity as a number between 0.0 (fully transparent) and 1.0 (fully opaque)):

{% highlight css %}
h1 {
    background-color: rgba(255, 99, 71, 0.5);
}
{% endhighlight %}

* HSLA (HSL + Alpha, where the alpha value defines the opacity as a number between 0.0 (fully transparent) and 1.0 (fully opaque)):

{% highlight css %}
h1 {
    background-color: hsla(9, 100%, 64%, 0.5);
}
{% endhighlight %}


## [CSS Backgrounds](https://www.w3schools.com/css/css_background.asp)

The CSS background properties are used to define the background effects for elements.

### CSS background-color

The `background-color` property specified the background color of an element:

{% highlight css %}
body {
    background-color: red;
    /* If I wanted to make it almost transparent:
    opacity: 0.2
    */
}
{% endhighlight %}

You can add an additional `opacity` property to specify the opacity/transparency of an element, ranging from 0.0 (fully transparent) to 1.0 (fully opaque).
* NOTE: All child elements inherit the same transparency. Instead, use `rgba()` to color and element with opacity, without affecting the children objects.

### CSS background-image

The `background-image` property specifies an image to use as the background of an element.

> By default, the background-image property repeats an image both horizontally and vertically.

{% highlight css %}
body {
    background-image: url("paper.gif");
}
{% endhighlight %}

### CSS background-repeat

From above:

> By default, the background-image property repeats an image both horizontally and vertically.

Depending on your image, you may only want it to repeat horizontally or vertically, as repetitions would otherwise ruin the look (think gradients)

{% highlight css %}
body {
    background-image: url("gradient.gif");
    /* Only repeat horizontally, since otherwise the gradient looks like checker board */
    background-repeat: repeat-x;
}
{% endhighlight %}

Setting a value of **no-repeat** for the property would disable the image being repeated at all.

### CSS background-position

The `background-position` property is used to specify position of the backgroun image.

Example values: `right top`.

### CSS background-attachment

Specifies whether the background image should scroll or be fixed and not scroll with the rest of the page. Values are:

{% highlight css %}
body {
    background-image: url("img_tree.png");
    background-attachment: fixed;
    /* vs */
    background-attachment: fixed;
}
{% endhighlight %}

### CSS background shorthand notation
You can set all the above properties using a shorthand syntax in one line, like so:

{% highlight css %}
body {
    background: #ffffff url("img_tree.png") no-repeat right top;
}
{% endhighlight %}

When using the shorthand property the order of the property values is:

* `background-color`
* `background-image`
* `background-repeat`
* `background-attachment`
* `background-position`

## [CSS Borders](https://www.w3schools.com/css/css_border.asp)
Allows you to specify styling of an element's border.

### CSS border-style

The `border-style` property specifies what kind of border to show.

The following are supported:

| Value      | Effect                                                        |
|------------|---------------------------------------------------------------|
| `dotted`   | A dotted border.                                              |
| `dashed`   | A dashed border.                                              |
| `solid`    | A solid border.                                               |
| `double`   | A double border.                                              |
| `groove`   | A 3D grooved border. Effect depends on the border-color value.|
| `ridge`    | A 3D ridged border. Effect depends on the border-color value. |
| `inset`    | A 3D inset border. Effect depends on the border-color value.  |
| `outset`   | A 3D outset border. Effect depends on the border-color value. |
| `none`     | No border.                                                    |
| `hidden`   | A hidden border.                                              |
|---

The property can have 1 to four values, each for the top, right, bottom, and left border(s).

Example:

{% highlight html %}
<!DOCTYPE html>
<html>
  <head>
    <style>
      p.dotted {border-style: dotted;}
      p.dashed {border-style: dashed;}
      p.solid {border-style: solid;}
      p.double {border-style: double;}
      p.groove {border-style: groove;}
      p.ridge {border-style: ridge;}
      p.inset {border-style: inset;}
      p.outset {border-style: outset;}
      p.none {border-style: none;}
      p.hidden {border-style: hidden;}
      p.mix {border-style: dotted dashed solid double;}
    </style>
  </head>
  <body>
    <h2>The border-style Property</h2>
    <p>This property specifies what kind of border to display:</p>

    <p class="dotted">A dotted border.</p>
    <p class="dashed">A dashed border.</p>
    <p class="solid">A solid border.</p>
    <p class="double">A double border.</p>
    <p class="groove">A groove border.</p>
    <p class="ridge">A ridge border.</p>
    <p class="inset">An inset border.</p>
    <p class="outset">An outset border.</p>
    <p class="none">No border.</p>
    <p class="hidden">A hidden border.</p>
    <p class="mix">A mixed border.</p>
  <body>
</html>
{% endhighlight %}

Which looks like so:

![]({{ site.baseurl }}/img/border_style_examples.png)


Use `border-radius` to add roundness to borders of an element. Higher the value, the more rounded the border will be.

## [CSS Margins](https://www.w3schools.com/css/css_margin.asp)

`margin` property is used to create space around elements, outside of any defined borders; is suffixed with -top, -right, -bottom, or -left to set the according margin. Can have the following values:

* auto -- Calculated by the browser
* _length_ -- Specify an explicit value in px, pt, cm, etc...
* _%_ -- Specify a margin in percentage of the widt of the _containing_ element.
* inherit -- Inherit margin from parent element.

Similar to `background`, `margin` also supports shorthand declaration, where the margins are defined in one line in the order of top, right, bottom, left.

If values or omitted, the pairing side matches the previously defined value. i.e,
* defining top, right, and bottom: left will have the same value as right.
* defining top and right: bottom will have same value as top, left same as right
* defining top: right, bottom, and left will have same as top

## [CSS padding](https://www.w3schools.com/css/css_padding.asp)
The `padding` property is same as `margins` wrt `-right`, etc... and the same for values (except no auto).

`width` property defines the width of an element's content area (portion inside the padding, border, and margin).
* If width is specified, padding added to the element will be added to the total width (usually not desired)
* To force width to be certain size, regardless of padding amount, use `box-sizing` property; increasing padding will decrease available content space.

## [CSS height/width](https://www.w3schools.com/css/css_dimension.asp)

`height` and `width` are used accordingly. Does _not_ include padding, borders, or margins; it sets the height/width of the area _inside_ the padding, etc...

Use `max-width` (which overrides `width`) to better handle scenarios with varying window sizes.

## [CSS Box Model](https://www.w3schools.com/css/css_boxmodel.asp)

HTML elements can be considered "boxes", in which every HTML element is surrounded by a nesting set of boxes.

```
      ---------------------------------------------------------------------------
      |                                Margin                                   |
      |    |--------------------------------------------------------------|     |
      |    |                           Border                             |     |
      |    |    ------------------------------------------------------    |     |
      |    |    |                      Padding                       |    |     |
      |    |    |    |------------------------------------------|    |    |     |
      |    |    |    |                                          |    |    |     |
      |    |    |    |                 Content                  |    |    |     |
      |    |    |    |                                          |    |    |     |
      |    |    |    |------------------------------------------|    |    |     |
      |    |    |                                                    |    |     |
      |    |    ------------------------------------------------------    |     |
      |    |                                                              |     |
      |    |--------------------------------------------------------------|     |
      |                                                                         |
      ---------------------------------------------------------------------------
```

Be sure to take into account doubling the padding, border, and margin in addition to overall height/width when calculating totaly size of an object.


## [CSS outline](https://www.w3schools.com/css/css_outline.asp)

> Different than margin!

Outlines exist _outisde_ an elements border (and may overlap other elements!); an element's total height/width is not impacted by outlines.

# Typography

### [CSS Text color](https://www.w3schools.com/css/css_text.asp)

Font color is set by the `color` property. Able to be set via color name, hex, or RGB.

> **For W3C compliant CSS: If you define the color property, you must also define the background-color.**

### CSS text-alignment
Sets the horizontal alignment of a text; either left, right, centered, or justified (`justify`).

### CSS text-decoration
Set or remove decoration from text; usually, `none` is used to remove underlines from links, but can also be used to add to text:
* overline
* underline
* line-through

### CSS text-transform
Use `text-transform` to upper/lowecase all text:
* uppercase
* lowercase
* capitalize

### CSS text spacing
Use `text-indent` to specify indentation of first line in text.

Use `letter-spacing` to specify, well, letter spacing:

{% highlight css %}
h1 {
  letter-spacing: 3px;
}
h2 {
  letter-spacing: -3px;
}
{% endhighlight %}

Use `word-spacing` to specify space between words (similarly to letter-spacing).

Use `line-height` to specify space _between_ lines:

{% highlight css %}
p.small {
  line-height: 0.8;
}
p.big {
  line-height: 1.8;
}
{% endhighlight %}

Use `white-space` to define how white-space inside elements is handled.

{% highlight css %}
white-space: normal|nowrap|pre|pre-line|pre-wrap|initial|inherit;
{% endhighlight %}

From the [white-space page](https://www.w3schools.com/cssref/pr_text_white-space.asp):

| Value   | 	Description |
|---------|---------------|
| normal  |	Sequences of whitespace will collapse into a single whitespace. Text will wrap when necessary. This is default |
| nowrap  |	Sequences of whitespace will collapse into a single whitespace. Text will never wrap to the next line. The text continues on the same line until a `<br>` tag is encountered |
| pre     |	Whitespace is preserved by the browser. Text will only wrap on line breaks. Acts like the `<pre>` tag in HTML |
| pre-line|	Sequences of whitespace will collapse into a single whitespace. Text will wrap when necessary, and on line breaks |
| pre-wrap|	Whitespace is preserved by the browser. Text will wrap when necessary, and on line breaks |
| initial |	Sets this property to its default value. |

## Fonts

### [CSS fonts](https://www.w3schools.com/css/css_font.asp)

The `font` properties define font family, boldness, size, and style of text on a page.

#### CSS font families
Two types in CSS:

1. **Generic family**: group of font families with a similar _look_ ("Serif", "monospace", etc)
2. **Font family**: A _specific_ font family ("Times New Roman", "Roboto", "Comic Sans", etc)

In general, on computer screens, sans-serifs are easier to read.

#### CSS font-family

Use `font-family` to set the font family of a given body of text; Use several font names as a fallback system if the browser doesn't support the first listed font.

If font family is more than one word, be sure to use `""` around the font (like `font-family: "Times New Roman", Times, serif`)


#### CSS font-style

Use `font-style` (mostly) for italics:

Can have a value of:
* **normal**: Text is shown normally.
* **italic**: Text is shown in italics.
* **oblique**: Text is shown _leaning_ (similar to italic, but less supported).

USe `font-weight` to specify weight of a font.


{% highlight css %}
/* Can be:
font-weight: normal|bold|bolder|lighter|number|initial|inherit;

or also a numberical value 100 - 900 in increments of 100s; 400 == normal, 700 == bold
*/
p.normal {
  font-weight: normal;
}
p.light {
  font-weight: lighter;
}
p.thick {
  font-weight: bold;
}
p.thickest {
  font-weight: 900;
}
{% endhighlight %}

Use `font-variant` for **_small-caps_**, to be like Mr. Bateman:

![](https://hobancards.com/sites/all/themes/hcshop/images/blog_3011/patrick_bateman.jpg){:height="60%" width="60%"}

#### CSS font-size

Use `font-size` to set the size of text.
* Do not use font size to make paragraphs look like headings or vice versa (use proper HTML tags)
* font-size value can be an absolute or relative size
* Default size for normal text is 16px (== 1em)

Setting the font to and absolute size:
* Sets the text to a specific size
* Does not allow a user to change text size in all browsers
* Absolute size is useful when the physical size of the output is known (and will never change)

Setting font to a relative size:
* Sets size relative to surroundings
* Allows a user to change the text size in browser (good for responsiveness)

If you use `px` for the font size, the text font will still scale appropriately when zooming an entire page in/out.

Using `em` allows for this same feature, but also allows users to resize the text.
* em is the unit recommened by the W3C
* 1em is equal to the current font size. The default text size in browsers is 16px. So, the default size of 1em is 16px.
* pixels to em: pixels/16=em

{% highlight css %}
h1 {
    font-size: 2.5em; /* 40px/16=2.5em */
}
h2 {
    font-size: 1.875em; /* 30px/16=1.875em */
}
p {
    font-size: 0.875em; /* 14px/16=0.875em */
}
{% endhighlight %}

> The best solution that works in all browsers is to set a default font-size in percent for the `<body>` element:

{% highlight css %}
body {
    font-size: 100%;
}
h1 {
    font-size: 2.5em;
}
h2 {
    font-size: 1.875em;
}
p {
    font-size: 0.875em;
}
{% endhighlight %}

#### Responsive Font size
Is achieved using the `vw` unit of measurement (viewport width):

{% highlight css %}
h1 {
    /* 10vw means 10% of the viewport width */
    /* viewport width = browser window size; 1vw = 1% viewport width*/
    font-size: 10vw;
}
{% endhighlight %}

#### Using Google Fonts
Is possible using the Google Fonts API, via a stylesheet link that references any font family from Google Fonts;


{% highlight html %}
<!DOCTYPE html>
<html>
  <head>
    <link href='https://fonts.googleapis.com/css?family=Bungee Outline' rel='stylesheet'>
    <style>
      body {
        font-family: "Bungee Outline";
        font-size: 22px;
      }
    </style>
  </head>
  <body>
    <h1>Bungee Outline</h1>
    <p>Lorem ipsum dolor sit amet, consectetuer adipiscing elit.</p>
  </body>
</html>
{% endhighlight %}

#### Font shorthands
Similar to margin and padding, `font` property is shorthand for the following:
* font-style
* font-variant
* font-weight
* font-size/line-height
* font-family

Examples:

{% highlight css %}
/* font-size and font-family values are required */
p.a {
  font: 20px Arial, sans-serif;
}
p.b {
  font: italic small-caps bold 12px/30px Georgia, serif;
}
{% endhighlight %}


And that about wraps it up for today for all the time I have; I'll look to continue going through the CSS tutorial on a later day.
