import { IsOptional, IsBoolean, IsString, IsUUID } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { UserRole } from '../../shared/enums';

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
  id: string;
  email: string;
  role: UserRole;
  isActive: boolean;
  profilePicture?: string;
  candidateName?: string;
  createdAt: Date;
  updatedAt: Date;
}

export class PaginatedAdminsResponseDto {
  data: AdminResponseDto[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
