---
author: george_pick
layout: post
title: "b01lers bootcampCTF CryptoWorld writeups 2020"
excerpt: "Writeups for various challenges I solved during the 2020 b01lers bootcamp capture the flag competition, specifically for the themed 'Crypto World'!"
categories: [Capture The Flag]
---

## Welcome, To Crypto World !!!!!

I wanted to do this separate than the rest of the b0ilers 2020 bootcamp CTF writeups, since this was pretty involved/large.

> Series of Mini Challenges made by @dm. There are two larger flags available if you exploit the website as well. Neither hidden challenge requires solving any of the minis. Those challenges are at the bottom of the challenge list - it is sorted by score.
>
> http://chal.ctf.b01lers.com:1337
>
> You will need a token to authenticate, which should have been inserted into your profile page.
>
> This challenge contains 12*3 mini-challenges related to crypto. The  
> challenges are labeled by a letter A-L, indicating challenge type,  
> and a number 1-3, indicating difficulty.  
>
> Flag format for the mini-challenges: mini{[A-L][1-3]_[0-9,a-f]+}
>
> The first two characters (e.g., A2) give the name of the  
> mini-challenge to which the flag should be submitted.
>
> Flags in the FAKE{} format are demo flags and can not be submitted for points.

When you connect to the service, we land in an interactive story/prompt:

![]({{ site.baseurl }}/img/b01lers_bootcamp2020/world_home.png)


You can navigate via the options in the top right, which allow you to move N/E/S/W to what I'll be calling "rooms".

After observing all the offered rooms, I present the lay of the land:

![]({{ site.baseurl }}/img/b01lers_bootcamp2020/map.png)

Forgive me for any misnamed rooms/topics, I'm not a crypto guy ;P (but I've tried to be as accurate as possible, as learning as we go here, folks)

|      |     |      |     |
|--------------------------------------------------------|-----------------------------|--------------------------------|---------------------------------------------|
| [Solve Equations x/y Room](#solve-equations-xy-room)   | [Factor Room](#factor-room) | [Bezout Room](#bezout-room)    | [Start Room](#start-room)                   |
| [Exp. Congruence Room](#exponential-congruence-room)       |                             | [Counting Primes Room](#counting-primes-room) | [CRT Room](#chinese-remainder-theorem-room) |
| [kth Root Modulo N Room](#kth-root-modulo-n-room) |          |                                | [XOR Room](#xor-room)                                      |
| [Eq. Constraint Solving Room](#equation-constraint-solving-room)| [Gandalf?](#gandalf)        | [Quadratic Diophantine Room](#quadratic-diophantine-room) | [Poly w/ coeff. over GF(2) Room](#polynomials-w-coefficient-over-gf2-room)|
|---

### Start Room

Where you land when you start the service.

* **LEVEL 1: Add 1 and 1.**

```
> ans 2
CORRECT! Your flag is FAKE{c4f5f0683f231000c99f8c53}
```

* **LEVEL 2: Subtract 5 from 3.**

```
> ans -2
CORRECT! Your flag is FAKE{4ef723be81cef98dc64f61fb}
```

* **LEVEL 3: put the numbers 3, 1, 7 into increasing order.**

```
> ans 1 3 7
CORRECT! Your flag is FAKE{3841ca099e4c5380e5d51161}

COMPLETED all levels in this area.
```

Onwards and upwards.

#### Chinese Remainder Theorem Room
> \> s
> You went south. (Total directions from start: South)
>
> You stop by at a small village to quench your thirst. In its pub you find a
> group of peasants, who are in the middle of a heated argument. As you sip your
> drink, you cannot help listening... is it about.. numbers?? One of them
> points at you and asks, "Traveler, which of us is right? Ol' Jeff says he has
> a clever way to make numbers small but we think that's just bollocks."

Trying a problem reveals a statement that looks like needing to solve a system of congruences ("find x number that equals these numbers when modulo these numbers"), i.e [Chinese Remainder Theorem](https://crypto.stanford.edu/pbc/notes/numbertheory/crt.html).

{% highlight python %}
from functools import reduce
def chinese_remainder(n, a):
    sum=0
    prod=reduce(lambda a, b: a*b, n)
    for n_i, a_i in zip(n,a):
        p=prod/n_i
        sum += a_i* mul_inv(p, n_i)*p
    return sum % prod
def mul_inv(a, b):
    b0= b
    x0, x1= 0,1
    if b== 1: return 1
    while a>1 :
        q = a// b
        a, b= b, a%b
        x0, x1=x1 -q *x0, x0
    if x1<0 : x1+= b0
    return x1

if __name__ == '__main__':
    modulos = xxxxx
    remainders = xxxxxxx
    print(chinese_remainder(modulos, remainders))
{% endhighlight %}


* **LEVEL 1: find a number that gives a remainder of 2 when divided by 5, a remainder of 6 when divided by 7, and a remainder of 9 when divided by 13**.

So from the above code, we will stub in:

{% highlight python %}
    modulos = [5, 7, 13]
    remainders = [2, 6, 9]
    print(chinese_remainder(modulos, remainders))
{% endhighlight %}

Running it, we get `412`.

```
> ans 412
CORRECT! Your flag is mini{G1_92e9a33c80ca7666c7f4b704}

LEVEL 2: find a number that gives a remainder of 616 when divided by 1277,
         a remainder of 1892 when divided by 3911, and a remainder of 3267
         when divided by 6833
```

Alright! On to the next one; same process, just updating our numbers.

{% highlight python %}
    modulos = [1277, 3911, 6833]
    remainders = [616, 1892, 3267]
    print(chinese_remainder(modulos, remainders))
{% endhighlight %}

Running this gives us `6429412122`.

```
> ans 6429412122
CORRECT! Your flag is mini{G2_9aa73c3f86221f07d9b789a9}

LEVEL 3: give the smallest positive x that satisfies x mod a_i = b_i, where

  a1 = 5485948154512337139220437723513046430670172804
  a2 = 2108813835706513804248871264701897235977426762
  a3 = 59351473308659155928757459746804856485
  a4 = 924847477382640006890848669912858050701990
  a5 = 12741718618862212680555500636008445150492416265

  b1 = 2661929484162718513247006741545910067104673680
  b2 = 1051667267149052195100488400753935294543177150
  b3 = 47216332074545827727316304129354717936
  b4 = 532886655965436047074701814450039258213526
  b5 = 11163090230050187304714123613300073905576382766
```

Again, success! This time, however, trying to run the above through the code given above results in a division/modulo by zero error. After a while, I decided to switch to using [gp](https://pari.math.u-bordeaux.fr/), which was successfull. The sequence to do so is:

Run the `chinese()` function against:

{% highlight gp %}
Mod(2661929484162718513247006741545910067104673680, 5485948154512337139220437723513046430670172804)
{% endhighlight %}

And then repeated call it on the remaining constraints using the resulting values:


{% highlight gp %}
Mod(1051667267149052195100488400753935294543177150, 2108813835706513804248871264701897235977426762)
Mod(47216332074545827727316304129354717936, 59351473308659155928757459746804856485)
Mod(532886655965436047074701814450039258213526, 924847477382640006890848669912858050701990)
Mod(11163090230050187304714123613300073905576382766, 12741718618862212680555500636008445150492416265)
{% endhighlight %}

All together in gp, it looks like:

{% highlight gp %}
? chinese(Mod(2661929484162718513247006741545910067104673680, 5485948154512337139220437723513046430670172804), Mod(1051667267149052195100488400753935294543177150, 2108813835706513804248871264701897235977426762))
%1 = Mod(2063276467199966807924536387672428582434275450818672480337912545114034053458188522857239408, 5784421685102116168964483059281925330189270235866414227723519056629962990792700716897090324)
? chinese(%1, Mod(47216332074545827727316304129354717936, 59351473308659155928757459746804856485))
%2 = Mod(286025974454965142935955767629607062745143838760396088110083590093853800957438870078836339475240313270180596027885269543778207056, 343313949249367464904779010036116931714194212003591373156301007857783423049876240155692371527168586027140429079614869928902151140)
? chinese(%2, Mod(532886655965436047074701814450039258213526, 924847477382640006890848669912858050701990))
%3 = Mod(300174367275985979143949056566504793932944217822943583016784119694613397923989503076764116438545909628042829934230028873580684900546156524463687863733081399996, 675887341236213301517646447127933573051949675177958626850795571775356109416000877162822512141757417053158249854849779160336113141960641299043794460173663689740)
? chinese(%3, Mod(11163090230050187304714123613300073905576382766, 12741718618862212680555500636008445150492416265))
%4 = Mod(1202114787574073135698562247558599073285047132156573830145908717087719050384755928081340071169158043961005726049447510357364537073462416777364540618918830057496883942982657669805211370184463326656, 1722393264016547359201489844518299066326263091959096213880905019697844158681088819449529306611103944576798993128862113366060834717263941463862111948718437810480257863399490843913181126011162897293577924220)
{% endhighlight %}

So our answer is `1202114787574073135698562247558599073285047132156573830145908717087719050384755928081340071169158043961005726049447510357364537073462416777364540618918830057496883942982657669805211370184463326656`.

```
> ans 1202114787574073135698562247558599073285047132156573830145908717087719050384755928081340071169158043961005726049447510357364537073462416777364540618918830057496883942982657669805211370184463326656
CORRECT! Your flag is mini{G3_a08d51fdb86b4ac7309e3f51}

COMPLETED all levels in this area.
```

Woo!

#### Bezout Room

> \> w
> You went west. (Total directions from start: West)
>
> Passing by a small town, you meet a scholar, and you two walk together for a
> while. He rambles about a manuscript that, he says, claims the preposterous
> idea that one equation could nail down two variables simultaneously. Since
> you show enough interest, he lets you copy a few puzzles from the book.
>
> LEVEL 1: find integers x and y that satisfy 123*x + 179*y = 1

We can do this in `gp` again:

{% highlight gp %}
? bezout(123, 179)
%1 = [-16, 11, 1]
{% endhighlight %}

which gives us:

```
> ans -16 11
CORRECT! Your flag is mini{B1_485a3ae14ebb98e8ccc855b3}

LEVEL 2: find integers x and y that satisfy 5419637592*x + 8765372543*y = 1
```

OK, again:

{% highlight gp %}
? bezout(5419637592, 8765372543)
%2 = [784426129, -485011369, 1]
{% endhighlight %}

which gives us:

```
> ans 784426129 -485011369
CORRECT! Your flag is mini{B2_4a39f17045a8063e6eb0afa2}

LEVEL 3: give the integers x and y that satisfy a*x + b*y = c with smallest
         possible |x| + |y|:

  a = 172329615174258484389026493995284470243013873606078558711314460397670851456942410234121713652719725046736930219457185697597838781645377593188376635674458514137402988415274695055808334695839436438924034168872425182706138637584824074845746669005801723938330993778108851070552409088962751784310957757082836431093300116826362
  b = 28356761906716612873881138710402902897347022365354411652739208693325513167251446458912103549741332079105794174802290037963900303459422464736407225394752372764336652283336292253338385760630286153548854753862316744878470244746596115894407579090226051336510357308468389580782413423780615862345700844128007232811673170490170
  c = 13657769199596610482
```

Alright, last one, and it's a doozy. Luckily, we still have our trusty `gp` ;)

{% highlight gp %}
? bezout(172329615174258484389026493995284470243013873606078558711314460397670851456942410234121713652719725046736930219457185697597838781645377593188376635674458514137402988415274695055808334695839436438924034168872425182706138637584824074845746669005801723938330993778108851070552409088962751784310957757082836431093300116826362, 28356761906716612873881138710402902897347022365354411652739208693325513167251446458912103549741332079105794174802290037963900303459422464736407225394752372764336652283336292253338385760630286153548854753862316744878470244746596115894407579090226051336510357308468389580782413423780615862345700844128007232811673170490170)
%3 = [-716740480992306813107503753418846234036640156759836661475354416766574545237010296962263824224509107612115141091065808866650335667339422168844609337650456083904714828583142795906730708621014510898197333708554115609551003952289103814240209709219851287729419355090392174924377596434397802758684489757519, 4355772766846172289550960484253309708628309981859354451608388213582133495086922647575976048691479746491014530235602502674014803098803037825125357480987981590580196394415483266364546368978087653972266116991312510608494888084750532763692967382260459363590590286778039861513365053641201896497684198556508, 13657769199596610482]
{% endhighlight %}

which gives us the last flag for this section!

```
> ans -716740480992306813107503753418846234036640156759836661475354416766574545237010296962263824224509107612115141091065808866650335667339422168844609337650456083904714828583142795906730708621014510898197333708554115609551003952289103814240209709219851287729419355090392174924377596434397802758684489757519 4355772766846172289550960484253309708628309981859354451608388213582133495086922647575976048691479746491014530235602502674014803098803037825125357480987981590580196394415483266364546368978087653972266116991312510608494888084750532763692967382260459363590590286778039861513365053641201896497684198556508
CORRECT! Your flag is mini{B3_c2ab64728ae65e273b7987ee}

COMPLETED all levels in this area.
```

Score!

#### Factor Room

> \> w
> You went west. (Total directions from start: West, West)

> As you journey on, the weather suddenly turns and you realize that a storm is
> imminent. Luckily you spot a big oak tree and manage to find shelter under its
> canopy just in time. While the hail falls, you have time to contemplate the
> lectures by your old mentors. Perhaps the answers won't elude you this time?
>
> LEVEL 1: factor the number 48263. (E.g., for 12, you would answer 2 2 3).

OK, so looks like this room is going to be tasking our ability to factor numbers.

There's _alot_ of ways to factor numbers out there, and some are **way** faster than others, so be sure to be careful on which you choose. For this, I usually use [FactorDB](http://factordb.com/) to check for simple values:

{% highlight python %}
# pip3.8 install factordb-pycli
from factordb.factordb import FactorDB

def check_factordb(N):
    factorized = FactorDB(N)
    factorized.connect()
    factor_list = factorized.get_factor_list()
    assert(len(factor_list) != 0 )
    return factor_list

check_factordb(xxxx)
{% endhighlight %}

However, for ones that aren't fully factored in there, we still need an alternative. Wouldn't ya know it, we can factor in Pari/GP too! (If you haven't caught on by now, it's pretty awesome.)

So for our first level (which is in FactorDB, but I'll demonstrate with gp anyways):

{% highlight gp %}
? factor(48263)
%1 =
[ 17 2]

[167 1]
{% endhighlight %}

So:

```
> ans 17 17 167
CORRECT! Your flag is mini{I1_1a8ec6471c8824fff864a95c}

LEVEL 2: factor the number 8477969543906630921459041527576694. (E.g., for 12, you would answer 2 2 3)
```

Which we'll just ride the `factor()` train out this whole room:

{% highlight gp %}
? factor(8477969543906630921459041527576694)
%2 =
[               2 1]
[               7 2]
[              13 1]
[              19 2]
[              79 1]
[             601 1]
[       234490397 1]
[1655726489421517 1]
{% endhighlight %}

so:

```
> ans 2 7 7 13 19 19 79 601 234490397 1655726489421517
CORRECT! Your flag is mini{I2_03ba7452553b74b5122c58f0}

LEVEL 3: factor the number 71142975216676910225445498956472658317166395374468624230332488059276850400024521063814543607909086075571109949
```

Bang! Now to really test `gp`:

{% highlight python %}

{% endhighlight %}

Which ran in **5 minutes, 22 seconds on my shit ass 2014 Macbook Air laptop**. Seriously guys, use Pari/gp!!!! I'm in huge debt to my teamate [datajerk](https://github.com/datajerk) for introducing me to it (+1 to your beers owed counter).

{% highlight gp %}
? factor(71142975216676910225445498956472658317166395374468624230332488059276850400024521063814543607909086075571109949)
%3 =
[                                                3 1]
[                                               11 1]
[                                               31 1]
[                                         29515817 1]
[                        1075612307646757041328543 1]
[                     1810939816479001125535889581 1]
[1209600061687323613153983466766686569317548327433 1]
{% endhighlight %}

So we can submit and get our last flag!:

```
> ans 3 11 31 29515817 1075612307646757041328543 1810939816479001125535889581 1209600061687323613153983466766686569317548327433
CORRECT! Your flag is mini{I3_8bfabf5fabe9ddeec6ebce31}

COMPLETED all levels in this area.
```

#### Counting Primes Room

> \> s
> You went south. (Total directions from start: either West, South or South, West)
>
> As you trek through dense forest, you notice a giant snake curled up in the
> center of a clearing ahead. You freeze, and try to tip-toe back, but it's too
> late. "Count your blessssingsss, human, for I'm not hungry... thisss time.
> Sssspeaking of counting... I can tell you sssecrets if you demonssstrate you
> are capable.
>
> LEVEL 1: how many primes are there between 1200 and 1500?

So for this, we need to be able to count primes between two numbers. This entails _actually knowing what numbers are prime_ and which aren't; Knowing so is much more difficult as number value increases, especially so if you are doing a naive division check for primality.

Pari/GP offers a few prime related functions; notable for this room are `isprime()` and `nextprime()`.

For the first level, we can just naively iterate over each number in the range and check if it is prime:

{% highlight gp %}
start=1200
stop=1500
count=0
for(n=start,stop,n+=1; if (isprime(n), count+=1))
print(count)
{% endhighlight %}

Which when stored in a file (`count.gp`) and then ran via `gp count.gp`, we get `43`:

```
> ans 43
CORRECT! Your flag is mini{F1_c45a3e68b37e85ee427389c5}

LEVEL 2: how many primes are there between 123456780 and 234567890?
```

Sweet! Going again with the same exact file, but changing our start and stop values, we get `5852187` (ran in about 25 seconds on my laptop!)


```
> ans 5852187
CORRECT! Your flag is mini{F2_71724abed3c0a25e2f95393c}

LEVEL 3: what is the 16th prime number after 10^400?
```

Awesome! Now for this last one, we can make use of the `nextprime()` function, which does the following:

> Finds the smallest pseudoprime (see ispseudoprime) greater than or equal to x. x can be of any real type. Note that if x is a pseudoprime, this function returns x and not the smallest pseudoprime strictly larger than x. To rigorously prove that the result is prime, use isprime.

So, we can start at 10^400, and from there just continue on 15 more times (for a total of 16).

{% highlight gp %}
x=nextprime(10^400); for(n=2,16,n+=0;x=nextprime(x+1);print(n,": ",x))
{% endhighlight %}

Which runs in about 2 seconds on my machine. The value it spits out for the 16th prime is:

{% highlight gp %}
...
16: 10000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000018661
{% endhighlight %}

so plugging that in, we get the last flag of this level!

```
> ans 10000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000018661
CORRECT! Your flag is mini{F3_956ba40d2133c75a49c8e713}

COMPLETED all levels in this area.
```

Nice!

#### XOR Room
> \> s
> You went south. (Total directions from start: South, South)
>
> You are at a signpost, trying to figure out which path will get you through
> the forest. While you are contemplating, another traveller arrives. The fellow
> seems to know his way, so you decide to ask him. He gestures about (as if
> asking a question?) but you hear nothing. It is then that you realize that he
> cannot speak. You seem crestfallen but the traveller's face brightens - he
> takes out parchment and ink from his bag and begins to write... something
> that looks gibberish to you. Still, you do notice some familiarity in those
> symbols...
>
> LEVEL 1: the base64-encoded string below corresponds to XOR-encrypted
>          text, with key length of 1 byte. What is the integer in the
>          message?
>
> PQEMSRoMChsMHUkABx0MDgwbSQAaSR0eDAcdEEQPAB8MSR0BBhwaCAcNRUkPAB8MSQEcBw0bDA1JCAcNSR0eDAUfDEc=

OK, so a basic base64 encoded string that was XOR'ed against a key that is a single byte. I'll use xortool to solve this, specifying the key length as 1, and since we're assumed to be working with English, I'll guess that the most frequent char is the letter `e`:

{% highlight bash %}
xortool -l 1 -c '\x65' output
1 possible key(s) of length 1:
'i
Found 1 plaintexts with 95%+ valid characters
See files filename-key.csv, filename-char_used-perc_valid.csv
{% endhighlight %}

OK, that sounds promising! Let's look:

```
cat xortool_out/0.out
The secret integer is twenty-five thousand, five hundred and twelve.
```

Sweet! We got our flag:

```
> ans 25512
CORRECT! Your flag is mini{H1_5ed3aca835bc208203da988b}

LEVEL 2: the base64-encoded string below corresponds to XOR-encrypted
         text, with key length of 4 bytes. What is the integer in the
         message?

BfEIGiL6CAE+900cavdJAC6zCBkvv0wLJPBdACn6CBkj60BOOPZPBj76Rxs5v0EALvZPACvrQQEk
v0kALr9MBznzQQUvv0ULJL9fBiW/SRwvv1sBav1NCT/2RAsuv0kALr9MCyfwWg8m9lILLr9KF2rr
QAtq/EAPOPJbTiX5CB4m+kkdP+1NTiX5CBoi+ggDJfJNAD6zCB0lv0oCI/FMCy6/Shdq+00dI+1N
QmrrQA8+v1wGL+YIDSvxRgE+v04BOPpbCy+/XAYvv1gPI/EIDyT7CBo48F0MJvoIGiL+XE4r7U1O
KPBdAC6/XAFq+kYdP/oTTivxTE4v7ghOHvdNTiPxXAst+lpOM/BdTj3+Rhpq9ltOe6wIGiW/XAYv
vxlfPvcIHiXoTRxk
```

OK, so now we get an extra fold this time: the key length is now _4 bytes_ instead of just 1.

For this one, I just went with the brute force (`-b`) option of xortool, and then inspected the 100% validity results:

{% highlight bash %}
echo -n 'BfEIGiL6CAE+900cavdJAC6zCBkvv0wLJPBdACn6CBkj60BOOPZPBj76Rxs5v0EALvZPACvrQQEk
v0kALr9MBznzQQUvv0ULJL9fBiW/SRwvv1sBav1NCT/2RAsuv0kALr9MCyfwWg8m9lILLr9KF2rr
QAtq/EAPOPJbTiX5CB4m+kkdP+1NTiX5CBoi+ggDJfJNAD6zCB0lv0oCI/FMCy6/Shdq+00dI+1N
QmrrQA8+v1wGL+YIDSvxRgE+v04BOPpbCy+/XAYvv1gPI/EIDyT7CBo48F0MJvoIGiL+XE4r7U1O
KPBdAC6/XAFq+kYdP/oTTivxTE4v7ghOHvdNTiPxXAst+lpOM/BdTj3+Rhpq9ltOe6wIGiW/XAYv
vxlfPvcIHiXoTRxk' | base64 -d > out

xortool -b out

for hundopercent in $(cat xortool_out/filename-char_used-perc_valid.csv | grep ';100' | awk '{print $1}' | cut -d';' -f 1); do cat $hundopercent; done
{% endhighlight %}

Which yields:

```
On the other hand, we denounce with righteous indignation and dislike men who are so beguiled and demoralized by the charms of pleasure of the moment, so blinded by desire, that they cannot foresee the pain and trouble that are bound to ensue; and eq  The integer you want is 13 to the 11th power.
                                                                                                                       n t,e o0herdhan , w! de*oun'e w-th 6igh0eou7 in ign%tio* an  di7lik! me* wh+ ar! sodbeg1ile  an  de)ora(ize  bydthedcha6ms +f p(eas1re +f t,e m+men0, s+ bl-nde  byddes-re,dtha0 th!y c%nno0 fo6ese! th! pa-n a*d t6oub(e t,at %re &oun  todens1e; %nd !q  he -nte#er =ou 3antdis u3 t+ th! 110h p+werj
...
...
```

Which, luckily, the answer was on the first file!

> "The integer you want is 13 to the 11th power."

Send that over to get the Level 2 flag:

```
> ans 1792160394037
CORRECT! Your flag is mini{H2_87a986c2cb527d326d204f52}

LEVEL 3: the base64-encoded file served at http://[THIS_HOST]/chal10
         corresponds to XOR-encrypted text, with unknown key length.
         What is the *key*, represented as a little-endian integer?
```

Navigating to [the specified URL at /chal10](http://chal.ctf.b01lers.com:1337/chal10), we see the following base64 text body:

{% highlight bash %}
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
j4QsY8n0g7iwK8r4qP0CYHgk
{% endhighlight %}

Per the challenge description, the key length is unknown, and our task is finding the key that was used, and submitting it as a little-endian integer once found.

I tried various combinations of length and most expected character with `xortool`, but nothing seemed to yield any results. After some searching, I came across this pretty sweet tool, [Ciphey](https://github.com/Ciphey/Ciphey). I saved the above base64 info to a file, and ran accordingly:

{% highlight bash %}
ciphey -f chal10
Result "When in the Course of human events, it becomes necessary for one people to dissolve the political \nbands which have connected them with another, and to assume, among the Powers of the earth, the \nseparate and equal station to which the Laws of Nature and of Nature's God entitle them, a decent \nrespect to the opinions of mankind requires that they should declare the causes which impel them to \nthe separation.\n\nWe hold these truths to be self-evident, that all men are created equal, that they are endowed by \ntheir Creator with certain unalienable Rights, that among these are Life, Liberty, and the pursuit of \nHappiness. That to secure these rights, Governments are instituted among Men, deriving their just \npowers from the consent of the governed, That whenever any Form of Government becomes destructive of \nthese ends, it is the Right of the People to alter or to abolish it, and to institute new Government, \nlaying its foundation on such principles and organizing its powers in such form, as to them shall seem \nmost likely to effect their Safety and Happiness. Prudence, indeed, will dictate that Governments long \nestablished should not be changed for light and transient causes; and accordingly all experience hath \nshown, that mankind are more disposed to suffer, while evils are sufferable, than to right themselves \nby abolishing the forms to which they are accustomed. But when a long train of abuses and usurpations, \npursuing invariably the same Object evinces a design to reduce " (y/N): y
Format used:
  base64
  xorcrypt:
    Key: 0xed98c444ea8acd9977031d048822059610297ff9e883c83d99afe04910a093
  utf8
Final result: "When in the Course of human events, it becomes necessary for one people to dissolve the political
bands which have connected them with another, and to assume, among the Powers of the earth, the
separate and equal station to which the Laws of Nature and of Nature's God entitle them, a decent
respect to the opinions of mankind requires that they should declare the causes which impel them to
the separation.

We hold these truths to be self-evident, that all men are created equal, that they are endowed by
their Creator with certain unalienable Rights, that among these are Life, Liberty, and the pursuit of
Happiness. That to secure these rights, Governments are instituted among Men, deriving their just
powers from the consent of the governed, That whenever any Form of Government becomes destructive of
these ends, it is the Right of the People to alter or to abolish it, and to institute new Government,
laying its foundation on such principles and organizing its powers in such form, as to them shall seem
most likely to effect their Safety and Happiness. Prudence, indeed, will dictate that Governments long
established should not be changed for light and transient causes; and accordingly all experience hath
shown, that mankind are more disposed to suffer, while evils are sufferable, than to right themselves
by abolishing the forms to which they are accustomed. But when a long train of abuses and usurpations,
pursuing invariably the same Object evinces a design to reduce "
{% endhighlight %}

Sweet! So our key ended up being:

> Key: 0xed98c444ea8acd9977031d048822059610297ff9e883c83d99afe04910a093

Converting that to an LE integer, we can submit accordingly:

```
> ans 419797111204456911416422273621730563266064217188764214578604591487313289363
CORRECT! Your flag is mini{H3_c7d03348ca3a013c8aeadba1}

COMPLETED all levels in this area.
```

Woo!

#### Polynomials w/ coefficient over GF(2) Room
> \> s
> You went south.
>
> A huge basin opens up to your view, wide swathes of farmland surrounded by a
> ring of mountains in the distance. In the cool breeze your thoughts roam free
> and wild... what if those mountains are really teeth, devouring a giant wafer
> (the fields), and you are just an ant experiencing it all up close? You savor
> each possibility conjured up by your mind - one can never know when some of
> it comes handy.
>
> LEVEL 1: consider polynomials in x with coefficients that are either 0 or 1.
>          Suppose we multiply two such polynomials the usual way, except that
>          in the result we substitute 0 for even coefficients, 1 for odd ones
>          (this just means that coefficients live in the Galois field GF(2)).
>          For example, (1+x)*(1+x) = 1+2*x+x^2 = 1+x^2.
>             We can also map such polynomials to integers by simply taking the
>          coefficients as a bit string. E.g., 1+x+x^4 = 1+x+0*x^2+0*x^3+x^4
>          = 11001 in binary, which is 19 in decimal. Give the integer that is
>          the result of the multiplication 35*23 in this setup.

Doing some google searching, I found [this academic page](https://www.doc.ic.ac.uk/~mrh/330tutor/ch04s04.html) on Galois Fields in (2^m).

On that page, it mentions:

> Multiplication of binary polynomials can be implemented as simple bit-shift and XOR …

As well as shows a nice example.

Doing the same with 35 and 23, we get:

```
      100011 (35)
       10111 (23)
------------
      100011
     1000110
    10001100
   000000000
  1000110000
------------
  1011011001
```

Which as a decimal, is `729`.

```
> ans 729
CORRECT! Your flag is mini{E1_7bd94c75dbae3741d18a91ec}

LEVEL 2: consider the construction introduced in Level 1. Compute the
         remainder when 250062733632176 is divided by 406399853.
         I.e., convert the integers to polynomials, do the division,
         and convert the result back to an integer.
         (You can RESET the problem if you forgot what was in Level 1)
```

Nice! On that page, there's actually even a link to a [Galois Field GF(2) Calculator](http://www.ee.unb.ca/cgi-bin/tervo/calc.pl). We'll use this for the second level:

![]({{ site.baseurl }}/img/b01lers_bootcamp2020/GF2_calc.png){:height="70%" width="70%"}

Which we can convert to a decimal and then submit:

{% highlight python %}
>>> 0b101010111100110000011111101
90071293
{% endhighlight %}

then:

```
> ans 90071293
CORRECT! Your flag is mini{E2_053d8dee20f001153f05afcc}

LEVEL 3: consider the construction introduced in Level 1 that mapped
         polynomials to integers. Find the solution to the equation
         a*y^2 + b*y + c = 0 in that setup, where

  a = 62988136202118127274037485756847228824659813916854388288704528975265641038375
  b = 61970982425686765788241036465223359125124685363948286523458864616239704859380
  c = 16032512672834824306563461964216557396271213056568232093692714812022221106419800157218922185040829131491280726002257183375575408421728567246659014589764356633340492085105583082470307172750166547566757359700457224812429817166783751
```

Damn! That's a big number. I didn't have time to look back it this one, so no solve :\


#### Quadratic Diophantine Room
> \> w
> You went west. (Total directions from start: South, South, South, West)
>
> You make camp by a delapidated building that must have been a shrine in its
> better days. As the rays of the setting sun illuminate the walls, you notice a
> crevice with a piece of parchment tucked inside... a treasure map! Though you
> cannot quite make out which direction is east or west, and north or south, on
> the map, this *could* be payday - provided you figure out the right number of
> steps to take.
>
> LEVEL 1: find positive integers x, y that solve x^2 + 22*y^2 = 8383

Solving an equation for X and Y given constraints, enter, [Z3 theorem solver](https://theory.stanford.edu/~nikolaj/programmingz3.html)!

Seriously. Using Z3 for this Room made the entire thing trivial. Just define our two X and Y variables, and then stub in the value for each level and we get all three flags for free:

{% highlight python %}
>>> from z3 import *
>>>
>>> x = Int('x')
>>> y = Int('y')
>>> s = Solver()
>>>
>>> s.add(x**2  + 22*(y**2) == 8383)
>>> s.add(x>0, y>0)
>>> s.check()
sat
>>> s.model()
[x = 21, y = 19]
{% endhighlight %}

Submitting:

```
> ans 21 19
CORRECT! Your flag is mini{J1_c9d7861b2635ebb151b71351}

LEVEL 2: find positive integers x, y that solve x^2 + 608268054*y^2 = 288964812689493391976023993
```

Now back to Z3:

{% highlight python %}
>>> s = Solver()
>>> s.add(x**2  + 608268054*(y**2) == 288964812689493391976023993)
>>> s.add(x>0, y>0)
>>> s.check()
sat
>>> s.model()
[x = 729485423, y = 689247146]
{% endhighlight %}

Submitting:

```
> ans 729485423 689247146
CORRECT! Your flag is mini{J2_ab5c40aa74a7c6ad5db7b041}

LEVEL 3: find positive integers x, y that solve x^2 + a*y^2 = b, where

  a = 809575361919189873249985593557526797315607233589
  b = 453911665595804740746927043910783828583622477123414312540919542168796850447209357992143785144169862380534061054229556425568794584043785497763918
```

One last time with Z3:

{% highlight python %}
>>> s = Solver()
>>> s.add(x**2  + 809575361919189873249985593557526797315607233589*(y**2) == 453911665595804740746927043910783828583622477123414312540919542168796850447209357992143785144169862380534061054229556425568794584043785497763918)
>>> s.add(x>0, y>0)
>>> s.check()
sat
>>> s.model()
[x = 822249775978922834074863312050877571308123090437,
 y = 748784818951812933713395251176142145550673582079]
>>> exit()
{% endhighlight %}

And submitting:

```
> ans 822249775978922834074863312050877571308123090437 748784818951812933713395251176142145550673582079
CORRECT! Your flag is mini{J3_fd5551354c1fdbf2dea9c44d}

COMPLETED all levels in this area.
```

Z3 FTW.

#### Gandalf?
> \> w
> You went east.
>
> To the north is a narrow bridge that leads to the tower of the Greatest Crypto  
> Wizard of the land. Or, what remained of the bridge... Crossing the chasm  
> below is surely impossible. A sign by the bridge says "You shall *not* pass."  

Trying to move "north" isn't allowed. Not sure what this room was about, didn't have time to explore it more, if it was actually something.

#### Equation Constraint Solving Room
> \> w
> You went west.
>
> You see an inn and decide that you deserve to splurge some on a good meal and  
> a comfy bed. The room is tidy and clean but you do notice certain little  
> visitors... mice. Fear not, the innkeeper's cat comes eagerly to your rescue.  
> But whenever it tries to catch one, the mouse quickly disappears in one of  
> many mouseholes in the room. With this game going on and on for minutes, you  
> swear those mice must be playing with the cat. Interesting, you think, there  
> must be a smarter way to capture small creatures...
>
> LEVEL 1: find *small* nonzero integers x, y, z that satisfy 299*x + 355*y + 251*z = 0  
>          (e.g., x = 355*251, y = 299*251, z = -2*299*355 does not count)

Enter: Z3, again! We can plug these values into a Z3 solver with our contraints:

* Must be non-zero
* "small" (NGL -- This was kind of a dick move, could have just specified with more precision this constraint, and not just "small")

With some guessing on how _small_ the values had to be, we get the following Z3 goodness:

{% highlight python %}
#!/usr/bin/env python3
from z3 import *
x = Int('x')
y = Int('y')
z = Int('z')
s = Solver()

s.add( (299*x) + (355*y) + (251*z) == 0 )
s.add(x!=0, y!=0, z!=0)
s.add(x<20, y<20, z<20)

print(s.check())
print(s.model())
{% endhighlight %}

Which when ran, gives us:

```
python solver.py
sat
[z = -7, y = -6, x = 13]
```

After submitting:

```
> ans 13 -6 -7
CORRECT! Your flag is mini{A1_27f3abda81e75486b9299fda}
LEVEL 2: find small nonzero integers x, y, z that satisfy a*x + b*y + c*z = 0,
         where a=69925405969, b=48507179354, c=32417688895
```

OK. After editing our Z3 code from above with the new a, b, and c values, and no size constraint, we get:

```
python solver.py
sat
[z = -69925405969, y = -69925405969, x = 80924868249]
```

Unfortunately, that's likely not "small", so we need to go back and now try to restrict our x/y/z size until we find something that the problem likes.

I tried first constraining x/y/z to be all less than `1000`, but after running for about 70 minutes, Z3 came back with `unsat` (i.e not possible).

So, I then bumped the constraints up to be `1000000`, and Z3 came back with an answer in a few seconds:

{% highlight python %}
python solver.py
sat
[z = -28381, y = -951115, x = 672945]
{% endhighlight %}

Which submitting, works:

```
> ans 672945 -951115 -28381
CORRECT! Your flag is mini{A2_6bb458859e4518dc1e131618}

LEVEL 3: find nonzero integers v, w, x, y, z with a minimal sum of squares
         that satisfy a*v + b*w + c*x + d*y + e*z = 0, where

  a= 13224482656452729965010130774472519546513322282685222044383028560173414320699907502364037066998078684364749338920872578811245752029508639952579415409556998
  b= 11883954373554361547375474750630839024678353968736077156027924497730635501467831406890604708209797932039373450099216323200104673509462816247739552390501700
  c= 12033890847356726156410304461564041151269011907532227202193795241332802954932830212451456439198182308280974025227196605722871001660179705508977260220793964
  d= 2844873315637923430702813720068362602065731767047450571384220379074997608589211929239202046737041926913187483721774104817975966051912270671035046621837635
  e= 2606527713655043968153387630347865477764170887107821220448557599575906298221841101758877277715742039004267346644911989983884822836245158485633146455362314
```

OK - last level, same concept, except now more constraints, and much larger values. I was not able to solve this one in time, was working on other rooms.


#### kth Root Modulo N Room
> \> n
> You went north. (Total directions from start: South, South, South, West, West, West, North)
>
> Higher up on the hillside you come across a small house with a tidy garden.
> An elderly rabbit lady in a rocking chair is observing you, while she nibbles
> on some sort of brown root (carrot maybe?). "Have some, my dear" she says,
> "great for vision." You oblige, and indeed, as if finer distinctions started
> to materialize in things. "Now we just need to calibrate the dose," says the
> rabbit and gives you something colorful to peer into.
>
> LEVEL 1: find an integer that satisfies x^2 mod 97 = 88

OK, so we need to find the square root over modulo 97 that equals to 88.

Doing a simple Google search yields us [this page](https://eli.thegreenplace.net/2009/03/07/computing-modular-square-roots-in-python):

{% highlight python %}
def modular_sqrt(a, p):
    """ Find a quadratic residue (mod p) of 'a'. p
        must be an odd prime.

        Solve the congruence of the form:
            x^2 = a (mod p)
        And returns x. Note that p - x is also a root.

        0 is returned is no square root exists for
        these a and p.

        The Tonelli-Shanks algorithm is used (except
        for some simple cases in which the solution
        is known from an identity). This algorithm
        runs in polynomial time (unless the
        generalized Riemann hypothesis is false).
    """
    # Simple cases
    #
    if legendre_symbol(a, p) != 1:
        return 0
    elif a == 0:
        return 0
    elif p == 2:
        return 0
    elif p % 4 == 3:
        return pow(a, (p + 1) / 4, p)

    # Partition p-1 to s * 2^e for an odd s (i.e.
    # reduce all the powers of 2 from p-1)
    #
    s = p - 1
    e = 0
    while s % 2 == 0:
        s /= 2
        e += 1

    # Find some 'n' with a legendre symbol n|p = -1.
    # Shouldn't take long.
    #
    n = 2
    while legendre_symbol(n, p) != -1:
        n += 1

    # Here be dragons!
    # Read the paper "Square roots from 1; 24, 51,
    # 10 to Dan Shanks" by Ezra Brown for more
    # information
    #

    # x is a guess of the square root that gets better
    # with each iteration.
    # b is the "fudge factor" - by how much we're off
    # with the guess. The invariant x^2 = ab (mod p)
    # is maintained throughout the loop.
    # g is used for successive powers of n to update
    # both a and b
    # r is the exponent - decreases with each update
    #
    x = pow(a, (s + 1) / 2, p)
    b = pow(a, s, p)
    g = pow(n, s, p)
    r = e

    while True:
        t = b
        m = 0
        for m in xrange(r):
            if t == 1:
                break
            t = pow(t, 2, p)

        if m == 0:
            return x

        gs = pow(g, 2 ** (r - m - 1), p)
        g = (gs * gs) % p
        x = (x * gs) % p
        b = (b * g) % p
        r = m


def legendre_symbol(a, p):
    """ Compute the Legendre symbol a|p using
        Euler's criterion. p is a prime, a is
        relatively prime to p (if p divides
        a, then a|p = 0)

        Returns 1 if a has a square root modulo
        p, -1 otherwise.
    """
    ls = pow(a, (p - 1) / 2, p)
    return -1 if ls == p - 1 else ls
{% endhighlight %}

Which we can use like so:

{% highlight python %}
print(modular_sqrt(88, 97))
{% endhighlight %}

Which gives us `66`.

```
> ans 66
CORRECT! Your flag is mini{C1_4c88b7b4c11a9ee43f33e130}

LEVEL 2: find an integer that satisfies x^2 mod 1359203501 = 95422207
```

OK, repeating the above but with our new numbers gives us `810550192`.

```
> ans 810550192
CORRECT! Your flag is mini{C2_2ce7b90aa9335b0cb0a3db6d}

LEVEL 3: give the smallest positive x for which x^12 mod p = a, where

         a = 1817525449797280602402956873386237720889680621662448878394577537780771524786955876245638699592180826704996032326091618875207339103593277472500067216389870
         p = 12779849905941677959186610420316494198424452561778642658582451521063175469853171114961122342052464710078864014592127176275630898014968982060325361045608439
```

Damn, no more square root. Now we have to work with the 12th root (x^12). So our python code from above won't work.

#### Exponential Congruence Room

> \> n
> You went north.
>
> As dusk falls you make camp at a logging area. There are tree stumps
> everywhere, some truly gigantic ones too. You are just about to fall asleep
> when you hear footsteps - one of the fellers came back for his axe. He moves
> sluggishly as if his limbs were made of lead, totally obliviously to your
> presence. As he leaves you catch him grumbling about how hard this line of
> work is. Your eyes close and you dream, of something quite peculiar...
>
> LEVEL 1: find an integer that satisfies 11^x mod 101 = 27
>          (here ^ means exponentiation, e.g., 2^7 mod 5 = 3)

Simple brute force will work for the first one:

```
> ans 39
CORRECT! Your flag is mini{D1_77858210bb3c8f6f90642947}
```

And I ran out of time to come back to the second one.

#### Solve Equations x/y Room
> \> w
> You went west.
>
> The road curves and gives way to marshland. You tread by one careful  
> step after another, focused so much on your footings that you only notice the  
> lizardman when he starts talking to you. "Hello, I am in the Enformation  
> Commerce. We two must have things to trade." He needs help with math to break  
> some encrypted messages.
>
> LEVEL 1: solve the equations below for x and y
>
>          (76*x + 221*y) mod 281 = 85  
>          (171*x + 190*y) mod 281 = 138

I did not have any time at all to look at this room, but it looks like it's solving a system of congruences, but with a fold where the value is now consistent of `x` and `y` that need to be solved for, in combination with the congruences.
