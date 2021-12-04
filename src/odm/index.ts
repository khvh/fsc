import { ObjectId } from 'bson';
import { Collection, CollectionOptions, Db, Filter, MongoClient, OptionalId } from 'mongodb';
import Container, { Service } from 'typedi';

export const CLIENT_INJECT_TOKEN = 'fsc:client';

export class Client {
  client: MongoClient;
  db: Db;

  constructor(private url, private dbName) {
    this.client = new MongoClient(this.url);
  }

  async connect() {
    await this.client.connect();

    this.db = this.client.db(this.dbName);

    return this;
  }

  getDatabase() {
    return this.db;
  }

  getCollection<C>(name: string, opts?: CollectionOptions) {
    return this.getDatabase().collection<C>(name, opts ?? {});
  }
}

export const getClient = (token?: string) => Container.get<Client>(token ?? CLIENT_INJECT_TOKEN);

export class Repository<T> {
  collection: Collection<T> = getClient().getCollection(this.tableName());

  tableName() {
    return '';
  }

  getId(id: string | ObjectId): ObjectId {
    return new ObjectId(id);
  }
}

@Service()
export class CrudRepository<T> extends Repository<T> {
  async create(data: OptionalId<T> | OptionalId<T>[]) {
    return Array.isArray(data) ? await this.collection.insertMany(data) : await this.collection.insertOne(data);
  }

  async findAll(filter: Filter<T> = {}) {
    return await this.collection.find(filter).toArray();
  }

  async findById(id: string | ObjectId) {
    return await this.collection.findOne({
      _id: this.getId(id)
    });
  }

  async findBy(filter: T) {
    return await this.collection.findOne(filter);
  }

  async updateById(_id, data: T, replace = false) {
    const filter = {
      _id
    };

    const set = {
      $set: {
        ...data
      }
    };

    return replace
      ? this.collection.replaceOne(filter, data)
      : await this.collection.updateOne(filter, set, { upsert: true });
  }

  async update(filter: Filter<any>, data: any, replace = false) {
    return replace ? await this.collection.replaceOne(filter, data) : await this.collection.updateOne(filter, data);
  }

  async deleteById(id: string | ObjectId) {
    return await this.collection.deleteOne({
      _id: this.getId(id)
    });
  }

  async delete(filter: Filter<T>) {
    return await this.collection.deleteOne(filter);
  }

  async count(filter: Filter<any> = {}) {
    return await this.collection.countDocuments(filter);
  }
}
