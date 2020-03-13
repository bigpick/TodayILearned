---
author: george_pick
layout: post
title: "Download, set up, and introduction to Scala"
excerpt: "Following along with the 'getting started with scala and sbt on the command line' from the Scala docs."
categories: [Scala]
---

This follows the procedure mentioned in the [scala docs for getting started with scala, sbt, and the command line](https://docs.scala-lang.org/getting-started/sbt-track/getting-started-with-scala-and-sbt-on-the-command-line.html).

## Installation
## Java version check
(I already had Java installed on my machine, so I can check the version; if you need to download it, see [the download pages](https://www.oracle.com/technetwork/java/javase/downloads/jdk8-downloads-2133151.html)).

Already have Java8 JDK installed:
```bash
javac -version
javac 1.8.0_231
```

## Install `stb`

From the sbt documentation [here](https://www.scala-sbt.org/):

> sbt is a build tool for Scala, Java, and more. It requires Java 1.8 or later.

So I will be using this tool from the command line to interact with my Scala projects. I have a Mac and use [Homebrew](https://brew.sh/) so I can install sbt using that (I already had done so). See the sbt docs link above for other platform installation instructions:

```bash
brew install sbt
Warning: sbt 1.3.8_1 is already installed and up-to-date
To reinstall 1.3.8_1, run `brew reinstall sbt`
```

## Create your first project
## `cd` to an empty folder

We want to move to a new empty folder which will be the home for our working project. For me, that is:

```bash
cd ....Downloads/github/ScalaFundamentals/src
```

## Pull hello world template from git

Now, we can run a command with `sbt` to pull a [project template using the `sbt new` syntax](https://www.scala-sbt.org/1.x/docs/sbt-new-and-Templates.html).

```
sbt new scala/hello-world.g8
// Pulls the ‘hello-world’ template from GitHub
// It will also create a target folder, which you can ignore.

sbt new scala/hello-world.g8
[info] Loading settings for project global-plugins from plugins.sbt ...
[info] Loading global plugins from ..../.sbt/1.0/plugins
[info] Set current project to src (in build file:..../Downloads/github/ScalaFundamentals/src/)
[info] Set current project to src (in build file:..../Downloads/github/ScalaFundamentals/src/)
...
A template to demonstrate a minimal Scala application

name [Hello World template]: hello-world

Template applied in ..../Downloads/github/ScalaFundamentals/src/./hello-world
```

### Let’s take a look at what just got generated

```bash
src
├── hello-world
│   ├── build.sbt  # sbt's build definition file
│   ├── project    # sbt uses this to install and manage plugins and dependencies
│   │   └── build.properties
│   └── src
│       └── main
│           └── scala          # All of your scala code goes here
│               └── Main.scala # (Entry point of program) <-- this is all we need for now
└── target
    └── streams
        └── _global
            └── _global
                └── checkBuildSources
                    └── _global
                        ├── inputFileStamps
                        │   └── previous
                        └── streams
                            └── out
```

So, from our fresh `src` directory we see the new project we pulled and then when prompted named `hello-world` under `hello-world`.

> After you build your project, sbt will create more `target` directories for generated files. You can ignore these.

## Running the project

`cd` into hello-world:

```bash
cd hello-world
```

Run `sbt`. This will open up the sbt console.

```
ScalaFundamentals/src/hello-world
  - sbt
[info] [launcher] getting org.scala-sbt sbt 1.3.2  (this may take some time)...
...
[info] Loading settings for project hello-world from build.sbt ...
[info] Set current project to hello-world (in build file:..../Downloads/github/ScalaFundamentals/src/hello-world/)
[info] sbt server started at local://....g/.sbt/1.0/server/d0da57e6fe00def3eb6f/sock
sbt:hello-world>
```

Ok - we're in the sbt console now. Since we invoked the `sbt` command from our specific directory, we can use the [run](https://www.scala-sbt.org/1.x/docs/Running.html) command to execute our `Main.scala`.

Instead, I'll used `~run`.
* The `~` is optional, and causes `sbt` to re-run on every file save, allowing for a fast edit/run/debug cycle.

```
sbt:hello-world> ~run
[info] Updating
...
[info] Compiling 1 Scala source to ..../Downloads/github/ScalaFundamentals/src/hello-world/target/scala-2.13/classes ...
...
[info]   Compilation completed in 7.091s.
[info] running Main
Hello, World!
[success] Total time: 10 s, completed Feb 27, 2020, 11:29:31 AM
[info] 1. Monitoring source files for hello-world/run...
[info]    Press <enter> to interrupt or '?' for more options.
sbt:hello-world>
```

Neat, it printed out `Hello, World!`. I hit enter to break out of the continuous `~run`.

## Modifying the code
Open the file `src/main/scala/Main.scala` in your favorite text editor.

Change `“Hello, World!”` to `“Hello, you.”` (or whatever you want printed)

If you haven’t stopped the `sbt` command, you should see `“Hello, you.”` printed to the console:

```
...
[info]   Compilation completed in 7.091s.
[info] running Main
Hello, World!
[success] Total time: 10 s, completed Feb 27, 2020, 11:29:31 AM
[info] 1. Monitoring source files for hello-world/run...
[info]    Press <enter> to interrupt or '?' for more options.
# here can see it gets live updated
[info] Build triggered by ..../Downloads/github/ScalaFundamentals/src/hello-world/src/main/scala/Main.scala. Running 'run'.
[info] Compiling 1 Scala source to ..../Downloads/github/ScalaFundamentals/src/hello-world/target/scala-2.13/classes ...
[info] running Main
Hello, you.
[success] Total time: 0 s, completed Feb 27, 2020, 11:34:36 AM
[info] 3. Monitoring source files for hello-world/run...
[info]    Press <enter> to interrupt or '?' for more options.
```

You can continue to make changes and see the results automatically displayed in the console. Cool.

## Adding a dependency
Let’s look at [how to use published libraries](https://www.scala-sbt.org/1.x/docs/Library-Dependencies.html) to add extra functionality to our apps.

Open up our project's `build.sbt` and add the following line:

```scala
libraryDependencies += "org.scala-lang.modules" %% "scala-parser-combinators" % "1.1.2"
```

Here, `libraryDependencies` is a set of dependencies, and by using `+=`, we’re appending the [scala-parser-combinators](https://github.com/scala/scala-parser-combinators) dependency to the set of dependencies that sbt will go and fetch when it is invoked using the `sbt` command.

Now, in any Scala file in this project, you can import classes, objects, etc, from `scala-parser-combinators` with a regular import.

```scala
import scala-parse-combinators._
```

You can find more published libraries on [Scaladex](https://index.scala-lang.org/), the Scala library index, where you can also copy the above dependency information for pasting into your `build.sbt` file.

## Next steps
Continue to the next tutorial in the getting started with sbt series, and learn about [testing Scala code with sbt in the command line](https://docs.scala-lang.org/getting-started/sbt-track/testing-scala-with-sbt-on-the-command-line.html).

_or_:
* Continue learning Scala interactively online on [Scala Exercises](https://www.scala-exercises.org/scala_tutorial).
* Learn about Scala’s features in bite-sized pieces by stepping through our [Tour of Scala](https://docs.scala-lang.org/tour/tour-of-scala.html).

