import { Command, Helper } from '@dojo/cli/interfaces';
import { Argv } from 'yargs';
import runTests from './runTests';

export interface TestArgs extends Argv {
	config: string;
	unit: boolean;
	functional: boolean;
	reporters: string;
	coverage: boolean;
	testingKey: string;
	secret: string;
	userName: string;
}

const command: Command = {
	description: 'test your application',
	register(helper: Helper) {
		helper.yargs.option('c', {
			alias: 'config',
			describe: 'Specifies what configuration to test with: \'local\'(default), \'browserstack\', \'testingbot\', or \'saucelabs\'.',
			type: 'string'
		});

		helper.yargs.option('r', {
			alias: 'reporters',
			describe: 'Comma separated list of reporters to use, defaults to Console',
			type: 'string'
		});

		helper.yargs.option('u', {
			alias: 'unit',
			describe: 'Indicates that only unit tests should be run. By default functional tests and unit tests are run'
		});

		helper.yargs.option('f', {
			alias: 'functional',
			describe: 'Indicates that only functional tests should be run. By default functional tests and unit tests are run'
		});

		helper.yargs.option('cov', {
			alias: 'coverage',
			describe: 'If specified coverage will be included. This is the same as adding the LcovHtml reporter'
		});

		helper.yargs.option('k', {
			alias: 'testingKey',
			describe: 'API key for testingbot or accesskey for saucelabs or browserstack',
			type: 'string'
		});

		helper.yargs.option('n', {
			alias: 'userName',
			describe: 'User name for testing platform',
			type: 'string'
		});

		helper.yargs.option('s', {
			alias: 'secret',
			describe: 'API secret for testingbot',
			type: 'string'
		});

		return helper.yargs;
	},
	run(helper: Helper, args: TestArgs) {
		return new Promise((resolve, reject) => {
			if (!helper.command.exists('build')) {
				reject(Error('Required command: \'build\', does not exist. Have you run npm install @dojo/cli-build?'));
			}
			const result = helper.command.run('build', '', <any> { withTests: true });
			result.then(
				() => {
					runTests(args).then(resolve, reject);
				},
				reject
			);
		});
	}
};
export default command;
