---
author: george_pick
layout: post
title: "Basic Binary Packing (UPX)"
excerpt: "pwnable.kr challenge: flag"
categories: [pwn practice]
---

> Papa brought me a packed present! let's open it.
>
> Download : http://pwnable.kr/bin/flag
> This is reversing task. all you need is binary

## Read
* This pretty lengthy [PDF on "Introduction to Reverse Engineering"](https://www.cs.tau.ac.il/~tromer/courses/infosec11/lecture9.pdf) from the Blavantik school of Computer Science, Tel Aviv University (kinda not great, but gives an intro at least)

> Reverse engineering is the process of discovering the technological principles of a device, object, or system through analysis of its structure, function, and operation.

OK - so based on this challenge task prompt, we're going to have to somehow breakdown this `flag` binary/executable into the flag.

> Sometimes, the code resists
>
> – Packers and compressors

Prompt mentions something about Papa giving us a _packed_ present, and here they talk about `Packers` -- maybe look this up next.


* This free open book on ["Reverse Engineering for Beginners"](https://mirrors.ocf.berkeley.edu/parrot/misc/openbooks/programming/ReverseEngineeringForBeginners.en.pdf) (taken from a Berkeley college mirror).

Also, the website for it: [here](https://beginners.re/).

> ... This book is therefore intended for those who want to understand assembly language rather than to code in it ...

This is a pretty hefty book. Maybe will bookmark for later reading. Seems decent so far though.

## Given
* The link to the binary to download -- `http://pwnable.kr/bin/flag`.

We're told all this is needed, and that it's a reversing task. So... we'll need to reverse the compiled executable.


## Download file

```bash
wget http://pwnable.kr/bin/flag
```

OK - we got a file named `flag` in our working dir now.

## Look at the file

```bash
ls -alrt flag
  rw-r--r--  <user>  staff   327 KiB  Wed May 15 20:27:21 2019    flag
```

Hm, ok. Not much there. What about the hint, something to do with `pack`/`packing`?

Google: what is executable packing c
* [First result](http://yaisb.blogspot.com/2006/07/packed-executables.html)

OK seems pretty informative. `strings` command against a binary will show data in the binary file, but that's won't work if it's "packed".
> Packing an executable file is a way of compressing executable code firstly to minimize filesizes, but often it is also used to complicate the reverse engineering process.

So seems like it's a way to save space for an executable, but also doubles as making RE harder.

`strings flag` (i.e. running `strings` against our file `flag`) shows what looks like a bunch of non-coherent strings.

Though, some stuff looks valid:
* `UPX!`
* `TRANSLITA` (?)
* `TOP_PAD`
...
* `PROT_EXEC|PROT_WRITE failed.`
* `$Info: This file is packed with the UPX executable packer http://upx.sf.net $`
* `$Id: UPX 3.08 Copyright (C) 1996-2011 the UPX Team. All Rights Reserved. $`
* `GCC: (Ubuntu/Linaro 4.6.3-1u)#`
...
* `UPX!`
* `UPX!`

Hm, it really likes `UPX!`. That middle section gives us an idea of what that is.

In that link from google, there was also an example of UPX:
> many public packers available on the internet, and most of them leave a very recognizable signature in the unpacking routine ... clear indication that we should look into unpacking UPX ...

## Unpack UPX

Looks like upx is pretty simple, and we can actually just download the unpacker of upx.

Quick look around, seems like `upx` is installed by default here (Ubuntu 19.10 container):

```bash
which upx
/usr/bin/upx

upx -h
                       Ultimate Packer for eXecutables
                          Copyright (C) 1996 - 2018
UPX 3.95        Markus Oberhumer, Laszlo Molnar & John Reiser   Aug 26th 2018

Usage: upx [-123456789dlthVL] [-qvfk] [-o file] file..

Commands:
  -1     compress faster                   -9    compress better
  --best compress best (can be slow for big files)
  -d     decompress                        -l    list compressed file
  -t     test compressed file              -V    display version number
  -h     give this help                    -L    display software license

Options:
  -q     be quiet                          -v    be verbose
  -oFILE write output to 'FILE'
  -f     force compression of suspicious files
  --no-color, --mono, --color, --no-progress   change look
...
```

Hm - `upx -d` seems like a good shot.

## `upx -d` -- unpack UPX packed executable

Copied the executable into the container, then:

```bash
upx -d flag
                       Ultimate Packer for eXecutables
                          Copyright (C) 1996 - 2018
UPX 3.95        Markus Oberhumer, Laszlo Molnar & John Reiser   Aug 26th 2018

        File size         Ratio      Format      Name
   --------------------   ------   -----------   -----------
    883745 <-    335288   37.94%   linux/amd64   flag

Unpacked 1 file.
```

OK -- what about `strings` again?

## `strings` -- now unpacked

OK - this looks much more legible.

Scrolling through, bunch of junk...

Then, this looks particular:

```bash
UPX...? sounds like a delivery service :)
I will malloc() and strcpy the flag there. take it.
```

Maybe try that?

Bingo!

Flag is: `UPX...? sounds like a delivery service :)`
