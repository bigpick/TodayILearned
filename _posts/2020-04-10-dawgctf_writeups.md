---
author: george_pick
layout: post
title: "University of Maryland, Baltimore County: UMBC DawgCTF 2020"
excerpt: "Writeups for various challenges I solved during the 2020 UMBC DawgCTF capture the flag competition."
categories: [Capture The Flag]
---

> The UMBC Cyber Dawgs are hosting our second annual CTF on Friday, April 10th.
>
> This will be online and end on the 12th.
>
> DawgCTF will be a Jeopardy style CTF open to all. It will be held online.
>
> This will be a team competition. You can play by yourself ifyou want.
>
> Our goal is to have this CTF be fun and accessible for CTF beginners and veterans alike. If you’re a beginner, you’ll want to have some computer security knowledge. CTF veterans will have lots of fun with our harder challenges.
>
> We will have challenges in the following areas: Crypto, RE, Pwn, Web, Misc, and whatever else we feel like creating!

| Crypto                                   | Coding                  | Reversing      | Forensics | Misc |
|------------------------------------------|-------------------------|----------------|-----------|------|
| [Take It Back Now, Y'all](#take-it-back-now-yall)              | [Miracle Mile](#miracle-mile)        | [Ask Nicely](#ask-nicely) | [My First Pcap](#my-first-pcap) | [Me Me](#me-me) |
| [One Hop This Time, One Hop This Time](#one-hop-this-time-one-hop-this-time) | [Arthur Ashe](#arthur-ashe)         |                | [UMBC Cyber Defense - can it be breached?](#umbc-cyber-defense---can-it-be-breached) | [Qwerky Qwerty](#qwerky-qwerty) |
| [Right Foot Two Stomps](#right-foot-two-stomps)                | [Spot the difference](#man-these-spot-the-difference-games-are-getting-hard) |                | [Impossible Pen Test Part 1](#impossible-pen-test-part-1) | [Let Her Eat Cake!](#let-her-eat-cake) |
| [Left Foot Two Stomps](#left-foot-two-stomps)                 |                         |                | [Impossible Pen Test Part 2](#impossible-pen-test-part-2) | |
|                                          |                         |                | [Impossible Pen Test Part 3](#impossible-pen-test-part-3) | |
|                                          |                         |                | [Impossible Pen Test Part 4](#impossible-pen-test-part-4) | |
|                                          |                         |                | [Impossible Pen Test Part 5](#impossible-pen-test-part-5)  | |
|---
| | | | | |


# Crypto
## Take It Back Now, Y'all
> Sanity check.
>
> nc crypto.ctf.umbccd.io 13370
>
> (no brute force is required for this challenge)
>
> Author: pleoxconfusa

Examining the given python code:

{% highlight python %}
# -*- coding: utf-8 -*-
"""
Created for Spring 2020 CTF
Cryptography 0
10 Points
Welcome to my sanity check.  You'll find this to be fairly easy.
The oracle is found at umbccd.io:13370, and your methods are:
    flg - returns the flag
    tst - returns the message after the : in "tst:..."

@author: pleoxconfusa
"""

import socket

sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)

server_address = ('crypto.ctf.umbccd.io', 13370)
sock.connect(server_address)

#available methods: flg, tst.


msg = 'tst:hello'


sock.sendall(msg.encode())
data = sock.recv(1024)
print(data.decode())

sock.close()
{% endhighlight %}
We see there's two methods, `flg` and `tst`. If we connect and pass `flg`:

{% highlight bash %}
nc crypto.ctf.umbccd.io 13370
flg
DawgCTF{H3ll0_W0rld!}
{% endhighlight %}

Flag is `DawgCTF{H3ll0_W0rld!}`.

## One Hop This Time, One Hop This Time
> One time pad is perfectly secure.
>
> nc crypto.ctf.umbccd.io 13371
>
> (no brute force is required for this challenge)
>
> Author: pleoxconfusa

Again, examining given source:

{% highlight python %}
# -*- coding: utf-8 -*-
"""
Created for Spring 2020 CTF
Cryptography 1
40 Points
Welcome to the one time pad oracle!
Our oracle's function is enc := key ^ msg | dec := key ^ ct
The oracle is found at umbccd.io:13371, and your methods are:
    flg - returns the encrypted flag
    enc - returns the encryption of the message after the : in "enc:..."
    dec - returns the decryption of the ciphertext after the : in "dec:..."

@author: pleoxconfusa
"""

import socket


sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)

server_address = ('crypto.ctf.umbccd.io', 13371)
sock.connect(server_address)

#available methods: flg, enc, dec.


msg = 'flg'.encode()
sock.sendall(msg)
flg = sock.recv(1024)
print(flg) #not decoded, because now the oracle sends encrypted bytes.

msg = 'enc:LET ME IN!!!'.encode()
sock.sendall(msg)
enc = sock.recv(1024)

msg = b'dec:' + enc
sock.sendall(msg)
dec = sock.recv(1024)
print(dec) #sanity check


sock.close()
{% endhighlight %}

We can see that all the function does is `enc := key ^ msg` or `dec := key ^ ct`, so if we call `flg`, capture it's output, and then send it back, we get the original flag:

{% highlight python %}
#!/usr/bin/env python
from time import sleep
from pwn import *

conn = remote('crypto.ctf.umbccd.io', 13371)
conn.sendline("flg")
enc1 = conn.recv()
# reverse it
conn.sendline(b"dec:"+enc1)
enc2 = conn.recv()
print(enc2.decode("utf-8"))
...
./client1_pwn.py
[+] Opening connection to crypto.ctf.umbccd.io on port 13371: Done
DawgCTF{P@dding_M0r3_L1K3_S@dding_@mir!73}
{% endhighlight %}

Flag is `DawgCTF{P@dding_M0r3_L1K3_S@dding_@mir!73}`.

## Right Foot Two Stomps
> So maybe it's not perfect. Padding may be vulnerable in general.
>
> crypto.ctf.umbccd.io 13372
>
> (no brute force is required for this challenge)
>
> Author: pleoxconfusa

Looking at the given python source code:

{% highlight python %}
# -*- coding: utf-8 -*-
"""
Created for Spring 2020 CTF
Cryptography 2
100 Points
Welcome to the AES-CBC oracle!
Our oracle's function is AES-CBC.
The oracle is found at umbccd.io:13372, and your methods are:
    flg - returns the encrypted flag
    enc - returns the encryption of the message after the : in "enc:..."
          as 16 bytes of initialization vector followed by the ciphertext.
    dec - returns the decryption of the ciphertext after the : in "dec:<16 bytes iv>..."
          as a bytes string.

@author: pleoxconfusa
"""

import socket

sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)

server_address = ('crypto.ctf.umbccd.io', 13372)
sock.connect(server_address)

#available methods: flg, enc, dec.

msg = 'flg'.encode()
sock.sendall(msg)
ct = sock.recv(1024)
print(ct)#not decoded, because now the oracle sends encrypted bytes.

msg = 'enc:LET ME IN!!!'.encode()
sock.sendall(msg)
enc = sock.recv(1024)#receive the encryption as 16 bytes of iv followed by ct.
print(enc)

iv = enc[:16]
ct = enc[16:]

msg = b'dec:' + iv + ct #sanity check, also other way to encode
sock.sendall(msg)
dec = sock.recv(1024)
print(dec)

sock.close()
{% endhighlight %}

So we see that it's using AES-CBC, and we again have `flg`, `enc`, and `dec` functions. If we run the program, we notice that `iv` is static for each run.

If we get the encrypted flag, and combine it with `iv`, we should be able to pass it to the decrypt function and get the flag. We can do this by modifying the given source code to encrypt the flag after we've tried encrypting a sample string:

{% highlight python %}
# -*- coding: utf-8 -*-
"""
Created for Spring 2020 CTF
Cryptography 2
100 Points
Welcome to the AES-CBC oracle!
Our oracle's function is AES-CBC.
The oracle is found at umbccd.io:13372, and your methods are:
    flg - returns the encrypted flag
    enc - returns the encryption of the message after the : in "enc:..."
          as 16 bytes of initialization vector followed by the ciphertext.
    dec - returns the decryption of the ciphertext after the : in "dec:<16 bytes iv>..."
          as a bytes string.

@author: pleoxconfusa
"""

import socket

sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)

server_address = ('crypto.ctf.umbccd.io', 13372)
sock.connect(server_address)

#available methods: flg, enc, dec.
msg = 'enc:LET ME IN!!!'.encode()
sock.sendall(msg)
enc = sock.recv(1024)#receive the encryption as 16 bytes of iv followed by ct.
#print(enc)

iv = enc[:16]
ct = enc[16:]

msg = b'dec:' + iv + ct
sock.sendall(msg)
dec = sock.recv(1024)
#print(dec)

msg = 'flg'.encode()
sock.sendall(msg)
ct = sock.recv(1024)
#print(ct)#not decoded, because now the oracle sends encrypted bytes.

msg = b'dec:' +iv+ct
sock.sendall(msg)
dec = sock.recv(1024)
print(dec)

sock.close()
{% endhighlight %}

And then running it:

{% highlight python%}
python client2.py
b"\xd6z\xbd\xfb\x9a\x82\xb91\xa5\x12\n['\xfb\x92\xb5DawgCTF{!_Th0ugh7_Th3_C!ph3rt3x7_W@s_Sh0rt3r.}"
{% endhighlight %}

Flag is `DawgCTF{!_Th0ugh7_Th3_C!ph3rt3x7_W@s_Sh0rt3r.}`.

## Left Foot Two Stomps
> n=960242069
>
> e=347
>
> c=346046109,295161774,616062960,790750242,259677897,945606673,321883599,625021022,731220302,556994500,118512782,843462311,321883599,202294479,725148418,725148418,636253020,70699533,475241234,530533280,860892522,530533280,657690757,110489031,271790171,221180981,221180981,278854535,202294479,231979042,725148418,787183046,346046109,657690757,530533280,770057231,271790171,584652061,405302860,137112544,137112544,851931432,118512782,683778547,616062960,508395428,271790171,185391473,923405109,227720616,563542899,770121847,185391473,546341739,851931432,657690757,851931432,284629213,289862692,788320338,770057231,770121847
>
> Author: pleoxconfusa

So, like the AUCTF, we're given another weak/easy to be [factorized prime, n](https://www.wolframalpha.com/input/?i=factorize+960242069).

So we can re-use the Python snippet from last week to crack the RSA:

{% highlight python %}
#!/usr/bin/env python3
import math
import string

message = [346046109,295161774,616062960,790750242,259677897,945606673,321883599,625021022,731220302,556994500,118512782,843462311,321883599,202294479,725148418,725148418,636253020,70699533,475241234,530533280,860892522,530533280,657690757,110489031,271790171,221180981,221180981,278854535,202294479,231979042,725148418,787183046,346046109,657690757,530533280,770057231,271790171,584652061,405302860,137112544,137112544,851931432,118512782,683778547,616062960,508395428,271790171,185391473,923405109,227720616,563542899,770121847,185391473,546341739,851931432,657690757,851931432,284629213,289862692,788320338,770057231,770121847]

def getModInverse(a, m):
    if math.gcd(a, m) != 1:
        return None
    u1, u2, u3 = 1, 0, a
    v1, v2, v3 = 0, 1, m

    while v3 != 0:
        q = u3 // v3
        v1, v2, v3, u1, u2, u3 = (
            u1 - q * v1), (u2 - q * v2), (u3 - q * v3), v1, v2, v3
    return u1 % m


def main():
    # n factorized w/Wolfram Alpha gives
    n = 960242069
    e = 347
    p = 151
    q = 6359219

    # Compute phi(n)
    phi = (p - 1) * (q - 1)

    # Compute modular inverse of e
    d = getModInverse(e, phi)

    enc = ""
    for ct in message:
        # Decrypt ciphertext
        pt = pow(ct, d, n)
        enc+=chr(pt)
    print()

    print(enc)

if __name__ == "__main__":
    main()
{% endhighlight %}

Which give's us:

{% highlight bash %}
./left_foot_two_stomps.py
xhBQCUIcbPf7IN88AT9FDFsqEOOjNM8uxsFrEJZRRifKB1E=|key=visionary
{% endhighlight %}

Hm... So not quite the flag. This looks like another cipher text, with it's associated key, `visionary`. That kind of sounds like [Vigenère cipher](https://en.wikipedia.org/wiki/Vigen%C3%A8re_cipher).

It also looks like it's a form of base64 encoded data, as well. We can use cyberchef to play around with the above:

&nbsp;
![]({{ site.baseurl }}/img/dawgctf/left_foot_two_stomp_cyberchef.png)
&nbsp;

Flag is `DawgCTF{Lo0k_@t_M3_1_d0_Cr4p70}`. (Thanks for the help, [datajerk](https://github.com/datajerk))

# Coding
## Miracle Mile
> You didn't think I'd graduate without writing a running themed challenge, did you?
>
> nc ctf.umbccd.io 5300
>
> Note: pace is measured in minutes/mile (i.e. 10 miles in 1:40 is 10:00 minutes/mile)
>
> Author: trashcanna

If we connect to that endpoint, we see we need to guess a mile split given a distance run and the total time to do it. However, we only have about a second before it times out:

{% highlight bash %}
nc ctf.umbccd.io 5300


-----------------------------------------
Hi, I'm Anna and I really like running
I'm too broke to get a gps watch though :(
Think you can figure out my average pace?
-----------------------------------------
I ran 18 in 2:22:03 What's my pace?
Ha too slow!
{% endhighlight %}

So, we can put something together using pwntools to do that logic and answer super fast:

{% highlight python %}
#!/usr/bin/env python3.8
from pwn import *

context.log_level = 'debug'

def main():
    conn = remote('ctf.umbccd.io', 5300)
    conn.recvuntil("pace?\n-----------------------------------------\n")

    while 1:
        #       miles h:mm:sec
        # I ran 18 in 2:22:03 What's my pace?
        ranline = conn.recvline().decode("utf-8").split()
        print("ranline: ", ranline)
        miles = ranline[2]
        hours, minutes, seconds = ranline[4].split(":")
        total_seconds = (int(hours) * 3600) + (int(minutes) * 60) + int(seconds)
        seconds_per_mile = float(total_seconds) / float(miles)
        minutes_per_mile = int(seconds_per_mile / 60)
        seconds_remainder = int(seconds_per_mile - (minutes_per_mile * 60))
        conn.sendline(f"{minutes_per_mile}:{seconds_remainder:0=2d}")

    # Get flag
    while 1<2:
        try:
            print(conn.recvline().decode("utf-8"))
        except EOFError as e:
            break

if __name__ == '__main__':
    main()
{% endhighlight %}

Running, we see it goes through a ton of rounds, and then gives us the flag.

{% highlight python %}
...
[DEBUG] Received 0x25 bytes:
    b"I ran 18 in 2:20:42 What's my pace? \n"
ranline:  ['I', 'ran', '18', 'in', '2:20:42', "What's", 'my', 'pace?']
[DEBUG] Sent 0x5 bytes:
    b'7:49\n'
[DEBUG] Received 0x25 bytes:
    b"I ran 12 in 1:40:00 What's my pace? \n"
ranline:  ['I', 'ran', '12', 'in', '1:40:00', "What's", 'my', 'pace?']
[DEBUG] Sent 0x5 bytes:
    b'8:20\n'
[DEBUG] Received 0x3f bytes:
    b"Dang you're pretty quick\n"
    b"flag: DawgCTF{doe5n't_ruNN1ng_sUcK?!}\n"
{% endhighlight %}

Flag is `DawgCTF{doe5n't_ruNN1ng_sUcK?!}`.

## Arthur Ashe
> Success.
>
> nc arthurashe.ctf.umbccd.io 8411
>
> Author: pleoxconfusa

Connecting, we see a game of having to answer the correct Tennis match winner:

{% highlight bash %}
nc arthurashe.ctf.umbccd.io 8411
Welcome to the Arthur Ashe stadium!  We'll keep sending you scores if you keep sending us who wins (0 or 1).  Do try to keep the crowd happy, won't you [Y/n]?Y
The result of this game is 30-15.0
The result of this match is love-2.1
The result of this match is 1-love.1
YOU CANNOT BE SERIOUS!  That's wrong!  Leave!
{% endhighlight %}

But, there's probably A TON of rounds, and we don't have the time for that. Instead, we can write something up in pwntools again. I've substituted "game", "set", and "match" with integers of ascending values, as that is how they are weighted in Tennis. I've also set "love" to 0.

After running it successfully, we see there are 504 rounds, and at the end, we just get "You did great!  Thank you!'". For a while, I thought I was chopping off input. After a thorough set of attempts, I was convinced I wasn't cutting the stream off prematurely or anything. The title is called "Arthur Ashe" and the challenge text just says "Success.". Googling this, we're met with his famous quote:

> Success is a journey, not a destination. The doing is often more important than the outcome
>
> -- Arthur Ashe

So, if we change our thinking, and instead store each successful round answer (i.e. 0 or 1), in a string, we can then convert that resulting binary to a string, and we get the flag!

{% highlight python %}
#!/usr/bin/env python3.8
from pwn import *

context.log_level = 'debug'

def main():
    conn = remote('arthurashe.ctf.umbccd.io', 8411)
    conn.recvuntil("won't you [Y/n]?")
    conn.sendline("Y")
    rd = 0
    bits = []
    for x in range(504):
        result = conn.recvuntil(".").decode("utf-8")
        result = result.replace("love", "0").replace("game", "100").replace("set", "1000").replace("match","10000").split()[-1].split("-")
        if int(result[0]) > int(result[1][:-1]):
            conn.sendline("0")
            bits.append("0")
        else:
            conn.sendline("1")
            bits.append("1")
        rd += 1
    print(''.join( chr(int(''.join(bits[i:i+8]), 2)) for i in range(0, len(bits), 8)) )

if __name__ == '__main__':
    main()
{% endhighlight %}

Running gives us:

{% highlight bash %}
...
[DEBUG] Sent 0x2 bytes:
    b'1\n'
[DEBUG] Received 0x21 bytes:
    b'The result of this set is 5-love.'
[DEBUG] Sent 0x2 bytes:
    b'0\n'
The Flag is DawgCTF{L0v3_Me@n5_N07h1ng_!n_T#e_G@m3_Of_T3nn15.}.
{% endhighlight %}

## Man these spot the difference games are getting hard
> The Office Season 7 Episode 25 15:53
>
> nc ctf.umbccd.io 5200
>
> Author: trashcanna

Shout out Pam:

&nbsp;
![]({{ site.baseurl }}/img/dawgctf/thesame.jpg)
&nbsp;

Connecting to the remote endpoint:

{% highlight bash %}
nc ctf.umbccd.io 5200
-----------------------------------------------------------------------
Welcome to DiffSpot, a new Spot the Differnce Game sponsored by DawgSec
          You'll be presented with a variety of encoded data,
              all of which will be of the form DogeCTF{}
Possible ciphers include:
- rot13
- rot16
- base64
- base32
- base16
- atbash
- affine with b=6, a=9
- railfence with key=3
         Your job is to decode the flag and send it back to us
                     Seems easy enough right?
-----------------------------------------------------------------------
HCIQYVZ{OZCVQUDUVRRTRTSYYFFQWWRTVCZHHJJY}
{% endhighlight %}

And then we have about 3 seconds before we get kicked. So, we need to be able to tell from which of those 8 possible ciphers the encoded text came, and then once found, decode it and send the right flag. I read quite a bit of things just Googling these various ciphers, and found that a `rot` cipher over the alphabet range would cover most of these. The rest are either already implemented in the Python common library (base64), or a quick Google search for "cipher XXX python" would yield a usable snippet on the first page.

My approach was to just iterate through each one, and search for "DogeCTF" in the output (if generated, at all) as we know that is the beginning of the flag.

{% highlight python %}
#!/usr/bin/env python3.8
from pwn import *
import base64
import math
import gmpy2
import re
import codecs
from itertools import cycle

context.log_level = 'debug'

# https://exercism.io/tracks/python/exercises/rail-fence-cipher/solutions/8d7425bdbb844c5e9416015cd7eb3daa
# railfence
def rail_pattern(n):
    r = list(range(n))
    return cycle(r + r[-2:0:-1])
def decode_railfence(ciphertext, rails):
    p = rail_pattern(rails)
    indexes = sorted(range(len(ciphertext)), key=lambda i: next(p))
    result = [''] * len(ciphertext)
    for i, c in zip(indexes, ciphertext):
        result[i] = c
    return ''.join(result)

# https://stackoverflow.com/a/45717802/13158274
# -- Jérôme
class AtBash:

   def __init__(self):
       self.alphabets = ' ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789~!@#$%^&*()_+|:"<>-=[];,.?/`'
       self.alphabets = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ!"#$%&\'()*+,-./:;<=>?@[\\]^_`{|}'

   def encode(self, plaintext):
       cipher = ""
       for i in plaintext:
           index = self.alphabets.index(i)
           cipher += self.alphabets[abs(len(self.alphabets) - index - 1) % len(self.alphabets)]
       return cipher

   def decode(self, ciphertext):
       return self.encode(ciphertext)

atbash_cipher = {'A': 'Z', 'a': 'z', 'B': 'Y', 'b': 'y', 'C': 'X', 'c': 'x', 'D': 'W', 'd': 'w', 'E': 'V', 'e': 'v', 'F': 'U', 'f': 'u', 'G': 'T', 'g': 't', 'H': 'S', 'h': 's', 'I': 'R', 'i': 'r', 'J': 'Q', 'j': 'q', 'K': 'P', 'k': 'p', 'L': 'O', 'l': 'o', 'M': 'N', 'm': 'n', 'N': 'M', 'n': 'm', 'O': 'L', 'o': 'l', 'P': 'K', 'p': 'k', 'Q': 'J', 'q': 'j', 'R': 'I', 'r': 'i', 'S': 'H', 's': 'h', 'T': 'G', 't': 'g', 'U': 'F', 'u': 'f', 'V': 'E', 'v': 'e', 'W': 'D', 'w': 'd', 'X': 'C', 'x': 'c', 'Y': 'B', 'y': 'b', 'Z': 'A', 'z': 'a', ' ': ' ', '.': '.', ',': ',', '?': '?', '!': '!', '\'': '\'', '\"': '\"', ':': ':', ';': ';', '\(': '\)', '\)': '\)', '\[': '\[', '\]': '\]', '\-': '\-', '1': '1', '2': '2', '3': '3', '4': '4', '5': '5', '6': '6', '7': '7', '8': '8', '9': '9', '0': '0'}

# https://exercism.io/tracks/python/exercises/affine-cipher/solutions/1c0c1f0c8ba04252bb9a0ce7d7bafcd4
def decode_affine(ciphered_text, a, b):
    m = 26
    if math.gcd(a, m) != 1:
        raise ValueError("Error: a and m must be coprime.")
    ciphered_text = ciphered_text.lower()
    ciphered_text = str.replace(ciphered_text," ","")
    output = ""
    MMI = gmpy2.invert(a, m)
    for ch in ciphered_text:
        y = ord(ch) - 97
        if y in range (0,26):
            code = (MMI * (y - b)) % m
            output += chr(code + 97)
        else:
            output += ch
    return output

# https://eddmann.com/posts/implementing-rot13-and-rot-n-caesar-ciphers-in-python/
def rot_alpha(n):
    from string import ascii_lowercase as lc, ascii_uppercase as uc
    lookup = str.maketrans(lc + uc, lc[n:] + lc[:n] + uc[n:] + uc[:n])
    return lambda s: s.translate(lookup)


def main():
    conn = remote('ctf.umbccd.io', 5200)
    conn.recvuntil("right?                          \n-----------------------------------------------------------------------\n")
    atbash = AtBash()
    while 1:
        encodedflag = conn.recvline().decode("utf-8").strip()
        print("GOT FLAG: " + encodedflag)
        decoded = ""
        for i in range(26):
            decoded = rot_alpha(-i)(encodedflag)
            if "DogeCTF{" in decoded:
                print("SENDING DECODED FLAG: ", decoded)
                conn.sendline(decoded)
                continue
            #else:
            #    print(f"rot{i} decoded: ", decoded)
        try:
            decoded = base64.b64decode(encodedflag)
            if b"DogeCTF{" in decoded:
                print("SENDING DECODED FLAG: ", decoded)
                conn.sendline(decoded)
                continue
            else:
                print("base64 decoded: ", decoded)
        except binascii.Error as e:
            pass
        try:
            decoded = base64.b32decode(encodedflag)
            if b"DogeCTF{" in decoded:
                print("SENDING DECODED FLAG: ", decoded)
                conn.sendline(decoded)
                continue
            else:
                print("base32 decoded: ", decoded)
        except binascii.Error as e:
            pass

        try:
            decoded = base64.b16decode(encodedflag)
            if b"DogeCTF{" in decoded:
                print("SENDING DECODED FLAG: ", decoded)
                conn.sendline(decoded)
                continue
            else:
                print("base16 decoded: ", decoded)
        except binascii.Error as e:
            pass

        decoded = ""
        for atbc in encodedflag:
            if atbc in atbash_cipher.keys():
                print(atbash_cipher[atbc], end="")
                decoded+=atbash_cipher[atbc]
            else:
                decoded+=atbc
        if "DogeCTF".lower() in decoded.lower():
            print("SENDING DECODED FLAG: ", decoded)
            conn.sendline(decoded)
            continue
        else:
            print("atbash2 decoded: ", decoded)

        decoded = decode_railfence(encodedflag, 3)
        if "DogeCTF{".lower() in decoded.lower():
            print("SENDING DECODED FLAG: ", decoded)
            conn.sendline(decoded)
            continue
        else:
            print("railfence decoded: ", decoded)

        decoded = decode_affine(encodedflag, 9, 6)
        if "DogeCTF{".lower() in decoded.lower():
            print("SENDING DECODED FLAG: ", decoded)
            conn.sendline(decoded.upper())
            continue
        else:
            print("affine decode: ", decoded)

if __name__ == '__main__':
    main()
{% endhighlight %}

Running this gives us the flag:

{% highlight python %}
...
SENDING DECODED FLAG:  b'DogeCTF{NDTPVQudnGEWUopMWBVMfYZQFgvViYCo}'
[DEBUG] Sent 0x2a bytes:
    b'DogeCTF{NDTPVQudnGEWUopMWBVMfYZQFgvViYCo}\n'
[DEBUG] Received 0x53 bytes:
    b'446F67654354467B5A49484F74686C785451646448776A6C65464963664A6E4D52536C4C777A4D737D\n'
GOT FLAG: 446F67654354467B5A49484F74686C785451646448776A6C65464963664A6E4D52536C4C777A4D737D
SENDING DECODED FLAG:  b'DogeCTF{ZIHOthlxTQddHwjleFIcfJnMRSlLwzMs}'
[DEBUG] Sent 0x2a bytes:
    b'DogeCTF{ZIHOthlxTQddHwjleFIcfJnMRSlLwzMs}\n'
[DEBUG] Received 0x48 bytes:
    b"Dang you're good, here's your flag: DawgCTF{w@iT_th3y_w3r3_d1ff3rent?!}
{% endhighlight %}

Flag is `DawgCTF{w@iT_th3y_w3r3_d1ff3rent?!}`.


# Reversing
## Ask Nicely
> Remember your manners!
>
> Author: Novetta

Looking at the binary in cutter:

&nbsp;
![]({{ site.baseurl }}/img/dawgctf/ask_nicely_main.png)
&nbsp;

And the `flag` function:

&nbsp;
![]({{ site.baseurl }}/img/dawgctf/ask_nicely_flag.png)
&nbsp;

Dumping that to ASCII:

{% highlight python %}
>>> chars=[0x44,0x61,0x77,0x67,0x43,0x54,0x46,0x7b,0x2b,0x68,0x40,0x6e,0x4b,0x5f,0x59,0x30,0x55,0x7d]
>>> for entry in chars:
...   print(chr(entry), end="")
...
DawgCTF{+h@nK_Y0U}
{% endhighlight %}

Flag is `DawgCTF{+h@nK_Y0U}`.



# Forensics
## My First Pcap
> Find the flag in the network traffic
>
> Author: freethepockets

Download the pcap file. Inspecting it initially with `strings`, we see what looks to be a base64 string:

{% highlight bash %}
strings easy.pcap
# ...
RGF3Z0NURntuMWMzX3kwdV9mMHVuZF9tM30=
# ...
echo RGF3Z0NURntuMWMzX3kwdV9mMHVuZF9tM30= | base64 -d
DawgCTF{n1c3_y0u_f0und_m3}
{% endhighlight %}

Flag is `DawgCTF{n1c3_y0u_f0und_m3}`.

## UMBC Cyber Defense - can it be breached?
> Is the shield for keeping things in or keeping things out?
>
> https://clearedge.ctf.umbccd.io/
>
> Author: ClearEdge

Looking at the website; we see the shield and some other things for other challenges:

&nbsp;
![]({{ site.baseurl }}/img/dawgctf/clear_edge_main.png)
&nbsp;

The challenge mentions something might be _in_ the shield; we'll download the shield PNG to our local machine and inspect it using [Stegsolve](https://github.com/zardus/ctf-tools/blob/master/stegsolve/install). Clicking through the defaults, we find something hidden on Green plane 0:


&nbsp;
![]({{ site.baseurl }}/img/dawgctf/shield_flag.png)
&nbsp;

Flag is `DawgCTF{ClearEdge_hiddenImage}`


## Impossible Pen Test Part 1
> Welcome! We're trying to hack into Burke Defense Solutions & Management, and we need your help. Can you help us find the password of an affiliate's CEO somewhere on the internet and use it to log in to the corporate site? https://theinternet.ctf.umbccd.io/
>
> (no web scraping is required to complete this challenge)
>
> author: pleoxconfusa

* Log in to main website given: https://theinternet.ctf.umbccd.io/
* Go to Corporate page and get name Sonny Bridges
* See they're CEO - Oconnell Holdings, take email `bseok@parcel.com`
* Search databreaches, find it on `charriottinternational.txt`: `bseok@parcel.com        fr33f!n@nc3sf0r@ll!`
* Login in, flag

&nbsp;
![]({{ site.baseurl }}/img/dawgctf/pentest1.png)
&nbsp;

Flag is `DawgCTF{th3_w3@k3s7_1!nk}`.

## Impossible Pen Test Part 2
> Welcome! We're trying to hack into Burke Defense Solutions & Management, and we need your help. Can you help us find a disgruntled former employee somewhere on the internet (their URL will be the flag)?
>
> https://theinternet.ctf.umbccd.io/
>
> (no web scraping is required to complete this challenge)
>
> author: pleoxconfusa

* Log in to main website given: https://theinternet.ctf.umbccd.io/
* Go to Corporate page and get CEO name, Truman Gritzwald
* Go to his facespace and employee name "Madalynn Burke" from first post
* Go to her facespace and get employee name "Royce Joyce" from the second post
* Go to her facespace and get list of team employees

> [Pictured: like, these, like, all these people]
>
> Meet the team! Carlee Booker, Lilly Lin, Damian Nevado, Tristen Winters, Orlando Sanford, Hope Rocha, and Truman Gritzwald.

* Search each of those until we find a disgruntled employee. None matched, though Truman's said he was "about to fire my CFO!!" so it's probably him
* Searching the above employees facespace pages, "Tristen Winters" page mentions something peculiar:

> Nov 28, 2019
> [Pictured: hackers]
> Everyone should ignore Rudy Grizwald's messages

* So, looking up Rudy Grizwald's syncedin then facespace:

> 11/2019 - Present
> Data Breacher - Combined Teach, Inc.
>
> 1/2019 - 11/2019
> Chief Financial Officer - Burke Defense Solutions & Management

Looks like we found the fired CFO, to confirm, his facespace:

> Nov 28, 2019
> Truman Gritzwald is a bad CEO.

* Also, his facespace page, see the URL is `https://theinternet.ctf.umbccd.io/SyncedIn/DawgCTF%7BRudyGrizwald%7D.html`

Flag is `DawgCTF{AlexusCunningham}`.

## Impossible Pen Test Part 3
> Welcome! We're trying to hack into Burke Defense Solutions & Management, and we need your help. Can you help us find the mother of the help desk employee's name with their maiden name somewhere on the internet (the mother's URL will be the flag)?
>
> https://theinternet.ctf.umbccd.io/
>
> (no web scraping is required to complete this challenge)
>
> author: pleoxconfusa


* Log in to main website given: https://theinternet.ctf.umbccd.io/
* Go to Corporate page and get CEO name, Truman Gritzwald
* Go to his facespace and employee name "Madalynn Burke" from first post
* Go to her facespace and get employee name "Royce Joyce" from the second post
* Go to her facespace and get list of team employees

> [Pictured: like, these, like, all these people]
>
> Meet the team! Carlee Booker, Lilly Lin, Damian Nevado, Tristen Winters, Orlando Sanford, Hope Rocha, and Truman Gritzwald.

* Search each of those until we find the helpdesk employee, Orlando Sanford
* Go to his facespace page, on his fourth post from the top see its about his mom:

> [Pictured: Alexus Cunningham]
> My mom defenestrates a cat!

* Go to her facespace page, see the URL is `https://theinternet.ctf.umbccd.io/FaceSpace/DawgCTF%7BAlexusCunningham%7D.html`

Flag is `DawgCTF{AlexusCunningham}`.

## Impossible Pen Test Part 4
> Welcome! We're trying to hack into Burke Defense Solutions & Management, and we need your help. Can you help us find the syncedin page of the linux admin somewhere on the internet (their URL will be the flag)?
>
> https://theinternet.ctf.umbccd.io/
>
> (no web scraping is required to complete this challenge)
>
> author: pleoxconfusa

Clicked forever for this one (went through 6 other "Linux Server Admins"), it's late, and I don't remember how I stumbled upon this one.

Flag is `DawgCTF{GuillermoMcCoy}`

## Impossible Pen Test Part 5
>
> Welcome! We're trying to hack into Burke Defense Solutions & Management, and we need your help. Can you help us find the CTO's password somewhere on the internet and use it to log in to the corporate site?
>
> https://theinternet.ctf.umbccd.io/
>
> (no web scraping is required to complete this challenge)
>
> author: pleoxconfusa

These challenges suck, so I'll just give the path to get the flag.

* Log in to main website given: https://theinternet.ctf.umbccd.io/
* Go to Corporate page and get CEO name, Truman Gritzwald
* Look up his profile on facespace
* See he's married to Madalynn Burke
* Look up her profile on facespace, see she had a meeting with CTO Royce Joyce
* Look up her profile on facespace
* Search the companies that were mentioned to have databreaches for her email, and find: `roycejoyce@wemail.net	c0r^3cth0rs3b@tt3ryst@p\3` on the skayou breach.
* Login, flag

&nbsp;
![]({{ site.baseurl }}/img/dawgctf/roycejoyce.png)
&nbsp;

Flag is `DawgCTF{xkcd_p@ssw0rds_rul3}`

# Misc
## Me Me
> You, you want to solve this?
>
> Author: Novetta

We're given a file named `enc` that looks like:

{% highlight bash %}
egin 664 uhuh
B5!.1PT*&@H````-24A$4@```,@```#?"`8```"SBYR]`````7-21T(`KLX<
Z0````1G04U!``"QCPO\804````)<$A9<P``$G0``!)T`=YF'W@``#DV241!
5'A>[9T+O!55V?\7"G(3Y"YR$^0B(BJ@HAY`T30%*C%+RTS+#+0;Y%TS_5>F
ONEKX+\RL#2[6)HEOBGH:QF*H*@I*J(""@(B<A$$X7!3WOFNO9_-G&$N:ZY[
[W/F]_G,.7O/[)E9ZWE^O_6LM6:M-8UV65`Y<N1PQ5[%_SERY'!!+I`<.7R0
"R1'#A_D`LF1PP>Y0'+D\$$ND!PY?)!W\Y8!.S^)9O+&>S4J?LJ1%7*!)`@[
\;,F<SGO79^1"R0FA)A>I)3C'WRT7:W:4*M6?[A-?;AEA]JZXQ.U?-T6?2P(
W=NW4,V:[*7V:]%$==JOJ>K<IKEJM^\^^EC0?7.QQ$,ND!"`=%Z$J]W^L5JT
:I/Z:.O':LGJS6K!B@_5NQ_4JK>MSZLV;%5;MN]46'KGQ[O-O7G;SN(G?[1L
VKCXR2+\WHU4(RL)+?9I;`FEF3JH4TO5M5US-:#;?JJ7]7G?9GNKOIU;J>;[
[%T\HR[\\I!C3^0""8!72;QZXS;URCL;U`MOKU=OO+M1+?]@BUJ^ME:MW;1-
;:K=J9I:)3Y$;K+W7GKC,Y;F/]C;NM['Q6L'P?Y;N0;_=WS\B=[XO,V*2*V:
-U8=6C55W3LT5]W;M5#]N[961QW45AU^8!O5J753?;X@CS!FR`7B`K=2UBZ(
I]]8H^99GXD&1`&Q("4]Y*649Q^D#B.$L)!K\Y_[DA[N*Y&)?:2)]`RR1#*\
?T=?P>1BV1.Y0&QPDF3%NEKUY.MKU#]??5^]NFR#KBY1E:+Z(E$!0%!!6F(P
A5M:\#"11M).M>RP'FW4R8?MKTXXI*/JUKZY_AW(A5(7#5X@;J*8NWB=NN^9
Y6K>T@VZ04V)+*5QFA$A;4C:)>J1'QK^@WJV46<?UUT=TZ=]+A8'&JQ`[,[G
\\S75JL'GWM71XRWWO](5TM$$*!:1>$%>[X0#-6SWOOOJR/*&4.[JI&'=JIC
GX8JE`8E$+=H\8\75ZH_SUZFWERY21-EG\9[Z6I(?1-$$!`,5;#M.S_1!</!
75JI+P_KH3X[I$N#CBH-1B!VQ[YBM2?NF[-</?;R*O7:BHU:$`BCFJM/24%L
@%`0S*'=6JM3C^BLSJ[IK@ZWVBV@(8FD7@O$Z4AZH.[^]Q(U[85W==L"4;1H
NG>IQZE<D.J.$^5.$^VN+=L*486VRMBCNJJOG]A+]X0)ZKM8ZJU`G!%CRN-O
EX2Q;[/*:6R3#NDN)CV2+@A926DD'1]MW5D2ROA3#FH0$:7>"<3N+-H8DZ8O
5']\^AWM7'DF4`FD`Q`/P;9IV435].N@>K1OH?<O6[=%]Z"M7%^KQ5PIL(N9
=)T[_$`U<72_4ANE/@JE7D80ZLZ39RQ2=UG5*2$9S@65)(Z-M3O4F4.[J4L^
TZ]4&@L6K_I(_?R1A>KWLY9J85<*[':DT.G2MKFZP*IV31C5UW-X2S6C7@C$
7G(]9%6C?O*W!>J-E9LJND>*4GC\IWJK6[]Z1'%/(1\"R<\/_O*JNN/QMRHR
'XA%>KZ&]&JK+K6$?KI5_0+U)9K4FPA"B?O3!U_7`@&5*@R)'#QO>/C*$7J?
&YGL^\Z:](R:,>\]U;IYDXK-$T(!".0'9QRB^G3>5W^O=E3MC$)[:4L)._+'
_U8/S%U>ZK*-0R0<+E4)^^<D0+H8B7OQ*7WT=Z^2EGV21^KYG%.)X@"D2Z(U
/AA]\RSM$X'=5]6&JHX@-,(O^<,\-?VE]Q)I@$M)2)4!AP,^)SG,!&MW;-U4
/7_CR9I0)H!@Q_[@GVJYE=]*ZF1P`S:2AOSHP0>HV[XZJ,Z#QFI#50G$7MK^
Z>EEZJ9IKZNE:S;KKD<0ES@T.OMW::5&#NBD#NG66K6QKOOBDO7JV<7KU'.+
/]"EN`Q0C`J(,[1/._78-2>X1@XWD.]3;WQ2IR'-!KM$2O((*Z+:4ZY##UW/
CBW5U6,/45\9WD/OL_NP&E`U`A'#4L+_\+[Y:LJ_WM*$3:I$E4;S%:?W=QT*
?L^32]5_/?2&GN\1M7TC$6I@]_W4$]>-#$643]TP4[VT9$-J;2N)CI!:(-55
.186G$<T8;(8MOW)V0/U-:M))%4A$#$H#_R^__MY:NZB#Q*+&C@14ES[^0'J
*DL<@/O9(<Y\Y,7WU+@[7XA]3T0]\[H3C1NRS$49?MT3.IUQ(Y@3Y!\P)9BI
O8SL[=BJJ2XP&-[_TM+U>FA_G$(!D/9C^K93/S]OD.[2KA:15$T$@9R(X[T-
M8GVYD"$48,.4/=//$Y_]W*<[+_9BB(_>N`U/2<\*F'HQ?K!&05!^A%%CM'@
I;M7VD5)@;20!]I9%XSLI<X[X<`ZSV,0YC,+U^IN\S??VQ3+[I+O`]HTUR(9
,^2`XI'*1L7V8D$.P<^G+U07_/IY70HE*0Z<1A7@_.-[ZN]^9)7]/#UF6#CG
104E,@\Q&1O&=>UY%4A:Z+[^Y6.+BWN3@XB#XO&6<X_0SV/L0T?8J&K2;3O]
ZN-UNPG[<UX4<"]\QS7P)3X5N.6_4E"1`A%R@&__]D7=YJ!JD70/#B2'[`SM
!E[BL(,>F0%6`Y[($X4LI)](0%OF(JNZA@#<[LL^2G#(1$<$59PD03KHE+CP
I%[J&R?VTON$J-Q;TB1"H=3GJ3DVBR,2?(@O\2F^!=RK4D52<0(1<="8Y0'9
73.7I#9PCVFH+*?3K(EY=RN@CDY:XK0'$`G5EI??V:"_NQ%DV=HM:O[R#W7^
D\X[D0/"3QC=K[C'O8`0\A)=OGAL-UTPQ`'YP)?D"=_B8WQ=J2*I*(&(."@Y
/_.S6>H?_UFIVK<JU/63)@B@JA,&0J`U5NF/D^.VWH*Z;/=IW*C0ZQ.C.N<%
>I9J^K7?H\?.#9+O$P_MI,>UQ?6%^!/?XF-\C<\K4205(Q`1!P__OGS[,[JG
BH9P&N00$.[IJ7ECY4;]W<0YI&_!BHV:W'&)4J[N$<2-78_H67>`9!#Z=VFM
;9842`,^QM?X'-M6FD@J0B`B#KIQ3[OI*?U`+(UJA1NH9DW]U]OZLY24;A"G
,467-D&21"D7/JH-5UW:NN/CQ$6-C_$U/L?W<*"21%)V@=C%<<[M<]4[:S=G
-BB/>W`OEO7Y[;^7%/>Z0]+XTP<7)%+-*"=(.U4W5F\Q@9"5]E(:$5W\@._A
0"6)I*P"$7'HWIH[GM<&RBIRV$&#>>(]+ZDY"PN$<7,,X9\TQNGJK"30_GII
Z09-1N!'1GP$:"]$[;T+`C[']W``.U=*FZ1L`K&+@_JG/(A*L\WA!AQ#=6GK
]D_4FHU;BWMW0QS$++\5']0FTO:H!)!GQ'[-GU\M^<(-DO^_S5VA9LQ;910]
$1#7YW\8,>%[.``7X$0EB*1L`B'C=.])@SRK:I4?&N_E;0ZB#$ZG#EX?(HB4
V*P#=N&OGR_NW1/XB2KH!"O"`K^\<XRG\@Q;6;=IN_[/TW,Y9@+2!1>DX2Y=
P.5"6:M8Y__J.6T(YF2'%0=$M6]9(*O[1`$$M)/0^=T-V)R(^+@E`(CHA)3<
SUA5SPV;=^@"PLM/V(:(Q+*FK-+XI9H>>AO<LZVNEKE=WPO<`T[`#3A23I1-
()?]X65=I\40IM4J'(XC,#C.H@1DXS/[.!9$BOH(\@P!(2A/Q[$%I3=V#;('
-@MZ'M/$BIX\%/431Y/&C?1HW6F7#5>_^]90=??%1^OML6N.5W_\SC'ZH231
Q12D'6[`$;A2+F0J$"F1&(?#</4PSSEP-.$:03#0;\;5(]3+/_NTWOC,/HY!
E(8B$O().;$+0^@O.KFW'I6,+2C%L0>B20+<QPO<9\J%1ZGO%U<XP<^RT5O&
>"Z&]Y-&Q&L*N`%'X(J,W1(.987,!$+&I#Y[\[0W]%R.,(#XA.OI5XW0HV`9
^H#QV?C,/HX-[M5&$Z:^BX3\4:(3/7]\UD!=4C/@$#NP48ICCR\>VUV7W&G8
@VL2L:ZT[L?H7"$O?I8-L)\G]K>=-R@P6KD!KL`9N,,ULQ1))@(1<3`P;^(]
\_0^OY#M!*47(?K>[QZKYU"X&8A]'+OGXF/4@1U:&D>F:H78;NHW"R6W'I)B
[;-OV(-J#D/9D^Z>YEH41*QF<LZPPFQ!$8030FI69&29(Z*(:5K(IXQY@SLR
N)/K98%,!"(9XED#_=R4>F'`T^[OC]D=OMT<(??@-_R6L49)(\[@Q"0A)?>W
/]W'L^06>P#:!DQ6"M-0-@$%UXC^'4KB-,&GC]A?=ZF'M26<@3MPR(L#:2!U
@8CAKK]_OOK7_-6ANW-Q`J\5^^R17?1W/\/(,7[+Q!R_>G-84$W9L;-0I0F3
_C0`T9GKS>KK?A"10.!OG=(GT:J6E.RM+'^&0==V+?2+2+%EF+1P/[@#A^`2
,!5E'*0J$%$Z#YEN?W21;LR%(1<&)'KPSCT::Z;@M[S@DG/C$D)$1W7EZ-YM
=54E;`1,$N0'HC,G1:;L^A4:@B,.;*-%9=*S98HH!1!I1^!1"AI^#X?@$IR2
`B!-I"H0,L`0C>O_^EKH1CG`()`\"EHW;ZS/#>.$G9]XWXM&YET7#]55%7DF
4`Y(VXTY*2"(("(>YKPP]R6L3;P@(EN^UNQ5U@+&<\6MZL$E."6C?]-$ZE6L
:^][-=;H5XSQ_H9M5D@V%PJ_7;IFBQYO9%):2DGHU\,"$1')G[]W7%E%(FD-
TUUJ1]@Y,'Z0AXPF#6<ALBSN%P?8'4[!K;21BD#$4*Q=]8`5"L-6K>R@Q&0!
ZB>LNB?P<X(<X[><P_`0T_ORVN9'YZW2G]U*)2%`N45"?K@G,PUEK)(?Q";,
>6'N2U+IE71@9Y9\!4%IX5D&P]K#^,4-G`NGX!8<`WZ\B(/$!4)",13ACX7=
XAI#<,?CBTO7]H*0F-^&`>EC$-ZO_UE8/<0+<OURBX22F\6Y'W_E??W=CQQB
+XA$_3])B-V("JQ\X@?NSV](>Q)M(.X-M^!8FA.M$A>(.(2$\S+,N.$4<(V9
"]:HJ_[TBF_]%0/Q&WX;Y;XX^[9'%E:\2"`81`LBA^PK1/+EL2*Y%X3L,U]?
[4O0.6^N+?6B)94&?`S'L`,0[B6)1`4B!N*)YY_G+-.]24D80THJAAS\[RN%
:I";,Q:L^%#]8=8[1D.RO4":*UTDY(U[\5S@_#OFNC9621_[6%KHTC_,B]1)
$@;-#1>^2$H<@&OA+[@&YX"?2*,@48'@$$KX'UNA-&KODQ]P<M`3<@;-Q7G^
@=$I::LADA!%YB_;J.>J`#=RO/O!%CWT'+LD24X[3.U->S*)ZI43<`W.Z>[C
A*^?F$#$.;][<JE>\+E<\SOBB,..:H@DY!7B4Q?W@M\<E_H`.`;7X!S<`TE&
D<2L!UGH56$50#^'50NJ)9(D52!4.^`<W#/IV0N#1)@LBIT\?6%I%<!R1(\T
$#624*U)HSJ18T_`-3@']^`@2"J*Q!8("8$@/"SZZ[,K=+VXOH@#1(TD-0>W
UW7B7"39`#_!/3B8Y(C?V`*1<';WS,(;9;-LI"8!"&S?O!`VDOSDK,/T4^OZ
5%A4.N`>'(2+^KN//TV12!5+HD><[M6L@1BHOS/XD.FI;'QFGYM03".)@#JQ
]*CY"2]'<L!'<%"B2!*()1`)81(]JH$(DD8F^_"N0*:IWOCEP_3&9_9Q#+CE
ATC".]B#GAR#O`&=/?"9/8K$K6;%$@@AC(=4#[VPLFK:'J21)[K?.ZVOGB?-
-%5FY+'QF7T<XS=N^9%(0K][6@^G&CH@N11.]L\FP#]P$4ZZ/4`-B]A5K+_.
71YKM&[6@/@__=)A>J.MX`3[Y'C0V*5M.Y)_&)H6JB&:B1"(X%1Y&;%,M3?L
=&&X""?A9ES$$@B]-'^:]4Y5//?`P!B<%38N/J6W;ZG/,7[#;]WF3X>=+EH)
J(8TPR?LS>(<3"?^P1D#U(11?=7(`1WU"`H9RV4".`DWN68<1&*VD.OOS[VK
EXFLAN<>$GJ_?6KA!?XFX+?5VFTM58N3!G;2KV"N].<RD)^IU;^^\*@Z*[00
R1^^<H3ZTW>/T<L&F:Q8@[_@)-R$HR!J-3B20,3X#[WP;E6L'H)!J6)T:]=<
O\45^-5-Y1B_Y9QJ[HF"*+^YZ&C%.EEAJRI9`?NR:LT#EQRGQ4R:(;1LX.3#
]K>.UX1Z5R+<A*,@:ELDM$`DP8P2G?WF6MU@K710HC"@C7GJ8;%?R\K-GTFU
"7]!#D3RA6.Z*>KVE202TL(*-#_ZXJ%Z?3/A%VF6#;"?]F&8=R7"33@*5X%<
.PQ""T023`^.&+O2JR!BR(VU.TOI-P&_[=ZN1:G;MY(@-J>._8M'%Y6$X"2!
Y)?_SD@21+"TP?U)/VV.,RWQ`B__2-X0T2E6-`F:<HQ]N#X<E=Y&KVO[(7(;
Y(%GX\\MS@H8BZ?:3*Z1]V&8XF?G'J&'C4"J2NRIHS%ZWS/+]0KM7B(!<LP>
22H!M#U&#P[WSO2:@SOH?)L4S'`4KKK9Q`21!#+SM=7Z71FFB0128DFI9?^<
)+RJ'9";2'#?G$+7GZG!9&Q5.>9[`/(35)7BX6602*3T%)%().'::2RR9P+N
#7]8#\`$DH?#>K36Q`_JNN;:<!2NPMDH""40,?J_K9NQLE\8@E-GQ"%LTK\M
/1))"H4%R;P(Q80KY@P0<L7804+AN%,D68+\!'420`3>&!LEDN"'M&<;>D$(
WJEUH6T8Y`O!Z@^WZ3P'%1P`N\%5.`M,[R$()1`,RWC[66^L-4H<(($(@I*7
4'KEY_J7^K?ID4`D<?NJ!0.Z[:=&#>KL*EXQ*$+]VAW/&?=N"-'L(H%46402
ZMN\Z)\2GO3[B81\18DDK$))?K(&>>&^UXP]1/=<@2!?2%Y>7?YA8!O$#OP.
9Z/,%3$6B"2.06`L.6/Z?``!G'!(1_70Y</5_1./4S\\<T"I?_NQ:TY0O[MX
:.AW1WA!G.[76X.Q*)7'W_D?];5?/:<7-*"7PZ]MPG7M(D'86ZWKFU8-3.#E
..S$T!=$'V1OCH>-)/=\:ZBVUR;K^ED"_U!(P@=3D%X*TP>+SS;\"@P!-H&K
<%8&,+K9PPO&'A8'/O7Z&IU(D\2A\E&##E#3+'&PLC<)LV]<D]Z+>[^W^P4K
?M>EJS:HY.::]CJVV_7D&JRK]-V[7U2GW_*T.N6&IXR'LC]\Q0AU:.]")(D*
TF6?M\^UO8!(().4FGXV"AM)J,M/_OI@?4[:D"H5=KMD3#^=+S^09MD$M_[C
S=!3NK$7G(6[0/)N@M!%X..OKC+JO<(8O(;@MJ\.*CF(__8-L)^J!/W@$,8O
TQRG])!KV0TGD&-^D43N03\Y>>$[D<5TO@?G3+MLF%[O5O:'!?>D9^U7C^^>
)NJ6'T%:D01P+$H>P@(;4Z,P$0>0=$G:&4']B\<61YI6@<_@;EB$$@@AZLV5
FP)[KR`DAJ`4]WME`9#]IQ_=55==*"6]2DA*#4K],'5LOTA"'B0?'#>9[R'7
9^%H63PZ*B",O*S25"1)1Y(L\5'M3G7%9PO5:R](^K`'K^6F^DLU^-0;GU0W
3GM=VRPL\#&<A;MAYXD8"402/7?Q![K^[N<8`=68X_JU+W[SASCOV#[MM6.]
0$8A<9@Z=E";1"!"@52FDZ*2`/EA.<XP(DDKDJ2)+585Y]+/'.S;YI#T88<+
[GA.??Z_9ZO/_-<L=>&4Y[6-XE0#\3W<A</`U`:A(@BKXP7U'I`02([CV[0,
ER'>-1'4QL#I8>K8_`^*)':("+,2"?<C,H85235%$N[%P,^;OW)X<<^>D'21
?^S`ZIB2+]*?Q*!1[`6'P\!(("2<1LX;[VT,#'%D`I)OV?9QZ)XI9O/1=@DR
!,>C]OL'11)!EI$DJDBJ)9)P+SII^.\&28^(0UX-+@C*GRG@+AR&RUYI<2)0
(&+$1:LVJ>5K:XT?*I$(W@5A`DGL-T[LE5IO#?_S2%+>2.(&28=3'*0W*6$(
X"X<ALO`)._&52R>7BY?MT5'!Y.$X^P_SUX62JT@K9)1CN61I')$(O=W$T?2
(.]P%P[#95,$"H0,`!DR;`(20SA[:>EZ=</?=R]N@$%D\T,:):/D@_]Y)-G3
7EE#[IN%.)P0+IODVSB"O+ERDW'T$.!HWB=WV1]>+D42V8*01Y)L(TF6$!]D
+0[R#8?ALBGV_G\6BI\]089N?'"!8CX%_<GR1#0(_(X'-',6KE7_\\)*1?YW
6'_>MT)<X[WWTCT37'LOCY;_IP86QOT__>9:?5^(['5O?,SU*!W>?O\C]9DC
NY1(9;^^?.8_O^&W+RW=H-/IER^.\9X_>E<0.VES`^G@VBO7;U5_F;.L\-TG
W5X0V_%6J&<7K=,C$EHU2\=>2ZQ[C#VZ:_'(;DA>N!Y/H;FF$QQG\0I>$/JE
83T\TR8HES@`]B!/O*+O@I,."DPK,(H@E++O;=BJ#114.CG![W'$\G6UZI+?
S]/]VF-NGJ7[N;,H&;VN+\>B1!+3=;'B@ORD'4FH/O+.%42?-L3FY1`'(+]P
&"[C;Q,8"82GCT'&#@*A#7*10(1+21S&Z976)LEJ72SN%Z=-$I0?(@P%6-H0
/Y1+''9@4],GZKX"$2<0@H,&$@:!1(G(N`[&J83>&CD6-I*`K-;%(C]1(PE#
?H*0Q82I2A$'OH7+<!KXV1`811"ZQKAH$#%-P74P3IR2$?@1.<U(8E!U31Q1
13+^4[UUH>*7GRPF3+'*8;G%`;`C7(;3)C`3R-HM^L*F):LIHCJ]TB))5@AC
+]EWVJ#.GI%.\B<%3IJ8-'VA>FI!816<<HD#D&?L"*=-8"20-9O,'ZR$1521
5$J;)&MXV<L+8B-GU!.B4+WZV@D]=8]9FJ`3H-D^R;T.(JY?3#GM*Q`ATA;+
R#2RPX),.#<W1!5)0XXDE,145Z0WT`M>[RCD&M@.&V++K!#'EG(N520*/C].
^0$NPVGQM1\"(P@$X?E'E)?!D`G.IR3F,X_XO<(YUXX328(,5:F1Q,O)7OL%
]#XADN??6J^6%:L+?K82R#6Q&;8S$8=,+?9+3Q;`#Z2;V:?DG>]LP#1M\`PN
PVFX&81`@6RWZJ^H+2S(2/?VS?5[-YA]]Z"U_4[/?^ZNC[OUBD45B6EO#=>O
M$B"<'$RA*=D8^,S^SCF!X[SDIXPP`8FD4/RCP\>?G%EI&=@20";PQ7L@J!9
QP`^L4SI?1..4^<?WU/;*\A63L!IN!V$0(%LW?&QM87KSB3!K%PRZT<GZ?=N
L*YJ3;_V>O6*NR\^6OW]TF&Z%'![.!5')&ZB<R*)2$+^D@#IA>"\N(?%F5^\
^=-ZXS/[.,9O_!`V+2:1PRX.?(`OW)ZB9P$*OL&]VJB9UYVHTPR/F,G)-.TQ
0PY0O_S&$#5UW)&AW^8%I^%V$#QS+8398)%B_>;MVD`F-\<!5XWMKU<NH>''
=>P;().R4(.;@\.(1/:=7=-=WX]S@]+);^)$DB2Z><DW^9]VV7"]DCF%"`M"
L/&9?1SSLE$4A(T<(@Y\40Y0.!Q\0"MUS\7':%&0-O&1?&;C-16_O&"(CC(4
@'[^YQA<AM-P&\@UW6!<+`0YB1OC`,8,$34$&-N^`1)$"7#UV$/T0@QN&?(2
B1>V[RPDT)1,<2()D\%P1E3@>.K0%!*RVHL3[.,8O^&W09$D"*0Y2N3`!_@B
:P@GX(A]70.[/V3C&"+Y<DT/HX>>80J<1.,FRB2AP,WI`LGDYX=V50=U:NFI
>C>1)(FHD80\LBY65%`H7'!B+UU(R'6=D'3P&WYK7R(H+'9:U10*K6H2!]5O
HJ>LV^MF(R<^;T5XALTDF>;$!$*B6C3=6R\2!TPR1)7HF#[M2RL'NH']E*!/
O+I:/;.P,)_8C<!1$262T(XZZ<@#C.JP;B`_YPX_4'_VLY,<X[><$P4[/_E$
?2O$8@GE%@?@OA0(1_=N9_1\1NPTN&>;4B='4C`62%"]FT0Q9($2.2PXURV"
V,'P>*\^_;C`(6$B"6"%Q1$A"@-`'JDJ'=1I7]6YK?F[2O@MYW!ND)T$DJ;C
^G70[1DO5)HX`'DL\*G\;P\(9!Q.D=XF/Z,A(!KH[WY06]QC!EG*GI*\G`@;
2:1!'09BO];-PX]]DG/"$I<T>I7"E2@.@"_@!-P(`UXS!Y(<*Q<H$!)*U2FH
E.<80GJRN+RCDUA>H.OWEG./T"$UR=`8!1##-))$@=AOZ1JS<4!VR#FF$20(
E2H..``7X(0L:AT$\0_<DZ[XI&!49S$E+M'FWMGOZ,]AB,5J)AB$MDBY16(:
2:(`\E'@K+%(*>^K\+NN'..WG,.Y21!8\E2)XH`#<`%.F$#R0N$\Y9]O%?<F
A\0J]1B7-5,Q-G/0@1!+-C]@D$GG#Z[WD832C:KHU'^]K;]S72_(,7[+.4F4
C)*72HT<<"!(''8^B5^^]=L7]2(A9>O%,JW78>R[9BY1W[82S!P`,B`;\"-9
0X@D4I#,F/>>T0(0_(;?1EFPV0G)0[5&#K&]G4_,J3_G]F?5`W.7&\^,#--&
,6B#-`HU)1-C4Q6XYZFEZK2;GM)"^>V_E^@%B$4P02*I+Y'$SQ'T^/WFB26^
[R7A&+])8D)3)8O#)')(^A$$A08;ZQN,O?5I78"0ES"`TW`[")X"$86V:]G4
NGECW;X(8TSZ[5>NK]71Y/(_OJPN^LT+ZOP[YFH'F8@DBT@B51:YAUL5)DXD
X5R_)^XF`PW##D9T0R6+PS1RD'X*#%YZQ/)++)SQK_FKM8W#Y(7?P64X#;>!
<-T-B;5!G"`A1!+(13<CF<`Q.,A4)&E%$H2`D62HM#Q<XCO[G4(A+Z:11(Q]
:+?6>MB-W,,-)OF*F_<PXB#?(F@^RY8DY+[D*TSD0!SGW#Y7O;-VL_8%!3#<
(GUN>4D*@0+1B6E9&`L4Q5@D7K8H(J%TH91("N2!$:(,8V!LTF_''ZUF7#U"
CZ#E_8GLY[@SKV$C"87"G>./T@,<D^YZ#`-3<0#2^?Z&;9J\#,ID2]+V0`JC
L)%#Q$'Z29.=5V&`'^`RG(;;00@4"(YNOV^X!V)>B"J2V\X;9!GE$^MW\0;L
`4APYM!NZHGK1NJQ20R99KP3(V@9CL%^*?F=I";]II%$CJ4]GR0(0>(0PG",
(?;,LV#NSC^N&*ZN_\*A>DX/@U"32GN<R.$G[K"`TR;#6'P%(HZ7KK,DGE!&
$0D/C&XZYW#K=_%JA'25,O@-TO*$V7E/OK/_WN\=JTD=)Y*P3_[+*.`L(XFD
A_%KC&.C2N(F#IEO,?VJ$7I("@,QF8Y`@<&4!>;T(!Q^%Q>(`_M%C1Q)B`,.
<QWI>'+ZS0DCQG5IVTP;DPPF@2@BP5DG#>RD/POYP@*2.-^9:(=]_PUG'Z;?
L>A6Q2#]U1))*%08Q^8&'JX-[ME6CRNSS[>P;Y2R",=D^:`@L+H*,TS+&3G@
,'F`TR8P$DBW]BUT@SM)1!&)24AT`P8A>IQ^9%<]MP!P+S=(&OC=:4=T]GQ`
%S>2)!&-XX*YV3=;D5FB*6ET;I*?GYP]4`WIU=8UJIKB9^<>7E9Q".`RG#:!
+^M)+.A1%$C2"8TBDBB`C%NW?U**0*;7'VP1PB_?[(\:22B-RRD2VAU']VZK
JU-`?.V$Y(?"Z8RAA;D^87G`^4Q\LD^D<T+LD[8XN!X^A=/`*]\"H[!P<)=6
NM1(JHIE!PG.0B0@[)R*9DWVTL;T*S&C1A+IW2H'R`\"&=Z_,%P_"))VYN[@
J[#@?(G<;LA*'$"J6'#:!$8"Z=JN>:BGZ6&1A4CH7N2U"V%!%8OT^8F$X]$B
27>+J,F3P`2D69;S,<6^S0I5W"0+RBS%(8#+<-H$1A8BO/8[8%_=/9<6TA0)
I3P$E]78N:X?Y/B95BG/(@<F(HD227[UC2&J1P>SNG"2("\4&$QW#@/6->/<
I*J&Y1`''(;+INU9XR*D?Y?6.BS[D20NDA")E_,8[,=[,.3U6Z;7Y%D)(J'-
$.0XCIM&$H"3PDZZB@M*?_S(<PA9/R`(DOYG%JY+[)F(V"9+<9!N\@Z731$H
$#'.(=U:ZVZZM!N6444B`\_\PC\],%?>^W+IFH*@:R,2GKH324`2D:0<P#8F
3[#MD/1C,_*41&>-7#-+<0"X"X?A,C#QB7$$.:1K:]6J>>-$ZY]>"",2(3I/
PW]\UD!-`$CJ!KGF%VZ;H^98I:%`KN&'-"-)%L!O)D^P`>F43=+]G;M>U$1V
JYJ$*33EFEF+`V`#.`R731$H$"$/W6+4665^>MH((Q(!CH<`7J.`Y9KSEW^H
SKAUMCIKTC/JYH?>T,/Q)5]^UZ_F2$)Z3)Y@`](I&V]B8KZ%#"EW$AEQ8.M:
@Q5>Q`;E$`?`QW#8M(L7&$<0NND.VC_<RAIQ$4<DE)9>(J&:@&-IM/_H@=?4
17?^1\](,R%QM442QJ\QCHWQ;$'B$/)28/Q\^D+U]3N>5Z-OGN4I#K!C9\&>
YPP[T)=P]NN70QS2_H##?EW.3A@)1!S*DU205:8`]XHB$DI+KT@BP+&4\IWV
:ZK?2&M*XFJ*)`PU81R;WP((DB8A[\1[7M(O*?WKL\OULQHO(F/;.*-RL^81
$`Z;VM]((&0.L!0FO4%9(ZI(_"*)@&NSA2WI*SV2B,\8/<`X-B](6H2\3'+#
UA0>/%BE.]@M?]C4I$WCO'XYQ"&`NW`8B'V"8%S%`L,.[J`ZM&KJ2[@PH.2U
;W[`H%%$8A))0)22/HE(DC;\^OO=R,OOA;S\]Q)'6I'#E`]A09KA+AP.@U`"
P7@L+8IQXF:`\S$47:^,<"642_O&Z]K\/JU(`KA^UI&D7(A"7H`-TX@<XG<*
$CC!QKW\^&`*SH>S<->OP'"#L4#$F:QV1R;B@`3+W(BA?=KI$:[,TZ"'@?WT
-HA1^&_?`*&?UX]5>R3YYI07?*^;%B1/4<215N3`+A24^!8BLW5LW70//D0%
UY>5&L/8O-$N"\7/OI!,T^U'SP8)]ZJ?!@$B,:OO.U;)R]QM436KGK`ZWDW3
7B\9U4N,W)LT'-.WG9[/8/)$FMX9%I!@F'=0WSW79RE+Q,NX*1$)_[W`2ALL
)F#23L/A.'[F]2/U,QPW0+!1-\W2-G"FE_/93SH?NGQXZ34*?ND#4<@+)'*8
B@.>?&GR,VJYY=.@A2?P(W-OOC^FGQ8&XZ2:6&V@5>NWJKF+UVF;OKAD?:3V
K]@)X3$I3.:]!-E)8!Q!Y(+<8%#/-CH$A@6)I1I%E837L>%4Q$&"`=UO]+8\
>O7QVE!D#.-"`N<&>-_V2TLV!+[(4I!E)`DJ\;A^V'`?%Y*'M"('X/H\A!U^
_1/J/V^OUSQAGKO7]JXE(&H1^)QKPR_LPG7@`^/A'KOF>#WZ&>Y$`6F`LUP;
")=-8!Q!@!CXCL??TJ4E/1VF@#`DE/G>]T\\3N^3Z]DA^R`\I9#)/3`<#W],
^[>SB"2W/[K(=P0T5N?:+!@1-8)`;/Z;1!`YEE;DL(/Q;N^LV:R:-0DN`'A.
PPKT]BG0]CQ(NHFVI][XE%X]T23==L`/"J^+3^GM:R,WA!*(@*K0L3_\IW:<
*9R$")O0I(%(Z.]G4;8@D4!"ZL=A14)!0FGHYLPD!,)^$YO*_JB1(ZA!GC8D
_3S8_<K_GQOH+R>PT;,_.3G4`T)!J%XL`3>JL51/SXTI*(5XP8F0P8]<`@QC
NH4%#D^C=TOVA7EG8A0@#LC+^#,_FTI:HT:.J.+@OJ9;$"1?=-&RR@II,[4I
'(6K4<0!0@M$,D1I"DP2RF\P-@VQ,,`PIEL4X/BX;1(OA'UG8AAP39.27=(8
-7*$J58Y8?=-T&8*"IR!W??3:0O*`Q!N"E=-Q.A$:(%(AGB[4O\NK2(UUBL)
42,)7;34B[,&:30IV>.((T[D2!N-K/I5D)\$<!..AGT3F!V1JE@8GT;5J4=T
UHDU#7=OO+>Q^,D,W">IS0\0(4PD022_F[E$/3$_^!T?20$;DS:3DIWT1!6'
:>2PVS;N9@I^^ZJ5)SH_@C@G]H*C]@Z`L(@D$%$B]6SZIH,,SW$R]=KRC:%F
]'&?I+8@0`C32,)QK[6FT@"-4FQ829'#:=\X6Q"$*XR@X+F*V,,/'(>;<!28
W,<-D7JQ[&"U[;\]MR+0"2B:D,?SC8>O'*'W2<8E\?;O=/&^MN)#ZW-\(CJ[
$OV,9=*[1:\(??C3+ANFERZU7U,^4Q"<?LO3I9XFIVT*(C/KQ>)<NBK3CARF
XJ,7<]FZ+:&Z^;U`OG@^X>4;V<?_L98]><82=%_A&@^C>=X6!Y$%(@FGZ^V,
_YYMO.J)/$6_X\(C/1^4B8-?6VX))(&2FOD0)QW6J?3$W<T1=@0])\E2()_^
Z5/:9FE'CC#BN^".Y]6*#VIU^J.QIP!LRWP2UN>ZZ^*AVC=NX-X3[GY)_7[6
4J,\`6SVX*7#]!*J=O^$163VR0U''MI)1P6ZTX+JA0`A$7%XZ/.WN2MTI*"Q
RX;QF:C#4!:&77=MWUSMWZ9I[(WKI#4*.&U0PJ8ICBAMFC??VZ1]#;DI`*)N
G(_(&%XT^J8"'_`/]V/C,P4PD8,7,L&=H#R1+K@()^$FB"H.$*N*)88C8]^<
^H+G0S$GR`2"P/D].[:TMA9ZRN8;[VY2/)##N5[5FZB0L,NPAKB1),L(\OQ;
ZRLF<CBO;U(@!D&N(WR@UZESF\*ZN1MK=^HGY\`T<LBU[AQWE!ZF$N3C(,2J
O\B-20@KA),P$Y!1Q,0`,B(%)0@E/&3B64/2X@#<$R-74R1!.)44.9S7YW_<
3:XC?'A[]6;-AYD+UNBU`X@:)I%#``?A(IP$<<0!8E?PA6`,0*0$,"U5Q$`T
N#`ZFUM)FR2X=A214,4QZ=W*$G'$D69O6%1P73;A`V()VPD`]^`@7`1^?C5%
;(&(0L<,Z:*'GE.-"1MZQ3AI&=\.[A%%))72)@%QQ)%$Y$@;4;@`Y^`>'(2+
0+@9![$%`L2@5Y]^B*ZO5SJBBJ02(DD<<51BY$@2<`\.!ODR#!)A,PD"=*FQ
,0$F;!3)&E%%0NE+6ZD<B"..:H@<40'7X)SP#P@GXR*QXEZ(=<7G^NOZ(R2J
KR))\IV)IH@CCOH<.>`87(-S<`_X^2\L$A.($(N).U\[H:>N#U8#HH@DJ7<F
FB*...ISY!#`-3AG.NTX#!+UL"1LPNA^>JZY:;=ON1%%)$F\,]$$<<11W]L<
`([!-3@'DO9%XD4@!N<A'*_<PD&57LT21!&)UU"9I!!''`TA<L`M.`;7Y,%O
TDA<(*)@'M0PYBKKM[K&0121I(FHXF@(D0-.P2TXEM1#03>D6HGF5<J]]]^W
*AKL@DH2"?=F8&`>.>H"+L$IN`7'TD1J`L$)S`,F_.&T:C$^J!21K-I0JT?-
F@RU:"B1`Y!6.`6WX%B:?DE-(!+NZ/$Y;T1//<*2H235@J@BD7RW:=%$M6VY
CR9M'/)A,\COAX82.0#V@$MP2E:L%YNG@52K6(+KOWBH'J6Y95O\)22S1%21
`-:$XC72<>$G#K%E0XD<Y!<.P24XE052%PB.H8?A]J\/T8//JJD]`N*()&T(
N5D4K2&(`^[`(;B45J^5$ZD+1,A4TZ^]NOX+A^J97M7D&%"I(F'D:K=VA>4Y
@5MZZH,X`.F%.W`(+DF^TD8F52S)"$L_GG]\3YW1:HHBP$LDE8#M.PI#7ISI
J2_B@"MP!N[`(9"5[3,1B!VW?O4(/:NO&@8T.N$FDDH&)&)*<[6+`Z[`&;B3
-3(5""4:3Y^G7'A4:=&Y:A0)`^.>>'6U>F;A6KW/K6I3;DB:6!GFS96;=)JK
41QP!*[`&;B3M:TS%0@E&AEDF1<:6M7H-`&KK60U6#$.JB&-7I#""*[`&;B3
5=5*D+GU1"0TM'YYP9!2-V:U19(<Z4&X`#?@2):-<B?*4KR(2$X_JJNZ\<N'
Z=X82HM<)#G@`%R`$W`#CI1+'*!L\5<R3/\]_?@\':W6ZE:.Y``'X(+]V4ZY
Q`$JHH)*UQVO+L,P((\D#0_B<S@`%Z0[M]RHF!:<O-\O%TG#@U,<<*%24#$"
`1CFVL\/T+/$&%:0HV$`7^-S?%])X@`5)1#`5%9&I3(Z-6@4:X[JAWTD,KZO
-%2<0`"-,T:G@C"K->:H'N!3?`N"1B*7$Q4I$+KU,-B?OGN,ZM"JJ7Z:6DUS
27+X`U_B4WR+C_$U/J]$5*1`Y#D)BX#=^[UCU<$'M%(;-E??L)0<>P(?XDM\
BF_Q<3F?<P2A(@4"1"2L=33]ZN/5R`$=]:"U'-4-?(@O\6D:ZU@EC8H5"!"1
,#F&U[9==')O/>R9AET>3:H'^`J?X3M\B"]EPE,EBP-4M$"`B`0PW/G7%QZE
![#)2.!<*)4+\0^^PF?X3H:L5X,X0,4+!-@-R43]!RXYKC2G)!^>4KG`-S*7
`Y_)(@N@&L0!JD(@=E#R\.:EAZ\8H:[\7'_=52A=P7DT*3_$#^(7?(2O\)G4
!*H)52<0J7(Q>>:'9PY0]T\\3AW4J64IFN0B*1^PO40-?()O\)%,=*J6J&%'
U0D$B*$Q.MV$](@PA@?@G%PDV0.;8WN`+_")=.&":A0'J$J!""2:T"/"&)Z_
7SJLU!TLU:X<Z0(;TT.%S;$]/L`7U=)+%82J%@BP1Q-FGDV[?+B:_+7!JDO;
YHK%C:5+.!=+<K#;$V%T;]]<VQS;R^P_4.WB`%4O$(%$$_XS=.%1*\1?,J:?
[E[$B=6V8%VE`AMB2WF?/=6I:9<-US:W^Z"^H-X(!(AC<!*+&A/JIU\U0J^G
Q/@?J2/G0@D/>\3`EA>,[*5MBXWM"TC7)W&`>B40@=U)K(;QRV\,43.N+@@%
1^/DO(UB!FR$K;`9G[$AML2FV%90WX0AJ)<"<8+2C7YXNU`82>ILH^2"J6L+
;(.-L)5=&-7Z3",*&H1`*-W$H2(4J@>L\]JQ=5,]FPTB2#NE(0I%\BWM"VR"
;;`1MA)A`&Q97R.&$PU"(,#N4!Q,]8`9;,_?>+*Z<]Q1ZK-'=E%-&A=>ZP4Y
0'T7BSU_4DA@`VR!3;`--I)%VP0-11R@P0C$#GM$X2DOJZ/SU)?>&$K,@=WW
T\>H=S/0#M@G;%'UJ#;8TRQY(6_2<4&>R3LVP!;8!-N`AA0QG&B0`@'.B`*8
GT")^<1U(]4?OW.,[L)DH!WD6K=INVZL\KF1=:I=,)4.TDJ:23MY("]\)F_D
D;R29_*.#4!#C1A.-%B!V"$$$%+PG6$2=&$RT.[!RX:IV\X;I/=1!8%<6VFS
?%*84UW)((VDE323=O)`7L@3>2./['.S00ZK,-QEH?@YAP-N50M>>?#*.QO4
H_-6J2\-Z^$Y*V[%NEHU]M:GU=NK-Y>J*E**`QE82<^0-'Z=X+T>HVZ:56<0
IOT:M!L8%$BUB&<1=DB:7GA[O?K+[&7JM$&=U>$'MM%#0.QP2WN.W<@CB`^$
.)"(#4`P2EPF_DAUQ(]@O#\0(E/7IVHC[1H62:/'*`C\AM]*>T&NP36YMA<D
3:21M))F$8<]/[DX_)%'D(@(*GDY/F_I!O7.FLUJV;HM:JT5>5:NWZJGG6ZQ
-K"Q=J?ZQ06#?2/(=^YZ2;5NWEA_;]&TL7XE=)>VS50'B^P]VK=0!W9LJ0;U
;!.8EEP(T9`+I`R`L#N*C>7.%MF]R,OO5EFB:M]J'ZO]P/M(<I)GC5P@*0.2
VQ&7Y$E?+X<_<H'DR.&#O)&>(X</<H'DR.&#7"`Y<O@@%TB.'#[(!9(29HQG
_--X-:/XW1.+)ZMAC1JI\8$_="#J>5E`IVV8FKRX^-T4CO.,;9@B$A7(Y&%D
R&,;-EF%M5>2*!A;MH(39HPO&'_QY&&V8WMNPR;/\,V;DZ3<:_3\26K1KBEJ
5'&?*R!$WXEJ3O&K,:*>%QN+=]O!RY]N:=/$+Y[GI6B7\T9-V:4639JO1I=3
)'3S)HKIXW:IFDF[%A6_:K#/NI52-;LFU3F0!:;O&L>]ZZ1IT:Y)-;O3LVA2
S:YQT^70I%TU:IQU5A%6VFN*B>9W;GDKG:M1N%_=?7X(^WM!U/.B8_HX5=<6
7C?7-A1?6^DLV2P@S77.$W!..7A30#95K%%3+"%.5^.L\F'B^5E&$DJ\T6IJ
C56:SYZ@^A3W*NO3A-F43@.+W\]28[V*^E%CK:,^L/(VI<ZY?=6`&J7F+RQG
O$P#,]2TJ37JK#$%*_:9<*T:-_6&X&K4XK[J\I+M1ZFQED)"8?%"-;_XL1S(
L`TR2EUN%=MJSOWJD:)1G56;0O2UA7%"JST\2_UTQOC"=PGS=7Y3W#BV^!%U
OQ6S:\X:8Q/';O29,$5-L`[TF3#!IRHT2DW@1RZ0*EI=]%']+-W-6;"H\-66
-IT_Y_<2;/GF0-3S2K#;D6IBR>CZ.N-GF)U7.C9CFE70G*6*^K!`03!'2381
T'@YQUY5ZM-GM^TMOXU6TQT%BL=Y@D4+U)PZ]\T8Q4B2'-RJ6()B54N'6$<X
)7SO/L\9BO<,L]/'236H[F_U=79_V7T_4SBK6#;H:H5UO=V;V^_<J@2._.A[
R/?"L5+UTUD]B71>H0JYQWF3"O\+:3<X3]NO<&S/ZF7AMX4JE_US\;>E:Q:@
_<)]2Q<'P>?);^J<EB'*UXO59X*:O6NV+L'!J#JQMQ!MIDZ3DJU06DV\1;[/
4`L'7%XH]74(KE$#"DOS%JXS?Z&.+(L7IA"<J:[MVD7!HBRGUX4NG:>IL;9\
N:)//R65.\&XZ<5S]#%[R6R#Z7G%R#EU=-V2>;X:8]F<JJ[SO")FW*(FJDGJ
<BGA==4X("^`\^:,4]<6?]AGS%F61^J"!K>E`%4S=?3N:&9PGK575X?'3K-%
P0R1J4`*A-U-Y@**(7;TU.+W`K2QI(X[XQ&E[K$<6_R^>/(T58JY?<:HLRSQ
W%^LM^E[#.RGPWH?ZCHI8M041R\5HE\T0-U0YJ[)`L8IJ]#50I9MMB?3"\+R
*U"\;#FP7Y_">34#K&(L`)9][K$*OCGW/[*[`#,XCU[!:6/]TI\>,A3(#'7+
1-T@*');ZKJ4N)8#G<6Q9<QKQQ$U)JN"'FC@%;X_HL;:2C6KA+EGDE(3^^K2
LN_$@6JZ5')'7:XL?ZBI-WAT#%AUXKKU^02@TSU5W5"&TJXNIJI2`#:$%L&<
!<HM>*F^`U1-G6.+U((YML+.ZSP']#V*!9A&T'FT6^;;HEK&R$8@NE$]VG*9
5:I)CT8QO$YW/BM8O+A$9EU=FCI1+1A;.*?TO9_]#"L"G6\%F%)):;]>03PU
<R:JOLY^>](T;:RCP2B8K^)V0I4:Z39(S];BR3=8MC!'Z/-T5*6*98MD5GX#
JRBCQEH>FJI&VTL-J]HXF:\.X>NTC+M6%U2%JI'C/%=8A>(-%@N*78;&YQF*
+Q58I$H,-*:XI.NV1RM+&IF.S=D0'.?W'10:<<[KU+V=R[U<6GVEAF1QD\;C
GO=P-B3M*/QV][D%V!OX-59CN9">FETUI>MR37LZ;8WCXKXPY^V19IU?^SZO
\QRV<FF8[[G?0K%#I'#,2I_^;%USDFV_M>U)`X_SY.)U.A&R1Z("*0^F6TYP
6`^CN@@@&Q1(5+;;USL@V/()I'R]6`EAQOC1:J*C.K/XD?O50,\G?VFCCQIC
U6\\VSTY0D%7Y>K5<Y#,X:@26)NS>E,.%*I&[L]3<IA!5WF=5;F,D4^YS9'#
!U5?Q<J1(TWD`LF1PP>Y0'+D\$$ND!PY?)`+)$<.'^0"R9'#![E`<N3P02Z0
'#E\D`LD1PX?Y`+)D<,32OT?.O_;P\N2STP`````245.1*Y"8((`

nd

{% endhighlight %}

So, first thoughts are that those words should be `begin` and `end`, so we'll fix those in place. Next, that `664` looks like a file permission, not sure why it's there though. After some googling, and monitoring discussions in discord, I saw that:

> … "it's just an encoding" ...

OK, so that narrows it down. Googling the header format of `begin <permission> <filename>` led to [uuencoding](https://en.wikipedia.org/wiki/Uuencoding). Maybe that is what the "uhuh" is hinting at.

There is a built-in tool called `uudecode` that we can use on the file to decode it. However, this will fail, and not print out much of any data. Looking back at the Wikepedia page, there is a "Encoded format" format section, that specifies:

> Each data line uses the format:
>
> `<length character><formatted characters><newline>`
> `<length character>` is a character indicating the number of data bytes which have been encoded on that line. This is an ASCII character determined by adding 32 to the actual byte count, with the sole exception of a grave accent "`" (ASCII code 96) signifying zero bytes. All data lines except the last (if the data length was not divisible by 45), have 45 bytes of encoded data (60 characters after encoding). Therefore, the vast majority of length values is 'M', (32 + 45 = ASCII code 77 or "M").

Looking at our file, none of the data lines have _any_ consistent length character! If we try shoving an "M" infront of every line, and then running uudecode, we get the flag! I made a little bit in python that does this:

{% highlight python %}
#!/usr/bin/env python3
from PIL import Image
import subprocess

# Read and fix:
with open('enc', 'r') as infile:
    enc = infile.readlines()
# Fix the first line, and so goes to png file
for i, line in enumerate(enc):
    if i == 0:
        enc[i]="b"+enc[i].strip()+".png"+"\n"
    elif i == len(enc)-1:
        enc[i]="e"+enc[i]
    else:
        enc[i]="M"+enc[i]

# Write to file
with open('enc_fixed', 'w') as outfile:
    outfile.write(''.join(enc))

# decode:
# Writes to uhuh.png
subprocess.run(["uudecode enc_fixed"], shell=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
f = Image.open("uhuh.png").show()
{% endhighlight %}

(Take of the PIL lines if you just want to open it manually and don't want to be bothered installing it)

This gives us the png:

&nbsp;
![]({{ site.baseurl }}/img/dawgctf/me_me.png)
&nbsp;

Flag is `DawgCTF{uhuhenc0d3d}`

## Qwerky Qwerty
> Oh no... whays.. ,dats hall.bing yr me... nr br brw ,df M>vv ,df BR<vvvvv Xgy ,day-o ydcovv yd.p. co a bry. cb mf dabeS U.ap bry e.ap jdcnew ydco co rbnf a ep.amvv A ep.am yday dao x..b jago.e xf JRKCE[19v Mabf 'g.oycrbo frg dak.w ,dcn. frg-k. x..b aon..lv D.p.cb ydco bry. nc.o yd. abo,.p frg o..tS Ea,iJYU?L4ydu1be3p+
>
> Author: chris

So we're given some text, and the challenge hints it's a play on the standard [QWERTY](https://en.wikipedia.org/wiki/QWERTY) keyboard layout. Googling around for top alternatives (and already knowing of [Dvorak](https://en.wikipedia.org/wiki/Dvorak_keyboard_layout)) led me to start off with a [Dvorak to QWERTY converter](http://wbic16.xedoloh.com/dvorak.html):

&nbsp;
![]({{ site.baseurl }}/img/dawgctf/qwerty.png)
&nbsp;

Flag is `DawgCTF{P4thf1nd3r}`.

## Let Her Eat Cake!
> She's hungry!
>
> https://clearedge.ctf.umbccd.io/
>
> Author: ClearEdge

Let them eat cake is [a famous French saying](https://en.wikipedia.org/wiki/Let_them_eat_cake), so I figured the text was a French cipher. Notably, starting with the obvious, [Vigenère cipher](https://en.wikipedia.org/wiki/Vigen%C3%A8re_cipher). Pasting the text into an [online Vigenère decipher tool](https://www.dcode.fr/vigenere-cipher):

&nbsp;
![]({{ site.baseurl }}/img/dawgctf/eatcake.png)
&nbsp;

Flag is `DawgCTF{ClearEdge_crypto}`.
