// Script to add React imports to all component files
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the directory name
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Directories to search for React components
const directories = [
  path.join(__dirname, 'src', 'pages'),
  path.join(__dirname, 'src', 'components'),
  path.join(__dirname, 'src', 'context')
];

// Process each directory
directories.forEach(dir => {
  if (!fs.existsSync(dir)) {
    console.log(`Directory does not exist: ${dir}`);
    return;
  }
  
  // Get all JSX files in the directory
  const files = fs.readdirSync(dir).filter(file => 
    file.endsWith('.jsx') || file.endsWith('.js')
  );
  
  // Process each file
  files.forEach(file => {
    const filePath = path.join(dir, file);
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Check if the file already has a React import
    if (!content.includes('import React')) {
      // Add React import at the beginning of the file
      content = `import React from 'react';\n${content}`;
      
      // Write the updated content back to the file
      fs.writeFileSync(filePath, content);
      console.log(`Added React import to ${filePath}`);
    } else {
      console.log(`React import already exists in ${filePath}`);
    }
  });
});

console.log('Finished adding React imports to all component files.');