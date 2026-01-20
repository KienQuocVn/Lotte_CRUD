import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { InjectModel } from '@nestjs/mongoose';
import Review from './entities/review.entity';
import { Model } from 'mongoose';

@Injectable()
export class ReviewService {
  constructor(@InjectModel(Review.name) private reviewModel: Model<Review>) {}

  async create(createReviewDto: CreateReviewDto): Promise<Review> {
    const createdReview = new this.reviewModel(createReviewDto);
    return createdReview.save();
  }

  async findAll(): Promise<Review[]> {
    return this.reviewModel
      .find()
      .populate('user', 'name email')
      .populate('item')
      .exec();
  }

  async findOne(id: string): Promise<Review> {
    const review = await this.reviewModel
      .findById(id)
      .populate('user', 'name email')
      .populate('item')
      .exec();
    if (!review) {
      throw new NotFoundException(`Review with ID ${id} not found`);
    }
    return review;
  }

  async update(id: string, updateReviewDto: UpdateReviewDto): Promise<Review> {
    const updatedReview = await this.reviewModel
      .findByIdAndUpdate(id, updateReviewDto, { new: true })
      .populate('user', 'name email')
      .populate('item')
      .exec();
    if (!updatedReview) {
      throw new NotFoundException(`Review with ID ${id} not found`);
    }
    return updatedReview;
  }

  async remove(id: string): Promise<Review> {
    const deletedReview = await this.reviewModel.findByIdAndDelete(id).exec();

    if (!deletedReview) {
      throw new NotFoundException(`Review with ID ${id} not found`);
    }

    return deletedReview;
  }
}
