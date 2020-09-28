import { inject, injectable } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import IProductsRepository from '@modules/products/repositories/IProductsRepository';
import ICustomersRepository from '@modules/customers/repositories/ICustomersRepository';
import Order from '../infra/typeorm/entities/Order';
import IOrdersRepository from '../repositories/IOrdersRepository';

interface IProduct {
  id: string;
  quantity: number;
}

interface IRequest {
  customer_id: string;
  products: IProduct[];
}

@injectable()
class CreateOrderService {
  constructor(
    @inject('OrdersRepository')
    private ordersRepository: IOrdersRepository,

    @inject('ProductsRepository')
    private productsRepository: IProductsRepository,

    @inject('CustomersRepository')
    private customersRepository: ICustomersRepository,
  ) { }

  public async execute({ customer_id, products }: IRequest): Promise<Order> {
    const customer = await this.customersRepository.findById(customer_id);

    if (!customer) {
      throw new AppError('Customer not found');
    }

    const productIds = products.map(product => {
      return { id: product.id };
    });

    const productsPrices = await this.productsRepository.findAllById(productIds);

    const orderedProducts = products.map(product => {
      const price = productsPrices.find(prices => prices.id === product.id)?.price

      return {
        product_id: product.id,
        price: Number(price),
        quantity: product.quantity
      }
    })

    const order = await this.ordersRepository.create({
      customer,
      products: orderedProducts
    })

    return order;
  }
}

export default CreateOrderService;
