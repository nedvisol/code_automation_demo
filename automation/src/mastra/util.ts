import * as fs from 'fs';
import * as path from 'path';

export function createBackup(filePath: string): void {
    const fileDir = path.dirname(filePath);
    const fileName = path.basename(filePath);
    const backupFilePath = path.join(fileDir, `${fileName}.bak`);
    if (fs.existsSync(backupFilePath)) {
        throw new Error(`Backup file already exists at: ${backupFilePath}`);
    }
    fs.copyFile(filePath, backupFilePath, (err) => {
        if (err) {
            console.error('Error creating backup file:', err);
        } else {
            console.log(`Backup file created at: ${backupFilePath}`);
        }
    });
}