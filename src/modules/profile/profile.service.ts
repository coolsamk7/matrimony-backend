import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ulid } from 'ulid';
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
import {
  UpdateUserProfileDto,
  UpdateContactInfoDto,
  UpdateEducationDto,
  UpdateReligionInfoDto,
  UpdateUsersFamilyDto,
  UpdateUserPreferencesDto,
  UpdatePatrikaDto,
} from '@/common/dto';

@Injectable()
export class ProfileService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(UserProfile)
    private userProfileRepository: Repository<UserProfile>,
    @InjectRepository(ContactInfo)
    private contactInfoRepository: Repository<ContactInfo>,
    @InjectRepository(Education)
    private educationRepository: Repository<Education>,
    @InjectRepository(ReligionInfo)
    private religionInfoRepository: Repository<ReligionInfo>,
    @InjectRepository(UsersFamily)
    private usersFamilyRepository: Repository<UsersFamily>,
    @InjectRepository(UserPreferences)
    private userPreferencesRepository: Repository<UserPreferences>,
    @InjectRepository(Patrika)
    private patrikaRepository: Repository<Patrika>,
  ) {}

  /**
   * Update user profile (basic info)
   */
  async updateUserProfile(userId: string, dto: UpdateUserProfileDto): Promise<UserProfile> {
    let userProfile = await this.userProfileRepository.findOne({ where: { userId } });

    if (!userProfile) {
      userProfile = this.userProfileRepository.create({
        id: ulid(),
        userId,
        ...dto,
      });
    } else {
      Object.assign(userProfile, dto);
    }

    await this.userProfileRepository.save(userProfile);
    await this.checkAndUpdateProfileCompletion(userId);

    return userProfile;
  }

  /**
   * Update contact information
   */
  async updateContactInfo(userId: string, dto: UpdateContactInfoDto): Promise<ContactInfo> {
    let contactInfo = await this.contactInfoRepository.findOne({ where: { userId } });

    if (!contactInfo) {
      contactInfo = this.contactInfoRepository.create({
        id: ulid(),
        userId,
        ...dto,
      });
    } else {
      Object.assign(contactInfo, dto);
    }

    await this.contactInfoRepository.save(contactInfo);
    await this.checkAndUpdateProfileCompletion(userId);

    return contactInfo;
  }

  /**
   * Update education details
   */
  async updateEducation(userId: string, dto: UpdateEducationDto): Promise<Education> {
    let education = await this.educationRepository.findOne({ where: { userId } });

    if (!education) {
      education = this.educationRepository.create({
        id: ulid(),
        userId,
        ...dto,
      });
    } else {
      Object.assign(education, dto);
    }

    await this.educationRepository.save(education);
    await this.checkAndUpdateProfileCompletion(userId);

    return education;
  }

  /**
   * Update religion information
   */
  async updateReligionInfo(userId: string, dto: UpdateReligionInfoDto): Promise<ReligionInfo> {
    let religionInfo = await this.religionInfoRepository.findOne({ where: { userId } });

    if (!religionInfo) {
      religionInfo = this.religionInfoRepository.create({
        id: ulid(),
        userId,
        ...dto,
      });
    } else {
      Object.assign(religionInfo, dto);
    }

    await this.religionInfoRepository.save(religionInfo);
    await this.checkAndUpdateProfileCompletion(userId);

    return religionInfo;
  }

  /**
   * Update family information
   */
  async updateUsersFamily(userId: string, dto: UpdateUsersFamilyDto): Promise<UsersFamily> {
    let family = await this.usersFamilyRepository.findOne({ where: { userId } });

    if (!family) {
      family = this.usersFamilyRepository.create({
        id: ulid(),
        userId,
        ...dto,
      });
    } else {
      Object.assign(family, dto);
    }

    await this.usersFamilyRepository.save(family);
    await this.checkAndUpdateProfileCompletion(userId);

    return family;
  }

  /**
   * Update user preferences
   */
  async updateUserPreferences(
    userId: string,
    dto: UpdateUserPreferencesDto,
  ): Promise<UserPreferences> {
    let preferences = await this.userPreferencesRepository.findOne({ where: { userId } });

    if (!preferences) {
      preferences = this.userPreferencesRepository.create({
        id: ulid(),
        userId,
        ...dto,
      });
    } else {
      Object.assign(preferences, dto);
    }

    await this.userPreferencesRepository.save(preferences);
    await this.checkAndUpdateProfileCompletion(userId);

    return preferences;
  }

  /**
   * Update patrika (horoscope) information
   */
  async updatePatrika(userId: string, dto: UpdatePatrikaDto): Promise<Patrika> {
    let patrika = await this.patrikaRepository.findOne({ where: { userId } });

    if (!patrika) {
      patrika = this.patrikaRepository.create({
        id: ulid(),
        userId,
        ...dto,
      });
    } else {
      Object.assign(patrika, dto);
    }

    await this.patrikaRepository.save(patrika);
    await this.checkAndUpdateProfileCompletion(userId);

    return patrika;
  }

  /**
   * Get complete profile information
   */
  async getCompleteProfile(userId: string) {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: [
        'profile',
        'contactInfo',
        'education',
        'religionInfo',
        'family',
        'preferences',
        'patrika',
      ],
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return {
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        mobile: user.mobile,
        dateOfBirth: user.dateOfBirth,
        gender: user.gender,
        isProfileComplete: user.isProfileComplete,
        isMobileVerified: user.isMobileVerified,
        isEmailVerified: user.isEmailVerified,
      },
      profile: user.profile,
      contactInfo: user.contactInfo,
      education: user.education,
      religionInfo: user.religionInfo,
      family: user.family,
      preferences: user.preferences,
      patrika: user.patrika,
    };
  }

  /**
   * Get profile completion status
   */
  async getProfileCompletionStatus(userId: string) {
    const profile = await this.userProfileRepository.findOne({ where: { userId } });
    const contactInfo = await this.contactInfoRepository.findOne({ where: { userId } });
    const education = await this.educationRepository.findOne({ where: { userId } });
    const religionInfo = await this.religionInfoRepository.findOne({ where: { userId } });
    const family = await this.usersFamilyRepository.findOne({ where: { userId } });

    return {
      hasProfile: !!profile,
      hasContactInfo: !!contactInfo,
      hasEducation: !!education,
      hasReligionInfo: !!religionInfo,
      hasFamily: !!family,
      completionPercentage: this.calculateCompletionPercentage(
        profile,
        contactInfo,
        education,
        religionInfo,
        family,
      ),
    };
  }

  /**
   * Check if all mandatory sections are filled and update isProfileComplete flag
   */
  private async checkAndUpdateProfileCompletion(userId: string): Promise<void> {
    const profile = await this.userProfileRepository.findOne({ where: { userId } });
    const contactInfo = await this.contactInfoRepository.findOne({ where: { userId } });
    const education = await this.educationRepository.findOne({ where: { userId } });
    const religionInfo = await this.religionInfoRepository.findOne({ where: { userId } });
    const family = await this.usersFamilyRepository.findOne({ where: { userId } });

    // Profile is considered complete if all mandatory sections exist
    const isComplete = !!(profile && contactInfo && education && religionInfo && family);

    await this.userRepository.update({ id: userId }, { isProfileComplete: isComplete });
  }

  /**
   * Calculate profile completion percentage
   */
  private calculateCompletionPercentage(
    profile: UserProfile | null,
    contactInfo: ContactInfo | null,
    education: Education | null,
    religionInfo: ReligionInfo | null,
    family: UsersFamily | null,
  ): number {
    let completed = 0;
    const total = 5; // 5 mandatory sections

    if (profile) completed++;
    if (contactInfo) completed++;
    if (education) completed++;
    if (religionInfo) completed++;
    if (family) completed++;

    return Math.round((completed / total) * 100);
  }
}
