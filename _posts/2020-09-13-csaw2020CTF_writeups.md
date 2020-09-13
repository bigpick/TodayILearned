---
author: george_pick
layout: post
title: "csawCTF 2020"
excerpt: "Writeups for various challenges I solved during the 2020 CSAW capture the flag competition."
categories: [Capture The Flag]
---

Just three for this week -- I won't bother writing up the challenges I worked on but didn't full solve before my teammates (Slithery, another Python jail escape, using Pythons reverse string slicing to circumvent string blacklisting; ezbreezy, a reversing challenge with a random segment that required manual piecing back together that revelaed the flag one char at a time once pieced together)

| Web | Crypto |
|-----|--------|
| [Widthless](#widthless) | [Perfect Secrecy](#perfect-secrecy) |
| | [modus_operandi](#modus_operandi) |
|---

# Web

## Widthless
> Welcome to web! Let's start off with something kinda funky :)
>
> http://web.chal.csaw.io:5018

Looking at the site, we find a comment that says "`<!-- zwsp is fun! -->`" so theres a good chance we should be on the look out for [Zero Width space characters](https://en.wikipedia.org/wiki/Zero-width_space).

At the very bottom of the HTML page, we find some!

![]({{ site.baseurl }}/img/csaw2020/zwsp-source.png){:height="70%" width="70%"}

Doing a quick google search for some ZWSP stego, we come across [this previous CTF writeup](https://ctftime.org/writeup/11321), as well as the site it mentions, [Unicode Steganography with Zero-Width Characters](https://330k.github.io/misc_tools/unicode_steganography.html).

Following a similar approach to that writeup, we can load up our zerowidth space character string locally and decode it using that same linked [javascript page](http://330k.github.io/misc_tools/unicode_steganography.js).

* Store that `unicode_steganography.js` file locally.
* Have nodejs/node installed
* Have a file that contains just our ZWSP characters (I just cut and paste the last line from the webpage's HTML, and removed the `</html>` tag.

Then, we can load it up locally:

{% highlight js %}
$ node
Welcome to Node.js v12.18.3.
Type ".help" for more information.
> var fs = require('fs');
> zwsp=fs.readFileSync('widthless2.html', 'utf8')
'​​​​‎‏‎​​​​‌‍‏​​​​‎‍‏​​​​‎‍‍‍​​​​‏‏​​​​​‏‎​​​​‎​‍​​​​‍‏‍​​​​‎​‎​​​​‏‎​​​​‎‍‎​​​​‏‏‍​​​​‍‏‏​​​​‏​‍​​​​‎​‍​​​​‍​​​​​‏‍​​​​‍‍‍​​​​‌‍‏\n'
> const stego = require("./unicode_steganography.js").unicodeSteganographer;
undefined
> stego.setUseChars('\u200b\u200c\u200d\u200e\u200f');
null
> console.log(stego.decodeText(zwsp));
{ originalText: '\n', hiddenText: "b'YWxtMHN0XzJfM3o='" }
{% endhighlight %}

Sweet!! So now we can base64 that hidden data:

{% highlight bash %}
echo YWxtMHN0XzJfM3o= | base64 -d; echo
alm0st_2_3z
{% endhighlight %}

But wait! That's not the flag, it doesn't get accepted :\ Nor does any sort of `flag{}` wrapping.

Hm... so what else is on the site? Reading through, theres not really anything else interesting in the source... There is a newsletter signup box though, so maybe we can exploit that. Trying some values (plain text strings, names, bash commands, etc...) all just return:

> Whoops, couldn't add, sorry!

On a whim, I tried the plaintext we got above, and lo and behold, we got something!

![]({{ site.baseurl }}/img/csaw2020/hidden1.png){:height="70%" width="70%"}

It reads:

> `/ahsdiufghawuflkaekdhjfaldshjfvbalerhjwfvblasdnjfbldf/<pwd>`

Which seems like a URL path. At first, I thought `<pwd>` was in relation to the bash directory, so I spent some time spinning through things based on that. Eventually, I realized (thanks to my m8 [Redjohn](https://github.com/redjohn):) ) that it probably meant pwd as in _password_.

I tried some command "flag"/"secret"/ etc values for the password, before I tried using the plaintext we entered into the newletter box, which ultimately ended up working.

* http://web.chal.csaw.io:5018/ahsdiufghawuflkaekdhjfaldshjfvbalerhjwfvblasdnjfbldf/alm0st_2_3z

Which now brings us to a similar (but definitely different) webpage:

![]({{ site.baseurl }}/img/csaw2020/hidden2-home.png){:height="70%" width="70%"}

So, formatting seems a bit _off_. Inspecting the source, we find more ZWSP characters, this time littered throughout the page (instead of just at the very bottom of the page). We can use the same method as above, this time just reading the whole file:

{% highlight js %}
> var fs = require('fs');
> zwsp=fs.readFileSync('widthless2.html', 'utf8')
...
> const stego = require("./unicode_steganography.js").unicodeSteganographer;
undefined
> stego.setUseChars('\u200b\u200c\u200d\u200e\u200f');
null
> console.log(stego.decodeText(zwsp));
...
    '\n' +
    '     </div> \n' +
    '     </body> \n' +
    '\n' +
    ' </html>\n',
  hiddenText: '755f756e6831645f6d33'
}
{% endhighlight %}

And look at that, we got some nice hidden hex! Putting that into text, it reads `u_unh1d_m3`.

Paste it into the newsletter search bar yet again, and this time we get:

> `/19s2uirdjsxbh1iwudgxnjxcbwaiquew3gdi/<pwd1>/<pwd2>`

So, we can navigate to that page, and see what's there (it's the flag!)

So the flag ends up at this final URL:
* http://web.chal.csaw.io:5018/19s2uirdjsxbh1iwudgxnjxcbwaiquew3gdi/alm0st_2_3z/u_unh1d_m3

Which is just a simple empty HTML page with the flag text.

Flag is `flag{gu3ss_u_f0und_m3}`.

# Crypto

## Perfect Secrecy
> Alice sent over a couple of images with sensitive information to Bob, encrypted with a pre-shared key. It is the most secure encryption scheme, theoretically...

Given two images:

![]({{ site.baseurl }}/img/csaw2020/image1.png){:height="70%" width="70%"}

and

![]({{ site.baseurl }}/img/csaw2020/image2.png){:height="70%" width="70%"}

XOR the two images, and store the result in a file:

{% highlight python %}
#!/usr/bin/env python3
# I've hidden two cool images by XOR with the same secret key so you can't see them!
#
# lemur.png
#
# flag.png
import numpy as np
from PIL import Image, ImageChops

def main():
    # Open images
    im1 = Image.open("perfectsecret/image1.png")
    im2 = Image.open("perfectsecret/image2.png")

    assert(im1.size == im2.size)
    width, height = im1.size
    image3 = Image.new('RGB', (width, height))

    for row in range(0, height):
        for col in range(0, width):
            color1 = im1.getpixel((col, row))
            color2 = im2.getpixel((col, row))
            color = color1 ^ color2
            image3.putpixel((col, row), (color))

    image3.save('result.png')
    image3.show()


if __name__ == '__main__':
    main()
{% endhighlight %}

Which gives us:

![]({{ site.baseurl }}/img/csaw2020/image3.png){:height="70%" width="70%"}

base64 decode that, and we get the flag:

```
echo ZmxhZ3swbjNfdDFtM19QQGQhfQ== | base64 -d
flag{0n3_t1m3_P@d!}
```

Flag is `flag{0n3_t1m3_P@d!}`

## modus_operandi
> Can't play CSAW without your favorite block cipher!
>
> `nc crypto.chal.csaw.io 5001`
>
> Hint: "<200"

Connecting to the endpoint, we get a message that tells us to give it a plaintext, and it will spit out an associated ciphertext. We must then guess whether it was encrypted with ECB or CBC:

```
nc crypto.chal.csaw.io 5001
Hello! For each plaintext you enter, find out if the block cipher used is ECB or CBC. Enter "ECB" or "CBC" to get the flag!
Enter plaintext:
a
Ciphertext is:  30f3760e92ecdebe9cfe9947dafbd2c8
ECB or CBC?
ECB
Enter plaintext:
a
Ciphertext is:  728f9469b2874d08bf87d38c065ce512
ECB or CBC?
ECB
```

We got the second round wrong (guessing ECB when it was CBC), so the program terminated our connection.

So, the task is simple: Given a ciphertext, identify whether or not it was encrypted with ECB or CBC mode. If you've done a litte work in Crypto (or have happened to do the Cryptopals lessons on this task), you've probably heard of the [ECB penguin](https://blog.filippo.io/the-ecb-penguin/). Basically, when you are using ECB, [identical plaintext blocks get encrypted into identical ciphertext blocks](https://en.wikipedia.org/wiki/Block_cipher_mode_of_operation#:~:text=The%20disadvantage%20of%20this%20method,for%20use%20in%20cryptographic%20protocols). So, we should be able to send a large plaintext (in order to have a large enough sample size of encrypted chunks) to tell whether or not it is mostly the same block repeated (i.e ECB), or not (in which case, _must_ be CBC).

I just picked a plaintext of length ~200, since that'd give plenty of ciphertext blocks to analyze (200 / 8 = 25).

Since we know how to detect ECB, and know it can only ever be ECB or CBC, we also know when it is CBC (i.e when it's _not_ CBC).

Using pwntools, we can connect to the challenge server, repeat this task a bunch of times, and get our flag. I thought the hint meant less than 200 rounds, so I initially tried that:

{% highlight python %}
#!/usr/bin/env python3
from pwn import *
from collections import Counter

# context.log_level = 'debug'
r = remote('crypto.chal.csaw.io', 5001)
pt = "a" * 200

for _ in range(200):
    output = r.recvuntil('Enter plaintext: \n', timeout=200)
    r.sendline(pt)
    ct = r.recvline().decode().strip() # ciphertext is: xxxxxxxxx
    ct = ct.split()[-1] # get just xxxxxx
    r.recvline() # ECB or CBC?

    chunk_size = 16
    ct_chunks = [ct[i: i+chunk_size] for i in range(0, len(ct), chunk_size)]

    # Now squash the chunks into a counter of each entry, thinking that ECB should
    # have a few entries with a lot of occurences
    chunk_counts = Counter(ct_chunks)
    most_frequent_chunk = chunk_counts.most_common(1)[0]
    most_frequent_chunk_occurences =  most_frequent_chunk[1]

    if most_frequent_chunk_occurences > 9:
        r.sendline('ECB')
    else:
        r.sendline('CBC')
{% endhighlight %}

However, running this, it consistently hits an EOFError after round 176. Every time. So, seems as if there is only that many rounds, and we need to get the answer based on the knowledge we've gained thus far. A common approach in these types of repeated this or that challenges in CTF is just subbing the answers into "1"s or "0"s and building a string from the binary produced from our challenge round answers. Extending the above script to do so:

{% highlight python %}
#!/usr/bin/env python3
from pwn import *
from collections import Counter
from typing import List

# context.log_level = 'debug'
r = remote('crypto.chal.csaw.io', 5001)
pt = "a" * 200; answers = []


def convert_answers_binary(answers: List[str]) -> str:
    binstring = ""
    for x in answers:
        if x == "ECB":
            binstring += "0"
            print("0", end='')
        else:
            binstring += "1"
            print("1", end='')
    print()
    return binstring


def print_binstring_by_char(binstring: str):
    binstring2 = [binstring[i: i+8] for i in range(0, len(binstring), 8)]
    for binary_value in binstring2:
        print(chr(int(binary_value, 2)), end='')
    print()


for _ in range(176):
    output = r.recvuntil('Enter plaintext: \n', timeout=200)
    r.sendline(pt)
    ct = r.recvline().decode().strip() # ciphertext is: xxxxx
    ct = ct.split()[-1]
    r.recvline() # ECB or CBC?

    chunk_size = 16
    ct_chunks = [ct[i: i+chunk_size] for i in range(0, len(ct), chunk_size)]

    # Now squash the chunks into a counter of each entry, thinking that ECB should
    # have a few entries with a lot of occurences
    chunk_counts = Counter(ct_chunks)
    most_frequent_chunk = chunk_counts.most_common(1)[0]
    most_frequent_chunk_occurences =  most_frequent_chunk[1]

    if most_frequent_chunk_occurences > 9:
        answers.append('ECB')
        r.sendline('ECB')
    else:
        answers.append('CBC')
        r.sendline('CBC')

binstring = convert_answers_binary(answers)
print_binstring_by_char(binstring)
{% endhighlight %}

At first, I had the binary translation swapped (i.e ECB-->1 and CBC-->0) and that didn't translate to anything, so it must have been the other way around. Running that, we get the flag:

{% highlight python %}
python modulus_operandi.py
[+] Opening connection to crypto.chal.csaw.io on port 5001: Done
01100110011011000110000101100111011110110100010101000011010000100101111101110010011001010100000001101100011011000111100101011111011100110101010101100011011010110010010001111101
flag{ECB_re@lly_sUck$}
{% endhighlight %}


---

That's all for this week -- I had done quit a bit on the jail escape, but Redjohn ended up figuring that out (need to remember to use `.__globals__` when doing Pyjails too!) Overall, was dissapointed with this CTF; apparently was quite good the previous year, so to see so much guesswork problems, bad infrastructure, and apparent lack of interest from the admins was rather dissapointing.

Anyhow -- on to next week!

