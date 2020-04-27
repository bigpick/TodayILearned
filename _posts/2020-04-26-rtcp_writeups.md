---
author: george_pick
layout: post
title: "Houseplant CTF 2020"
excerpt: "Writeups for various challenges I solved during the 2020 Houseplant CTF (riceteacatpanda) capture the flag competition."
categories: [Capture The Flag]
---

> Houseplant CTF is a capture the flag made with the new RiceTeaCatPanda developers, bringing even crazier and innovative challenges to our community, with 100% same funny stories and (at least) 60% reduced guessing :3
>
> Starts at 19:00 UTC on Friday 24th April 2020 and runs until 19:00 UTC on Sunday 26th April 2020
>
> Dicsord:  
> This is the link: https://discordapp.com/invite/QRhHGJA


These are writeups to challenges I solved for this CTF.

# Solved

| Beginners | Crypto | Forensics | Misc | OSInt |
| [Beginner1](#beginner1) | [Broken Yolks](#broken-yolks) | [Neko Hero](#neko-hero) | [Spilled Milk](#spilled-milk) | [Drummer Same Name](#the-drummer-who-gave-all-his-daughters-the-same-name) |
| [Beginner2](#beginner2) | [Sizzle](#sizzle) | [Ezoterik](#ezoterik) | [Zip-a-Dee-Doo-Dah](#zip-a-dee-doo-dah) | [What a Sight to See!](#what-a-sight-to-see) |
| [Beginner3](#beginner3) | [CH3COOH](#ch3cooh)| | [Satan's Jigsaw](#satans-jigsaw) | [Groovin and Cubin](#groovin-and-cubin) |
| [Beginner4](#beginner4) | [fences are cool unless they’re taller than you](#fences-are-cool-unless-theyre-taller-than-you) | | | |
| [Beginner5](#beginner5) | [Returning Stolen Archives](#returning-stolen-archives) | | | |
| [Beginner6](#beginner6) | [Rivest Shamir Adleman](#rivest-shamir-adleman) | | | |
| [Beginner7](#beginner7) | [Rainbow Vomit](#rainbow-vomit) | | | |
| [Beginner8](#beginner8) | [Post-Homework Death](#post-homework-death) | | | |
| [Beginner9](#beginner9) | [Parasite](#parasite)| | | |
|                         | […. .- .-.. ..-.](#------) | | | |
|---
| | | | | |

I'm terrified of what the one that wasn't "60% reduced guessing" looked like...

&nbsp;
&nbsp;
---

# Beginners

## Beginner1
> When Bob and Jia were thrown into the world of cybersecurity, they didn't know anything- and thus were very overwhelmed. They're trying to make sure it doesn't happen to you.  
> Let's cover some bases first.  
> `cnRjcHt5b3VyZV92ZXJ5X3dlbGNvbWV9`

{% highlight bash %}
echo cnRjcHt5b3VyZV92ZXJ5X3dlbGNvbWV9 | base64 -d; echo
rtcp{youre_very_welcome}
{% endhighlight %}

Flag is `rtcp{youre_very_welcome}`.

## Beginner2
> Bob wanted to let you guys know that "You might not be a complete failure."  
> Thanks, Bob.  
> `72 74 63 70 7b 62 6f 62 5f 79 6f 75 5f 73 75 63 6b 5f 61 74 5f 62 65 69 6e 67 5f 65 6e 63 6f 75 72 61 67 69 6e 67 7d`  
> Hint! Still covering bases here.

&nbsp;
![]({{ site.baseurl }}/img/rtcp_ctf/beginner2.png)
&nbsp;

Flag is `rtcp{bob_you_suck_at_being_encouraging}`.

## Beginner3
> Fun fact: Jia didn't actually know what this was when they first started out. If you got this, you're already doing better than them ;-;  
> `162 164 143 160 173 163 165 145 137 155 145 137 151 137 144 151 144 156 164 137 153 156 157 167 137 167 150 141 164 137 157 143 164 141 154 137 167 141 163 137 157 153 141 171 77 41 175`  
>  Hint! wow, these bases are getting smaller

&nbsp;
![]({{ site.baseurl }}/img/rtcp_ctf/beginner3.png)
&nbsp;

Flag is `rtcp{sue_me_i_didnt_know_what_octal_was_okay?!}`.

## Beginner4
> Caesar was stabbed 23 times by 60 perpetrators... sounds like a modern group project  
> egpc{lnyy_orggre_cnegvpvcngr}

&nbsp;
![]({{ site.baseurl }}/img/rtcp_ctf/beginner4.png)
&nbsp;

Flag is `rtcp{yall_better_participate}`.

## Beginner5
> beep boop  
> -- .- -. -.-- ..--.- -... . . .--. ... ..--.- .- -. -.. ..--.- -... --- --- .--. ...  
> Remember to wrap the flag in the flag format rtcp{something}

&nbsp;
![]({{ site.baseurl }}/img/rtcp_ctf/beginner5.png)
&nbsp;

Flag is `rtcp{MANY_BEEPS_AND_BOOPS}`.

## Beginner6
> i'm so tired...  
> 26 26 26 26 26 26 26 26 19 12 5 5 16 9 14 7 9 14 16 8 25 19 9 3 19  
> Remember to wrap the whole thing in the flag format rtcp{}

&nbsp;
![]({{ site.baseurl }}/img/rtcp_ctf/beginner6.png)
&nbsp;

Flag is `rtcp{zzzzzzzzsleepinginphysics}`.

## Beginner7
> Don't go around bashing people.  
> igxk{fmovhh_gsvb_ziv_nvzm}

&nbsp;
![]({{ site.baseurl }}/img/rtcp_ctf/beginner7.png)
&nbsp;

Flag is `rtcp{unless_they_are_mean}`.

## Beginner8
> You either mildly enjoy bacon, think it's a food of the gods, or are vegan/vegetarian.  
> 00110 01110 00100 00000 10011 00101 01110 01110 00011 00011 01110 01101 10011 10010 10011 00000 10001 10101 00100  
> Remember to wrap the flag in rtcp{}

&nbsp;
![]({{ site.baseurl }}/img/rtcp_ctf/beginner8.png)
&nbsp;

Flag is `rtcp{GOEATFOODDONTSTARVE}`.

## Beginner9
> Hope you've been paying attention! :D  
> Remember to wrap the flag with rtcp{}

&nbsp;
![]({{ site.baseurl }}/img/rtcp_ctf/beginner9.png)
&nbsp;

Flag is `rtcp{nineornone}`.

# Crypto

## Broken Yolks
> Fried eggs are the best.  
> Oh no! I broke my yolk... well, I guess I have to scramble it now.  
> Ciphertext: smdrcboirlreaefd  
> Dev: Delphine

Hint suggests "scrambled" lettering. Total guess for what the letters are scrambled to be, but challenge is "egg themed" so look for words related to that.

Flag is `rtcp{scrambled_or_fried}`.

## Sizzle
> Due to the COVID-19 outbreak, we ran all out of bacon, so we had to use up the old stuff instead. Sorry for any inconvenience caused...
>
> Dev: William  
> Hint! Wrap your flag with rtcp{}, use all lowercase, and separate words with underscores.
> Hint! Is this really what you think it is?

The attached `encoded.txt` file gives:

```
....- ..... ...-. .--.- .--.. ....- -..-- -..-. ..--. -.... .-... .-.-. .-.-. ..-.. ...-- ..... .--.. ...-- .-.-- .--.- -.... -...- .-... ..-.- .-... ..-.. ...--
```

Hint suggests that it's not actually morse code. I tried baudot code first, but that didn't work out either. Instead, I tried translating the dits/dahs to zeros/ones, and then translating that from Baconian to text:

{% highlight python %}
def printalpha(word):
  for entry in word:
    print(alpha[int(str(entry), 2) % 26], end=' ')
  print()

with open('encoded.txt', 'r') as infile:
    given=infile.read()

zeros=given.replace("-","1").replace(".","0")
ones=given.replace("-","0").replace(".","1")
print("test1: ", ''.join(zeros.split()))
print("test2: ", ''.join(ones.split()))
~/Downloads
{% endhighlight %}

The correct approach ended up being "test2":


&nbsp;
![]({{ site.baseurl }}/img/rtcp_ctf/sizzle.png)
&nbsp;

Flag is `rtcp{bacon_but_grilled_and_morsified}`.

## CH3COOH
> Owaczoe gl oa yjirmng fmeigghb bd tqrrbq nabr nlw heyvs pfxavatzf raog ktm vlvzhbx tyyocegguf.  
> Tbbretf gwiwpyezl ahbgybbf dbjr rh sveah cckqrlm opcmwp yvwq zr jbjnar.  
> Slinjem gfx opcmwp yvwq gl demwipcw pl ras sckarlmogghb bd xhuygcy mk ghetff zr opcmwp yvwq ztqgckwn.  
> Rasec tfr ktbl rrdrq ht iggstyk, rrnxbqggu bl lchpvs zymsegtzf.  
> Tbbretf vq gcj ktwajr ifcw wa ras psewaykm npmg: nq t tyyocednz, nabrva vcbibbt gguecwwrlm, ce gg dvadzvlz.  
> Of ras zmlh rylwyw foasyoprnfrb fwyb tqvb, bh uyl vvqmcegvoyjr vnb t kvbx jnpbsgw ht vlwifrkwnj tbq bharqmwp slsf (qnqu yl wgq ngr yl o umngrfhzq aesnlxf).  
> Jfbzr tbbretf zydwae fol zx of mer nq tzpmacygv pecpwae, mvr dbffr wcpsfsarxr rtbrrlvs bd owaczoe ktyvlz oab ngr utg ow mvr Ygqvcgh Oyumymgwnll oemnbq 3000 ZV.  
> Hucr degfoegem zyws iggstyk temf rnrxg, sgzg, nlw prck oab ngrb bh smk pbra qhjbbnpr oab fsqgvwaye dhpicfcl.  
> Heyvsf my wg yegb ftjr zxsa dhiab bb Rerdggtb hpgg.  
> Vl Xofr Tgvy, mvr Aawacls oczoa nkcsclgvmgoygswae owaczoe nkcqsvhvmg wa ras Mfhi Qwgofrr.  
> Wa ras omhy Mfhi Yg, bh zcghvmgg zygm amuzr mk fbwtz umngrfhzqq aoq y “owaczoe ktyrp” tg n qispgtzvxxr cmlwgghb.  
> Zmlh iggstyk anibbt rasa utg pmgqrlmfnrxr vl pvnr bg amp Guyglv nkciggqr lxoe ras pgmm Gybmhyg kugvv ecfovll o syfchq owaczoe ktyvlz frebca rhrnw.  
> Foaw Vvvlxgr tbbretff ygr gfxwe slsf dhf psewaykm nlw arbbqvltz cskdbqxg jcks jpbhgcg rbug wa ras nekwpsehhptz zyginj Jwzgg Mnmlvh.  
> pmqc{tbbretf_bl_fm_sglv_nlw_qugig_cjxofc}  
> Hint! Short keys are never a good thing in cryptography.

Brute force Vigenere cipher text.

&nbsp;
![]({{ site.baseurl }}/img/rtcp_ctf/ch3cooh.png)
&nbsp;

Flag is `rtcp{vinegar_on_my_fish_and_chips_please}`.

## fences are cool unless they're taller than you
> They say life's a roller coaster, but to me, it's just jumping over fences.  
> tat_uiwirc{s_iaaotrc_ahn}pkdb_esg

Title suggests a Railfence cipher. Google searching for brute forcing railfence cipher leads us to [this page](https://exercism.io/tracks/python/exercises/rail-fence-cipher/solutions/8d7425bdbb844c5e9416015cd7eb3daa).

{% highlight python %}
>>> from itertools import cycle
>>>
>>>
>>> def rail_pattern(n):
...     r = list(range(n))
...     return cycle(r + r[-2:0:-1])
...
>>>
>>> def encode(plaintext, rails):
...     p = rail_pattern(rails)
...     # this relies on key being called in order, guaranteed?
...     return ''.join(sorted(plaintext, key=lambda i: next(p)))
...
>>>
>>> def decode(ciphertext, rails):
...     p = rail_pattern(rails)
...     indexes = sorted(range(len(ciphertext)), key=lambda i: next(p))
...     result = [''] * len(ciphertext)
...     for i, c in zip(indexes, ciphertext):
...         result[i] = c
...     return ''.join(result)
...
>>> decode("tat_uiwirc{s_iaaotrc_ahn}pkdb_esg", 3)
'tcp{ask_tida_about_rice_washing}r'
{% endhighlight %}

Flag is `rtcp{ask_tida_about_rice_washing}`.

## Returning Stolen Archives
> So I was trying to return the stolen archives securely, but it seems that I had to return them one at a time, and now it seems the thieves stole them back! Can you help recover them once and for all? It seems they had to steal them one at a time...
>
>  Hint! Well you sure as hell ain't going to solve this one through factorization.

No shit you aren't going to solve this through factorizing. The challenge gave two files:
* `intercepted.txt`

```
n = 54749648884874001108038301329774150258791219273879249601123423751292261798269586163458351220727718910448330440812899799
e = 65537
ct = [52052531108833646741308670070505961165002560985048445381912028939564989677616205955826911335832917245744890104862186090,24922951057478302364724559167904980705887738247412638765127966502743153757232333552037075100099370197070290632101808468,31333127727137796897042309238173536507191002247724391776525004646835609286736822503824661004274731843794662964916495223,37689731986801363765434552977964842847326744893755747412237221863834417045591676371189948428149435230583786704331100191,10128169466676555996026197991703355150176544836970137898778443834308512822737963589912865084777642915684970180060271437,31333127727137796897042309238173536507191002247724391776525004646835609286736822503824661004274731843794662964916495223,32812400903438770915197382692214538476619741855721568752778494391450400789199013823710431516615200277044713539798778715,48025916179002039543667066543229077043664743885236966440148037177519549014220494347050632249422811334833955153322952673,52052531108833646741308670070505961165002560985048445381912028939564989677616205955826911335832917245744890104862186090,32361547617137901317806379693272240413733790836009458796321421127203474492226452174262060699920809988522470389903614273,4363489969092225528080759459787310678757906094535883427177575648271159671231893743333971538008898236171319923600913595,47547012183185969621160796219188218632479553350320144243910899620916340486530260137942078177950196822162601265598970316,32361547617137901317806379693272240413733790836009458796321421127203474492226452174262060699920809988522470389903614273,33230176060697422282963041481787429356625466151312645509735017885677065049255922834285581184333929676004385794200287512,32315367490632724156951918599011490591675821430702993102310587414983799536144448443422803347161835581835150218650491476,6693321814134847191589970230119476337298868688019145564978701711983917711748098646193404262988591606678067236821423683,32710099976003111674253316918478650203401654878438242131530874012644296546811017566357720665458366371664393857312271236,49634925172985572829440801211650861229901370508351528081966542823154634901317953867012392769315424444802884795745057309,50837960186490992399835102776517955354761635070927126755411572132063618791417763562399134862015458682285563340315570436]
```

* `returningstolenarchives.py`

{% highlight python %}
p = [redacted]
q = [redacted]
e = 65537
flag = "[redacted]"

def encrypt(n, e, plaintext):
  print("encrypting with " + str(n) + str(e))
  encrypted = []
  for char in plaintext:
    cipher = (ord(char) ** int(e)) % int(n)
    encrypted.append(cipher)
  return(encrypted)

n = p * q
ct = encrypt(n, e, flag)
print(ct)
{% endhighlight %}

The vulnerability is that the encrypted single chars at a time and sent those over. We can brute force the answer by just iterating over a range of characters and encrypting them using the given values, and if the match the ciphertext value we're all set.

Solve script:

{% highlight python %}
#!/usr/bin/env python3.8
from intercepted import *
print(n)
print(e)
print(ct)
out = ''
for l in ct:
    for j in range(32, 127):
        if pow(j, e, n) == l:
            out += chr(j)
            break
print(out)
{% endhighlight %}

Flag is `rtcp{cH4r_bY_Ch@R!}`.

## Rivest Shamir Adleman
> A while back I wrote a Python implementation of RSA, but Python's really slow at maths. Especially generating primes.
>
> Hint! There are two possible ways to get the flag ;-)

We're given `chall.7z` which is an archive of a bunch of junk related to someone's one implementation of RSA encryption. If we run the given `generate_keys.py` in it which is what was used to generate the `p` and `q` values to form `N`, we notice something odd: it always produces the same `p`.

```
python generate_keys.py
...
cat primes.json
{"p": 88761620475672281797897005732643499821690688597370440945258776182910533850401433150065043871978311565287949564292158396906865512113015114468175188982916489347656271125993359554057983487741599275948833820107889167078943493772101668339096372868672343763810610724807588466294391846588859523658456534735572626377, "q": ...

python generate_keys.py
...
cat primes.json
{"p": 88761620475672281797897005732643499821690688597370440945258776182910533850401433150065043871978311565287949564292158396906865512113015114468175188982916489347656271125993359554057983487741599275948833820107889167078943493772101668339096372868672343763810610724807588466294391846588859523658456534735572626377, "q": ...

python generate_keys.py
...
cat primes.json
{"p": 88761620475672281797897005732643499821690688597370440945258776182910533850401433150065043871978311565287949564292158396906865512113015114468175188982916489347656271125993359554057983487741599275948833820107889167078943493772101668339096372868672343763810610724807588466294391846588859523658456534735572626377, "q": ...

python generate_keys.py
...
cat primes.json
{"p": 88761620475672281797897005732643499821690688597370440945258776182910533850401433150065043871978311565287949564292158396906865512113015114468175188982916489347656271125993359554057983487741599275948833820107889167078943493772101668339096372868672343763810610724807588466294391846588859523658456534735572626377, "q": ...
```

We are given `N`, and we know that the given ciphertext was generated based on primes generated from the `generate_keys.py` script, so we know `N` and `p`. We calculate `q` by diving `p` from `N`, and then we can get phi, d, and then it's game over.

```
Decrypt: b'VERIFICATION-UpTheCuts-END\n .--.\n/.-. \'----------.\n\\\'-\' .--"--""-"-\'\n \'--\'\n\nrtcp{f1xed_pr*me-0r_low_e?}'
```

Flag is `rtcp{f1xed_pr*me-0r_low_e?}`

## Rainbow Vomit
> o.O What did YOU eat for lunch?!
>
> The flag is case insensitive.

We're given a file called `output.png`:

&nbsp;
![]({{ site.baseurl }}/img/rtcp_ctf/output.png)
&nbsp;

> Hint! Replace spaces in the flag with { or } depending on their respective places within the flag.  
> Hint! Hues of hex  
> Hint! This type of encoding was invented by Josh Cramer.  

The hinting to death of the challenge revealed it to be a [Hexahue image](https://www.geocachingtoolbox.com/index.php?lang=en&page=hexahue).

Since each color is exactly one pixel, it's easy to just iterate over the image in chunks and compare with the known hexahue alphabet. I did so in python:

{% highlight python %}
#!/usr/bin/env python3.8

from PIL import Image
import numpy
from webcolors import rgb_to_name

# magenta is purple
# lime is green
alpha = {}
alpha["A"] = [["magenta","red"],["lime","yellow"], ["blue", "cyan"]]
alpha["B"] = [["red","magenta"],["lime","yellow"], ["blue", "cyan"]]
alpha["C"] = [["red","lime"],["magenta","yellow"], ["blue", "cyan"]]
alpha["D"] = [["red","lime"],["yellow","magenta"], ["blue", "cyan"]]
alpha["E"] = [["red","lime"],["yellow","blue"], ["magenta", "cyan"]]
alpha["F"] = [["red","lime"],["yellow","blue"], ["cyan", "magenta"]]
alpha["G"] = [["lime","red"],["yellow","blue"], ["cyan", "magenta"]]
alpha["H"] = [["lime","yellow"],["red","blue"], ["cyan", "magenta"]]
alpha["I"] = [["lime","yellow"],["blue","red"], ["cyan", "magenta"]]
alpha["J"] = [["lime","yellow"],["blue","cyan"], ["red", "magenta"]]
alpha["K"] = [["lime","yellow"],["blue","cyan"], ["magenta", "red"]]
alpha["L"] = [["yellow","lime"],["blue","cyan"], ["magenta", "red"]]
alpha["M"] = [["yellow","blue"],["lime","cyan"], ["magenta", "red"]]
alpha["N"] = [["yellow","blue"],["cyan","lime"], ["magenta", "red"]]
alpha["O"] = [["yellow","blue"],["cyan","magenta"], ["lime", "red"]]
alpha["P"] = [["yellow","blue"],["cyan","magenta"], ["red", "lime"]]
alpha["Q"] = [["blue","yellow"],["cyan","magenta"], ["red", "lime"]]
alpha["R"] = [["blue","cyan"],["yellow","magenta"], ["red", "lime"]]
alpha["S"] = [["blue","cyan"],["magenta","yellow"], ["red", "lime"]]
alpha["T"] = [["blue","cyan"],["magenta","red"], ["yellow", "lime"]]
alpha["U"] = [["blue","cyan"],["magenta","red"], ["lime", "yellow"]]
alpha["V"] = [["cyan","blue"],["magenta","red"], ["lime", "yellow"]]
alpha["W"] = [["cyan","magenta"],["blue","red"], ["lime", "yellow"]]
alpha["X"] = [["cyan","magenta"],["red","blue"], ["lime", "yellow"]]
alpha["Y"] = [["cyan","magenta"],["red","lime"], ["blue", "yellow"]]
alpha["Z"] = [["cyan","magenta"],["red","lime"], ["yellow", "blue"]]
alpha[" "] = [["white","white"],["white","white"], ["white", "white"]]
alpha["."] = [["black", "white"],["white","black"],["black","white"]]
alpha[","] = [["white", "black"],["black","white"],["white","black"]]
alpha["0"] = [["black", "gray"],["white","black"],["gray","white"]]
alpha["1"] = [["gray", "black"],["white","black"],["gray","white"]]
alpha["2"] = [["gray", "white"],["black","black"],["gray","white"]]
alpha["3"] = [["gray", "white"],["black","gray"],["black","white"]]
alpha["4"] = [["gray", "white"],["black","gray"],["white","black"]]
alpha["5"] = [["white", "gray"],["black","gray"],["white","black"]]
alpha["6"] = [["white", "black"],["gray","gray"],["white","black"]]
alpha["7"] = [["white", "black"],["gray","white"],["gray","black"]]
alpha["8"] = [["white", "black"],["gray","white"],["black","black"]]
alpha["9"] = [["black", "white"],["gray","white"],["black","gray"]]


im_array = numpy.asarray(Image.open('chall.png'))

rows, cols, depth = im_array.shape
flag = ""

# image is padded 2x2 with whitespace
for row in range(2, rows-2, 3):
    for col in range(2, cols-2, 2):
        print(row+2)
        tl = rgb_to_name(im_array[row][col])
        tr = rgb_to_name(im_array[row][col+1])
        ml = rgb_to_name(im_array[row+1][col])
        mr = rgb_to_name(im_array[row+1][col+1])
        ll = rgb_to_name(im_array[row+2][col])
        lr = rgb_to_name(im_array[row+2][col+1])
        letter = [[tl, tr], [ml, mr], [ll, lr]]
        for k in alpha:
            if alpha[k] == letter:
                flag += k
print(flag)
{% endhighlight %}

Running it gives us the flag:

```
./hexahuesolve.py
THERE IS SUCH AS THING AS A TOMCAT BUT HAVE YOU EVER HEARD OF A TOMDOG. THIS IS THE MOST IMPORTANT UESTION OF OUR TIME, AND UNFORTUNATELY ONE THAT MAY NEVER BE ANSWERED BY MODERN SCIENCE. THE DEFINITION OF TOMCAT IS A MALE CAT, YET THE NAME FOR A MALE DOG IS MAX. WAIT NO. THE NAME FOR A MALE DOG IS JUST DOG. REGARDLESS, WHAT WOULD HAPPEN IF WE WERE TO COMBINE A MALE DOG WITH A TOMCAT. PERHAPS WED END UP WITH A DOG THAT VOMITS OUT FLAGS, LIKE THIS ONE RTCP SHOULD,FL5G4,B3,ST1CKY,OR,N0T
RTCP{SHOULD,FL5G4,B3,ST1CKY,OR,N0T}
```

Flag is `RTCP{SHOULD,FL5G4,B3,ST1CKY,OR,N0T}`.

## Post-Homework Death
> My math teacher made me do this, so now I'm forcing you to do this too.
>
> Flag is all lowercase; replace spaces with underscores.
> Hint! When placing the string in the matrix, go up to down rather than left to right.  
> Hint! Google matrix multiplication properties if you're stuck.  

We're given one file:

```
Decoding matrix:

1.6  -1.4  1.8
2.2  -1.8  1.6
-1     1    -1


String:

37 36 -1 34 27 -7 160 237 56 58 110 44 66 93 22 143 210 49 11 33 22
```

So, the decoding matrix seems to obviously be a 3x3 matrix. We're told to place the "string" into a matrix top to bottom.

At first, I tried putting it into a 7x3 matrix, and then doing the stringMatrix * decodingMatrix, but that resulted in non-alphabetical/negative values.

Next I tried placing it into a 3x7 matrix, and then doing the decodingMatrix * stringMatrix.

This gave me all items that looked to be indices of the alphabet. However, substituting them in with "a" starting at 0 and "z" ending at 25, it resulted in gibberish still.

The challenge mentioned we should expect spaces, which there were none of. Apparently, you had to know to guess to add " " as the zero-th element of your alphabet, and then have a-z go from 1-26.

Doing so results in the flag:

{% highlight python %}
#!/usr/bin/env python3.8
import numpy
import string
alpha=string.ascii_lowercase
alpha=" "+alpha
keyMatrix = numpy.array([
                          [1.6,  -1.4,  1.8],
                          [2.2,  -1.8,  1.6],
                          [-1,     1,    -1]
                         ])
#String
#37 36 -1 34 27 -7 160 237 56 58 110 44 66 93 22 143 210 49 11 33 22
cipherMatrix = numpy.array([
                [37, 237, 22],
                [36, 56, 143],
                [-1, 58, 210],
                [34, 110, 49],
                [27, 44, 11],
                [-7, 66, 33],
                [160, 93, 22]
               ])

cipherMatrix2 = numpy.array([[37, 34, 160, 58, 66, 143, 11],
                             [36, 27, 237, 110, 93, 210, 33],
                             [-1, -7, 56, 44, 22, 49, 22]
                            ])

for row in range(3):
    for col in range(7):
      print(cipherMatrix2[row][col], end=' ')
    print()

product = numpy.matmul(keyMatrix, cipherMatrix2)
flag = ""
digits = []
for col in range(7):
    for row in range(3):
        flag+=alpha[int(round(product[row][col]))]
        digits.append(int(round(product[row][col])))
print(flag)
print(digits)
{% endhighlight %}

Running it gives the flag: `rtcp{go_do_your_homework}`.

## Parasite
> paraSite Killed me A liTtle inSide
>
> Flag: English, case insensitive; turn all spaces into underscores

Capitalization of the challenge description implies [SKATS](https://en.wikipedia.org/wiki/SKATS).

Using this image:


&nbsp;
![]({{ site.baseurl }}/img/rtcp_ctf/skat.png)
&nbsp;

I hand translated the given code using an online korean keyboard.

Copying and pasting the resulting Korean into Google Translate gave the flag:

&nbsp;
![]({{ site.baseurl }}/img/rtcp_ctf/parasite.png)
&nbsp;

Flag is `rtcp{Hope_is_a_true_parasite}`.

## .... .- .-.. ..-.
> Ciphertext: DXKGMXEWNWGPJTCNVSHOBGASBTCBHPQFAOESCNODGWTNTCKY
>
> Hint! All letters must be capitalized  
> Hint! The flag must be in the format rtcp{.*}

Translating the challenge name from morse code gives us "HALF".

Googling for "half morse cipher" gives us results for "Fractionated Morse Cipher".

I think the second or third result was [an automatic decrypting tool for it](https://www.dcode.fr/fractionated-morse).

Pasting in the given text gave us the flag.

&nbsp;
![]({{ site.baseurl }}/img/rtcp_ctf/half_morse.png)
&nbsp;

Flag is `RTCP{TW0GALLONSOFH4LFMAK3WH0LEM1LK}`.

# Forensics
## Neko Hero
> Please join us in our campaign to save the catgirls once and for all, as the COVID-19 virus is killing them all and we need to provide food and shelter for them!  
> nya~s and uwu~s will be given to those who donate!  
> and headpats too!  

_Fucking weebs_.

We're given a file, `advertisement.png`. Using [stegsolve](https://github.com/zardus/ctf-tools/blob/master/stegsolve/install), we see the flag is hidden in one of the Green planes:

&nbsp;
![]({{ site.baseurl }}/img/rtcp_ctf/nekohero.png)
&nbsp;

Flag is `rtcp{s4vE_ALL_7h3m_c4tG1Rl$}`.

## Ezoterik
> Inventing languages is hard. Luckily, there's plenty of them, including stupid ones.  
> Hint! You will find what you seek beyond the whitespace

We're given a picture:


&nbsp;
![]({{ site.baseurl }}/img/rtcp_ctf/ezoterik.jpg)
&nbsp;

Somehow I missed the hint originally, so I had hand copied all the [brainfuck](https://en.wikipedia.org/wiki/Brainfuck) and ran it through an interpreter only to be greeted with "Yeah, no, sorry.". Damn, so much wasted effort!

Once I saw the hint, I tried looking at the file's hidden strings, and saw something interesting:

```
...
                                                    2TLEdubBbS21p7u3AUWQpj1TB98gUrgHFAiFZmbeJ8qZFb9qCUc8Qp6o86eJYkrm2NLexkSDyRYd3X9sRCRKJzoZnDtrWZKcHPxjoRaFPHfmeUyoxyyWQtiqEgdJR1WU4ywAYqRq7o55XLUgmdit6svgviN8qy72wvLvT2eWjECbqHdrKa2WjiAEvgaGxVedY8SRXXcU9JbP5Ps3RY2ieejz6DrF9NBD7mri2wrsyDs9gpVgosxnYPbwjGdmsq7GwudbqtJ7SeKgaStmygyfPast5F3ZKL9KeC2LzCeenffoZ4d4Cna7TZdkUsfdK1HNmoB46fo9jK5ENQwnWdPmZBnZ4h8uDxHpQF74rs3wPcpmch6Byu31och1cyz8JxgXkacHpTrGeAN2bEhRp8kDQpmPtj9QqaAgxTbam9hoB4mvtrRmRx5GnzzZoWW5qDxwMvgKCYWiLwtLcvjDZPNdHGbvFspFeCq7kBcTeyrjYeHxuwwwM1GpdwMdxzNiFK1jYkA4DUZRohuKxeyhBFiY9HuwD6zKf9nZMThoYwTGhAJR2d3GqVqXGsivAKLs1oBzrmH9V6vaMwAjM7Hu69TLfKHtZUThoiEDftxPJdraNxoQps3mFamNbT1U3kRdpAz5s5kq6i2jLBUjBjAdV9N8jWNqx4RgiaHTW5qqb8E6JvHgQyrVkLmMdsjoLAWaWZLRw2pQpBJehRsx1LU6wmAC1nfeLbdQxPmytaMUURBDhHVqPNxwThCzZsnA9RuKrYWGsmyTxCzVUEjvUXaU4hkoV62qn7G1TnVRiADNhRfMnxm8R2ZoSPxEhVaFyHvLweq
```

OK - that's some space, and there's stuff after it, so it must be what we seek!

Posting the results into cyberchef and running "Magic" on it shows that the top result is "From Base58"! Doing so gives us the following "code":

```
elevator lolwat
  action main
    show 114
    show 116
    show 99
    show 112
    show 123
    show 78
    show 111
    show 116
    show 32
    show 113
    show 117
    show 105
    show 116
    show 101
    show 32
    show 110
    show 111
    show 114
    show 109
    show 97
    show 108
    show 32
    show 115
    show 116
    show 101
    show 103
    show 111
    show 95
    show 52
    show 120
    show 98
    show 98
    show 52
    show 53
    show 103
    show 121
    show 116
    show 106
    show 125
  end action
  action show num
    floor num
    outFloor
  end action
end elevator
```

So this "code" looks like it's just printing ASCII values. I looped through this using Python to get the flag:

{% highlight python %}
#!/usr/bin/env python3.8

import base58

seeked="2TLEdubBbS21p7u3AUWQpj1TB98gUrgHFAiFZmbeJ8qZFb9qCUc8Qp6o86eJYkrm2NLexkSDyRYd3X9sRCRKJzoZnDtrWZKcHPxjoRaFPHfmeUyoxyyWQtiqEgdJR1WU4ywAYqRq7o55XLUgmdit6svgviN8qy72wvLvT2eWjECbqHdrKa2WjiAEvgaGxVedY8SRXXcU9JbP5Ps3RY2ieejz6DrF9NBD7mri2wrsyDs9gpVgosxnYPbwjGdmsq7GwudbqtJ7SeKgaStmygyfPast5F3ZKL9KeC2LzCeenffoZ4d4Cna7TZdkUsfdK1HNmoB46fo9jK5ENQwnWdPmZBnZ4h8uDxHpQF74rs3wPcpmch6Byu31och1cyz8JxgXkacHpTrGeAN2bEhRp8kDQpmPtj9QqaAgxTbam9hoB4mvtrRmRx5GnzzZoWW5qDxwMvgKCYWiLwtLcvjDZPNdHGbvFspFeCq7kBcTeyrjYeHxuwwwM1GpdwMdxzNiFK1jYkA4DUZRohuKxeyhBFiY9HuwD6zKf9nZMThoYwTGhAJR2d3GqVqXGsivAKLs1oBzrmH9V6vaMwAjM7Hu69TLfKHtZUThoiEDftxPJdraNxoQps3mFamNbT1U3kRdpAz5s5kq6i2jLBUjBjAdV9N8jWNqx4RgiaHTW5qqb8E6JvHgQyrVkLmMdsjoLAWaWZLRw2pQpBJehRsx1LU6wmAC1nfeLbdQxPmytaMUURBDhHVqPNxwThCzZsnA9RuKrYWGsmyTxCzVUEjvUXaU4hkoV62qn7G1TnVRiADNhRfMnxm8R2ZoSPxEhVaFyHvLweq"
plaintext= base58.b58decode(seeked).split()
for entry in plaintext:
    try:
        print(chr(int(entry)), end='')
    except ValueError:
        pass
{% endhighlight %}

(You probably need to install [base58](https://pypi.org/project/base58/))

Running it give's us the flag.

Flag is `rtcp{Not quite normal stego_4xbb45gytj}`.

# Misc
## Spilled Milk
> oh no! i'm so clumsy, i spilled my glass of milk! can you please help me clean up?

The given image is just a picture of all white. Again, using stegsolve, we see the hidden message on the Red plane 1:


&nbsp;
![]({{ site.baseurl }}/img/rtcp_ctf/spilledmilk.png)
&nbsp;

Flag is `rtcp{Th4nk$_f0r_h3LP1nG!`.

## Zip-a-Dee-Doo-Dah
> I zipped the file a bit too many times it seems... and I may have added passwords to some of the zip files... eh, they should be pretty common passwords right?

We're given a file called `1819.gz`. If we decompress, we get a 1818.xx file. We can repeatedly do so until we hit a `.zip` file. All of the `.zip` files were password protected.

But, the made it a freebie as they gave the entire set of possibly passwords, from [here](https://github.com/danielmiessler/SecLists/blob/master/Passwords/xato-net-10-million-passwords-100.txt) (and it was only 100). So we don't even need to crack the password, we can just brute force guess from the 100 given.

I used `7z` to uncompress the files, as I was getting weird results with `gunzip`+`tar`+`unzip`.

The bash script that solves it looked like so:

{% highlight bash %}
#!/usr/bin/env bash

passwords=($(cat 100passwords.txt | tr '\n' ' '))
export PATH=$HOME/Downloads/unarMac/:$PATH

#for i in {0..98}; do
#    echo "${passwords[${i}]}"
#done

while [[ "$(ls | awk '{print $NF}' | grep '^1\.')" == "" ]]; do
    tounzip=$(ls | awk '{print $NF}' | grep -v '100passwords\|ripper')

    if [[ $tounzip == 1.* ]]; then
        break
    fi

    if ! 7z -aoa -p"fake" e $tounzip; then
        for i in {0..98}; do
            7z -aoa -p"${passwords[${i}]}" e $tounzip && break
        done
    fi
    rm $tounzip
done
{% endhighlight %}

It assumed the given password list was in the same directory and named `100passwords.txt`. It also took the first `.gz` in the file and ran from there.

It runs up until it hits the `1.xxx` file, which means we only have one more remaining file to go. I did this one by hand to be sure not to accidentally delete it.

The resulting archive gives us the `flag.txt`:

```
rtcp{z1pPeD_4_c0uPl3_t00_M4Ny_t1m3s_a1b8c687}
```

Flag is `rtcp{z1pPeD_4_c0uPl3_t00_M4Ny_t1m3s_a1b8c687}`.

## Satan's Jigsaw
> Oh no! I dropped my pixels on the floor and they're all muddled up! It's going to take me years to sort all 90,000 of these again :(  
>  Hint! long_to_bytes

The given file has **90000** individual files, each of which is a single pixel. The names of the files seemed interesting. Combined with the hint, I tried converting the names as `long`s, using `long_to_bytes` and we get a resulting `xx yy` pair. I took this to be the X,Y coordinates of the file's pixel in the flag picture.

Looping through every file we can file the max X and Y values to give us the flag image's dimensions:

```
# print("Max X: ", max(map(lambda x: x[0], coordinates)))
# print("Max Y: ", max(map(lambda x: x[1], coordinates)))
#   Max X:  299
#   Max Y:  299
```

Once we know that, we can create an empty array for our to-be-built image, and then loop through each file and populate the coordinates with the pixels.

{% highlight python %}
#!/usr/bin/env python3.8

from PIL import Image
import numpy as np
from os import path, listdir
from Crypto.Util.number import long_to_bytes

filelist = listdir('satan')
filelist.sort(key=lambda f: int(f[:-4]))

coordinates = []
pixels = [[0 for x in range(300)] for y in range(300)]
for file in filelist:
    im = Image.open(path.join('satan', file))
    pix = im.load()
    if( im.size != (1, 1)):
        print("Found irregular size pic")
        print(f)
    coords = long_to_bytes(int(file[:-4])).decode().split()
    x = int(coords[0])
    y = int(coords[1])
    #print("X: ", x, " Y: ", y)
    pixels[x][y] = pix[0,0]
    #coordinates.append([x, y])

array = np.array(pixels, dtype=np.uint8)
new_image = Image.fromarray(array)
new_image.save('result.png')

# print("Max X: ", max(map(lambda x: x[0], coordinates)))
# print("Max Y: ", max(map(lambda x: x[1], coordinates)))
#   Max X:  299
#   Max Y:  299
{% endhighlight %}

The resulting image gives us:

&nbsp;
![]({{ site.baseurl }}/img/rtcp_ctf/satanjigswayresult.png)
&nbsp;

Checking the bottom right QR code:

&nbsp;
![]({{ site.baseurl }}/img/rtcp_ctf/satanjigsaw_qr.png)
&nbsp;

with an [online QR scanner](https://online-barcode-reader.inliteresearch.com/) gives us the flag:

&nbsp;
![]({{ site.baseurl }}/img/rtcp_ctf/satanjigsaw_qr_solve.png)
&nbsp;

# OSInt
## The Drummer who Gave all his Daughters the Same Name
> What is the value stored in the first registry key created by the virus Anna Kournikova?

[From here](http://www.iwar.org.uk/comsec/resources/virus/vbsvirus.html)

Flag is `Worm made with Vbswg 1.50b`.

## What a Sight to See!
> What Google Search Operator can I use to find results from a single website?

Flag is `site:`

## Groovin and Cubin
> I really like my work, I get to make cool cryptography CTF challenges but with Rubik's cubes! Sadly, they aren't good enough to get released, but hey, I took a nice image of my work! You should go try to find some more about my work :)

We're given a `.jpg` photo. Run `exiftool` on it:

```
exiftool ../vibin.jpg
ExifTool Version Number         : 11.91
File Name                       : vibin.jpg
Directory                       : ..
File Size                       : 2.4 MB
File Modification Date/Time     : 2020:04:24 07:37:22-04:00
File Access Date/Time           : 2020:04:27 11:30:49-04:00
File Inode Change Date/Time     : 2020:04:27 11:30:47-04:00
File Permissions                : rw-------
File Type                       : JPEG
File Type Extension             : jpg
MIME Type                       : image/jpeg
Exif Byte Order                 : Big-endian (Motorola, MM)
Orientation                     : Rotate 90 CW
Comment                         : A long day of doing cube crypto at work... but working at Groobi Doobie Shoobie Corp is super fun!
Image Width                     : 4032
Image Height                    : 2268
Encoding Process                : Baseline DCT, Huffman coding
Bits Per Sample                 : 8
Color Components                : 3
Y Cb Cr Sub Sampling            : YCbCr4:2:2 (2 1)
Time Stamp                      : 2020:04:23 21:54:25-04:00
Image Size                      : 4032x2268
Megapixels                      : 9.1
```

Business name looks to be "Groobi Doobie Shoobie Corp".

First google result for it is a [Twitter page for a Groovy Shoobie user](https://twitter.com/GShoobie)

It's [very first tweet](https://twitter.com/GShoobie/status/1253648122930176000) sends us to an instagram page:

> Woah, now this is kinda cool! I really like not having to use that wacky Instagram site anymore. (Feel free to follow me @groovyshoobie tho)  
> It's kinda cool here! I think I'll stay here.  
> Gotta go water the houseplants now though :)

[Instagram page for that user](https://www.instagram.com/groovyshoobie/) has the flag in the bio:


&nbsp;
![]({{ site.baseurl }}/img/rtcp_ctf/shooby_insta.png)
&nbsp;

Flag is `rtcp{eXiF_c0Mm3nT5_4r3nT_n3cEss4rY}`.
