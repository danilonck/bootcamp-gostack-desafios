import { getRepository, getCustomRepository } from 'typeorm';

import AppError from '../errors/AppError';

import Transaction from '../models/Transaction';
import CreateCategoryService from './CreateCategoryService';
import TransactionsRepository from '../repositories/TransactionsRepository';

interface Request {
  title: string;
  value: number;
  type: 'income' | 'outcome';
  category: string;
}

class CreateTransactionService {
  public async execute({ title, value, type, category }: Request): Promise<Transaction> {
    const createCategory = new CreateCategoryService();

    const categoryNew = (await createCategory.execute({ title: category }));

    const transactionsRepository = getRepository(Transaction);
    const customTransactionsRepository = getCustomRepository(TransactionsRepository);

    const balance = await customTransactionsRepository.getBalance();

    if (type === 'outcome' && balance.total <= value){
      throw new AppError('Not have balance', 400);
    }

    const transaction = transactionsRepository.create({
      title,
      value,
      type,
      category_id: categoryNew.id
    });

    const createdTransaction = await transactionsRepository.save(transaction);

    createdTransaction.category = categoryNew;

    return createdTransaction;
  }
}

export default CreateTransactionService;
