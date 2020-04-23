# Code review using Rubocop

Analyze code statically by using Rubocop in Github actions

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
