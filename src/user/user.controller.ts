import { Controller, Post, Body } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { ApiCreatedResponse, ApiBadRequestResponse, ApiOperation } from '@nestjs/swagger';

@Controller('user')
export class UserController {
    constructor (private readonly userService: UserService) {}


}
