import { Prisma } from '@prisma/client';
import {
  BadRequestException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';

export function handleError(error: any): never {
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    // Handle known errors from Prisma
    switch (error.code) {
      case 'P2002':
        throw new BadRequestException('Duplicate entry');
      case 'P2025':
        throw new NotFoundException('Record not found');
      default:
        throw new BadRequestException(error.message);
    }
  } else if (error instanceof Prisma.PrismaClientUnknownRequestError) {
    throw new InternalServerErrorException('An unknown error occurred');
  } else {
    throw new InternalServerErrorException('An unexpected error occurred');
  }
}
