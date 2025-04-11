/**
 * Example CLI script that uses Node.js native modules and inquirer
 * This demonstrates common patterns for command-line applications
 */
import fs from 'fs';
import path from 'path';
import inquirer from 'inquirer';

export interface Config {
  name: string;
  outputDir: string;
  features: string[];
  verbose: boolean;
}

export interface FileStats {
  filename: string;
  size: number;
  created: Date;
  modified: Date;
}

/**
 * Reads a configuration file
 * @param configPath Path to the config file
 * @returns Parsed configuration object
 */
export function readConfig(configPath: string): Config {
  try {
    const configData = fs.readFileSync(configPath, 'utf8');
    return JSON.parse(configData) as Config;
  } catch (error) {
    console.error(`Error reading config file: ${error instanceof Error ? error.message : String(error)}`);
    process.exit(1);
  }
}

/**
 * Writes a configuration file
 * @param configPath Path to write the config file
 * @param config Configuration object to write
 * @returns true if successful
 */
export function writeConfig(configPath: string, config: Config): boolean {
  try {
    const configDir = path.dirname(configPath);
    
    if (!fs.existsSync(configDir)) {
      fs.mkdirSync(configDir, { recursive: true });
    }
    
    fs.writeFileSync(configPath, JSON.stringify(config, null, 2), 'utf8');
    return true;
  } catch (error) {
    console.error(`Error writing config file: ${error instanceof Error ? error.message : String(error)}`);
    return false;
  }
}

/**
 * Gets file statistics for files in a directory
 * @param directory Directory to scan
 * @param extension Optional file extension filter
 * @returns Array of file statistics
 */
export function getFileStats(directory: string, extension?: string): FileStats[] {
  try {
    if (!fs.existsSync(directory)) {
      throw new Error(`Directory does not exist: ${directory}`);
    }
    
    const files = fs.readdirSync(directory);
    const stats: FileStats[] = [];
    
    for (const file of files) {
      if (extension && !file.endsWith(extension)) {
        continue;
      }
      
      const filePath = path.join(directory, file);
      const fileStat = fs.statSync(filePath);
      
      if (fileStat.isFile()) {
        stats.push({
          filename: file,
          size: fileStat.size,
          created: fileStat.birthtime,
          modified: fileStat.mtime
        });
      }
    }
    
    return stats;
  } catch (error) {
    console.error(`Error getting file stats: ${error instanceof Error ? error.message : String(error)}`);
    return [];
  }
}

/**
 * Prompts the user for configuration values
 * @param defaultConfig Optional default configuration
 * @returns Promise resolving to the user's configuration
 */
export async function promptForConfig(defaultConfig?: Partial<Config>): Promise<Config> {
  const questions = [
    {
      type: 'input',
      name: 'name',
      message: 'Project name:',
      default: defaultConfig?.name || 'my-project'
    },
    {
      type: 'input',
      name: 'outputDir',
      message: 'Output directory:',
      default: defaultConfig?.outputDir || './output'
    },
    {
      type: 'checkbox',
      name: 'features',
      message: 'Select features:',
      choices: ['api', 'ui', 'database', 'auth'],
      default: defaultConfig?.features || []
    },
    {
      type: 'confirm',
      name: 'verbose',
      message: 'Enable verbose logging?',
      default: defaultConfig?.verbose || false
    }
  ];
  
  return inquirer.prompt(questions) as Promise<Config>;
}

/**
 * Processes files based on configuration
 * @param config Configuration object
 * @returns Number of processed files
 */
export function processFiles(config: Config): number {
  try {
    console.log(`Processing files for project: ${config.name}`);
    
    if (!fs.existsSync(config.outputDir)) {
      fs.mkdirSync(config.outputDir, { recursive: true });
    }
    
    for (const feature of config.features) {
      const featureFile = path.join(config.outputDir, `${feature}.json`);
      const featureData = {
        name: feature,
        enabled: true,
        timestamp: new Date().toISOString()
      };
      
      fs.writeFileSync(featureFile, JSON.stringify(featureData, null, 2), 'utf8');
      
      if (config.verbose) {
        console.log(`Created feature file: ${featureFile}`);
      }
    }
    
    return config.features.length;
  } catch (error) {
    console.error(`Error processing files: ${error instanceof Error ? error.message : String(error)}`);
    return 0;
  }
}

/**
 * Main CLI function
 * @param args Command line arguments
 * @returns Promise resolving to exit code
 */
export async function main(args: string[]): Promise<number> {
  try {
    console.log('Starting CLI application...');
    
    const configPath = args[0] || './config.json';
    
    let config: Config;
    
    if (fs.existsSync(configPath)) {
      console.log(`Loading configuration from ${configPath}`);
      config = readConfig(configPath);
      
      const { confirmConfig } = await inquirer.prompt([
        {
          type: 'confirm',
          name: 'confirmConfig',
          message: 'Use existing configuration?',
          default: true
        }
      ]) as { confirmConfig: boolean };
      
      if (!confirmConfig) {
        config = await promptForConfig(config);
        writeConfig(configPath, config);
      }
    } else {
      console.log('No configuration found. Please provide configuration details:');
      config = await promptForConfig();
      writeConfig(configPath, config);
    }
    
    const processedCount = processFiles(config);
    console.log(`Processed ${processedCount} feature files.`);
    
    if (config.verbose) {
      const stats = getFileStats(config.outputDir, '.json');
      console.log('File statistics:');
      console.table(stats.map(stat => ({
        filename: stat.filename,
        size: `${stat.size} bytes`,
        modified: stat.modified.toLocaleString()
      })));
    }
    
    console.log('CLI application completed successfully.');
    return 0;
  } catch (error) {
    console.error(`Error in CLI application: ${error instanceof Error ? error.message : String(error)}`);
    return 1;
  }
}

if (require.main === module) {
  main(process.argv.slice(2))
    .then(exitCode => process.exit(exitCode))
    .catch(error => {
      console.error('Unhandled error:', error);
      process.exit(1);
    });
}
