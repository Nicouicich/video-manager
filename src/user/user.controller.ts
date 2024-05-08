import { Controller, Post, Body, Get } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { ApiCreatedResponse, ApiBadRequestResponse, ApiOperation } from '@nestjs/swagger';

@Controller('user')
export class UserController {
    constructor (private readonly userService: UserService) {}

    @Get()
    @ApiOperation({ summary: 'Get ten users' })
    @ApiCreatedResponse({ description: 'The users has been successfully retrieved.' })
    @ApiBadRequestResponse({ description: 'Error while retrieving the users.' })
    async getTenUsers() {
        return await this.userService.getTenUsers();
    }
}
