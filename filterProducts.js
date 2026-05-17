const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'backend', 'data', 'products.json');
try {
  const data = fs.readFileSync(filePath, 'utf8');
  const products = JSON.parse(data);
  const filteredProducts = products.filter(p => p.category === 'smartphone');
  fs.writeFileSync(filePath, JSON.stringify(filteredProducts, null, 2));
  console.log('Successfully filtered products.json');
} catch (err) {
  console.error('Error updating products.json:', err);
}
