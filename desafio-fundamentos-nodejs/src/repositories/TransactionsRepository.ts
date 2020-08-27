import Transaction from '../models/Transaction';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

interface CreateTransaction {
  title: string;
  value: number;
  type: 'income' | 'outcome';
}

class TransactionsRepository {
  private transactions: Transaction[];

  constructor() {
    this.transactions = [];
  }

  public all(): Transaction[] {
    return this.transactions;
  }

  public getBalance(): Balance {
    const reducer = (accumulator: number, currentValue: number) =>
      accumulator + currentValue;

    const incomesTransactions = this.transactions.filter(
      transaction => transaction.type === 'income').map((transaction) => {
        return transaction.value;
      });
    const outcomesTransactions = this.transactions.filter(
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

  public create({ title, value, type }: CreateTransaction): Transaction {
    const transaction = new Transaction({ title, value, type });

    this.transactions.push(transaction);

    return transaction;
  }
}

export default TransactionsRepository;
