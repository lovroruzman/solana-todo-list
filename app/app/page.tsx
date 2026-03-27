"use client";

import { useState, useEffect } from "react";
import { PublicKey } from "@solana/web3.js";
import { Program, AnchorProvider, web3 } from "@coral-xyz/anchor";
import { useAnchorWallet, useConnection } from "@solana/wallet-adapter-react";
import dynamic from "next/dynamic";
import idl from "../utils/solana_todo_list.json"; 

const WalletMultiButtonDynamic = dynamic(
  async () => (await import("@solana/wallet-adapter-react-ui")).WalletMultiButton,
  { ssr: false }
);

const programId = new PublicKey("Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS");

export default function Home() {
  const [tasks, setTasks] = useState<any[]>([]);
  const [inputText, setInputText] = useState("");
  const [editingTask, setEditingTask] = useState<string | null>(null);
  const [editText, setEditText] = useState("");

  const wallet = useAnchorWallet();
  const { connection } = useConnection();

  const getProgram = () => {
    if (!wallet) return null;
    const provider = new AnchorProvider(connection, wallet, { preflightCommitment: "processed" });
    return new Program(idl as any, provider);
  };

  const fetchTasks = async () => {
    const program = getProgram();
    if (program && wallet) {
      try {
        // @ts-ignore
        const allTasks = await program.account.task.all();
        const myTasks = allTasks.filter((t: any) => t.account.author.toBase58() === wallet.publicKey.toBase58());
        myTasks.sort((a: any, b: any) => b.account.createdAt - a.account.createdAt);
        setTasks(myTasks);
      } catch (error) { console.error("Error fetching tasks:", error); }
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [wallet]);

  const addTask = async () => {
    if (!inputText) return;
    const program = getProgram();
    if (!program || !wallet) return;
    try {
      const taskKeypair = web3.Keypair.generate();
      // @ts-ignore
      await program.methods.addTask(inputText)
        .accounts({ task: taskKeypair.publicKey, author: wallet.publicKey, systemProgram: web3.SystemProgram.programId })
        .signers([taskKeypair]).rpc();
      setInputText("");
      fetchTasks();
    } catch (error) { console.error(error); alert("Greška pri dodavanju!"); }
  };

  const toggleDone = async (task: any) => {
    const program = getProgram();
    if (!program || !wallet) return;
    const newStatus = !task.account.isDone;
    // Optimistic update
    setTasks(tasks.map(t => t.publicKey.toString() === task.publicKey.toString() ? { ...t, account: { ...t.account, isDone: newStatus } } : t));
    try {
      // @ts-ignore
      await program.methods.markDone(newStatus)
        .accounts({ task: task.publicKey, author: wallet.publicKey }).rpc();
    } catch (error) { console.error(error); fetchTasks(); } // Revert on error
  };

  const saveEdit = async (taskPublicKey: PublicKey) => {
    const program = getProgram();
    if (!program || !wallet) return;
    try {
      // @ts-ignore
      await program.methods.updateTask(editText)
        .accounts({ task: taskPublicKey, author: wallet.publicKey }).rpc();
      setEditingTask(null);
      fetchTasks();
    } catch (error) { console.error(error); alert("Greška pri spremanju!"); }
  };

  const deleteTask = async (taskPublicKey: PublicKey) => {
    const program = getProgram();
    if (!program || !wallet) return;
    try {
      if(!confirm("Sigurno obriši?")) return;
      // @ts-ignore
      await program.methods.deleteTask()
        .accounts({ task: taskPublicKey, author: wallet.publicKey }).rpc();
      fetchTasks();
    } catch (error) { console.error(error); }
  };

  return (
    <main className="main-container">
      <h1>Solana To-Do List 🚀</h1>
      <div className="wallet-wrapper"><WalletMultiButtonDynamic /></div>
      {!wallet ? ( <p className="text-center text-gray-400">Spoji novčanik za nastavak...</p> ) : (
        <div style={{width: '100%'}}>
          <div style={{display: 'flex', marginBottom: '20px'}}>
            <input type="text" placeholder="Upiši novi zadatak..." value={inputText} onChange={(e) => setInputText(e.target.value)} />
            <button onClick={addTask} className="btn-primary">DODAJ</button>
          </div>
          <div className="task-list">
            {tasks.map((task) => (
              <div key={task.publicKey.toString()} className="task-card" style={{ opacity: task.account.isDone ? 0.6 : 1 }}>
                {editingTask === task.publicKey.toString() ? (
                  <div className="edit-container">
                    <input type="text" value={editText} onChange={(e) => setEditText(e.target.value)} autoFocus />
                    <button onClick={() => saveEdit(task.publicKey)} className="btn-action btn-save">SPREMI</button>
                    <button onClick={() => setEditingTask(null)} className="btn-action btn-cancel">ODUSTANI</button>
                  </div>
                ) : (
                  <>
                    <div className="task-left">
                      <input type="checkbox" checked={task.account.isDone} onChange={() => toggleDone(task)} />
                      <div className="task-content">
                        <span className="task-desc" style={{ textDecoration: task.account.isDone ? 'line-through' : 'none', color: task.account.isDone ? '#86efac' : 'white' }}>{task.account.description}</span>
                        <span className="task-id">ID: {task.publicKey.toString().slice(0, 6)}...</span>
                      </div>
                    </div>
                    <div>
                      <button onClick={() => { setEditingTask(task.publicKey.toString()); setEditText(task.account.description); }} className="btn-action btn-edit">✎</button>
                      <button onClick={() => deleteTask(task.publicKey)} className="btn-action btn-delete">X</button>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </main>
  );
}