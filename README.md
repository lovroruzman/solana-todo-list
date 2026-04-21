# **Solana Decentralized To-Do Application (dApp)**

This project is a functional Web3 task management application built on the **Solana** blockchain. Unlike traditional Web2 solutions that store user data on centralized servers, this system ensures full data ownership and censorship resistance for the user.

![Project Hero](./solana%20to-do%20list%20hero.png)


## **Project Overview**

Traditional applications rely on service providers that can delete, censor, or lose data. This solution leverages:

* **Immutability:** The application logic (Smart Contract) is publicly visible and immutable once deployed to the network.  
* **Ownership:** Every task is cryptographically linked exclusively to the user's wallet.  
* **Scalability:** Thanks to the **Proof of History (PoH)** mechanism, transactions are nearly instantaneous with minimal fees (approx. $0.00025).

## **Tech Stack**

* **Backend:** Rust & Anchor Framework for writing secure and robust smart contracts.  
* **Frontend:** Next.js (React) framework for building a modern, fast user interface.  
* **Blockchain Integration:** Solana Web3.js & Wallet Adapter libraries.  
* **Authentication:** Phantom Wallet for user identification and transaction signing.

## **Architecture (Solana Account Model)**

This project applies a specific model where program logic is strictly separated from data storage:

1. **Program (Stateless):** The smart contract written in Rust, which serves as the executable code.  
2. **Data Accounts (Stateful):** Every task is a separate "Account" on the blockchain storing the description, completion status (is\_done), and owner.  
3. **Rent:** A small amount of SOL required to keep the data account active on the network.

## **How to run the project locally?**

### **1\. Start the Validator**

Run a local Solana node in a separate terminal:
```bash
solana-test-validator
```

### **2\. Build and Deploy the Program**

Compile the Rust code and deploy it to the local network:
```bash
anchor build  
anchor deploy
```


### **3\. Start the Frontend**

Navigate to the app directory, install dependencies, and start the development server:
```bash
cd app  
yarn install  
yarn dev
```
*This project was developed as part of a seminar paper titled "Development of a Decentralized To-Do Application on the Solana Blockchain". For a detailed technical analysis, please refer to the attached PDF: **Solana To-Do list.pdf**.*
