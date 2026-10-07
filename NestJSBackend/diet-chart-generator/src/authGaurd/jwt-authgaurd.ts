/* eslint-disable @typescript-eslint/no-unsafe-call */
// filepath: /Users/praveenkumargangapuram/Desktop/Projects/studPro/backend/stud-pro/src/auth/jwt-auth.guard.ts
import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}
