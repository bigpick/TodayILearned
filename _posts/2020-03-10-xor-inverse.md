---
layout: post
title: "Inverse of XOR"
excerpt: "... is XOR, duh!"
categories: [algorithms]
---


I stumbled across a challenge on a [wargame](https://en.wikipedia.org/wiki/Wargamer_(website)) site that involved a "random" key that was `XOR`'ed against your input and then checked for a value.

I was left with something that boiled down to this:

```python
a ^ b == c
```

Where `b` and `c` are known, and we must find an `a` to satisfy such case. It turns out, the inverse of XOR is just, well, [XOR](https://stackoverflow.com/a/14279946).

This is obvious once you think about the operation `XOR` is doing on the _bits_ that make up your two values being compared.

For example, lets say we have the following decimal numbers:

```python
a = 3
b = 7
```

Then we know their binary represenation can be shown like so:

```python
a = 011
b = 111
```

The result of `a^b` (which is XOR in Python) is:

```python
>>> a^b
4
```

In binary:

```python
  011
^ 111
-----
  100
```

So its clear to see that given the way XOR operates, (returns `1` if mismatch, `0` else), if we have three strings whose digits are constrained to the set `{0, 1}`, we are clearly able to determine any third variable given the other two.




