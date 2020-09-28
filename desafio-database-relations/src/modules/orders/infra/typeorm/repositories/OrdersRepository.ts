import { getRepository, Repository } from 'typeorm';

import IOrdersRepository from '@modules/orders/repositories/IOrdersRepository';
import ICreateOrderDTO from '@modules/orders/dtos/ICreateOrderDTO';
import Order from '../entities/Order';

class OrdersRepository implements IOrdersRepository {
  private ormRepository: Repository<Order>;

  constructor() {
    this.ormRepository = getRepository(Order);
  }

  public async create({ customer, products }: ICreateOrderDTO): Promise<Order> {
    const order = new Order();

    Object.assign(order, { customer, products });

    const newOrder = this.ormRepository.create(order);

    await this.ormRepository.save(newOrder);

    return newOrder;
  }

  public async findById(id: string): Promise<Order | undefined> {
    return await this.ormRepository.findOne({
      where: {
        id: id
      }
    });
  }
}

export default OrdersRepository;
