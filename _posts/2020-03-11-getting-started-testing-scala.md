---
layout: post
title: "Introduction to testing in Scala"
excerpt: "Following along with the 'getting started with scala and sbt on the command line' from the Scala docs."
categories: [Scala]
---

This follows the procedure mentioned in the [scala docs for getting started with testing scala from the command line](https://docs.scala-lang.org/getting-started/sbt-track/testing-scala-with-sbt-on-the-command-line.html).

### Setup
On the command line, create a new directory somewhere to work in.

```bash
cd ..../src/test-scala
```

`cd` into the directory and run `sbt new scala/scalatest-example.g8` to pull the scalatest template into our working dir:

```bash
sbt new scala/scalatest-example.g8
```

We'll name the project `ScalaTestTutorial` when prompted.

The project comes with `ScalaTest` as a dependency; we can observe this by looking in the `build.sbt` file that came with the project:

```bash
...
libraryDependencies += "org.scalatest" %% "scalatest" % "3.1.0" % Test
...
```

`cd` into the project's directory and run `sbt test`. This will run the test suite `CubeCalculatorTest` with a single test called `CubeCalculator.cube`:

```
cd scalatesttutorial
sbt test
...
8 warnings found
[info]   Compilation completed in 7.011s.
[info] Compiling 1 Scala source to ..../Downloads/github/ScalaFundamentals/src/test-scala/scalatesttutorial/target/scala-2.13/test-classes ...
[warn] there was one deprecation warning (since 3.1.0); re-run with -deprecation for details
[warn] one warning found
[info] CubeCalculatorTest:
[info] - CubeCalculator.cube
[info] Run completed in 277 milliseconds.
[info] Total number of tests run: 1
[info] Suites: completed 1, aborted 0
[info] Tests: succeeded 1, failed 0, canceled 0, ignored 0, pending 0
[info] All tests passed.
[success] Total time: 10 s, completed Feb 27, 2020, 11:48:21 AM
```

But how did it know to run those tests? Well...

### Understanding tests
Open up two files in a text editor:
* `src/main/scala/CubeCalculator.scala`:

```scala
object CubeCalculator extends App {
  def cube(x: Int) = {
    x * x * x
  }
}
```

* `src/test/scala/CubeCalculatorTest.scala`:

```scala
class CubeCalculatorTest extends org.scalatest.FunSuite {
  test("CubeCalculator.cube") {
    assert(CubeCalculator.cube(3) === 27)
  }
}
```

In the file `CubeCalculator.scala`, you’ll see how we define an example object with a single method, `cube`.

In the file `CubeCalculatorTest.scala`, you’ll see that we have a class named after the object we’re testing.

* `class CubeCalculatorTest` means we are testing the object `CubeCalculator`.
* `extends org.scalatest.FunSuite` lets us use functionality of ScalaTests's FunSuite class such as the `test` function.
* `test` is a function that comes from FunSuite that collects reuslts from `assertion`s within the function body (which in this case is making sure our cube function generates the correct value)
* `"CubeCalculator.cube"` is a name for the test. You can call it anything but one convention is "ClassName.methodName".
* `CubeCalculator.cube(3) === 27` checks whether the output of the `cube` function is `27`.
  * The `===` is part of ScalaTest and provides clean error messages.

### Adding another test case
Add another test block with its own assert statement that checks for the cube of 0:

```scala
...
  test("CubeCalculator.cube 0 should be 0") {
    assert(CubeCalculator.cube(0) === 0)
  }
...
```

Execute `sbt test` again. Note: similar to `~run`, we can also use `~test` to constantly test the code upon saving.


```
...
[info] CubeCalculatorTest:
[info] - CubeCalculator.cube 3 should be 27
[info] - CubeCalculator.cube 0 should be 0
[info] Run completed in 101 milliseconds.
[info] Total number of tests run: 2
[info] Suites: completed 1, aborted 0
[info] Tests: succeeded 2, failed 0, canceled 0, ignored 0, pending 0
[info] All tests passed.
[success] Total time: 1 s, completed Feb 27, 2020, 12:03:36 PM
[info] 3. Monitoring source files for root/test...
[info]    Press <enter> to interrupt or '?' for more options.
...
```

### Conclusion
You’ve seen one way to test your Scala code. You can learn more about ScalaTest’s FunSuite on the [official website](https://www.scalatest.org/getting_started_with_fun_suite). You can also check out other testing frameworks such as [ScalaCheck](https://www.scalacheck.org/) and [Specs2](https://etorreborre.github.io/specs2/).
