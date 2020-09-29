discord-meta
======================

Delete Meta

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/discord-meta.svg)](https://npmjs.org/package/discord-meta)
[![CircleCI](https://circleci.com/gh/hekar/discord-meta/tree/master.svg?style=shield)](https://circleci.com/gh/hekar/discord-meta/tree/master)
[![Downloads/week](https://img.shields.io/npm/dw/discord-meta.svg)](https://npmjs.org/package/discord-meta)
[![License](https://img.shields.io/npm/l/discord-meta.svg)](https://github.com/hekar/discord-meta/blob/master/package.json)

<!-- toc -->
* [Usage](#usage)
* [Commands](#commands)
<!-- tocstop -->
# Usage
<!-- usage -->
```sh-session
$ npm install -g discord-meta
$ discord-meta COMMAND
running command...
$ discord-meta (-v|--version|version)
discord-meta/0.1.0 linux-x64 node-v14.9.0
$ discord-meta --help [COMMAND]
USAGE
  $ discord-meta COMMAND
...
```
<!-- usagestop -->
# Commands
<!-- commands -->
* [`discord-meta hello [FILE]`](#discord-meta-hello-file)
* [`discord-meta help [COMMAND]`](#discord-meta-help-command)

## `discord-meta hello [FILE]`

describe the command here

```
USAGE
  $ discord-meta hello [FILE]

OPTIONS
  -f, --force
  -h, --help       show CLI help
  -n, --name=name  name to print

EXAMPLE
  $ discord-meta hello
  hello world from ./src/hello.ts!
```

_See code: [src/commands/hello.ts](https://github.com/hekar/discord-meta/blob/v0.1.0/src/commands/hello.ts)_

## `discord-meta help [COMMAND]`

display help for discord-meta

```
USAGE
  $ discord-meta help [COMMAND]

ARGUMENTS
  COMMAND  command to show help for

OPTIONS
  --all  see all commands in CLI
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v3.2.0/src/commands/help.ts)_
<!-- commandsstop -->
