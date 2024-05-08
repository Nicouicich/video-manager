import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';
import { EmailAlreadyExistsException, UsernameAlreadyExistsException } from 'libs/errors/duplicated-user.error';
import { GeneralUserDto } from './dto/general-users.dto';

@Injectable()
export class UserService {
    constructor(
        @InjectModel(User.name) private readonly userModel: Model<User>,
    ) {}

    async findOneByEmail(email: string): Promise<User> {
        return await this.userModel.findOne({ email }).lean();
    }

    async findOneById(id: string): Promise<User> {
        return await this.userModel.findById(id).lean();
    }

    async getUserByUsername(username: string): Promise<User> {
        return await this.userModel.findOne({ username }).lean();
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
        try {
            const user = new this.userModel({ username, email, password });
            return (await user.save()).toJSON();
        } catch (error) {
            if (error?.code === 11000 && error?.keyPattern?.username === 1)
                throw new UsernameAlreadyExistsException(createUser?.username);

            if (error?.code === 11000 && error?.keyPattern?.email === 1)
                throw new EmailAlreadyExistsException(createUser.email);
        }
    }

    async addVideosToUser(userId: Types.ObjectId, videoIds: Types.ObjectId[]) {
        await this.userModel.updateOne({ _id: userId }, { $push: { videos: { $each: videoIds } } });
    }

    async getTenUsers(): Promise<GeneralUserDto[]> {
        const users = await this.userModel.find().limit(10).lean();
        return users.map(user => new GeneralUserDto(user));
    }

    async removeVideoFromUser(userId: Types.ObjectId, videoId: Types.ObjectId) {
        await this.userModel.updateOne({ _id: userId }, { $pull: { videos: videoId } });
    }
}

