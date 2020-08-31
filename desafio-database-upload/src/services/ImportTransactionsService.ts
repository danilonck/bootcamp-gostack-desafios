import csvParse from 'csv-parse';
import fs from 'fs';
import Transaction from '../models/Transaction';

import CreateTransactionsService from './CreateTransactionService';

interface CSVTransaction {
  title: string;
  type: 'income' | 'outcome';
  value: number;
  category: string;
}

class ImportTransactionsService {
  async execute(filePath: string): Promise<Transaction[]> {
    const contactsReadStream = fs.createReadStream(filePath);
    const transactionsCreateds: Transaction[] = [];
    const createTransaction = new CreateTransactionsService();

    const parsers = csvParse({
      from_line: 2,

    });

    const parseCSV = contactsReadStream.pipe(parsers);

    const transactions: CSVTransaction[] = [];
    const categories: string[] = [];

    parseCSV.on('data', async line => {
      const [title, type, value, category] = line.map((cell: string) =>
        cell.trim(),
      );

      if (!title || !type || !value) return;

      categories.push(category);

      transactions.push({ title, type, value, category });
    });

    await new Promise(resolve => parseCSV.on('end', resolve));

    for (const transaction of transactions) {
      const created = await createTransaction.execute({
        title: transaction.title,
        type: transaction.type,
        value: transaction.value,
        category: transaction.category });

        transactionsCreateds.push(created);
    }

    return transactionsCreateds;
  }
}

export default ImportTransactionsService;
