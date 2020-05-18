import { expect } from 'chai';
import stream from 'stream';
import util from 'util';
import Analyzer from '../src'

describe('Transform', () => {
  it('should return the problem object', async () => {
    const text = 'Rakefile:16:3: C: Rails/RakeEnvironment: Include `:environment` task as a dependency for all Rake tasks.';
    const analyzer = new (class extends Analyzer {
      public constructor() {
        super();
      }
      public createTransformStreams(): stream.Transform[] {
        return super.createTransformStreams();
      }
    })();
    const streams = [stream.Readable.from(text), ...analyzer.createTransformStreams()];
    await util.promisify(stream.pipeline)(streams);
    for await (const problem of streams[streams.length - 1])
      expect(problem).to.deep.equal({
        file: 'Rakefile',
        line: '16',
        column: '3',
        severity: 'warning',
        message: '[Convention] Rails/RakeEnvironment: Include `:environment` task as a dependency for all Rake tasks.',
        code: 'Rails/RakeEnvironment'
      });
  });
});
