import { Controller, Put, Get, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ProfileService } from './profile.service';
import {
  UpdateUserProfileDto,
  UpdateContactInfoDto,
  UpdateEducationDto,
  UpdateReligionInfoDto,
  UpdateUsersFamilyDto,
  UpdateUserPreferencesDto,
  UpdatePatrikaDto,
} from '@/common/dto';
import { Protected, AuthenticatedUser } from '@/common/decorators';
import { Action } from '@/common/enums';
import { User } from '@/common/database/entities';

@ApiTags('Profile')
@Controller('profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Protected((ability) => ability.can(Action.UPDATE, User))
  @Put('basic-info')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Step 1: Update basic profile information',
    description: 'Update height, weight, blood group, marital status, etc.',
  })
  @ApiResponse({ status: HttpStatus.OK, description: 'Profile updated successfully' })
  async updateBasicInfo(
    @AuthenticatedUser('id') userId: string,
    @Body() dto: UpdateUserProfileDto,
  ) {
    const profile = await this.profileService.updateUserProfile(userId, dto);
    return {
      message: 'Basic profile updated successfully',
      data: profile,
    };
  }

  @Protected((ability) => ability.can(Action.UPDATE, User))
  @Put('contact-info')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Step 2: Update contact information',
    description: 'Update work city, family city, current city, and address',
  })
  @ApiResponse({ status: HttpStatus.OK, description: 'Contact info updated successfully' })
  async updateContactInfo(
    @AuthenticatedUser('id') userId: string,
    @Body() dto: UpdateContactInfoDto,
  ) {
    const contactInfo = await this.profileService.updateContactInfo(userId, dto);
    return {
      message: 'Contact information updated successfully',
      data: contactInfo,
    };
  }

  @Protected((ability) => ability.can(Action.UPDATE, User))
  @Put('education')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Step 3: Update education details',
    description: 'Update degree, university, stream, certifications',
  })
  @ApiResponse({ status: HttpStatus.OK, description: 'Education updated successfully' })
  async updateEducation(@AuthenticatedUser('id') userId: string, @Body() dto: UpdateEducationDto) {
    const education = await this.profileService.updateEducation(userId, dto);
    return {
      message: 'Education details updated successfully',
      data: education,
    };
  }

  @Protected((ability) => ability.can(Action.UPDATE, User))
  @Put('religion-info')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Step 4: Update religion information',
    description: 'Update religion, caste, subcaste, gotra',
  })
  @ApiResponse({ status: HttpStatus.OK, description: 'Religion info updated successfully' })
  async updateReligionInfo(
    @AuthenticatedUser('id') userId: string,
    @Body() dto: UpdateReligionInfoDto,
  ) {
    const religionInfo = await this.profileService.updateReligionInfo(userId, dto);
    return {
      message: 'Religion information updated successfully',
      data: religionInfo,
    };
  }

  @Protected((ability) => ability.can(Action.UPDATE, User))
  @Put('family')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Step 5: Update family information',
    description: 'Update family member details, occupation, contact',
  })
  @ApiResponse({ status: HttpStatus.OK, description: 'Family info updated successfully' })
  async updateFamily(@AuthenticatedUser('id') userId: string, @Body() dto: UpdateUsersFamilyDto) {
    const family = await this.profileService.updateUsersFamily(userId, dto);
    return {
      message: 'Family information updated successfully',
      data: family,
    };
  }

  @Protected((ability) => ability.can(Action.UPDATE, User))
  @Put('preferences')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Step 6 (Optional): Update partner preferences',
    description: 'Update age range, education, occupation, caste preferences',
  })
  @ApiResponse({ status: HttpStatus.OK, description: 'Preferences updated successfully' })
  async updatePreferences(
    @AuthenticatedUser('id') userId: string,
    @Body() dto: UpdateUserPreferencesDto,
  ) {
    const preferences = await this.profileService.updateUserPreferences(userId, dto);
    return {
      message: 'Preferences updated successfully',
      data: preferences,
    };
  }

  @Protected((ability) => ability.can(Action.UPDATE, User))
  @Put('patrika')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Step 7 (Optional): Update patrika/horoscope information',
    description: 'Update rashi, nakshatra, gan, nadi, mangal dosha',
  })
  @ApiResponse({ status: HttpStatus.OK, description: 'Patrika updated successfully' })
  async updatePatrika(@AuthenticatedUser('id') userId: string, @Body() dto: UpdatePatrikaDto) {
    const patrika = await this.profileService.updatePatrika(userId, dto);
    return {
      message: 'Patrika information updated successfully',
      data: patrika,
    };
  }

  @Protected((ability) => ability.can(Action.READ, User))
  @Get('complete')
  @ApiOperation({
    summary: 'Get complete profile information',
    description: 'Retrieve all profile sections in one response',
  })
  @ApiResponse({ status: HttpStatus.OK, description: 'Profile retrieved successfully' })
  async getCompleteProfile(@AuthenticatedUser('id') userId: string) {
    return this.profileService.getCompleteProfile(userId);
  }

  @Protected((ability) => ability.can(Action.READ, User))
  @Get('status')
  @ApiOperation({
    summary: 'Get profile completion status',
    description: 'Check which sections are completed and overall completion percentage',
  })
  @ApiResponse({ status: HttpStatus.OK, description: 'Status retrieved successfully' })
  async getProfileStatus(@AuthenticatedUser('id') userId: string) {
    return this.profileService.getProfileCompletionStatus(userId);
  }
}
