import stream from 'stream';
import util from 'util';
import StaticCodeAnalyzer, { installer } from '@moneyforward/sca-action-core';
import { transform } from '@moneyforward/stream-util'
import { analyzer } from '@moneyforward/code-review-action';

type AnalyzerConstructorParameter = analyzer.AnalyzerConstructorParameter;

const debug = util.debuglog('@moneyforward/code-review-action-rubocop-plugin');

export default abstract class Analyzer extends StaticCodeAnalyzer {
  private static readonly command = 'rubocop';

  constructor(...args: AnalyzerConstructorParameter[]) {
    super(Analyzer.command, args.map(String).concat(['--format', 'emacs', '-P']), undefined, 2);
  }

  protected async prepare(): Promise<void> {
    console.log(`::group::Installing gems...`);
    try {
      await new installer.RubyGemsInstaller(false).execute([Analyzer.command]);
    } finally {
      console.log(`::endgroup::`)
    }
  }

  protected createTransformStreams(): stream.Transform[] {
    const severityMap = new Map<string, string>([
      ['R', 'Refactor'],
      ['C', 'Convention'],
      ['W', 'Warning'],
      ['E', 'Error'],
      ['F', 'Fatal'],
    ]);
    return [
      new transform.Lines(),
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
  }
}
