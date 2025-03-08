import * as fs from 'fs';
import * as path from 'path';

export function createBackup(filePath: string): void {
    const fileDir = path.dirname(filePath);
    const fileName = path.basename(filePath);
    const backupFilePath = path.join(fileDir, `${fileName}.bak`);
    if (fs.existsSync(backupFilePath)) {
        throw new Error(`Backup file already exists at: ${backupFilePath}`);
    }
    fs.copyFileSync(filePath, backupFilePath);
}