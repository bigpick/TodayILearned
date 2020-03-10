---
layout: post
title: "File Descriptors"
excerpt: "pwnable.kr challenge: fd"
categories: [pwn practice]
---

> Mommy! what is a file descriptor in Linux?
>
> * Try to play the wargame your self but if you are ABSOLUTE beginner, follow this tutorial link:
> https://youtu.be/971eZhMHQQw
>
> `ssh fd@pwnable.kr -p2222` (pw:guest)

### Given

All we're given in this is a ssh login command, and it's password

* `ssh fd@pwnable.kr -p2222 (pw:guest)`

The text hint and the title of the challenge suggest that we will be dealing with something involving manipulating or exploting file descriptors,
* See [Wikipedia](https://en.wikipedia.org/wiki/File_descriptor).
* See [SO "file descriptors in simple terms"](https://stackoverflow.com/questions/5256599/what-are-file-descriptors-explained-in-simple-terms) at the time of this writing the the top answer kinda sucks, so ymmv.

### First, lets get on the box

```bash
...
fd@pwnable:~$
```

OK - we're on.

### Look around

```bash
fd@pwnable:~$ ls -alrt
total 40
-r--r-----   1 fd_pwn root   50 Jun 11  2014 flag
-rw-r--r--   1 root   root  418 Jun 11  2014 fd.c
-r-sr-x---   1 fd_pwn fd   7322 Jun 11  2014 fd
d---------   2 root   root 4096 Jun 12  2014 .bash_history
drwxr-xr-x   2 root   root 4096 Oct 23  2016 .pwntools-cache
-rw-------   1 root   root  128 Oct 26  2016 .gdb_history
drwxr-x---   5 root   fd   4096 Oct 26  2016 .
dr-xr-xr-x   2 root   root 4096 Dec 19  2016 .irssi
drwxr-xr-x 116 root   root 4096 Nov 12 21:34 ..
```

We can ignore most of that stuff. What's interesting to us are these entries:

```bash
-r--r-----   1 fd_pwn root   50 Jun 11  2014 flag
-rw-r--r--   1 root   root  418 Jun 11  2014 fd.c
-r-sr-x---   1 fd_pwn fd   7322 Jun 11  2014 fd
```

### cat flag -- profit?
Nope - can't do that. Notice ownership on the `flag`  file:

* owner = `fd_pwn`
* group = `root`

So, root owned and belongs to the `fd_pwn` group, which we are not a part of:

```bash
cat /etc/group | grep fd_pwn
fd_pwn:x:1006:
```

### Inspect files

So that leaves us with `fd` and `fd.c`. In the above, `fd` is executable. Given the naming conventions, it would seem that `fd` is a compiled binary for the `fd.c` file.

Checking `fd`'s type:

```bash
file fd
fd: setuid ELF 32-bit LSB executable, Intel 80386, version 1 (SYSV), dynamically linked, interpreter /lib/ld-, for GNU/Linux 2.6.24, BuildID[sha1]=c5ecc1690866b3bb085d59e87aad26a1e386aaeb, not stripped
```

Ok, so it is an executable. Specifically, it's a `32-bit` executable, that when ran, will run as the identity of the owner of the file `... setuid ...`.

### Run it

```bash
fd@pwnable:~$ ./fd
pass argv[1] a number

fd@pwnable:~$ ./fd 0
learn about Linux file IO
```

So, if you give it any old number, it just spits out a message about "go learn about linux I/O". Let's looks at what we think is the source code first.

### Examine (given) source
`cat fd.c` gives us:

```c
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
char buf[32];
int main(int argc, char* argv[], char* envp[]){
	if(argc<2){
		printf("pass argv[1] a number\n");
		return 0;
	}
	int fd = atoi( argv[1] ) - 0x1234;
	int len = 0;
	len = read(fd, buf, 32);
	if(!strcmp("LETMEWIN\n", buf)){
		printf("good job :)\n");
		system("/bin/cat flag");
		exit(0);
	}
	printf("learn about Linux file IO\n");
	return 0;

}
```

So we see we're working with a single function program, which just consists of a `main` function.

First, it's checking if we passed the executable at least one arg:

```c
	if(argc<2){
		printf("pass argv[1] a number\n");
		return 0;
	}
```
Then, it takes the first thing we give it, converts it to a `int`, and then subtracts `0x1234` from it, and stores it in a variable called `fd`:

```c
int fd = atoi( argv[1] ) - 0x1234;
```

Then, it reads 32 bytes from the calculated `fd` above to the `char buf[32]`.

Lastly, it checks if the value in `buf` is equal to `LETMEWIN\n`, and if so, `cat`s the flag:

```c
	if(!strcmp("LETMEWIN\n", buf)){
		printf("good job :)\n");
		system("/bin/cat flag");
		exit(0);
	}
```

### Takeaway

So, we need to somehow get `buf` to have `LETMEWIN\n`. The key part here is that `buf` is getting read from whatever file descriptor is calculated based on our input minus `0x1234`.

In linux, STDIN is also `fd 0`. So, if we can get our input, minus `0x1234` to be `0`, we should be able to just type the password in to the terminal, hit enter, and profit.

### Python -- easy hex to dec

Can use python to easily see what the value of `0x1234` is in decimal:

```bash
python -c "print(0x1234)"
4660
```

### Solve

```bash
./fd 4660
LETMEWIN
good job :)
mommy! I think I know what a file descriptor is!!
```

Flag is `mommy! I think I know what a file descriptor is!!`.
