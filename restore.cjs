const fs = require('fs');

const backupPath = 'C:\\Users\\HP\\AppData\\Roaming\\Code\\User\\History\\-49ae2fd0\\GenA.jsx';
const targetPath = 'src/DashboardEscritorio.jsx';

const content = fs.readFileSync(backupPath, 'utf8');
fs.writeFileSync(targetPath, content, 'utf8');
console.log('Restored successfully');
