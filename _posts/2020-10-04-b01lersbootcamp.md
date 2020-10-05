---
author: george_pick
layout: post
title: "b01lers bootcampCTF writeups 2020"
excerpt: "Writeups for various challenges I solved during the 2020 b01lers bootcamp capture the flag competition"
categories: [Capture The Flag]
---

> Welcome to b01lers bootcamp CTF! b01lers CTF bootcamp is a brand-new super-introductory CTF for beginners. It is also a training camp! Check out the training at https://ctf.b01lers.com, join our Discord, and learn, then come back to compete!

Be sure to check out my [Crypto World specific writeup](https://bigpick.github.io/TodayILearned/articles/2020-10/cryptoworld-b01lersbootcamp) for the tasks related to that sub-world as part of this CTF!

## Solved

| Crypto                            | Crypto World          | Misc                                          | Web |
|-----------------------------------|-----------------------|-----------------------------------------------|-----|
| [Dream Stealing](#dream-stealing) | [See dedicated page](https://bigpick.github.io/TodayILearned/articles/2020-10/cryptoworld-b01lersbootcamp)| [Echoes of Reality](#echoes-of-reality)       | [Find That Data](#find-that-data)     |
| [Clear the Mind](#clear-the-mind) |                       | [Granular Data](#granular-data)               | [Programs Only](#programs-only)    |
| [Totem](#totem)                   |                       | [Needle in a Haystack](#needle-ina-a-haystack)| [Reindeer Flotilla](#reindeer-flotilla)    |
| [Train of Thought](#train-of-thought)       |                       | [Zima Blue](#zima-blue)                       | [First Day Inspection](#first-day-inspection)    |
|                                   |                       | [Troll Hunt](#troll-hunt)                     |     |
|---

# Crypto
## Dream Stealing
> I've managed to steal some secrets from their subconscious, can you figure out anything from this?
>
> (attached: `ciphertext.txt`)

We're given:

```
Modulus: 98570307780590287344989641660271563150943084591122129236101184963953890610515286342182643236514124325672053304374355281945455993001454145469449640602102808287018619896494144221889411960418829067000944408910977857246549239617540588105788633268030690222998939690024329717050066864773464183557939988832150357227
One factor of N:  9695477612097814143634685975895486365012211256067236988184151482923787800058653259439240377630508988251817608592320391742708529901158658812320088090921919
Public key: 65537
Ciphertext: 75665489286663825011389014693118717144564492910496517817351278852753259053052732535663285501814281678158913989615919776491777945945627147232073116295758400365665526264438202825171012874266519752207522580833300789271016065464767771248100896706714555420620455039240658817899104768781122292162714745754316687483
```

So it looks like RSA, where we are given N, one factor of it (i.e either `p`, or `q`, your choice), e, and a ciphertext.

Since we're given N and one of it's factor, finding the other is easy, just divide N by the one given factor to get the other:

{% highlight python %}
>>> N = 98570307780590287344989641660271563150943084591122129236101184963953890610515286342182643236514124325672053304374355281945455993001454145469449640602102808287018619896494144221889411960418829067000944408910977857246549239617540588105788633268030690222998939690024329717050066864773464183557939988832150357227
>>> p = 9695477612097814143634685975895486365012211256067236988184151482923787800058653259439240377630508988251817608592320391742708529901158658812320088090921919
>>> q = N // p
>>> q
10166627341555233885462189686170129966199363862865327417835599922534140147190891310884780246710738772334481095318744300242272851264697786771596673112818133
{% endhighlight %}

Now that we have p and q, we can simply proceed to finding the private exponent, d, via the Extended Euclidean algorithm:

{% highlight python %}
def egcd(a, b):
    x,y, u,v = 0,1, 1,0
    while a != 0:
        q, r = b//a, b%a
        m, n = x-u*q, y-v*q
        b,a, x,y, u,v = a,r, u,v, m,n
        gcd = b
    return gcd, x, y

# Compute modular inverse of e
gcd, d, b = egcd(e, phi)
print("d:  " + str(d) );
{% endhighlight %}

Which we can then use to decrypt like so:

{% highlight python %}
# Decrypt
pt = pow(ct, d, N)
print("Plaintext: ", pt)
{% endhighlight %}

A full python snub to do so [can be found here, in part of my "Go To" CTF tools repository](https://github.com/bigpick/CaptureTheFlagCode/blob/master/tools/crypto/normal_rsa_python/normal_rsa.py) (minor modifications for this case required, hard code in p and then compute q and phi manually, vs the FactorDB code).

The code gives us:

> Plaintext:  46327402297734345668136112664627609061622411859278517910287191659094499226493

Which after translating to ascii, gives us our flag:

```
decimal_to_ascii 46327402297734345668136112664627609061622411859278517910287191659094499226493
flag{4cce551ng_th3_subc0nsc10us}
```

Protip: If you use zsh, add this function to your `~/.zshrc` (otherwise add it to your shell's appropriate user config file):

{% highlight bash %}
function decimal_to_ascii(){ local decimal=$1
    echo "obase=16; $decimal" | bc  | xxd -r -p; echo ""
}
{% endhighlight %}

Flag is `flag{4cce551ng_th3_subc0nsc10us}`.


## Clear the Mind
> They've gotten into your mind, but haven't managed to dive that deep yet. Root them out before it becomes an issue.
>
> (attached: clearthemind.txt)

We're given:

```
n = 102346477809188164149666237875831487276093753138581452189150581288274762371458335130208782251999067431416740623801548745068435494069196452555130488551392351521104832433338347876647247145940791496418976816678614449219476252610877509106424219285651012126290668046420434492850711642394317803367090778362049205437

c = 4458558515804625757984145622008292910146092770232527464448604606202639682157127059968851563875246010604577447368616002300477986613082254856311395681221546841526780960776842385163089662821

e = 3
```

So, this time, it is RSA, but with a poor public exponent (`e = 3`). We can crack this by simply [taking the cube root](https://github.com/bigpick/CaptureTheFlagCode/blob/master/tools/crypto/rsa_unpadded_small_e/unpadded_rsa_e3_cube_root_attack.py), assuming that it is unpadded.

{% highlight python %}
#!/usr/bin/env python3

# Inspired by / taken from:
#  https://baotdvi.wordpress.com/2018/11/28/safe-rsa-picoctf-2018/

import gmpy2
import binascii

N = 102346477809188164149666237875831487276093753138581452189150581288274762371458335130208782251999067431416740623801548745068435494069196452555130488551392351521104832433338347876647247145940791496418976816678614449219476252610877509106424219285651012126290668046420434492850711642394317803367090778362049205437
ct = 4458558515804625757984145622008292910146092770232527464448604606202639682157127059968851563875246010604577447368616002300477986613082254856311395681221546841526780960776842385163089662821
e = 3

with gmpy2.local_context(gmpy2.context(), precision=300) as ctx:
    cube_root = gmpy2.cbrt(ct)
    print(f"Cube root: {cube_root}")
    hex0 = str(hex(int(cube_root)))
    print(f"Hex: {hex0}")
    ascii_ = binascii.unhexlify(str(hex0)[2:len(hex0)]).decode()
    print(f"Plaintext: {ascii_}")
{% endhighlight %}

Which running, gives us:

```
python cube.py
Cube root: 164587995846552213349276905669580061809447554828318448024777341.000000
Hex: 0x666c61677b77335f6e6565645f376f5f67305f6433657033727d
Plaintext: flag{w3_need_7o_g0_d3ep3r}
```

Flag is `flag{w3_need_7o_g0_d3ep3r}`.

## Train of Thought
> We've managed to infiltrate Mr. Levenshtein's subconscious, but he keeps losing his train of thought! Sort out the noise and find the flag in this mess.
>
> Wrap the decrypted string in flag{xxxxxxxxx} for submission

After starting at this for a while, I finally began to question why they mentioned _Mr. Levenshtein_ in the challenge description. A quick Google search for just this name yields ["Levenshtein distance"](https://en.wikipedia.org/wiki/Levenshtein_distance).

With this finally in mind, I thought to take the Levenshtein distance between each word. We get a decimal digit 1-26 for each of the various distances, which seems suspiciously like alphabet indices.

For this, I used the following PyPI package for Levenshtein: [python-levenshtein](https://pypi.org/project/python-Levenshtein/).

We can just take the indicies out of the alphabet after subtracting one, like so:

{% highlight python %}
>>> from string import ascii_lowercase as alphabet
>>> words = "dream dreams fantasticalities a neuropharmacologist neuropharmacy neuroharmacy psychopathologic oneirologic dichlorodiphenyltrichloroethane dichlorodiphenyltrichloroe chlorophenyltrichloroe chloromethanes fluorines cytodifferentiated differentiated"
>>> for i in range(len(words)-1):
...   first = words[i]
...   second = words[i+1]
...   distance = Levenshtein.distance(first, second)
...   print(alphabet[distance-1], end='')
...
anorganizedmind
{% endhighlight %}

Flag is `flag{anorganizedmind}`.

## Totem
> Is this a dream or not? Use your totem to find out. Flag format: ctf{}.
>
> `nc chal.ctf.b01lers.com 2008`

We're also given a template to get started, but I didn't bother using that, since I'm not a _total_ n00b.

Connecting to the endpoint, we get a game that gives us the encryption method, and the ciphertext, and asks us for the original plaintext:

```
nc chal.ctf.b01lers.com 2008
Method: rot13
Ciphertext: jbeyq
Input: world
Method: Base64
Ciphertext: c3Vycm91bmQ=
Input: c3Vycm91bmQ=
Hm that doesn't seem quite right we must be awake.
```

After playing around manually to try to find all possible encryptions, I found the following to be possible:

1. [ROT13](https://rot13.com/)
2. [base64](https://www.base64decode.org/)
3. [atbash](https://en.wikipedia.org/wiki/Atbash)
4. [Baconian](https://en.wikipedia.org/wiki/Bacon%27s_cipher)

From the template, we can expect there to be `1000` total rounds. With this knowledge, we can code something up in Python that just repeatedly receives and then solves the challenge (creds for the baconian/atbash cipher in comments):

{% highlight python %}
#!/usr/bin/env python3.8
from pwn import *
import sys
from base64 import b64decode

atbash_cipher = {'A': 'Z', 'a': 'z', 'B': 'Y', 'b': 'y', 'C': 'X', 'c': 'x', 'D': 'W', 'd': 'w', 'E': 'V', 'e': 'v', 'F': 'U', 'f': 'u', 'G': 'T', 'g': 't', 'H': 'S', 'h': 's', 'I': 'R', 'i': 'r', 'J': 'Q', 'j': 'q', 'K': 'P', 'k': 'p', 'L': 'O', 'l': 'o', 'M': 'N', 'm': 'n', 'N': 'M', 'n': 'm', 'O': 'L', 'o': 'l', 'P': 'K', 'p': 'k', 'Q': 'J', 'q': 'j', 'R': 'I', 'r': 'i', 'S': 'H', 's': 'h', 'T': 'G', 't': 'g', 'U': 'F', 'u': 'f', 'V': 'E', 'v': 'e', 'W': 'D', 'w': 'd', 'X': 'C', 'x': 'c', 'Y': 'B', 'y': 'b', 'Z': 'A', 'z': 'a', ' ': ' ', '.': '.', ',': ',', '?': '?', '!': '!', '\'': '\'', '\"': '\"', ':': ':', ';': ';', '\(': '\)', '\)': '\)', '\[': '\[', '\]': '\]', '\-': '\-', '1': '1', '2': '2', '3': '3', '4': '4', '5': '5', '6': '6', '7': '7', '8': '8', '9': '9', '0': '0'}

def rot_alpha(n):
    from string import ascii_lowercase as lc, ascii_uppercase as uc
    lookup = str.maketrans(lc + uc, lc[n:] + lc[:n] + uc[n:] + uc[:n])
    return lambda s: s.translate(lookup)

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

# https://www.geeksforgeeks.org/baconian-cipher/
def decrypt_bacon(message):
    lookup = {'A':'aaaaa', 'B':'aaaab', 'C':'aaaba', 'D':'aaabb', 'E':'aabaa',
        'F':'aabab', 'G':'aabba', 'H':'aabbb', 'I':'abaaa', 'J':'abaab',
        'K':'ababa', 'L':'ababb', 'M':'abbaa', 'N':'abbab', 'O':'abbba',
        'P':'abbbb', 'Q':'baaaa', 'R':'baaab', 'S':'baaba', 'T':'baabb',
        'U':'babaa', 'V':'babab', 'W':'babba', 'X':'babbb', 'Y':'bbaaa', 'Z':'bbaab'}

    decipher = ''
    i = 0

    # emulating a do-while loop
    while True :
        # condition to run decryption till
        # the last set of ciphertext
        if(i < len(message)-4):
            # extracting a set of ciphertext
            # from the message
            substr = message[i:i + 5]
            # checking for space as the first
            # character of the substring
            if(substr[0] != ' '):
                '''
                This statement gets us the key(plaintext) using the values(ciphertext)
                Just the reverse of what we were doing in encrypt function
                '''
                decipher += list(lookup.keys())[list(lookup.values()).index(substr)]
                i += 5 # to get the next set of ciphertext

            else:
                # adds space
                decipher += ' '
                i += 1 # index next to the space
        else:
            break # emulating a do-while loop

    return decipher

def main():
    r = remote('chal.ctf.b01lers.com', 2008)
    i = 0
    while 1 < 2:
        print("=== ", i)
        method = r.recvline().decode().strip().split()[-1]
        ct = r.recvline().decode().strip().split()[-1]
        plaintext = ""
        if method == "atbash":
            for char in ct:
                plaintext += atbash_cipher[char]
            r.sendafter('Input: ', plaintext+'\n')
        elif method == "rot13":
            r.sendafter('Input: ', rot_alpha(13)(ct)+'\n')
        elif method == "Base64":
            r.sendafter('Input: ', b64decode(ct).decode()+'\n')
        elif method == "bacon":
            r.sendafter('Input: ', decrypt_bacon(ct.lower()).lower()+'\n')
        i += 1
        if i == 1000:
            print(r.stream())
            sys.exit(0)

if __name__ == '__main__':
    main()
{% endhighlight %}

Which after running, gives us the flag:

```
...
===  993
===  994
===  995
===  996
===  997
===  998
===  999
We must be dreaming, here's your flag: ctf{4n_313g4nt_s01ut10n_f0r_tr4cking_r341ity}
b"We must be dreaming, here's your flag: ctf{4n_313g4nt_s01ut10n_f0r_tr4cking_r341ity}\n"
```

Flag is `ctf{4n_313g4nt_s01ut10n_f0r_tr4cking_r341ity}`

---

# Misc
## Echoes of Reality
> Something's wrong with this mirror, it's making strange sounds... can you figure out what it's saying?
>
> (attached: echoesofreality.wav)

We're given an audio file. It is a low point CTF question. More than likely it is just a simple spectrogram problem (which it was). Open up in Sonic Visualizer, Audacity, w/e and enable the Spectrogram view (in Sonic Visualizer, Layer -> Add Spectrogram):

![]({{ site.baseurl }}/img/b01lers_bootcamp2020/echoes.png)

Flag is `flag{b3h1Nd_tH3_l0oK1nG_gl4s5}`.

## Granular Data
> A disgruntled ex-employee of Granular is the prime suspect behind recent killings in the nation. We've received his manifesto, which included this photo of him. Is there anything here that could help us figure out his location?
>
> (attached: GarrettScholes.png)

We're given a simple PNG photo, whose appearance doesn't matter to solving this problem. The description suggests we need to look for _location_, which is sometimes a field in an image file that can be seen in it's metadata. Use `exiftool` to inspect the image:

```
exiftool GarrettScholes-df317e3519426b22c71c81e87aed2412.png
ExifTool Version Number         : 11.91
File Name                       : GarrettScholes-df317e3519426b22c71c81e87aed2412.png
Directory                       : ../..
File Size                       : 86 kB
File Modification Date/Time     : 2020:10:04 17:51:54-04:00
File Access Date/Time           : 2020:10:04 17:51:56-04:00
File Inode Change Date/Time     : 2020:10:04 17:51:55-04:00
File Permissions                : rw-r--r--
File Type                       : PNG
File Type Extension             : png
MIME Type                       : image/png
Image Width                     : 400
Image Height                    : 400
Bit Depth                       : 8
Color Type                      : RGB with Alpha
Compression                     : Deflate/Inflate
Filter                          : Adaptive
Interlace                       : Noninterlaced
XMP Toolkit                     : Adobe XMP Core 6.0-c002 79.164460, 2020/05/12-16:04:17
Authors Position                : Software Engineer
Creator                         : Garrett Scholes
Title                           : Cute Selfie
Creator City                    : flag{h4t3d_1n_th3_n4t10n_0MTBu}
Creator Country                 : United Kingdom
Image Size                      : 400x400
Megapixels                      : 0.160
```

Flag is `flag{h4t3d_1n_th3_n4t10n_0MTBu}`.

## Needle In A Haystack
> Can you find the needle?
>
> Haystack Link: https://mega.nz/file/5qBR3a7Z#VS7Uz6l2Jr1ZXcckQQaMvzMzuljpJsrfdfOFqSIfNSs

We're given a link to a `Haystack.zip`, whose size when unzipped is `12 KiB`. The contents of which are 400 various text files:

{% highlight bash %}
ls NeedleInAHayStack | wc -l
     400
{% endhighlight %}

Use `grep` to look for the flag syntax:

{% highlight bash %}
grep -r 'flag{' ./NeedleInAHayStack
./NeedleInAHayStack/haystack269.txt:Fo1gQaT1DgTzK3BO+xkuAIRHKflag{y0u_f0unD_Th3_n33d1e!}
{% endhighlight %}

Flag is `flag{y0u_f0unD_Th3_n33d1e!}`.

## Zima Blue
> The mysterious artist Zima has unveiled his latest piece, and once again, it features his signature shade of blue. I honestly don't get it. Is he hiding a message in his art somehow?
>
> (attached: zimablue.png)

We're given:

![]({{ site.baseurl }}/img/b01lers_bootcamp2020/zimablue.png){:height="60%" width="60%"}

The description hints we need to find some sort of hidden data in the image:

>  it features his signature shade of blue. I honestly don't get it. Is he hiding a message in his art somehow?

[Stegsolve](https://github.com/zardus/ctf-tools/tree/master/stegsolve) is great to fire up and just quickly thumb through the possiblities for these types of challenges:

```
java -jar ./Stegsolve.jar
```

We can see the flag in a few of the different color bit planes, here is Blue 3:

![]({{ site.baseurl }}/img/b01lers_bootcamp2020/zimablue_flag.png)

Flag is `flag{t3ll_by_th3_p1x3ls}`.

## Troll Hunt
> We've identified a malicious troll who may be linked to a ransomware-esque virus. They've been making posts using the hashtag "#shrive". For now, just sift through the irrelevant junk and try to find another one of their accounts.

OK - last Misc challenge sounds like some OSINT. All we have to go off of is the hashtag, `#shrive`, and that the content associated with it has something to do with "ransomware-esque virus".

Searching Twitter for the keywords "`#shrive`" and "`malware`" leads us to [this result page](https://twitter.com/search?q=%23shrive%20malware&src=typed_query).

![]({{ site.baseurl }}/img/b01lers_bootcamp2020/shrive_search.png){:height="60%" width="60%"}

That sounds like who we're looking for. Examining Twitter user [@V760DHM](https://twitter.com/V760DHM) profile, we see a few tweets about related information.

Since we had to "find another one of their accounts", I tried running the username through [namechk](https://namechk.com/) but that didn't get any results.

Scrolling through the twitter page more, we find one Tweet about an Imgur link, _[way at the bottom of the profile](https://twitter.com/V760DHM/status/1311551737380179968)_.

![]({{ site.baseurl }}/img/b01lers_bootcamp2020/imgur_cake.png){:height="60%" width="60%"}

BUT, notice the username on the Imgur profile; it's the same as the twitter one! Searching through that [Imgur profile](https://imgur.com/user/v760dhm), there's only one other photo: the troll meme face. Inspecting that photo, we see the flag in the comments.

Flag is `flag{shu7_up_4nd_d4nc3_G5jM30}`.

---

# Web
## Find That Data!
> Complete what Clu could not... Find the data in memory. https://www.youtube.com/watch?v=PQwKV7lCzEI
>
> http://chal.ctf.b01lers.com:3001

Navigating to the site:

![]({{ site.baseurl }}/img/b01lers_bootcamp2020/data_home.png){:height="60%" width="60%"}

Inspecting that page's source code, we see the following script in the HTML:

{% highlight html %}
    <script>
      function login(username, password) {
        if (username == "CLU" && password == "0222") {
          window.location = "/maze";
        } else window.location = "/";
      }
    </script>
{% endhighlight %}

So we can try logging in with `CLU` and pw `0222`.

Once logged in, we get an interactive maze page:

![]({{ site.baseurl }}/img/b01lers_bootcamp2020/maze.gif){:height="60%" width="60%"}

So, the goal is to get to the bottom left. However, as you can see in the above GIF, that will be impossible, since the barrier never moves off the corner.

We can inspect the maze's source code by inspecting the `js/maze.js` file. The file has a bunch of stuff that's just needed to make the maze possible, but the important function to us is the following:

{% highlight js %}
function check_data() {
  if (x === 1 && y === maxRows) {
    $.post("/mem", { token: $("#token").html() }).done(function(data) {
      alert("Memory: " + data);
    });
  }
}
{% endhighlight %}

Basically, it says that if our x position is 1 (i.e the far left), and our y position is the max (i.e the bottom), it writes what we imagine is the flag out as an alert.

However, we can just cheese this by directly calling this function with these values hardcoded in the console in dev tools, via `check_data(x=1,y=maxRows)`.

![]({{ site.baseurl }}/img/b01lers_bootcamp2020/maze_cheese.png)

Flag is `flag{you_aren't_making_me_talk!}`.

## Programs Only
> You don't have to be lonely at Programs Only dot com
>
> http://chal.ctf.b01lers.com:3003

Navigating to the site, we see a page that displays our User-Agent string in the webpage, along with some other just random pages.

Searching around, nothing really sticks out. In the source code, we see the following HTML comment:

{% highlight html %}
        <!--
        <div>
          <a href="/program">
            <h2>Program's Only</h2>
            <img src="/static/img/programs_only.jpg" alt="00101010" />
          </a>
        </div>
        -->
{% endhighlight %}

Navigating to `/program`, we get:

> Unauthorized.  
> Users do not have access to this resource.

Combining that with the home page displaying our User-agent, we probably need to modify our User-Agent to match some "Program" requirement.

Checking robots.txt (as you always should for low level web challenges), we see:

```
User-agent: *
Disallow: /

User-agent: Program
Allow: /program/

User-agent: Master Control Program 0000
Allow: /program/control
```

So we can hit those pages with the above User-Agents like so:

{% highlight bash %}
curl -H "User-agent: Program" http://chal.ctf.b01lers.com:3003/program
curl -H "User-agent: Master Control Program 0000" http://chal.ctf.b01lers.com:3003/program/control
{% endhighlight %}

The second ends up having our flag:

{% highlight html %}
<!DOCTYPE html>
<html>
  <head>
    <title>Master Control.</title>
    <link
      rel="stylesheet"
      href="/static/css/tron.css"
    />
    <link
      rel="stylesheet"
      href="/static/css/style.css"
    />
  </head>
  <body>
    <div id="main-wrapper">
      <div class="content-page">
        <div>
          <h1>Master Control.</h1>
        </div>
        <div>

          <p>flag{who_programmed_you?}
</p>
        </div>
      </div>
    </div>
  </body>
</html>
{% endhighlight %}

Flag is `flag{who_programmed_you?}`.

## Reindeer Flotilla
> It's time to enter the Grid. Figure out a way to pop an alert() to get your flag.
>
> http://chal.ctf.b01lers.com:3006

The website is just a simple page that echos back whatever we input in a text field.

From the description, we need to execute XSS. However, `<alert>` is blocked and not able to be entered into the box. Google searching for XSS alternative payloads to circumvent filtering, we find this [XSS filter evasion cheat sheet](https://owasp.org/www-community/xss-filter-evasion-cheatsheet).

In the page, we find the following payload:

```
\<a onmouseover="alert(document.cookie)"\>xxs link\</a\>
```

We are allowed to post this in the box, and when moused over, successfully triggers the XSS dumping the cookies (followed by our flag).

![]({{ site.baseurl }}/img/b01lers_bootcamp2020/xss_flag.png){:height="60%" width="60%"}

Flag is `flag[y0u_sh0uldnt_h4v3_c0m3_b4ck_flynn]`.

## First Day Inspection
> It's your first day working at ENCOM, but they're asking you to figure things out yourself. What an onboarding process... take a look around and see what you can find.
>
> http://chal.ctf.b01lers.com:3005

Navigating to the site, we just see a mostly blank page, other than the text:

```
      ENCOM
WELCOME EMPLOYEE
ASSEMBLE THE KEY
```

Hm... OK. `/robots.txt` doesn't exist.

Viewing home page source we find the following in the code:

{% highlight html %}
<!-- (1/5): flag{ -->
{% endhighlight %}

OK, so seems like we need to find the remaining four pieces of the flag, throughout the site's internal somehow. Probably will be lots of examining source / using Chrome Dev Tools.

In the home page, there is a referenced `styles.css` and `script.js`. Examining the CSS file, we find part 3:

{% highlight css %}
/* (3/5): 0m3_ */
{% endhighlight %}

And examining the JS file, we find part 4:

{% highlight js %}
// (4/5): t0_E
{% endhighlight %}

Next, I went to check the cookies, and found part 2 of the flag sitting as an error message in the web console, as output from script.js:

```
2/5): w3lc
(anonymous) @ script.js:4
```

OK, one part left! The cookies didn't end up containing anything useful, so that was a dead end.

However, searching the Storage, specifically the "Local Storage" tab under Chrome Dev Tools, we can find the last part:

```
Key     Value
(5/5)   NC0M}
```

So putting it all together, flag is `flag{w3lc0m3_t0_ENC0M}`.
