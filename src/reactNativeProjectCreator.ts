// import * as fs from "fs";
// import * as path from "path";
import { Utils } from "./helpers/utils";
import { Validators } from "./helpers/validators";
import { ILogger, LogLevel } from "./log/logHelper";
// tslint:disable-next-line:no-var-requires
const execSync = require('child_process').execSync;

export default class ReactNativeProjectCreator {
    // private root: string;
    constructor(private logger: ILogger) {}

    public async createProject (projectName: string, root: string): Promise<boolean> {
        if (!Validators.ValidateProjectName(projectName)) {
            return false;
        }

        // The was an issue for me and without Delay spinner was not shown when app was creating!
        await Utils.Delay(100);
        // this.root = root;
        this.logger.info(`This will walk you through creating a new React Native project in ${root}`);
        // const packageJson = {
        //     name: projectName,
        //     version: '0.0.1',
        //     private: true,
        //     scripts: {
        //       start: 'node node_modules/react-native/local-cli/cli.js start',
        //       ios: 'react-native run-ios',
        //       android: 'react-native run-android'
        //     }
        // };

        // fs.writeFileSync(path.join(root, 'package.json'), JSON.stringify(packageJson));
        process.chdir(root);

        // Use Yarn if available, it's much faster than the npm client.
        // Return the version of yarn installed on the system, null if yarn is not available.
        const yarnVersion: string | null =  Utils.getYarnVersionIfAvailable();
        let installCommand: string;
        this.logger.info('Installing packages...');
        if (yarnVersion) {
            this.logger.info('Using yarn v' + yarnVersion);
            installCommand = 'yarn install';
        } else {
            installCommand = 'npm install';
        }
        this.logger.log(installCommand, LogLevel.Info);

        try {
            execSync(installCommand, {stdio: 'inherit'});
        } catch (err) {
            this.logger.error(err);
            this.logger.error('Command `' + installCommand + '` failed.');
            return false;
        }
        // const cli = require(this.getCLIModulePath());
        // cli.init(root, projectName);

        return true;
    }

    // private getInstallPackage(): string {
    //     const packageToInstall = 'react-native@latest';
    //     return packageToInstall;
    // }

    // private getCLIModulePath(): string {
    //     return path.resolve(
    //         this.root,
    //         'node_modules',
    //         'react-native',
    //         'cli.js'
    //       );
    // }
}
