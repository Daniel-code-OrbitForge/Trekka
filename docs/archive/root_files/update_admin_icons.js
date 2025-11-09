const fs = require('fs');
const path = require('path');

const adminDir = path.join(__dirname, 'frontend', 'pages', 'admin');

// Common emoji to Font Awesome icon mappings
const emojiMappings = {
  '☰': 'fas fa-bars',
  '🚗': 'fas fa-car',
  '👤': 'fas fa-user',
  '👥': 'fas fa-users',
  '🏢': 'fas fa-building',
  '📊': 'fas fa-chart-bar',
  '⚙️': 'fas fa-cog',
  '🔍': 'fas fa-search',
  '📝': 'fas fa-edit',
  '📋': 'fas fa-clipboard-list',
  '📈': 'fas fa-chart-line',
  '📉': 'fas fa-chart-line',
  '🔑': 'fas fa-key',
  '🔒': 'fas fa-lock',
  '🔓': 'fas fa-unlock',
  '❌': 'fas fa-times',
  '✅': 'fas fa-check',
  'ℹ️': 'fas fa-info-circle',
  '⚠️': 'fas fa-exclamation-triangle',
  '❓': 'fas fa-question-circle',
  '➕': 'fas fa-plus',
  '➖': 'fas fa-minus',
  '✏️': 'fas fa-pencil-alt',
  '🗑️': 'fas fa-trash-alt',
  '📁': 'fas fa-folder',
  '📂': 'fas fa-folder-open',
  '📄': 'fas fa-file-alt',
  '🔔': 'fas fa-bell',
  '🔕': 'fas fa-bell-slash',
  '📧': 'fas fa-envelope',
  '📱': 'fas fa-mobile-alt',
  '💻': 'fas fa-laptop',
  '📱': 'fas fa-mobile',
  '📍': 'fas fa-map-marker-alt',
  '📅': 'fas fa-calendar-alt',
  '⏰': 'fas fa-clock',
  '🔙': 'fas fa-arrow-left',
  '🔜': 'fas fa-arrow-right',
  '⬆️': 'fas fa-arrow-up',
  '⬇️': 'fas fa-arrow-down',
  '🔍': 'fas fa-search',
  '🔎': 'fas fa-search-plus',
  '📋': 'fas fa-clipboard',
  '📝': 'fas fa-edit',
  '📊': 'fas fa-chart-pie',
  '📈': 'fas fa-chart-line',
  '📉': 'fas fa-chart-line',
  '📌': 'fas fa-thumbtack',
  '📎': 'fas fa-paperclip',
  '✉️': 'fas fa-envelope',
  '📤': 'fas fa-paper-plane',
  '📥': 'fas fa-inbox',
  '📦': 'fas fa-box',
  '📫': 'fas fa-envelope-open',
  '📬': 'fas fa-envelope-open-text',
  '📭': 'fas fa-envelope',
  '📁': 'fas fa-folder',
  '📂': 'fas fa-folder-open',
  '📅': 'fas fa-calendar',
  '📆': 'fas fa-calendar-alt',
  '📊': 'fas fa-chart-bar',
  '📈': 'fas fa-chart-line',
  '📉': 'fas fa-chart-line',
  '📋': 'fas fa-clipboard',
  '📌': 'fas fa-thumbtack',
  '📍': 'fas fa-map-marker-alt',
  '📎': 'fas fa-paperclip',
  '📏': 'fas fa-ruler',
  '📐': 'fas fa-ruler-combined',
  '✂️': 'fas fa-cut',
  '📝': 'fas fa-edit',
  '🔍': 'fas fa-search',
  '🔎': 'fas fa-search-plus',
  '🔐': 'fas fa-lock',
  '🔒': 'fas fa-lock',
  '🔓': 'fas fa-unlock',
  '🔑': 'fas fa-key',
  '🔨': 'fas fa-hammer',
  '🔧': 'fas fa-wrench',
  '🔩': 'fas fa-cog',
  '🔗': 'fas fa-link',
  '📎': 'fas fa-paperclip',
  '📐': 'fas fa-ruler-combined',
  '📏': 'fas fa-ruler-vertical',
  '🔍': 'fas fa-search',
  '🔎': 'fas fa-search-plus',
  '🔐': 'fas fa-lock',
  '🔒': 'fas fa-lock',
  '🔓': 'fas fa-unlock',
  '🔑': 'fas fa-key',
  '🔔': 'fas fa-bell',
  '🔕': 'fas fa-bell-slash',
  '📢': 'fas fa-bullhorn',
  '📣': 'fas fa-bullhorn',
  '📯': 'fas fa-bullhorn',
  '📝': 'fas fa-edit',
  '📋': 'fas fa-clipboard',
  '📌': 'fas fa-thumbtack',
  '📍': 'fas fa-map-marker-alt',
  '📎': 'fas fa-paperclip',
  '📐': 'fas fa-ruler-combined',
  '📏': 'fas fa-ruler-vertical',
  '🔍': 'fas fa-search',
  '🔎': 'fas fa-search-plus'
};

// Function to process a single HTML file
function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let updated = false;

  // Add Font Awesome CDN if not present
  if (!content.includes('font-awesome') && !content.includes('fontawesome')) {
    const headEnd = content.indexOf('</title>') + 9;
    content = content.slice(0, headEnd) + 
      '\n    <!-- Font Awesome 6.5.1 -->\n    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">' + 
      content.slice(headEnd);
    updated = true;
  }

  // Replace emojis with Font Awesome icons
  for (const [emoji, iconClass] of Object.entries(emojiMappings)) {
    if (content.includes(emoji)) {
      const iconHtml = `<i class="${iconClass}"></i>`;
      content = content.replace(new RegExp(emoji, 'g'), iconHtml);
      updated = true;
    }
  }

  // Save the file if it was updated
  if (updated) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated: ${filePath}`);
  } else {
    console.log(`No changes needed: ${filePath}`);
  }
}

// Process all HTML files in the admin directory
function processDirectory(directory) {
  const files = fs.readdirSync(directory);
  
  files.forEach(file => {
    const fullPath = path.join(directory, file);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
      processDirectory(fullPath);
    } else if (file.endsWith('.html')) {
      processFile(fullPath);
    }
  });
}

// Start processing
console.log('Starting to update admin pages with Font Awesome icons...');
processDirectory(adminDir);
console.log('Update complete!');
