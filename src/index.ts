import stream from 'stream';
import { analyzeCodeStatically, tool } from '@moneyforward/sca-action-core';

(async (): Promise<void> => {
  process.exitCode = await analyzeCodeStatically(
    'rubocop',
    ['--format', 'emacs', '-P'],
    undefined,
    ((): stream.Transform[] => {
      const severityMap = new Map<string, string>([
        ['R', 'Refactor'],
        ['C', 'Convention'],
        ['W', 'Warning'],
        ['E', 'Error'],
        ['F', 'Fatal'],
      ]);
      const transformers = [
        new tool.LineTransformStream(),
        new stream.Transform({
          readableObjectMode: true,
          writableObjectMode: true,
          transform: function (problem, _encoding, done): void {
            const regex = /^(.+):(\d+):(\d+): (R|C|W|E|F): (.+): (.*)$/;
            const [matches, file, line, column, severity, code, message] = regex.exec(problem) || [];
            done(null, matches ? {
              file,
              line,
              column,
              severity: /(E|F)/.test(severity) ? 'error' : 'warning',
              message: `[${severityMap.get(severity)}] ${code}: ${message}`,
              code,
            } : undefined);
          }
        }),
      ];
      transformers.reduce((p, c) => p.pipe(c));
      return transformers;
    })(),
    tool.installGem(false, 'rubocop'),
    2
  );
})().catch(reason => {
  console.log(`::error::${String(reason)}`);
  process.exit(1);
});
