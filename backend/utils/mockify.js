const mongoose = require('mongoose');

/**
 * Helper to wrap Mongoose models with a MockDB fallback that supports
 * chaining methods like find().sort().limit().skip().select().populate()
 */
function mockify(Model, mockDB, collectionName) {
  return {
    findOne(query) {
      const isMongoose = mongoose.connection.readyState === 1;
      return {
        _query: query, _select: null, _sort: null, _populate: [],
        select(arg) { this._select = arg; return this; },
        sort(arg) { this._sort = arg; return this; },
        populate(arg) { this._populate.push(arg); return this; },
        async then(resolve, reject) {
          try {
            if (isMongoose) {
              let q = Model.findOne(this._query);
              if (this._select) q = q.select(this._select);
              if (this._sort) q = q.sort(this._sort);
              if (this._populate.length) this._populate.forEach(p => q = q.populate(p));
              return resolve(await q);
            }
            const doc = await mockDB.findOne(this._query);
            if (!doc) return resolve(null);
            
            // Populate logic
            if (this._populate.includes('userId') && doc.userId) {
              try {
                const users = JSON.parse(require('fs').readFileSync(require('path').join(__dirname, '..', 'data', 'users.json'), 'utf8'));
                doc.userId = users.find(u => (u._id || u.id) === doc.userId) || doc.userId;
              } catch(e) {}
            }

            doc.save = async function() { return mockDB.findByIdAndUpdate(this._id || this.id, this); };
            const bcrypt = require('bcryptjs');
            doc.comparePassword = async function(candidate) { return bcrypt.compare(candidate, this.password); };
            doc.toSafeObject = function() { 
              const { password, otp, ...safe } = this;
              return { ...safe, id: this._id || this.id };
            };
            return resolve(doc);
          } catch (e) { if (reject) reject(e); }
        }
      };
    },

    find(query = {}) {
      const isMongoose = mongoose.connection.readyState === 1;
      return {
        _query: query, _select: null, _sort: null, _limit: null, _skip: null, _populate: [],
        select(arg) { this._select = arg; return this; },
        sort(arg) { this._sort = arg; return this; },
        limit(arg) { this._limit = arg; return this; },
        skip(arg) { this._skip = arg; return this; },
        populate(arg) { this._populate.push(arg); return this; },
        async then(resolve, reject) {
          try {
            if (isMongoose) {
              let q = Model.find(this._query);
              if (this._select) q = q.select(this._select);
              if (this._sort) q = q.sort(this._sort);
              if (this._limit) q = q.limit(Number(this._limit));
              if (this._skip) q = q.skip(Number(this._skip));
              if (this._populate.length) this._populate.forEach(p => q = q.populate(p));
              return resolve(await q);
            }
            let results = await mockDB.find(this._query);
            if (this._sort) {
              const key = Object.keys(this._sort)[0];
              const order = this._sort[key];
              results.sort((a, b) => order === -1 ? (b[key] > a[key] ? 1 : -1) : (a[key] > b[key] ? 1 : -1));
            }
            if (this._skip) results = results.slice(this._skip);
            if (this._limit) results = results.slice(0, this._limit);
            
            if (this._populate.includes('userId')) {
              try {
                const users = JSON.parse(require('fs').readFileSync(require('path').join(__dirname, '..', 'data', 'users.json'), 'utf8'));
                results = results.map(item => {
                  const u = users.find(u => (u._id || u.id) === item.userId);
                  return { ...item, userId: u || item.userId };
                });
              } catch (e) {}
            }
            return resolve(results);
          } catch (e) { if (reject) reject(e); }
        }
      };
    },

    async create(data) {
      if (isUser() && !data.email.endsWith('@gmail.com')) throw new Error('Faqat @gmail.com emaillari ruxsat etiladi');
      if (mongoose.connection.readyState === 1) return Model.create(data);
      if (isUser()) {
        const bcrypt = require('bcryptjs');
        data.password = await bcrypt.hash(data.password, 12);
      }
      return mockDB.create(data);
    },

    async countDocuments(query = {}) {
      if (mongoose.connection.readyState === 1) return Model.countDocuments(query);
      return mockDB.countDocuments(query);
    },

    findById(id) {
      const isMongoose = mongoose.connection.readyState === 1;
      return {
        _id: id, _populate: [],
        populate(arg) { this._populate.push(arg); return this; },
        async then(resolve, reject) {
          try {
            if (isMongoose) {
              let q = Model.findById(this._id);
              if (this._populate.length) this._populate.forEach(p => q = q.populate(p));
              return resolve(await q);
            }
            const doc = await mockDB.findById(this._id);
            if (!doc) return resolve(null);

            if (this._populate.includes('userId') && doc.userId) {
              try {
                const users = JSON.parse(require('fs').readFileSync(require('path').join(__dirname, '..', 'data', 'users.json'), 'utf8'));
                doc.userId = users.find(u => (u._id || u.id) === doc.userId) || doc.userId;
              } catch(e) {}
            }

            doc.save = async function() { return mockDB.findByIdAndUpdate(this._id || this.id, this); };
            const bcrypt = require('bcryptjs');
            doc.comparePassword = async function(candidate) { return bcrypt.compare(candidate, this.password); };
            return resolve(doc);
          } catch(e) { if (reject) reject(e); }
        }
      };
    },

    async findByIdAndUpdate(id, update, options = {}) {
      if (mongoose.connection.readyState === 1) return Model.findByIdAndUpdate(id, update, { new: true, ...options });
      return mockDB.findByIdAndUpdate(id, update);
    },

    async findByIdAndDelete(id) {
      if (mongoose.connection.readyState === 1) return Model.findByIdAndDelete(id);
      return mockDB.findByIdAndDelete(id);
    },

    async aggregate(pipeline) {
      if (mongoose.connection.readyState === 1) return Model.aggregate(pipeline);
      return [];
    }
  };

  function isUser() { return collectionName === 'users'; }
}

module.exports = mockify;
