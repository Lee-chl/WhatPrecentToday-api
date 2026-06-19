import { ForbiddenException } from '@nestjs/common';

export function checkPermissionRole(userRole: string) {
  if (userRole !== 'ADMIN') {
    throw new ForbiddenException('권한이 없습니다.');
  }
}

export function checkPermission(userRole: string, userid: number, id: number) {
  if (userRole !== 'ADMIN' && userid !== id) {
    throw new ForbiddenException('권한이 없습니다.');
  }
}
