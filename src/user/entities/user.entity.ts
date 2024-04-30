import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { hashPassword } from 'utils/pass-hasher';

export type UserDocument = User & Document;

@Schema()
export class User {
    @Prop({ required: true, index: true, unique: true })
    username: string;

    @Prop({ required: true, unique: true })
    email: string;

    @Prop({ default: false })
    admin: boolean;

    @Prop({ required: true })
    password: string;
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.pre('save', async function (next: any) {
    if (!this.isModified('password')) {
        return next();
    }
    this.password = await hashPassword(this.password);
    next();
});