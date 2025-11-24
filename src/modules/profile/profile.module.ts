import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProfileController } from './profile.controller';
import { ProfileService } from './profile.service';
import {
  User,
  UserProfile,
  ContactInfo,
  Education,
  ReligionInfo,
  UsersFamily,
  UserPreferences,
  Patrika,
} from '@/common/database/entities';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      UserProfile,
      ContactInfo,
      Education,
      ReligionInfo,
      UsersFamily,
      UserPreferences,
      Patrika,
    ]),
  ],
  controllers: [ProfileController],
  providers: [ProfileService],
  exports: [ProfileService],
})
export class ProfileModule {}
