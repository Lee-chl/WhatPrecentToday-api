import { ForbiddenException } from '@nestjs/common';

export function checkPermissionRole(userRole: string) {
  if (userRole !== 'ADMIN') {
    throw new ForbiddenException('권한이 없습니다.');
  }
}

// 유저 role 과 id가 본인(userid)와 같은지 확인
export function checkPermission(userRole: string, userid: number, id: number) {
  if (userRole !== 'ADMIN' && userid !== id) {
    throw new ForbiddenException('권한이 없습니다.');
  }
}