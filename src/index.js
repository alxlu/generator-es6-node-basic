import {Base} from 'yeoman-generator';
import * as path from 'path';

module.exports = Base.extend({
  promptProjectType() {
    const that = this;
    const done = this.async();

    this.prompt([{
      type: 'confirm',
      name: 'deps',
      message: 'Automatically install dependencies?',
      default: false
    }, {
        type: 'input',
        name: 'name',
        message: 'Project name?',
        default: 'node-app'
      }, {
        type: 'input',
        name: 'author',
        message: 'Author name?',
        store: true,
        default: ''
      }], answers => {
        Object.assign(that, answers);
        done();
      });
  },

  copyTemplate() {
    const mainDir = path.join(require.resolve('es6-node-base/package.json'), '../');
    this.fs.copy(this.templatePath(mainDir) + '/**/{*,.*}', this.destinationPath(), { dot: true });
    this.fs.move(this.destinationPath('.npmignore'), this.destinationPath('.gitignore'));
    const jsonContent = this.fs.readJSON(this.destinationPath('package.json'));
    const unusedFields = [
      'gitHead',
      'readme',
      'readmeFilename',
      ...Object.keys(jsonContent).filter(field => field.charAt(0) === '_')
    ];
    unusedFields.forEach(entry => {
      jsonContent[entry] = 'x';
      delete jsonContent[entry];
    });
    const projectName = this.name.trim().toLowerCase().replace(/ /g, '-');
    jsonContent.name = projectName;
    jsonContent.author = this.author.trim();
    this.fs.writeJSON(this.destinationPath('package.json'), jsonContent);
  },

  install() {
    if (this.deps) this.installDependencies({ bower: false });
  }
});