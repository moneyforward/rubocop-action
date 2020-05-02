# Code review using Rubocop

Analyze code statically by using [Rubocop](https://github.com/rubocop-hq/rubocop) in Github actions

## Inputs

### `files`

Pass `rubocop` a list of files and directories to analyze.

Running `rubocop` with no arguments will analyze all Ruby source files in the warking directory.

### `options`

Changes `rubocop` command line options.

Specify the options in JSON array format.
e.g.: `'["--fail-level", "W", "--display-only-fail-level-offenses"]'`

### `working_directory`

Changes the current working directory of the Node.js process

## Example usage

```yaml
name: Analyze code statically
"on": pull_request
jobs:
  rubocop:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Analyze code statically using Rubocop
        uses: moneyforward/rubocop-action@v0
```

## Contributing
Bug reports and pull requests are welcome on GitHub at https://github.com/moneyforward/rubocop-action

## License
The gem is available as open source under the terms of the [MIT License](https://opensource.org/licenses/MIT).
