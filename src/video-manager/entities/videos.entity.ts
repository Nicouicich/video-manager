import { Document, Types } from 'mongoose';
import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';

export type VideoDocument = Video & Document;

@Schema()
export class Video {
    @Prop({ required: true, index: true, unique: true })
    title: string;
    @Prop()
    description: string;
    @Prop({ default: 0 })
    views: number;
    @Prop({ default: Date.now })
    createdAt: Date;
    @Prop({ type: Types.ObjectId, ref: 'User', required: true })
    userId: Types.ObjectId;
    @Prop()
    size: number;
    @Prop()
    mimetype: string;
    @Prop()
    duration: number;

    constructor(title: string, description: string, userId: Types.ObjectId, size: number, mimetype: string, duration: number) {
        this.title = title;
        this.description = description;
        this.userId = userId;
        this.size = size;
        this.mimetype = mimetype;
        this.duration = duration;
    }
}

export const VideoSchema = SchemaFactory.createForClass(Video);