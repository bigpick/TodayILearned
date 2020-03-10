---
layout: post
title: "Basic MD5 Collisons"
excerpt: "pwnable.kr challenge: collision"
categories: [pwn practice]
---

> Daddy told me about cool MD5 hash collision today.
>
> I wanna do something like that too!
>
> ssh col@pwnable.kr -p2222 (pw:guest)

### Given
All we're given in this is a ssh login command, and it's password:

* `ssh col@pwnable.kr -p2222 (pw:guest)`

The text hint and the title of the challenge suggest that we will be dealing with something involving md5 hash collisions.

See:
* [Dalhousie University -- Collisions in the MD5 cryptographic hash function](https://www.mscs.dal.ca/~selinger/md5collision/) and the links contained therein.
* [Wikipedia -- MD5](https://en.wikipedia.org/wiki/MD5)
  * [Generally - Wikipedia -- Hashing functions](https://en.wikipedia.org/wiki/Cryptographic_hash_function)

### First, lets get on the box

```bash
...
col@pwnable:~$
```

### Look around

```bash
col@pwnable:~$ ls -alrt
total 36
-r--r-----   1 col_pwn col_pwn   52 Jun 11  2014 flag
-r-sr-x---   1 col_pwn col     7341 Jun 11  2014 col
d---------   2 root    root    4096 Jun 12  2014 .bash_history
-rw-r--r--   1 root    root     555 Jun 12  2014 col.c
dr-xr-xr-x   2 root    root    4096 Aug 20  2014 .irssi
drwxr-xr-x   2 root    root    4096 Oct 23  2016 .pwntools-cache
drwxr-x---   5 root    col     4096 Oct 23  2016 .
drwxr-xr-x 116 root    root    4096 Nov 12 21:34 ..
```

We can ignore most of that stuff. What's interesting to us are these entries:

```bash
-r--r-----   1 col_pwn col_pwn   52 Jun 11  2014 flag
-r-sr-x---   1 col_pwn col     7341 Jun 11  2014 col
-rw-r--r--   1 root    root     555 Jun 12  2014 col.c
```

Oh, a `flag` file. Too bad, see [cat flag -- profit?](./file-descriptor-pwn#cat-flag--profit) from the first challenge.

### Inspect files

So that leaves us with `col` and `col.c`. In the `ls -alrt` above, `col` is executable. Given the naming conventions, it would seem that `col` is a compiled binary for the `col.c` file.

Checking `col`'s type:

```bash
file col
col: setuid ELF 32-bit LSB executable, Intel 80386, version 1 (SYSV), dynamically linked, interpreter /lib/ld-, for GNU/Linux 2.6.24, BuildID[sha1]=05a10e253161f02d8e6553d95018bc82c7b531fe, not stripped
```

Ok, so it is an executable. [Specifically](https://www.linuxtopia.org/online_books/an_introduction_to_gcc/gccintro_89.html), it's an executable that when ran, will run as the identity of the owner of the file `... setuid ....`.

It is a `32-bit` executable, compiled for a **Little Endian** (`LSB`) machine, and and compiled for the Intel 386 and compatible processors (`Intel 80386`).

`version 1 (SYSV)` -- This is the version of the internal format of the file.

`dynamically linked` means that third library code is not pulled in until the program is ran (as opposed to it being statically linked, in which the code would be stuffed in during compile time -- see [here](https://stackoverflow.com/a/311889)).

`ELF` means [Executable and Linkable Format](https://en.wikipedia.org/wiki/Executable_and_Linkable_Format); [man page here](http://man7.org/linux/man-pages/man5/elf.5.html). See [here](https://en.wikipedia.org/wiki/Comparison_of_executable_file_formats) for a comparison of executable file formats; for now, it doesn't mean much to us.

The `not stripped` is a reference to the fact that when compiled, extra debug information not necesarry for the execution of the file (aka `symbol table`). See [the manpage for strip](https://linux.die.net/man/1/strip) for more info on options.

### Run it

```bash
./col
usage : ./col [passcode]

./col hackslul
passcode length should be 20 bytes
```

So - it seems to want a passcode, and it is expecting it to be `20 bytes`

```bash
./col aaaaaaaaaaaaaaaaaaaa
wrong passcode.
```

Time to look at the source.

### Examine (given) source
`cat col.c` gives us:

```c
#include <stdio.h>
#include <string.h>
unsigned long hashcode = 0x21DD09EC;
unsigned long check_password(const char* p){
	int* ip = (int*)p;
	int i;
	int res=0;
	for(i=0; i<5; i++){
		res += ip[i];
	}
	return res;
}

int main(int argc, char* argv[]){
	if(argc<2){
		printf("usage : %s [passcode]\n", argv[0]);
		return 0;
	}
	if(strlen(argv[1]) != 20){
		printf("passcode length should be 20 bytes\n");
		return 0;
	}

	if(hashcode == check_password( argv[1] )){
		system("/bin/cat flag");
		return 0;
	}
	else
		printf("wrong passcode.\n");
	return 0;
}
```

So this time we're working with two functions, `main` amd `check_password`.

First, it's checking if we passed the executable at least one arg:

```c
	if(argc<2){
		printf("usage : %s [passcode]\n", argv[0]);
		return 0;
	}
```

Then, it takes the `strlen` of what we gave it as the first argument, and compares it against `20`. If it doesn't match, it quits.
* See [gnu page on string length](https://www.gnu.org/software/libc/manual/html_node/String-Length.html)
> The strlen function returns the length of the string s in bytes.

Next, the meat and potatoes. It checks if `hashcode` (which is hardcoded to be `0x21DD09EC`) is equal to the output of `check_password` against our input argument, and if so, `cat`s the flag.

```c
	if(hashcode == check_password( argv[1] )){
```

### `check_password`

So, in `main` we're calling `check_password(argv[1])`. Note the input argument type in `check_password`:

```c
check_password(const char* p)
```

First thing this function does is cast our input argument to an `int*`:

```c
	int* ip = (int*)p;
```

Then, it declares some helper variables:

```c
	int i;
	int res=0;
```

Lastly, we get a `for` loop:

```c
	for(i=0; i<5; i++){
		res += ip[i];
	}
```

This is going from 0 to 5 (so five total iterations, i=0, i=1, i=2, i=3, i=4) and doing:

```c
		res += ip[i];
```

That is, for each iteration, it is adding the value at `ip[i]` to the resulting variable, `res`.

This `res` is then returned back to main, and checked against `hashcode`.

### Takeaway

We need to get the loop in `check_password` to end up returning a `res` that is equal to the magic value, `0x21DD09EC`.


### Python -- easy hex to dec

Can use python to easily see what the value of `0x21DD09EC` is in decimal:

```bash
python -c 'print(0x21DD09EC)'
568134124
```

So, we need something that over 5 iterations, sums up to that.

```bash
python -c 'print(568134124 % 5)'
4
```

OK - so it's not divisible exactly by 5 (duh, `...4`), so we'll need four numbers that almost sum up to our value, and then one more to get us there.

```bash
python -c 'print(568134124 // 5)'
113626824
```

This is our "almost sums up to our value" number. So from this, we can figure out the one remaining odd-ball:

```bash
python -c 'print(113626824*4)'
454507296

python -c 'print(568134124 - 454507296)'
113626828
```

So - we have `113626824` (four four times) and then `113626828`.

Now, we need a string that represents these, so that we can pass it to the function:

```bash
python -c 'print(hex(113626824))'
0x6c5cec8

python -c 'print(hex(113626828))'
0x6c5cecc
```

So, we can pass these values to the function:

```bash
print "\x06\xc5\xce\xc8"*4 + "\x06\xc5\ce\xcc"
�������������\ce�

./col $(python -c 'print("\x06\xc5\xce\xc8"*4 + "\x06\xc5\ce\xcc")')
passcode length should be 20 bytes
```

Huh - what's the deal? If you look at the len of that in python, it actually shows up at `22` -- so somehow we're getting two extra bytes.

How we passed the input to the executable isn't inline with what we determined earlier, that it was Little Endian.

If we instead pass the input to satisfy that, we stop counting those two extra `0`s and we get the flag:

```bash
col@pwnable:~$ ./col $(python -c 'print("\xc8\xce\xc5\x06"*4 + "\xcc\xce\xc5\x06")')
daddy! I just managed to create a hash collision :)
```

Flag is `daddy! I just managed to create a hash collision :)`.
