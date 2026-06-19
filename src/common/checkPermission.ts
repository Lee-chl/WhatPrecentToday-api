import { ForbiddenException } from '@nestjs/common';

export function checkPermission(userRole: string) {
  if (userRole !== 'ADMIN') {
    throw new ForbiddenException('권한이 없습니다.');
  }
}
