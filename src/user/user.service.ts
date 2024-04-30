import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UserService {
    constructor (
        @InjectModel(User.name) private readonly userModel: Model<User>,
    ) {}

    async findOneByEmail(email: string): Promise<User> {
        return await this.userModel.findOne({ email });
    }

    async findOneById(id: string): Promise<User> {
        return await this.userModel.findById(id);
    }

    async getUserByUsername(username: string): Promise<User> {
        return await this.userModel.findOne({ username });
    }

    async createUser(createUser: CreateUserDto): Promise<User> {
        const { password, username, email } = createUser;
        if (!/\S+@\S+\.\S+/.test(email)) {
            throw new Error('Invalid email format');
        }
        if (password.length < 8) {
            throw new Error('Password must be at least 8 characters long');
        }
        if (!/[A-Z]/.test(password)) {
            throw new Error('Password must contain at least one uppercase letter');
        }
        if (!/[a-z]/.test(password)) {
            throw new Error('Password must contain at least one lowercase letter');
        }
        if (!/\d/.test(password)) {
            throw new Error('Password must contain at least one number');
        }
        if (!/[!@#$%^&*]/.test(password)) {
            throw new Error('Password must contain at least one special character');
        }
        try {
            return await this.userModel.create({ username, email, password });
        } catch (error) {
            console.log(error);
        }
    }

}

