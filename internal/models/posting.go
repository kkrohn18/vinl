package models

import "github.com/google/uuid"

type Posting struct {
	Id            uuid.UUID `json:"id"`
	TransactionId uuid.UUID	`json:"transactionid"`
	Name          string 	`json:"name"`
	Amount        string 	`json:"amount"`
	Comment		  string 	`json:"comment"`
	IsComment	  bool 		`json:"is_comment"`
}