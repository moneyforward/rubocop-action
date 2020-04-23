const stream = require('stream');
const { analyzeCodeStatically, tool: { installGem, LineTransformStream } } = require('@moneyforward/sca-action-core');

(async () => {
  process.exitCode |= await analyzeCodeStatically(
    'rubocop',
    ['--format', 'emacs', '-P'],
    undefined,
    (() => {
      const severityMap = {
        R: 'Refactor',
        C: 'Convention',
        W: 'Warning',
        E: 'Error',
        F: 'Fatal',
      };
      const transformers = [
        new LineTransformStream(),
        new stream.Transform({
          readableObjectMode: true,
          writableObjectMode: true,
          transform: function (problem, encoding, done) {
            const regex = /^(.+):(\d+):(\d+): (R|C|W|E|F): (.+): (.*)$/;
            const [matches, file, line, column, severity, code, message] = regex.exec(problem) || [];
            done(null, matches ? {
              file,
              line,
              column,
              severity: /(E|F)/.test(severity) ? 'error' : 'warning',
              message: `[${severityMap[severity]}] ${code}: ${message}`,
              code,
            } : undefined);
          }
        }),
      ];
      transformers.reduce((p, c) => p.pipe(c));
      return transformers;
    })(),
    installGem(false, 'rubocop'),
    2
  );
})().catch(reason => {
  console.log(`::error::${String(reason)}`);
  process.exit(1);
});
