import Analyzer from './analyzer';

(async (): Promise<void> => {
  const options = JSON.parse(process.env.INPUT_OPTIONS || '[]');
  const startingPoints = JSON.parse(process.env.INPUT_STARTING_POINTS || '[]');
  const workingDirectory = process.env.INPUT_WORKING_DIRECTORY;
  workingDirectory && process.chdir(workingDirectory);
  const analyzer = new Analyzer(options, startingPoints);
  process.exitCode = await analyzer.analyze();
})().catch(reason => {
  console.log(`::error::${String(reason)}`);
  process.exit(1);
});
