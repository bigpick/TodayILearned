---
layout: post
title: "Intro to ARM assembly"
excerpt: "pwnable.kr challenge: leg (lol)"
categories: [pwn practice]
---

> Daddy told me I should study arm.
> But I prefer to study my leg!
>
> Download : http://pwnable.kr/bin/leg.c
> Download : http://pwnable.kr/bin/leg.asm
>
> ssh leg@pwnable.kr -p2222 (pw:guest)

### Read
* [QEMU documentation](https://wiki.qemu.org/Documentation/Platforms/ARM) on ARM platforms.
* [Wikipedia ARM page](https://en.wikipedia.org/wiki/ARM_architecture) (first response in google for "What is ARM")
* [Androidcentral doc](https://www.androidcentral.com/what-arm-cpu) on what ARM is non-technically.
* [This page](https://gcc.gnu.org/onlinedocs/gcc/Using-Assembly-Language-with-C.html) on how to use inline assembly in C.
* [Here](https://azeria-labs.com/writing-arm-assembly-part-1/) on an introduction to ARM assembly basics.
> The uber-technical definition of an ARM processor is a CPU built on the RISC-based architecture developed by Acorn Computers in the 1980s and is now developed by Advanced RISC Machines (thus the ARM)

So it seems like `ARM` is both a processor architecture (Acorn RISC Machine), and a company (Advanced RISC Machine).

> RISC stands for reduced instruction set computing.
This is in comparison to _CISC_ (complex instruction set computing). So, ARM is a processor architecture based on a reduced set of instructions.
> ... they can have a higher frequency — the Gigahertz numbers you hear discussed — and perform more MIPS (millions of instructions per second) than a CISC processor.

Neat.

> It isn't very good at running the software written for the x86 Intel processor and a lot of coding changes are necessary, or a virtual machine, to do the same things.

So, it seems like we'll need a special machine to run this ARM code.

### Given
So for this, we're given two downloads, which look to be an executable and the c source code for that executable:
* Executable -- `http://pwnable.kr/bin/leg.asm`
* Source    -- `http://pwnable.kr/bin/leg.c`

And then a location of which the vulnerable program is currently running:
* `ssh leg@pwnable.kr -p2222`

### First, lets get on the box

```
ssh leg@pwnable.kr -p2222
...
Uncompressing Linux... done, booting the kernel.
[    0.000000] Booting Linux on physical CPU 0x0
[    0.000000] Linux version 3.11.4 (acez@pondicherry) (gcc version 4.7.3 (Sourcery CodeBench Lite 2013.05-24) ) #5 Sat Oct 12 00:15:00 EDT 2013
[    0.000000] CPU: ARM926EJ-S [41069265] revision 5 (ARMv5TEJ), cr=00093177
[    0.000000] CPU: VIVT data cache, VIVT instruction cache
[    0.000000] Machine: ARM-Versatile PB
[    0.000000] Memory policy: ECC disabled, Data cache writeback
[    0.000000] sched_clock: 32 bits at 24MHz, resolution 41ns, wraps every 178956ms
[    0.000000] Built 1 zonelists in Zone order, mobility grouping on.  Total pages: 16256
[    0.000000] Kernel command line: 'root=/dev/ram rw console=ttyAMA0 rdinit=/sbin/init oops=panic panic=1 quiet'
[    0.000000] PID hash table entries: 256 (order: -2, 1024 bytes)
[    0.000000] Dentry cache hash table entries: 8192 (order: 3, 32768 bytes)
[    0.000000] Inode-cache hash table entries: 4096 (order: 2, 16384 bytes)
...
[    0.548374] TCP: cubic registered
[    0.548502] NET: Registered protocol family 17
[    0.549146] NET: Registered protocol family 37
[    0.549380] VFP support v0.3: implementor 41 architecture 1 part 10 variant 9 rev 0
[    0.558385] Freeing unused kernel memory: 112K (c0323000 - c033f000)
cttyhack: can't open '/dev/ttyS0': No such file or directory
sh: can't access tty; job control turned off
/ $ [    0.647945] input: AT Raw Set 2 keyboard as /devices/fpga:06/serio0/input/input0
[    1.248371] input: ImExPS/2 Generic Explorer Mouse as /devices/fpga:07/serio1/input/input1

/ $
```

Woah - what do we have here? It looks like when we SSH'ed to that address, it started up some kind of virtual machine or something? Can see, the first message there is that it's starting to boot Linux:

```
Uncompressing Linux... done, booting the kernel.
[    0.000000] Booting Linux on physical CPU 0x0
[    0.000000] Linux version 3.11.4 (acez@pondicherry) (gcc version 4.7.3 (Sourcery CodeBench Lite 2013.05-24) ) #5 Sat Oct 12 00:15:00 EDT 2013
[    0.000000] CPU: ARM926EJ-S [41069265] revision 5 (ARMv5TEJ), cr=00093177
[    0.000000] CPU: VIVT data cache, VIVT instruction cache
[    0.000000] Machine: ARM-Versatile PB
```

...on a machine: `ARM-Versatile PB`? Quick google search yields [this](https://elinux.org/ARM_Versatile). So it's lools to be an ARM based machine that can run the linux kernel.

### Look around

It should behave like a normal Linux environment, one would think.

```
/ $ whoami
busy

/ $ pwd
/

/ $ ls -alrt
total 628
dr-xr-xr-x   33 root     0                0 Jan  1 00:00 proc
drwxrwxr-x    4 root     0                0 Nov 10  2014 usr
drwxrwxr-x    2 root     0                0 Nov 10  2014 sys
drwxrwxr-x    2 root     0                0 Nov 10  2014 sbin
drwxrwxr-x    2 root     0                0 Nov 10  2014 root
lrwxrwxrwx    1 root     0               11 Nov 10  2014 linuxrc -> bin/busybox
---s--x---    1 1001     1000        636419 Nov 10  2014 leg
-r--------    1 1001     0               38 Nov 10  2014 flag
drwxrwxr-x    2 root     0                0 Nov 10  2014 dev
drwxrwxr-x    2 root     0                0 Nov 10  2014 boot
drwxrwxr-x    2 root     0                0 Nov 10  2014 bin
drwxrwxr-x    3 root     0                0 Nov 10  2014 etc
drwxr-xr-x   11 root     0                0 Nov 10  2014 ..
drwxr-xr-x   11 root     0                0 Nov 10  2014 .
```

OK - we see our executable, let's try running it:

```
/ $ ./leg
Daddy has very strong arm! : Arm day everyday
I have strong leg :P
```

OK, so it seems like we need to give it some sort of magic input to get it to give us access to whatever is stored in the `flag` file.

### Examine (given) source

`leg.c`:

```c
#include <stdio.h>
#include <fcntl.h>
int key1(){
	asm("mov r3, pc\n");
}
int key2(){
	asm(
	"push	{r6}\n"
	"add	r6, pc, $1\n"
	"bx	r6\n"
	".code   16\n"
	"mov	r3, pc\n"
	"add	r3, $0x4\n"
	"push	{r3}\n"
	"pop	{pc}\n"
	".code	32\n"
	"pop	{r6}\n"
	);
}
int key3(){
	asm("mov r3, lr\n");
}
int main(){
	int key=0;
	printf("Daddy has very strong arm! : ");
	scanf("%d", &key);
	if( (key1()+key2()+key3()) == key ){
		printf("Congratz!\n");
		int fd = open("flag", O_RDONLY);
		char buf[100];
		int r = read(fd, buf, 100);
		write(0, buf, r);
	}
	else{
		printf("I have strong leg :P\n");
	}
	return 0;
}
```

OK - four function program: main, key3, key2, and key1.

### `main`

Starts off declaring an integer `key` as 0.

Then it asks us for our input, and uses `scanf` to store the integer value (`%d`) into the value for key (`&key`).

Once it's done that, it checks if the sum ok key1(), key2(), and key3() are equal to our input, key.
* If so, does some stuff to spit us out the flag and do so.
* Else, print a :P message

Then quit.

### Takeaway

Whatever we pass in at the user prompt needs to have an integer value equivalent to the three key function's outputs combined.

### `key1()`

```c
int key1(){
	asm("mov r3, pc\n");
}
```

I've never seen the `asm()` function in C before. First response on a quick google search for "C asm() function" yields [this page](https://gcc.gnu.org/onlinedocs/gcc/Using-Assembly-Language-with-C.html) on how to use inline assembly in C.

> The asm keyword allows you to embed assembler instructions within C code. GCC provides two forms of inline asm statements. A basic asm statement is one with no operands (see [Basic Asm](https://gcc.gnu.org/onlinedocs/gcc/Basic-Asm.html#Basic-Asm)), while an extended asm statement (see [Extended Asm](https://gcc.gnu.org/onlinedocs/gcc/Extended-Asm.html#Extended-Asm)) includes one or more operands. The extended form is preferred for mixing C and assembly language within a function, but to include assembly language at top level you must use basic asm.

Looking at those pages, it seems we have _Basic ASM: Assembler Instructions Without Operands_.

Here, `r3` looks to be a ARM specific register? Again, google yields [this page](https://azeria-labs.com/writing-arm-assembly-part-1/) on an introduction to writing ARM assembly.

On that site, the have a neat free cheatsheet:

![azeria-labs-free-asm-cheats](https://azeria-labs.com/downloads/cheatsheetv1.3-1920x1080.png)

So my suspicion was right, `r3` would fall under a "general purpose" register.

> ... If you don’t have an ARM device (like Raspberry Pi), you can set up your own lab environment in a Virtual Machine using QEMU ...

And that also confirms our suspicion from the initial SSH.

Continuing on that site, we see some nice information that looks like so:

| Instruction   | Equal to                  |
|---------------|---------------------------|
|`ldr`          | Load Word                 |
|`ldrh`         | Load unsigned Half Word   |
|`ldrsh`        | Load signed Half Word     |
|`ldrb`         | Load unsigned Byte        |
|`ldrsb`        | Load signed Bytes         |
|-------------+---------------------------|
|`str`          | Store Word                |
|`strh`         | Store unsigned Half Word  |
|`strsh`        | Store signed Half Word    |
|`strb`         | Store unsigned Byte       |
|`strsb`        | Store signed Byte         |


It continues... now discussing registers.

Example code:

```
_start:
 mov r0, pc
 mov r1, #2
 add r2, r1, r1
 bkpt
```
Breaking at `_start`:

```
$r0 0x00000000   $r1 0x00000000   $r2 0x00000000   $r3 0x00000000
...
$r12 0x00000000  $sp 0xbefff7e0   $lr 0x00000000   $pc 0x00008054

0x8054 <_start> mov r0, pc        <- here is $pc
0x8058 <_start+4> mov r0, #2
0x805c <_start+8> add r1, r0, r0
0x8060 <_start+12> bkpt 0x0000
0x8064 andeq r1, r0, r1, asr #10
0x8068 cmnvs r5, r0, lsl #2
0x806c tsteq r0, r2, ror #18
0x8070 andeq r0, r0, r11
0x8074 tsteq r8, r6, lsl #6
```

> ... PC holds the address (`0x8054`) of the current instruction (`mov r0, pc`) that will be executed. Now let’s execute the next step, after which `R0` should hold the address of PC (`0x8054`) ...

![that-was-a-lie](https://i.kym-cdn.com/entries/icons/original/000/027/528/519.png){:height="60%" width="60%"}

### SP points to different places depending on instruction mode!

Instead, `R0` gets the value of `0x8058`, which is actually two instructions ahead (8 bytes) of where we broke at `0x8054 <_start> mov r0, pc`.

So depending on the mode, `pc` will actually end up containing either the address two instructions ahead (`+8`) or one (`+4`); the latter only being in **Thumb mode**.

OK, lets go back to our function:

```c
int key1(){
	asm("mov r3, pc\n");
}
```

So, it looks like it moves the value of the program counter into `r3` (which I guess is the return value? Seems so, based on [here](https://en.wikipedia.org/wiki/Calling_convention#ARM))

We're given a `.asm` file of the compiled source code as well. Looking at `key1()`'s section:

```
   0x00008cd4 <+0>:	push	{r11}		; (str r11, [sp, #-4]!)
   0x00008cd8 <+4>:	add	r11, sp, #0
   0x00008cdc <+8>:	mov	r3, pc
   0x00008ce0 <+12>:	mov	r0, r3
   0x00008ce4 <+16>:	sub	sp, r11, #0
   0x00008ce8 <+20>:	pop	{r11}		; (ldr r11, [sp], #4)
   0x00008cec <+24>:	bx	lr
```

So, `key1()` will end up getting:

```
>>> hex(0x00008cdc+8)
'0x8ce4'
```

### `key2()`

```c
int key2(){
	asm(
	"push	{r6}\n"
	"add	r6, pc, $1\n"
	"bx	r6\n"
	".code   16\n"
	"mov	r3, pc\n"
	"add	r3, $0x4\n"
	"push	{r3}\n"
	"pop	{pc}\n"
	".code	32\n"
	"pop	{r6}\n"
	);
}
```

OK - this one is a bit longer. The first bit is new, mainly, what is `bx`?

> The BX and BLX instructions can change the processor state from ARM to Thumb, or from Thumb to ARM.

So, looks like it's used to switch between the two modes (ARM vs Thumb). Reading some more, the

```
	".code   16\n"
```

Is a clear indication that we're now in 16-bit/Thumb mode. So now, from before, our `PC` register will only by `+4` and not `+8`.

From the above, it looks like:
* We go into Thumb mode
* We put `pc` into `r3`
* We add the value `0x4` to it
* We return r3

Checking the assembly dump for `key2()`:

```
   0x00008cf0 <+0>:	push	{r11}		; (str r11, [sp, #-4]!)
   0x00008cf4 <+4>:	add	r11, sp, #0
   0x00008cf8 <+8>:	push	{r6}		; (str r6, [sp, #-4]!)
   0x00008cfc <+12>:	add	r6, pc, #1
   0x00008d00 <+16>:	bx	r6
   0x00008d04 <+20>:	mov	r3, pc          ; <------ Here
   0x00008d06 <+22>:	adds	r3, #4
   0x00008d08 <+24>:	push	{r3}
   0x00008d0a <+26>:	pop	{pc}
   0x00008d0c <+28>:	pop	{r6}		; (ldr r6, [sp], #4)
   0x00008d10 <+32>:	mov	r0, r3
   0x00008d14 <+36>:	sub	sp, r11, #0
   0x00008d18 <+40>:	pop	{r11}		; (ldr r11, [sp], #4)
   0x00008d1c <+44>:	bx	lr
```

So, `r3` starts off with value `0x8d08 + 4`, since we only need to go `+4` in Thumb mode.

Then, we add `0x4` to it, and return that. So, `key2()` will be:

```
>>> hex(0x00008d04 + 4 + 4)
'0x8d0c'
```

### `key3()`

Nice, back to one line:

```c
int key3(){
	asm("mov r3, lr\n");
}
```

So this looks similar to [key1](#key1), except now we have a `, lr` added to the end of the command.

From the above Azeria link, we know `LR` is for the **Link Register**.
> R14: LR (Link Register). When a function call is made, the Link Register gets updated with a memory address referencing the next instruction where the function was initiated from. Doing this allows the program return to the “parent” function that initiated the “child” function call after the “child” function is finished.

Our assembly for `key3()`:

```
   0x00008d20 <+0>:	push	{r11}		; (str r11, [sp, #-4]!)
   0x00008d24 <+4>:	add	r11, sp, #0
   0x00008d28 <+8>:	mov	r3, lr
   0x00008d2c <+12>:	mov	r0, r3
   0x00008d30 <+16>:	sub	sp, r11, #0
   0x00008d34 <+20>:	pop	{r11}		; (ldr r11, [sp], #4)
   0x00008d38 <+24>:	bx	lr
```

So,

```
0x00008d28 <+8>:	mov	r3, lr
```

Is where we're setting the return value equal to the link register. If we look at the disas of `main` where we call `key3()`, we can see the function we're going to execute after key3, and it's address, so we know what `LR` should have inside key3:

```
...
   0x00008d7c <+64>:	bl	0x8d20 <key3>
   0x00008d80 <+68>:	mov	r3, r0
...
```

### Putting it all together

```
>>> (0x00008cdc+8) + (0x00008d04 + 4 + 4) + (0x00008d80)
108400
```

And we get our flag!

```
/ $ ./leg
Daddy has very strong arm! : 108400
Congratz!
My daddy has a lot of ARMv5te muscle!
```
