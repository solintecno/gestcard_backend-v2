import {
  IsOptional,
  IsBoolean,
  IsString,
  IsUUID,
  IsEnum,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { UserRole } from '../../shared/enums';
import { PaginatedResponseDto } from '../../common/dto/pagination.dto';

export class GetAdminsQueryDto {
  @ApiPropertyOptional({ description: 'Filter by active status' })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiPropertyOptional({ description: 'Search by email or name' })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({ description: 'Page number', default: 1 })
  @IsOptional()
  page?: number = 1;

  @ApiPropertyOptional({ description: 'Items per page', default: 10 })
  @IsOptional()
  limit?: number = 10;

  @ApiPropertyOptional({
    description: 'Filter by user role',
    enum: UserRole,
    default: UserRole.ADMIN,
  })
  @IsOptional()
  @IsEnum(UserRole)
  role: UserRole = UserRole.ADMIN;
}

export class UpdateAdminStatusDto {
  @ApiPropertyOptional({ description: 'Active status' })
  @IsBoolean()
  isActive: boolean;
}

export class PromoteToAdminDto {
  @ApiPropertyOptional({ description: 'User ID to promote to admin' })
  @IsUUID()
  userId: string;
}

export class AdminResponseDto {
  @ApiProperty({ description: 'Admin ID' })
  id: string;

  @ApiProperty({ description: 'Email address' })
  email: string;

  @ApiProperty({ description: 'User role', enum: UserRole })
  role: UserRole;

  @ApiProperty({ description: 'Is active' })
  isActive: boolean;

  @ApiProperty({ description: 'Profile picture URL', required: false })
  profilePicture?: string;

  @ApiProperty({ description: 'Candidate name', required: false })
  candidateName?: string;

  @ApiProperty({ description: 'Creation date' })
  createdAt: Date;

  @ApiProperty({ description: 'Last update date' })
  updatedAt: Date;
}

export class PaginatedAdminsResponseDto extends PaginatedResponseDto<AdminResponseDto> {}
