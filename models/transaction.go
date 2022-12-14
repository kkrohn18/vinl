package models

import (
	"database/sql"
	"log"

	"github.com/google/uuid"
)

type Transaction struct {
	Id        uuid.UUID `json:"id"`
	Date      string    `json:"date"`
	Payee     string    `json:"payee"`
	PayeeComment string `json:"payee_comment"`
	Comment   string    `json:"comment"` // omitempty
	Accounts  []Account `json:"accounts"`
	IsComment bool      `json:"is_comment"`
}

type Transactions []Transaction

func (t *Transaction) SaveTransaction(db *sql.DB) {
	transactionQuery := "INSERT INTO transactions (date, payee, comment, payee_comment, is_comment) VALUES ($1, $2, $3, $4, $5) RETURNING id"
	//ctx, cancelfunc := context.WithTimeout(context.Background(), 5*time.Second)
	//defer cancelfunc()
	//stmt, err := db.PrepareContext(ctx, transactionQuery)
	//if err != nil {
	//    log.Printf("Error %s when preparing SQL statement", err)
	//    return err
	//}
	//defer stmt.Close()
	//res, err := stmt.ExecContext(ctx, t.Date, t.Payee)
	//if err != nil {
	//    log.Printf("Error %s when inserting row into transactions table", err)
	//    return err
	//}
	//rows, err := res.RowsAffected()
	//if err != nil {
	//    log.Printf("Error %s when finding rows affected", err)
	//    return err
	//}
	var transactionId uuid.UUID
	err := db.QueryRow(transactionQuery, t.Date, t.Payee, t.Comment, t.PayeeComment, t.IsComment).Scan(&transactionId)
	//log.Printf("%d\n", transactionId)
	//log.Printf("%T\n", transactionId)
	//transactionId, err := res.LastInsertId()
	if err != nil {
		log.Printf("Error getting LastInsertId from transaction query result")
	}
	if err != nil {
		log.Printf("Error %s when inserting row into transactions table", err)
		//return err
	}
	for _, account := range t.Accounts {
		//log.Printf("%d: %v", index, account)
		accountQuery := "INSERT INTO accounts (transactionid, name, amount, comment, is_comment) VALUES ($1, $2, $3, $4, $5) RETURNING id"
		var accountId uuid.UUID
		//transactionIdQuery := "SELECT id FROM transactions" // should transaction id's get generated by the go code so I can select the transaction that was just added?
		//_, err = db.Exec(accountQuery, transactionId, account.Name, account.Amount)
		err := db.QueryRow(accountQuery, transactionId, account.Name, account.Amount, account.Comment, account.IsComment).Scan(&accountId)
		if err != nil {
			log.Printf("Error %s when inserting row into accounts table", err)
			//return err
		}

		transactionsAccountsQuery := "INSERT INTO transactions_accounts (transaction_id, account_id) VALUES ($1, $2)"
		_, err = db.Exec(transactionsAccountsQuery, transactionId, accountId)
		if err != nil {
			log.Printf("Error %s when inserting row into transactions_accounts table", err)
		}
	}

	//log.Printf("%d transactions created ", rows)
	//return nil
}

func (ts Transactions) SaveTransactions(db *sql.DB) {
	for _, t := range ts {
		t.SaveTransaction(db)
	}
}

func (t *Transactions) GetTransactions(db *sql.DB) Transactions {
	transactionQuery := "SELECT id, date, payee, comment, payee_comment, is_comment FROM transactions"
	var transactions []Transaction
	transactionRows, err := db.Query(transactionQuery)
	checkError(err)
	defer transactionRows.Close()

	for transactionRows.Next() {
		var id uuid.UUID
		var date string
		var payee string
		var comment string
		var payeeComment string
		var isComment bool
		err = transactionRows.Scan(&id, &date, &payee, &comment, &payeeComment, &isComment)
		checkError(err)

		var accounts []Account
		accountsQuery := "SELECT id, transactionid, name, amount, comment, is_comment FROM accounts WHERE transactionid = $1"
		accountRows, err := db.Query(accountsQuery, id)
		checkError(err)
		defer accountRows.Close()
		for accountRows.Next() {
			var accountId uuid.UUID
			var transactionId uuid.UUID
			var name string
			var amount string
			var comment string
			var isComment bool
			err = accountRows.Scan(&accountId, &transactionId, &name, &amount, &comment, &isComment)
			checkError(err)
			a := Account{
				Id:            accountId,
				TransactionId: transactionId,
				Name:          name,
				Amount:        amount,
				Comment:       comment,
				IsComment:     isComment,
			}
			accounts = append(accounts, a)
		}
		t := Transaction{
			Id:       id,
			Date:     date,
			Payee:    payee,
			Comment:  comment,
			PayeeComment: payeeComment,
			Accounts: accounts,
			IsComment: isComment,
		}
		transactions = append(transactions, t)
	}
	if transactions == nil {
		return Transactions{}
	}
	return transactions
}

func (t *Transaction) GetTransactionById(db *sql.DB, id string) Transaction {
	transactionQuery := "SELECT id, date, payee, comment, payee_comment, is_comment FROM transactions WHERE id = $1"
	transactionRow := db.QueryRow(transactionQuery, id)
	var transactionId uuid.UUID
	var date string
	var payee string
	var comment string
	var payeeComment string
	var isComment bool
	err := transactionRow.Scan(&transactionId, &date, &payee, &comment, &payeeComment, &isComment)
	checkError(err)

	var accounts []Account
	accountsQuery := "SELECT id, transactionid, name, amount, comment, is_comment FROM accounts WHERE transactionid = $1"
	accountRows, err := db.Query(accountsQuery, id)
	checkError(err)
	defer accountRows.Close()
	for accountRows.Next() {
		var accountId uuid.UUID
		var transactionId uuid.UUID
		var name string
		var amount string
		var comment string
		var isComment bool
		err = accountRows.Scan(&accountId, &transactionId, &name, &amount, &comment, &isComment)
		checkError(err)
		a := Account{
			Id:            accountId,
			TransactionId: transactionId,
			Name:          name,
			Amount:        amount,
			Comment:       comment,
			IsComment:     isComment,
		}
		accounts = append(accounts, a)
	}
	t = &Transaction{
		Id:       transactionId,
		Date:     date,
		Payee:    payee,
		Comment:  comment,
		PayeeComment: payeeComment,
		Accounts: accounts,
		IsComment: isComment,
	}
	return *t
}

func checkError(err error) {
	if err != nil {
		log.Printf("%s", err)
	}
}
