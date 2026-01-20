import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { InjectModel } from '@nestjs/mongoose';
import Order, { OrderStatus } from './entities/order.entity';
import { Model } from 'mongoose';

@Injectable()
export class OrderService {
  constructor(@InjectModel(Order.name) private orderModel: Model<Order>) {}

  async create(createOrderDto: CreateOrderDto): Promise<Order> {
    const createdOrder = new this.orderModel({
      ...createOrderDto,
      status: createOrderDto.status || OrderStatus.PENDING,
    });

    return createdOrder.save();
  }

  async findAll(status?: OrderStatus): Promise<Order[]> {
    const filter = status ? { status } : {};

    return this.orderModel
      .find(filter)
      .populate('user', 'name email phone')
      .populate('item')
      .sort({ createdAt: -1 })
      .exec();
  }

  async findByUser(userId: string): Promise<Order[]> {
    return this.orderModel
      .find({ user: userId })
      .populate('user', 'name email phone')
      .populate('item')
      .sort({ createdAt: -1 })
      .exec();
  }

  async findOne(id: string): Promise<Order> {
    const order = await this.orderModel
      .findById(id)
      .populate('user', 'name email phone')
      .populate('item')
      .exec();

    if (!order) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }

    return order;
  }

  async update(id: string, updateOrderDto: UpdateOrderDto): Promise<Order> {
    const updatedOrder = await this.orderModel
      .findByIdAndUpdate(id, updateOrderDto, {
        new: true,
        runValidators: true,
      })
      .populate('user', 'name email phone')
      .populate('item')
      .exec();

    if (!updatedOrder) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }

    return updatedOrder;
  }

  async updateStatus(id: string, status: OrderStatus): Promise<Order> {
    const order = await this.findOne(id);

    if (
      order.status === OrderStatus.DELIVERED ||
      order.status === OrderStatus.CANCELLED
    ) {
      throw new BadRequestException(
        `Cannot update status of ${order.status} order`,
      );
    }

    const updatedOrder = await this.orderModel
      .findByIdAndUpdate(id, { status }, { new: true })
      .populate('user', 'name email phone')
      .populate('item')
      .exec();

    if (!updatedOrder) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }

    return updatedOrder;
  }

  async remove(id: string): Promise<Order> {
    const deletedOrder = await this.orderModel.findByIdAndDelete(id).exec();

    if (!deletedOrder) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }

    return deletedOrder;
  }

  // Additional utility methods
  async getOrderStats(userId?: string) {
    const matchStage = userId ? { user: userId } : {};

    return this.orderModel.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
          totalAmount: { $sum: '$total' },
        },
      },
    ]);
  }
}
