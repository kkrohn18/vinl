import { useFieldArray, useForm } from "react-hook-form";

import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import InputAdornment from '@mui/material/InputAdornment';

import AddIcon from '@mui/icons-material/Add';
import Fab from '@mui/material/Fab';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import OutlinedInput from '@mui/material/OutlinedInput';
import Select from '@mui/material/Select';
import React, { useEffect, useState } from 'react';
import Account from "../models/Account";
import Transaction from '../models/Transaction';
import { getAccounts } from '../services/Accounts';
import { TransactionFormValues } from '../services/Transactions';
import { Autocomplete, TextField } from "@mui/material";

const fabStyle = {
    position: 'fixed',
    bottom: 80,
    right: 30,
};

let today: Date = new Date();
let dd: string = String(today.getDate()).padStart(2, '0');
let mm: string = String(today.getMonth() + 1).padStart(2, '0');
let yyyy: string = String(today.getFullYear());

let todayDate: string = yyyy + "/" + mm + "/" + dd;

type Props = {
    saveTransaction: (formData: Transaction | any) => void
}

const FormDialog: React.FC<Props> = ({ saveTransaction }) => {
    const [open, setOpen] = React.useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const {
        register,
        control,
        handleSubmit,
        formState: { errors }
    } = useForm<TransactionFormValues>({
        defaultValues: {
            //postings: [{ name: "test", amount: "20.00", comment: "test" }]
        },
        mode: "onBlur"
    });
    const { fields, append, remove } = useFieldArray({
        name: "postings",
        control
    });

    const onSubmit = (data: TransactionFormValues) => {
        saveTransaction(data)
        handleClose();
    }

    const [accounts, setAccounts] = useState<Account[]>([])
    useEffect(() => {
        getAccounts().then((response) => {
            setAccounts(response);
        })
    }, [])

    return (
        <div>
            <Fab sx={fabStyle} color="primary" aria-label="add" onClick={handleClickOpen}>
                <AddIcon />
            </Fab>
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Add Transaction</DialogTitle>
                <DialogContent>

                    <form onSubmit={handleSubmit(onSubmit)}>

                        <div>
                            <FormControl fullWidth sx={{ m: 1 }}>
                                <InputLabel htmlFor="outlined-adornment-date">Date</InputLabel>
                                <OutlinedInput
                                    defaultValue={todayDate}
                                    {...register("date")}
                                    id="outlined-adornment-date"
                                    label="Date"
                                />
                            </FormControl>
                            <FormControl fullWidth sx={{ m: 1 }}>
                                <InputLabel htmlFor="outlined-adornment-payee">Payee</InputLabel>
                                <OutlinedInput
                                    {...register("payee")}
                                    id="outlined-adornment-payee"
                                    label="Payee"
                                />
                            </FormControl>
                        </div>

                        {fields.map((field, index) => {
                            return (
                                <div key={field.id}>
                                    Posting
                                    <section className={"section"} key={field.id}>
                                        <FormControl fullWidth sx={{ m: 1 }}>
                                            {/* <InputLabel htmlFor="outlined-adornment-name">Name</InputLabel> */}
                                            {/* <Select id="outlined-adornment-name"
                                                label="Name"
                                                {...register(`postings.${index}.account.id` as const, {
                                                    required: true
                                                })}
                                                className={errors?.postings?.[index]?.account?.name ? "error" : ""}
                                                defaultValue={field.account.name}
                                            >
                                                {accounts.map(({ id, name }) => (<MenuItem key={id} value={name}>{name}</MenuItem>))}
                                            </Select>
 */}
                                            {/* <OutlinedInput
                                                id="outlined-adornment-name"
                                                label="Name"
                                                {...register(`postings.${index}.account.name` as const, {
                                                    required: true
                                                })}
                                                className={errors?.postings?.[index]?.account?.name ? "error" : ""}
                                                defaultValue={field.account.name}
                                            /> */}
                                            {/* <Autocomplete
                                                value={accountName}
                                                inputValue={accountName}
                                                freeSolo
                                                onInputChange={(e, v) => {
                                                    setAccountName(v)
                                                    console.log(v)
                                                }}
                                                id="outlined-adornment-name"
                                                options={accounts.map((account) => (account.name))}
                                                renderInput={(params) => <TextField onSubmit={() => console.log('sup')} {...params} label="Name" />}
                                                {...register(`postings.${index}.account.name` as const, {
                                                    required: true,
                                                })}
                                                className={errors?.postings?.[index]?.account?.name ? "error" : ""}
                                                defaultValue={accountName}
                                            /> */}
                                            <input type="text" list="accounts"
                                                {...register(`postings.${index}.account.name` as const, {
                                                    required: true
                                                })}
                                                className={errors?.postings?.[index]?.account?.name ? "error" : ""}
                                                defaultValue={field.account.name}
                                            />
                                            <datalist id="accounts">
                                                {accounts.map(({ id, name }) => (<option key={id} value={name}>{name}</option>))}
                                            </datalist>
                                            {/* {accounts.map(({ id, name }) => (<MenuItem key={id} value={id}>{name}</MenuItem>))}
                                            </Select> */}
                                        </FormControl>
                                        <FormControl fullWidth sx={{ m: 1 }}>
                                            <InputLabel htmlFor="outlined-adornment-amount">Amount</InputLabel>
                                            <OutlinedInput
                                                id="outlined-adornment-amount"
                                                startAdornment={<InputAdornment position="start">$</InputAdornment>}
                                                label="Amount"
                                                type="string"
                                                {...register(`postings.${index}.amount` as const, {
                                                    valueAsNumber: false,
                                                    required: false
                                                })}
                                                className={errors?.postings?.[index]?.amount ? "error" : ""}
                                                defaultValue={field.amount}
                                            />
                                        </FormControl>
                                        <FormControl fullWidth sx={{ m: 1 }}>
                                            <InputLabel htmlFor="outlined-adornment-comment">Comment</InputLabel>
                                            <OutlinedInput
                                                id="outlined-adornment-comment"
                                                label="Comment"
                                                type="string"
                                                {...register(`postings.${index}.comment` as const, {
                                                    valueAsNumber: false,
                                                    required: false
                                                })}
                                                className={errors?.postings?.[index]?.comment ? "error" : ""}
                                                defaultValue={field.comment}
                                            />
                                        </FormControl>
                                        <Button onClick={() => remove(index)}>
                                            Delete
                                        </Button>
                                    </section>
                                </div>
                            );
                        })}

                        <Button
                            onClick={() =>
                                append({
                                    account: {
                                        id: "",
                                        name: "",
                                    },
                                    amount: "",
                                    comment: "",
                                })
                            }
                        >
                            Add Posting
                        </Button>
                    </form>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleSubmit(onSubmit)}>Submit</Button>
                    <Button onClick={handleClose}>Cancel</Button>
                </DialogActions>
            </Dialog>
        </div>);
}

export default FormDialog;
