import { FindManyOptions, FindOneOptions, Repository } from 'typeorm';
import { User } from '@/database/entities';
import { AppDataSource, DatabaseService } from '@/database/typeorm.config';

export class UserRepository {
  private static async ensureInitialized(): Promise<void> {
    if (!AppDataSource.isInitialized) {
      await DatabaseService.initialize();
    }
  }

  private static async getRepository(): Promise<Repository<User>> {
    await this.ensureInitialized();
    return AppDataSource.getRepository(User);
  }

  static async find(options?: FindManyOptions<User>): Promise<User[]> {
    return await (await this.getRepository()).find(options);
  }

  static async findOne(options: FindOneOptions<User>): Promise<User | null> {
    return await (await this.getRepository()).findOne(options);
  }

  static async save(user: User | Partial<User>): Promise<User> {
    return await (await this.getRepository()).save(user);
  }

  static async insert(userData: Omit<User, 'id'>): Promise<any> {
    return await (await this.getRepository()).insert(userData);
  }

  static async update(
    criteria: any,
    partialEntity: Partial<User>,
  ): Promise<any> {
    return await (await this.getRepository()).update(criteria, partialEntity);
  }

  static async delete(criteria: any): Promise<any> {
    return await (await this.getRepository()).delete(criteria);
  }

  static async count(options?: FindManyOptions<User>): Promise<number> {
    return await (await this.getRepository()).count(options);
  }

  static async createQueryBuilder(alias?: string) {
    return (await this.getRepository()).createQueryBuilder(alias);
  }
}
