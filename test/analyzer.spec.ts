import { expect } from 'chai';
import stream from 'stream';
import { Transformers } from '@moneyforward/sca-action-core';
import Analyzer from '../src/analyzer'

describe('Transform', () => {
  it('should return the problem object', async () => {
    const text = 'Rakefile:16:3: C: Rails/RakeEnvironment: Include `:environment` task as a dependency for all Rake tasks.';
    const analyzer = new (class extends Analyzer {
      public constructor() {
        super();
      }
      public createTransformStreams(): Transformers {
        return super.createTransformStreams();
      }
    })();
    const [prev, next = prev] = analyzer.createTransformStreams();
    stream.Readable.from(text).pipe(prev);
    for await (const problem of next)
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
