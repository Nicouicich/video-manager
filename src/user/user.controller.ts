import { Controller, Post, Body } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { ApiCreatedResponse, ApiBadRequestResponse, ApiOperation } from '@nestjs/swagger';

@Controller('user')
export class UserController {
    constructor (private readonly userService: UserService) {}

    @ApiCreatedResponse({ description: 'The user has been successfully created.' })
    @ApiBadRequestResponse({ description: 'Bad request.' })
    @Post('create')
    @ApiOperation({ summary: 'Create a new user' })
    createUser(@Body() createUserDto: CreateUserDto) {
        return this.userService.createUser(createUserDto);
    }

}
