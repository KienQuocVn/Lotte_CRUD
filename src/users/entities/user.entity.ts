import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Role } from '../roles/role.enum';

@Schema({ timestamps: true, collection: 'users' })
export default class User extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  phone: string;

  @Prop({ required: true })
  password: string;

  @Prop({ type: [String], enum: Role, default: [Role.User] })
  roles: Role[];
}

export const UserSchema = SchemaFactory.createForClass(User);
