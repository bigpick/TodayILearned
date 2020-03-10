---
layout: post
title: "Using Various Linux Input systems in a single executable"
excerpt: "pwnable.kr challenge: input"
categories: [pwn practice]
---

> Mom? how can I pass my input to a computer program?
>
> ssh input2@pwnable.kr -p2222 (pw:guest)

### Given
All we're given in this is a ssh login command, and it's password

* `ssh input2@pwnable.kr -p2222 (pw:guest)`

### First, lets get on the box

```
...
input2@pwnable:~$
```

### Look around

```bash
...
-r-sr-x---   1 input2_pwn input2 13250 Jun 30  2014 input
-rw-r--r--   1 root       root    1754 Jun 30  2014 input.c
-r--r-----   1 input2_pwn root      55 Jun 30  2014 flag
...
```

### Execute it

```
./input
Welcome to pwnable.kr
Let's see if you know how to give input to program
Just give me correct inputs then you will get the flag :)
```

OK - so we need to give it input.

```
./input bleep bloop
Welcome to pwnable.kr
Let's see if you know how to give input to program
Just give me correct inputs then you will get the flag :)
```

We need to give it _specific_ input. Time to look at the source.

### Examine (given) source

```c
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <sys/socket.h>
#include <arpa/inet.h>

int main(int argc, char* argv[], char* envp[]){
	printf("Welcome to pwnable.kr\n");
	printf("Let's see if you know how to give input to program\n");
	printf("Just give me correct inputs then you will get the flag :)\n");

	// argv
	if(argc != 100) return 0;
	if(strcmp(argv['A'],"\x00")) return 0;
	if(strcmp(argv['B'],"\x20\x0a\x0d")) return 0;
	printf("Stage 1 clear!\n");

	// stdio
	char buf[4];
	read(0, buf, 4);
	if(memcmp(buf, "\x00\x0a\x00\xff", 4)) return 0;
	read(2, buf, 4);
        if(memcmp(buf, "\x00\x0a\x02\xff", 4)) return 0;
	printf("Stage 2 clear!\n");

	// env
	if(strcmp("\xca\xfe\xba\xbe", getenv("\xde\xad\xbe\xef"))) return 0;
	printf("Stage 3 clear!\n");

	// file
	FILE* fp = fopen("\x0a", "r");
	if(!fp) return 0;
	if( fread(buf, 4, 1, fp)!=1 ) return 0;
	if( memcmp(buf, "\x00\x00\x00\x00", 4) ) return 0;
	fclose(fp);
	printf("Stage 4 clear!\n");

	// network
	int sd, cd;
	struct sockaddr_in saddr, caddr;
	sd = socket(AF_INET, SOCK_STREAM, 0);
	if(sd == -1){
		printf("socket error, tell admin\n");
		return 0;
	}
	saddr.sin_family = AF_INET;
	saddr.sin_addr.s_addr = INADDR_ANY;
	saddr.sin_port = htons( atoi(argv['C']) );
	if(bind(sd, (struct sockaddr*)&saddr, sizeof(saddr)) < 0){
		printf("bind error, use another port\n");
    		return 1;
	}
	listen(sd, 1);
	int c = sizeof(struct sockaddr_in);
	cd = accept(sd, (struct sockaddr *)&caddr, (socklen_t*)&c);
	if(cd < 0){
		printf("accept error, tell admin\n");
		return 0;
	}
	if( recv(cd, buf, 4, 0) != 4 ) return 0;
	if(memcmp(buf, "\xde\xad\xbe\xef", 4)) return 0;
	printf("Stage 5 clear!\n");

	// here's your flag
	system("/bin/cat flag");
	return 0;
}
```

Alright, one function: `main`.

### `main`

Starts off by printing us a banner welcome message we already saw before.

Then it has 5 "stages", where each stage is broken into a commented header. So, we're going to have to satisfy each section, and once we do, get a system call to `cat` the flag.

### Stage 1 -- argv

So here, the first check makes sure that `argc` is exactly equal to 100, otherwise we quit.

So, we're going to have to call the program with 99 arguments (the first is the file itself). Something like:

```
python -c 'print("A "*99)'
A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A

./myinput A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A
```

Yields us that check.

Then, it checks two values, using `strcmp` for both:
* `argv['A']` and `\0x00`
* `argv['B']` and `\0x20\x0a\x0d`

If either of those equate to true (i.e. 1), we quit. So since it's using `strcmp` we need
* `argv['A']` to be less than or equal to `\0x00` (this is the 65th index, so 64th arg)
* `argv['B']` to be less than or equal to `\0x20\x0a\x0d` (this is the 66th index, so 65th arg)

(Note, in c, `'A'` and `'B'` technically have integer values, which are 65 and 66 respectively).

```c
	printf("%d\n", 'A');
    printf("%d\n", 'B');
```

See also: [Ascii codes](http://www.asciitable.com/).

Let's start building a pwntools script for this:

```python
from pwn import *

# We need argc to be 100
arglist = ["A"] * 99
# we need argv['A'] and 'B' to have a certain value
# but also need to account for the file name itself being the first arg
arglist[ord("A")-1] = "\x00"
arglist[ord("B")-1] = "\x20\x0a\x0d"

# Start a new ssh session to the box:
session = ssh(host='pwnable.kr', user='input2', password='guest', port=2222)
assert session.connected()

# Executable n the session:
# ./input arglist[1] arglist[2] ...
process = session.process(["input"]+arglist)

# Send our payload to it, since it'll expect us to enter the value to STDIN:
#process.sendline(payload)
while 1<2:
    try:
        print(process.recvline().decode('utf-8'))
    except EOFError as e:
        break
```

Run it:
```
python3 input_pwn.py
[+] Connecting to pwnable.kr on port 2222: Done
[*] random@pwnable.kr:
    Distro    Ubuntu 16.04
    OS:       linux
    Arch:     amd64
    Version:  4.4.179
    ASLR:     Enabled
[+] Starting remote process b'input' on pwnable.kr: pid 389045
Welcome to pwnable.kr

Let's see if you know how to give input to program

Just give me correct inputs then you will get the flag :)

Stage 1 clear!
```
Ok - on to stage 2.

### Stage 2 -- stdio
Starts off declaring a char buffer of size 4.

Then, it [read](https://linux.die.net/man/3/read)s a value into the buffer:

```c
// ssize_t read(int fildes, void *buf, size_t nbyte);
read(0, buf, 4);
```

File descriptor 0 is stdin, so we' need to give our value through that.

Then it checks the buffer against `"\x00\x0a\x00\xff"` using `memcmp` on stdin, and then `\x00\x0a\x02\xff` on stderr:

```
// int memcmp ( const void * ptr1, const void * ptr2, size_t num );
if(memcmp(buf, "\x00\x0a\x00\xff", 4)) return 0;
...
if(memcmp(buf, "\x00\x0a\x02\xff", 4)) return 0;
```

So here it's comparing all 4 bytes. We need it to equal <=0, so our passed in bytes need to be less than or equal to the compared-to bytes.

```python
process.sendline("\x00\x0a\x00\xff")
```

Then it reads more info into the buffer from stdin, this time from [file descriptor 2](https://en.wikipedia.org/wiki/File_descriptor):

```
read(2, buf, 4);
if(memcmp(buf, "\x00\x0a\x02\xff", 4)) return 0;
```

But, after quite a bit of extensive research, I've determined this is not possible. So we'll need to figure out how cheese the script from the remote server itself:

```
cd /tmp
mkdir t00thless
cd t00thless
vim input_pwn.py
```

And then we can modify it's contents to operate locally, like so:

```python
from pwn import *

# We need argc to be 100
arglist = ["A"] * 99
# we need argv['A'] and 'B' to have a certain value
# but also need to account for the file name itself being the first arg
arglist[ord("A")-1] = "\x00"
arglist[ord("B")-1] = "\x20\x0a\x0d"

# Start a new ssh session to the box:
stderr_file = open("stderr_file", "w")
stderr_file.write("\x00\x0a\x02\xff")
stderr_file.close()

# Executable n the session:
# ./input arglist[1] arglist[2] ...
process = process(["/home/input2/input"]+arglist, stderr = open("stderr_file"))

# Send our payload to it, since it'll expect us to enter the value to STDIN:
#process.sendline(payload)
print(process.recvuntil(b'Stage 1 clear!\n').decode('utf-8'))

# Stage 2
process.sendline("\x00\x0a\x00\xff")
print(process.recvuntil(b'Stage 2 clear!\n').decode('utf-8'))
```

If we run this now:

```
python input_pwn.py
[+] Starting local process '/home/input2/input': pid 285147
Welcome to pwnable.kr
Let's see if you know how to give input to program
Just give me correct inputs then you will get the flag :)
Stage 1 clear!

Stage 2 clear!

[*] Stopped process '/home/input2/input' (pid 285147)
```

Sweet, made it past stage 2!

### Stage 3 -- env

Alright, now it's doing a `strcmp` on `\xca\xfe\xba\xbe` and the environment variable at `\xde\xad\xbe\xef`:

```
	if(strcmp("\xca\xfe\xba\xbe", getenv("\xde\xad\xbe\xef"))) return 0;
```

Some googling around on the pwntools documentation, found this [page](http://folk.uio.no/laszloe/ctf/pwn_tools.pdf).

Seems like we can pass an ENV variable to the process call like:

```
process(..., env={"ENV_VARIABLE":"value"}, ...)
```

so it will be:

```
process = process(["/home/input2/input"]+arglist, stderr = open("stderr_file"), env={"\xde\xad\xbe\xef":"\xca\xfe\xba\xbe"})
```

If we run it now, with an extra `recvuntil` for stage 3, it works!

```
python input_pwn.py
[+] Starting local process '/home/input2/input': pid 361704
Welcome to pwnable.kr
Let's see if you know how to give input to program
Just give me correct inputs then you will get the flag :)
Stage 1 clear!

[*] Process '/home/input2/input' stopped with exit code 0 (pid 361704)
Stage 2 clear!

Stage 3 clear!
```

### Stage 4 -- file

So it looks like it starts off reading a file named `\x0a`.
* If it doesn't exist, quit.

```c
    //size_t fread ( void * ptr, size_t size, size_t count, FILE * stream );
	if( fread(buf, 4, 1, fp)!=1 ) return 0;
```

* Read an array of 1 element of 4 bytes from the fp file stream and store them into the buffer.
  * If the return value is `!=1`, quit. Return value is the total number of elements succesfully read.

* Lastly, compares `buf` with `\x00\x00\x00\x00`. So, we need to populate `\x0a` with `\x00\x00\x00\x00`.

We can do so be generating a file before calling our process:

```python
# For stage 4, we need a file to read from:
with open('\x0a', 'w') as outfile:
  outfile.write("\x00\x00\x00\x00")
```

Then another `recvunil` for stage 4.

### Stage 5 -- network

See: [This cs.cmu.edu lecture on sockets](https://www.cs.cmu.edu/~srini/15-441/S10/lectures/r01-sockets.pdf).

Oof, this one looks like a doozy. OK, one line at a time.

Declares some variables, `sd` and `cd` as `int`. Then, declares:

```c
struct sockaddr_in saddr, caddr;
```

I imagine the `s` and `c` here stand for server and client?

Then, it continues to setup the socket:

```
sd = socket(AF_INET, SOCK_STREAM, 0);
```

Here:
* `AF_INET` -> `IPv4` (domain)
* `SOCK_STREAM` -> `TCP` (type)
* `0` --> protocol

Then, it checks if the socket got created or quits otherwise.

Then, it sets up some info for the server. Notably, it's not binding to a specific IP, and is set up on the port we pass in at `argv['C']`, in network byte order.

It continues setting some more stuff up, until eventually it tries to receive some data:

```c
    // ssize_t recv(int sockfd, void *buf, size_t len, int flags);
	if( recv(cd, buf, 4, 0) != 4 ) return 0;
	if(memcmp(buf, "\xde\xad\xbe\xef", 4)) return 0;
```

> With a zero flags argument, recv() is generally equivalent to `read`

So, it's receiving 4 bytes into `buf` and then comparing it with `\xde\xad\xbe\xef`. So, we need to pass `\xde\xad\xbe\xef` over TCP at the port specified in `argv['C']`.

So, we can set up some more info in our python script to send to that socket assuming it's going to get setup by our binary:

```python
# Set up stuff for Stage 5
TCP_IP = '127.0.0.1'
TCP_PORT = 5005
BUFFER_SIZE = 1024
MESSAGE = "\xde\xad\xbe\xef"
...
arglist[ord("C")-1] = "5005"
...
# Stage 5
s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
s.connect((TCP_IP, TCP_PORT))
s.send(MESSAGE)
print(process.recvuntil(b'Stage 5 clear!\n').decode('utf-8'))
```

And running it:

```
python input_pwn.py
[+] Starting local process '/home/input2/input': pid 432052
Welcome to pwnable.kr
Let's see if you know how to give input to program
Just give me correct inputs then you will get the flag :)
Stage 1 clear!

Stage 2 clear!

Stage 3 clear!

Stage 4 clear!

Stage 5 clear!

[*] Stopped process '/home/input2/input' (pid 432052)
```

Sweet!

If we add one more `recvline`, we should get our flag:

```
...
Stage 5 clear!

Traceback (most recent call last):
  File "input_pwn.py", line 53, in <module>
    print(process.recvline().decode('utf-8'))
  File "/usr/local/lib/python2.7/dist-packages/pwnlib/tubes/tube.py", line 426, in recvline
    return self.recvuntil(self.newline, drop = not keepends, timeout = timeout)
  File "/usr/local/lib/python2.7/dist-packages/pwnlib/tubes/tube.py", line 305, in recvuntil
    res = self.recv(timeout=self.timeout)
  File "/usr/local/lib/python2.7/dist-packages/pwnlib/tubes/tube.py", line 78, in recv
    return self._recv(numb, timeout) or ''
  File "/usr/local/lib/python2.7/dist-packages/pwnlib/tubes/tube.py", line 156, in _recv
    if not self.buffer and not self._fillbuffer(timeout):
  File "/usr/local/lib/python2.7/dist-packages/pwnlib/tubes/tube.py", line 126, in _fillbuffer
    data = self.recv_raw(self.buffer.get_fill_size())
  File "/usr/local/lib/python2.7/dist-packages/pwnlib/tubes/process.py", line 694, in recv_raw
    raise EOFError
EOFError
```

Ah, what? All that's left is:

```
	// here's your flag
	system("/bin/cat flag");
```

Turning on debug mode for pwntools doesn't help much either... hmm.

Strange that it's giving the whole path for `cat` but not for the flag? So it's looking for `flag` in the current dir, but that's bad since we cheesed this in some `/tmp/...` dir.

We can just copy it to our dir.

```
cp /home/input2/flag ./flag
cp: cannot open '/home/input2/flag' for reading: Permission denied
```

Scratch that, link it maybe?

```
ln -s /home/input2/flag flag
```

Ok, no complaints.

```
ls -alrt flag
lrwxrwxrwx 1 input2 input2 17 Mar  9 21:06 flag -> /home/input2/flag
```

Alright, running now:

```
python input_pwn.py
[+] Starting local process '/home/input2/input': pid 452051
Welcome to pwnable.kr
Let's see if you know how to give input to program
Just give me correct inputs then you will get the flag :)
Stage 1 clear!

Stage 2 clear!

Stage 3 clear!

Stage 4 clear!

Stage 5 clear!

Mommy! I learned how to pass various input in Linux :)

[*] Process '/home/input2/input' stopped with exit code 0 (pid 452051)
```

Woo! Flag is `Mommy! I learned how to pass various input in Linux :)`.

For this code, see my [Git repo](https://github.com/bigpick/pwnable.kr) for pwnable.kr practice code.
