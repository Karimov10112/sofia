const fs = require('fs');
const path = require('path');

const DB_PATH = path.join(__dirname, '..', 'data');
if (!fs.existsSync(DB_PATH)) {
  fs.mkdirSync(DB_PATH);
}

class MockDB {
  constructor(collection) {
    this.collection = collection;
    this.filePath = path.join(DB_PATH, `${collection}.json`);
    if (!fs.existsSync(this.filePath)) {
      fs.writeFileSync(this.filePath, JSON.stringify([]));
    }
  }

  async read() {
    try {
      if (!fs.existsSync(this.filePath)) return [];
      const data = fs.readFileSync(this.filePath, 'utf8');
      return data ? JSON.parse(data) : [];
    } catch (e) {
      console.error(`MockDB Read Error (${this.collection}):`, e.message);
      return [];
    }
  }

  async write(data) {
    try {
      fs.writeFileSync(this.filePath, JSON.stringify(data || [], null, 2));
    } catch (e) {
      console.error(`MockDB Write Error (${this.collection}):`, e.message);
    }
  }

  _matches(item, query) {
    if (!query || Object.keys(query).length === 0) return true;
    for (let key in query) {
      const val = query[key];
      if (key === '$or' && Array.isArray(val)) {
        if (!val.some(subQuery => this._matches(item, subQuery))) return false;
        continue;
      }
      if (key === '$ne') { /* handle complex nested ne if needed */ continue; }
      
      const itemVal = item[key];
      if (val instanceof RegExp) {
        if (!val.test(itemVal)) return false;
      } else if (typeof val === 'object' && val !== null && !Array.isArray(val)) {
        if (val.$gte !== undefined && itemVal < val.$gte) return false;
        if (val.$lte !== undefined && itemVal > val.$lte) return false;
        if (val.$gt !== undefined && itemVal <= val.$gt) return false;
        if (val.$lt !== undefined && itemVal >= val.$lt) return false;
        if (val.$ne !== undefined && itemVal === val.$ne) return false;
      } else {
        if (itemVal !== val) return false;
      }
    }
    return true;
  }

  async find(query = {}) {
    const data = await this.read();
    const results = data.filter(item => this._matches(item, query));
    return results || [];
  }

  async findOne(query = {}) {
    const data = await this.read();
    const result = data.find(item => this._matches(item, query));
    return result || null;
  }

  async findById(id) {
    const data = await this.read();
    const result = data.find(item => (item._id || item.id) === id);
    return result || null;
  }

  async create(doc) {
    const data = await this.read();
    const newDoc = {
      ...doc,
      _id: Math.random().toString(36).substr(2, 9),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    data.push(newDoc);
    await this.write(data);
    return newDoc;
  }

  async findByIdAndUpdate(id, update) {
    const data = await this.read();
    const index = data.findIndex(item => (item._id || item.id) === id);
    if (index === -1) return null;
    
    // Support $set or direct update
    const updateData = update.$set ? { ...update.$set } : { ...update };
    data[index] = { ...data[index], ...updateData, updatedAt: new Date() };
    await this.write(data);
    return data[index];
  }

  async findByIdAndDelete(id) {
    const data = await this.read();
    const newData = data.filter(item => (item._id || item.id) !== id);
    await this.write(newData);
    return true;
  }

  async countDocuments(query = {}) {
    const results = await this.find(query);
    return results.length;
  }
}

module.exports = MockDB;
