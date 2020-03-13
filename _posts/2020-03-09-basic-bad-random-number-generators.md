---
author: george_pick
layout: post
title: "Basic Bad 'Random' Number Generator Vulnerability"
excerpt: "pwnable.kr challenge: random"
categories: [pwn practice]
---

> Daddy, teach me how to use random value in programming!
>
> ssh random@pwnable.kr -p2222 (pw: guest)

## Given
All we're given in this is a ssh login command, and it's password
* `ssh random@pwnable.kr -p2222 (pw:guest)`

The text hint implies it's going to be a vuln that has to deal with using "random" values in a program -- maybe bad/predictable seeding?

## First, lets get on the box

```bash
...
random@pwnable:~$
```

## Look around

```bash
...
-rw-r--r--   1 root       root    301 Jun 30  2014 random.c
-r-sr-x---   1 random_pwn random 8538 Jun 30  2014 random
-r--r-----   1 random_pwn root     49 Jun 30  2014 flag
...
```

So, we see a `random` executable and it's source code (again, how nice).

## Execute it

```bash
./random
<just sits here, try some input>
AAAAAAAAAAAAAAAAAA
Wrong, maybe you should try 2^32 cases.
```

2^32 cases -- so, sounds like it must be looking for a number, since thats the number of possible ints?

## Examine (given) source

```c
#include <stdio.h>

int main(){
	unsigned int random;
	random = rand();	// random value!

	unsigned int key=0;
	scanf("%d", &key);

	if( (key ^ random) == 0xdeadbeef ){
		printf("Good!\n");
		system("/bin/cat flag");
		return 0;
	}

	printf("Wrong, maybe you should try 2^32 cases.\n");
	return 0;
}
```

OK - one function, just `main`

## `main`

Declares an `unsigned int` for the variable `random`. Then it assings random to a "random" value using `rand()` (with no previous seed, at all, so it's just getting the default value)

OK - looks like we already found the vulnerability. This "random" value is actually not random at all, since there is no random seed. Essentially, everytime this program is called, it'll generate the same "random" numbers, since it justs uses `rand()` and not even a static pre-seed, so it's getting the default value, [which for c rand() is 1](https://linux.die.net/man/3/rand).

So - if we just make our own program like so:

```c
#include <stdio.h>

int main(){
	unsigned int random;
	random = rand();	// random value!
	printf("haax: %d\n", random);
	return 0;
}
```

And then compile it and run it:

```
./myrand
haax: 16807

./myrand
haax: 16807

./myrand
haax: 16807
```
For ever and ever, since it's always getting the same preseed: `1`. So if we do this on the machine where the executable lives, we can know what the first "random" value it will generate, so we know the value of `random`.

Though, this is only useful if we can compile and run our own program on the remote server, which we can't. So, instead we can start the program on the remote server in `peda` and find where the "random" value is getting stored in memory. Then, we can inspect the value at that address, and find our "random" number.

```
peda random
gdb-peda$ disas main
Dump of assembler code for function main:
   0x00000000004005f4 <+0>:	push   rbp
   0x00000000004005f5 <+1>:	mov    rbp,rsp
   0x00000000004005f8 <+4>:	sub    rsp,0x10
   0x00000000004005fc <+8>:	mov    eax,0x0
   0x0000000000400601 <+13>:	call   0x400500 <rand@plt>
   0x0000000000400606 <+18>:	mov    DWORD PTR [rbp-0x4],eax
   0x0000000000400609 <+21>:	mov    DWORD PTR [rbp-0x8],0x0
   0x0000000000400610 <+28>:	mov    eax,0x400760
   0x0000000000400615 <+33>:	lea    rdx,[rbp-0x8]
   0x0000000000400619 <+37>:	mov    rsi,rdx
   0x000000000040061c <+40>:	mov    rdi,rax
   0x000000000040061f <+43>:	mov    eax,0x0
   0x0000000000400624 <+48>:	call   0x4004f0 <__isoc99_scanf@plt>
   0x0000000000400629 <+53>:	mov    eax,DWORD PTR [rbp-0x8]
   0x000000000040062c <+56>:	xor    eax,DWORD PTR [rbp-0x4]
   0x000000000040062f <+59>:	cmp    eax,0xdeadbeef
   0x0000000000400634 <+64>:	jne    0x400656 <main+98>
   0x0000000000400636 <+66>:	mov    edi,0x400763
   0x000000000040063b <+71>:	call   0x4004c0 <puts@plt>
   0x0000000000400640 <+76>:	mov    edi,0x400769
   0x0000000000400645 <+81>:	mov    eax,0x0
   0x000000000040064a <+86>:	call   0x4004d0 <system@plt>
   0x000000000040064f <+91>:	mov    eax,0x0
   0x0000000000400654 <+96>:	jmp    0x400665 <main+113>
   0x0000000000400656 <+98>:	mov    edi,0x400778
   0x000000000040065b <+103>:	call   0x4004c0 <puts@plt>
   0x0000000000400660 <+108>:	mov    eax,0x0
   0x0000000000400665 <+113>:	leave
   0x0000000000400666 <+114>:	ret
End of assembler dump.
break * 0x0000000000400610
Breakpoint 1 at 0x400610
r
...
Breakpoint 1, 0x0000000000400610 in main ()
```

Now, if we check the registers:

```
gdb-peda$ x/x ($rbp-0x4)
0x7fffffffe5ec:	0x004006706b8b4567 # this is our "random" number
```

So, in order to find what we need to input, we have to take the inverse of XOR, which is... just XOR:

```
a ^ b == 0xdeadbeef
a ^ 0x004006706b8b4567 == 0xdeadbeef
a = 0x004006706b8b4567 ^ 0xdeadbeef
```

In python:

```python
>>> 0x004006706b8b4567 ^ 0xdeadbeef
18021479654816648
```

Let's try it out...

`random_pwn.py`:

```python3
#!/usr/bin/python
from pwn import *

# Our payload to XOR with the "Random" value to get 0xdeadbeef
payload = '18021479654816648'

# Start a new ssh session to the box:
session = ssh(host='pwnable.kr', user='random', password='guest', port=2222)
assert session.connected()

# Execute ./random on the session:
process = session.process(executable='./random')

# Send our payload to it, since it'll expect us to enter the value to STDIN:
process.sendline(payload)
while 1<2:
    try:
        print(process.recvlineS())
    except EOFError as e:
        break
```

Running it:

```
python3 random_pwn.py
[+] Connecting to pwnable.kr on port 2222: Done
[*] random@pwnable.kr:
    Distro    Ubuntu 16.04
    OS:       linux
    Arch:     amd64
    Version:  4.4.179
    ASLR:     Enabled
[+] Starting remote process './random' on pwnable.kr: pid 173346
b'Good!\n'
b'Mommy, I thought libc random is unpredictable...\n'
```

Sweet! Flag is `Mommy, I thought libc random is unpredictable...`

For this code, see my [Git repo](https://github.com/bigpick/pwnable.kr) for pwnable.kr practice code.
