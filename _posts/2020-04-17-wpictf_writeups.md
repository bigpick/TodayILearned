---
author: george_pick
layout: post
title: "WPICTF 2020"
excerpt: "Writeups for various challenges I solved during the 2020 WPICTF capture the flag competition."
categories: [Capture The Flag]
---

> root@wpictf~# WHEN
>
>  April 17th 5pm to 19th 5pm EDT (9PM UTC)
>
>  0d 0h 0m 00s
>
> root@wpictf~# WHO
>
>  Anyone and everyone!
>
>  Conglomorate at [discord](https://discord.gg/C7GUsdV)
>
> root@wpictf:~# WHERE
>
>  https://ctf.wpictf.xyz
>
> root@wpictf:~# PRIZES
>
>  Global and WPI prizes
>
>  [More Info](https://ctf.wpictf.xyz/prizes)
>
> root@wpictf:~# CTFTime link
>
>  https://ctftime.org/event/913

These are writeups to challenges I solved for this CTF.

# Solved

| Web | Crypto | Recon | Misc |
| [zoop](#-zoop) | [Illuminati Confirmed](#illuminati-confirmed) | [dns_wizard](#dns_wizard) | [John Cena](#john-cena-) |
| [autograder](#autograder) | | [PR3S3N70R](#pr3s3n70r) | [desertbus](#desertbus) |
| | | | [Remy’s Epic Adventure 2: Electric Boogaloo](#remys-epic-adventure-2-electric-boogaloo)|
|---
| | | | |

&nbsp;
&nbsp;
---

# Web
## 👉😎👉 (zoop)
>
> 👈😎👈Zoop👉😎👉Zoop 👈😎👈Zoop👉😎👉Zoop 👈😎👈Zoop👉😎👉Zoop 👈😎👈Zoop👉😎👉Zoop 👈😎👈Zoop👉😎👉Zoop 👈😎👈Zoop👉😎👉Zoop 👈😎👈Zoop👉😎👉Zoop 👈😎👈Zoop👉😎👉Zoop 👈😎👈Zoop👉😎👉Zoop 👈😎👈Zoop👉😎👉Zoop 👈😎👈Zoop👉😎👉Zoop 👈😎👈Zoop👉😎👉Zoop 👈😎👈Zoop👉😎👉Zoop 👈😎👈Zoop👉😎👉Zoop 👈😎👈Zoop👉😎👉Zoop 👈😎👈Zoop👉😎👉Zoop 👈😎👈Zoop👉😎👉Zoop 👈😎👈Zoop👉 ….
>
> http://zoop.wpictf.xyz

Going to that website:

&nbsp;
![]({{ site.baseurl }}/img/wpi2020/zoomer_home.png)
&nbsp;

And we can see that if we click the `Attach` option, there's a `Preview` button. If we try a common file name for flags, `flag.txt`:

&nbsp;
![]({{ site.baseurl }}/img/wpi2020/zoomer_flag.png)
&nbsp;

Flag is `WPI{tH4nKs_z00m3r_jh0n50n}`.

## autograder
> A prof made a little homework grader at https://autograder.wpictf.xyz/ but I heard he is hiding a flag at /home/ctf/flag.txt
>
> made by: awg and rm -k

Going to that website, we see a page that has some placeholder code that we can compile/run.

&nbsp;
![]({{ site.baseurl }}/img/wpi2020/autograder.png)
&nbsp;

This reminds me of a challenge that was in a previous CTF I did recently, where we could [include the flag file and the "C compiler program" would spit out the contents of that file](https://bigpick.github.io/TodayILearned/articles/2020-03/fireshell-ctf-writeups#caas). We can try that here, since we get a path of the flag in the problem description:

&nbsp;
![]({{ site.baseurl }}/img/wpi2020/autograder_flag.png)
&nbsp;

Flag is `WPI{D0nt_run_as_r00t}`.

# Crypto
## Illuminati Confirmed
> I've intercepted multiple copies of an encrypted message from the leader of the Worcester chapter of the Illuminati. I think it contains the time of their next meeting. Can you help me decrypt them?
>
> made by: acurless
>
> c1=515274042976912179894435774656907420040599503456517078488056218986662017260212389975972477279505310799399071383390618892499008790928347543017765027618590150794317674792875250152206518326158674718404382617692169589911938548819188733852354294583496715425255584973283840789780326402769751705164900106921523637157271605500111846563844641773661723255718653040958019618435501230171699432186518803652675691180548548982155426472648502704469425298466513665043628724497448475714424482446137414939511691724839553567514050622159418495196773388690852258256550787962177196383253952227153557220272199293397879908308572668952866439
>
> c2=10512934566887371506285681495672139256544177416158977932082410009242386741198073874632763611137937701329570263046854521709347241390006612379393018933295475369159148328248445221357906382527678877429535168220389698475391828837227453358681276167720605617228338487308750653165147019400915842904872988789759529121710032871148507314874152494680057046977274373381326003405301191489108322498519602528688873942243307708631394538177629868515911161222795303220989599519719169300455717641863368473309673489958952173445661451265442004625237606054046962062434813126456494957846077185121041599277143211160596207640833275850170891378
>
> c3=4122591425712279559823043898131225014447235394996958162806737555257607173149332839353292933732548212376056402900761362427837044396517072345683265668973735260384169928448531246071624967168190024583028639591981238222340513125989229227761894026521238496145716707176637113415430809586007230597253976748507442809040629281971868442704017013258355403718545489677897799000961350863824810217217745918503635905775610161826572608564207497464646323778407843991683950506484189720225535503643332574132841288909783555334280205740975729691459011043954137669831817945210956835398278009161994675851980163314376477384045294293755909874
>
> n1=21939147590581954242131893557689750173730181114330873782062274456630281986233643990882568426690149971468987847436717513764939861105600249325682418749886588739440853385485272501856860578476795830603738468829294920737586209822299603185425324611481798231193950636987017718955070420091525231666894903436050998112803225822333684113551754209802262129292376015861410644289380376439390552627189657966103965089679163295591136464541998227543058082734503570960156783196006833967361311083486266118899788620317372054292861892020849652213277431575285275801196626852675579752895079650118836892859390462805733596279690076656763624249
>
> n2=26325215018784165663958487526715385161171636566916698114816183716597566424675870012796860473421390775180027083457908584461525282815469520282303059318923930531826588673345113634118988713179894971211405380241575065877886390347877768297280022387015195069836149198306647472534681286406136303674462323742151285361538383784282113898065157278366533587767199303585208673225974716800760227497569577072903884939422787710986913747191378087554442395968729847569180921093186599977266346501947184849099856506537976370069200813758143237937721729073822639191799709052936074831322440705620902220824412476988222346922869104007199777561
>
> n3=23013589835547680503802140462487647716102548445081685245087901486321520435018899614072711065158868927754813316329675676910885474767916372370942795565358071859270832973837949423193707764788999822539648518439967218163608118921979697363190728350735745938069012584523314223346479156208977445194408267152808800890485882602068876756801123087623323707553203656108124651989136578687688847505350883163751096338640206246619001851586459510648241545637475283654557530338836698680934504086346810521919864048046078444168117563048636886066060497385368685340990757248020960409380316695810483273153565980791846594355984630591111120973
>
> e=3

So based on previous experience, this format looks to be presenting information that is vulnerable to the CRT/[Hastad's Attack](https://en.wikipedia.org/wiki/Coppersmith%27s_attack#H%C3%A5stad's_broadcast_attack) (if weren't exposed to crypto a lot before, googling "n1 n2 n3 c1 c2 c3 rsa ctf" will yield you results on the first results).

With that in mind, I used a [script from someone from a previous CTF of a challenge in the same format](https://www.rootnetsec.com/picoctf-broadcast/). However, running this with our input results in the program complaining about the hex format:

{% highlight python %}
echo "21939147590581954242131893557689750173730181114330873782062274456630281986233643990882568426690149971468987847436717513764939861105600249325682418749886588739440853385485272501856860578476795830603738468829294920737586209822299603185425324611481798231193950636987017718955070420091525231666894903436050998112803225822333684113551754209802262129292376015861410644289380376439390552627189657966103965089679163295591136464541998227543058082734503570960156783196006833967361311083486266118899788620317372054292861892020849652213277431575285275801196626852675579752895079650118836892859390462805733596279690076656763624249" > n0
echo "26325215018784165663958487526715385161171636566916698114816183716597566424675870012796860473421390775180027083457908584461525282815469520282303059318923930531826588673345113634118988713179894971211405380241575065877886390347877768297280022387015195069836149198306647472534681286406136303674462323742151285361538383784282113898065157278366533587767199303585208673225974716800760227497569577072903884939422787710986913747191378087554442395968729847569180921093186599977266346501947184849099856506537976370069200813758143237937721729073822639191799709052936074831322440705620902220824412476988222346922869104007199777561" > n1
 echo "23013589835547680503802140462487647716102548445081685245087901486321520435018899614072711065158868927754813316329675676910885474767916372370942795565358071859270832973837949423193707764788999822539648518439967218163608118921979697363190728350735745938069012584523314223346479156208977445194408267152808800890485882602068876756801123087623323707553203656108124651989136578687688847505350883163751096338640206246619001851586459510648241545637475283654557530338836698680934504086346810521919864048046078444168117563048636886066060497385368685340990757248020960409380316695810483273153565980791846594355984630591111120973" > n2
 echo "515274042976912179894435774656907420040599503456517078488056218986662017260212389975972477279505310799399071383390618892499008790928347543017765027618590150794317674792875250152206518326158674718404382617692169589911938548819188733852354294583496715425255584973283840789780326402769751705164900106921523637157271605500111846563844641773661723255718653040958019618435501230171699432186518803652675691180548548982155426472648502704469425298466513665043628724497448475714424482446137414939511691724839553567514050622159418495196773388690852258256550787962177196383253952227153557220272199293397879908308572668952866439" > c0
 echo "10512934566887371506285681495672139256544177416158977932082410009242386741198073874632763611137937701329570263046854521709347241390006612379393018933295475369159148328248445221357906382527678877429535168220389698475391828837227453358681276167720605617228338487308750653165147019400915842904872988789759529121710032871148507314874152494680057046977274373381326003405301191489108322498519602528688873942243307708631394538177629868515911161222795303220989599519719169300455717641863368473309673489958952173445661451265442004625237606054046962062434813126456494957846077185121041599277143211160596207640833275850170891378" > c1
 echo "4122591425712279559823043898131225014447235394996958162806737555257607173149332839353292933732548212376056402900761362427837044396517072345683265668973735260384169928448531246071624967168190024583028639591981238222340513125989229227761894026521238496145716707176637113415430809586007230597253976748507442809040629281971868442704017013258355403718545489677897799000961350863824810217217745918503635905775610161826572608564207497464646323778407843991683950506484189720225535503643332574132841288909783555334280205740975729691459011043954137669831817945210956835398278009161994675851980163314376477384045294293755909874" > c2

python2 broadcast.py n0 n1 n2 c0 c1 c2


	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	        RSA Hastad Attack
	         JulesDT -- 2016
	         License GNU/GPL
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
Decoded Hex :
20eabf3319bfadeb2cbd337f5567c12a92e2c9cdc33619dde91badfd758e7fedffcb11774c90cb9026ac967282b45b11f14039762cb02aa3afa9acd16fef9860078e1a6eb12afc1ed341ae5bf31468144ff1671a4f64a563278690ed70d3249c493df9fd2d90ee96213bc2ab1bb65e84081af3104c0e3e670f206c6a0fe5bc6e48454aa90f836
---------------------------
As Ascii :
Traceback (most recent call last):
  File "lol.py", line 143, in <module>
    print "As Ascii :\n",resultHex.decode('hex')
  File "/System/Library/Frameworks/Python.framework/Versions/2.7/lib/python2.7/encodings/hex_codec.py", line 42, in hex_decode
    output = binascii.a2b_hex(input)
TypeError: Odd-length string
{% endhighlight %}

So instead, I added a print statement to just dump the decimal value, which ended up being `104101108108111044084104101110101120116109101101116105110103105115097116049048048073110115116105116117116101082100111110087101100110101115100097121077097121049051044050048050048046053112109046068111110116098101108097116101087080073123067104049110051115051095082051077064105110100051082095084104051048114051109095033095125046`. Then, I plugged that in to [this webpage that converts between decimal, ASCII, hex, binary, etc](https://www.rapidtables.com/convert/number/ascii-hex-bin-dec-converter.html), and saw the flag in the ASCII box:

{% highlight bash %}
hello,Thenextmeetingisat100InstituteRdonWednesdayMay13,2020.5pm.DontbelateWPI{Ch1n3s3_R3M@ind3R_Th30r3m_!_}.
{% endhighlight %}

Flag is `WPI{Ch1n3s3_R3M@ind3R_Th30r3m_!_}`.

# recon
## dns_wizard
> Can you find it?
>
> made by: acurless

So, we probably need to find some information using the DNS lookup information. I started with `dig`, but that did not yield any results. Some googling lead me to [try looking for `TXT` type records](https://rawsec.ml/en/icectf-2016-icectf-40-search-misc/):

{% highlight bash %}
dig -t TXT wpictf.xyz

; <<>> DiG 9.10.6 <<>> -t TXT wpictf.xyz
;; global options: +cmd
;; Got answer:
;; ->>HEADER<<- opcode: QUERY, status: NOERROR, id: 21821
;; flags: qr rd ra; QUERY: 1, ANSWER: 1, AUTHORITY: 0, ADDITIONAL: 1

;; OPT PSEUDOSECTION:
; EDNS: version: 0, flags:; udp: 512
;; QUESTION SECTION:
;wpictf.xyz.			IN	TXT

;; ANSWER SECTION:
wpictf.xyz.		300	IN	TXT	"V1BJezFGMHVuZF9UaDNfRE5TLXJlY29yZH0="

;; Query time: 29 msec
;; SERVER: 192.168.1.1#53(192.168.1.1)
;; WHEN: Fri Apr 17 20:01:48 EDT 2020
;; MSG SIZE  rcvd: 88
{% endhighlight %}

And that _definitely_ looks like some base64 info:


{% highlight bash %}
echo V1BJezFGMHVuZF9UaDNfRE5TLXJlY29yZH0= | base64 -d
WPI{1F0und_Th3_DNS-record}
{% endhighlight %}

Flag is `WPI{1F0und_Th3_DNS-record}`.

## PR3S3N70R
> i wuz @r2con2019
>
> (Hint: you may need to sort-by new)
>
> -made by awg
>
> Note: The flag is in the standard format

Searching google for "r2con2019" leads us to a twitter results page for `#r2con2019` as the second result.

Clicking that, and sorting the results by "latest", we see that (at the time of writing this) [the fourth most recent tweet](https://twitter.com/radareorg/status/1228285126330781696) is about the author of the challenge!

> Published another #r2con2019 talk: "Object Diversification with my help (r2)" - by Alex Gaines - https://t.co/EZmSqQP8zd?amp=1

Going to that brings us to a youtube video of the author's talk at r2con2019 (nice).

I was a bit tripped up here, as I though the "sort by new" hint was a one time deal, as we did it already for the tweets. However, if we sort the comments on this video by latest, we see what looks to be the flag (almost):


&nbsp;
![]({{ site.baseurl }}/img/wpi2020/youtube_comment.png)
&nbsp;

If we look through the slides, or watch the video, we see that he refers to his code bits as "cruftables", so we can try that as the flag, and it works.

Flag is `WPI{@wg_1s4ch@ncruftables}`.

# misc

## John Cena 🎺🎺🎺🎺
> You can't see him, but can you see the flag?
>
> http://us-east-1.linodeobjects.com/wpictf-challenge-files/braille.png
>
> made by: ollien, with a little help from acurless

I found [some source code for this one](https://github.com/HackerSchool/wpictf_ctf) online will the competition was still going :). People, stop commiting code for live competitions!

Running the code, we get the following output:


{% highlight bash %}
7F454C4602010100000000000000000002003E000100000080004000000000004000000000000000E0000000000000000000000040003800010040000400030001000000070000008000000000000000800040000000000080004000000000004900000000000000490000000000000010000000000000000000000000000000B801000000BF01000000BEB400400031C9678B140E83C2316789140EFFC183F91575EEBA150000000F05B83C00000031FF0F0500261F184A3B034200470A0042032E0432414431044C002E7368737472746162002E74657874002E6461746100000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000B00000001000000070000000000000080004000000000008000000000000000330000000000000000000000000000001000000000000000000000000000000011000000010000000300000000000000B400400000000000B4000000000000001500000000000000000000000000000004000000000000000000000000000000010000000300000000000000000000000000000000000000C9000000000000001700000000000000000000000000000001000000000000000000000000000000
{% endhighlight %}

Looking up those first few bytes, we can see they're the file signature for:

> 7F 45 4C 46
> [Executable and Linkable Format](https://en.wikipedia.org/wiki/Executable_and_Linkable_Format)

So, we can make an ELF file out of them:

{% highlight bash %}
echo 7F454C4602010100000000000000000002003E000100000080004000000000004000000000000000E0000000000000000000000040003800010040000400030001000000070000008000000000000000800040000000000080004000000000004900000000000000490000000000000010000000000000000000000000000000B801000000BF01000000BEB400400031C9678B140E83C2316789140EFFC183F91575EEBA150000000F05B83C00000031FF0F0500261F184A3B034200470A0042032E0432414431044C002E7368737472746162002E74657874002E6461746100000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000B00000001000000070000000000000080004000000000008000000000000000330000000000000000000000000000001000000000000000000000000000000011000000010000000300000000000000B400400000000000B4000000000000001500000000000000000000000000000004000000000000000000000000000000010000000300000000000000000000000000000000000000C9000000000000001700000000000000000000000000000001000000000000000000000000000000 | xxd -p -r >john_cena
# file john
john: ELF 64-bit LSB executable, x86-64, version 1 (SYSV), statically linked, stripped
{% endhighlight %}

And then run it:

{% highlight bash %}
# ./john
WPI{l4s1x;1s4_5crub5}
{% endhighlight %}

Flag is `WPI{l4s1x;1s4_5crub5}`.

## desertbus
> Why use a high priority bus when you can take the ascii taxi instead? (might take 3 hours)
>
> ssh ctf@desertbus.wpictf.xyz password: desertbus
>
> made by rm -k

A game, where it automatically moves your vehicle up or down depending on your current score. If you are at the top or bottom, your score drastically slows down. Eventually, objects appear. Based off of [Desert Bus: The Very Worst Video Game Ever Created](https://www.newyorker.com/tech/annals-of-technology/desert-bus-the-very-worst-video-game-ever-created), WPI presents you:

Desertbus: The worst CTF challenge ever made. Seriously. Have fun wasting three hours of your life.

&nbsp;
![]({{ site.baseurl }}/img/wpi2020/bus.gif)
&nbsp;

Flag is `WPI{f@R3_i$_tr33_fIddie}`.

## Remy's Epic Adventure 2: Electric Boogaloo
> The long-awaited sequel of the tribute to the former God Emperor of CSC and Mankind, Ultimate Protector of the CS Department
>
> http://us-east-1.linodeobjects.com/wpictf-challenge-files/Remys V1.1.zip
>
> made by: Justin
>
> Note: To those struggling with capitalization, everything is uppercase except the r's.

&nbsp;
![]({{ site.baseurl }}/img/wpi2020/pro_gamer.png)
&nbsp;

The mentioned `.zip` file is a folder for a Windows `.exe` game and it's supporting files.

Playing the `Game.exe` file, we see it looks like a RPG type game. We start off in an overworld, and have to go to "Da Town" first to pick up another character. Then, we can proceed to the main dungeon, where we pick up another character. At the end of the dungeon, is the "brainwashed Illuminati", which when attacked get's 0 damage and does a lot to us.

So, we need some sort of weapon or modifier to be able to defeat it. In the overworld before the dungeon, there's a seller which has a "DNS Resolver" which gives one of our Adrian characters an ability to connect to his media server. The problem is that it costs `999,999` Vimcoins, which would be impossible to obtain.

I tried looking through things with `Cheat Engine`, but that was not successful. After talking with the author, he mentioned one of the only things I didn't try yet I should, which was modifying some of the source files directly.

I did a `grep -r 999999 .` from the main folder root, and it led me to the `www/data/Map001.json` file. There, we can see what looks to be the DNS resolver item, and noticeably, its price:

{% highlight javascript %}
cat Map001.json| jq '.events[] | select(.id == 8) | .pages[].list[] | select(.code == 605)'
...
{
  "code": 605,
  "indent": 0,
  "parameters": [
    0,
    5,
    1,
    999999
  ]
}
{% endhighlight %}

I changed that `999999` value to `0`, and also modified some of the values in `Enemies.json` too so that the Zoomers only had 1 health (and for good measure, put the Brainwashed illuminati to 0 as well):

{% highlight javascript %}
    “name”: “Zoomer”,
    “note”: “”,
    “params”: [
      1,
      0,
      0,
      0,
      0,
      0,
      0,
      0
    ]
…
    “name”: “Brainwashed Illuminati”,
    “note”: “”,
    “params”: [
      1,
      1,
      0,
      0,
      0,
      0,
      0,
      0
    ]
{% endhighlight %}

Then, starting a new game with these files, was able to obtain the DNS Resolver for 0 coins:


&nbsp;
![]({{ site.baseurl }}/img/wpi2020/free_dns.gif)
&nbsp;

And then beat the boss to get to the flag. I also modified the experience gained for defeating an enemy to be huge (for max rank immediately) and also made the zoomer's health to 1 for easier kills as well. The following GIF shows:

* equipping the DNS resolver that we got for free
* Beating zoomers with 1 health
* The max level experience gained from it
* Defeating the boss via the free DNS

&nbsp;
![]({{ site.baseurl }}/img/wpi2020/remy_main.gif)
&nbsp;

Once the boss is defeated, we get transported to the end stage, which spells out the flag:

&nbsp;
![]({{ site.baseurl }}/img/wpi2020/remy_flag.gif)
&nbsp;

Flag is `WPI{JrPGZ_r_SUGOI}`.

Afterwards, I talked with the author as I was curious if it was possible to just wrong-warp to the end world but:

> gp
>
> Nice! Now I'm kinda curious if you could just like wrong warp straight to the flag world if you messed with the other stuff

> Justin
>
> People have tried but I put a LOT of false win screens in the game

> gp
>
> lmao

So, sorry to those people :) I guess I didn't even need the DNS resolver either since I just made the end boss' health 1 like the Zoomer's as well? Nope, that would have been wrong too:

> Justin
> You do actually need to kill the illuminati with the free software song to win.
>
> Otherwise the game calls you out and game overs
>
> Or rather, having the free software song in your arsenal

So, kudos to the author for a pretty legit game, I guess?
