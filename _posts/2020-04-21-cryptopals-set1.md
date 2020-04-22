---
author: george_pick
layout: post
title: "Cryptopals Challenge Set 1: Basics"
excerpt: "Exercises to ramp developers up gradually into coding cryptography."
categories: [crypto practice]
---

# [Cryptopals crypto challenges](https://cryptopals.com/sets/1)

## Crypto Challenge Set 1
> This is the qualifying set. We picked the exercises in it to ramp developers up gradually into coding cryptography, but also to verify that we were working with people who were ready to write code.
>
> This set is relatively easy. With one exception, most of these exercises should take only a couple minutes. But don't beat yourself up if it takes longer than that. It took Alex two weeks to get through the set!
>
> If you've written any crypto code in the past, you're going to feel like skipping a lot of this. Don't skip them. At least two of them (we won't say which) are important stepping stones to later attacks.
>
> 1. [Convert hex to base64](#convert-hex-to-base64)
> 2. [Fixed XOR](#fixed-xor)
> 3. [Single-byte XOR cipher](#single-byte-xor-cipher)
> 4. [Detect single-character XOR](#detect-single-character-xor)
> 5. [Implement repeating-key XOR](#implement-repeating-key-xor)
> 6. [Break repeating-key XOR](#break-repeating-key-xor)
> 7. [AES in ECB mode](#aes-in-ecb-mode)
> 8. [Detect AES in ECB mode](#detect-aes-in-ecb-mode)

Solutions and thoughts around the cryptopals challenge set 1, as linked above. I am using this a refresher to cryptography ideas and practices in order to better participate in CTFs with crypto categories, but the ideas here are applicable to much more than just CTFs.

[Link to github repo for code solutions](https://github.com/bigpick/CaptureTheFlagCode/tree/master/practice/CryptoPals).

# Convert hex to base64

[This one is trivial](https://github.com/bigpick/CaptureTheFlagCode/tree/master/practice/CryptoPals/Set1_basics/chall1_hextobase64).

{% highlight python %}
./chall1.py 49276d206b696c6c696e6720796f757220627261696e206c696b65206120706f69736f6e6f7573206d757368726f6f6d
SSdtIGtpbGxpbmcgeW91ciBicmFpbiBsaWtlIGEgcG9pc29ub3VzIG11c2hyb29t
{% endhighlight %}

---
&nbsp;
&nbsp;

# Fixed XOR

[Again, this one is trivial](https://github.com/bigpick/CaptureTheFlagCode/tree/master/practice/CryptoPals/Set1_basics/chall2_fixedxor).

Just take two strings of equal length, convert each to bytes, and then XOR each byte.

{% highlight python %}
./chall2.py --xor_pair 1c0111001f010100061a024b53535009181c,686974207468652062756c6c277320657965
746865206b696420646f6e277420706c6179
{% endhighlight %}

---
&nbsp;
&nbsp;

# Single-byte XOR cipher

The title for this one is a bit misleading, as it's actually really "Cracking single-byte XOR encrypted data".

Single-byte XOR'ing data is trivial, and is just like the fixed XOR above except with a single value against a whole string.

This however is:
* Given a hex encoded string, find the single byte key that was used to encrypt the string and decrypt it

So, we need to do a few things:

1. Convert given hexstring to string of bytes
2. Brute force the possible single byte XOR results
3. Score the results, and pick the one most likely to be valid.
4. Decode message

The challenge mentions we should

> Devise some method for "scoring" a piece of English plaintext. Character frequency is a good metric

So we'll follow that approach for step 3.

Step 1 is trivial:

{% highlight python %}
    # parse_cmdline_args just returns a string that we passed at CLI
    to_be_decoded = parse_cmdline_args()
    decoded = decode(to_be_decoded, 'hex')
{% endhighlight %}

Then, for step 2, we need to iterate over a range of possible single byte keys. I chose all the printable values as my range. This can be used from the `string` library, via the `printable` method:

{% highlight python %}
>>> import string
>>> string.printable
'0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ!"#$%&\'()*+,-./:;<=>?@[\\]^_`{|}~ \t\n\r\x0b\x0c'
{% endhighlight %}

For each of those values, we need to apply the single byte to every byte in our cipher text:

{% highlight python %}
    for maybe_key in printable:
        result = b''
        for c in decoded:
            result+=bytes([int(c) ^ ord(maybe_key)])
{% endhighlight %}

Then, we need a way to "score" the resulting plaintext. Using the hint suggestion, we can find that there is quite a bit of resources online for letter frequency dictionaries, such as [this one](https://laconicwolf.com/2018/05/29/cryptopals-challenge-3-single-byte-xor-cipher-in-python/), which I stole:

{% highlight python %}
# Taken from https://laconicwolf.com/2018/05/29/cryptopals-challenge-3-single-byte-xor-cipher-in-python/
def get_english_score(input_bytes):
    """Compares each input byte to a character frequency
    chart and returns the score of a message based on the
    relative frequency the characters occur in the English
    language
    """
    character_frequencies = {
        'a': .08167, 'b': .01492, 'c': .02782, 'd': .04253,
        'e': .12702, 'f': .02228, 'g': .02015, 'h': .06094,
        'i': .06094, 'j': .00153, 'k': .00772, 'l': .04025,
        'm': .02406, 'n': .06749, 'o': .07507, 'p': .01929,
        'q': .00095, 'r': .05987, 's': .06327, 't': .09056,
        'u': .02758, 'v': .00978, 'w': .02360, 'x': .00150,
        'y': .01974, 'z': .00074, ' ': .13000
    }
    return sum([character_frequencies.get(chr(byte), 0) for byte in input_bytes.lower()])
{% endhighlight %}

When we pass a plaintext byte string to that function, it will take the frequency score for each byte and sum them together. The higher the score, the more likely the input byte string was a valid string.

So, our loop of applying each possible printable byte with our input string looks like the following, now with scoring each result:

{% highlight python %}
    scores = []
    for maybe_key in printable:
        result = b''
        for c in decoded:
            result+=bytes([int(c) ^ ord(maybe_key)])

        score = get_english_score(result)
        # Append score and plaintext for temporary history
        scores.append([result, score])
{% endhighlight %}

Now that we have the score for each printable's XOR result, we can sort the resulting values by most-likely to be valid (i.e. highest first) to least-likely to be valid:

{% highlight python %}
    scored = sorted(scores, key=operator.itemgetter(1), reverse=True)
    print("Possible entries, sorted by least-likely-gibberish to most-likely-gibberish:")
    for possible_entry in scored:
        print(possible_entry[0].decode("ascii"))
{% endhighlight %}

This gives us what looks to be the answer:

{% highlight python %}
./chall3.py 1b37373331363f78151b7f2b783431333d78397828372d363c78373e783a393b3736
Possible entries, sorted by least-likely-gibberish to most-likely-gibberish:
Cooking MC's like a pound of bacon
iEEACDM
Yi
FCAO
K
ZE_DN
...
{% endhighlight %}

More Vanilla Ice!

[Full source code available here](https://github.com/bigpick/CaptureTheFlagCode/tree/master/practice/CryptoPals/Set1_basics/chall3_singlebyteXOR).

---
&nbsp;
&nbsp;

# Detect single-character XOR

> One of the 60-character strings in this file has been encrypted by single-character XOR.
>
> Find it.

We are given a file where each line is a 60 character hex string. We need to somehow find which one was encrypted, and then also find what the single character was and decrypt it.

The latter part is just what we did in the above challenge for [the single byte XOR cipher](#single-byte-xor-cipher).

My approach was instead of finding which one was encrypted, and then finding the single character that encrypted it, I just tried single-character decrypting _each_ entry, and then stored the top 5 results for each of those. Then, I sorted the list of top 5s from each potentially encrypted line, to get the most-likely to be valid plaintext, which would also tell us which line ended up being the one that was encrypted.

The code is mostly re-used from the above challenge, except this time, we loop over every line in the given file.
* For each line, do the process from above for finding the single-character XOR key
*   Take the top 5 most likely to-be-valid values from a line and add it to a list of stored previous values, in the form `[plaintext, score]`
* Sort the list of top 5 values, most likely to be valid first
* Try to print the results, after decoding to ASCII

By doing this, we will get what is most likely to be the plaintext as ASCII as the first result, with any other potential, less likely, ASCII solutions following it.

{% highlight python %}
./chall4.py challenge4_text.txt
Now that the party is jumping

Th!UVguemtv+Iev|SljN&|yeI_Etv
tHuvGUEMTV
          iEV\sLJn\Y#Ei�eTV
Ea NEy2HcAoF2Um�CUxe%s)Sv69KQL
Ey0DGvdt|eg:XtgmB}{_7mhtXNTeg
...
{% endhighlight %}

[Full source code available here](https://github.com/bigpick/CaptureTheFlagCode/tree/master/practice/CryptoPals/Set1_basics/chall4_detect_singlechar_xor)

---
&nbsp;
&nbsp;

# Implement repeating-key XOR

> Here is the opening stanza of an important work of the English language:
>
> ```
> Burning 'em, if you ain't quick and nimble
>
> I go crazy when I hear a cymbal
> ```
>
> Encrypt it, under the key "ICE", using repeating-key XOR.
>
> It should come out to:
>
> ```
> 0b3637272a2b2e63622c2e69692a23693a2a3c6324202d623d63343c2a26226324272765272
>
> a282b2f20430a652e2c652a3124333a653e2b2027630c692b20283165286326302e27282f
> ```

For this one we are given some plaintext in the form of more Vanilla Ice lyrics. We need to implement repeating-key XOR to produce some expected output. [Repeating key XOR](https://en.wikipedia.org/wiki/XOR_cipher) is a form of an XOR cipher were a fixed key is used to encrypt a given plaintext. For each byte in the plaintext, a byte of the fixed key is XOR'ed against it sequentially. When the end of the key is reached, the next byte of the plaintext is encrypted with the first byte of the key. Thus, the key's bytes are cycled over until the plaintext is completely encrypted.

We are given the key `ICE`, for this case. So, we will need to:

1. Convert given plaintext to bytes
2. Convert key to bytes
3. For each byte in plaintext:

3.a    starting at key[0], XOR plaintext byte with key byte

3.b    increment key index

3.c    if end of key, send key index back to start of key

In order to achieve the logic for 3, I decided to use a `for` loop where the key byte index was incremented by one and then modded the key size for each plaintext byte iteration. This way, the key index automatically reset to the beginning once the end of the key was reached.

Accordingly, the function for the repeating XOR cipher looks like so:

{% highlight python %}
def repeating_key_xor(input_str: bytes, key: bytes) -> bytes:
    cipher = b''
    idx = 0
    for byte in input_str:
        cipher+=bytes([byte ^ key[idx]])
        idx = (idx+1) % len(key)
    return cipher
{% endhighlight %}

It takes an input string of bytes, and a fixed key of bytes, and builds the output ciphertext.

With this function, applying the code to our input is trivial:

{% highlight python %}
    plaintext = '\n'.join([x.strip() for x in to_be_encrypted if x != ""])
    cipher = repeating_key_xor(plaintext.encode(), KEY.encode())
    print(cipher.hex())

    expected = ("0b3637272a2b2e63622c2e69692a23693a2a3c6324202d623d63343c2a26226324272765272"
                "a282b2f20430a652e2c652a3124333a653e2b2027630c692b20283165286326302e27282f")
    assert(cipher.hex() == expected)
{% endhighlight %}

Running the code against our input, we see that it works as expected:

```
./chall5.py vanilla.txt
0b3637272a2b2e63622c2e69692a23693a2a3c6324202d623d63343c2a26226324272765272a282b2f20430a652e2c652a3124333a653e2b2027630c692b20283165286326302e27282f
```

[Full source code available here](https://github.com/bigpick/CaptureTheFlagCode/tree/master/practice/CryptoPals/Set1_basics/chall5_repeating_key_xor)

---
&nbsp;
&nbsp;

# Break repeating-key XOR

> There's a file [here](https://cryptopals.com/static/challenge-data/6.txt). It's been base64'd after being encrypted with repeating-key XOR.
>
> Decrypt it.
>
> This challenge isn't conceptually hard, but it involves actual error-prone coding. The other challenges in this set are there to bring you up to speed. This one is there to qualify you. If you can do this one, you're probably just fine up to Set 6.

This one builds off all the previous skills we've practiced in the previous challenges, so if you are still a bit lost it's best to go back and re-read your implementations of the previous challenges as otherwise this one will be much more difficult.

We're given a full size file, that's base64 encrypted. We need to:

1. Decode the data from base64
2. Implement a [hamming distance](https://en.wikipedia.org/wiki/Hamming_distance) function
3. Ensure that our hamming distance function works as expected
4. Find the _most likely_ key length for the key that was used to repeating key XOR encrypt the data
5. Break the data into expected key size chunks
6. Transpose each chunk into the Nth byte
7. Try to brute force each transposed block via the method we used to break single byte XOR
8. Take all most-likely single byte keys and join them together, and then decrypt the ciphertext by applying repeating key XOR with it

Like before, step 1 is trivial:

{% highlight python %}
    f = parse_cmdline_args()[0]
    with open(f, 'r') as infile:
        b64_encoded = infile.readlines()
    ciphertext = b64decode('\n'.join([x.strip() for x in b64_encoded if x != ""]))
{% endhighlight %}

For step 2, I had to look up what "Hamming distance" was. Reading online though seemed to trip me up, most documentation I read seemed to imply simply a difference in _characters_ between two strings. Therefore, originally, I got `14` as a distance between the two test strings.

So, I looked around for some pre-built code from pypi to see if there is a library implementation of the function. Sure enough, I found:

* [Distance](https://pypi.org/project/Distance/) -- "Utilities for comparing sequences"
* [scipy.spatial.distance.hamming](https://docs.scipy.org/doc/scipy-0.14.0/reference/generated/scipy.spatial.distance.hamming.html)

However, both still returned 14! What could be the deal here? Reading back through the challenge prompt:

> … _The Hamming distance is just the number of differing bits_ ...

Notice: **bits**. The code that I had implemented before was checking _bytes_. If I instead switched to comparing the bits between each string, it returned the expected distance!

This can be done by taking each input string, and **XOR'ing** each byte. You can not simply _compare_ the bytes, as we need the binary difference. By XOR'ing the two, we are effectively returning a value where _only_ the differing bits will be 1 (since that is how XOR works :) ). Therefore, we can code it like so:

{% highlight python %}
def find_hamming_distance(string1: bytes, string2: bytes) -> int:
    """
    Find hamming distance between two strings.
    The Hamming distance is just the number of differing bits.

    :param string1: The first string to be compared, as bytes
    :param string2: The second string to be compared, as bytes
    :returns: The hamming distance between the two params as an int
    """
    distance = 0
    for byte1, byte2 in zip(string1, string2):
        diff = byte1 ^ byte2
        # XOR only returns 1 if bits are different
        distance += sum([1 for bit in bin(diff) if bit == '1'])
    return distance
{% endhighlight %}

More concretely:

{% highlight python %}

>>> find_hamming_distance(b"moo", b"foo")
3
>>> ' '.join(format(ord(x), 'b') for x in "foo")
'1100110 1101111 1101111'
>>> ' '.join(format(ord(x), 'b') for x in "moo")
'1101101 1101111 1101111'
    ^ ^^
{% endhighlight %}

Great! Now on to:

> 4. Find the _most likely_ key length for the key that was used to repeating key XOR encrypt the data

The challenge suggests we do this by the following:

> For each KEYSIZE, take the first KEYSIZE worth of bytes, and the second KEYSIZE worth of bytes, and find the edit distance between them. Normalize this result by dividing by KEYSIZE.
>
> The KEYSIZE with the smallest normalized edit distance is probably the key. You could proceed perhaps with the smallest 2-3 KEYSIZE values. Or take 4 KEYSIZE blocks instead of 2 and average the distances.

I decided on a (hopefully) even more likely to be valid approach based on the latter: taking as many KEYSIZE blocks as possible up to a maximum set number, and averaging all of their distances. This kind of reminded me of a [sliding window type approach](https://stackoverflow.com/questions/8269916/what-is-sliding-window-algorithm-examples), where, if for example we had a plaintext, X, and KEYSIZE, y, it would look like:

{% highlight python %}
plaintext = "abcdefghijklmnopqrstuvqxyz"
# current KEYSIZE
y = 2
# it would compare:
score1 = find_hamming_distance(plaintext[0:2], plaintext[2:4])
score2 = find_hamming_distance(plaintext[2:4], plaintext[4:6])
# ... up until the end, then:
keysize_2_score = mean(score1, score2, …)
{% endhighlight %}

So, then something for keysize 3 would be:

{% highlight python %}
plaintext = "abcdefghijklmnopqrstuvqxyz"
# current KEYSIZE
y = 3
# it would compare:
score1 = find_hamming_distance(plaintext[0:3], plaintext[3:6])
score2 = find_hamming_distance(plaintext[3:6], plaintext[6:9])
# ... up until the end, then:
keysize_3_score = mean(score1, score2, …)
{% endhighlight %}

And so on. I decided to test from keysizes of of 2 inclusive through 41 exclusive, so [2, 41). By repeating the above process for each of those keysizes, and taking the keysize with the highest average score, we can assume that we have the key size that returned the most likely to be valid english results.

The function to do this looks like so:

{% highlight python %}
def find_most_likely_keysize(start_size: int, end_size: int, iterations: int, ciphertext: bytes) -> int:
    """
    Finds the most likely key's length of repeating key XOR encrypted data.

    :param start_size: The lower bound, inclusive, of key size to try, as in int.
    :param end_size: The upper bound, exclusive, of key size to try, as in int.
    :param iterations: The number of sliding window neighbors iterations to attempt, as an int.
    :param ciphertext: The input ciphertext, as bytes
    :returns: An integer representing the most likely key length.
    """
    keysize_distances = {}
    for keysize in range(start_size, end_size):
        # Try up to 50 sliding window neighbors
        # ie. compare ciphertext[0:2] vs ciphertext[2:4]
        #             ciphertext[2:4] vs ciphertext[4:6]
        #             ... 48 more times, where the start/stop ranges match the keysize
        avg_distance = find_average_keysize_distance(keysize, ciphertext, iterations)
        keysize_distances[keysize] = avg_distance

    most_likely_keysize = sorted(keysize_distances.items(), key=lambda x: x[1])[0][0]
    return most_likely_keysize
{% endhighlight %}

The `find_average_keysize_distance(keysize, ciphertext, iterations)` mentioned is the logic that calculates the actual average hamming distance given the current KEYSIZE value.

You can see it takes three arguments:

* Current keysize to try
* The set of ciphertext values
* And the maximum number of iterations to try to average up to

The only new thing here is the `iterations` values. Above, I mentioned "… up until the end". Here, the value for `iterations` is the "end". For example, in the challenge prompt:

> For each KEYSIZE, take the first KEYSIZE worth of bytes, and the second KEYSIZE worth of bytes, and find the edit distance between them. Normalize this result by dividing by KEYSIZE

This would correlate to having `iterations=1`, since we'd _only_ have one iteration of comparing chunks.

> … Or take 4 KEYSIZE blocks instead of 2 and average the distances.

This would correlate to having `iterations=4`. To try to get a more-likely valid response, I set the `iterations` to 50. For the smaller KEYSIZE values, we'll get quite a bit of results to be averaged, so we should actually get up to 50 iterations. For the larger KEYSIZE values though, we just go until the end of the ciphertext.

{% highlight python %}
def find_average_keysize_distance(keysize: int, ciphertext: bytes, num_chunks:int) -> float:
    """
    Find the keysize difference between two chunks of size keysize.
    Start at index 0 and iterate through adjacent neighbors num_chunks times.
    This is done with a sliding window approach, i.e
        [0:2] vs [2:4]
        [2:4] vs [4:6]
        [4:6] vs [6-8]
        ... num chunks times

    :param keysize: The expected keysize, as an integer.
    :param ciphertext: The ciphertext string, as bytes
    :param num_chunks: The number of chunk iterations to try
    :returns: A float representing the mean distance of all distances for that keysize
    """
    distances = []

    for iteration in range(num_chunks):
        try:
            start1 = 0 + (iteration * keysize)
            end1   = start1 + keysize
            start2 = end1
            end2   = start2 + keysize
            distance = find_hamming_distance(ciphertext[start1:end1], ciphertext[start2:end2])
            distances.append(distance / keysize)
        except IndexError:
            continue

    return mean(distances)
{% endhighlight %}

So, running the above functions like so gives us our expected key size:

{% highlight python %}
    most_likely_keysize = find_most_likely_keysize(2, 41, 50, ciphertext)
{% endhighlight %}

OK, so now we have our expected keysize. The above returns a length of `29`. I chose to only proceed with this single value, but you could take the top 3 expected KEYSIZEs, or how ever many you want.

> Now that you probably know the KEYSIZE: break the ciphertext into blocks of KEYSIZE length.

Easy enough; enter: list-comprehension

{% highlight python %}
ciphertext_broken = [ciphertext[x:x+most_likely_keysize] for x in range(0, len(ciphertext), most_likely_keysize)]
{% endhighlight %}

> Now transpose the blocks: make a block that is the first byte of every block, and a block that is the second byte of every block, and so on.

Starting at index 0, up until index KEYSIZE:

{% highlight python %}
def transpose_ciphertext_to_chunks(ciphertext_chunked: List[bytes], most_likely_keysize: int) -> List[bytes]:
    """
    Transpose the blocks: make a block that is the first byte of every block,
    and a block that is the second byte of every block, and so on.

    :param ciphertext_chunked: List of bytes of ciphertext were each index is
                               of an ordered chunk of original ciphertext, in
                               size most_likely_keysize.
    :param most_likely_keysize: The most likely length of repeating XOR key,
                                as an int.
    :returns: A list of transposed chunksm were each index is the Nth set of
              bytes from the original ciphertext_chunked list.
    """
    transposed_chunks = []
    for idx in range(most_likely_keysize):
        # Create a block made up of each nth byte, where n
        # is the keysize
        result_chunk = b""
        for og_chunk in ciphertext_chunked:
            result_chunk += og_chunk[idx:idx+1]
        transposed_chunks.append(result_chunk)
    return transposed_chunks
{% endhighlight %}

> Solve each block as if it was single-character XOR. You already have code to do this.

And now we're just back to were we've been before:

* Given a ciphertext that's expected to have been encrytped with a single byte XOR, find the single byte key

This is the case because as we had chunked the ciphertext into values where each element is comprised of the Nth set of bytes, we effectively have a set of chunks were each one's individual byte key is part of the grand key string.

The first item in the transposed ciphertext list is comprised of each original chunk's first byte. By finding the single byte that corresponds to the most likely key for this item, we find the single byte associated with the first byte in the complete key used to generate the original ciphertext.

Doing this for each Nth byte transposed chunk, we find the N (KEYSIZE) bytes that comprise the full key used for repeating XOR against the original plaintext.

{% highlight python %}
def brute_single_printable_xor(ciphertext_transposed: List[bytes]) -> str:
    """
    Try to find the most likely key for a single byte XOR given only the ciphertext.

    Takes as input a list of ciphertext chunks, where each index is the original
    ciphertext's chunks Nth set of bytes. That is, for each keysize length chunk
    from the original ciphertext, the first item in the passed in argument list
    is the each original ciphertext's chunks 0th byte.

    Scoring is based on the resulting plaintext's letter frequency. The highest
    scored result is returned.

    :param ciphertext_transposed: A list of chunks of ciphertext where each index
                                  is the original keysize chunked ciphertext's
                                  Nth set of bytes.
    :returns: The byte most likely to be the key.
    """
    top_scores = []
    for block in ciphertext_transposed:
        scores = []
        # Try every printable char
        for maybe_key in printable:
            #print("Trying key: ", maybe_key)
            plaintext = do_single_xor(block, ord(maybe_key))
            # Score the resulting plaintext
            score = get_english_score(plaintext)
            # Append score and plaintext for temporary history
            scores.append([plaintext, score, maybe_key])
        # Sort the temporary history in reverse, so most likely to be valid based
        # on frequency is first
        scored = sorted(scores, key=operator.itemgetter(1), reverse=True)
        top_scores.append(scored[0][2])

    return ''.join(top_scores)
{% endhighlight %}

{% highlight python %}
    # Solve each block as if it was single-character XOR. You already have code to do this.
    most_likely_key = brute_single_printable_xor(ciphertext_transposed)
    print("== Most likely key: \"" + most_likely_key + "\"")
{% endhighlight %}

So, now that we have the set of individual bytes we think most likely to be correct, we can join them together to form the most-likely correct key, and then just decrypt the original plaintext using that key and repeating key XOR:

{% highlight python %}
def repeating_key_xor(input_str: bytes, key: bytes) -> bytes:
    """
    Execute repeating key XOR against a given byte string.

    :param input_str: The input text as bytes to be XORed.
    :param key: The set of bytes to be used as the XOR key.
    :returns: A string of bytes representing the XOR'ed data.
    """
    cipher = b''
    idx = 0
    for byte in input_str:
        cipher+=bytes([byte ^ key[idx]])
        idx = (idx+1) % len(key)
    return cipher
{% endhighlight %}

{% highlight python %}
    print("== Results after repeating XOR decrypt with most likely key: ")
    cipher = repeating_key_xor(ciphertext, most_likely_key.encode())
    print(cipher.decode("ascii"))
{% endhighlight %}


Putting it all together,  the [full source code is available here](https://github.com/bigpick/CaptureTheFlagCode/tree/master/practice/CryptoPals/Set1_basics/chall6_break_repeating_xor). Running the script:

```
./chall6.py chall6_data.txt
== Most likely keysize:  29
== Most likely key: "Terminator X: Bring the noise"
== Results after repeating XOR decrypt with most likely key:
I'm back and I'm ringin' the bell
A rockin' on the mike while the fly girls yell
In ecstasy in the back of me
Well that's my DJ Deshay cuttin' all them Z's
Hittin' hard and the girlies goin' crazy
...
```

Result is the full lyrics to [Vanilla Ice - Play That Funky Music](https://www.youtube.com/watch?v=n2Ubq9XII8c)

Even more Vanilla Ice!

---
&nbsp;
&nbsp;

# AES in ECB mode


For reference, from the command line, using the `openssl` command:
* `cat chall7_data.txt| base64 -d | openssl enc -d -aes-128-ecb -K $(echo "YELLOW SUBMARINE" | xxd -p) -nosalt`

```
cat chall7_data.txt| base64 -d | openssl enc -d -aes-128-ecb -K $(echo "YELLOW SUBMARINE" | xxd -p) -nosalt
I'm back and I'm ringin' the bell
A rockin' on the mike while the fly girls yell
In ecstasy in the back of me
Well that's my DJ Deshay cuttin' all them Z's
Hittin' hard and the girlies goin' crazy
Vanilla's on the mike, man I'm not lazy.

I'm lettin' my drug kick in
It controls my mouth and I begin
To just let it flow, let my concepts go
My posse's to the side yellin', Go Vanilla Go!
…
```

So we know, again, more Vanilla Ice lyrics.

Using Python, there is the [pycryptodome](https://pycryptodome.readthedocs.io/en/latest/) module which has an [AES class already built in](https://pycryptodome.readthedocs.io/en/latest/src/cipher/aes.html).

From the documentation:

> The recipient can obtain the original message using …
>
> ```
> >>> from Crypto.Cipher import AES
> >>>
> >>> key = b'Sixteen byte key'
> >>> cipher = AES.new(key, AES.MODE_EAX, nonce=nonce)
> >>> plaintext = cipher.decrypt(ciphertext)
> >>> try:
> >>>     cipher.verify(tag)
> >>>     print("The message is authentic:", plaintext)
> >>> except ValueError:
> >>>     print("Key incorrect or message corrupted")
> ```

So, all we need to do is import the module, create a new AES instance with our key and mode (in this case):

> `var MODE_CBC`

And then format/decrypt our data.


Putting it all together,  the [full source code is available here](https://github.com/bigpick/CaptureTheFlagCode/tree/master/practice/CryptoPals/Set1_basics/chall7_aes_in_ecb_mode).

{% highlight python %}
#!/usr/bin/env python3.8

import argparse
from base64 import b64decode
from Crypto.Cipher import AES

KEY="YELLOW SUBMARINE"

def parse_cmdline_args() -> str:
    parser = argparse.ArgumentParser(description='Process command line args.')
    parser.add_argument('filename', metavar='f', type=str, nargs=1,
                        help='Path to file consisting of hex strings')
    args = parser.parse_args()
    return args.filename


def main():
    f = parse_cmdline_args()[0]
    with open(f, 'r') as infile:
        ciphertext = b64decode(infile.read())

    c = AES.new(KEY.encode(), AES.MODE_ECB)
    print(c.decrypt(ciphertext).decode())


if __name__ == '__main__':
    main()
{% endhighlight %}

Running this with the given file, we get the expected results:

```
./chall7.py chall7_data.txt
I'm back and I'm ringin' the bell
A rockin' on the mike while the fly girls yell
In ecstasy in the back of me
Well that's my DJ Deshay cuttin' all them Z's
Hittin' hard and the girlies goin' crazy
Vanilla's on the mike, man I'm not lazy.

I'm lettin' my drug kick in
It controls my mouth and I begin
...
```

---
&nbsp;
&nbsp;

# Detect AES in ECB mode

> [In this file](https://cryptopals.com/static/challenge-data/8.txt) are a bunch of hex-encoded ciphertexts.
>
> One of them has been encrypted with ECB … Detect it.
>
> Remember that the problem with ECB is that it is stateless and deterministic; the same 16 byte plaintext block will always produce the same 16 byte ciphertext.

My initial thought was that based on the hint, if we take each line of ciphertext and then reduce the line to just unique sets of 16 byte chunks, we should be able to find the line that has been encrypted:

{% highlight python %}
>>> with open('chall8_data.txt', 'r') as infile:
>>>   data = infile.readlines()
>>> data = [x.strip() for x in data if x != ""]
>>>
>>> lens = {}
>>> for line in data:
...   try:
...     lens[len(set(list(line[i:i+16] for i in range(0, len(line), 16))))] += 1
...   except KeyError:
...     lens[len(set(list(line[i:i+16] for i in range(0, len(line), 16))))] = 1
...
>>> lens
{20: 203, 14: 1}
{% endhighlight %}

In this case it works, but I think more generally we'd need to be able to take the line with the _fewest_ number of unique bytes, as we may have multiple.

Modifying the above slightly to print the index of the one with `len() == 14`, we see that it is the following:

{% highlight python %}
>>> lens = {}
>>> for line in data:
...   try:
...     if len(set(list(line[i:i+16] for i in range(0, len(line), 16)))) == 14:
...       print(line)
...     lens[len(set(list(line[i:i+16] for i in range(0, len(line), 16))))] += 1
...   except KeyError:
...     lens[len(set(list(line[i:i+16] for i in range(0, len(line), 16))))] = 1
...
d880619740a8a19b7840a8a31c810a3d08649af70dc06f4fd5d2d69c744cd283e2dd052f6b641dbf9d11b0348542bb5708649af70dc06f4fd5d2d69c744cd2839475c9dfdbc1d46597949d9c7e82bf5a08649af70dc06f4fd5d2d69c744cd28397a93eab8d6aecd566489154789a6b0308649af70dc06f4fd5d2d69c744cd283d403180c98c8f6db1f2a3f9c4040deb0ab51b29933f2c123c58386b06fba186a
>>>
{% endhighlight %}

Putting it all together,  the [full source code is available here](https://github.com/bigpick/CaptureTheFlagCode/tree/master/practice/CryptoPals/Set1_basics/chall8_detect_aes_in_ecb_mode).

```
./chall8.py chall8_data.txt
Most likely encrypted line unique chunk size:  14
Number of occurences:  1
d880619740a8a19b7840a8a31c810a3d08649af70dc06f4fd5d2d69c744cd283e2dd052f6b641dbf9d11b0348542bb5708649af70dc06f4fd5d2d69c744cd2839475c9dfdbc1d46597949d9c7e82bf5a08649af70dc06f4fd5d2d69c744cd28397a93eab8d6aecd566489154789a6b0308649af70dc06f4fd5d2d69c744cd283d403180c98c8f6db1f2a3f9c4040deb0ab51b29933f2c123c58386b06fba186a
```

---
&nbsp;
&nbsp;






