import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateMenuDto } from './dto/create-menu.dto';
import { UpdateMenuDto } from './dto/update-menu.dto';
import Menu from './entities/menu.entity';

@Injectable()
export class MenuService {
  constructor(@InjectModel(Menu.name) private menuModel: Model<Menu>) {}

  async create(createMenuDto: CreateMenuDto): Promise<Menu> {
    const createdMenu = new this.menuModel(createMenuDto);
    return createdMenu.save();
  }

  async findAll(): Promise<Menu[]> {
    return this.menuModel.find().populate('category').exec();
  }

  async findOne(id: string): Promise<Menu> {
    const menu = await this.menuModel.findById(id).populate('category').exec();
    if (!menu) {
      throw new NotFoundException(`Menu with ID ${id} not found`);
    }
    return menu;
  }

  async update(id: string, updateMenuDto: UpdateMenuDto): Promise<Menu> {
    const updatedMenu = await this.menuModel
      .findByIdAndUpdate(id, updateMenuDto, { new: true })
      .populate('category')
      .exec();
    if (!updatedMenu) {
      throw new NotFoundException(`Menu with ID ${id} not found`);
    }
    return updatedMenu;
  }

  async remove(id: string): Promise<Menu> {
    const deletedMenu = await this.menuModel.findByIdAndDelete(id).exec();

    if (!deletedMenu) {
      throw new NotFoundException(`Menu with ID ${id} not found`);
    }

    return deletedMenu;
  }
}
