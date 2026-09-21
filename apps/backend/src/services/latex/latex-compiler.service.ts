import fs from 'fs/promises';
import path from 'path';
import os from 'os';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export interface CompileResult {
  success: boolean;
  pdfBuffer?: Buffer;
  error?: string;
  logs?: string;
}

export class LatexCompilerService {
  private static assetsDir = path.resolve(__dirname, '../../templates/latex/assets');

  /**
   * Compiles LaTeX source text into a PDF buffer.
   * @param texSource Raw LaTeX string
   * @param options Execution timeout and settings
   */
  public static async compile(
    texSource: string,
    options: { timeoutMs?: number } = {}
  ): Promise<CompileResult> {
    const timeoutMs = options.timeoutMs || 45000;
    const workDir = path.join(os.tmpdir(), `bfj-latex-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`);

    try {
      await fs.mkdir(workDir, { recursive: true });

      // Copy assets (e.g. resume.cls) to working directory if they exist
      try {
        const assets = await fs.readdir(this.assetsDir);
        for (const asset of assets) {
          const src = path.join(this.assetsDir, asset);
          const dest = path.join(workDir, asset);
          await fs.copyFile(src, dest);
        }
      } catch (err) {
        // Assets folder might be empty or missing, proceed
      }

      // Write resume.tex
      const texPath = path.join(workDir, 'resume.tex');
      await fs.writeFile(texPath, texSource, 'utf-8');

      // Attempt compilation
      const command = await this.resolveCompilerCommand(workDir);
      
      let stdout = '';
      let stderr = '';
      try {
        const result = await execAsync(command, {
          cwd: workDir,
          timeout: timeoutMs,
          maxBuffer: 10 * 1024 * 1024, // 10MB
        });
        stdout = result.stdout || '';
        stderr = result.stderr || '';
      } catch (execErr: any) {
        stdout = execErr.stdout || '';
        stderr = execErr.stderr || execErr.message || '';
        // If compilation returned non-zero, check if PDF was still generated
      }

      const pdfPath = path.join(workDir, 'resume.pdf');
      try {
        const pdfBuffer = await fs.readFile(pdfPath);
        return {
          success: true,
          pdfBuffer,
          logs: stdout + '\n' + stderr,
        };
      } catch {
        return {
          success: false,
          error: 'LaTeX compilation failed to produce a valid PDF.',
          logs: stderr || stdout || 'Unknown LaTeX error',
        };
      }
    } catch (err: any) {
      return {
        success: false,
        error: err.message || 'Failed to execute LaTeX compiler.',
      };
    } finally {
      // Safe cleanup of temporary working directory
      try {
        await fs.rm(workDir, { recursive: true, force: true });
      } catch {
        // Ignore cleanup failures
      }
    }
  }

  /**
   * Identifies available compiler binary in environment (tectonic / pdflatex / xelatex).
   */
  private static async resolveCompilerCommand(workDir: string): Promise<string> {
    // Check tectonic
    const tectonicPaths = ['tectonic', '/opt/homebrew/bin/tectonic', '/usr/local/bin/tectonic', '/usr/bin/tectonic'];
    for (const bin of tectonicPaths) {
      try {
        await execAsync(`${bin} --version`);
        return `${bin} resume.tex`;
      } catch {
        // Try next
      }
    }

    // Check pdflatex
    const pdflatexPaths = ['pdflatex', '/Library/TeX/texbin/pdflatex', '/usr/local/bin/pdflatex', '/usr/bin/pdflatex'];
    for (const bin of pdflatexPaths) {
      try {
        await execAsync(`${bin} -version`);
        return `${bin} -interaction=nonstopmode -halt-on-error resume.tex`;
      } catch {
        // Try next
      }
    }

    // Check xelatex
    const xelatexPaths = ['xelatex', '/Library/TeX/texbin/xelatex', '/usr/local/bin/xelatex', '/usr/bin/xelatex'];
    for (const bin of xelatexPaths) {
      try {
        await execAsync(`${bin} -version`);
        return `${bin} -interaction=nonstopmode -halt-on-error resume.tex`;
      } catch {
        // Try next
      }
    }

    throw new Error('No compatible LaTeX compiler (tectonic, pdflatex, or xelatex) was found on the system.');
  }
}
