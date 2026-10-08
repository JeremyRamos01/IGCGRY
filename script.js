const fs = require('fs');
const filePath = 'WEB IGLESIA/frontend/index.html';
let content = fs.readFileSync(filePath, 'utf8');

const s1 = '<!-- LATEST NEWS/MESSAGES SECTION -->';
const s2 = '<!-- RECENT POST SECTION (NEW) -->';
const s3 = '<!-- ESQUEMA DE IGLESIAS (RAMIFICADO) -->';
const targetPosStr = '<!-- CONÓCENOS SECTION -->';

const s1_idx = content.indexOf(s1);
const s3_idx = content.indexOf(s3);
const target_idx = content.indexOf(targetPosStr);

if (s1_idx !== -1 && s3_idx !== -1 && target_idx !== -1) {
    const header = content.substring(0, target_idx);
    const sectionsToMove = content.substring(s1_idx, s3_idx);
    const middlePart = content.substring(target_idx, s1_idx);
    const footer = content.substring(s3_idx);
    
    // Construct new content
    const newContent = header + sectionsToMove + middlePart + footer;
    fs.writeFileSync(filePath, newContent, 'utf8');
    console.log('Successfully moved sections');
} else {
    console.log('Failed to find markers');
}
