---
author: george_pick
layout: post
title: "Mistakes (C Operator Precedence)"
excerpt: "pwnable.kr challenge: mistake"
categories: [pwn practice]
---

> We all make mistakes, let's move on.
> (don't take this too seriously, no fancy hacking skill is required at all)
>
> This task is based on real event
> Thanks to dhmonkey
>
> hint : operator priority
>
> ssh mistake@pwnable.kr -p2222 (pw:guest)

## Given
All we're given in this is a ssh login command, and it's password:

* `ssh mistake@pwnable.kr -p2222 (pw:guest)`

The text hint and the title of the challenge suggest that we will be dealing with something involving incorrect operator precedance.

It also suggests it is based on a real event.

## Read
* [Common Weakness Enumeration (CWE)](https://cwe.mitre.org/data/definitions/783.html) on operator precedence logical errors.
* [C++/C Operator Precedence](https://en.cppreference.com/w/c/language/operator_precedence) table.

PEMDAS people! ;)


## First, lets get on the box

```bash
...
mistake@pwnable:~$
```

## Look around

```bash
ls -alrt
# ...
-r--------   1 mistake_pwn root      10 Jul 29  2014 password
-r--------   1 mistake_pwn root      51 Jul 29  2014 flag
-rw-r--r--   1 root        root     792 Aug  1  2014 mistake.c
-r-sr-x---   1 mistake_pwn mistake 8934 Aug  1  2014 mistake
# ...
```

## Inspect files

```
file mistake
mistake: setuid ELF 64-bit LSB executable, x86-64, version 1 (SYSV), dynamically linked, interpreter /lib64/l, for GNU/Linux 2.6.24, BuildID[sha1]=ef56e67046843c3d794fda2e5842140e937dd7c6, not stripped
```

## Run it

```
mistake@pwnable:~$ ./mistake
do not bruteforce...
<sits here for some time>
```

OK - I gave up waiting, I tried some input:

```
./mistake
do not bruteforce...
a
input password : AAAAAAA
Wrong Password
mistake@pwnable:~$
```

On subsequent re-runs, it seems that the bruteforce message is displayed and then requires user input to get to the input password prompt, but only after some time.

## Examine (given) source

```c
#include <stdio.h>
#include <fcntl.h>

#define PW_LEN 10
#define XORKEY 1

void xor(char* s, int len){
	int i;
	for(i=0; i<len; i++){
		s[i] ^= XORKEY;
	}
}

int main(int argc, char* argv[]){

	int fd;
	if(fd=open("/home/mistake/password",O_RDONLY,0400) < 0){
		printf("can't open password %d\n", fd);
		return 0;
	}

	printf("do not bruteforce...\n");
	sleep(time(0)%20);

	char pw_buf[PW_LEN+1];
	int len;
	if(!(len=read(fd,pw_buf,PW_LEN) > 0)){
		printf("read error\n");
		close(fd);
		return 0;
	}

	char pw_buf2[PW_LEN+1];
	printf("input password : ");
	scanf("%10s", pw_buf2);

	// xor your input
	xor(pw_buf2, 10);

	if(!strncmp(pw_buf, pw_buf2, PW_LEN)){
		printf("Password OK\n");
		system("/bin/cat flag\n");
	}
	else{
		printf("Wrong Password\n");
	}

	close(fd);
	return 0;
}
```

Two function program: main and xor.

## `main()`

Starts off by declaring an integeger named `fd`. Then, it proceeds to set that variable to the value of opening the `password` file. But, we already see some operator precedence boo-boos:

```c
	if(fd=open("/home/mistake/password",O_RDONLY,0400) < 0){
		printf("can't open password %d\n", fd);
		return 0;
	}
```

In C, the relational operators have a higher precedence than the simple assignment operator (check the reading list).

So, this block is actually like so:

```c
	if( fd = (open("/home/mistake/password", O_RDONLY,0400) < 0) ){
		printf("can't open password %d\n", fd);
		return 0;
	}
```

So first the open call will be compared to being `< 0`, and then the value of that operation will be set to `fd`.

Examining the [man page](https://linux.die.net/man/3/open) for open shows:
> Upon successful completion, the function shall open the file and return a non-negative integer representing the lowest numbered unused file descriptor ...

So the check against it being less than `0` will always yield false, which in `c` means _zero_. This explains why it need me to press enter or a or something in addition to waiting the delay time; the file descriptor associated with `0` is STDIN. So we'll probably be able to control what the "password" is by whatever we give it on standard input.

Then in continues, giving us that bruteforce message:

```c
	printf("do not bruteforce...\n");
	sleep(time(0)%20);
```

So that explains the delay even if we feed STDIN something right away; it's taking the current time and `mod`ing it by 20.

Then it proceeds to create a char array named `pw_buf` that is of size 11, along with an integer for `len`.

Followed by more precedence ugliness:

```c
	if(!(len=read(fd,pw_buf,PW_LEN) > 0)){
		printf("read error\n");
		close(fd);
		return 0;
	}
```

Which is really being executed as compare the return of `read` with `0`, assign that to len, and then not it:

```c
	if( ! (len = (read(fd,pw_buf,PW_LEN) > 0) ) ){
		printf("read error\n");
		close(fd);
		return 0;
	}
```

Here, it's reading up to PW_LEN bytes from our fd (which is actually standard input) into the password buffer.


Next, it proceeds to set us up another buffer, this time for our _expected_ input. Same size, and uses `scanf` with a formatter to specify to read 10 chars:

```c
	char pw_buf2[PW_LEN+1];
	printf("input password : ");
	scanf("%10s", pw_buf2);
```

Penultimately, it uses the `xor` function to compare our input in pw_buf2 with a static decimal value `10`.

```c
void xor(char* s, int len){
	int i;
	for(i=0; i<len; i++){
		s[i] ^= XORKEY;
	}
}
```

So here, it's taking a passing in char\*, and then for every character in the array, assigning it the XOR'ed value of it with the XOR key, which is `1`.


Finally, it uses `strncmp` to compare the password buffer with our input buffer, comparing _at most_ PW_LEN bytes.
* Return is < 0 if first string is less than the second
* Return is > 0 if second string is less then the first
* Return 0 if equal

The result is negated, and then passed to an `if` statement, where if true, we get the flag.



## Takeaway

The `password` file is useless. We completely control what the program thinks that is, since the FD it's using for that 'file' ends up being standard input. We then know that it's compared to the XOR'ed value of what we pass in at the password prompt.

So we need to pass it 10 characters, that when compared with something that's XOR'ed with `1`, is equal.

The easiest thing would probably be exactly opposite 1/0 strings. Since we know that if we give a "password" of ten 0's, finding something that results in that when each char is XOR'ed with 1 is just 1.

Recall from [talking about XOR being it's own inverse](https://bigpick.github.io/TodayILearned/articles/2020-03/xor-inverse):

```python
a ^ b = c
```

For a single character comparison, `b` is one since that's statically defined, and `c` is 0 since that's what we gave the STDIN password. So our character we need to input to the "real" prompt is:

```python
a = b ^ c
a = 1 ^ 0
a = 1
```

So if we pass all zeros for the password file, we should pass all one's for the prompt:

```
mistake@pwnable:~$ ./mistake
do not bruteforce...
0000000000
input password : 1111111111
Password OK
Mommy, the operator priority always confuses me :(
```

Boom. And it's easy to do this for any other number too; just calculate `a` in something like python and you're all set:

```
mistake@pwnable:~$ ./mistake
do not bruteforce...
9999999999
...
>>> 9^1
8
...
input password : 8888888888
Password OK
Mommy, the operator priority always confuses me :(
```

## Tl;dr
Use parenthesis people!!!

## pwntools script

See the code [here](https://github.com/bigpick/CaptureTheFlagCode/blob/master/practice/pwnable.kr/toddlersbottle/09_mistake_code/mistake_pwn.py). Results:

```
python mistake_pwn.py
[+] Connecting to pwnable.kr on port 2222: Done
[*] random@pwnable.kr:
    Distro    Ubuntu 16.04
    OS:       linux
    Arch:     amd64
    Version:  4.4.179
    ASLR:     Enabled
[+] Starting remote process './mistake' on pwnable.kr: pid 246735
b'Password OK\n'
b'Mommy, the operator priority always confuses me :(\n'
```
