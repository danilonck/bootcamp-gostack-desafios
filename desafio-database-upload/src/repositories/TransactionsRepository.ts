import { EntityRepository, Repository, getRepository } from 'typeorm';

import Transaction from '../models/Transaction';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

@EntityRepository(Transaction)
class TransactionsRepository extends Repository<Transaction> {
  public async getBalance(): Promise<Balance> {
    const transactionsRepository = getRepository(Transaction);

    const transactions = await transactionsRepository.find();

    const reducer = (accumulator: number, currentValue: number) =>
      accumulator + currentValue;

    const incomesTransactions = transactions.filter(
      transaction => transaction.type === 'income').map((transaction) => {
        return transaction.value;
      });
    const outcomesTransactions = transactions.filter(
      transaction => transaction.type === 'outcome').map((transaction) => {
        return transaction.value;
      });

    let income = 0;
    let outcome = 0;

    if (incomesTransactions.length > 0) {
      income = incomesTransactions.reduce(reducer);
    }

    if (outcomesTransactions.length > 0) {
      outcome = outcomesTransactions.reduce(reducer);
    }

    return {
      income,
      outcome,
      total: income - outcome
    };
  }
}

export default TransactionsRepository;
