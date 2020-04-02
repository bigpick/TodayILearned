---
author: george_pick
layout: post
title: "memcpy: Intro to memory alignment"
excerpt: "pwnable.kr challenge: memcpy"
categories: [pwn practice]
---

> Are you tired of hacking?, take some rest here.
>
> Just help me out with my small experiment regarding memcpy performance.
>
> After that, flag is yours.
>
> http://pwnable.kr/bin/memcpy.c
>
> `ssh memcpy@pwnable.kr -p2222 (pw:guest)`

## Given
We've got a remote endpoint, and a location of a source code we can download.

## Get on the box

{% highlight bash %}
ssh memcpy@pwnable.kr -p2222
...
memcpy@pwnable:~$
{% endhighlight %}

## Look around

{% highlight bash %}
-rw-r--r--   1 root root   3172 Mar  4  2016 memcpy.c
-rw-r--r--   1 root root    192 Mar 10  2016 readme
{% endhighlight %}

Looks like we have the source code again, but no executable. If we cat the readme:

{% highlight bash %}
the compiled binary of "memcpy.c" source code (with real flag) will be executed under memcpy_pwn privilege if you connect to port 9022.
execute the binary by connecting to daemon(nc 0 9022).
{% endhighlight %}

## Run it

{% highlight bash %}
nc 0 9022
Hey, I have a boring assignment for CS class.. :(
The assignment is simple.
-----------------------------------------------------
- What is the best implementation of memcpy?        -
- 1. implement your own slow/fast version of memcpy -
- 2. compare them with various size of data         -
- 3. conclude your experiment and submit report     -
-----------------------------------------------------
This time, just help me out with my experiment and get flag
No fancy hacking, I promise :D
specify the memcpy amount between 8 ~ 16 : 8
specify the memcpy amount between 16 ~ 32 : 16
specify the memcpy amount between 32 ~ 64 : 32
specify the memcpy amount between 64 ~ 128 : 64
specify the memcpy amount between 128 ~ 256 : 128
specify the memcpy amount between 256 ~ 512 : 256
specify the memcpy amount between 512 ~ 1024 : 512
specify the memcpy amount between 1024 ~ 2048 : 1024
specify the memcpy amount between 2048 ~ 4096 : 2048
specify the memcpy amount between 4096 ~ 8192 : 4096
ok, lets run the experiment with your configuration
experiment 1 : memcpy with buffer size 8
ellapsed CPU cycles for slow_memcpy : 2086
ellapsed CPU cycles for fast_memcpy : 204

experiment 2 : memcpy with buffer size 16
ellapsed CPU cycles for slow_memcpy : 182
ellapsed CPU cycles for fast_memcpy : 324

experiment 3 : memcpy with buffer size 32
ellapsed CPU cycles for slow_memcpy : 318
ellapsed CPU cycles for fast_memcpy : 310

experiment 4 : memcpy with buffer size 64
ellapsed CPU cycles for slow_memcpy : 650
ellapsed CPU cycles for fast_memcpy : 150

experiment 5 : memcpy with buffer size 128
ellapsed CPU cycles for slow_memcpy : 948
{% endhighlight %}

Huh - and that's it. Initial thoughts: why did it stop at experiment 5, when we gave it 10 rounds? Why did it seem to do so silently?

OK - let's look at the source code.

## Examine (given) source code

{% highlight c %}
// compiled with : gcc -o memcpy memcpy.c -m32 -lm
#include <stdio.h>
#include <string.h>
#include <stdlib.h>
#include <signal.h>
#include <unistd.h>
#include <sys/mman.h>
#include <math.h>

unsigned long long rdtsc(){
        asm("rdtsc");
}

char* slow_memcpy(char* dest, const char* src, size_t len){
	int i;
	for (i=0; i<len; i++) {
		dest[i] = src[i];
	}
	return dest;
}

char* fast_memcpy(char* dest, const char* src, size_t len){
	size_t i;
	// 64-byte block fast copy
	if(len >= 64){
		i = len / 64;
		len &= (64-1);
		while(i-- > 0){
			__asm__ __volatile__ (
			"movdqa (%0), %%xmm0\n"
			"movdqa 16(%0), %%xmm1\n"
			"movdqa 32(%0), %%xmm2\n"
			"movdqa 48(%0), %%xmm3\n"
			"movntps %%xmm0, (%1)\n"
			"movntps %%xmm1, 16(%1)\n"
			"movntps %%xmm2, 32(%1)\n"
			"movntps %%xmm3, 48(%1)\n"
			::"r"(src),"r"(dest):"memory");
			dest += 64;
			src += 64;
		}
	}

	// byte-to-byte slow copy
	if(len) slow_memcpy(dest, src, len);
	return dest;
}

int main(void){

	setvbuf(stdout, 0, _IONBF, 0);
	setvbuf(stdin, 0, _IOLBF, 0);

	printf("Hey, I have a boring assignment for CS class.. :(\n");
	printf("The assignment is simple.\n");

	printf("-----------------------------------------------------\n");
	printf("- What is the best implementation of memcpy?        -\n");
	printf("- 1. implement your own slow/fast version of memcpy -\n");
	printf("- 2. compare them with various size of data         -\n");
	printf("- 3. conclude your experiment and submit report     -\n");
	printf("-----------------------------------------------------\n");

	printf("This time, just help me out with my experiment and get flag\n");
	printf("No fancy hacking, I promise :D\n");

	unsigned long long t1, t2;
	int e;
	char* src;
	char* dest;
	unsigned int low, high;
	unsigned int size;
	// allocate memory
	char* cache1 = mmap(0, 0x4000, 7, MAP_PRIVATE|MAP_ANONYMOUS, -1, 0);
	char* cache2 = mmap(0, 0x4000, 7, MAP_PRIVATE|MAP_ANONYMOUS, -1, 0);
	src = mmap(0, 0x2000, 7, MAP_PRIVATE|MAP_ANONYMOUS, -1, 0);

	size_t sizes[10];
	int i=0;

	// setup experiment parameters
	for(e=4; e<14; e++){	// 2^13 = 8K
		low = pow(2,e-1);
		high = pow(2,e);
		printf("specify the memcpy amount between %d ~ %d : ", low, high);
		scanf("%d", &size);
		if( size < low || size > high ){
			printf("don't mess with the experiment.\n");
			exit(0);
		}
		sizes[i++] = size;
	}

	sleep(1);
	printf("ok, lets run the experiment with your configuration\n");
	sleep(1);

	// run experiment
	for(i=0; i<10; i++){
		size = sizes[i];
		printf("experiment %d : memcpy with buffer size %d\n", i+1, size);
		dest = malloc( size );

		memcpy(cache1, cache2, 0x4000);		// to eliminate cache effect
		t1 = rdtsc();
		slow_memcpy(dest, src, size);		// byte-to-byte memcpy
		t2 = rdtsc();
		printf("ellapsed CPU cycles for slow_memcpy : %llu\n", t2-t1);

		memcpy(cache1, cache2, 0x4000);		// to eliminate cache effect
		t1 = rdtsc();
		fast_memcpy(dest, src, size);		// block-to-block memcpy
		t2 = rdtsc();
		printf("ellapsed CPU cycles for fast_memcpy : %llu\n", t2-t1);
		printf("\n");
	}

	printf("thanks for helping my experiment!\n");
	printf("flag : ----- erased in this source code -----\n");
	return 0;
}
{% endhighlight %}


{% highlight c %}
{% endhighlight %}


The key here for me was to test on the remote machine itself. Compiling the binary and running on my local machine yielded success right away, so it had to be doing something different with how the initial blocks of memory were getting used.

To test, under some directory in `/tmp` on the remote server:

{% highlight python %}
cp /home/memcpy/memcpy.c .
gcc -o memcpy memcpy.c -m32 -lm
python3 -c $'idx=8\nfor i in range(1, 11): print(idx, end=" "); idx*=2\nprint()' > out.txt
gdb memcpy
(gdb) source /usr/share/peda/peda.py
gdb-peda$ file memcpy
gdb-peda$ break *0x80487bd # fast_memcpy
gdb-peda$ r <out.txt
...
Breakpoint 1, 0x080487bd in fast_memcpy ()
gdb-peda$ context code
[-------------------------------------code-------------------------------------]
   0x80487b3 <fast_memcpy+27>:	mov    eax,DWORD PTR [ebp+0xc]
   0x80487b6 <fast_memcpy+30>:	mov    edx,DWORD PTR [ebp+0x8]
   0x80487b9 <fast_memcpy+33>:	movdqa xmm0,XMMWORD PTR [eax]
=> 0x80487bd <fast_memcpy+37>:	movdqa xmm1,XMMWORD PTR [eax+0x10]
   0x80487c2 <fast_memcpy+42>:	movdqa xmm2,XMMWORD PTR [eax+0x20]
   0x80487c7 <fast_memcpy+47>:	movdqa xmm3,XMMWORD PTR [eax+0x30]
   0x80487cc <fast_memcpy+52>:	movntps XMMWORD PTR [edx],xmm0
   0x80487cf <fast_memcpy+55>:	movntps XMMWORD PTR [edx+0x10],xmm1
[------------------------------------------------------------------------------]
gdb-peda$ context register
...
EAX: 0xf7fca000 --> 0x0
...
EDX: 0x804d050 --> 0x0
...
{% endhighlight %}

OK - so for our first iteration, we see that both EAX and EDX are 16 byte aligned:

{% highlight python %}
>>> 0xf7fca000 % 16
0
>>> 0x804d050 % 16
0
{% endhighlight %}

If we continue to the next:


{% highlight python %}
gdb-peda$ c
Continuing.
ellapsed CPU cycles for fast_memcpy : 488093890250

experiment 4 : memcpy with buffer size 128
ellapsed CPU cycles for slow_memcpy : 978
...
Breakpoint 1, 0x080487bd in fast_memcpy ()
{% endhighlight %}

Checking our registers again:


{% highlight python %}
gdb-peda$ context register
...
EAX: 0xf7fca000 --> 0x0
...
EDX: 0x804d098 --> 0x0
{% endhighlight %}

EAX is still 16 byte aligned, but EDX is not anymore!

{% highlight python %}
>>> 0x804d098 % 16
8
{% endhighlight %}

So when we give it `128` here, it will fail, since we need to be aligned with the 16 byte, and are currently in off by 8.

If we re-run, but this time adding `8` to the value copied _before_ this one (since we need `edx` to be aligned):

{% highlight bash %}
cat out.txt
8 16 32 72 128 ...
{% endhighlight %}

And then checking that, we get both aligned with 16 byte:

{% highlight python %}
Continuing.
ellapsed CPU cycles for fast_memcpy : 11835899654

experiment 5 : memcpy with buffer size 128
ellapsed CPU cycles for slow_memcpy : 1066
[----------------------------------registers-----------------------------------]
EAX: 0xf7fca000 --> 0x0
...
EDX: 0x804d0b0 --> 0x0
...
{% endhighlight %}

However, continuing to the next one (256), we see the same exact issue:

{% highlight python %}
gdb-peda$ c
Continuing.
ellapsed CPU cycles for fast_memcpy : 111125098666

experiment 6 : memcpy with buffer size 256
ellapsed CPU cycles for slow_memcpy : 2330
[----------------------------------registers-----------------------------------]
EAX: 0xf7fca000 --> 0x0
...
EDX: 0x804d138 --> 0x0
...
{% endhighlight %}

Which is again, 8 off:

{% highlight python %}
>>> 0x804d138 % 16
8
{% endhighlight %}

So, we can add 8 to that as well. If you repeat the above process, you'll see that you need to add 8 to all of the remaining values to keep them aligned.

Updating our payload file accordingly, we can run it against our local copy and see success:

{% highlight bash %}
cat out.txt | ./memcpy
Hey, I have a boring assignment for CS class.. :(
The assignment is simple.
-----------------------------------------------------
- What is the best implementation of memcpy?        -
- 1. implement your own slow/fast version of memcpy -
- 2. compare them with various size of data         -
- 3. conclude your experiment and submit report     -
-----------------------------------------------------
This time, just help me out with my experiment and get flag
No fancy hacking, I promise :D
specify the memcpy amount between 8 ~ 16 : specify the memcpy amount between 16 ~ 32 : specify the memcpy amount between 32 ~ 64 : specify the memcpy amount between 64 ~ 128 : specify the memcpy amount between 128 ~ 256 : specify the memcpy amount between 256 ~ 512 : specify the memcpy amount between 512 ~ 1024 : specify the memcpy amount between 1024 ~ 2048 : specify the memcpy amount between 2048 ~ 4096 : specify the memcpy amount between 4096 ~ 8192 : ok, lets run the experiment with your configuration
experiment 1 : memcpy with buffer size 8
...
ellapsed CPU cycles for fast_memcpy : 1720

thanks for helping my experiment!
flag : ----- erased in this source code -----
{% endhighlight %}

Which we can then use against the service:


{% highlight bash %}
cat out.txt | nc 0 9022
Hey, I have a boring assignment for CS class.. :(
The assignment is simple.
-----------------------------------------------------
- What is the best implementation of memcpy?        -
- 1. implement your own slow/fast version of memcpy -
- 2. compare them with various size of data         -
- 3. conclude your experiment and submit report     -
-----------------------------------------------------
This time, just help me out with my experiment and get flag
No fancy hacking, I promise :D
specify the memcpy amount between 8 ~ 16 : specify the memcpy amount between 16 ~ 32 : specify the memcpy amount between 32 ~ 64 : specify the memcpy amount between 64 ~ 128 : specify the memcpy amount between 128 ~ 256 : specify the memcpy amount between 256 ~ 512 : specify the memcpy amount between 512 ~ 1024 : specify the memcpy amount between 1024 ~ 2048 : specify the memcpy amount between 2048 ~ 4096 : specify the memcpy amount between 4096 ~ 8192 : ok, lets run the experiment with your configuration
experiment 1 : memcpy with buffer size 8
...
ellapsed CPU cycles for fast_memcpy : 1706

thanks for helping my experiment!
flag : _______________
{% endhighlight %}
