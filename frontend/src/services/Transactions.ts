import Transaction from '../models/Transaction'
import Api from './Api'

//const api:string = 'http://localhost:3000/api/' // TODO extract this from being hard-coded
export async function getTransactions(): Promise<Transaction[]> {
    try {

        const response = await fetch(Api.url + "transactions");
        return await response.json();
    } catch(error) {
        return [];
    }
}

export function deleteTransaction(id: string): Promise<Response> {
    return fetch(Api.url + 'transactions/' + id, {
        method: 'DELETE',
    })
}

export type TransactionFormValues = {
  date: string;
  payee: string;
  payeeComment: string;
  comment: string;
  postings: {
    name: string;
    amount: string;
    comment: string;
    //is_comment: boolean;
  }[];
  isComment: boolean;
};

export async function createTransaction(formData: TransactionFormValues): Promise<Response> {
    const response = await fetch(Api.url +'transactions', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(formData)
    })
    return response;
}
