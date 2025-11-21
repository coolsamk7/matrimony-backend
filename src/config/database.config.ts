import { registerAs } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { User } from '@common/database/entities/user.entity';
import { UserProfile } from '@common/database/entities/user-profile.entity';
import { ContactInfo } from '@common/database/entities/contact-info.entity';
import { Education } from '@common/database/entities/education.entity';
import { UsersFamily } from '@common/database/entities/users-family.entity';
import { ReligionInfo } from '@common/database/entities/religion-info.entity';
import { Patrika } from '@common/database/entities/patrika.entity';
import { UserPreferences } from '@common/database/entities/user-preferences.entity';
import { ProfileVisited } from '@common/database/entities/profile-visited.entity';
import { UserBlockedProfile } from '@common/database/entities/user-blocked-profile.entity';

export default registerAs(
  'database',
  (): TypeOrmModuleOptions => ({
    type: 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT, 10) || 5432,
    username: process.env.DB_USERNAME || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
    database: process.env.DB_DATABASE || 'matrimony_db',
    entities: [
      User,
      UserProfile,
      ContactInfo,
      Education,
      UsersFamily,
      ReligionInfo,
      Patrika,
      UserPreferences,
      ProfileVisited,
      UserBlockedProfile,
    ],
    synchronize: process.env.NODE_ENV !== 'production',
    logging: process.env.NODE_ENV === 'development',
    ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false,
  }),
);
