import { Injectable, NotFoundException } from '@nestjs/common';
import { Profile } from './interfaces/profile.interface';

@Injectable()
export class ProfilesService {
  private profiles: Profile[] = [];

  create(profile: Profile): Profile {
    this.profiles.push(profile);
    return profile;
  }

  findByUserId(userId: number): Profile {
    const profile = this.profiles.find((profile) => profile.userId === userId);
    if (!profile) {
      throw new NotFoundException(
        `ユーザーID: ${userId} のプロフィールが見つかりません`,
      );
    }
    return profile;
  }
}
