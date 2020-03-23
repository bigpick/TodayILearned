---
author: george_pick
layout: post
title: "FireShell CTF 2020"
excerpt: "Writeups for various challenges I solved during the 2020 FireShell capture the flag competition."
categories: [Capture The Flag]
---

> Welcome to FireShell CTF 2020!
>
> Official support channel on Discord:
>
> * [Discord](https://discord.gg/tBMqujE)
>
> * (Flag format is `F#{...}`)

These are writeups to challenges I solved for this CTF.

## Solved

| Web           | PPC                               | Recon               |
|---
| [CaaS](#caas) | [Warmup Rox](#warmup-rox)         | [Welcome](#welcome) |
|               | [Dungeon Escape](#dungeon-escape) |                     |
|---
| | | |

# Web
## CaaS
> Compiler as a Service
>
> Too lazy to install gcc? Hey, we can compile your code to you!
>
> flag is on /flag
>
> https://caas.fireshellsecurity.team/

We're given a webpage, which if we go to, looks like so:

![]({{ site.baseurl }}/img/fireshell/caas_empty_menu.png){:height="80%" width="80%"}

If we give it an example C program, it will compile it and give us the executable:

![]({{ site.baseurl }}/img/fireshell/caas_compiled.png){:height="80%" width="80%"}

And clicking compiled gives us a valid executable, neat.

I played around for a bit with various input, and noticed it spits out some really weird/ugly messages when it can't compile correctly.

When I tried importing the flag file, using the standard c `#include` syntax, I noticed something else strange with the error message:

![]({{ site.baseurl }}/img/fireshell/caas_output.png){:height="80%" width="80%"}

The flag! `F#{D1d_y0u_1nclud3_th3_fl4g?}`.

# ppc
## Warmup ROX
> Server: 142.93.113.55
>
> Port: 31087

Oh CTFs... always so punny... "Warmup ROX". Stare at _ROX_ long enough and you'll realize it's **XOR** backwards.

With that in mind, we can connect to it:

![]({{ site.baseurl }}/img/fireshell/rox_menu.png){:height="60%" width="60%"}

If we type `start`, we can start playing.

![]({{ site.baseurl }}/img/fireshell/rox_input.png){:height="60%" width="60%"}

So, it looks like we have 100 rounds, and it takes our input for each round and produces some output. It also states that "Length is 26".

Keeping the fact that this is an XOR challenge, I took that to mean the key length was 26. Since we know the key will start with `F#{`, we can try sending that to the server and see that we get back three nulls, which we do:

```
 [+] 1 / 100 Input: F#{
 [+] Output:
```

We can then iterate through the next remaining characters one at a time to brute force our way to the key. We can go one char at a time, until we find one that returns null, at which point we know it's the next letter in the key. We add that the the "key so far", and then repeat.

[I wrote a dirty bit in Python](https://github.com/bigpick/CaptureTheFlagCode/blob/master/fireshell_2020/rox_pwn.py) that does this:

```python
#!/usr/bin/env python
from pwn import *

ALPHABET="ABCDEFGHIJKLMNOPQRSTUVWXYZ#{}_-+[,.=!@$%&0123456789 "
# Initially, we know starts with F#{
key_so_far="F#{"

while 1<2:
    conn = remote('142.93.113.55', 31087)
    conn.recvuntil("to start: ")
    conn.sendline('start')
    i = 0
    for _ in range(100):
        try:
            conn.recvuntil('Input: ')
        except EOFError:
            break
        print("Trying: ", ALPHABET[i])
        print("Trying: ", key_so_far+ALPHABET[i])
        conn.sendline(key_so_far+ALPHABET[i])
        response = conn.recvline().split()[-1]
        print("RESPONSE: ", response)
        size = len(key_so_far+ALPHABET[i])
        print(size)
        if response == (b'\x00'*size):
            key_so_far+=ALPHABET[i]
            i=0
            continue

        # Try lower case, lazy way alphabet
        if ALPHABET[i].isalpha():
            try:
                conn.recvuntil('Input: ')
            except EOFError:
                break
            print("Trying: ", ALPHABET[i].lower())
            conn.sendline(key_so_far+(ALPHABET[i].lower()))
            response = conn.recvline().split()[-1]
            print("RESPONSE: ", response)
            if response == (b'\x00'*size):
                key_so_far+=ALPHABET[i].lower()
                i=0
        i+=1
```

When ran, it will just iterate through that `ALPHABET`, until it finds one that gives back null, adds it to the `key_so_far`, and then repeats.

A lot of improvements could be made here (better error handling, use the 95 printable ASCII chars instead of a hard coded alphabet string, etc), but eh, it works, I solo'd this CTF, and it was late in the day.

Letting that run, after about 10 minutes we get the flag produced: `F#{us1ng-X0r-is-ROx-4-l0t}`.

## Dungeon Escape
> Server: 142.93.113.55
>
> Port: 31085

![]({{ site.baseurl }}/img/fireshell/dungeon_menu.png){:height="60%" width="60%"}

Another game. This time, we have to escape from a prison. In order to win, we need to succesfully identify the shortest path out of a given maze, a bunch of times in a row.

The issue, we're given about 2 seconds to give an answer, before we're timed out. So defintely not doable manually, even for the first (easiest) one.

![]({{ site.baseurl }}/img/fireshell/dungeon_timedout.png){:height="30%" width="30%"}

This task reminded me of something we learned in university in an Algorithms/Data structures class, but I couldn't think of what it was right away. After a bit of fiddling, I remembered what it was: [Dijkstra's algorithm](https://en.wikipedia.org/wiki/Dijkstra%27s_algorithm).
> ... finding the shortest paths between nodes in a graph ...

In this case, our "nodes" are the doors, and our paths are given to us.

For the meat of the algorithm, I borrowed from a [previously finished python implementation, by Maria Boldyreva](https://dev.to/mxl/dijkstras-algorithm-in-python-algorithms-for-beginners-dkc).

There's a few things though that need to be done in order for it to work:
1. Read the given rules per round into a Graph format that we can use Dijkstra's algorithm against.
2. Figure out how to account for the gate's opening at various intervals.

End result: Code stored at [capture the flag code](https://github.com/bigpick/CaptureTheFlagCode/blob/master/fireshell_2020/dungeon_escape.py).

1 is just some `pwntools` and Python code, combined in a loop with the above code.

The concept of 2 is not something accounted for with any Dijkstra I could find. It made the most sense to me to add the "waiting" logic into the part of the Dijkstra code where we are calculating the distance between two nodes, since essentially any door-opening-wait-time would just count as more "distance".

```python
        while vertices:
            current_vertex = min(vertices, key=lambda vertex: distances[vertex])
            vertices.remove(current_vertex)
            if distances[current_vertex] == inf:
                break
            else:
                # We need to take into the account of waiting for the modulo
                # intervals for a given door here:
                while distances[current_vertex] % door_times[current_vertex] != 0:
                    distances[current_vertex] += 1
```

Then, instead of returning the path, we can just return the calculated distance of that path:

```python
        # ...
        total_distance = distances[path[-1]]
        return total_distance
```

Initially, I thought this could affect our starting door, as well, since in every case the start door (i.e. door to your cell) had a time of `1`. Originally, I had then set the initial distance to be `1`, instead of `0`:

```python
    def dijkstra(self, source, dest):
        # ...
        distances[source] = 1
        # ...
```

Running this code, it seemed to almost always fail on the second example, returning a distance of `inf`. So for some reason it was thinking that we could not get to a end gate. I copied a failed example and did it by hand, and the answer was obvious. We are given paths in the form of:

```
doorX doorY pathTime
```

Originally, I only stored this into the graph as a path going from node doorX to node doorY. In reality, we could use it in either direction. So we simply need to add each path's inverse:

```python
def get_path_times(conn: pwnlib.tubes.remote.remote, rounds) -> Mapping[int, int]:
    path_listing = []
    for round_ in range(rounds):
        round_ = conn.recvline().decode("utf-8").split()
        path_listing.append((int(round_[0]), int(round_[1]), int(round_[2])))
        # Add it's inverse:
        path_listing.append((int(round_[1]), int(round_[0]), int(round_[2])))
    return Graph(path_listing)
```

However, running this code, it seemed to work about 80% of the time, and then eventually fail. This really stumped me for quite a while. I turned on debug mode for pwntools, and hand copied a bunch of the examples that it failed, and was getting the same answer.

| | | |
|---
| ![]({{ site.baseurl }}/img/fireshell/byhand1.jpg){:height="20%" width="60%"} | ![]({{ site.baseurl }}/img/fireshell/byhand2.jpg){:height="20%" width="60%"} | ![]({{ site.baseurl }}/img/fireshell/byhand3.jpg){:height="20%" width="60%"} |
|---
| | | |

So the code and algorithm were definitely working as intended, and as I had written it to. **However**, it turned out that setting our initial door to be distance 1 instead of 0, I introduced a bug. Re-reading the challenge prompt:

```
...
     All doors start at time zero together and if a door has time equals to 3,
     this door will open only at times 0, 3, 6, 9, ... So if you reach a door
     before it is open, you will need to wait until the door is open.
...
```

So _every_ door is open initially, starting at time 0, not their first interval occurence. Updating our "source" node's gate accordingly:

```python
        # Set our start to the initial door's gate time (BUG):
        #distances[source] = door_times[source]
        distances[source] = 0
```

And then running it:

```python
python dungeon_escape.py
[+] Opening connection to 142.93.113.55 on port 31085: Done
Round: 0
Round: 1
Round: 2
Round: 3
Round: 4
Round: 5
Round: 6
Round: 7
Round: 8
Round: 9
Round: 10
Round: 11
Round: 12
Round: 13
Round: 14
Round: 15
Round: 16
Round: 17
Round: 18
Round: 19
Round: 20
Round: 21
Round: 22
Round: 23
Round: 24
Round: 25
Round: 26
Round: 27
Round: 28
Round: 29
Round: 30
Round: 31
Round: 32
Round: 33
Round: 34
Round: 35
Round: 36
Round: 37
Round: 38
Round: 39
Round: 40
Round: 41
Round: 42
Round: 43
Round: 44
Round: 45
Round: 46
Round: 47
Round: 48
Round: 49


     The answer is:  [+] Correct!

 [+] Nice, the flag is: F#{KREEKX2DJ5JFERKDKRPUMTCBI5PUSU27KREEKX2CIFJUKMZS}
```

Flag is: `F#{KREEKX2DJ5JFERKDKRPUMTCBI5PUSU27KREEKX2CIFJUKMZS}`.

Code is stored with my [capture the flag code](https://github.com/bigpick/CaptureTheFlagCode/blob/master/fireshell_2020/dungeon_escape.py), for full inspection if desired.

# recon

## Welcome
>
> Welcome to FireShell CTF 2020.
>
> Follow us in our social networks:
>
> * [Facebook](https://www.facebook.com/fireshellst/)
> * [Instagram](https://instagram.com/fireshellsecurityteam)
> * [Linkedin](https://www.linkedin.com/company/fireshell-security-team/)
> * [Telegram](https://t.me/fireshellnews/)
> * [Twitter](https://twitter.com/fireshellst)

Heading to their Twitter page:

![]({{ site.baseurl }}/img/fireshell/twitter.png){:height="60%" width="60%"}

We notice that there is a QR code as part of the most recent image, which we can pull out:

![]({{ site.baseurl }}/img/fireshell/qr.png){:height="20%" width="20%"}

And then, using a simple [online tool to read the QR code](https://online-barcode-reader.inliteresearch.com/), we get the flag:


![]({{ site.baseurl }}/img/fireshell/qr_results.png){:height="70%" width="70%"}
