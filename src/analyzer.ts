import stream from 'stream';
import util from 'util';
import { analyzeCodeStatically, tool } from '@moneyforward/sca-action-core';

const debug = util.debuglog('rubocop-action');

export function createTransformStreams(): [stream.Transform, stream.Transform] {
  const severityMap = new Map<string, string>([
    ['R', 'Refactor'],
    ['C', 'Convention'],
    ['W', 'Warning'],
    ['E', 'Error'],
    ['F', 'Fatal'],
  ]);
  const transformers: stream.Transform[] = [
    new tool.LineTransformStream(),
    new stream.Transform({
      objectMode: true,
      readableObjectMode: true,
      writableObjectMode: true,
      transform: function (problem, _encoding, done): void {
        const regex = /^(.+):(\d+):(\d+): (R|C|W|E|F): (.+): (.*)$/;
        const [matches, file, line, column, severity, code, message] = regex.exec(problem) || [];
        debug('%s', matches);
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
  return [transformers[0], transformers[transformers.length - 1]];
}

export default class Analyzer {
  constructor(private options: string[] = [], private startingPoints: string[] = []) {
  }

  analyze(): Promise<number> {
    return analyzeCodeStatically(
      'rubocop',
      this.options.concat(['--format', 'emacs', '-P'], this.startingPoints),
      undefined,
      createTransformStreams(),
      tool.installGem(false, 'rubocop'),
      2
    );
  }
}
