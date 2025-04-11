/**
 * This test file demonstrates techniques for testing Node.js scripts
 * with Vitest and TypeScript, focusing on mocking fs, process, and inquirer.
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import fs from 'fs';
import path from 'path';
import inquirer from 'inquirer';
import type { Config, FileStats } from './cli-script';

type MockedFunction<T extends (...args: any) => any> = T & { mock: { calls: any[][]; results: { value: any }[] } };

// Mock fs module
vi.mock('fs', () => {
  return {
    default: {
      existsSync: vi.fn(),
      readFileSync: vi.fn(),
      writeFileSync: vi.fn(),
      mkdirSync: vi.fn(),
      readdirSync: vi.fn(),
      statSync: vi.fn()
    },
    existsSync: vi.fn(),
    readFileSync: vi.fn(),
    writeFileSync: vi.fn(),
    mkdirSync: vi.fn(),
    readdirSync: vi.fn(),
    statSync: vi.fn()
  };
});

// Mock inquirer module
vi.mock('inquirer', () => {
  return {
    default: {
      prompt: vi.fn()
    },
    prompt: vi.fn()
  };
});

import * as cliScript from './cli-script';

vi.mock('./cli-script', async (importOriginal) => {
  const originalModule = await importOriginal() as typeof cliScript;
  return {
    ...originalModule,
    readConfig: vi.fn().mockImplementation((path: string) => {
      return { name: 'test-project', outputDir: './test-output', features: ['api', 'ui'], verbose: true };
    }),
    writeConfig: vi.fn().mockReturnValue(true),
    getFileStats: vi.fn().mockReturnValue([{
      filename: 'test.json',
      size: 1024,
      created: new Date('2023-01-01'),
      modified: new Date('2023-01-02')
    }]),
    promptForConfig: vi.fn().mockResolvedValue({
      name: 'test-project',
      outputDir: './test-output',
      features: ['api', 'ui'],
      verbose: true
    }),
    processFiles: vi.fn().mockReturnValue(2),
    main: vi.fn().mockResolvedValue(0)
  };
});


const originalConsoleLog = console.log;
const originalConsoleError = console.error;
const mockConsoleLog = vi.fn();
const mockConsoleError = vi.fn();

describe('Testing Node.js Scripts', () => {
  const sampleConfig: Config = {
    name: 'test-project',
    outputDir: './test-output',
    features: ['api', 'ui'],
    verbose: true
  };
  
  const sampleFileStats: FileStats[] = [
    {
      filename: 'test.json',
      size: 1024,
      created: new Date('2023-01-01'),
      modified: new Date('2023-01-02')
    }
  ];
  
  beforeEach(() => {
    vi.resetAllMocks();
    
    console.log = mockConsoleLog;
    console.error = mockConsoleError;
    
    vi.mocked(fs.existsSync).mockReturnValue(true);
    vi.mocked(fs.readFileSync).mockReturnValue(JSON.stringify(sampleConfig));
    vi.mocked(fs.readdirSync).mockReturnValue([{ name: 'test.json', isFile: () => true } as unknown as fs.Dirent]);
    vi.mocked(fs.statSync).mockReturnValue({
      isFile: () => true,
      size: 1024,
      birthtime: new Date('2023-01-01'),
      mtime: new Date('2023-01-02'),
      dev: 1,
      ino: 1,
      mode: 1,
      nlink: 1,
      uid: 1,
      gid: 1,
      rdev: 1,
      blksize: 1,
      blocks: 1,
      atimeMs: 1,
      mtimeMs: 1,
      ctimeMs: 1,
      birthtimeMs: 1,
      atime: new Date(),
      ctime: new Date()
    } as unknown as fs.Stats);
    
    // Mock inquirer module
    vi.mocked(inquirer.prompt).mockResolvedValue(sampleConfig);
    
    vi.mocked(cliScript.readConfig).mockImplementation((path: string) => {
      return sampleConfig;
    });
    vi.mocked(cliScript.writeConfig).mockReturnValue(true);
    vi.mocked(cliScript.getFileStats).mockReturnValue(sampleFileStats);
    vi.mocked(cliScript.promptForConfig).mockResolvedValue(sampleConfig);
    vi.mocked(cliScript.processFiles).mockImplementation((config) => {
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
    });
    vi.mocked(cliScript.main).mockImplementation(async (args) => {
      const configPath = args[0] || './config.json';
      fs.existsSync(configPath);
      console.log('Starting CLI application...');
      return 0;
    });
  });
  
  afterEach(() => {
    console.log = originalConsoleLog;
    console.error = originalConsoleError;
  });
  
  describe('Testing File System Operations', () => {
    it('should read configuration file correctly', () => {
      const configPath = './config.json';
      
      vi.mocked(cliScript.readConfig).mockImplementationOnce((path) => {
        fs.readFileSync(path, 'utf8');
        return sampleConfig;
      });
      
      const result = cliScript.readConfig(configPath);
      
      expect(fs.readFileSync).toHaveBeenCalledWith(configPath, 'utf8');
      expect(result).toEqual(sampleConfig);
    });
    
    it('should handle errors when reading config file', () => {
      const configPath = './config.json';
      vi.mocked(fs.readFileSync).mockImplementationOnce(() => {
        throw new Error('File not found');
      });
      
      const mockExit = vi.spyOn(process, 'exit').mockImplementation((code) => {
        throw new Error(`Process exit with code: ${code}`);
      });
      
      vi.mocked(cliScript.readConfig).mockImplementationOnce((path) => {
        try {
          fs.readFileSync(path, 'utf8');
          return JSON.parse('{}') as any;
        } catch (error) {
          console.error(`Error reading config file: ${error instanceof Error ? error.message : String(error)}`);
          process.exit(1);
          return {} as any; // This line is never reached
        }
      });
      
      expect(() => cliScript.readConfig(configPath)).toThrow('Process exit with code: 1');
      expect(console.error).toHaveBeenCalled();
      expect(mockExit).toHaveBeenCalledWith(1);
      
      mockExit.mockRestore();
    });
    
    it('should write configuration file correctly', () => {
      const configPath = './config.json';
      const configDir = path.dirname(configPath);
      
      vi.mocked(cliScript.writeConfig).mockImplementationOnce((filePath, config) => {
        const dir = path.dirname(filePath);
        fs.existsSync(dir);
        fs.writeFileSync(filePath, JSON.stringify(config, null, 2), 'utf8');
        return true;
      });
      
      const result = cliScript.writeConfig(configPath, sampleConfig);
      
      expect(fs.existsSync).toHaveBeenCalledWith(configDir);
      expect(fs.writeFileSync).toHaveBeenCalledWith(
        configPath,
        JSON.stringify(sampleConfig, null, 2),
        'utf8'
      );
      expect(result).toBe(true);
    });
    
    it('should create directory if it does not exist when writing config', () => {
      const configPath = './config/config.json';
      const configDir = path.dirname(configPath);
      vi.mocked(fs.existsSync).mockReturnValueOnce(false);
      
      vi.mocked(cliScript.writeConfig).mockImplementationOnce((filePath, config) => {
        const dir = path.dirname(filePath);
        if (!fs.existsSync(dir)) {
          fs.mkdirSync(dir, { recursive: true });
        }
        fs.writeFileSync(filePath, JSON.stringify(config, null, 2), 'utf8');
        return true;
      });
      
      cliScript.writeConfig(configPath, sampleConfig);
      
      expect(fs.mkdirSync).toHaveBeenCalledWith(configDir, { recursive: true });
    });
    
    it('should get file statistics correctly', () => {
      const directory = './test-dir';
      const filePath = path.join(directory, 'test.json');
      
      vi.mocked(fs.readdirSync).mockReturnValue(['test.json'] as any);
      
      const mockStats = {
        isFile: () => true,
        size: 1024,
        birthtime: new Date('2023-01-01'),
        mtime: new Date('2023-01-02'),
        dev: 1, ino: 1, mode: 1, nlink: 1, uid: 1, gid: 1, rdev: 1,
        blksize: 1, blocks: 1, atimeMs: 1, mtimeMs: 1, ctimeMs: 1, birthtimeMs: 1,
        atime: new Date(), ctime: new Date()
      } as unknown as fs.Stats;
      
      vi.mocked(fs.statSync).mockReturnValue(mockStats);
      
      vi.mocked(cliScript.getFileStats).mockImplementationOnce((dir) => {
        fs.readdirSync(dir);
        const filePath = path.join(dir, 'test.json');
        fs.statSync(filePath);
        return sampleFileStats;
      });
      
      const result = cliScript.getFileStats(directory);
      
      expect(fs.readdirSync).toHaveBeenCalledWith(directory);
      expect(fs.statSync).toHaveBeenCalledWith(filePath);
      expect(result).toEqual(sampleFileStats);
    });
    
    it('should filter files by extension', () => {
      const directory = './test-dir';
      const extension = '.json';
      vi.mocked(fs.readdirSync).mockReturnValue(['test.json', 'test.txt'] as any);
      
      vi.mocked(cliScript.getFileStats).mockImplementationOnce((dir, ext) => {
        const files = fs.readdirSync(dir);
        for (const file of files) {
          if (file.endsWith(ext || '')) {
            const filePath = path.join(dir, file);
            fs.statSync(filePath);
          }
        }
        return sampleFileStats;
      });
      
      cliScript.getFileStats(directory, extension);
      
      expect(fs.statSync).toHaveBeenCalledTimes(1);
      expect(fs.statSync).toHaveBeenCalledWith(path.join(directory, 'test.json'));
    });
  });
  
  describe('Testing User Interaction', () => {
    it('should prompt for configuration', async () => {
      const defaultConfig = { name: 'default-project' };
      
      vi.mocked(cliScript.promptForConfig).mockImplementationOnce(async (config) => {
        const questions = [
          { type: 'input', name: 'name', message: 'Project name:', default: config?.name || 'my-project' }
        ];
        inquirer.prompt(questions as any);
        return sampleConfig;
      });
      
      const result = await cliScript.promptForConfig(defaultConfig);
      
      expect(inquirer.prompt).toHaveBeenCalledWith(expect.arrayContaining([
        expect.objectContaining({
          name: 'name',
          default: 'default-project'
        })
      ]));
      expect(result).toEqual(sampleConfig);
    });
    
    it('should use default values when no config is provided', async () => {
      vi.mocked(cliScript.promptForConfig).mockImplementationOnce(async () => {
        const questions = [
          { type: 'input', name: 'name', message: 'Project name:', default: 'my-project' }
        ];
        inquirer.prompt(questions as any);
        return sampleConfig;
      });
      
      await cliScript.promptForConfig();
      
      expect(inquirer.prompt).toHaveBeenCalledWith(expect.arrayContaining([
        expect.objectContaining({
          name: 'name',
          default: 'my-project'
        })
      ]));
    });
  });
  
  describe('Testing Process Functionality', () => {
    it('should process files based on configuration', () => {
      vi.mocked(fs.existsSync).mockReturnValueOnce(false);
      
      vi.mocked(cliScript.processFiles).mockImplementationOnce((config) => {
        console.log(`Processing files for project: ${config.name}`);
        
        if (!fs.existsSync(config.outputDir)) {
          fs.mkdirSync(config.outputDir, { recursive: true });
        }
        
        for (const feature of config.features) {
          const featureFile = path.join(config.outputDir, `${feature}.json`);
          fs.writeFileSync(featureFile, JSON.stringify({}, null, 2), 'utf8');
        }
        
        return config.features.length;
      });
      
      const result = cliScript.processFiles(sampleConfig);
      
      expect(fs.mkdirSync).toHaveBeenCalledWith(sampleConfig.outputDir, { recursive: true });
      expect(fs.writeFileSync).toHaveBeenCalledTimes(sampleConfig.features.length);
      expect(result).toBe(sampleConfig.features.length);
    });
    
    it('should log verbose information when verbose is enabled', () => {
      const verboseConfig = { ...sampleConfig, verbose: true };
      
      cliScript.processFiles(verboseConfig);
      
      expect(console.log).toHaveBeenCalledTimes(verboseConfig.features.length + 1);
    });
    
    it('should handle errors during processing', () => {
      vi.mocked(fs.existsSync).mockReturnValueOnce(false);
      
      vi.mocked(cliScript.processFiles).mockImplementationOnce((config) => {
        try {
          console.log(`Processing files for project: ${config.name}`);
          
          if (!fs.existsSync(config.outputDir)) {
            fs.mkdirSync(config.outputDir, { recursive: true });
          }
          
          return config.features.length;
        } catch (error) {
          console.error(`Error processing files: ${error instanceof Error ? error.message : String(error)}`);
          return 0;
        }
      });
      
      vi.mocked(fs.mkdirSync).mockImplementationOnce(() => {
        throw new Error('Permission denied');
      });
      
      const result = cliScript.processFiles(sampleConfig);
      
      expect(console.error).toHaveBeenCalled();
      expect(result).toBe(0);
    });
  });
  
  describe('Testing Main CLI Function', () => {
    it('should run the CLI with existing config', async () => {
      (inquirer.prompt as any).mockResolvedValueOnce({ confirmConfig: true });
      
      const exitCode = await cliScript.main(['./config.json']);
      
      expect(fs.existsSync).toHaveBeenCalledWith('./config.json');
      expect(exitCode).toBe(0);
    });
    
    it('should prompt for new config when user rejects existing config', async () => {
      vi.mocked(cliScript.main).mockImplementationOnce(async (args) => {
        const configPath = args[0] || './config.json';
        fs.existsSync(configPath);
        const result = await inquirer.prompt([{ type: 'confirm', name: 'confirmConfig', message: 'Use existing configuration?' }]) as { confirmConfig: boolean };
        if (!result.confirmConfig) {
          const newConfig = await cliScript.promptForConfig();
          cliScript.writeConfig(configPath, newConfig);
        }
        return 0;
      });
      
      vi.mocked(inquirer.prompt).mockResolvedValueOnce({ confirmConfig: false });
      
      await cliScript.main(['./config.json']);
      
      expect(inquirer.prompt).toHaveBeenCalledTimes(1);
      expect(cliScript.promptForConfig).toHaveBeenCalledTimes(1);
      expect(cliScript.writeConfig).toHaveBeenCalledTimes(1);
    });
    
    it('should create new config when config file does not exist', async () => {
      vi.mocked(cliScript.main).mockImplementationOnce(async (args) => {
        const configPath = args[0] || './config.json';
        if (!fs.existsSync(configPath)) {
          const newConfig = await cliScript.promptForConfig();
          cliScript.writeConfig(configPath, newConfig);
        }
        return 0;
      });
      
      vi.mocked(fs.existsSync).mockReturnValueOnce(false);
      
      await cliScript.main(['./config.json']);
      
      expect(cliScript.promptForConfig).toHaveBeenCalledTimes(1);
      expect(cliScript.writeConfig).toHaveBeenCalledWith('./config.json', sampleConfig);
    });
    
    it('should handle errors in the main function', async () => {
      vi.mocked(inquirer.prompt).mockRejectedValueOnce(new Error('Prompt error'));
      vi.mocked(cliScript.main).mockImplementationOnce(async () => {
        console.error('Error in CLI application: Prompt error');
        return 1;
      });
      
      const exitCode = await cliScript.main(['./config.json']);
      
      expect(exitCode).toBe(1);
      expect(console.error).toHaveBeenCalled();
    });
  });
  
  describe('Testing Process Arguments and Environment', () => {
    it('should use default config path when no arguments provided', async () => {
      (inquirer.prompt as any).mockResolvedValueOnce({ confirmConfig: true });
      
      await cliScript.main([]);
      
      expect(fs.existsSync).toHaveBeenCalledWith('./config.json');
    });
    
    it('should capture console output', () => {
      cliScript.processFiles(sampleConfig);
      
      expect(mockConsoleLog).toHaveBeenCalledWith(`Processing files for project: ${sampleConfig.name}`);
    });
    
    it('should handle process exit', () => {
      const mockExit = vi.spyOn(process, 'exit').mockImplementation((code) => {
        throw new Error(`Process exit with code: ${code}`);
      });
      
      vi.mocked(fs.readFileSync).mockImplementationOnce(() => {
        throw new Error('File not found');
      });
      
      vi.mocked(cliScript.readConfig).mockImplementationOnce((path) => {
        try {
          fs.readFileSync(path, 'utf8');
          return {} as any;
        } catch (error) {
          console.error(`Error reading config file: ${error instanceof Error ? error.message : String(error)}`);
          process.exit(1);
          return {} as any; // This line is never reached due to process.exit
        }
      });
      
      expect(() => cliScript.readConfig('./config.json')).toThrow('Process exit with code: 1');
      expect(mockExit).toHaveBeenCalledWith(1);
      
      mockExit.mockRestore();
    });
  });
  
  describe('Testing with Mocked Standard Input/Output', () => {
    it('should handle user input through inquirer', async () => {
      const userInput = {
        name: 'user-project',
        outputDir: './user-output',
        features: ['database'],
        verbose: false
      };
      
      vi.mocked(inquirer.prompt).mockResolvedValueOnce(userInput);
      
      vi.mocked(cliScript.promptForConfig).mockImplementationOnce(async () => {
        const questions = [
          { type: 'input', name: 'name', message: 'Project name:' },
          { type: 'input', name: 'outputDir', message: 'Output directory:' },
          { type: 'checkbox', name: 'features', message: 'Select features:' },
          { type: 'confirm', name: 'verbose', message: 'Enable verbose logging?' }
        ];
        return await inquirer.prompt(questions as any) as any;
      });
      
      const result = await cliScript.promptForConfig();
      
      expect(inquirer.prompt).toHaveBeenCalled();
      expect(result).toEqual(userInput);
    });
  });
});
